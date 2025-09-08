import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import {
  MatTableDataSource,
  MatDialogRef,
  MatDialog,
  MatProgressBar,
  MatButton,
  MatSelect,
  MatSnackBar,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { Observable, Subscription, of } from "rxjs";
import { map, startWith,filter } from "rxjs/operators";
import { AppDateAdapter, APP_DATE_FORMATS } from "@shared/helpers/date.adapter";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import {
  AppAlertService,
  AppLoaderService,
  NomencladoresService,
  OrigenesService,
  DestinosService,
  AppErrorService,
  AppAtencionService,
  MessageService,
  UserService,
} from "@muvin/services";
import {
  Origen,
  ZonaDestino,
  Dador,
  Busqueda,
  Product,
} from "@muvin/models";

import { AddOrigenComponent } from "../add-origen/add-origen.component";
import { CentrosService } from "@shared/services/centros.service";
import { VincularClienteComponent } from "../vincular-cliente/vincular-cliente.component";
import { CondicionesViajeComponent } from "../condiciones-viaje/condiciones-viaje.component";
import { ListaChoferesComponent } from "../lista-choferes/lista-choferes.component";
import { HomeService } from "../home.service";
import { Destino } from "@app/shared/models/destino";

export class IntermediaroAsig {
  id: number;
  intermediario: string;
  cantidad: number;
}

export class Intermed {
  id: number;
  nombre_intermediario: string;
}

export class Operador {
  id: number;
  nombre_persona: string;
}
export class CondicionesViaje {
  id?: number;
  id_pedido?: number;
  condiciones_pago?: string;
  da_gasoil?: number;
  da_efectivo?: number;
  tipo_precio?: number;
  precio_viaje?: number;
  precio_viaje2?: number;
  carga_peligrosa?: number;
  observaciones?: string;
  tipo_acoplado? = [];
  zona_ideal? = [];
  longitud?: number;
  latitud?: number;
  zona_destino?: string;
  selectedTipoDifusion?: number;
  kilometros?: number;
}
export class ConfigCentro {
  horas?: number;
  km?: number;
  condiciones_viaje?: number;
}
let ELEMENT_DATA: IntermediaroAsig[] = [];
@Component({
  selector: "app-add-pedido-corto",
  templateUrl: "./add-pedido-corto.component.html",
  styleUrls: ["./add-pedido-corto.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es-ES",
    },
  ],
})
export class AddPedidoCortoComponent implements OnInit {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  formData = {};
  addPedidoForm: FormGroup;
  selectedOrigen: string = "";
  origenes: Origen;
  destinos: Destino;
  selectedZona: string = "";
  zonas: ZonaDestino;
  selectedDador: string = "";
  dadores: Dador;
  cantidadisponible = 1;
  validOperador = true;
  //selectedDestinatario: string = '';
  //destinatario: Destinatario;
  selectProducto: string = "";
  productos: Product[];
  idPedido: any;
  mostrarIntermediario: boolean = false;
  mostrarOperador: boolean = false;
  intermediarios: Intermed[];
  intermediarios1: Intermed[];
  operadores: Operador[];
  minDate: any;
  maxDate: any;
  roloperador = false;
  condicionesviaje: CondicionesViaje | null = null;
  public getItemSub: Subscription;
  public configCentro: ConfigCentro;
  difusion: any;
  busqueda: Busqueda;
  tipocentro: any;
  mostrardifusion = true;
  mostrarOpciondifusion = true;
  ocultarcampos_dador = true;
  valorIdProducto: any = "";
  valorQuantity: any = "";
  valorFechaHasta: any = "";
  selectedDifusion: boolean = false;
  listaTurneadas: any[] = [];
  tipoturneada: number = 0;
  checkTurneada = false;
  mostrarTurneada = true;
  validTurneada = true;
  showListDisponibles: boolean = false;
  choferesDisponiblesListaTurneada: number = 0;
  esPrePedido: boolean = false;
  filteredOptions: Observable<Origen[]>;
  filteredselectedDador: Observable<Dador[]>;
  filteredOptionsDestino: Observable<Destino[]>;
  isTurneada: boolean = false;
  idCentro: string = "";

