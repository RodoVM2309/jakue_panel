import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MatAutocompleteTrigger, MatButton, MatDialog, MatDialogRef, MatProgressBar, MatSnackBar, MatTableDataSource, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { Dador, DadorPrePedido } from '../../../models/dador';
import { Origen } from '../../../models/origen';
import { ZonaDestino } from '../../../models/zona-destino';
import { NomencladoresService } from '../../../services/nomencladores.service';
//import { Destinatario } from '../../../models/destinatario';
import { AppDateAdapter, APP_DATE_FORMATS } from "@shared/helpers/date.adapter";
import { Busqueda } from '../../../models/busqueda';
import { Product } from '../../../models/product.model';
import { AddOrigenComponent } from '../add-origen/add-origen.component';
import { VincularClienteComponent } from '../vincular-cliente/vincular-cliente.component';
import { CentrosService } from './../../../../shared/services/centros.service';
import { OrigenesService } from './../../../../shared/services/origenes.service';


import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AppAtencionService } from '../../../../shared/services/app-atencion/app-atencion.service';
import { AppErrorService } from '../../../../shared/services/app-error/app-error.service';
import { CondicionesViajeComponent } from '../condiciones-viaje/condiciones-viaje.component';
import { ListaChoferesComponent } from '../lista-choferes/lista-choferes.component';

import { PersonasService } from '@app/shared/services';
import { CupoDisponible } from 'app/shared/models/cupo';
import { MessageService } from 'app/shared/services/message.service';
import { UserService } from 'app/shared/services/user.service';
import { map, startWith } from 'rxjs/operators';
import { CupoService } from '../../cupo/cupo.service';
import { CentroSinEMail } from '../../cupo/cuponera/cuponera.component';
import { UsuarioSinEmailComponent } from '../../cupo/usuario-sin-email/usuario-sin-email.component';
import { HomeService } from '../home.service';
import { error } from 'console';
// import undefined = require('firebase/empty-import');


export class IntermediaroAsig {
  id: number;
  intermediario: string;
  cantidad: number;
}

export class Intermed {
  id: number;
  nombre_intermediario: string;
  cuit: string;
  id_usuario: string;
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
  tipo_acoplado?= [];
  zona_ideal?= [];
  longitud?: number;
  latitud?: number;
  selectedTipoDifusion?: number;
  kilometros?: number;
}
export class ConfigCentro {
  horas: number;
  km: number;
  condiciones_viaje: number;
};

