import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";

import { ListaNegraMotivosService } from "./../../../../shared/services/lista-negra-motivos.service";
import { ListaNegraMotivo } from "./../../../../shared/models/listaNegraMotivo";

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
  selector: "app-edit-lista-negra",
  templateUrl: "./edit-lista-negra.component.html",
  styleUrls: ["./edit-lista-negra.component.scss"],
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
export class EditListaNegraComponent implements OnInit {
  public itemForm: FormGroup;
  public lista_negra_motivo: ListaNegraMotivo[];
  public getItemSub: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditListaNegraComponent>,
    private fb: FormBuilder,
    private lista_negra_motivoService: ListaNegraMotivosService
  ) {}

  ngOnInit() {
    this.buildItemForm(this.data.payload);
    this.getItems();
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ""],
      id_chofer: [item.id_chofer || ""],
      id_motivo: [item.id_motivo, Validators.required],
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

  getItems() {
    this.getItemSub = this.lista_negra_motivoService
      .getAllListaNegraMotivoSelect()
      .subscribe((data) => {
        this.lista_negra_motivo = data.data;
      });
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
}