  constructor(
    private centrosService: CentrosService,
    private origenesService: OrigenesService,
    private destinosService: DestinosService,
    private nomencladoresService: NomencladoresService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    public router: Router,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,
    private messageService: MessageService,
    private homeService: HomeService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogLocaRef: MatDialogRef<AddPedidoCortoComponent>
  ) {}

  ngOnInit() {
    this.configCentro = {
      km: 0,
      condiciones_viaje: 0,
      horas: 0,
    };
    this.userService
      .getIdPersonaRol(localStorage.getItem("rol"))
      .subscribe((data) => (this.idCentro = data.data));
    this.tipocentro = localStorage.getItem("clienteMuvin");
    this.getConfigCentro();

    this.ocultarcampos_dador =
      localStorage.getItem("clienteMuvin") === "2" ? false : true;
    this.mostrardifusion =
      this.configCentro.condiciones_viaje === 1 ? true : false;
    this.busqueda = new Busqueda();
    if (this.data.esPrePedido) {
      this.esPrePedido = this.data.esPrePedido;
      this.valorQuantity = this.data.payload.cant_camiones;
    } else {
      if (this.data.payload != undefined) {
        this.busqueda = this.data.payload;
      }
    }

    let rol: string = localStorage.getItem("rol");
    if (rol == "11") {
      this.roloperador = true;
    }
    ELEMENT_DATA = [];
    this.addPedidoForm = new FormGroup({
      quantity: new FormControl(this.valorQuantity, [
        Validators.required,
        Validators.min(1),
      ]),
      desdeDate: new FormControl("", [Validators.required]),
      hastaDate: new FormControl("", [Validators.required]),
      selectedOrigen: new FormControl("", [Validators.required]),
      selectedDador: new FormControl("", [Validators.required]),
      selectedDestino: new FormControl("", [Validators.required]),
      selectedProducto: new FormControl(
        this.busqueda.id_producto != undefined ? this.busqueda.id_producto : "",
        [Validators.required]
      ),
      selectedIntermediario: new FormControl(""),
      selectedOperador: new FormControl(""),
      ckIntermediario: new FormControl(""),
      ckCalesita: new FormControl(""),
      cantidad: new FormControl(""),
      contrato: new FormControl(""),
      observaciones: new FormControl(""),
      difundido:
        this.tipocentro !== "2"
          ? new FormControl("")
          : new FormControl("", [Validators.required]),
      ckOperador: new FormControl(""),
      ckUsarTurneada: new FormControl(""),
      id_lista: new FormControl(""),
    });
    this.getItems();
  }
  getConfigCentro() {
    this.nomencladoresService.getConfiguracionCentro().subscribe((data) => {
      this.difusion = data.data.condiciones_viaje;
      this.configCentro = {
        horas: data.data.horas,
        km: data.data.km,
        condiciones_viaje: data.data.condiciones_viaje,
      };
      this.tipoturneada = data.data.id_tipo_turneada;
      this.isTurneada = this.tipoturneada == 0 ? false : true;
      this.mostrardifusion =
        this.configCentro.condiciones_viaje === 1 ? true : false;
      if (this.isTurneada) {
        this.getListaCentro();
      }
    });
  }

  getListaCentro() {
    this.getItemSub = this.centrosService
      .getAllListaCentro2(this.tipoturneada)
      .subscribe((data) => {
        this.listaTurneadas = data.data;
        this.mostrarTurneada =
          this.tipoturneada > 0 && data.data.length > 0 ? true : false;
      });
  }

  onChangeTurneada(event) {
    this.mostrarOpciondifusion = !event.checked;
    this.checkTurneada = event.checked;
    this.validTurneada = event.checked
      ? this.addPedidoForm.controls["id_lista"].value == ""
        ? false
        : true
      : true;
    /* this.validTurneada = event.checked ? false : true;
    if (this.addPedidoForm.controls['quantity'].value <= this.choferesDisponiblesListaTurneada) {
      this.validTurneada = true;
    } else {
      this.validTurneada = false;
    } */
  }

  displayFn(option?: Origen): string | undefined {
    return option ? option.descripcion : undefined;
  }

  private _filter(descripcion: string): Origen[] {
    const filterValue = descripcion.toLowerCase();
    return this.origenes.filter(
      (option) => option.descripcion.toLowerCase().indexOf(filterValue) >= 0
    );
  }

