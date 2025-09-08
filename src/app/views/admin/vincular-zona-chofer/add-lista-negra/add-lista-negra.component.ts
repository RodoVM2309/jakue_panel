import { Component, OnInit, Inject } from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
} from "@angular/forms";
import { ListaNegraMotivosService } from "./../../../../shared/services/lista-negra-motivos.service";
import { ListaNegraMotivo } from "./../../../../shared/models/listaNegraMotivo";
import { Subscription } from "rxjs";
import {
  MatDialogRef,
  MatDialog,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from "@shared/helpers/date.adapter";

@Component({
  selector: "app-add-lista-negra",
  templateUrl: "./add-lista-negra.component.html",
  styleUrls: ["./add-lista-negra.component.scss"],
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
export class AddListaNegraComponent implements OnInit {
  public itemForm: FormGroup;
  public getItemSub: Subscription;
  public motivos: ListaNegraMotivo[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddListaNegraComponent>,
    private listaNegraMotivosService: ListaNegraMotivosService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getItemsMotivoListaNegra();
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ""],
      id_chofer: [item.id_usuario || ""],
      id_motivo: [item.id_motivo || "", Validators.required],
      explicacion: [item.explicacion || "", Validators.required],
      fecha_hasta: [item.fecha_hasta || "", [this.minDateValidator]],
    });
  }

  // Validador personalizado para fecha mínima (mayor que hoy)
  minDateValidator = (control: any) => {
    if (!control.value) {
      return null; // Campo opcional, sin valor es válido
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
    const selectedDate = new Date(control.value);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate > today ? null : { minDate: true };
  };

  // Getter para obtener la fecha mínima (mañana)
  get minDate(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  // Getter para obtener errores del campo fecha_hasta
  get fechaHastaErrors(): string | null {
    const control = this.itemForm.get("fecha_hasta");
    if (control && control.errors && control.touched) {
      if (control.errors["minDate"]) {
        return "La fecha debe ser mayor a hoy";
      }
    }
    return null;
  }

  submit() {
    const formValue = { ...this.itemForm.value };

    // Formatear fecha_hasta para enviar solo la fecha sin hora
    if (formValue.fecha_hasta) {
      const fecha = new Date(formValue.fecha_hasta);
      formValue.fecha_hasta = fecha.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    }

    this.dialogRef.close(formValue);
  }

  getItemsMotivoListaNegra() {
    this.getItemSub = this.listaNegraMotivosService
      .getAllListaNegraMotivoSelect()
      .subscribe((data) => {
        this.motivos = data.data;
      });
  }
}
