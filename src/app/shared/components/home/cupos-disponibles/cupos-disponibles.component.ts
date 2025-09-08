import { animate, state, style, transition, trigger } from "@angular/animations";
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import {
  DateAdapter, MatDialog,
  MatDialogRef, MatPaginator,
  MatSort, MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material";
import { Router } from "@angular/router";
import { ChoferZona } from "@app/shared/models";
import { CentrosService } from "@app/shared/services";
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';
import { Cupo, CupoDisponible } from "app/shared/models/cupo";
import { Product } from "app/shared/models/product.model";
import { AppAlertService } from "app/shared/services/app-alert/app-alert.service";
import { AppConfirmService } from "app/shared/services/app-confirm/app-confirm.service";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { CcppService } from "app/shared/services/ccpp.service";
import { CentroProductoService } from "app/shared/services/centro-producto.service";
import { MessageService } from "app/shared/services/message.service";
import { NomencladoresService } from "app/shared/services/nomencladores.service";
import { UserService } from "app/shared/services/user.service";
import { Entregador } from "app/views/admin/entregador/entregador.component";
import * as moment from "moment";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";
import { catchError, finalize, tap, map } from 'rxjs/operators';
import { ExelService } from '../../../services/exel.service';
import { AddSolicitudesC3Component } from "../../cupo//cupera3/add-solicitudes-c3/add-solicitudes-c3.component";
import { AddCuposSolicitadosComponent, Producto } from "../../cupo/add-cupos-solicitados/add-cupos-solicitados.component";
import { AddPedidoRapidoComponent } from "../../cupo/add-pedido-rapido/add-pedido-rapido.component";
import { ConfeccionCCPPComponent } from "../../cupo/confeccion-ccpp/confeccion-ccpp.component";
import { PeriodicElement } from "../../cupo/solicitudes-cupo/solicitudes-cupo.component";
import { AddPedidoComponent } from "../add-pedido/add-pedido.component";
import { ExperienciaAcotadaComponent } from "../experiencia-acotada/experiencia-acotada.component";
import { HomeService } from "../home.service";
import { ChofDisponiblesComponent } from "./chof-disponibles/chof-disponibles.component";
import { CupoEntregadorComponent } from "./cupo-entregador/cupo-entregador.component";
import { CuposDisponible, DestinoFilter, OrigenDestino, Transportadora, Origen } from './models/cupos-disponible';
import { CuposDisponiblesService } from "./services/cupos-disponibles.service";
@Component({
  selector: "app-cupos-disponibles",
  templateUrl: "./cupos-disponibles.component.html",
  styleUrls: ["./cupos-disponibles.component.scss"],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es-ES"
    }
  ]
})
export class CuposDisponiblesComponent implements OnInit {
  expandedElement: PeriodicElement;
  cuposDisponibles = [];

  filtrarForm: FormGroup;
  productos: Product[];
  transportadoras: Transportadora[];
  origenDestinos: OrigenDestino[];
  destinos: DestinoFilter[];
  now = moment(new Date()).format("YYYY-MM-DD");
  yesterday = moment(new Date()).clone().subtract(1, 'days').format("YYYY-MM-DD");
  // tomorrow = moment(new Date()).clone().add(1, 'days').format("YYYY-MM-DD");