  displayFnc(option_c?: Dador): string | undefined {
    return option_c ? option_c.nombre_cliente : undefined;
  }

  private _filterd(nombre_cliente: string): Dador[] {
    const filterValue_c = nombre_cliente.toLowerCase();
    return this.dadores.filter(
      (option_c) =>
        option_c.nombre_cliente.toLowerCase().indexOf(filterValue_c) >= 0
    );
  }

  displayFnD(option_d?: Destino): string | undefined {
    return option_d ? option_d.descripcion : undefined;
  }

  private _filterdes(descripcion: string): Destino[] {
    const filterValue_d = descripcion.toLowerCase();
    return this.destinos.filter(
      (option_d) =>
        option_d.descripcion.toLowerCase().indexOf(filterValue_d) >= 0
    );
  }

  getItems() {
    this.getItemsOrigen();
    this.getItemsDador();
    this.getItemsProductos();
    this.getItemIntermediarios();
    this.getItemOperadores();
    this.getItemsDestino();
  }

  getItemsOrigen() {
    this.getItemSub = this.nomencladoresService
      .getAllOrigenesSelect()
      .subscribe((data) => {
        this.origenes = data.data;
        this.filteredOptions = this.addPedidoForm.controls[
          "selectedOrigen"
        ].valueChanges.pipe(
          startWith<string | Origen>(""),
          map((value) =>
            typeof value === "string" ? value : value.descripcion
          ),
          map((descripcion) =>
            descripcion ? this._filter(descripcion) : this.origenes.slice()
          )
        );
      });
  }
  getItemsDestino() {
    this.getItemSub = this.nomencladoresService
      .getAllOrigenesSelect()
      .subscribe((data) => {
        this.destinos = data.data;
        this.filteredOptionsDestino = this.addPedidoForm.controls[
          "selectedDestino"
        ].valueChanges.pipe(
          startWith<string | Destino>(""),
          map((value) =>
            typeof value === "string" ? value : value.descripcion
          ),
          map((descripcion) =>
            descripcion ? this._filterdes(descripcion) : this.destinos.slice()
          )
        );
      });
  }

  getItemsDador() {
    this.getItemSub = this.nomencladoresService
      .getAllDadores()
      .subscribe((data) => {
        this.dadores = data.data;
        this.filteredselectedDador = this.addPedidoForm.controls[
          "selectedDador"
        ].valueChanges.pipe(
          startWith<string | Dador>(""),
          map((value) =>
            typeof value === "string" ? value : value.nombre_cliente
          ),
          map((nombre_cliente) =>
            nombre_cliente
              ? this._filterd(nombre_cliente)
              : this.dadores.slice()
          )
        );
      });
  }

  getItemIntermediarios() {
    this.getItemSub = this.centrosService
      .getIntermediarioByIdCentroSelect()
      .subscribe((data) => {
        this.intermediarios = data.data;
      });
  }

  getItemOperadores() {
    this.getItemSub = this.centrosService
      .getOperadoreByIdCentroSelect()
      .subscribe((data) => {
        this.operadores = data.data;
      });
  }
  getItemsProductos() {
    this.getItemSub = this.nomencladoresService
      .getAllProductosSelect()
      .subscribe((data) => {
        this.productos = data.data;
        if (this.esPrePedido) {
          this.productos.forEach((element) => {
            if (element.descripcion == this.data.payload.producto)
              this.addPedidoForm.controls["selectedProducto"].setValue(
                element.id
              );
          });
        }
      });
  }

  get f() {
    return this.addPedidoForm.controls;
  }
  initValue() {
    this.f.desdeDate.setValue("");
    this.f.hastaDate.setValue("");
    this.f.selectedOrigen.setValue("");
    this.f.ckUsarTurneada.setValue(false);
    this.mostrarOpciondifusion = true;
    this.showListDisponibles = false;
    this.f.id_lista.setValue("");
    if (this.tipoturneada !== 0) {
      this.getListaCentro();
    }
    this.f.selectedDestino.setValue("");
    this.f.selectedDador.setValue("");
    this.f.quantity.setValue(0);
    this.f.contrato.setValue("");
    this.f.observaciones.setValue("");
    this.f.selectedProducto.setValue(0);
    this.f.difundido.setValue(false);
    this.f.selectedOperador.setValue("");
    this.f.ckOperador.setValue(false);
    this.f.ckIntermediario.setValue(false);
    this.f.ckCalesita.setValue(false);
    this.mostrarIntermediario = false;
    this.mostrarOperador = false;
  }

