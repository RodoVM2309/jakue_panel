/// <reference types="@types/googlemaps" />
import {
  ChangeDetectorRef,
  Component, ElementRef, Inject, OnInit,
  ViewChild
} from "@angular/core";
import {
  FormControl, FormGroup, Validators
} from "@angular/forms";
import {
  DateAdapter, MatDialog, MatDialogRef, MatTableDataSource, MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_DIALOG_DATA
} from "@angular/material";
import {
  AppDateAdapter,
  APP_DATE_FORMATS
} from "@shared/helpers/date.adapter";
import { Observable, Subscription } from "rxjs";
import { AppAlertService } from "../../../../shared/services/app-alert/app-alert.service";
import { AppErrorService } from "../../../../shared/services/app-error/app-error.service";
import { AppLoaderService } from "../../../../shared/services/app-loader/app-loader.service";
import { NomencladoresService } from "../../../services/nomencladores.service";
import { UserService } from "../../../services/user.service";

import { AppAtencionService, AppConfirmService, CentrosService, PersonasService } from "@app/shared/services";
import { AddChoferComponent } from "@app/views/admin/personas/add-chofer/add-chofer.component";
import { map, startWith } from "rxjs/operators";
import { Dador } from "../../../models/dador";
import { Origen } from "../../../models/origen";
import { EditPatenteComponent } from "../edit-patente/edit-patente.component";
import { EditPhoneComponent } from "./editPhone/editPhone.component";
declare let googlemaps: any;
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { dataHorarioPuerto, HorarioService } from "./services/horario.service";



