import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
} from "@angular/core";
import {
  MatDialogRef,
  MatDialog,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_DIALOG_DATA,
  ThemePalette,
} from "@angular/material";
import {
  Validators,
  FormGroup,
  FormControl,
  FormBuilder,
  ValidatorFn,
  AbstractControl,
} from "@angular/forms";
import { empty, Subscription } from "rxjs";
import { NomencladoresService } from "../../../services/nomencladores.service";
import { CupoService } from "../cupo.service";
import { UserService } from "../../../services/user.service";
import { AppLoaderService } from "../../../../shared/services/app-loader/app-loader.service";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from "@shared/helpers/date.adapter";

import { AppErrorService } from "../../../../shared/services/app-error/app-error.service";
import { AppAlertService } from "../../../../shared/services/app-alert/app-alert.service";
import { CentroAdministraCuposComponent } from "../add-cupos-solicitados/centro-administra-cupos/centro-administra-cupos.component";
import { CentrosService } from "app/shared/services/centros.service";
import { PersonasService } from "app/shared/services/personas.service";
import { Observable } from "rxjs";
import { fromEvent } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter,
  startWith,
  tap,
  switchMap,
  finalize,
  delay,
} from "rxjs/operators";
import {
  IPersonRazonSocialResponse,
  PersonRazonSocial,
} from "app/shared/models/personRazonSocial";
import * as moment from "moment";
import { HomeService } from "../../home/home.service";
import { Persona } from "../../home/perfil/perfil.component";
import { RazonSocial } from "../add-cupos-disponibles/add-cupos-disponibles.component";

export class Producto {
  id: number;
  descripcion: string;
  codigo: number;
}
export class Solicitud {
  demandadoCuit?: string;
  corredor?: string;
  demandanteCuit?: string;
  contraparte?: string;
  destinatario?: string;
  id_producto: number;
  /* fechaCupo: string;
  fechaHasta: string;
  cantidad: string; */
  contrato: string;
  zona: string;
  //observaciones: string;
  codigoCosecha: string;
  id_demandante?: number;
  id_demandado?: number;
  id_gestiona?: number;
  id_zona_solicitud?: number;
  distribucion: Distribucion[];
  canal?: string;

}

export class Distribucion {
  fecha: string;
  cantidad: number;
  observaciones: string;
}
export class CentroDador {
  id: number;
  cuit: string;
  nombre_persona: string;
}

export class Zona {
  id: number;
  descripcion: string;
}

export class rowTablaFecha {
  id: number;
  fecha: string;
  cantidad: number;
  observ: string;
}
export interface Razon {
  razon_social: string;
  cuit_cuil;
}