  postPedido() {
    if (
      this.f.selectedDestino.value.id === undefined ||
      this.f.selectedDestino.value.id === null
    )
      this.errorService.confirm({ message: "No exite destino!: Revise" });
    else {
      if (this.f.ckIntermediario.value) {
        // se seleccionó el checkbox
        let idIntermediario: any = this.dataSource.filteredData;
        if (idIntermediario.length > 0) {
          const newPedido = {
            fecha_desde: this.f.desdeDate.value,
            fecha_hasta: this.f.hastaDate.value,
            id_origen: this.f.selectedOrigen.value.id,
            id_cliente: this.f.selectedDador.value.id_cliente,
            id_centro: this.idCentro,
            cantidad: this.f.quantity.value,
            contrato: this.f.contrato.value,
            observaciones: this.f.observaciones.value,
            reduccion: 0,
            id_producto: this.f.selectedProducto.value,
            bloqueado: 0,
            id_generador: this.idCentro,
            difundido:
              this.condicionesviaje === null
                ? 0
                : this.condicionesviaje.selectedTipoDifusion === undefined ||
                  this.condicionesviaje.selectedTipoDifusion === null
                ? 0
                : this.condicionesviaje.selectedTipoDifusion,
            tipo: 3,
            id_destino: this.f.selectedDestino.value.id,
            id_lista: this.f.id_lista.value,
            calesita: this.f.ckCalesita.value ? "1" : "0",
          };
          this.loader.open();
          this.nomencladoresService.postPedido(newPedido).subscribe(
            (data) => {
              this.messageService.sendMessage("Nuevo Pedido");
              this.idPedido = data.data.id;
              if (this.configCentro.condiciones_viaje === 1) {
                if (this.selectedDifusion) {
                  this.addCondicionesViaje();
                }
              }
              let datadesglose = {
                id_centro: this.idCentro,
                id_pedido: this.idPedido,
                intermediarios: idIntermediario,
              };
              this.nomencladoresService
                .desglosarPedido(datadesglose)
                .subscribe((data) => {
                  if (data.success) {
                    this.loader.close();
                  } else {
                    this.loader.close();
                    this.errorService.confirm({
                      message: "Error!:" + data.data,
                    });
                  }
                });
              if (this.busqueda != undefined) {
                this.busqueda.id_pedido = data.data.id;
                this.busqueda.finalizada = 1;
                this.centrosService
                  .putBusqueda(this.busqueda)
                  .subscribe((data) => {
                    if (data.success) {
                      this.loader.close();
                      return;
                    } else {
                      this.loader.close();
                      this.errorService.confirm({
                        message: "Error!:" + data.data,
                      });
                    }
                  });
              }
              if (this.esPrePedido) {
                this.messageService.sendMessage("AddPrePedido");
                this.getItemSub = this.homeService
                  .deletePrePedido(this.data.payload.id_pre_pedido)
                  .subscribe(
                    (data) => {
                      this.loader.close();
                      return;
                    },
                    (err) => {
                      this.loader.close();
                      this.errorService.confirm({
                        message: "Error!:" + data.data,
                      });
                    }
                  );
              }
              this.getItems();
              this.loader.close();
              this.initValue();
              ELEMENT_DATA = [];
              this.alertService
                .confirm({
                  message: "¡Pedido agregado correctamente!",
                  tipo: "exito",
                })
                .subscribe((res) => {
                  if (res) {
                    if (this.checkTurneada) {
                      this.addChoferesListaDisponibles(this.idPedido);
                    }
                    return;
                  }
                });
            },
            (err) => {
              this.loader.close();
              this.errorService
                .confirm({
                  message: "El Pedido no se pudo agregar, intentelo nuevamente",
                })
                .subscribe((res) => {
                  if (res) {
                    return;
                  }
                });
            }
          );
        } else {
          this.atencionService
            .confirm({
              message:
                "El Pedido no se pudo agregar, no seleccionó un Intermediario",
            })
            .subscribe((res) => {
              if (res) {
                return;
              }
            });
        }
      } else {
        let valoroperador = "";
        if (
          this.mostrarOperador === true &&
          this.f.selectedOperador.value !== ""
        ) {
          valoroperador = this.f.selectedOperador.value;
        }
        const newPedido = {
          fecha_desde: this.f.desdeDate.value,
          fecha_hasta: this.f.hastaDate.value,
          id_origen: this.f.selectedOrigen.value.id,
          id_cliente: this.f.selectedDador.value.id_cliente,
          id_centro: this.idCentro,
          cantidad: this.f.quantity.value,
          contrato: this.f.contrato.value,
          observaciones: this.f.observaciones.value,
          reduccion: 0,
          id_producto: this.f.selectedProducto.value,
          bloqueado: 0,
          id_generador: this.idCentro,
          id_operador: valoroperador,
          difundido:
            this.condicionesviaje === null
              ? 0
              : this.condicionesviaje.selectedTipoDifusion === undefined ||
                this.condicionesviaje.selectedTipoDifusion === null
              ? 0
              : this.condicionesviaje.selectedTipoDifusion,
          tipo: 3,
          id_destino: this.f.selectedDestino.value.id,
          id_lista: this.f.id_lista.value,
          calesita: this.f.ckCalesita.value ? "1" : "0",
        };
        this.loader.open();
        this.nomencladoresService.postPedido(newPedido).subscribe(
          (data) => {
            this.messageService.sendMessage("Nuevo Pedido");
            this.idPedido = data.data.id;
            if (this.configCentro.condiciones_viaje === 1) {
              if (this.selectedDifusion) {
                this.addCondicionesViaje();
              }
            }
            if (this.busqueda != undefined) {
              this.busqueda.id_pedido = data.data.id;
              this.busqueda.finalizada = 1;
              this.centrosService
                .putBusqueda(this.busqueda)
                .subscribe((data) => {
                  if (data.success) {
                    this.loader.close();
                    return;
                  } else {
                    this.loader.close();
                    this.errorService.confirm({
                      message: "Error!:" + data.data,
                    });
                  }
                });
            }
            if (this.esPrePedido) {
              this.messageService.sendMessage("AddPrePedido");
              this.getItemSub = this.homeService
                .deletePrePedido(this.data.payload.id_pre_pedido)
                .subscribe(
                  (data) => {
                    this.loader.close();
                    return;
                  },
                  (err) => {
                    this.loader.close();
                    this.errorService.confirm({
                      message: "Error!:" + data.data,
                    });
                  }
                );
            }
            this.getItems();
            this.loader.close();
            this.initValue();
            this.alertService
              .confirm({
                message: "Pedido agregado correctamente!",
                tipo: "exito",
              })
              .subscribe((res) => {
                if (res) {
                  if (this.checkTurneada) {
                    this.addChoferesListaDisponibles(this.idPedido);
                  }
                  return;
                }
              });
          },
          (err) => {
            this.loader.close();
            this.errorService
              .confirm({
                message: "El Pedido no se pudo agregar, intentelo nuevamente.",
              })
              .subscribe((res) => {
                if (res) {
                  return;
                }
              });
          }
        );
      }
    }
  }