  hoy = new Date();
  seleccionados = [];
  isCustomizerOpen2: boolean = false;
  public getItemSub: Subscription;
  //dataSource: any;
  dataSource: CupoDataSource;
  displayedColumns: string[] = [
    "copiar",
    "idCupoTerminal",
    "planta_origen",
    "destino",
    "producto",
    "dador",
    "transportadora",
    "chofer",
    "acciones",
    "pedido",
  ];
  filtros_especiales = [{ id: 1, tipo: "Vencidos" }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Cupos Disponibles</span>
      </div>
    `
  };
  selectCupoPedido: CupoDisponible[] = [];
  selectCupoEntregador: CupoDisponible[] = [];
  entregadores: Entregador;
  filtro = {
    id_producto: null,
    fechaCupo: this.now,
    id_origen: null,
    id_transportadora: null,
    id_destino: null,
    idCupoTerminal: "",
    nombreDestino: "",
    nombreProducto: "",
    dadorCuit:
      localStorage.getItem("dador_seleccionado") == null
        ? ""
        : localStorage.getItem("dador_seleccionado"),
    cosecha: "",
    nroContrato: "",
    usado: 0,
    vencido: 0
  };
  filtroV2 = {
    id_producto: "1",
    idCuitDestinatario: "-1",
    idDestino: "",
    destSolic: "",
    zona: "",
    corredor: "",
    contraparte: "",
    producto: "",
    contrato: "",
  };
  public pageSize = 50;
  public totalSize = 0;
  filtroespeciales = [];
  esDadorCupo: string = "";
  esClienteFinal: string = "";
  showTable: boolean = false;
  idCentro = null;
  tipocentro = null;
  habilitarFiltroDador: boolean = true;
  dador_seleccionado: any;
  public dadores: any = [];
  refer: any;
  subscription: Subscription;
  message: any;
  isFilter: boolean = false;
  array_exp = [];

  allchoferes: ChoferZona[];
  cantDisponible: number = 0;
  cantCuposDisponible: number = 0;
  allCupos: CupoDisponible[] = [];

  is_origen_planta: any;
  constructor(
    private homeService: HomeService,
    private ccppService: CcppService,
    private nomencladoresService: NomencladoresService,
    private dialog: MatDialog,
    private errorService: AppErrorService,
    private confirmService: AppConfirmService,
    private alertService: AppAlertService,
    private loader: AppLoaderService,
    public router: Router,
    private excelService: ExelService,
    private messageService: MessageService,
    private userService: UserService,
    private cuposDisponiblesServices: CuposDisponiblesService,
    private centroProductoService: CentroProductoService,
    private centrosService: CentrosService,
    private cd: ChangeDetectorRef
  ) {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.message = message;
      let selected = {
        opcion: "",
        value: "",
      }
      switch (this.message.text) {
        case 'CambioDadorSeleccionado':
          this.dador_seleccionado = localStorage.getItem('dador_seleccionado');
          selected.opcion="dadorCuit";
          if (this.dador_seleccionado == 0) {
            selected.value="";
            this.aplicarFiltro(selected);
          } else {
            selected.value=this.dador_seleccionado;
            this.filtro.dadorCuit = this.dador_seleccionado;
            this.aplicarFiltro(selected);
          }
          break;
        default:
          break;
      }
    });

  }

   ngOnInit() {
     this.initFilters();
    // this.yesterday.setDate(this.hoy.getDate() - 1);
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
      .subscribe(data => this.idCentro = data.data);

    let ahora = this.now;
    this.getItems();
  }

   async initFilters() {
     let fecha = this.homeService.formatoFecha(new Date(),
      "amd",
      "-");
    await this.getItemsProductos();
     console.log(this.productos);
     this.getTransportadoras();
     this.getOriginDestinos(fecha,null);
     this.getDestinos(fecha,null);
  }

  async getItemsProductos() {
     await this.centroProductoService.getCentroProducto().toPromise().then((productos) => {
      this.productos = [{
        id: '0',
        descripcion: 'Todos'
      }];
      productos.data.map((producto) => this.productos.push(producto));
    });
  }

   getTransportadoras() {
     this.cuposDisponiblesServices.getTransportadoras().toPromise().then(
      respTransportadoras => {
        this.transportadoras = [{
          id: 0,
          id_usuario: "",
          cuit:   "",
          nombre_intermediario: "Todos"
        }];
        respTransportadoras.map((transportadora => this.transportadoras.push(transportadora)));
      }
    )
  }

   getOriginDestinos(fecha,id_producto) {
     this.cuposDisponiblesServices.getOrigenDestinos(fecha,id_producto).toPromise().then(
      respOrigenDestinos => {
        this.origenDestinos = [{
          id_origen: "0",
          descripcion: "Todos"
        }];
        respOrigenDestinos.map((origenDestinos=> this.origenDestinos.push(origenDestinos)));
      }
    )
  }

   async getDestinos(fecha,id_producto) {
    await this.cuposDisponiblesServices.getDestinos(fecha,id_producto).toPromise().then(
      respDestinos => {
        this.destinos = [{
          id_destino: '0',
          descripcion: "Todos"
        }];
        respDestinos.map((destino=> this.destinos.push(destino)));
      }
    )
  }

  copyTextToClipboard(text) {
    const txtArea = document.createElement("textarea");
    txtArea.id = 'txt';
    txtArea.style.position = 'fixed';
    txtArea.style.top = '0';
    txtArea.style.left = '0';
    txtArea.style.opacity = '0';
    txtArea.value = text;
    document.body.appendChild(txtArea);
    txtArea.select();
    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      if (successful) {
        return true;
      }
    } catch (err) {
    } finally {
      document.body.removeChild(txtArea);
    }
    return false;
  }

    getItems() {
    this.showTable = true;
    this.dataSource = new CupoDataSource(this.homeService, this.loader);
    this.loader.close();
    this.dataSource.loadCuposDisponibles(
      this.filtro,
      this.paginator.pageIndex,
      this.pageSize,
      this.selectCupoPedido,
      this.selectCupoEntregador
    );

    this.obtenerCuposDisponibles();

    this.paginator._intl.itemsPerPageLabel = "Cupos por Página";
    this.paginator._intl.nextPageLabel = "Siguiente";
    this.paginator._intl.firstPageLabel = "Primero";
    this.paginator._intl.lastPageLabel = "Último Cupo";
    this.paginator._intl.previousPageLabel = "Anterior";
  }

  async aplicarFiltro(event) {
    this.selectCupoPedido = [];
    if (event === "limpiar" || undefined) {
      this.limpiarFiltros();
    } else {
      switch (event.opcion) {
        case "fechaCupo":
          this.filtro.fechaCupo = this.homeService.formatoFecha(
            event.value,
            "amd",
            "-"
          );
        await  this.getDestinos(this.filtro.fechaCupo,this.filtro.id_producto);
        await  this.getOriginDestinos(this.filtro.fechaCupo,this.filtro.id_producto);
        this.filtro.id_destino= null;
        this.filtro.id_origen= null;
          break;
        case "id_producto":
          this.filtro.id_producto = event.value;
          break;
        case "idCupoTerminal":
          this.filtro.idCupoTerminal = event.value;
          break;
        case "nombreDestino":
          this.filtro.nombreDestino = event.value;
          break;
        case "nombreProducto":
          this.filtro.nombreProducto = event.value;
          break;
        case "dadorCuit":
          if (this.dador_seleccionado == 0) this.filtro.dadorCuit = "";
          else this.filtro.dadorCuit = event.value;
          break;
        case "cosecha":
          this.filtro.cosecha = event.value;
          break;
        case "nroContrato":
          this.filtro.nroContrato = event.value;
          break;
        case "id_origen":
          this.filtro.id_origen = event.value
          break;
        case "id_transportadora":
          this.filtro.id_transportadora = event.value
          break;
        case "id_destino":
          this.filtro.id_destino = event.value
          break;
      };
    }
    this.isFilter = true;
    this.loadCuposPages();
  }

  async limpiarFiltros() {
    this.filtro.id_producto = null;
    this.filtro.fechaCupo = "";
    this.filtro.idCupoTerminal = "";
    this.filtro.nombreDestino = "";
    this.filtro.nombreProducto = "";
    this.filtro.cosecha = "";
    this.filtro.nroContrato = "";
    this.filtro.usado = 0;
    this.filtro.vencido = 0;
    this.filtro.fechaCupo = this.now;
    this.filtro.id_origen = null;
    this.filtro.id_destino = null;
    this.filtro.id_transportadora = null;
    await  this.getDestinos(this.filtro.fechaCupo,this.filtro.id_producto);
    await  this.getOriginDestinos(this.filtro.fechaCupo,this.filtro.id_producto);
    this.loadCuposPages();
  }

  addCupoSolicitados() {
    //Escoger si mostrar de 1.0 o 25
    let title = "";
    const formularioCupera = localStorage.getItem("formularioCupera");
    switch (formularioCupera) {
      case "1":
        let dialogRef: MatDialogRef<any> = this.dialog.open(
          AddCuposSolicitadosComponent,
          {
            width: "720px",
            height: "80vh",
            disableClose: true,
            data: {
              title: title,
              tipo: 0,
              productos: this.productos,
              redirigir: false,
            },
          }
        );
        dialogRef.afterClosed().subscribe((res) => {
          return;
        });
        break;
      case "2":
        let dialogRef2: MatDialogRef<any> = this.dialog.open(
          AddSolicitudesC3Component,
          {
            width: "70vw",
            height: "67vh",
            disableClose: true,
            data: {
              title: title,
              tipo: 0,
              redirigir: false,
              productos: this.productos,
              filtros: this.filtroV2,
            },
          }
        );
        dialogRef2.afterClosed().subscribe((res) => {
          return;
        });
        break;
      case "3":
        let dialogRef3: MatDialogRef<any> = this.dialog.open(
          AddSolicitudesC3Component,
          {
            width: "70vw",
            height: "67vh",
            disableClose: true,
            data: {
              title: title,
              tipo: 0,
              redirigir: false,
              productos: this.productos,
              filtros: this.filtroV2,
            },
          }
        );
        dialogRef3.afterClosed().subscribe((res) => {
          return;
        });
        break;

      default:
        break;
    }
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadCuposPages())).subscribe();
  }

  /**
   * obtiene los cupos disponible
   */
  loadCuposPages() {
    this.is_origen_planta = null;
    this.homeService.changeOrigenPlanta(this.is_origen_planta);

    this.selectCupoPedido = [];
    this.selectCupoEntregador = [];
    this.dataSource.loadCuposDisponibles(
      this.filtro,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize,
      this.selectCupoPedido,
      this.selectCupoEntregador
    );
    this.obtenerCuposDisponibles();
  }

  gotoRefresh() {
    this.is_origen_planta = null;
    this.homeService.changeOrigenPlanta(this.is_origen_planta);

    this.selectCupoPedido = [];
    this.selectCupoEntregador = [];
    this.dataSource.loadCuposDisponibles(
      this.filtro,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize,
      this.selectCupoPedido,
      this.selectCupoEntregador
    );
    this.paginator.page.pipe(tap(() => this.loadCuposPages())).subscribe();

    this.obtenerCuposDisponibles();
  }

  obtenerCuposDisponibles() {
    this.cuposDisponibles = [];
    this.selectCupoEntregador = [];
    this.getItemSub = this.homeService
      .getCuposDisponibles(
        this.filtro,
        this.paginator.pageIndex,
        this.pageSize
      )
      .subscribe(data => {
        this.array_exp = [];
        data.data.forEach(element => {
          this.array_exp.push({ cupo: element.idCupoTerminal });
        });

        this.allCupos = data.data.filter(cupo => cupo.id_pedido == null);

        this.totalSize = data._meta.totalCount;

        let cuposTemp: any[] = data.data.filter(cupo => cupo.id_pedido == null);
        this.cantCuposDisponible = cuposTemp.length;
      });

    this.centrosService.getAllChoferesCentro().subscribe(pagedData => {
      this.allchoferes = pagedData.data.filter(chofer => chofer.estado == "Disponible");
      this.cantDisponible = this.allchoferes.length;
    });
  }
  pageChanged(e: any) {
    //this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    //this.obtenerCuposDisponibles();
  }

  //02-no se esta usado a eliminar
  // getProductosCuposSolicitados(): Product[] {
  //   const productosSolicitud: Product[] = [];
  //   this.centroProductoService.getCentroProducto().subscribe((productos) => {
  //     productos.data.forEach((element: Producto) => {
  //       productosSolicitud.push({
  //         id: element.id ? element.id.toString() : "",
  //         descripcion: element.nombre_producto ? element.nombre_producto : ""
  //       });
  //     });
  //   });
  //   return productosSolicitud;
  // }

  devolverCupo(row) {
    this.confirmService
      .confirm({
        message:
          "¿Está seguro de devolver el cupo: " +
          row.idCupoTerminal +
          " del Dador:" +
          row.nombreDador +
          "  y destino:" +
          row.nombreDestino +
          "?"
      })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.homeService.devolverCupo(row.id_cupo).subscribe(
            data => {
              this.loader.close();
              this.alertService
                .confirm({
                  message: "Cupo devuelto correctamente!",
                  tipo: "exito"
                })
                .subscribe(res1 => {
                  if (res1) {
                    this.gotoRefresh();
                    return;
                  }
                });
            },
            err => {
              this.loader.close();
              this.errorService.confirm({
                message: "Este cupo no se pudo devolver"
              });
            }
          );
        }
      });
  }

  quitar_chofer(cupo:any){
    let data={
      "cupo": cupo.idCupoTerminal
    }
    this.confirmService
    .confirm({
      message:
        "¿Está seguro de quitar el chofer?"
    })
    .subscribe(res => {
      if (res) {
        this.loader.open();
        this.homeService.quitar_chofer(data).subscribe(
          data => {
            this.loader.close();
            this.alertService
              .confirm({
                message: "Chofer quitado correctamente!",
                tipo: "exito"
              })
              .subscribe(res1 => {
                if (res1) {
                  this.gotoRefresh();
                  return;
                }
              });
          },
          err => {
            this.loader.close();
            this.errorService.confirm({
              message: "No se pudo quitar el chofer"
            });
          }
        );
      }
    });
  }

  async pedidoRapido(row, accion) {
    let listCupos = [];
    listCupos.push({
      id: row.id
    });

    try {
      let response = await this.nomencladoresService.getValidateCupo(listCupos, accion).toPromise();
    } catch (error) {
      console.log(error)
      this.messageUpdateText(error["error"].data)
      return false
    }

    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AddPedidoRapidoComponent,
      {
        width: "720px",
        height: "99vh",
        disableClose: true,
        data: {
          cupo: row.id,
          id_destino: row.destino.id,
          dador_turno_destino: row.destino.dador_turno_destino,
          isUpdate: false,
          id_cupo_terminal: "",
          id_origen: row.origen ? Number(row.origen.id) : null,
          origen_descripcion: row.origen ? row.origen.descripcion : null,
          isProveedor: true,
          es_derivacion: row.es_derivacion === '1' ? true : false
        }
      }
    );
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return false;
      }
      this.loadCuposPages();
      return;
    });
  }

  async goUpdatePedido(cupo, accion) {
    let listCupos = [];
    listCupos.push({
      id: cupo.id
    });
  
    try {
      let response = await this.nomencladoresService.getValidateCupo(listCupos, accion).toPromise();
    } catch (error) {
      console.log(error)
      this.messageUpdateText(error["error"].data)
      return false
    }

    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AddPedidoRapidoComponent,
      {
        width: "720px",
        height: " 90vh",
        disableClose: true,
        data: {
          cupo: cupo.id,
          isUpdate: true,
          cuitChofer: cupo.cuitChofer,
          idViaje: cupo.en_viaje,
          id_cupo_terminal: cupo.idCupoTerminal,
          id_origen: Number(cupo.id_origen),
          origen_descripcion: cupo.origen ? cupo.origen.descripcion : null,
          isProveedor: true,
          es_derivacion: cupo.es_derivacion === '1' ? true : false,
          id_destino: cupo.destino.id,
          dador_turno_destino: cupo.destino.dador_turno_destino,
          turno: cupo.id_turno
        }
      }
    );
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return false;
      }
      this.loadCuposPages();
      return;
    });
  }

  confeccionarCCPP(value) {
    this.ccppService
      .getCartaPorte(value.id)
      .subscribe(data => {
        let dialogRef: MatDialogRef<any> = this.dialog.open(
          ConfeccionCCPPComponent,
          {
            width: "90%",
            height: '91vh',
            disableClose: true,
            data: { payload: data.data }

          }
        );
        dialogRef.afterClosed().subscribe(res => {
          if (!res) {
            this.loadCuposPages();
            // If user press cancel
            return;
          }
          this.loadCuposPages();
          return;
        });
      });
  }

  async goRecuperar(cupo, accion) {

    let listCupos = [];
    listCupos.push({
      id: cupo.id
    });

    try {
      let response = await this.nomencladoresService.getValidateCupo(listCupos, accion).toPromise();

      const data = {
        cupos: [parseInt(cupo.id)],
        id_motivo_recuperar: null, motivo_recuperar: null,
        notificacion: 1
      }
      this.confirmService
        .confirm({
          message:
            "¿Está seguro de recuperar el cupo: " +
            cupo.idCupoTerminal +
            "?"
        })
        .subscribe(res => {
          if (res) {
            this.loader.open();
            this.homeService.recuperarCupo(data).subscribe(
              data => {
                this.loader.close();
                this.alertService
                  .confirm({
                    message: "Cupo recuperado correctamente!",
                    tipo: "exito"
                  })
                  .subscribe(res1 => {
                    if (res1) {
                      this.gotoRefresh();
                      return;
                    }
                  });
              },
              err => {
                this.loader.close();
                this.errorService.confirm({
                  message: "Este cupo no se pudo recuperar"
                });
              }
            );
          }
        });

    } catch (error) {
      console.log(error)
      this.messageUpdateText(error["error"].data);
      return false
    }
  }

  liberarCupo(row) {
    this.confirmService
      .confirm({
        message:
          "¿Está seguro de liberar el cupo: " +
          row.idCupoTerminal +
          " del Dador:" +
          row.dadorCuit +
          "  y destino:" +
          row.destino.descripcion +
          "?"
      })
      .subscribe(res => {
        if (res) {
          this.loader.open();

          this.homeService.liberarCupo(row.id_cupo).subscribe(
            data => {
              this.loader.close();
              this.alertService
                .confirm({
                  message: "Cupo liberado correctamente!",
                  tipo: "exito"
                })
                .subscribe(res1 => {
                  if (res1) {
                    this.gotoRefresh();
                    return;
                  }
                });
            },
            err => {
              this.loader.close();
              this.errorService.confirm({
                message: "Este cupo no se pudo liberar"
              });
            }
          );
        }
      });
  }

  verDisponbles() {
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ChofDisponiblesComponent,
      {
        width: "720px",
        disableClose: true,
        data: {
          choferes: this.allchoferes,
          cuposDisponibles: this.cantCuposDisponible,
          choferesDiponibles: this.cantDisponible,
          cupos: this.allCupos
        }
      }
    );
    dialogRef.afterClosed().subscribe(res => {
      this.loadCuposPages();
      this.selectCupoPedido = [];
    });

  }

  messageUpdateText(data) {
    let text = "";
    for (let val of data) {
      text += val.id_cupoEstado === '1' ? `El cupo ${val.id_cupoTerminal} se encuentra ASIGNADO A UN CHOFER. ` + '<br>' : ` `;
      text += val.id_cupoEstado === '2' ? `El cupo ${val.id_cupoTerminal} se encuentra CARGADO. ` + '<br>' : ` `;
      text += val.id_cupoEstado === '3' ? `El cupo ${val.id_cupoTerminal} se encuentra DESCARGADO. ` + '<br>' : ` `;
      text += val.id_cupoEstado === '4' ? `El cupo ${val.id_cupoTerminal} se encuentra RECHAZADO. ` + '<br>' : ` `;
      text += val.id_cupoEstado === '5' ? `El cupo ${val.id_cupoTerminal} se encuentra EN DESTINO. ` + '<br>' : ` `;
    }

    this.confirmService
      .confirm({
        message: text
      }).subscribe(res => {
        this.gotoRefresh();
      });
  }

  async validateCupoEstado(cupo, accion) {
    let listCupos = [];
    listCupos.push({
      id: cupo.id
    });
    try {
      let response = await this.nomencladoresService.getValidateCupo(listCupos, accion).toPromise();
    } catch (error) {
      console.log(error);
      this.messageUpdateText(error["error"].data)
    }
  }

  async accionPedido(accion) {
    try {
      let response = await this.nomencladoresService.getValidateCupo(this.cuposDisponibles, accion).toPromise();
    } catch (error) {
      this.confirmService
      this.messageUpdateText(error["error"].data)
      return false
    }

    if (this.selectCupoPedido.length > 0) {
      if (this.comprobarProducto()) {
        let title = "Agregar Pedido";
        let dialogRef: MatDialogRef<any> = this.dialog.open(
          AddPedidoComponent,
          {
            width: "720px",
            disableClose: true,
            data: { title: title, payload: { cupos: this.selectCupoPedido } }
          }
        );
        dialogRef.afterClosed().subscribe(res => {
          this.loadCuposPages();
          this.selectCupoPedido = [];
          //return;
        });
      } else {
        this.errorService.confirm({
          message:
            /*  "Error! Los cupos " +
            this.selectCupoPedido.length +
            " seleccionados debe tener el mismo producto para poder asociarlo al mismo pedido" */
            "Debe seleccionar cupos del mismo producto"
        });
      }
    }
  }

  accionEntregador() {
    if (this.selectCupoEntregador.length > 0) {
      let dialogRef: MatDialogRef<any> = this.dialog.open(
        CupoEntregadorComponent,
        {
          width: "450px",
          disableClose: true,
          data: { title: "Asociar Entregador" }
        }
      );
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        let id_entregador = res.id_entregador;
        let cantCupo = 1;
        this.selectCupoEntregador.forEach(element => {
          let dat = {
            idCuitRepresentanteEntregador: id_entregador,
            id: element.id
          };
          this.homeService.putCupo(dat).subscribe(
            data => {
              cantCupo++;
              if (cantCupo > this.selectCupoEntregador.length) {
                if (this.loader !== null) {
                  this.loader.close();
                }
                this.alertService
                  .confirm({
                    message: "¡Se asignó entregador a los cupos seleccionados!",
                    tipo: "exito"
                  })
                  .subscribe(res => { });
                this.loadCuposPages();
                return;
              }
              if (data) {
                return;
              }
            },
            err => {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.errorService.confirm({
                message:
                  "Error! No se puede asignar entregador a los cupos seleccionados"
              });
              return;
            }
          );
        });
      });
    }
  }

  onCheckboxChange(chck, cupo, tipo) {
    this.is_origen_planta = (chck.checked && cupo.origen) ? cupo.origen.id : null;
    let bodyCheck = Object.assign({},{
      is_origen_planta: this.is_origen_planta,
      is_act: chck.checked
    })
    this.homeService.changeOrigenPlanta(bodyCheck);
    if (tipo === "pedido") {
      this.selectCupoPedido = this.checkboxChange(
        chck,
        cupo,
        this.selectCupoPedido
      );
    } else {
      this.selectCupoEntregador = this.checkboxChange(
        chck,
        cupo,
        this.selectCupoEntregador
      );
    }
  }

  comprobarProducto() {
    let prod = this.selectCupoPedido[0].id_producto;
    for (let i = 1; i < this.selectCupoPedido.length; i++) {
      if (this.selectCupoPedido[i].id_producto !== prod) {
        return false;
      }
    }
    return true;
  }

  checkboxChange(chck, cupo, ref_Array) {
    if (chck.checked) {
      ref_Array.push(cupo);
      this.cuposDisponibles.push({ id: cupo.id });
    } else {
      let temparray: Cupo[] = [];
      this.cuposDisponibles = [];
      ref_Array.forEach(element => {
        if (element.id !== cupo.id) {
          temparray.push(element);
          this.cuposDisponibles.push({ id: element.id });
        }
      });
      ref_Array = temparray;
    }
    return ref_Array;
  }

  goAsignarViaje(cupo) {
    this.router.navigateByUrl("/panel-pedido/asignarViaje/" + cupo.id_pedido);
    /* this.nomencladoresService.getPedido(cupo.id_pedido).subscribe(data => {
      let pedido = data.data;
      let rol: string = localStorage.getItem("rol");
      let rolDador = false;
      if (rol === "5") {
        rolDador = true;
      }
      let tc = 1;
      if (
        pedido.bloqueado != 1 &&
        pedido.id_centro == this.idCentro &&
        pedido.solicitud == 0 &&
        !rolDador &&
        pedido.cantidad - pedido.viajes_asignados + pedido.reduccion > 0 &&
        pedido.cant_camiones_disponibles + pedido.cant_camiones_premio > 0
      )
        tc = 0;
      if (pedido.camiones_premio)
        localStorage.setItem("camiones_premio", pedido.camiones_premio);

    }); */
  }

  // applicarFiltros(event){
  //   console.log(event);
  // }


  updateFilter2(event) {
    const valores = event.value;
    this.filtro.vencido = 0;
    this.filtroespeciales = valores;
    for (let i = 0; i < valores.length; i++) {
      switch (valores[i]) {
        case 1: // Pendientes por asignar
          this.filtro.vencido = 1;
          // arraytemp = this.conocerPendientesAsignar(arraytemp);
          break;
        /* case 2: // Pedidos en rojo
          this.filtro.pedidos_rojos = 1;
          //  arraytemp = this.conocerPedidosEnRojo(arraytemp);
          break;
        case 3: // En tiempo
          this.filtro.en_tiempo = 1;
          //  arraytemp = this.conocerPedidosEnTiempo(arraytemp);
          break;
        case 4: // Fuera de tiempo
          this.filtro.fuera_tiempo = 1;
          //  arraytemp = this.conocerPedidosFueraTiempo(arraytemp);
          break;
        case 5: // Pedidos cerrados
          this.filtro.pedidos_cerrados = 1;
          break; */
        case 6: // Pedidos en difusion
          this.filtro.vencido = 0;
          break;
      }
    }
    this.loadCuposPages();
  }



  openExperienciaAcotada() {
    this.getItemSub = this.nomencladoresService
      .getAllDadoresByReceptor()
      .subscribe(data => {
        let dadores = data.data;
        if (dadores.length > 0) {
          let title = "Experiencia Acotada";
          let dialogRef: MatDialogRef<any> = this.dialog.open(
            ExperienciaAcotadaComponent,
            {
              width: "420px",
              disableClose: false,
              data: { title: title, payload: dadores }
            }
          );
          dialogRef.afterClosed().subscribe(res => {
            if (res === undefined || !res) {
              this.openExperienciaAcotada();
              return;
            }
            this.filtro.dadorCuit = res.cuit;
            let selectDador = {
              nombre_persona: res.nombre_persona,
              cuit: res.cuit,
              id: res.id
            };
            this.dadores = [selectDador];
            this.filtrarForm.controls["selectedDador"].setValue(
              this.filtro.dadorCuit
            );
            this.habilitarFiltroDador = false;
            this.getItems();
          });
        } else {
          this.filtro.dadorCuit = "XXXXXXXXXXX";
          let selectDador = {
            nombre_persona: this.filtro.dadorCuit,
            cuit: this.filtro.dadorCuit,
            id: 0
          };
          localStorage.setItem("select_dador_id", "0");
          localStorage.setItem("select_dador_cuit", this.filtro.dadorCuit);
          localStorage.setItem(
            "select_dador_nombre_persona",
            this.filtro.dadorCuit
          );
          this.dadores = [selectDador];
          this.filtrarForm.controls["selectedDador"].setValue(
            this.filtro.dadorCuit
          );
          this.habilitarFiltroDador = false;
          this.getItems();
        }
      });
  }

  cargarDadores() {
    this.nomencladoresService.getAllDadoresByReceptor().subscribe(data => {
      let selectDador = {
        nombre_persona: "Todos",
        cuit: "",
        id: 0
      };
      this.dadores = [selectDador];
      data.data.forEach(element => {
        this.dadores.push(element);
      });
      this.filtro.dadorCuit = "";
    });
  }

  exportarCupos() {
    if (this.isFilter) {
      if (this.array_exp.length > 0) {
        this.excelService.exportAsExcelFile(this.array_exp, "Listado de cupos");
      } else {
        this.errorService.confirm({
          message:
            "No se existen cupos disponibles a exportar"
        });
      }
    } else {
      this.array_exp = [];
      this.homeService.getCuposAExportar()
        .subscribe(cupos => {
          if (cupos.data) {
            cupos.data.forEach(element => {
              this.array_exp.push({ cupo: element.idCupoTerminal });
            });
            this.excelService.exportAsExcelFile(this.array_exp, "Listado de cupos");
          } else {
            this.errorService.confirm({
              message:
                "No se existen cupos disponibles a exportar"
            });
          }
        });
    }

  }
  descargarVoucher(cupo) {
    this.excelService.getVoucher(cupo.id).subscribe(image => {
      const url = URL.createObjectURL(new Blob([image]));
      const link = document.createElement('a');
      link.href = url;
      link.download = cupo.nombreChofer + ' - ' + cupo.idCupoTerminal + '.jpeg';
      link.click();
    });
  }
}


export class CupoDataSource implements DataSource<Cupo> {
  private cuposSubject = new BehaviorSubject<Cupo[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  statesCheck = ['3', '4', '5'];

  constructor(
    private homeService: HomeService,
    private loader: AppLoaderService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<Cupo[]> {
    return this.cuposSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.cuposSubject.complete();
    //this.loadingSubject.complete();
  }

  loadCuposDisponibles(
    filter = {},
    pageIndex = 1,
    pageSize = 5,
    arraySelectedCuposPedidos,
    arraySelectedEntregador
  ) {
    this.loadingSubject.next(true);
    //this.loader.open();
    this.homeService
      .getCuposDisponibles(filter, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(cupos => {
        let array = [];
        if (cupos.data) {
          for (let index = 0; index < cupos.data.length; index++) {
            let element: CuposDisponible = { ...cupos.data[index] };
            element.pedido = false;
            element.entregador = false;
            element.transportadora = element.derivacion ? element.derivacion.transportadora : '';
            element.fechaCupoFormateada = this.homeService.formatoFecha(cupos.data[index].fecha, "amd", "-");
            let temCupPedido = arraySelectedCuposPedidos.find(
              item => item.id_cupo === cupos.data[index].id_cupo
            );
            if (temCupPedido) element.pedido = true;
            let temCupEntregador = arraySelectedEntregador.find(
              item => item.id_cupo === cupos.data[index].id_cupo
            );
            if (temCupEntregador) element.entregador = true;
            let stateCupo = this.statesCheck.includes(element.idCupoEstado);

            this.homeService.customisOrigenPlanta.subscribe((response: any) => {
              if (response && response.is_origen_planta) {
                element.is_checkend = !stateCupo && (element.origen && response.is_origen_planta === element.origen.id) ? false : true;
              } else {
                if(response && response.is_act) {
                  element.is_checkend = !stateCupo && (!element.origen) ? false : true;
                } else {
                  element.is_checkend = stateCupo ? true : false;
                }
              }
            });


            array.push(element);
          }
        }
        //this.loader.close();
        this.cuposSubject.next(array);
      });
  }

  
}
