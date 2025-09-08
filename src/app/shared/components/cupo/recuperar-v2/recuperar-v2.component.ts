import { SelectionModel } from "@angular/cdk/collections";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatSort,
  MatTableDataSource,
  PageEvent
} from "@angular/material";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import { CupoRecuperarV2 } from "app/shared/models/cupo";
import {
  DestinatarioV3,
  ItemsBasico,
  ItemsCuit
} from "app/shared/models/v2-demandados";
import { AppAlertService } from "app/shared/services/app-alert/app-alert.service";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { MessageService } from "app/shared/services/message.service";
import { Subscription } from "rxjs";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  SatDatepicker
} from "saturn-datepicker";
import { HomeService } from "../../home/home.service";
import { Corredor } from "../asignacion-v2/models/corredor";
import { AddSolicitudesC3Component } from "../cupera3/add-solicitudes-c3/add-solicitudes-c3.component";
import { CupoService } from "../cupo.service";
import { MotivoRechazoComponent } from "../recuperar/motivo-rechazo/motivo-rechazo.component";
import { AppConfirmService } from "@app/shared/services";

@Component({
  selector: "app-recuperar-v2",
  templateUrl: "./recuperar-v2.component.html",
  styleUrls: ["./recuperar-v2.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MAT_MOMENT_DATE_FORMATS,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es-ES",
    },
  ],
})
export class RecuperarV2Component implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() fechaDesde: string;
  @Input() fechaHasta: string;
  @Input() cupos;
  @Input() detalles;
  @Input() solicitudes;
  @Input() productos;
  @Input() myData;
  @Output() cambiarFechaRecuperar = new EventEmitter();
  @Output() recuperarEvent = new EventEmitter();
  @ViewChild("picker") dateRange: SatDatepicker<any>;

  public getItemSub: Subscription;
  private subscription: Subscription;
  message: any;
  recuperarForm: FormGroup;
  cuposRecuperar: CupoRecuperarV2[] = [];
  filtro = {
    id_producto: "",
    idCuitDestinatario: "-1",
    id_destino: "",
    corredor: "",
    contraparte: "",
    producto: "",
    contrato: "",
  };
  destinatarios: DestinatarioV3[] = [];
  destinatariosApi: DestinatarioV3[] = [];
  destinatariosCon: DestinatarioV3[] = [];
  destinatariosSin: DestinatarioV3[] = [];
  destinos: ItemsCuit[] = [
    {
      id: 0,
      cuit: "",
      descripcion: "Todos",
    },
  ];
  destinosApi: ItemsCuit[] = [];
  corredores: ItemsCuit[] = [];
  contrapartes: ItemsCuit[] = [];
  contratos: ItemsBasico[] = [];
  displayedColumns: string[] = [
    // "corredor",
    "contraparte",
    // "contrato",
    "fecha",
    "idCupoTerminal",
    "select",
  ];
  dataSource = new MatTableDataSource<CupoRecuperarV2>();
  selection = new SelectionModel<CupoRecuperarV2>(true, []);

  disabledDestino = true;
  disabledCorredor = true;
  disabledContraparte = true;
  disabledInputBuscar = true;
  ref: any;
  /* primerDia = "";
  ultimoDia = ""; */
  chancedDate: boolean = true;
  pageEvent: PageEvent = new PageEvent();
  lbCorredor = "";

  constructor(
    private dialog: MatDialog,
    private homeService: HomeService,
    private messageService: MessageService,
    private cupoService: CupoService,
    private alertService: AppAlertService,
    private confirmService: AppConfirmService, 
    private errorService: AppErrorService,
    private loader: AppLoaderService
  ) {
    this.subscription = this.messageService
      .getMessage()
      .subscribe((message) => {
        this.message = message;
        switch (this.message.text) {
          case "RecuperarCupoV3":
            this.cupos = this.message.data.listado;
            this.detalles = this.message.data.detalles;
            this.getData();
            this.chancedDate = false;
            /* this.llenarArrayDia(this.fecha);
             */
            break;
          /* case "productos":
            this.loadProductos(); */
          default:
            break;
        }
      });
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 50;
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Por páginas:";
    this.paginator._intl.nextPageLabel = "Siguiente";
    this.paginator._intl.firstPageLabel = "Primero";
    this.paginator._intl.lastPageLabel = "Último";
    this.paginator._intl.previousPageLabel = "Anterior";
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} de ${length}`;
    };
    /* this.primerDia = moment().weekday(1).format("YYYY-MM-DD");
    this.ultimoDia = moment().weekday(3).format("YYYY-MM-DD"); */
    this.recuperarForm = new FormGroup({
      selectedFecha: new FormControl({
        begin: new Date(this.fechaDesde + " 12:00:00"),
        end: new Date(this.fechaHasta + " 12:00:00"),
      }),
      selectedProducto: new FormControl(this.filtro.id_producto),
      selectedDestinatario: new FormControl(this.filtro.idCuitDestinatario),
      selectedDestino: new FormControl(this.filtro.id_destino),
      selectedCorredor: new FormControl(this.filtro.corredor),
      selectedContraparte: new FormControl(this.filtro.contraparte),
      criterioBusqueda: new FormControl(""),
    });
    if (this.productos.length > 0) {
      let tempProducto = this.productos.find(
        (item) => item.descripcion.toLowerCase() === "soja"
      );
      if (tempProducto) {
        this.recuperarForm.controls["selectedProducto"].setValue(
          tempProducto.id
        );
        this.filtro.id_producto = tempProducto.id.toString();
      } else {
        //this.inicializarProductos();
        this.recuperarForm.controls["selectedProducto"].setValue(
          this.productos[0].id
        );
        this.filtro.id_producto = this.productos[0].id.toString();
      }
    }
    this.inicializarDestinatarios();
    this.recuperarForm.controls["selectedDestinatario"].setValue("0");
    this.inicializarCorredor();
    //Recorrer los cupos Recuerda llenar position
    this.loadLabel();
    this.getData();
  }

  loadLabel() {
    if (this.myData.soyCorredor) {
      this.lbCorredor = "SIN OTRO CORREDOR";
    } else {
      this.lbCorredor = "DIRECTO";
    }
  }

  getData() {
    let posicion = 0;
    let cumplenFiltroCupos: CupoRecuperarV2[] = [];
    let inicialArrayCupos: CupoRecuperarV2[] = [];

    for (let index = 0; index < this.cupos.length; index++) {
      const element = this.cupos[index];
      cumplenFiltroCupos.push(element);
    }
    for (let index = 0; index < cumplenFiltroCupos.length; index++) {
      const element = cumplenFiltroCupos[index];
      let cumple = false;
      if (element.id_producto == this.filtro.id_producto) {
        cumple = true;
        //Agregar los destinatarios y destinos. Si hay cambio de Fecha  otra posibilidad es razon_social: element.nombreDestinatario,
        let destinatarioparams = {
          cuit: element.idCuitDestinatario,
          razon_social: this.detalles.destinatarios[element.idCuitDestinatario]
            .razon_social,
        };
        this.addDestinatario(destinatarioparams);
        if (element.id_destino) {
          let destinoparams = {
            id: element.id_destino,
            cuit: element.id_destino,
            descripcion: this.detalles.destinos[element.id_destino]
              .nombreDestino,
          };
          this.addDestinoCon(element.idCuitDestinatario, destinoparams);
        }
      }
      if (cumple && this.filtro.idCuitDestinatario !== "-1") {
        cumple = false;
        if (
          element.idCuitDestinatario === this.filtro.idCuitDestinatario &&
          element.id_destino === this.filtro.id_destino
        ) {
          cumple = true;
        }
      }
      if (
        cumple &&
        this.recuperarForm.controls["criterioBusqueda"].value != ""
      ) {
        cumple = false;
        let val = element.idCupoTerminal.search(
          this.recuperarForm.controls["criterioBusqueda"].value
        );
        if (val > -1) {
          cumple = true;
        }
      }

      if (cumple) {
        inicialArrayCupos.push(element);
      }
    }

    //if (this.chancedDate && inicialArrayCupos.length > 0) {
    this.inicializarCorredor();
    this.inicializarContraparte();
    //}
    this.cuposRecuperar = [];
    for (let index = 0; index < inicialArrayCupos.length; index++) {
      const element = inicialArrayCupos[index];
      let tempCupo = new CupoRecuperarV2();
      tempCupo.position = posicion;
      tempCupo.id_cupo = element.id_cupo;
      tempCupo.id_producto = element.id_producto;
      tempCupo.receptorCuit = element.receptorCuit;
      let esCorredor = element.receptorCuit
        ? this.detalles.corredor_contraparte[element.receptorCuit].esCorredor ==
          "1"
          ? true
          : false
        : false;
      tempCupo.corredor = esCorredor
        ? this.detalles.corredor_contraparte[element.receptorCuit].razon_social
        : this.lbCorredor;
      tempCupo.corredorCuit = esCorredor ? element.receptorCuit : "00000000000";
      tempCupo.contraparte = esCorredor
        ? element.contraparte
          ? this.detalles.corredor_contraparte[element.contraparte].razon_social
          : ""
        : this.detalles.corredor_contraparte[element.receptorCuit].razon_social;
      tempCupo.contraparteCuit = esCorredor
        ? element.contraparte
          ? element.contraparte
          : "00000000000"
        : element.receptorCuit;
      tempCupo.contrato = element.nroContrato;
      tempCupo.fecha_solicitud = element.fecha_solicitud;
      tempCupo.fecha = element.fecha;
      tempCupo.idCupoTerminal = element.idCupoTerminal;
      tempCupo.seleccionado = false;
      // revisar los filtros
      let cumple = true;
      if (cumple && this.filtro.corredor !== "") {
        cumple = false;
        if (tempCupo.corredor == this.filtro.corredor) {
          cumple = true;
        }
      }
      if (cumple && this.filtro.contraparte !== "") {
        cumple = false;
        if (tempCupo.contraparte == this.filtro.contraparte) {
          cumple = true;
        } else if (
          this.filtro.contraparte == "Sin contraparte asociada" &&
          (!tempCupo.contraparte || tempCupo.contraparte == "")
        ) {
          cumple = true;
        }
      }
      /*  if (cumple && this.filtro.contrato !== "") {
        cumple = false;
        if (element.contrato == this.filtro.contrato) {
          cumple = true;
        } else if (
          this.filtro.contrato == "Sin nominar" &&
          (!element.contrato || element.contrato == "")
        ) {
          cumple = true;
        }
      } */
      if (cumple) {
        posicion++;
        let corredoroparams = {
          cuit: tempCupo.corredorCuit,
          descripcion: tempCupo.corredor,
        };
        this.addCorredor(corredoroparams);
        let contraparteparams = {
          cuit: tempCupo.contraparteCuit,
          descripcion:
            tempCupo.contraparte == ""
              ? "Sin contraparte asociada"
              : tempCupo.contraparte,
        };
        this.addContraparte(contraparteparams);
        this.cuposRecuperar.push(tempCupo);
      }
    }

    if (this.corredores.length > 0) {
      this.disabledCorredor = false;
      this.ordenarCorredor();
    } else {
      this.disabledCorredor = true;
    }
    if (this.contrapartes.length > 0) {
      this.ordenarContraparte();
      this.disabledContraparte = false;
    } else {
      this.disabledContraparte = true;
    }
    //Mover los Select
    if (this.filtro.idCuitDestinatario !== "-1") {
      let tempDestinatario = this.destinatarios.find(
        (item) => item.cuit === this.filtro.idCuitDestinatario
      );
      if (tempDestinatario)
        this.recuperarForm.controls["selectedDestinatario"].setValue(
          tempDestinatario.id
        );
    } else {
      this.recuperarForm.controls["selectedDestinatario"].setValue(
        this.destinatarios[0].id
      );
    }
    if (this.filtro.corredor == "") {
      if (this.corredores.length > 0) {
        this.recuperarForm.controls["selectedCorredor"].setValue(
          this.corredores[0].id
        );
      }
    } else {
      let tempCorr = this.corredores.find(
        (item) => item.descripcion === this.filtro.corredor
      );
      if (tempCorr) {
        this.recuperarForm.controls["selectedCorredor"].setValue(tempCorr.id);
      }
    }
    if (this.filtro.contraparte == "") {
      if (this.contrapartes.length > 0) {
        this.recuperarForm.controls["selectedContraparte"].setValue(
          this.contrapartes[0].id
        );
      }
    } else {
      let tempContra = this.contrapartes.find(
        (item) => item.descripcion === this.filtro.contraparte
      );
      if (tempContra) {
        this.recuperarForm.controls["selectedContraparte"].setValue(
          tempContra.id
        );
      }
    }
    this.dataSource.data = this.cuposRecuperar;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: CupoRecuperarV2): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row.position + 1
      }`;
  }

  inicializarDestinatarios() {
    this.destinatarios = [];
    this.destinatarios.push({
      id: "-1",
      cuit: "-1",
      razon_social: "Todos",
      destinos: [],
      ccpp: [],
      rte: [],
      corredores: [],
      contrapartes: [],
    });
  }
  inicializarCorredor() {
    this.corredores = [];
    this.corredores.push({
      id: 0,
      cuit: "",
      descripcion: "Todos",
    });
  }

  inicializarContraparte() {
    this.contrapartes = [];
  }

  inicializarProductos() {
    this.productos = [];
    this.productos.push({
      id: 1,
      descripcion: "Soja",
    });
  }
  cambioRangoFecha(ref) {
    const start = this.dateRange.beginDate;
    const end = this.dateRange.endDate;
    const daterange = { start: start, end: end };
    let newprimerDia = this.homeService.formatoFecha(start, "amd", "-");
    let newultimoDia = this.homeService.formatoFecha(end, "amd", "-");
    let cambioPrimerDia = newprimerDia !== this.fechaDesde ? true : false;
    let cambioUltimoDia = newultimoDia !== this.fechaHasta ? true : false;
    if (cambioPrimerDia || cambioUltimoDia) {
      this.chancedDate = true;
      this.fechaDesde = newprimerDia;
      this.fechaHasta = newultimoDia;
    } else {
      this.chancedDate = false;
    }
  }
  aplicarFiltroProducto(cmd) {
    this.filtro.id_producto = cmd.value.toString();
    this.inicializarDestinatarios();
    this.inicializarCorredor();
    this.inicializarContraparte();
    //this.inicializarContratos();
    this.filtro.idCuitDestinatario = "-1";
    this.recuperarForm.controls["selectedDestinatario"].setValue(
      this.destinatarios[0].id
    );
    this.aplicarFiltroDestinatario({ value: "-1" });
    this.buscar();
  }
  aplicarFiltroDestinatario(cmd) {
    let tempDestinatario = this.destinatarios.find(
      (item) => item.id === cmd.value
    );
    this.filtro.idCuitDestinatario = tempDestinatario.cuit;
    this.destinos = tempDestinatario.destinos;
    this.ordenarDestinos();
    if (this.destinos.length === 0) {
      this.destinos.push({
        id: 0,
        descripcion: "Sin destino definido",
        cuit: "",
      });
    }
    this.disabledDestino = cmd.value == "-1" ? true : false;
    this.recuperarForm.controls["selectedDestino"].setValue(
      this.destinos[0].id
    );
    this.filtro.id_destino = this.destinos[0].id.toString();
  }
  aplicarFiltroDestino(cmd) {
    let otroDestinatario = this.destinatarios.find(
      (item) => item.cuit === this.filtro.idCuitDestinatario
    );
    let temporalDestino = otroDestinatario.destinos.find(
      (item) => item.id === cmd.value
    );
    this.filtro.id_destino = temporalDestino.id.toString();
  }

  aplicarFiltroCorredor(cmd) {
    this.inicializarContraparte();
    //this.inicializarContratos();

    let selectedCorredor = this.corredores.find(
      (item) => item.id === cmd.value
    );
    this.filtro.corredor = selectedCorredor.descripcion;
    for (let index = 0; index < this.cupos.length; index++) {
      const element = this.cupos[index];
      console.log(
        "this.detalles.corredor_contraparte[element.receptorCuit].razon_social",
        this.detalles.corredor_contraparte[element.receptorCuit].razon_social
      );
      console.log("element.contraparte", element.contraparte);
      console.log("element:", element);
      let esCorredor = element.receptorCuit
        ? this.detalles.corredor_contraparte[element.receptorCuit].esCorredor ==
          "1"
          ? true
          : false
        : false;
      element.corredor = esCorredor
        ? this.detalles.corredor_contraparte[element.receptorCuit].razon_social
        : this.lbCorredor;
      element.corredorCuit = esCorredor ? element.receptorCuit : "00000000000";
      let contra = esCorredor
        ? element.contraparte
          ? this.detalles.corredor_contraparte[element.contraparte].razon_social
          : ""
        : this.detalles.corredor_contraparte[element.receptorCuit].razon_social;
      element.contraparteCuit = esCorredor
        ? element.contraparte
          ? element.contraparte
          : "00000000000"
        : element.receptorCuit;
      let contraparteparams = {
        cuit: element.contraparteCuit,
        descripcion: contra == "" ? "Sin contraparte asociada" : contra,
      };
      if (cmd.value === 0) {
        // Seleccionado todos
        this.filtro.corredor = "";
        if (
          element.corredor &&
          element.id_producto == this.filtro.id_producto
        ) {
          this.addContraparte(contraparteparams);
        }
      } else if (selectedCorredor.descripcion === this.lbCorredor) {
        if (
          element.corredor &&
          element.id_producto == this.filtro.id_producto &&
          element.corredor === selectedCorredor.descripcion
        ) {
          this.addContraparte(contraparteparams);
        }
        //seleccionado todos los DIRECTO O SIN OTRO CORREDOR
      } else {
        //resto es un corredor
        if (
          element.corredor &&
          element.corredorCuit === selectedCorredor.cuit
        ) {
          this.addContraparte(contraparteparams);
        }
      }
    }
    if (this.contrapartes.length > 0) {
      this.ordenarContraparte();
    }

    /* if (this.contratos.length > 0) {
    this.ordenarContratos();
  } */

    this.recuperarForm.controls["selectedContraparte"].setValue(
      this.contrapartes[0].id
    );
    this.filtro.contraparte = "";
    this.filtro.contrato = "";
  }

  aplicarFiltroContraparte(cmd) {
    if (cmd.value === -1) {
      this.filtro.contraparte = "";
    } else {
      let otroContraparte = this.contrapartes.find(
        (item) => item.id === cmd.value
      );
      this.filtro.contraparte = otroContraparte.descripcion;
    }
  }

  addDestinatario(dest) {
    let encontrado = false;
    for (let i = 0; i < this.destinatarios.length; i++) {
      if (this.destinatarios[i].cuit === dest.cuit) {
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      let newDestinatario = new DestinatarioV3();
      newDestinatario.id = (this.destinatarios.length + 1).toString();
      newDestinatario.cuit = dest.cuit;
      newDestinatario.razon_social = dest.razon_social;
      newDestinatario.destinos = [];
      newDestinatario.corredores = [];
      newDestinatario.contrapartes = [];
      this.destinatarios.push(newDestinatario);
    }
  }

  addDestinoCon(idCuitDestinatario, dest) {
    if (idCuitDestinatario !== "") {
      let tempDestinatario = this.destinatarios.find(
        (item) => item.cuit === idCuitDestinatario
      );
      let encontrado = false;
      if (tempDestinatario) {
        for (let i = 0; i < tempDestinatario.destinos.length; i++) {
          if (tempDestinatario.destinos[i].id === parseInt(dest.id)) {
            encontrado = true;
            break;
          }
        }
      }
      if (!encontrado) {
        let newDestino = new ItemsCuit();
        newDestino.id = parseInt(dest.id);
        newDestino.descripcion = dest.descripcion;
        newDestino.cuit = dest.cuit;
        tempDestinatario.destinos.push(newDestino);
      }
      tempDestinatario.destinos.sort((a, b) =>
        a.descripcion.localeCompare(b.descripcion)
      );
    }
  }
  addCorredor(corr) {
    let tempCorredor = this.corredores.find(
      (item) => item.descripcion === corr.descripcion
    );
    if (tempCorredor == undefined) {
      let newCorredor = new Corredor();
      newCorredor.id = this.corredores.length;
      newCorredor.cuit = corr.cuit;
      newCorredor.descripcion = corr.descripcion;
      this.corredores.push(newCorredor);
    }
    this.corredores.shift();
    this.corredores.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
    this.corredores.unshift({
      id: 0,
      cuit: "",
      descripcion: "Todos",
    });
  }

  addContraparte(contra) {
    let encontrado = false;
    for (let i = 0; i < this.contrapartes.length; i++) {
      if (this.contrapartes[i].descripcion === contra.descripcion) {
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      let newContraparte = new ItemsCuit();
      newContraparte.id = this.contrapartes.length + 1;
      newContraparte.cuit = contra.cuit;
      newContraparte.descripcion = contra.descripcion;
      this.contrapartes.push(newContraparte);
    }
  }

  ordenarCorredor() {
    this.corredores.shift();
    this.corredores.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
    this.corredores.unshift({
      id: 0,
      cuit: "",
      descripcion: "Todos",
    });
  }
  ordenarContraparte() {
    let isSinNominar = false;
    let temp = [];
    for (let i = 0; i < this.contrapartes.length; i++) {
      let element = this.contrapartes[i];
      if (element.descripcion === "Sin contraparte asociada") {
        isSinNominar = true;
      } else {
        temp.push(element);
      }
    }
    this.contrapartes = temp;
    this.contrapartes.sort((a, b) =>
      a.descripcion.localeCompare(b.descripcion)
    );
    if (isSinNominar) {
      this.contrapartes.unshift({
        id: 0,
        cuit: "00000000000",
        descripcion: "Sin contraparte asociada",
      });
    }
    this.contrapartes.unshift({
      id: -1,
      cuit: "",
      descripcion: "Todos",
    });
  }
  ordenarDestinos() {
    this.destinos.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
  }

  buscar() {
    if (this.chancedDate) {
      this.cambiarFechaRecuperar.emit({
        fechaDesde: this.fechaDesde,
        fechaHasta: this.fechaHasta,
      });
    } else {
      this.getData();
    }
  }

  recoverAll(){
    let idsCupos = this.dataSource.data.map(cupo => cupo.id_cupo);
    let dialogRef: MatDialogRef<any> = this.dialog.open(MotivoRechazoComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      let id_motivo_recuperar = res.id_motivo_recuperar;
      let motivo_recuperar = res.motivo_recuperar;


      this.confirmService.confirm({message:`Esta seguro de recuperar cantidad de cupo ${this.dataSource.data.length}.`}).subscribe(res=>{
        if(!res)return;
          this.loader.open();
          this.cupoService.recuperarCupos(idsCupos, id_motivo_recuperar, motivo_recuperar).subscribe(
            (res) => {
              this.loader.close();
            this.alertService
            .confirm({
              message: "Cupos recuperados correctamente!",
              tipo: "exito",
            })
            .subscribe((res1) => {
              if (res1) {
                this.recuperarEvent.emit();
                return;
              }
            });
          },
          (err) => {
            this.errorService.confirm({
              message: "Cupos no recuperados, ha ocurrido un error.",
            });
          }
          );
      
      })


    });
  }

  recuperarCupos() {
    let dialogRef: MatDialogRef<any> = this.dialog.open(MotivoRechazoComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
      let cupos = [];
      let id_motivo_recuperar = res.id_motivo_recuperar;
      let motivo_recuperar = res.motivo_recuperar;
      this.selection.selected.forEach((element) => {
        cupos.push(element.id_cupo);
      });
      this.cupoService.recuperarCupos(cupos, id_motivo_recuperar, motivo_recuperar).subscribe(
        (res) => {
          this.alertService
            .confirm({
              message: "Cupos recuperados correctamente!",
              tipo: "exito",
            })
            .subscribe((res1) => {
              if (res1) {
                this.recuperarEvent.emit();
                return;
              }
            });
        },
        (err) => {
          this.errorService.confirm({
            message: "Cupos no recuperados, ha ocurrido un error.",
          });
        }
      );
      return;
    });
  }

  addCupoSolicitados(tipo: number) {
    let title = "Agregar Pedido Cargador";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AddSolicitudesC3Component,
      {
        width: "70vw",
        height: "95vh",
        disableClose: true,
        data: { title: title, tipo: tipo, productos: this.productos },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      return;
    });
  }
}