  gotoHome() {
    this.dialogLocaRef.close();
  }

  goAsignarViaje() {
    if (
      this.f.selectedDestino.value.id === undefined ||
      this.f.selectedDestino.value.id === null
    )
      this.errorService.confirm({ message: "No exite destino!: Revise" });
    else {
      if (this.f.ckIntermediario.value) {
        let idIntermediario: any = this.dataSource.filteredData;
        if (idIntermediario.length > 0) {
          const newPedido = {
            fecha_desde: this.f.desdeDate.value,
            fecha_hasta: this.f.hastaDate.value,
            id_origen: this.f.selectedOrigen.value.id,
            id_cliente: this.f.selectedDador.value.id_cliente,
            id_centro: this.idCentro,
            cantidad: this.f.quantity.value,
            contrato: this.f.contrato.value,
            observaciones: this.f.observaciones.value,
            reduccion: 0,
            id_producto: this.f.selectedProducto.value,
            bloqueado: 0,
            id_generador: this.idCentro,
            difundido:
              this.condicionesviaje === null
                ? 0
                : this.condicionesviaje.selectedTipoDifusion === undefined ||
                  this.condicionesviaje.selectedTipoDifusion === null
                ? 0
                : this.condicionesviaje.selectedTipoDifusion,
            tipo: 3,
            id_destino: this.f.selectedDestino.value.id,
            id_lista: this.f.id_lista.value,
            calesita: this.f.ckCalesita.value ? "1" : "0",
          };
          this.nomencladoresService.postPedido(newPedido).subscribe(
            (data) => {
              this.idPedido = data.data.id;
              let datadesglose = {
                id_centro: this.idCentro,
                id_pedido: this.idPedido,
                intermediarios: idIntermediario,
              };
              this.nomencladoresService
                .desglosarPedido(datadesglose)
                .subscribe((data) => {
                  if (data.success) {
                    this.loader.close();
                  } else {
                    this.loader.close();
                    this.errorService.confirm({
                      message: "Error!:" + data.data,
                    });
                  }
                });
              if (this.busqueda != undefined) {
                this.busqueda.id_pedido = data.data.id;
                this.busqueda.finalizada = 1;
                this.centrosService
                  .putBusqueda(this.busqueda)
                  .subscribe((data) => {
                    if (data.success) {
                      this.loader.close();
                      return;
                    } else {
                      this.loader.close();
                      this.errorService.confirm({
                        message: "Error!:" + data.data,
                      });
                    }
                  });
              }
              this.getItems();
              this.loader.close();
              this.initValue();
              this.alertService
                .confirm({
                  message: "¡Pedido agregado correctamente!",
                  tipo: "exito",
                })
                .subscribe((res) => {
                  if (res) {
                    return;
                  }
                });
              this.router.navigateByUrl(
                "/home/asignarViajeRetorno/" + this.idPedido
              );
              this.dialogLocaRef.close();
            },
            (err) => {
              this.loader.close();
              this.errorService
                .confirm({
                  message: "El Pedido no se pudo agregar, intentelo nuevamente",
                })
                .subscribe((res) => {
                  if (res) {
                    return;
                  }
                });
            }
          );
        } else {
          this.atencionService
            .confirm({
              message:
                "El Pedido no se pudo agregar, no seleccionó un Intermediario",
            })
            .subscribe((res) => {
              if (res) {
                return;
              }
            });
        }
      } else {
        let valoroperador = "";
        if (
          this.mostrarOperador === true &&
          this.f.selectedOperador.value !== ""
        ) {
          valoroperador = this.f.selectedOperador.value;
        }
        const newPedido = {
          fecha_desde: this.f.desdeDate.value,
          fecha_hasta: this.f.hastaDate.value,
          id_origen: this.f.selectedOrigen.value.id,
          id_cliente: this.f.selectedDador.value.id_cliente,
          id_centro: this.idCentro,
          cantidad: this.f.quantity.value,
          contrato: this.f.contrato.value,
          observaciones: this.f.observaciones.value,
          reduccion: 0,
          id_producto: this.f.selectedProducto.value,
          bloqueado: 0,
          id_generador: this.idCentro,
          id_operador: valoroperador,
          difundido:
            this.condicionesviaje === null
              ? 0
              : this.condicionesviaje.selectedTipoDifusion === undefined ||
                this.condicionesviaje.selectedTipoDifusion === null
              ? 0
              : this.condicionesviaje.selectedTipoDifusion,
          tipo: 3,
          id_destino: this.f.selectedDestino.value.id,
          id_lista: this.f.id_lista.value,
          calesita: this.f.ckCalesita.value ? "1" : "0",
        };
        this.loader.open();
        this.nomencladoresService.postPedido(newPedido).subscribe(
          (data) => {
            this.idPedido = data.data.id;
            if (this.busqueda != undefined) {
              this.busqueda.id_pedido = data.data.id;
              this.busqueda.finalizada = 1;
              this.centrosService
                .putBusqueda(this.busqueda)
                .subscribe((data) => {
                  if (data.success) {
                    this.loader.close();
                    return;
                  } else {
                    this.loader.close();
                    this.errorService.confirm({
                      message: "Error!:" + data.data,
                    });
                  }
                });
            }
            this.getItems();
            this.loader.close();
            this.alertService
              .confirm({
                message: "Pedido agregado correctamente!",
                tipo: "exito",
              })
              .subscribe((res) => {
                if (res) {
                  return;
                }
              });
            this.router.navigateByUrl("/home/asignarViaje/" + this.idPedido);
            this.dialogLocaRef.close();
          },
          (err) => {
            this.loader.close();
            this.errorService
              .confirm({
                message: "El Pedido no se pudo agregar, intentelo nuevamente.",
              })
              .subscribe((res) => {
                if (res) {
                  return;
                }
              });
          }
        );
      }
    }
  }

