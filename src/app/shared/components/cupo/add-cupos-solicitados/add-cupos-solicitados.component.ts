/// <reference types="@types/googlemaps" />
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
} from "@angular/core";
import {
  MatTableDataSource,
  MatDialogRef,
  MatDialog,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_DIALOG_DATA,
} from "@angular/material";
import {
  Validators,
  FormGroup,
  FormControl,
  FormBuilder,
  ValidatorFn,
  AbstractControl,
  FormArray,
} from "@angular/forms";
import { fromEvent, Subscription } from "rxjs";
import { HomeService } from "../../home/home.service";
import { NomencladoresService } from "../../../services/nomencladores.service";
import { CupoService } from "../cupo.service";
import { UserService } from "../../../services/user.service";
import { AppLoaderService } from "../../../../shared/services/app-loader/app-loader.service";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { AppDateAdapter, APP_DATE_FORMATS } from "@shared/helpers/date.adapter";

import { AppErrorService } from "../../../../shared/services/app-error/app-error.service";
import { AppAlertService } from "../../../../shared/services/app-alert/app-alert.service";
import { CentroAdministraCuposComponent } from "./centro-administra-cupos/centro-administra-cupos.component";
import { CentrosService } from "app/shared/services/centros.service";
import { Observable } from "rxjs";
import { CentroProductoService } from "app/shared/services/centro-producto.service";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  startWith,
} from "rxjs/operators";
import { PersonRazonSocial } from "app/shared/models/personRazonSocial";
import { PersonasService } from "app/shared/services/personas.service";