let ELEMENT_DATA: IntermediaroAsig[] = [];
@Component({
  selector: "app-add-pedido",
  templateUrl: "./add-pedido.component.html",
  styleUrls: ["./add-pedido.component.scss"],
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
export class AddPedidoComponent implements OnInit {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  formData = {};
  addPedidoForm: FormGroup;
  selectedOrigen: string = "";
  origenes: Origen[];
  selectedZona: string = "";
  zonas: ZonaDestino[] = [];
  selectedDador: string = "";
  dadores: Dador[] = [];
  dadoresPrePedido: DadorPrePedido[] = [];
  cantidadisponible = 0;
  //selectedDestinatario: string = '';
  //destinatario: Destinatario;
  selectProducto: string = "";
  productos: Product[] = [];
  idPedido: any;
  mostrarIntermediario: boolean = false;
  mostrarOperador: boolean = false;
  intermediarios: Intermed[];
  intermediarios1: Intermed[];
  operadores: Operador[];
  minDate: any;
  maxDate: any;
  condicionesviaje: CondicionesViaje | null = null;
  public getItemSub: Subscription;
  public configCentro: ConfigCentro;
  roloperador = false;
  difusion: any;
  busqueda: Busqueda;
  cupo: CupoDisponible[];
  es_cupo: boolean = false;
  tipocentro: any;
  mostrardifusion = true;
  mostrarOpciondifusion = true;
  ocultarcampos_dador = true;
  valorIdProducto: any = "";
  valorQuantity: any = '';
  valorFechaDesde: any = "";
  valorFechaHasta: any = "";
  selectedDifusion: boolean = false;
  listaTurneadas: any[] = [];
  tipoturneada: number = 0;
  checkTurneada = false;
  mostrarTurneada = true;

  showListDisponibles: boolean = false;
  choferesDisponiblesListaTurneada: number = 0;
  esPrePedido: boolean = false;
  idCentro: string = '';
  validTurneada = true;
  validOperador = true;
  validIntermediario = true;

  filteredOptions: Observable<Origen[]>;
  filteredselectedDador: Observable<Dador[]>;
  filteredselectedDadorPrePedido: Observable<DadorPrePedido[]>;
  filteredselectedZona: Observable<ZonaDestino[]>;
  isTurneada: boolean = false;
  labelDifusion = 'Difusión no cargada';
  listSinEmail: CentroSinEMail[] = [];

  constructor(
    private homeService: HomeService,
    private centrosService: CentrosService,
    private origenesService: OrigenesService,
    private nomencladoresService: NomencladoresService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    public router: Router,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,
    private messageService: MessageService,
    private userService: UserService,
    private personasService: PersonasService,
    private cupoService: CupoService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogLocaRef: MatDialogRef<AddPedidoComponent>
  ) { }



  ngOnInit() {
    console.log(this.data.payload.cupos);
    this.dataSource.data = [];
    this.configCentro = {
      km: 0,
      condiciones_viaje: 0,
      horas: 0
    };
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
      .subscribe(data => this.idCentro = data.data);
    this.cupo = [];
    this.tipocentro = localStorage.getItem("clienteMuvin");
    let rol: string = localStorage.getItem("rol");
    this.ocultarcampos_dador = this.tipocentro === "2" ? false : true
    this.getConfigCentro();

    if (this.data.payload !== undefined) {
      if (this.data.payload.cupos !== undefined) {
        this.cupo = this.data.payload.cupos;
        this.es_cupo = true;
        this.valorFechaHasta = this.obtenerMayorFecha();
        let fechaMod = new Date(this.valorFechaHasta);
        this.valorFechaHasta = this.homeService.sumarDias(fechaMod, 1);
        this.maxDate = this.valorFechaHasta;
        this.valorQuantity = this.cupo.length;
        this.cantidadisponible = this.cupo.length;
        if (this.cupo[0].id_producto !== undefined) {
          this.valorIdProducto = parseInt(this.cupo[0].id_producto);
        }
      } else {
        if (this.data.esPrePedido) {
          this.esPrePedido = this.data.esPrePedido;
          this.valorQuantity = this.data.payload.cant_camiones;
          this.valorFechaDesde = new Date(this.data.payload.data_fecha_desde);
          this.valorFechaHasta = new Date(this.data.payload.data_fecha_hasta);

        }
        else {
          this.busqueda = this.data.payload;
          if (this.busqueda.id_producto !== undefined) {
            this.valorIdProducto = this.busqueda.id_producto;
          }
        }

      }
    }
    if (rol === "11") {
      this.roloperador = true;
    }
    ELEMENT_DATA = [];
    const numericNumberReg = "^-?[0-9]\\d*(\\.\\d{1,2})?$";
    this.addPedidoForm = new FormGroup({
      quantity: new FormControl(this.valorQuantity, [Validators.required, Validators.pattern(numericNumberReg), Validators.min(1)]),
      desdeDate: new FormControl(this.valorFechaDesde),
      hastaDate: new FormControl({ value: this.valorFechaHasta, disabled: true }, [Validators.required]),
      selectedOrigen: new FormControl("", [Validators.required]),
      selectedDador: new FormControl("", [Validators.required]),
      selectedProducto: new FormControl(this.valorIdProducto, [
        Validators.required
      ]),
      id_origen: new FormControl(null),
      nombre_origen: new FormControl(null, [Validators.required,
      ]),
      selectedIntermediario: new FormControl("", [Validators.required]),
      selectedOperador: new FormControl(""),
      ckIntermediario: new FormControl(""),
      ckCalesita: new FormControl(""),
      ckDifusion: new FormControl(""),
      difusionLight: new FormControl(""),
      cantidad: new FormControl(1),
      contrato: new FormControl(""),
      observaciones: new FormControl(""),
      difundido:
        this.tipocentro !== "2"
          ? new FormControl("")
          : new FormControl("", [Validators.required]),
      ckOperador: new FormControl(""),
      id_lista: new FormControl("") /*,
        intermediarios: null */
    });
    if (!this.es_cupo) {
      this.addPedidoForm.addControl(
        "selectedZona",
        new FormControl("", [Validators.required])
      );
      this.addPedidoForm.addControl(
        "ckUsarTurneada",
        new FormControl("")
      );
    } else {
      this.addPedidoForm.addControl(
        "selectedZona",
        new FormControl("")
      );
    };
    this.getItems();
    this.mostrarOperador = false;
    //this.addPedidoForm.controls["ckIntermediario"].setValue(false);
    this.validIntermediario = true;
    this.getItemIntermediarios();
  }

  mostrarDifusionLigth() {
    console.log(this.addPedidoForm.get('difusionLight').value);

  }

  get isDifusionLigth(): boolean {
    return true
    //return this.addPedidoForm.get('difusionLight').value;
  }

  obtenerMayorFecha() {
    let mayorFecha = "";
    if (this.cupo.length > 0) {
      mayorFecha = this.homeService.formatoFecha(this.cupo[0].fecha, "amd", "-");
      this.cupo.forEach(element => {
        let elementFecha = this.homeService.formatoFecha(element.fecha, "amd", "-")
        if (elementFecha > mayorFecha) {
          mayorFecha = elementFecha;
        }
      });
    }
    return mayorFecha;
  }

  getConfigCentro() {
    this.nomencladoresService.getConfiguracionCentro()
      .subscribe(data => {
        this.difusion = data.data.condiciones_viaje;
        this.configCentro = {
          horas: data.data.horas,
          km: data.data.km,
          condiciones_viaje: data.data.condiciones_viaje
        };
        this.tipoturneada = data.data.id_tipo_turneada;
        this.isTurneada = this.tipoturneada == 0 ? false : true;
        this.mostrardifusion = (this.configCentro.condiciones_viaje === 1) ? true : false;
        /* if (this.isTurneada) {
          this.getListaCentro();
        } */
      });
  }

  selectIntermediario(event) {
    const buscarSiTieneEmail = this.intermediarios.find(i => i.id === event.value.id)
    if (buscarSiTieneEmail) {
      this.cupoService.getTieneEmailCuit(buscarSiTieneEmail.cuit).subscribe(
        (res) => {
          if (res.data.tiene_email_notificacion == "NO") {
            let temp = this.listSinEmail.find(
              (item) => item.cuit == buscarSiTieneEmail.cuit
            );
            if (temp == undefined) {
              let item = new CentroSinEMail();
              item.cuit = buscarSiTieneEmail.cuit;
              item.razon_social = res.data.razon_social;
              item.email = [];
              item.id = parseInt(res.data.id_usuario);
              this.listSinEmail.push(item);
            }
          }
        },
        (error) => { }
      );
    }
  }

  displayFn(option?: Origen): string | undefined {
    return option ? option.descripcion : undefined;
  }

  private _filter(descripcion: string): Origen[] {
    const filterValue = descripcion.toLowerCase();
    return this.origenes.filter(
      option => option.descripcion.toLowerCase().indexOf(filterValue) >= 0
    );
  }

  displayFnc(option_c?: Dador): string | undefined {
    return option_c ? option_c.nombre_cliente : undefined;
  }
  displayFnc1(option_c?: DadorPrePedido): string | undefined {
    return option_c ? option_c.descripcion : undefined;
  }

  private _filterd(nombre_cliente: string): Dador[] {
    const filterValue_c = nombre_cliente.toLowerCase();
    return this.dadores.filter(
      option_c =>
        option_c.nombre_cliente.toLowerCase().indexOf(filterValue_c) >= 0
    );
  }
  private _filterd2(descripcion: string): DadorPrePedido[] {
    const filterValue_c = descripcion.toLowerCase();
    return this.dadoresPrePedido.filter(
      option_c =>
        option_c.descripcion.toLowerCase().indexOf(filterValue_c) >= 0
    );
  }

  displayFncZ(option_z?: ZonaDestino): string | undefined {
    return option_z ? option_z.descripcion : undefined;
  }

  private _filterz(descripcion: string): ZonaDestino[] {
    const filterValue_z = descripcion.toLowerCase();
    return this.zonas.filter(
      option_z => option_z.descripcion.toLowerCase().indexOf(filterValue_z) >= 0
    );
  }

  getItems() {
    this.getItemsOrigen();
    if (!this.es_cupo) {
      console.log('ES prepedido:', this.esPrePedido);
      if (!this.esPrePedido) {
        this.getItemsZona();
        this.getItemsDador();
      } else {
        this.getItemsZonaPrepedido();
        this.getItemsDadorPrePedido();
      }
    } else {
      this.getItemsDador();
    };

    this.getItemsProductos();
    // this.getItemIntermediarios();
    // this.getItemOperadores();
  }

  getItemsOrigen() {
    this.getItemSub = this.nomencladoresService
      .getAllOrigenesSelect()
      .subscribe(data => {
        this.origenes = data.data;
        if (this.origenes.length > 0) {
          let id = this.origenes[0].id;
          let descripcion = this.origenes[0].descripcion;

          if (this.data.id_origen && this.data.id_origen > 0) {
            let id_origen = this.data.id_origen;
            let response = this.origenes.filter(function (e) {
              return e.id === id_origen;
            });
            id = response[0].id;
            descripcion = response[0].descripcion;
          }

          if (this.data.payload.cupos[0].origen) {
            this.addPedidoForm.controls["id_origen"].setValue(this.data.payload.cupos[0].origen.id);
            this.addPedidoForm.controls["nombre_origen"].setValue(this.data.payload.cupos[0].origen.descripcion);
            this.addPedidoForm.controls["nombre_origen"].disable();
          } else {
            this.addPedidoForm.controls['nombre_origen'].setValue(descripcion);
            this.addPedidoForm.controls['id_origen'].setValue(id);
          }


          this.filteredOptions = this.addPedidoForm.controls[
            "nombre_origen"
          ].valueChanges.pipe(
            startWith<string | Origen>(""),
            map(value => (typeof value === "string" ? value : value.descripcion)),
            map(descripcion =>
              descripcion ? this._filter(descripcion) : this.origenes.slice()
            )
          );
        }

      });
  }

  selectedOrigin(event) {
    let response = this.origenes.filter(function (e) {
      return e.descripcion === event.option.value;
    });

    this.addPedidoForm.controls['id_origen'].setValue(response[0].id);
  }

  getItemsZona() {
    this.getItemSub = this.nomencladoresService
      .getAllZonas()
      .subscribe(data => {
        this.zonas = data.data;
        this.filteredselectedZona = this.addPedidoForm.controls[
          "selectedZona"
        ].valueChanges.pipe(
          startWith<string | ZonaDestino>(""),
          map(value => (typeof value === "string" ? value : value.descripcion)),
          map(descripcion =>
            descripcion ? this._filterz(descripcion) : this.zonas.slice()
          )
        );
      });
  }
  getItemsZonaPrepedido() {
    this.getItemSub = this.nomencladoresService
      .getAllZonasPrepedido(this.data.payload.zona_destino)
      .subscribe(data => {
        this.zonas = data.data;
        if (this.zonas.length > 0) {
          if (this.zonas.length == 1) {
            this.addPedidoForm.controls["selectedZona"].setValue(this.zonas[0]);
          } else {

            this.filteredselectedZona = this.addPedidoForm.controls[
              "selectedZona"
            ].valueChanges.pipe(
              startWith<string | ZonaDestino>(""),
              map(value => (typeof value === "string" ? value : value.descripcion)),
              map(descripcion =>
                descripcion ? this._filterz(descripcion) : this.zonas.slice()
              )
            );
          }
        } else {
          this.getItemSub = this.nomencladoresService
            .getAllZonas()
            .subscribe(data => {
              this.zonas = data.data;
              this.filteredselectedZona = this.addPedidoForm.controls[
                "selectedZona"
              ].valueChanges.pipe(
                startWith<string | ZonaDestino>(""),
                map(value => (typeof value === "string" ? value : value.descripcion)),
                map(descripcion =>
                  descripcion ? this._filterz(descripcion) : this.zonas.slice()
                )
              );
            });
        }
      });
  }

  getItemsDador() {
    this.getItemSub = this.nomencladoresService
      .getAllDadores()
      .subscribe(data => {
        this.dadores = data.data;
        console.log(this.dadores);
        /* this.filteredselectedDador = this.addPedidoForm.controls[
          "selectedDador"
        ].valueChanges.pipe(
          startWith<string | Dador>(""),
          map(value =>
            typeof value === "string" ? value : value.nombre_cliente
          ),
          map(nombre_cliente =>
            nombre_cliente
              ? this._filterd(nombre_cliente)
              : this.dadores.slice()
          )
        ); */


        this.personasService
          .getDadorCuit(localStorage.getItem("cuit_cuil")).subscribe(ok => {
            console.log(ok.data.id_usuario)

            this.addPedidoForm.controls["selectedDador"].setValue(this.dadores.find(dador => dador['id_usuario'] == ok.data.id_usuario))
          })

        /*  this.userService.getIdPersonaRol(localStorage.getItem('rol')).subscribe(ok=>{
           console.log(ok)

         }) */

      });
  }
  getItemsDadorPrePedido() {
    this.getItemSub = this.nomencladoresService
      .getDadoresPrePedido(this.data.payload.remitente)
      .subscribe(data => {
        this.dadoresPrePedido = data.data;
        if (this.dadoresPrePedido.length > 0) {
          if (this.dadoresPrePedido.length == 1) {
            this.addPedidoForm.controls["selectedDador"].setValue(this.dadoresPrePedido[0]);
          } else {
            this.filteredselectedDadorPrePedido = this.addPedidoForm.controls[
              "selectedDador"
            ].valueChanges.pipe(
              startWith<string | DadorPrePedido>(""),
              map(value =>
                typeof value === "string" ? value : value.descripcion
              ),
              map(descripcion =>
                descripcion
                  ? this._filterd2(descripcion)
                  : this.dadoresPrePedido.slice()
              )
            );
          }
        } else {
          this.getItemSub = this.nomencladoresService
            .getAllDadores()
            .subscribe(data => {
              this.dadores = data.data;
              this.filteredselectedDador = this.addPedidoForm.controls[
                "selectedDador"
              ].valueChanges.pipe(
                startWith<string | Dador>(""),
                map(value =>
                  typeof value === "string" ? value : value.nombre_cliente
                ),
                map(nombre_cliente =>
                  nombre_cliente
                    ? this._filterd(nombre_cliente)
                    : this.dadores.slice()
                )
              );
            });
        }
      });
  }

  getItemIntermediarios() {
    this.loader.open('Buscando transportadoras');
    this.getItemSub = this.centrosService
      .getIntermediarioByIdCentroSelect()
      .subscribe(data => {
        this.intermediarios = data.data;
        this.loader.close();
      });
  }

  getItemOperadores() {
    this.loader.open('Buscando Operadores');
    this.getItemSub = this.centrosService
      .getOperadoreByIdCentroSelect()
      .subscribe(data => {
        this.loader.close();
        this.operadores = data.data;
      });
  }

  getItemsProductos() {
    this.getItemSub = this.nomencladoresService
      .getAllProductosSelect()
      .subscribe(data => {
        this.productos = data.data;
        if (this.esPrePedido) {
          this.productos.forEach(element => {
            if (element.descripcion.toLowerCase() == this.data.payload.producto.toLowerCase())
              this.addPedidoForm.controls['selectedProducto'].setValue(element.id);
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
    this.f.id_lista.setValue("");
    if (!this.es_cupo) {
      this.f.ckUsarTurneada.setValue(false);
      this.mostrarOpciondifusion = true;
      this.showListDisponibles = false;

      /* if (this.tipoturneada !== 0) {
        this.getListaCentro();
      } */
    }
    this.f.selectedZona.setValue("");
    this.f.selectedDador.setValue("");
    this.f.quantity.setValue("");
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
  validForm(): boolean {
    let cant = 0;
    this.dataSource.data.forEach(element => {
      cant += element.cantidad
    });
    const validCant = cant == this.addPedidoForm.controls['quantity'].value;
    const value = (this.addPedidoForm.invalid || !this.validTurneada || !this.validOperador || !this.validIntermediario || validCant) && this.dataSource.data.length > 0;
    return !value
  }
  submitForm() {
    let valid = this.listSinEmail.length > 0 ? false : true;
    if (valid) {
      this.postPedido();
    } else {
      this.listSinEmail.forEach((element) => {
        this.openPopUpSinEmail(element);
      });
    }
  }
  postPedido() {
    let descripcion = this.addPedidoForm.controls["nombre_origen"].value;
    let response;
    if (this.origenes && this.origenes.length > 0) {
      response = this.origenes.filter(function (e) {
        return e.descripcion === descripcion;
      });
    } else {
      response = [];
    }


    let asignaciones: any = [];
    let allCupos = [];
    this.data.payload.cupos.forEach(element => {
      allCupos.push(element.id)
    });

    this.dataSource.data.forEach(element => {
      let cupos: any = [];
      for (var i = element.cantidad - 1; i >= 0; i--) {
        cupos.push(allCupos[0]);
        allCupos.splice(0, 1);
      }
      const elem = {
        id_transportadora: element.id,
        id_oferta: null,
        id_origen: response.length > 0 ? this.addPedidoForm.controls["id_origen"].value : "",
        nombre_origen: this.addPedidoForm.controls["nombre_origen"].value,
        cupos: cupos,
      }
      asignaciones.push(elem);
    });
    let sinEmail = [];

    if (this.listSinEmail.length > 0) {
      this.listSinEmail.forEach((element) => {
        let emails = "";
        for (let index = 0; index < element.email.length; index++) {
          const email = element.email[index];
          if (emails == "") {
            emails += email;
          } else {
            emails += ";" + email;
          }
        }
        if (emails != "") {
          sinEmail.push({
            id: element.id,
            email: emails,
          });
        }
      });
    }
    const data = {
      asignaciones: asignaciones,
      notificacion: 1,
      sinEmail: sinEmail.length > 0 ? sinEmail : [],
      canal: "WEB"
    }
    this.loader.open();
    this.nomencladoresService.postDerivar(data).subscribe((data: any) => {
      console.log(data)
      this.getItems();
      this.loader.close();
      this.initValue();
      ELEMENT_DATA = [];
      this.alertService
        .confirm({
          message: "¡Pedido agregado correctamente!",
          tipo: "exito"
        })
        .subscribe(res => {
          if (res) {
            this.dialogLocaRef.close();
            return;
          }
        });
    }, error => {
      this.loader.close();
      this.errorService
        .confirm({
          message: error.error.data[0].message
        })
        .subscribe(res => {
          if (res) {
            this.dialogLocaRef.close();
            return;
          }
        });
    });
  }

  openPopUpSinEmail(dato: CentroSinEMail) {
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      UsuarioSinEmailComponent,
      {
        width: "50vw",
        disableClose: false,
        data: {
          title: " asignando cupos",
          payload: {
            cuit: dato.cuit,
            razon: dato.razon_social,
            emails: dato.email,
          },
        },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        let temp = this.listSinEmail.find((item) => item.cuit === res.cuit);
        temp.email = res.email;
        temp.omitir = res.omitir;
        let valido = this.validarSendNotificacion();
        if (valido) {
          this.postPedido();
        }
      }

      return;
    });
  }

  closeAutocompleteOptions() {
    if (this.autocompleteTrigger) {
      this.autocompleteTrigger.closePanel();
    }
  }

  validarSendNotificacion(): boolean {
    let cant = 0;
    if (this.listSinEmail.length > 0) {
      this.listSinEmail.forEach((element) => {
        if (element.email.length > 0 || element.omitir) {
          cant++;
        }
      });
      if (cant === this.listSinEmail.length) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  gotoHome() {
    this.dialogLocaRef.close('1');
  }

  goAsignarViaje() {
    let validaId: boolean = true;
    if (
      this.f.selectedOrigen.value.id === undefined ||
      this.f.selectedOrigen.value.id === null
    ) {
      this.errorService.confirm({
        message: "Debe seleccionar un lugar de carga de la lista desplegable"
      });
      validaId = false;
    }
    if (
      this.f.selectedDador.value.id_centro === undefined ||
      this.f.selectedDador.value.id_centro === null
    ) {
      this.errorService.confirm({
        message: "Debe seleccionar un cargador de la lista desplegable"
      });
      validaId = false;
    }
    if (
      !this.es_cupo &&
      (this.f.selectedZona.value.id === undefined ||
        this.f.selectedZona.value.id === null)
    ) {
      this.errorService.confirm({
        message: "Debe seleccionar una zona de destino de la lista desplegable"
      });
      validaId = false;
    }

    if (validaId) {
      if (this.f.ckIntermediario.value) {
        // se seleccionó el checkbox
        let idIntermediario: any = this.dataSource.filteredData;
        if (idIntermediario.length > 0) {
          const newPedido = {
            fecha_desde: this.f.desdeDate.value,
            fecha_hasta: this.f.hastaDate.value,

            id_origen: this.f.selectedOrigen.value.id,
            id_zona_destino: !this.es_cupo ? this.f.selectedZona.value.id : 0,
            id_cliente: this.f.selectedDador.value.id_cliente,

            id_centro: this.idCentro,
            cantidad: this.f.quantity.value,
            contrato: this.f.contrato.value,
            observaciones: this.f.observaciones.value,
            reduccion: 0,
            id_producto: this.f.selectedProducto.value,
            bloqueado: 0,
            id_generador: this.idCentro,
            id_operador:
              localStorage.getItem("rol") === "11"
                ? localStorage.getItem("id_operador")
                : "",
            difundido:
              this.condicionesviaje === null
                ? 0
                : this.condicionesviaje.selectedTipoDifusion === undefined ||
                  this.condicionesviaje.selectedTipoDifusion === null
                  ? 0
                  : this.condicionesviaje.selectedTipoDifusion,
            tipo: 1,
            id_lista: this.f.id_lista.value
          };
          this.nomencladoresService.postPedido(newPedido).subscribe(
            data => {
              this.idPedido = data.data.id;
              if (this.configCentro.condiciones_viaje === 1) {
                if (this.selectedDifusion) {
                  this.addCondicionesViaje();
                }
              }
              if (this.cupo !== undefined) {
                let datadesglose = {
                  id_centro: this.idCentro,
                  id_pedido: this.idPedido,
                  intermediarios: idIntermediario,
                  cupos: this.cupo
                };
                this.nomencladoresService
                  .desglosarPedidoCupo(datadesglose)
                  .subscribe(data => {
                    if (data.success) {
                      this.loader.close();
                    } else {
                      this.loader.close();
                      this.errorService.confirm({
                        message: "Error!:" + data.data
                      });
                    }
                  });
              } else {
                let datadesglose = {
                  id_centro: this.idCentro,
                  id_pedido: this.idPedido,
                  intermediarios: idIntermediario
                };
                this.nomencladoresService
                  .desglosarPedido(datadesglose)
                  .subscribe(data => {
                    if (data.success) {
                      this.loader.close();
                      this.actCupoPedido(this.idPedido);
                    } else {
                      this.loader.close();
                      this.errorService.confirm({
                        message: "Error!:" + data.data
                      });
                    }
                  });
              }
              if (this.busqueda !== undefined) {
                this.busqueda.id_pedido = data.data.id;
                this.busqueda.finalizada = 1;
                this.centrosService
                  .putBusqueda(this.busqueda)
                  .subscribe(data => {
                    if (data.success) {
                      this.loader.close();
                      return;
                    } else {
                      this.loader.close();
                      this.errorService.confirm({
                        message: "Error!:" + data.data
                      });
                    }
                  });
              }
              this.getItems();
              this.loader.close();
              this.initValue();
              ELEMENT_DATA = [];
              this.alertService
                .confirm({
                  message: "¡Pedido agregado correctamente!",
                  tipo: "exito"
                })
                .subscribe(res => {
                  if (res) {
                    if (this.es_cupo) {
                      this.gotoHome();
                    }
                    return;
                  }
                });
              this.router.navigateByUrl("/home/asignarViaje/" + this.idPedido);
              this.dialogLocaRef.close();
            },
            err => {
              this.loader.close();
              this.errorService
                .confirm({
                  message: "El Pedido no se pudo agregar, intentelo nuevamente"
                })
                .subscribe(res => {
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
                "El Pedido no se pudo agregar, no seleccionó un Intermediario"
            })
            .subscribe(res => {
              if (res) {
                return;
              }
            });
        }
      } else {
        let valoroperador = "";
        if (localStorage.getItem("rol") === "11") {
          valoroperador = localStorage.getItem("id_operador");
        } else {
          if (
            this.mostrarOperador === true &&
            this.f.selectedOperador.value !== ""
          ) {
            valoroperador = this.f.selectedOperador.value;
          }
        }

        const newPedido = {
          fecha_desde: this.f.desdeDate.value,
          fecha_hasta: this.f.hastaDate.value,
          id_origen: this.f.selectedOrigen.value.id,
          id_zona_destino: !this.es_cupo ? this.f.selectedZona.value.id : 0,
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
          tipo: 1,
          id_lista: this.f.id_lista.value
        };
        this.loader.open();
        this.nomencladoresService.postPedido(newPedido).subscribe(
          data => {
            this.idPedido = data.data.id;
            if (this.configCentro.condiciones_viaje === 1) {
              //if (this.addPedidoForm.controls['difundido'].value) {
              if (this.selectedDifusion) {
                this.addCondicionesViaje();
              }
            }
            if (this.busqueda !== undefined) {
              this.busqueda.id_pedido = data.data.id;
              this.busqueda.finalizada = 1;
              this.centrosService.putBusqueda(this.busqueda).subscribe(data => {
                if (data.success) {
                  this.loader.close();
                  return;
                } else {
                  this.loader.close();
                  this.errorService.confirm({ message: "Error!:" + data.data });
                }
              });
            }
            if (this.cupo !== undefined) {
              this.actCupoPedido(this.idPedido);
            }
            this.getItems();
            this.loader.close();
            this.alertService
              .confirm({
                message: "Pedido agregado correctamente!",
                tipo: "exito"
              })
              .subscribe(res => {
                if (res) {
                  if (this.es_cupo) {
                    this.gotoHome();
                  }
                  return;
                }
              });
            this.router.navigateByUrl("/home/asignarViaje/" + this.idPedido);
            this.dialogLocaRef.close();
          },
          err => {
            this.loader.close();
            this.errorService
              .confirm({
                message: "El Pedido no se pudo agregar, intentelo nuevamente."
              })
              .subscribe(res => {
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
      data: { title: title, payload: {}, isNew: true }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.loader.open();
      res.telefono = res.telefono.toString();
      this.origenesService.postOrigen(res).subscribe(
        data => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.getItemsOrigen();
          this.alertService
            .confirm({ message: "¡Lugar de Carga Agregado!", tipo: "exito" })
            .subscribe(res => {
              if (res) {
                return;
              }
            });
        },
        err => {
          this.loader.close();
          this.atencionService
            .confirm({ message: err.data.message[0].errors })
            .subscribe(res => {
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
        data: { title: title }
      }
    );

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.loader.open();
      this.centrosService.postCentroCliente(res).subscribe(
        data => {
          if (this.loader !== null) {
            this.loader.close();
          }
          //  this.getItemsDador();
          this.alertService
            .confirm({ message: "¡Cargador agregado!", tipo: "exito" })
            .subscribe(res => {
              if (res) {
                return;
              }
            });
        },
        err => {
          this.loader.close();
          this.atencionService
            .confirm({ message: "No se pudo agregar el Cargador." })
            .subscribe(res => {
              if (res) {
                return;
              }
            });
        }
      );
    });
  }

  getListaCentro() {
    this.loader.open('Buscando Listas')
    this.getItemSub = this.centrosService.getAllListaCentro2(this.tipoturneada)
      .subscribe(data => {
        this.loader.close();
        this.listaTurneadas = data.data;
        this.mostrarTurneada = !this.es_cupo ? (this.tipoturneada > 0 && data.data.length > 0 ? true : false) : false;
      });
  }

  onChangeTurneada(event) {
    this.mostrarOpciondifusion = !event.checked;
    this.checkTurneada = event.checked;
    this.validTurneada = event.checked ? (this.addPedidoForm.controls['id_lista'].value == "" ? false : true) : true;
    this.getListaCentro();
  }

  onChangeIntermediario(event) {
    this.mostrarIntermediario = event.checked;
    if (event.checked) {
      this.mostrarOperador = false;
      //this.addPedidoForm.controls["ckIntermediario"].setValue(false);
      this.validIntermediario = event.checked ? (ELEMENT_DATA.length === 0 ? false : true) : true;
      this.getItemIntermediarios();
    } else {
      this.validIntermediario = true;
    }
  }

  onChangeOperador(event) {
    this.mostrarOperador = event.checked;
    if (event.checked) {
      this.mostrarIntermediario = false;
      //this.addPedidoForm.controls["ckOperador"].setValue(false);
      this.addPedidoForm.controls["selectedOperador"].setValue("");
      this.validOperador = event.checked ? (this.addPedidoForm.controls['selectedOperador'].value == "" ? false : true) : true;
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
    this.validTurneada = this.checkTurneada ? (this.addPedidoForm.controls['id_lista'].value == "" ? false : true) : true;
    if (event.target.value <= 0) {
      this.addPedidoForm.controls["quantity"].setValue("");
      this.addPedidoForm.controls["quantity"].setErrors(
        Validators.required
      );
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
            this.addPedidoForm.controls["selectedIntermediario"].value.id
          )
        ) {
          this.cantidadisponible -= this.addPedidoForm.controls[
            "cantidad"
          ].value;
          this.validIntermediario = true;
          ELEMENT_DATA.push({
            intermediario: this.obtenerNombreInter(
              this.addPedidoForm.controls["selectedIntermediario"].value.id
            ),
            cantidad: this.addPedidoForm.controls["cantidad"].value,
            id: this.addPedidoForm.controls["selectedIntermediario"].value.id_usuario
          });
          this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        } else {
          this.atencionService.confirm({
            message: "El intermediario ya existe!"
          });
        }
      } else {
        this.atencionService.confirm({
          message:
            "No puede asignar una cantidad mayor que la cantidad disponible!"
        });
      }
    } else {
      this.atencionService.confirm({
        message: "La cantidad debe ser mayor  que cero!"
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



  openPopCondicionesViaje(option: boolean, event) {
    if (event.checked) {
      if (option) {
        let title = "Condiciones del viaje";
        let dialogRef: MatDialogRef<any> = this.dialog.open(
          CondicionesViajeComponent,
          {
            width: "720px",
            height: "95vh",
            disableClose: true,
            data: { title: title, payload: { tipopedido: "largo" } }
          }
        );
        dialogRef.afterClosed().subscribe(res => {
          if (!res) {
            // If user press cancel
            this.addPedidoForm.controls['ckDifusion'].setValue(false);
            this.addPedidoForm.controls["difundido"].setValue(false);
            if (this.tipocentro === "2") {
              this.addPedidoForm.controls["difundido"].setErrors(
                Validators.required
              );
              this.addPedidoForm.controls["difundido"].markAsDirty();
              this.alertService.confirm({
                message: "Debe realizar la difusión!"
              });
            }
            return;
          }
          this.labelDifusion = 'Difusión cargada'
          this.selectedDifusion = true;
          this.condicionesviaje = res;
        });
      } else {
        this.selectedDifusion = false;
        this.condicionesviaje = {};
      }
    } else {
      this.labelDifusion = 'Difusión no cargada'
      this.selectedDifusion = false;
      this.condicionesviaje = {};
    }
  }

  addCondicionesViaje() {
    this.condicionesviaje.id_pedido = this.idPedido;
    this.nomencladoresService
      .postPedidoCondiciones(this.condicionesviaje)
      .subscribe(
        data => {
          this.labelDifusion = 'Difusión no cargada';
          const vpedidoacoplados = [];
          for (let i = 0; i < this.condicionesviaje.tipo_acoplado.length; i++) {
            vpedidoacoplados.push({
              id_pedido: this.idPedido,
              id_tipo_acoplado: this.condicionesviaje.tipo_acoplado[i]
            });
            this.nomencladoresService
              .postPedidoTipoAcoplado({
                id_pedido: this.idPedido,
                id_tipo_acoplado: this.condicionesviaje.tipo_acoplado[i]
              })
              .subscribe(
                data1 => {
                },
                err => { }
              );
          }

          for (let i = 0; i < this.condicionesviaje.zona_ideal.length; i++) {
            this.nomencladoresService
              .postPedidoZonaIdeal({
                id_pedido: this.idPedido,
                id_zona_ideal: this.condicionesviaje.zona_ideal[i]
              })
              .subscribe(
                data1 => {
                },
                err => { }
              );
          }
        },
        err => {
          this.errorService
            .confirm({
              message:
                "Las condiciones del pedido no se pudo agregar, intentelo nuevamente."
            })
            .subscribe(res => {
              if (res) {
                return;
              }
            });
        }
      );
  }

  actCupoPedido(idpedido) {
    this.cupo.forEach(element => {
      let dat = {
        id_pedido: idpedido,
        id: element.id
      };
      this.homeService.putCupo(dat).subscribe(
        data => {
          if (data) {
            return;
          }
        },
        err => {
          this.errorService.confirm({
            message:
              "Error! No se puede asignar pedido a los cupos seleccionados"
          });
          return;
        }
      );
    });
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
        height: '88vh',
        disableClose: true,
        data: { title: title, payload: { id_pedido: id_pedido } }
      }
    );
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }

      return;
    });
  }
  sendMessage(): void {
    // send message to subscribers via observable subject
    this.messageService.sendMessage('Nuevo Pedido');
  }

}
