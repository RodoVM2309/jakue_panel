import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ValidatorFn,
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
import { HomeService } from "@app/shared/components/home/home.service";
import { PersonRazonSocial } from "@app/shared/models";
import {
  AppAlertService,
  AppAtencionService,
  AppErrorService,
  AppLoaderService,
  NomencladoresService,
  PersonasService,
  UserService,
} from "@app/shared/services";
import { AppDateAdapter, APP_DATE_FORMATS } from "@shared/helpers/date.adapter";
import * as moment from "moment";
import { fromEvent } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { CentroAdministraCuposComponent } from "../../add-cupos-solicitados/centro-administra-cupos/centro-administra-cupos.component";
import { CupoService } from "../../cupo.service";
import {
  FunctionAutoAsignar,
  FunctionCompleteCuit,
  FunctionConstructorForm,
  FunctionFromEvent,
  FunctionInitForm,
  FunctionInputFechas,
  FunctionLoadCentroAdminCupos,
  FunctionSubmitForm,
  FunctionValidations,
} from "./functions";
import { Variables } from "./variables";

@Component({
  selector: "app-add-solicitudes-c3",
  templateUrl: "./add-solicitudes-c3.component.html",
  styleUrls: ["./add-solicitudes-c3.component.scss"],
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
export class AddSolicitudesC3Component implements OnInit {
  @ViewChild("demandadoCuit") demandadoCuit: ElementRef;
  @ViewChild("contraparte") contraparte: ElementRef;
  @ViewChild("destinatario") destinatario: ElementRef;
  @ViewChild("nombredemandado") nombredemandado: ElementRef;
  @ViewChild("nombredestinatario") nombredestinatario: ElementRef;
  @ViewChild("nombrecontraparte") nombrecontraparte: ElementRef;
  variables = new Variables();
  usaCupera1: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cupoService: CupoService,
    private homeService: HomeService,
    private userService: UserService,
    private errorService: AppErrorService,
    private alertService: AppAlertService,
    private atencionService: AppAtencionService,
    private loader: AppLoaderService,
    public nomencladoresService: NomencladoresService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddSolicitudesC3Component>,
    private dialog: MatDialog,
    private personasService: PersonasService
  ) {
    this.usaCupera1 = localStorage.getItem("usaCupera") =='1' ? true : false;
    FunctionConstructorForm.constructorForm(this.variables, this.data, this.fb);
  }

  ngOnInit() {
    FunctionInitForm.init(this.variables, this.data);
    fromEvent(this.nombredestinatario.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        FunctionFromEvent.FromEventNombreDestinatario(
          text,
          this.variables,
          this.personasService,
          this.userService
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
        FunctionFromEvent.FromEventDestinatario(
          text,
          this.variables,
          this.personasService,
          this.cupoService
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
        FunctionFromEvent.FromEventNombreDemandado(
          text,
          this.variables,
          this.personasService,
          this.cupoService
        );
      });
    fromEvent(this.demandadoCuit.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        FunctionFromEvent.FromEventDemandadoCuit(
          text,
          this.variables,
          this.personasService,
          this.cupoService
        );
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
        FunctionFromEvent.FromEventNombreContraparte(
          text,
          this.variables,
          this.personasService,
          this.cupoService
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
        FunctionFromEvent.FromEventContraparte(
          text,
          this.variables,
          this.personasService,
          this.userService
        );
      });

  }

  submit() {
    FunctionSubmitForm.submit(
      this.cupoService,
      this.alertService,
      this.atencionService,
      this.errorService,
      this.variables,
      this.loader,
      this.f,
      this.dialogRef
    );
  }

  autoAsignar(event) {
    FunctionAutoAsignar.autoAsignar(this.cupoService,this.userService, this.variables, event);
  }

  completeCuit(person: PersonRazonSocial, control: string) {
    FunctionCompleteCuit.completeCuit(
      this.cupoService,
      this.userService,
      this.variables,
      person,
      control
    );
  }

  comprobarCorredorCuit(valor: string) {
    FunctionValidations.comprobarCorredorCuit(
      this.cupoService,
      this.userService,
      this.variables,
      valor
    );
  }

  comprobarDestinatarioCuit(valor: string) {
    FunctionValidations.comprobarDestinatarioCuit(
      this.cupoService,
      this.userService,
      this.variables,
      valor
    );
  }
  comprobarContraparteCuit(valor: string) {
    FunctionValidations.comprobarContraparteCuit(
      this.userService,
      this.variables,
      valor
    );
  }

  comprobarForm() {
   this.variables.validForm = true;
    let demand = this.variables.addSolicitudForm.controls["demandadoCuit"].value;
    let destinat = this.variables.addSolicitudForm.controls["destinatario"].value;
    if (this.variables.addSolicitudForm.controls["autosolicitud"].value) {
      //solicitud propia
      if (
        this.variables.addSolicitudForm.controls["nombredemandado"].value ===
        this.variables.personEmpty &&
        this.variables.addSolicitudForm.controls["nombrecontraparte"].value ===
        this.variables.personEmpty
      ) {
        this.variables.validForm = false;
      } else {
        if (this.variables.incorrect_corredor_cuit) this.variables.validForm = false;
      }

    } else {
      // No es propia
      if (
        this.variables.addSolicitudForm.controls["nombredemandado"].value ===
        this.variables.personEmpty &&
        this.variables.addSolicitudForm.controls["nombredestinatario"].value ===
        this.variables.personEmpty
      ) {
        this.variables.validForm = false;
      } else {
        if (
          !this.variables.incorrect_destinatario_cuit &&
          (this.variables.addSolicitudForm.controls["demandadoCuit"].value.length > 0 ||
            this.variables.addSolicitudForm.controls["destinatario"].value.length > 0)
        ) {
          this.variables.validForm = true;
          this.variables.addSolicitudForm.controls["demandadoCuit"].markAsPristine();
          this.variables.addSolicitudForm.controls["demandadoCuit"].setValue(demand);
          this.variables.addSolicitudForm.controls["destinatario"].markAsPristine();
          this.variables.addSolicitudForm.controls["destinatario"].setValue(destinat);
          this.variables.noEsCorredorDemandando = false;
        } else {
          if (
            this.variables.incorrect_destinatario_cuit &&
            this.variables.addSolicitudForm.controls["destinatario"].value.length > 0
          ) {
            this.variables.addSolicitudForm.controls["destinatario"].setErrors({
              invalidForm: true,
            });
            this.variables.addSolicitudForm.controls["destinatario"].markAsDirty();
            this.variables.validForm = false;
          }
        }
      }
    }

    let tempCant = 0;
    this.variables.invalidFechaCant = true;
    for (let index = 0; index < this.variables.cantDias; index++) {
      tempCant =
        tempCant + this.variables.addSolicitudForm.controls["cantidad_" + index].value;
      if (
        this.variables.addSolicitudForm.controls["cantidad_" + index].value > 0 &&
        this.variables.addSolicitudForm.controls["fecha_" + index].value == ""
      ) {
        if (this.variables.invalidFechaCant) {
          this.variables.invalidFechaCant = false;
        }
      }
    }
    this.variables.cantidadCupos = tempCant;
    return this.variables.validForm
  }

  inputFecha(fecha, i) {
    FunctionInputFechas.chanceFecha(this.homeService, this.variables, fecha, i);
  }

  validateCodigoCosecha(value, tipo) {
    FunctionValidations.validateCodigoCosecha(value, tipo, this.variables);
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
  noEsCorredor(): boolean {
    return (!this.variables.mismo_cuit &&
      this.variables.incorrect_corredor_cuit) ||
      this.variables.noEsCorredorDemandando
      ? true
      : false;
  }
  onChange2(cmp) {
    FunctionLoadCentroAdminCupos.loadForm(this.dialog, cmp, this.f);
  }

  get f() {
    return this.variables.addSolicitudForm.controls;
  }
}