export class Producto {
  id: number;
  descripcion?: string;
  tipo_producto?: string;
  nombre_producto?: string;
}
export class Solicitud {
  demandadoCuit?: string;
  demandante?: string;
  corredor?: string;
  demandanteCuit?: string;
  id_producto: number;
  fechaCupo: string;
  fechaHasta: string;
  cantidad: string;
  contrato: string;
  observaciones: string;
  codigoCosecha: string;
  id_demandante?: number;
  id_demandado?: number;
  id_gestiona?: number;
  id_zona_solicitud?: number;
  comprador?: string;
  canal?: string;
  caratula_mtr?: string;
  id_demanda_padre?: string;
}
export class Zona {
  id: number;
  descripcion: string;
  comprador?: string;
}
export class CentroDador {
  id: number;
  cuit: string;
  nombre_persona: string;
}
@Component({
  selector: "app-add-cupos-solicitados",
  templateUrl: "./add-cupos-solicitados.component.html",
  styleUrls: ["./add-cupos-solicitados.component.scss"],
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
export class AddCuposSolicitadosComponent implements OnInit {
  @ViewChild("search") searchElementRef: ElementRef;
  @ViewChild("nombredemandado") nombredemandado: ElementRef;
  @ViewChild("demandadoCuit") demandadoCuit: ElementRef;
  formData = {};
  addSolicitudForm: FormGroup;
  tipo: number;
  mensaje: string;
  public getItemSub: Subscription;
  medios: any;
  minDate = new Date();
  maxDate: any;
  minFecha = new Date();
  es_cupo = true;
  productos: Producto[];
  public searchControl: FormControl;

  public isInvalid: any;
  public inactivo: boolean = false;

  public isDisabled: boolean;
  incorrect_demandado_cuit: boolean = false;
  incorrect_codigoCosecha: boolean = false;

  redirigir: boolean;
  titulo: string;

  estado = true;
  min = 10;
  max = 99;
  minValue: any;
  maxValue: any;
  maxValue2: any;
  esDadorCupo: any;
  esClienteFinal: any;
  centroDadores: CentroDador[] = [];
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  zonas: Zona[] = [
    {
      id: 0,
      descripcion: "Sin especificar",
      comprador: "",
    },
  ];
  contratoRequerido: string;
  filteredOptionsCorredores: PersonRazonSocial[] = [];
  personEmpty = new PersonRazonSocial("", "");
  isLoading = false;
  noEsCorredorDemandando = false;
  incorrect_corredor_cuit: boolean = false;

  cosecha1;
  cosecha2;
  idProducto = "";

  usaMTR: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cupoService: CupoService,
    private centroService: CentrosService,
    private userService: UserService,
    private errorService: AppErrorService,
    private alertService: AppAlertService,
    private loader: AppLoaderService,
    public nomencladoresService: NomencladoresService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddCuposSolicitadosComponent>,
    private dialog: MatDialog,
    private centroProductoService: CentroProductoService,
    private personasService: PersonasService,
    public homeService: HomeService,
  ) {
    this.usaMTR = localStorage.getItem("usaMtr") == "1" ? true : false;
  }

  ngOnInit() {
    this.getProductos();
    //this.refreshDadores();
    this.cosecha1 = this.minFecha.getFullYear() - 2000;
    this.cosecha2 = this.minFecha.getFullYear() - 2000 + 1;
    let actualYear = this.minFecha.getFullYear() - 2000;

    if (this.data !== undefined) {
      this.tipo = this.data.tipo;
      this.redirigir = this.data.redirigir;
      this.idProducto = this.data.id_producto;
      if (this.redirigir) {
        this.titulo = "REDIRIGIR SOLICITUD DE CUPOS";

      } else {
        this.titulo = "GENERAR SOLICITUD DE CUPOS";
      }
    }

    if (this.tipo == 0) {
      this.mensaje = "CUIT";
    } else {
      this.mensaje = "Solicitante CUIT";
    }

    this.esDadorCupo =
      localStorage.getItem("esDadorCupo") === "1" ? true : false;
    this.esClienteFinal =
      localStorage.getItem("esClienteFinal") === "1" ? true : false;
    this.contratoRequerido = localStorage.getItem("contratoRequerido");

    const dateDesde = this.data.cupo ? this.homeService.sumarDias(new Date(this.data.cupo.fechaDesde), 2) : '';
    const dateHasta = this.data.cupo ? this.homeService.sumarDias(new Date(this.data.cupo.fechaHasta), 2) : '';

    console.log(dateDesde);
    console.log(dateHasta);
    let car= {
      value: this.usaMTR
      ? this.redirigir
          ? this.data.cupo.caratula_mtr
        : this.data.caratula ? this.data.caratula.descripcion:  ""
      : "",
      disabled: this.usaMTR ? (this.redirigir ? true : false) : true,
    };

    this.addSolicitudForm = this.fb.group({
      demandadoCuit: [
        "",
        [
          Validators.required,
          Validators.pattern("[0-9]*"),
          Validators.minLength(11),
        ],
      ],
      id_producto: [
        {
          value: this.redirigir ? this.data.id_producto : "",
          disabled: this.redirigir ? true : false,
        },
        [Validators.required],
      ],
      fechaCupo: [
        {
          value: this.redirigir ? this.homeService.formatoFecha(dateDesde,"","-") : "",
          disabled: this.redirigir ? true : false,
        },
        [Validators.required],
      ],
      fechaHasta: [
        {
          value: this.redirigir ? this.homeService.formatoFecha(dateHasta,"","-") : "",
          disabled: this.redirigir ? true : false,
        },
        [Validators.required],
      ],
      cantidad: [
        {
          value: this.redirigir ? this.data.cupo.cantidad : "",
          disabled: this.redirigir ? true : false,
        },
        [Validators.required, Validators.max(1000)],
      ],
      observaciones: ["", Validators.maxLength(65535)],
      codigoCosecha1: [
        {
          value: this.redirigir ? this.cosecha1 : actualYear,
          disabled: this.redirigir ? true : false,
        },
        [Validators.required, this.cosechaRangeValidator1(10, 98)],
      ],
      codigoCosecha2: [
        {
          value: this.redirigir ? this.cosecha2 : actualYear+1,
          disabled: this.redirigir ? true : false,
        },
        [Validators.required, this.cosechaRangeValidator2(11, 99)],
      ],
      contrato: [
        {
          value: this.redirigir ? this.data.cupo.contrato : "",
          disabled: this.redirigir ? true : false,
        },
        this.contratoRequerido == "1" && this.tipo == 0
          ? [Validators.required, Validators.maxLength(70)]
          : Validators.maxLength(70),
      ],
      zona: [
        {
          value: this.redirigir ? this.data.cupo.zona : "",
          disabled: this.redirigir ? true : false,
        },
        Validators.maxLength(70),
      ],
      id_gestiona: [null],
      comprador: [
        {
          value: this.redirigir ? this.data.cupo.comprador : "",
          disabled: this.redirigir ? true : false,
        },
        Validators.maxLength(150),
      ],
      caratula_mtr: [
        {
          value: this.usaMTR
          ? this.redirigir
              ? this.data.cupo.caratula_mtr
            : this.data.caratula ? this.data.caratula.descripcion:  ""
          : "",
          disabled: this.usaMTR ? (this.redirigir ? true : false) : true,
        },
        Validators.maxLength(50),
      ],
      administra: [false],
      nombredemandado: [this.personEmpty],
      id_demanda_padre: [
        this.redirigir ? this.data.cupo.id_demanda_cupo : null,
      ],
    });
    this.f.zona.setValue(this.zonas[0].id) ;
    //this.getZonas();

    //create search FormControl
    this.searchControl = new FormControl();
    this.filteredOptions = this.addSolicitudForm.controls[
      "demandadoCuit"
    ].valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
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
          },
          (err) => {
            let person = new PersonRazonSocial("", "");
            this.addSolicitudForm.controls["nombredemandado"].setValue(person);
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
        } else {
          this.isLoading = true;
          this.personasService
            .getPersonaByRazonSocial({ razon_social: text.toLowerCase() })
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

  textSelectProducto(event): string {
    if (this.f.selectedProducto.value.length === this.productos.length) {
      return 'Todos';
    }
    if (this.f.selectedProducto.value.length === 0) {
      return '';
    }
    if (this.f.selectedProducto.value.length <4) {
      return this.f.selectedProducto.value[0].descripcion +',' + this.f.selectedProducto.value[1].descripcion +',' + this.f.selectedProducto.value[2].descripcion +',' + this.f.selectedProducto.value[3].descripcion;
    }
    return ''
  }

  getZonas(idCentro) {
    this.cupoService.getZonasC3(idCentro).subscribe((data) => {
      this.zonas = [{
        id: 0,
        descripcion: "Sin especificar",
        comprador:''
      }];
      data.data.forEach((element) => {
        this.zonas.push(element);
      });
      if (this.data.zona) {
        this.addSolicitudForm.controls["zona"].setValue(this.data.zona.id);
      } else {
        this.addSolicitudForm.controls["zona"].setValue(this.zonas[0].id);
      }
    });
  }

  submit() {
    this.loader.open();
    let solicitud: Solicitud;
    if (this.tipo == 0) {
      solicitud = {
        corredor: this.f.demandadoCuit.value,
        id_producto: this.f.id_producto.value,
        fechaCupo: this.f.fechaCupo.value,
        fechaHasta: this.f.fechaHasta.value,
        cantidad: this.f.cantidad.value,
        contrato: this.f.contrato.value.toString(),
        id_zona_solicitud: this.f.zona.value == 0 ? null : this.f.zona.value,
        observaciones: this.f.observaciones.value,
        codigoCosecha:
          this.f.codigoCosecha1.value.toString() +
          this.f.codigoCosecha2.value.toString(),
        //id_demandante: this.f.id_demandante.value,
        id_gestiona: this.f.id_gestiona.value,
        comprador: this.f.comprador.value.toString(),
        canal: "WEB",
        caratula_mtr: this.f.caratula_mtr.value.toString(),
        id_demanda_padre: this.f.id_demanda_padre.value,
      };
      this.cupoService.postCupoSolicitadosDemandante(solicitud).subscribe(
        (data) => {
          this.loader.close();
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
            // message: "¡Error, no se pudo cargar la solicitud de cupos! "
            message: err.message,
          });
        }
      );
    } else {
      solicitud = {
        demandante: this.f.demandadoCuit.value,
        id_producto: this.f.id_producto.value,
        fechaCupo: this.f.fechaCupo.value,
        fechaHasta: this.f.fechaHasta.value,
        cantidad: this.f.cantidad.value,
        contrato: this.f.contrato.value.toString(),
        id_zona_solicitud: this.f.zona.value == 0 ? null : this.f.zona.value,
        observaciones: this.f.observaciones.value,
        codigoCosecha:
          this.f.codigoCosecha1.value.toString() +
          this.f.codigoCosecha2.value.toString(),
        //id_demandado: this.f.id_demandante.value,
        id_gestiona: this.f.id_gestiona.value,
        comprador: this.f.comprador.value.toString(),
        canal: "WEB",
        caratula_mtr: this.f.caratula_mtr.value.toString(),
        id_demanda_padre: this.f.id_demanda_padre.value,
      };
      this.cupoService.postCupoSolicitadosPropia(solicitud).subscribe(
        (data) => {
          //this.roles.unshift(data);
          this.loader.close();
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
            // message: "¡Error, no se pudo actualizar los Cupos solicitados! "
            message: err.message,
          });
        }
      );
    }


  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>, cmp: string) {
    if (cmp === "desde") {
      this.minDate = event.value;
    } else {
      this.maxDate = event.value;
    }
  }

  getProductos() {
    this.centroProductoService.getCentroProducto().subscribe((data) => {
      this.productos = data.data;
      if (this.data !== undefined) {
        let produc = this.productos.find(
          (producto) => producto.id === 1
        );
        if (produc) {
          this.addSolicitudForm.controls["id_producto"].setValue(produc.id);
        }
      } else {
        let soja = this.productos.find((producto) => producto.id === 1);
        if (soja) {
          this.addSolicitudForm.controls["id_producto"].setValue(1);
        }
      }
    });
  }

  comprobarDemandadoCuit(valor) {
    this.incorrect_demandado_cuit = false;
    this.addSolicitudForm.invalid;

    if (valor.length == 11) {
      if (this.tipo == 0) {
        this.userService.esDadorCuit(valor).subscribe(
          (res) => {
            this.incorrect_demandado_cuit = !res.data;
            this.getZonas(valor);
          },
          (error) => { }
        );
      } else {
        this.addSolicitudForm.controls["contrato"].setValidators([
          Validators.maxLength(70),
        ]);
        this.addSolicitudForm.controls["contrato"].updateValueAndValidity();

        this.userService
          .esReceptorCuit(this.addSolicitudForm.controls["demandadoCuit"].value)
          .subscribe(
            (res) => {
              this.incorrect_demandado_cuit = !res.data;
              if (res.data) {
                this.getItemSub = this.nomencladoresService
                  .getConfiguracionCentroDador(
                    this.addSolicitudForm.controls["demandadoCuit"].value
                  )
                  .subscribe((data) => {
                    this.getZonas(this.addSolicitudForm.controls["demandadoCuit"].value);

                    if (data.data.contratoRequerido == 1) {
                      this.addSolicitudForm.controls["contrato"].setValidators([
                        Validators.required,
                        Validators.maxLength(70),
                      ]);
                      this.addSolicitudForm.controls[
                        "contrato"
                      ].updateValueAndValidity();
                    }
                  });
              }
            },
            (error) => { }
          );
      }
    }
  }

  comprobarDemandadoCuitOption(option) {
    this.incorrect_demandado_cuit = false;
  }

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

  refreshDadores() {
    this.loader.open();
    this.options = [];
    this.getItemSub = this.centroService.getDadoresCentro().subscribe(
      (data) => {
        this.centroDadores = data.data;
        this.centroDadores.forEach((element) => {
          this.options.push(element.cuit);
        });
        this.loader.close();
      },
      (err) => {
        this.loader.close();
        this.errorService
          .confirm({ message: "Error, al buscar los dadores" })
          .subscribe((res) => {
            if (res) {
              return;
            }
          });
      }
    );
  }

  llenarCuit(person: PersonRazonSocial, control: string) {
    if (person) {
      this.addSolicitudForm.controls[control].setValue(person.cuit_cuil);
      if (control === "demandadoCuit") {
        this.comprobarDemandadoCuit(person.cuit_cuil);
      }
    }
  }
  displayFn(person: PersonRazonSocial) {
    if (person) {
      return person.razon_social;
    }
  }
}