@Component({
  selector: "app-add-pedido-rapido",
  templateUrl: "./add-pedido-rapido.component.html",
  styleUrls: ["./add-pedido-rapido.component.scss"],
  providers: [
    UserService,
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
export class AddPedidoRapidoComponent implements OnInit {
  @ViewChild("choferCuit") choferCuit: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  formData = {};
  addPedidoForm: FormGroup;
  chofercuit: any;
  idChofer;
  public getItemSub: Subscription;
  dadores: Dador;
  origenes: Origen[];
  public isInvalid: any;
  public incorrect_chofer_cuit: boolean = false;
  public disponible_chofer_cuit: boolean = true;
  public searchControl: FormControl;
  public greaterThanValue: any;
  public lessThanValue: any;
  filteredOptions: Observable<Origen[]>;
  filteredid_cliente: Observable<Dador[]>;
  public isDisabled: boolean;

  public unidadtipotarifa = "tn";
  @ViewChild("search")
  public searchElementRef: ElementRef;
  public dd = [];

  arrayBuffer: any;
  file: File;

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ["id", "descripcion", "acciones"];

  min = 10;
  max = 99;
  minValue: any;
  maxValue: any;
  maxValue2: any;
  esValidadoChofer: boolean = false;
  phoneNumberPattern = "^[0-9]{9,15}$";

  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filterData: Observable<string[]>;
  disabledOrigen: boolean = false;

  dataHorarios: dataHorarioPuerto[] =[];
  titleTurno: string='Turnos';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public cd: ChangeDetectorRef,
    private userService: UserService,
    private errorService: AppErrorService,
    private alertService: AppAlertService,
    private atencionService: AppAtencionService,
    private centrosService: CentrosService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private dialog: MatDialog,
    private horarioServices: HorarioService,
    private personasService: PersonasService,
    public nomencladoresService: NomencladoresService,
    public dialogRef: MatDialogRef<AddPedidoRapidoComponent>
  ) {
   }


  async ngOnInit() {
    const numericNumberReg = "^-?[0-9]\\d*(\\.\\d{1,2})?$";
    this.addPedidoForm = new FormGroup({
      choferCuit: new FormControl("", [Validators.required,
      ]),
      id_origen: new FormControl(this.data.id_origen),
      nombre_origen: new FormControl(this.data.origen_descripcion, [Validators.required,
      ]),
      id_cliente: new FormControl(""),
      id_cupo: new FormControl(this.data),
      razon_social: new FormControl(""),
      telefono: new FormControl(""),
      chapa_camion: new FormControl(""),
      chapa_acoplado: new FormControl(""),
      id_turno: new FormControl(),
    });

    if ( this.data.dador_turno_destino && this.data.dador_turno_destino === '1') {
      this.addPedidoForm.controls['id_turno'].setValidators([Validators.required]);
    } else {
      this.addPedidoForm.controls['id_turno'].clearValidators();
    }


    this.getItemsDador();
    this.getItemsOrigen();
    if(this.data.dador_turno_destino==='1'){
      await this.getHorarioPuerto();
    }
    this.addPedidoForm.get('id_turno').valueChanges.subscribe(
      value=>{
        console.log(value);
      }
    );

    this.searchControl = new FormControl();

    this.data.origen_descripcion ? this.addPedidoForm.controls["nombre_origen"].disable() : false;

    if (this.data.isUpdate) {
      this.f.choferCuit.setValue(this.data.cuitChofer)
      this.personasService
        .getChoferCuit(this.data.cuitChofer)
        .subscribe(data => {
          this.esValidadoChofer = true;
          this.idChofer = data.data.transportistas[0].id_chofer
          this.f.telefono.setValue(data.data.transportistas[0].celular);
          this.f.razon_social.setValue(data.data.transportistas[0].nombre_chofer);
          this.f.chapa_camion.setValue(data.data.transportistas[0].patente_camion);
          this.f.chapa_acoplado.setValue(data.data.transportistas[0].patente_acoplado);
          this.incorrect_chofer_cuit = false;
        });
    }

  }
  selectedRol: any;

  async getHorarioPuerto() {
    let idDestino: number = this.data.id_destino;
    let idCupo: number = this.data.cupo;
    
    await this.horarioServices.getHorarioPuerto(idDestino, idCupo).toPromise().then(result => {
      this.dataHorarios = result.data;
      if(this.dataHorarios.length===0){
          this.titleTurno='No se encontraron turnos disponibles'
      }else{
        this.data.turno = Number(this.data.turno);
        this.addPedidoForm.controls['id_turno'].setValue(this.data.turno);
        this.cd.detectChanges();
      }
    });
  }

  private _filter(descripcion: string): Origen[] {
    const filterValue = descripcion.toLowerCase();
    return this.origenes.filter(
      option => option.descripcion.toLowerCase().indexOf(filterValue) >= 0
    );
  }

  openAutocompleteOptions() {
    if (this.autocompleteTrigger) {
      this.autocompleteTrigger.openPanel();
    }
  }

  closeAutocompleteOptions() {
    if (this.autocompleteTrigger) {
      this.autocompleteTrigger.closePanel();
    }
  }

  updateChapas() {
    let dialogRefChapas: MatDialogRef<any> = this.dialog.open(
      EditPatenteComponent,
      {
        width: "720px",
        disableClose: true,
        data: { idChofer: this.idChofer, isUpdate: this.data.isUpdate, id_cupo_terminal: this.data.id_cupo_terminal }
      }
    );
    dialogRefChapas.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      // actualizar inputs
      if (res.success) {
        this.addPedidoForm.controls['chapa_camion'].patchValue(res.data.camion)
        this.addPedidoForm.controls['chapa_acoplado'].patchValue(res.data.acoplado)
      }
      return;
    });
  }

  editPhone() {
    if (this.f.telefono.value) {
      let dialogRefPhone: MatDialogRef<any> = this.dialog.open(
        EditPhoneComponent,
        {
          width: "520px",
          disableClose: true,
          data: { idChofer: this.idChofer, telefono: this.f.telefono.value, id_cupo: this.data.cupo }
        }
      );
      dialogRefPhone.afterClosed().subscribe(res => {
        if (res.success) {
          this.f.telefono.patchValue(res.data.telefono);
        }
        return;
      });
    }
  }


  getItemsOrigen() {
    if(!this.data.isProveedor || this.data.es_derivacion){
      this.addPedidoForm.controls['nombre_origen'].setValue(this.data.origen_descripcion);
      this.addPedidoForm.controls['id_origen'].setValue(this.data.id_origen);
      this.addPedidoForm.controls['nombre_origen'].disable();
      return false;
    }
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
          
          this.addPedidoForm.controls['nombre_origen'].setValue(descripcion);
          this.addPedidoForm.controls['id_origen'].setValue(id);

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

  getItemsDador() {
    this.getItemSub = this.nomencladoresService
      .getAllDadores()
      .subscribe(data => {
        this.dadores = data.data;
        this.filteredid_cliente = this.addPedidoForm.controls[
          "id_cliente"
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
  get f() {
    return this.addPedidoForm.controls;
  }

  private _filterd(nombre_cliente: string): Dador[] {
    const filterValue_c = nombre_cliente.toLowerCase();
    return this.dadores.filter(
      option_c =>
        option_c.nombre_cliente.toLowerCase().indexOf(filterValue_c) >= 0
    );
  }
  comprobarChoferCuit() {
    this.incorrect_chofer_cuit = true;
    this.addPedidoForm.invalid;
    let cuit = this.addPedidoForm.controls["choferCuit"].value;
    this.userService
      .esChoferCuit(this.addPedidoForm.controls["choferCuit"].value)
      .subscribe(
        res => {
          this.incorrect_chofer_cuit = !res.data;
          if (res.data) {

            this.esValidadoChofer = true;
            this.personasService
              .getChoferCuit(cuit)
              .subscribe(data => {
                this.idChofer = data.data.transportistas[0].id_chofer;
                this.f.razon_social.setValue(data.data.transportistas[0].nombre_chofer);
                this.f.telefono.setValue(data.data.transportistas[0].celular);
                this.f.chapa_camion.setValue(data.data.transportistas[0].patente_camion);
                this.f.chapa_acoplado.setValue(data.data.transportistas[0].patente_acoplado);
                this.incorrect_chofer_cuit = false;
              });
          } else {
            this.confirmService.confirm({ message: ' No existe registro con esta Cédula de Identidad (C.I). ¿Desea ingresarlo como nuevo chofer?' })
              .subscribe(res => {
                if (res) {
                  let dialogRefPersona: MatDialogRef<any> = this.dialog.open(AddChoferComponent, {
                    width: '720px',
                    disableClose: false,
                    data: { title: 'Agregar chofer', payload: { cuit_cuil: cuit }, isNew: true }
                  });
                  dialogRefPersona.afterClosed()
                    .subscribe(res => {
                      if (!res) {
                        this.loader.close();
                        this.incorrect_chofer_cuit = true;
                        return;
                      } else {
                        this.esValidadoChofer = true;
                        this.f.razon_social.setValue(res.persona.razon_social);
                        this.f.chapa_camion.setValue(res.camion.patente);
                        this.f.chapa_acoplado.setValue(res.acoplado.patente);
                        this.f.telefono.setValue(res.persona.telefono);
                        this.incorrect_chofer_cuit = false;
                        /* data = res;
                          let id_usuario;
                          if (data.success) {
                            id_usuario = data.data.id;
                            this.personasService.postRolPersona({
                              id_rol: 3,
                              id_usuario: id_usuario
                            }).subscribe(data => {
                              this.itemForm.controls['id_interno'].setValue(data.data.id);
                              this.itemForm.controls['id'].setValue(id_usuario);
                              this.itemForm.controls['es_dador_cupo'].setValue(1);
                              this.itemForm.controls['es_cliente_final'].setValue(1);
                              this.itemForm.controls['cliente_muvin'].setValue(1);
                              this.personasService.getPersonaById(id_usuario)
                                .subscribe(data => {
                                  this.loader.close();
                                  this.datospersona = data.data;
                                  this.itemForm.controls['cuit_cuil'].setValue(this.datospersona.cuit_cuil);
                                  this.incorrectcuit = false;
                                });
                            }, err => {
                              this.loader.close();
                              this.alertService.confirm({ message: 'Hay errores!' });
                              this.incorrectcuit = true;
                            });
                          }
                          else
                            this.alertService.confirm({ message: 'Hay errores!' });
                         */
                      }
                    });
                } else {
                  this.loader.close();
                }
              });
          }
        },
        error => {

        }
      );
  }

  submit() {
    this.loader.open();
    let data;
    let response;
    let descripcion = this.addPedidoForm.controls["nombre_origen"].value;
    if(this.origenes){
      response = this.origenes.filter(function (e) {
        return e.descripcion === descripcion;
      });
    } else {
      response = [];
    }

    if (this.data.isUpdate) {
      data = Object.assign({}, {
        id_chofer: this.idChofer,
        id_viaje: this.data['idViaje'],
        id_origen: response.length > 0 ? this.addPedidoForm.controls["id_origen"].value : "",
        nombre_origen: this.addPedidoForm.controls["nombre_origen"].value,
        id_turno: this.addPedidoForm.controls["id_turno"].value ? this.addPedidoForm.controls["id_turno"].value: '',
        id_destino: Number(this.data.id_destino)
      });
      this.nomencladoresService.postUpdateViaje(data).subscribe(
        ok => {
          if (this.loader !== null) {
            this.loader.close();
          }

          this.alertService
            .confirm({
              message: "Chofer modificado correctamente!",
              tipo: "exito"
            })
            .subscribe(res => {
              this.loader.close();
              if (res) {
                this.dialogRef.close(true);
                return;
              }
            });
        },
        err => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.errorService.confirm({ message: err }).subscribe((res) => {
            this.loader.close();
            if (res) {
              this.dialogRef.close(false);
              return;
            }
          });
        }
      );
    } else {
     
      let data = Object.assign({}, {
        choferCuit: this.addPedidoForm.controls["choferCuit"].value,
        id_cliente: localStorage.getItem("id_persona"),
        id_origen: response.length > 0 ? this.addPedidoForm.controls["id_origen"].value : "",
        id_cupo: this.addPedidoForm.controls["id_cupo"].value.cupo,
        nombre_origen: this.addPedidoForm.controls["nombre_origen"].value,
        id_turno: this.addPedidoForm.controls["id_turno"].value ? this.addPedidoForm.controls["id_turno"].value: '',
        id_destino: Number(this.data.id_destino)
      });

      console.log('Data a enviar', data);

      this.nomencladoresService.postPedidoRapido(data).subscribe(
        data => {
          if (this.loader !== null) {
            this.loader.close();
          }

          this.alertService
            .confirm({
              message: "Chofer asignado correctamente!",
              tipo: "exito"
            })
            .subscribe(res => {
              this.loader.close();
              if (res) {
                this.dialogRef.close(true);
                return;
              }
            });
        },
      (err) => {
          if (this.loader !== null) {
            this.loader.close();
          }
           if(err["error"].data) {
            this.messageUpdateText(err["error"].data);
           } else {
            this.errorService.confirm({ message: err }).subscribe((res) => {
              this.loader.close();
              if (res) {
                this.dialogRef.close(false);
                return;
              }
            });
           }
        }
      );
    }
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
        this.loader.close();
        if (res) {
          this.dialogRef.close(true);
          return;
        }
      });
  }


  displayFn(option?: Origen): string | undefined {
    return option ? option.descripcion : undefined;
  }

  displayFnc(option_c?: Dador): string | undefined {
    return option_c ? option_c.nombre_cliente : undefined;
  }
  validateCodigoCosecha(value, tipo) {
    if (tipo === "desde") {
      this.addPedidoForm.controls["codigoCosecha2"].setValue(
        parseInt(value) + 1
      );
    } else {
      this.addPedidoForm.controls["codigoCosecha1"].setValue(
        parseInt(value) - 1
      );
    }
  }

  keyPressAlphanumeric(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  cancelar() {
    this.dialogRef.close(false);
  }

}