  openPopAgregarOrigen() {
    let title = "Agregar Lugar de Carga";
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddOrigenComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: {}, isNew: true },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.loader.open();
      res.telefono = res.telefono.toString();
      this.origenesService.postOrigen(res).subscribe(
        (data) => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.getItemsOrigen();
          this.alertService
            .confirm({ message: "¡Lugar de Carga Agregado!", tipo: "exito" })
            .subscribe((res) => {
              if (res) {
                return;
              }
            });
        },
        (err) => {
          this.loader.close();
          this.atencionService
            .confirm({ message: err.data.message })
            .subscribe((res) => {
              if (res) {
                return;
              }
            });
        }
      );
    });
  }

  openPopAgregarDador() {
    let title = "Agregar Cargador";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      VincularClienteComponent,
      {
        width: "420px",
        disableClose: true,
        data: { title: title },
      }
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.loader.open();
      this.centrosService.postCentroCliente(res).subscribe(
        (data) => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.getItemsDador();
          this.alertService
            .confirm({ message: "¡Cargador Agregado!", tipo: "exito" })
            .subscribe((res) => {
              if (res) {
                return;
              }
            });
        },
        (err) => {
          this.loader.close();
          this.atencionService
            .confirm({ message: "No se pudo agregar el Cargador." })
            .subscribe((res) => {
              if (res) {
                return;
              }
            });
        }
      );
    });
  }

  onChange(event) {
    this.mostrarIntermediario = event.checked;
    if (event.checked) {
      this.mostrarOperador = false;
      this.addPedidoForm.controls["ckOperador"].setValue(false);
      this.addPedidoForm.controls["selectedOperador"].setValue("");
    }
  }

  onChange2(event) {
    this.mostrarOperador = event.checked;
    if (event.checked) {
      this.mostrarIntermediario = false;
      this.addPedidoForm.controls["ckIntermediario"].setValue(false);
      this.validOperador = event.checked
        ? this.addPedidoForm.controls["selectedOperador"].value == ""
          ? false
          : true
        : true;
      if (!this.operadores) {
        this.getItemOperadores();
      }
    } else {
      this.validOperador = true;
    }
  }
  seleccionarOperador() {
    this.validOperador = true;
  }
  ChangeCantidad(event) {
    this.cantidadisponible = parseInt(event.target.value);
    this.validTurneada = this.checkTurneada
      ? this.addPedidoForm.controls["id_lista"].value == ""
        ? false
        : true
      : true;
    if (event.target.value <= 0) {
      this.addPedidoForm.controls["quantity"].setValue("");
      this.addPedidoForm.controls["quantity"].setErrors(Validators.required);
      this.addPedidoForm.controls["quantity"].markAsDirty();
    }
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>, cmp: string) {
    if (cmp === "desde") {
      this.minDate = event.value;
    } else {
      this.maxDate = event.value;
    }
  }
  addElement() {
    if (this.addPedidoForm.controls["cantidad"].value > 0) {
      if (
        this.addPedidoForm.controls["cantidad"].value <= this.cantidadisponible
      ) {
        if (
          !this.existeIntermediario(
            this.addPedidoForm.controls["selectedIntermediario"].value
          )
        ) {
          this.cantidadisponible -=
            this.addPedidoForm.controls["cantidad"].value;
          ELEMENT_DATA.push({
            intermediario: this.obtenerNombreInter(
              this.addPedidoForm.controls["selectedIntermediario"].value
            ),
            cantidad: this.addPedidoForm.controls["cantidad"].value,
            id: this.addPedidoForm.controls["selectedIntermediario"].value,
          });
          this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        } else {
          this.atencionService.confirm({
            message: "El intermediario ya existe!",
          });
        }
      } else {
        this.atencionService.confirm({
          message:
            "No puede asignar una cantidad mayor que la cantidad disponible!",
        });
      }
    } else {
      this.atencionService.confirm({
        message: "La cantidad debe ser mayor  que cero!",
      });
    }
  }
  existeIntermediario(id) {
    for (let i = 0; i < ELEMENT_DATA.length; i++) {
      if (ELEMENT_DATA[i].id === id) {
        return true;
      }
    }
    return false;
  }
  obtenerNombreInter(id) {
    for (let i = 0; i < this.intermediarios.length; i++) {
      if (id === this.intermediarios[i].id) {
        return this.intermediarios[i].nombre_intermediario;
      }
    }
  }
  displayedColumns: string[] = ["intermediario", "cantidad", "id"];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  deleteElement(elemt) {
    ELEMENT_DATA.splice(ELEMENT_DATA.indexOf(elemt), 1);
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.cantidadisponible += elemt.cantidad;
  }

  openPopCondicionesViaje(option: boolean) {
    if (option) {
      let title = "Condiciones del viaje";
      let dialogRef: MatDialogRef<any> = this.dialog.open(
        CondicionesViajeComponent,
        {
          width: "720px",
          height: "80vh",
          disableClose: true,
          data: { title: title, payload: { tipopedido: "corto" } },
        }
      );
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          // If user press cancel
          this.addPedidoForm.controls["difundido"].setValue(false);
          if (this.tipocentro === "2") {
            this.addPedidoForm.controls["difundido"].setErrors(
              Validators.required
            );
            this.addPedidoForm.controls["difundido"].markAsDirty();
            this.alertService.confirm({
              message: "Debe realizar la difusión!",
            });
          }
          return;
        }
        this.selectedDifusion = true;
        this.condicionesviaje = res;
      });
    } else {
      this.selectedDifusion = false;
      this.condicionesviaje = {};
    }
  }
  addCondicionesViaje() {
    this.condicionesviaje.id_pedido = this.idPedido;
    this.nomencladoresService
      .postPedidoCondiciones(this.condicionesviaje)
      .subscribe(
        (data) => {
          const vpedidoacoplados = [];
          for (let i = 0; i < this.condicionesviaje.tipo_acoplado.length; i++) {
            vpedidoacoplados.push({
              id_pedido: this.idPedido,
              id_tipo_acoplado: this.condicionesviaje.tipo_acoplado[i],
            });
            this.nomencladoresService
              .postPedidoTipoAcoplado({
                id_pedido: this.idPedido,
                id_tipo_acoplado: this.condicionesviaje.tipo_acoplado[i],
              })
              .subscribe(
                (data1) => {},
                (err) => {}
              );
          }
          for (let i = 0; i < this.condicionesviaje.zona_ideal.length; i++) {
            this.nomencladoresService
              .postPedidoZonaIdeal({
                id_pedido: this.idPedido,
                id_zona_ideal: this.condicionesviaje.zona_ideal[i],
              })
              .subscribe(
                (data1) => {},
                (err) => {}
              );
          }
        },
        (err) => {
          this.errorService
            .confirm({
              message:
                "Las condiciones del pedido no se pudo agregar, intentelo nuevamente.",
            })
            .subscribe((res) => {
              if (res) {
                return;
              }
            });
        }
      );
  }
  validarTurneada(event) {
    if (this.checkTurneada) {
      this.showListDisponibles = false;
      this.validTurneada = true;
    } else {
      this.showListDisponibles = false;
      this.validTurneada = true;
    }
  }
  addChoferesListaDisponibles(id_pedido) {
    let title = "Seleccionar Choferes en la Lista ";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ListaChoferesComponent,
      {
        width: "80vw",
        height: "88vh",
        disableClose: true,
        data: { title: title, payload: { id_pedido: id_pedido } },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }

      return;
    });
  }
}