@Component({
  selector: "app-add-cupos-solicitados-v2",
  templateUrl: "./add-cupos-solicitados-v2.component.html",
  styleUrls: ["./add-cupos-solicitados-v2.component.scss"],
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
export class AddCuposSolicitadosV2Component implements OnInit {
  @ViewChild("search")
  public searchElementRef: ElementRef;
  formData = {};
  addSolicitudForm: FormGroup;
  mensaje: string;
  public getItemSub: Subscription;
  medios: any;
  minDate = new Date();
  maxDate: any;
  minFecha = new Date();
  es_cupo = true;
  productos: Producto[];
  public searchControl: FormControl;
  public inactivo: boolean = false;
  public isDisabled: boolean;
  //incorrect_demandado_cuit: boolean = false;
  incorrect_corredor_cuit: boolean = false;
  esContraparteCorredor: boolean = false;
  esContraparteDador: boolean = false;
  isIncorrectContraparte: boolean = false;
  soyContraparte: boolean = false;
  noError = 0;
  mismo_cuit: boolean = false;
  incorrect_destino_cuit: boolean = false;
  incorrect_codigoCosecha: boolean = false;
  estado = true;
  min = 10;
  max = 99;
  minValue: any;
  maxValue: any;
  maxValue2: any;
  esDadorCupo: any;
  esCorredor: boolean;
  esClienteFinal: any;
  centroDadores: CentroDador[] = [];
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  validForm: boolean = false;
  isInicio: boolean = true;
  micuit: string;

  demandado = " (Sin definir)";

  zonas: Zona[] = [
    {
      id: 0,
      descripcion: "Sin especificar",
    },
  ];

  //filteredOptionsCorredores: Observable<Razon[]>;
  filteredOptionsCorredores: PersonRazonSocial[] = [];
  filteredOptionsContrapartes: PersonRazonSocial[] = [];
  filteredOptionsDestinatarios: PersonRazonSocial[] = [];
  filteredOptionsDestinatarios2: Observable<PersonRazonSocial[]>;
  isLoading = false;
  noEsCorredorDemandando = false;
  tablaFechas: rowTablaFecha[] = [];
  cantDias = 7;
  cantidadCupos = 0;
  selectedFecha = false;
  invalidFechaCant = false;
  personEmpty = new PersonRazonSocial("", "");

  @ViewChild("demandadoCuit") demandadoCuit: ElementRef;
  @ViewChild("contraparte") contraparte: ElementRef;
  @ViewChild("destinatario") destinatario: ElementRef;
  @ViewChild("nombredemandado") nombredemandado: ElementRef;
  @ViewChild("nombredestinatario") nombredestinatario: ElementRef;
  @ViewChild("nombrecontraparte") nombrecontraparte: ElementRef;

  color: ThemePalette = "accent";

  usaMTR: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cupoService: CupoService,
    private homeService: HomeService,
    private centroService: CentrosService,
    private userService: UserService,
    private errorService: AppErrorService,
    private alertService: AppAlertService,
    private loader: AppLoaderService,
    public nomencladoresService: NomencladoresService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddCuposSolicitadosV2Component>,
    private dialog: MatDialog,
    private personasService: PersonasService
  ) {
    this.usaMTR = localStorage.getItem("usaMtr") == "1" ? true : false;
    this.esCorredor =
      localStorage.getItem("tipo_interviniente") === "1" ? true : false;
    this.esDadorCupo =
      localStorage.getItem("esDadorCupo") === "1" ? true : false;
    this.esClienteFinal =
      localStorage.getItem("esClienteFinal") === "1" ? true : false;
    this.micuit = localStorage.getItem("cuit_cuil");
    this.productos = data.productos;
    let actualYear = this.minFecha.getFullYear() - 2000;
    let carat = '';

    if (this.data.caratula != undefined) {
      carat = this.data.caratula.descripcion;
    }

    this.addSolicitudForm = this.fb.group({
      demandadoCuit: [
        "",
        [Validators.pattern("[0-9]*"), Validators.minLength(11)],
      ],
      contraparte: [
        "",
        [Validators.pattern("[0-9]*"), Validators.minLength(11)],
      ],
      destinatario: [
        "",
        [Validators.pattern("[0-9]*"), Validators.minLength(11)],
      ],
      id_producto: ["", [Validators.required]],
      codigoCosecha1: [
        actualYear,
        [Validators.required, this.cosechaRangeValidator1(10, 98)],
      ],
      codigoCosecha2: [
        actualYear + 1,
        [Validators.required, this.cosechaRangeValidator2(11, 99)],
      ],
      contrato: ["", Validators.maxLength(70)],
      caratula: [carat, Validators.maxLength(6)],
      zona: ["", Validators.maxLength(70)],
      id_gestiona: [null],
      administra: [false],
      nombredemandado: [this.personEmpty],
      nombrecontraparte: [this.personEmpty],
      nombredestinatario: [this.personEmpty],
      autosolicitud: [""],
    });

    for (let index = 0; index < this.cantDias; index++) {
      let strIndex = index.toString();
      let row = new rowTablaFecha();
      row.id = index;
      row.fecha = "";
      row.cantidad = 0;
      row.observ = "";
      this.addSolicitudForm.addControl(
        "fecha_" + strIndex,
        new FormControl(row.fecha)
      );
      this.addSolicitudForm.addControl(
        "cantidad_" + strIndex,
        new FormControl(row.cantidad, [Validators.min(0), Validators.max(1000)])
      );
      this.addSolicitudForm.addControl(
        "observ_" + strIndex,
        new FormControl(row.observ, [Validators.maxLength(250)])
      );
      this.tablaFechas.push(row);
    }
  }

  ngOnInit() {
    this.habilitarCaratula();

    this.mensaje = "Corredor";

    if (this.data.filtros.id_producto) {
      this.addSolicitudForm.controls["id_producto"].setValue(
        parseInt(this.data.filtros.id_producto)
      );
    }
    this.getZonas();

    //create search FormControl
    this.searchControl = new FormControl();
    this.filteredOptions = this.addSolicitudForm.controls[
      "demandadoCuit"
    ].valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );

    // Completo las razones sociales dados los cuit
    fromEvent(this.demandadoCuit.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        let cuit = text.toLowerCase();
        this.personasService.getPersonaNombreByCuit(cuit).subscribe(
          (resp) => {
            let person = new PersonRazonSocial(resp.data, cuit);
            this.addSolicitudForm.controls["nombredemandado"].setValue(person);
            let destinatario =
              this.addSolicitudForm.controls["destinatario"].value;
            this.comprobardemandado(person, destinatario);
          },
          (err) => {
            let person = new PersonRazonSocial("", "");
            this.addSolicitudForm.controls["nombredemandado"].setValue(person);
            let destinatario =
              this.addSolicitudForm.controls["destinatario"].value;
            this.comprobardemandado(person, destinatario);
          }
        );
      });

    fromEvent(this.contraparte.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        let cuit = text.toLowerCase();
        this.personasService.getPersonaNombreByCuit(cuit).subscribe(
          (resp) => {
            let person = new PersonRazonSocial(resp.data, cuit);
            this.addSolicitudForm.controls["nombrecontraparte"].setValue(
              person
            );
          },
          (err) => {
            let person = new PersonRazonSocial("", "");
            this.addSolicitudForm.controls["nombrecontraparte"].setValue(
              person
            );
          }
        );
      });

    fromEvent(this.destinatario.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        let cuit = text.toLowerCase();
        this.personasService.getPersonaNombreByCuit(cuit).subscribe(
          (resp) => {
            let personTitular = new PersonRazonSocial(resp.data, cuit);
            this.addSolicitudForm.controls["nombredestinatario"].setValue(
              personTitular
            );
            let corredor1 =
              this.addSolicitudForm.controls["nombredemandado"].value;
            let corredor = corredor1.value == "" ? this.personEmpty : corredor1;
            this.comprobardemandado(corredor, personTitular);
          },
          (err) => {
            this.comprobardemandado(
              this.addSolicitudForm.controls["nombredemandado"].value,
              this.personEmpty
            );
          }
        );
      });

    fromEvent(this.nombredemandado.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        if (text.length == 0) {
          this.addSolicitudForm.controls["nombredemandado"].setValue(
            this.personEmpty
          );
          this.addSolicitudForm.controls["demandadoCuit"].setValue("");
          this.filteredOptionsCorredores = [];
          this.comprobardemandado(
            this.personEmpty,
            this.addSolicitudForm.controls["nombredestinatario"].value
          );
        } else {
          this.isLoading = true;
          this.personasService
            .getPersonaByRazonSocial({ razon_social: text.toLowerCase() }, { nombre: 'centro' })
            .subscribe(
              (resp) => {
                this.filteredOptionsCorredores = resp.data;
                this.isLoading = false;
              },
              (err) => {
                let person = new PersonRazonSocial("", "");
                this.addSolicitudForm.controls["nombredemandado"].setValue(
                  person
                );
                this.addSolicitudForm.controls["demandadoCuit"].setValue("");
              }
            );
        }
      });

    fromEvent(this.nombrecontraparte.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        if (text.length == 0) {
          this.addSolicitudForm.controls["nombrecontraparte"].setValue(
            this.personEmpty
          );
          this.addSolicitudForm.controls["contraparte"].setValue("");
          this.filteredOptionsContrapartes = [];
          this.comprobardemandado(
            this.addSolicitudForm.controls["nombredemandado"].value,
            this.addSolicitudForm.controls["nombredestinatario"].value
          );
        } else {
          this.isLoading = true;
          this.personasService
            .getPersonaByRazonSocial({ razon_social: text.toLowerCase() }, { nombre: 'centro' })
            .subscribe(
              (resp) => {
                this.filteredOptionsContrapartes = resp.data;
                this.isLoading = false;
              },
              (err) => {
                let person = new PersonRazonSocial("", "");
                this.addSolicitudForm.controls["nombrecontraparte"].setValue(
                  person
                );
                this.addSolicitudForm.controls["contraparte"].setValue("");
              }
            );
        }
      });

    fromEvent(this.nombredestinatario.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        if (text.length == 0) {
          this.addSolicitudForm.controls["nombredestinatario"].setValue(
            this.personEmpty
          );
          this.addSolicitudForm.controls["destinatario"].setValue("");
          this.filteredOptionsDestinatarios = [];
          this.comprobardemandado(
            this.personEmpty,
            this.addSolicitudForm.controls["nombredemandado"].value
          );
        } else {
          this.isLoading = true;
          this.personasService
            .getPersonaByRazonSocial({ razon_social: text.toLowerCase() }, { nombre: 'centro' })
            .subscribe(
              (resp) => {
                this.filteredOptionsDestinatarios = resp.data;
                this.isLoading = false;
              },
              (err) => {
                this.addSolicitudForm.controls["nombredestinatario"].setValue(
                  this.personEmpty
                );
                this.addSolicitudForm.controls["destinatario"].setValue("");
              }
            );
        }
      });
  }

  habilitarCaratula() {
    if (this.data.caratula) {
      if (this.data.caratula.id == -1 || this.data.caratula.descripcion == 'Sin nominar' || this.data.caratula.descripcion == 'Sin Especificar' || this.data.caratula == 'Todas' || this.data.caratula == '') {
        this.addSolicitudForm.controls["caratula"].setValue("");
      } else {
        this.addSolicitudForm.controls["caratula"].setValue(
          this.data.caratula.descripcion
        );
      }
    }

  }

  displayFn(person: PersonRazonSocial) {
    if (person) {
      return person.razon_social;
    }
  }
  displayFn2(person: PersonRazonSocial) {
    if (person) {
      return person.razon_social;
    }
  }

  llenarCuit(person: PersonRazonSocial, control: string) {
    if (person) {
      this.addSolicitudForm.controls[control].setValue(person.cuit_cuil);
      if (control === "demandadoCuit") {
        this.comprobarDemandadoCuit(person.cuit_cuil);
        this.comprobardemandado(
          person,
          this.addSolicitudForm.controls["nombredestinatario"].value
        );
        //this.demandado = person.razon_social;
      }
      if (control === "destinatario") {
        this.comprobarDestinatario(person.cuit_cuil);
        this.comprobardemandado(
          this.addSolicitudForm.controls["nombredemandado"].value,
          person
        );
      }
      if (control === "contraparte") {
        /* if (this.addSolicitudForm.controls["autosolicitud"].value) {
          this.comprobarContraparteCuit(person.cuit_cuil);
        } */
        this.comprobardemandado(
          this.addSolicitudForm.controls["nombredemandado"].value,
          this.addSolicitudForm.controls["nombredestinatario"].value
        );
      }
    }
  }
  getZonas() {
    this.cupoService.getZonas().subscribe((data) => {
      data.data.zonaSolicitud.forEach((element) => {
        this.zonas.push(element);
      });
      this.addSolicitudForm.controls["zona"].setValue(this.zonas[0].id);
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  get f() {
    return this.addSolicitudForm.controls;
  }

  comprobardemandado(corredor, destinatario) {
    if (this.addSolicitudForm.controls["autosolicitud"].value) {
      this.demandado = localStorage.getItem("nameUser");
    } else {
      if (corredor.razon_social !== "") {
        this.demandado = corredor.razon_social;
      } else if (destinatario.razon_social !== "") {
        this.demandado = destinatario.razon_social;
      } else {
        this.demandado = " (Sin definir)";
      }
    }
    this.comprobarForm();
  }

  autoAsignar(event) {
    if (event.checked) {
      this.demandado = localStorage.getItem("nameUser");
      let person = this.addSolicitudForm.controls["nombrecontraparte"].value;
      this.comprobarContraparteCuit(person.cuit_cuil);
    }
    let corredor = this.addSolicitudForm.controls["nombredemandado"].value;
    let destinatario = this.addSolicitudForm.controls["nombredestinatario"].value;
    this.comprobardemandado(corredor, destinatario);
  }

  submit() {
    let solicitud = {};
    if (
      !this.addSolicitudForm.invalid &&
      this.validForm &&
      this.cantidadCupos > 0 &&
      this.selectedFecha &&
      this.invalidFechaCant
    ) {
      this.loader.open();
      let dist = [];

      for (let index = 0; index < this.tablaFechas.length; index++) {
        if (
          this.addSolicitudForm.controls["fecha_" + index].value !== "" &&
          this.addSolicitudForm.controls["cantidad_" + index].value > 0
        ) {
          let tempDist = new Distribucion();
          tempDist.fecha =
            this.addSolicitudForm.controls["fecha_" + index].value;
          tempDist.cantidad =
            this.addSolicitudForm.controls["cantidad_" + index].value;
          tempDist.observaciones =
            this.addSolicitudForm.controls["observ_" + index].value;
          dist.push(tempDist);
        }
      }
      if (this.addSolicitudForm.controls["autosolicitud"].value) {
        console.log('Mi cuit', this.micuit)
        solicitud = {
          demandante:
            this.f.demandadoCuit.value === ""
              ? this.f.contraparte.value
              : this.f.demandadoCuit.value,
          contraparte: this.f.demandadoCuit.value === "" ? null : this.f.contraparte.value !== "" ? this.f.contraparte.value : null,
          destinatario:
            this.f.destinatario.value === "" ? null : this.f.destinatario.value,
          id_producto: this.f.id_producto.value,
          contrato: this.f.contrato.value.toString(),
          zona: this.f.zona.value.toString(),
          codigoCosecha:
            this.f.codigoCosecha1.value.toString() +
            this.f.codigoCosecha2.value.toString(),
          id_gestiona: this.f.id_gestiona.value,
          id_zona_solicitud: this.f.zona.value == 0 ? null : this.f.zona.value,
          distribucion: dist,
          canal: "WEB",
          caratula_mtr: this.addSolicitudForm.controls["caratula"].value
        };
        //console.log('Datos a enviar',solicitud);
        this.cupoService.postCupoSolicitadosPropiaDist(solicitud).subscribe(
          (data) => {
            if (this.loader !== null) {
              this.loader.close();
            }

            this.alertService
              .confirm({
                message: "¡Solicitud de cupos agregada correctamente!",
                tipo: "exito",
              })
              .subscribe((res) => {
                if (res) {
                  this.dialogRef.close(1);
                }
              });
          },
          (err) => {
            if (this.loader !== null) {
              this.loader.close();
            }
            this.errorService.confirm({
              message: err.message,
            });
          }
        );
      } else {
        solicitud = {
          corredor:
            this.f.demandadoCuit.value == ""
              ? null
              : this.f.demandadoCuit.value,
          contraparte:
            this.f.contraparte.value == "" ? null : this.f.contraparte.value,
          destinatario:
            this.f.destinatario.value == "" ? null : this.f.destinatario.value,
          id_producto: this.f.id_producto.value,
          contrato: this.f.contrato.value.toString(),
          zona: this.f.zona.value.toString(),
          codigoCosecha:
            this.f.codigoCosecha1.value.toString() +
            this.f.codigoCosecha2.value.toString(),
          id_gestiona: this.f.id_gestiona.value,
          id_zona_solicitud: this.f.zona.value == 0 ? null : this.f.zona.value,
          distribucion: dist,
          canal: "WEB",
          caratula_mtr: this.addSolicitudForm.controls["caratula"].value
        };
        //console.log('Datos a enviar',solicitud);
        this.cupoService.postCupoSolicitadosDemandanteV3(solicitud).subscribe(
          (data) => {
            if (this.loader !== null) {
              this.loader.close();
            }

            this.alertService
              .confirm({
                message: "¡Solicitud de cupos agregada correctamente!",
                tipo: "exito",
              })
              .subscribe((res) => {
                if (res) {
                  this.dialogRef.close(1);
                }
              });
          },
          (err) => {
            if (this.loader !== null) {
              this.loader.close();
            }
            this.errorService.confirm({
              message: err.message,
            });
          }
        );
      }
    }
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>, cmp: string) {
    if (cmp === "desde") {
      this.minDate = event.value;
    } else {
      this.maxDate = event.value;
    }
  }

  comprobarDemandadoCuit(valor: string) {
    this.isInicio = false;
    //this.incorrect_demandado_cuit = true;
    this.incorrect_corredor_cuit = true;
    this.noEsCorredorDemandando = false;
    // this.addSolicitudForm.invalid;
    this.mismo_cuit = false;
    if (valor.length == 11) {
      if (valor == this.micuit) {
        this.mismo_cuit = true;
        this.addSolicitudForm.controls["demandadoCuit"].setErrors({
          invalidForm: true,
        });
        this.addSolicitudForm.controls["demandadoCuit"].markAsDirty();
      } else {
        //this.mismo_cuit = false;
        this.userService.esCorredor(valor).subscribe(
          (res) => {
            this.incorrect_corredor_cuit = !res.data.esCorredor;
            if (!res.data.esCorredor) {
              this.incorrect_corredor_cuit = true;
              this.noEsCorredorDemandando = true;
              this.addSolicitudForm.controls["demandadoCuit"].setErrors({
                invalidCorredor: true,
              });
              this.addSolicitudForm.controls["demandadoCuit"].markAsDirty();
              this.comprobarForm();
            } /* else {
              this.userService.esDadorCuit(valor).subscribe(
                (res) => {
                  this.incorrect_demandado_cuit = !res.data;
                  if (!res.data) {
                    this.addSolicitudForm.controls["demandadoCuit"].setErrors({
                      invalidForm: true,
                    });
                    this.addSolicitudForm.controls[
                      "demandadoCuit"
                    ].markAsDirty();
                  }
                  this.comprobarForm();
                },
                (error) => { }
              );
            } */
          },
          (error) => { }
        );
      }
    } else if (valor.length == 0) {
      //this.incorrect_demandado_cuit = false;
      //this.mismo_cuit = false;
      this.comprobarForm();
    }
  }

  comprobarDestinatario(valor: string) {
    this.isInicio = false;
    if (valor.length == 11) {
      this.userService.esDadorCuit(valor).subscribe(
        (res) => {
          this.incorrect_destino_cuit = !res.data;
          if (!res.data) {
            this.addSolicitudForm.controls["destinatario"].setErrors({
              invalidForm: true,
            });
            this.addSolicitudForm.controls["destinatario"].markAsDirty();
          }
          this.comprobarForm();
        },
        (error) => { }
      );
    } else if (valor.length == 0) {
      this.incorrect_destino_cuit = false;
    } else {
      this.incorrect_destino_cuit = true;
    }
  }
  comprobarContraparteCuit(valor: string) {
    this.isInicio = false;
    this.esContraparteCorredor = false;
    this.esContraparteDador = false;
    this.soyContraparte = false;
    if (valor.length === 11) {
      if (valor == this.micuit) {
        this.soyContraparte = true;
      } else {
        this.userService.esCorredor(valor).subscribe(
          (res) => {
            this.esContraparteCorredor = res.data.esCorredor;
            if (this.esContraparteCorredor) {
              this.esContraparteDador = true;
              this.comprobarForm();
            } else {
              this.userService.esDadorCuit(valor).subscribe(
                (res) => {
                  this.esContraparteDador = res.data;
                  this.comprobarForm();
                },
                (error) => { }
              );
            }
          },
          (error) => { }
        );
      }
    } else if (valor.length == 0) {
      this.comprobarForm();
    }
  }

  comprobarForm() {
    this.validForm = true;
    let demand = this.addSolicitudForm.controls["demandadoCuit"].value;
    let destinat = this.addSolicitudForm.controls["destinatario"].value;
    if (this.addSolicitudForm.controls["autosolicitud"].value) {
      //solicitud propia
      if (
        this.addSolicitudForm.controls["nombredemandado"].value ===
        this.personEmpty &&
        this.addSolicitudForm.controls["nombrecontraparte"].value ===
        this.personEmpty
      ) {
        this.validForm = false;
      } else {
        if (this.incorrect_corredor_cuit) this.validForm = false;
      }
      /*else  {
        if (this.incorrect_demandado_cuit) {
          this.validForm = false;
        }
      }
      /*if (
        this.addSolicitudForm.controls["nombredemandado"].value ===
          this.personEmpty &&
        this.addSolicitudForm.controls["nombrecontraparte"].value !==
          this.personEmpty
      )
      {
         if (!this.esContraparteDador || !this.esContraparteCorredor ) {
          this.validForm = false;
        }
      } else {
        if (this.incorrect_demandado_cuit) {
          this.validForm = false;
        }
      }*/
    } else {
      // No es propia
      if (
        this.addSolicitudForm.controls["nombredemandado"].value ===
        this.personEmpty &&
        this.addSolicitudForm.controls["nombredestinatario"].value ===
        this.personEmpty
      ) {
        this.validForm = false;
      } else {
        if (
          //!this.incorrect_demandado_cuit &&
          !this.incorrect_destino_cuit &&
          (this.addSolicitudForm.controls["demandadoCuit"].value.length > 0 ||
            this.addSolicitudForm.controls["destinatario"].value.length > 0)
        ) {
          this.validForm = true;
          this.addSolicitudForm.controls["demandadoCuit"].markAsPristine();
          this.addSolicitudForm.controls["demandadoCuit"].setValue(demand);
          this.addSolicitudForm.controls["destinatario"].markAsPristine();
          this.addSolicitudForm.controls["destinatario"].setValue(destinat);
          this.noEsCorredorDemandando = false;
        } else {
          /* if (
            this.incorrect_demandado_cuit &&
            this.addSolicitudForm.controls["demandadoCuit"].value.length > 0
          ) {
            this.noEsCorredorDemandando = this.incorrect_demandado_cuit;
            this.addSolicitudForm.controls["demandadoCuit"].setErrors({
              invalidForm: true,
            });
            this.addSolicitudForm.controls["demandadoCuit"].markAsDirty();
            this.validForm = false;
          } */
          if (
            this.incorrect_destino_cuit &&
            this.addSolicitudForm.controls["destinatario"].value.length > 0
          ) {
            this.addSolicitudForm.controls["destinatario"].setErrors({
              invalidForm: true,
            });
            this.addSolicitudForm.controls["destinatario"].markAsDirty();
            this.validForm = false;
          }
        }
      }
    }



    let tempCant = 0;
    this.invalidFechaCant = true;
    for (let index = 0; index < this.cantDias; index++) {
      tempCant =
        tempCant + this.addSolicitudForm.controls["cantidad_" + index].value;
      if (
        this.addSolicitudForm.controls["cantidad_" + index].value > 0 &&
        this.addSolicitudForm.controls["fecha_" + index].value == ""
      ) {
        if (this.invalidFechaCant) {
          this.invalidFechaCant = false;
        }
      }
    }
    this.cantidadCupos = tempCant;
    return this.validForm
  }
  /* comprobarDemandadoCuitOption(option) {
    this.incorrect_demandado_cuit = false;
  } */
  cosechaRangeValidator1(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (isNaN(control.value) || control.value < min || control.value > max) {
        return { cosecha1Error1: true };
      }
      return null;
    };
  }
  cosechaRangeValidator2(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (isNaN(control.value) || control.value < min || control.value > max) {
        return { cosecha2Error1: true };
      }
      return null;
    };
  }

  validateCodigoCosecha(value, tipo) {
    if (tipo === "desde") {
      this.addSolicitudForm.controls["codigoCosecha2"].setValue(
        parseInt(value) + 1
      );
    } else {
      this.addSolicitudForm.controls["codigoCosecha1"].setValue(
        parseInt(value) - 1
      );
    }
  }

  onChange2(cmp) {
    if (cmp.checked) {
      let title = "Centro que va administrar cupos";
      let dialogRef: MatDialogRef<any> = this.dialog.open(
        CentroAdministraCuposComponent,
        {
          width: "420px",
          disableClose: true,
          data: { title: title },
        }
      );

      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          // If user press cancel
          this.f.id_gestiona.setValue(null);
          this.f.administra.setValue(false);
          return;
        }
        this.f.id_gestiona.setValue(res.id_centro);
      });
    } else {
      this.f.id_gestiona.setValue(null);
    }
  }

  inputFecha(fecha, i) {
    if (fecha.value) {
      if (!this.selectedFecha && i == 0) {
        this.generarFechas(fecha);
      } else {
        for (let index = 0; index < this.cantDias; index++) {
          let fech =
            this.homeService.formatoFecha(fecha.value, "amd", "-") +
            " 12:00:00";
          let fech1 =
            this.homeService.formatoFecha(
              this.addSolicitudForm.controls["fecha_" + index].value,
              "amd",
              "-"
            ) + " 12:00:00";
          let exis = fech1 == fech ? true : false;
          if (this.addSolicitudForm.controls["fecha_" + index].value !== "") {
            if (index !== i && exis) {
              if (
                this.addSolicitudForm.controls["cantidad_" + index].value > 0
              ) {
                this.invalidFechaCant = false;
              }
              this.addSolicitudForm.controls["fecha_" + i].setValue("");
              return false;
            }
          }
        }
      }
      this.comprobarForm();
    } else {
      if (this.addSolicitudForm.controls["cantidad_" + i].value > 0) {
        this.invalidFechaCant = false;
      }
    }
    this.selectedFecha = false;
    for (let index = 1; index < this.cantDias; index++) {
      if (this.addSolicitudForm.controls["fecha_" + index].value !== "") {
        this.selectedFecha = true;
      }
    }
  }

  generarFechas(fecha) {
    let fechaInicial: moment.Moment = moment(fecha.value);
    for (let index = 1; index < this.cantDias; index++) {
      let tempMoment1: moment.Moment = fechaInicial.add(1, "d");
      let fechaString =
        this.homeService.formatoFecha(tempMoment1, "amd", "-") + " 12:00:00";
      this.addSolicitudForm.controls["fecha_" + index].setValue(
        new Date(fechaString)
      );
    }
  }

  noEsCorredor(): boolean {
    return ((!this.mismo_cuit && this.incorrect_corredor_cuit)
      || (this.noEsCorredorDemandando)) ? true : false;
  }
}
