import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  DateAdapter,
  MatDialog,
  MatDialogRef,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { PersonRazonSocial } from "app/shared/models/personRazonSocial";
import { PersonasService } from "app/shared/services/personas.service";
import { UserService } from "app/shared/services/user.service";
import { fromEvent, Observable } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  filter,
  startWith,
  tap,
  switchMap,
  finalize,
} from "rxjs/operators";
import { AppDateAdapter } from "@shared/helpers/date.adapter";
import { CupoService } from "../cupo.service";

@Component({
  selector: "app-asignar-sin-solicitud",
  templateUrl: "./asignar-sin-solicitud.component.html",
  styleUrls: ["./asignar-sin-solicitud.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MAT_DATE_FORMATS,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es-ES",
    },
  ],
})
export class AsignarSinSolicitudComponent implements OnInit {
  @ViewChild("demandadoCuit") demandadoCuit: ElementRef;
  @ViewChild("contraparte") contraparte: ElementRef;
  @ViewChild("contrato") contrato: ElementRef;
  @ViewChild("search") searchElementRef: ElementRef;

  asignarSinSolicitudForm: FormGroup;
  public searchControl: FormControl;
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  mismo_cuit: boolean = false;
  demandado = " (Sin definir)";
  isInicio: boolean = true;
  incorrect_demandado_cuit: boolean = false;
  incorrect_corredor_cuit: boolean = false;
  incorrect_contraparte_cuit: boolean = false;
  micuit: string;
  readonlyDemandadoCuit = false;
  readonlyContraparteCuit = false;
  soyCorredor = false;
  labelRbselect_corredor = "--";
  disabledCorredor = false;
  disabledContraparte = false;
  validForm: boolean = false;
  isContraparte = false;
  isCorredor = false;
  valid2 = false;
  esNecesarioCorredor = false;
  esCorredorDemandando = false;
  esNecesarioContraparte = false;
  filteredOptionsCorredores: PersonRazonSocial[] = [];
  filteredOptionsContrapartes: PersonRazonSocial[] = [];
  isLoading = false;
  noEsCorredorDemandando = false;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cupoService: CupoService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AsignarSinSolicitudComponent>,
    private dialog: MatDialog,
    private personasService: PersonasService,
    private userService: UserService
  ) {
    this.micuit = localStorage.getItem("cuit_cuil");
    console.log(data);
  }

  ngOnInit() {
    this.asignarSinSolicitudForm = this.fb.group({
      select_corredor: ["0"],
      select_contraparte: ["0"],
      demandadoCuit: [
        "",
        [Validators.pattern("[0-9]*"), Validators.minLength(11)],
      ],
      contraparte: [
        "",
        [Validators.pattern("[0-9]*"), Validators.minLength(11)],
      ],
      contrato: ["", Validators.maxLength(70)],
      nombredemandado: [""],
      nombrecontraparte: [""],
      caratula: ["", Validators.maxLength(6)],
    });
    this.userService.esCorredor(this.micuit).subscribe(
      (res) => {
        this.soyCorredor = res.data.esCorredor;
        if (this.soyCorredor) {
          this.labelRbselect_corredor = "Sin Otro Corredor";
          this.isContraparte = false;
          this.esNecesarioCorredor = false;
          this.esCorredorDemandando = false;
        } else {
          this.labelRbselect_corredor = "Directo";
          this.disabledContraparte = false;
          this.isContraparte = true;
          this.esNecesarioCorredor = true;
          this.esCorredorDemandando = true;
        }
        this.habilitarCorredor();
        this.habilitarContraparte();
        this.habilitarContrato();
        this.habilitarCaratula();
        this.comprobarForm();
      },
      (error) => {}
    );
    //create search FormControl
    this.searchControl = new FormControl();
    this.filteredOptions = this.asignarSinSolicitudForm.controls[
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
            let dat = {
              cuit_cuil: cuit,
              razon_social: resp.data,
            };
            this.asignarSinSolicitudForm.controls["nombredemandado"].setValue(
              dat
            );
            this.comprobardemandado();
          },
          (err) => {
            console.log(err);
            this.asignarSinSolicitudForm.controls["nombredemandado"].setValue(
              ""
            );
            this.comprobardemandado();
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
        if (cuit.length == 11) {
          this.personasService.getPersonaNombreByCuit(cuit).subscribe(
            (resp) => {
              let dat = {
                cuit_cuil: cuit,
                razon_social: resp.data,
              };
              this.asignarSinSolicitudForm.controls[
                "nombrecontraparte"
              ].setValue(dat);
              this.isContraparte = true;
              this.incorrect_contraparte_cuit = false;
              this.comprobarForm();
              //this.comprobardemandado();
            },
            (err) => {
              console.log("Entre aqui al error de contraparte");
              this.incorrect_contraparte_cuit = true;
              this.isContraparte = false;
              this.comprobarForm();
            }
          );
        } else if (cuit.length == 0) {
          this.incorrect_contraparte_cuit = true;
          this.isContraparte = false;
          this.comprobarForm();
        }
      });
    fromEvent(this.contrato.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        this.comprobarForm();
      });

    this.asignarSinSolicitudForm
      .get("nombredemandado")
      .valueChanges.pipe(
        filter((value) => value.length > 2),
        map((text: string) => {
          return text.toUpperCase();
        }),
        debounceTime(1000),
        tap(() => (this.isLoading = true)),
        switchMap((value) =>
          this.personasService
            .getPersonaByRazonSocial({ razon_social: value })
            .pipe(finalize(() => (this.isLoading = false)))
        )
      )
      .subscribe((person) => (this.filteredOptionsCorredores = person.data));

    this.asignarSinSolicitudForm.controls["nombrecontraparte"].valueChanges
      .pipe(
        filter((value) => value.length > 2),
        map((text: string) => {
          return text.toUpperCase();
        }),
        debounceTime(1000),
        tap(() => (this.isLoading = true)),
        switchMap((value) =>
          this.personasService
            .getPersonaByRazonSocial({ razon_social: value })
            .pipe(finalize(() => (this.isLoading = false)))
        )
      )
      .subscribe((person) => (this.filteredOptionsContrapartes = person.data));
    this.comprobarForm();
  }

  habilitarCorredor() {
    if (this.soyCorredor) {
      if (
        this.data.corredor.cuit == "00000000000" ||
        this.data.corredor.cuit == ""
      ) {
        this.asignarSinSolicitudForm.controls["select_corredor"].setValue("1");
        this.readonlyDemandadoCuit = true;
        this.noEsCorredorDemandando = false;
        this.esNecesarioCorredor = false;
        this.esCorredorDemandando = false;
        this.disabledContraparte = true;
      } else {
        this.asignarSinSolicitudForm.controls["demandadoCuit"].setValue(
          this.data.corredor.cuit
        );
        this.asignarSinSolicitudForm.controls["nombredemandado"].setValue(
          this.data.corredor.descripcion
        );
        this.readonlyDemandadoCuit = false;
      }
    } else {
      if (this.data.corredor.cuit == "00000000000") {
        this.asignarSinSolicitudForm.controls["select_corredor"].setValue("1");
        this.readonlyDemandadoCuit = true;
        this.noEsCorredorDemandando = false;
        this.esNecesarioCorredor = false;
        this.esCorredorDemandando = false;
        this.disabledContraparte = true;
      } else if (this.data.corredor.cuit !== "") {
        this.asignarSinSolicitudForm.controls["demandadoCuit"].setValue(
          this.data.corredor.cuit
        );
        this.asignarSinSolicitudForm.controls["nombredemandado"].setValue(
          this.data.corredor.descripcion
        );
        this.readonlyDemandadoCuit = false;
      } else {
        this.readonlyDemandadoCuit = false;
      }
    }
  }

  habilitarContraparte() {
    this.esNecesarioContraparte = true;
    if (this.data.contraparte.cuit == "00000000000") {
      if (this.data.corredor.cuit == "00000000000") {
        this.disabledContraparte = true;
        this.asignarSinSolicitudForm.controls["select_contraparte"].setValue(
          "0"
        );
      } else {
        this.asignarSinSolicitudForm.controls["select_contraparte"].setValue(
          "1"
        );
        this.readonlyContraparteCuit = true;
        this.esNecesarioContraparte = false;
        this.disabledCorredor = true;
      }
    } else if (this.data.contraparte.id !== "") {
      this.asignarSinSolicitudForm.controls["contraparte"].setValue(
        this.data.contraparte.cuit
      );
      this.asignarSinSolicitudForm.controls["nombrecontraparte"].setValue(
        this.data.contraparte.descripcion
      );
      this.isContraparte = true;
      //this.readonlyContraparteCuit = true;
    } else {
      this.readonlyContraparteCuit = false;
    }
  }
  habilitarContrato() {
    if (this.data.contrato.id == -1) {
      this.asignarSinSolicitudForm.controls["contrato"].setValue("");
    } else {
      this.asignarSinSolicitudForm.controls["contrato"].setValue(
        this.data.contrato.descripcion
      );
    }
  }
  habilitarCaratula() {
    if (this.data.caratula.id == -1 || this.data.caratula.descripcion =='Sin nominar' ) {
      this.asignarSinSolicitudForm.controls["caratula"].setValue("");
    } else {
      this.asignarSinSolicitudForm.controls["caratula"].setValue(
        this.data.caratula.descripcion
      );
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  comprobardemandado() {
    let corredor = this.asignarSinSolicitudForm.controls["demandadoCuit"].value;
    // let contraparte = this.asignarSinSolicitudForm.controls["contraparte"].value;
    //let destinatario = this.asignarSinSolicitudForm.controls["destinatario"].value;
    if (corredor !== "") {
      this.personasService
        .getPersonaNombreByCuit(corredor.toLowerCase())
        .subscribe(
          (resp) => {
            if (this.mismo_cuit) {
              this.demandado = " (Sin definir)";
            } else {
              this.demandado = resp.data;
            }
          },
          (err) => {}
        );
    }
  }
  comprobarDemandadoCuit(valor: string) {
    this.incorrect_demandado_cuit = true;
    this.incorrect_corredor_cuit = true;
    // this.asignarSinSolicitudForm.invalid;
    if (valor.length == 11) {
      if (valor == this.micuit) {
        this.mismo_cuit = true;
        this.asignarSinSolicitudForm.controls["demandadoCuit"].setErrors({
          invalidForm: true,
        });
        this.asignarSinSolicitudForm.controls["demandadoCuit"].markAsDirty();
      } else {
        this.mismo_cuit = false;
        this.userService.esCorredor(valor).subscribe(
          (res) => {
            console.log(res);
            this.incorrect_corredor_cuit = !res.data.esCorredor;
            if (!res.data.esCorredor) {
              this.noEsCorredorDemandando = true;
              this.asignarSinSolicitudForm.controls["demandadoCuit"].setErrors({
                invalidForm: true,
              });
              this.asignarSinSolicitudForm.controls[
                "demandadoCuit"
              ].markAsDirty();
              this.comprobarForm();
            } else {
              this.userService.esDadorCuit(valor).subscribe(
                (res) => {
                  this.incorrect_demandado_cuit = !res.data;
                  if (!res.data) {
                    this.asignarSinSolicitudForm.controls[
                      "demandadoCuit"
                    ].setErrors({ invalidForm: true });
                    this.asignarSinSolicitudForm.controls[
                      "demandadoCuit"
                    ].markAsDirty();
                  }
                  this.comprobarForm();
                },
                (error) => {}
              );
            }
          },
          (error) => {}
        );
      }
    } else if (valor.length == 0) {
      this.incorrect_demandado_cuit = false;
      this.mismo_cuit = false;
      this.comprobarForm();
    }
  }

  comprobarForm() {
    this.validForm = false;
    if (this.soyCorredor) {
      if (this.isContraparte) {
        this.validForm = true;
        this.noEsCorredorDemandando = false;
      } else {
        // Corredor sin contraparte
        if (
          this.asignarSinSolicitudForm.controls["nombredemandado"].value.length !== 0
          && this.asignarSinSolicitudForm.controls["demandadoCuit"].value.length === 11
        ){
          this.validForm = true;
          this.noEsCorredorDemandando = false;
        }
      }
    } else {
      // No soy corredor
      let val1 = false;
      let val2 = false;
      if (this.asignarSinSolicitudForm.controls["select_corredor"].value == 0) {
        if (
          this.asignarSinSolicitudForm.controls["demandadoCuit"].value.length ==
          11
        ) {
          if (!this.incorrect_demandado_cuit) {
            val1 = true;
            this.validForm = true;
            this.noEsCorredorDemandando = false;
          }
        } else {
          val1 = false;
          this.noEsCorredorDemandando = true;
        }
      } else {
        val1 = true;
        this.noEsCorredorDemandando = false;
      }
      if (
        this.asignarSinSolicitudForm.controls["select_contraparte"].value == 0
      ) {
        if (
          this.asignarSinSolicitudForm.controls["contraparte"].value.length ==
          11
        ) {
          if (!this.incorrect_contraparte_cuit) {
            val2 = true;
            this.noEsCorredorDemandando = false;
          }
        } else {
          val2 = false;
        }
      } else {
        val2 = true;
      }
      if (val1 && val2) {
        this.validForm = true;
      }
    }
  }
  get f() {
    return this.asignarSinSolicitudForm.controls;
  }
  submit() {
    let resp = {
      corredorCuit:
        this.asignarSinSolicitudForm.controls["select_corredor"].value == 0
          ? this.f.demandadoCuit.value
          : "00000000000",
      corredor:
        this.asignarSinSolicitudForm.controls["select_corredor"].value == 0
          ? this.f.nombredemandado.value.razon_social
          : this.soyCorredor
          ? "SIN OTRO CORREDOR"
          : "DIRECTO",
      contraparteCuit:
        this.f.contraparte.value == "" ? null : this.f.contraparte.value,
      contraparte:
        this.f.nombrecontraparte.value == ""
          ? null
          : this.f.nombrecontraparte.value.razon_social,
      contrato: this.f.contrato.value.toString(),
      caratula: this.f.caratula.value.toString(),
    };
    this.dialogRef.close(resp);
  }

  changeOptionCorredor(event) {
    if (event.value == "1") {
      this.readonlyDemandadoCuit = true;
      this.asignarSinSolicitudForm.controls["demandadoCuit"].markAsPristine();
      this.asignarSinSolicitudForm.controls["demandadoCuit"].setValue("");
      this.asignarSinSolicitudForm.controls["nombredemandado"].setValue("");
      this.esNecesarioCorredor = false;
      this.esCorredorDemandando = false;
      this.disabledContraparte = true;
      this.asignarSinSolicitudForm.controls["contraparte"].setValue("");
      this.asignarSinSolicitudForm.controls["nombrecontraparte"].setValue("");
      this.asignarSinSolicitudForm.controls["select_contraparte"].setValue("0");
    } else {
      this.readonlyDemandadoCuit = false;
      this.esNecesarioCorredor = true;
      this.esCorredorDemandando = true;
      this.disabledContraparte = false;
    }
    //this.comprobarForm();
  }
  changeOptionContraparte(event) {
    if (event.value == "1") {
      this.readonlyContraparteCuit = true;
      this.asignarSinSolicitudForm.controls["contraparte"].markAsPristine();
      this.asignarSinSolicitudForm.controls["contraparte"].setValue("");
      this.esNecesarioContraparte = false;
    } else {
      this.esNecesarioContraparte = true;
      this.readonlyContraparteCuit = false;
    }
    //this.comprobarForm();
  }

  llenarCuit(person: PersonRazonSocial, control: string) {
    if (person) {
      this.asignarSinSolicitudForm.controls[control].setValue(person.cuit_cuil);
      if (control === "demandadoCuit") {
        this.comprobarDemandadoCuit(person.cuit_cuil);
      }
      if (control === "contraparte") {
        this.isContraparte = true;
        this.incorrect_contraparte_cuit = false;
      }
    }
    this.comprobarForm();
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
}
