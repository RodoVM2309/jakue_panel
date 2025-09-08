import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDatepickerInputEvent, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';

@Component({
  selector: 'app-add-estado-chofer',
  templateUrl: './add-estado-chofer.component.html',
  styleUrls: ['./add-estado-chofer.component.scss'],
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
export class AddEstadoChoferComponent implements OnInit {
  itemForm: FormGroup;
  minDate: any;
  maxDate: any;
  estado: any;
  desdeDate: any;
  hastaDate: any;
  estados = [
    { id: '0', descripcion: "Activo" },
    { id: '1', descripcion: "Inactivo" },
    { id: '2', descripcion: "Sancionado" }
  ];
  causas = [
    { id: 0, descripcion: "Vacaciones" },
    { id: 1, descripcion: "Roturas" },
    { id: 2, descripcion: "Enfermedad" },
  ]
  id: any;
  id_chofer: any;
  observaciones: any = "";
  mostrarCausasInatividad: boolean = false;
  mostrarFecha: boolean = true;
  causa_inactividad = 'Vacaciones';
  now = new Date();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddEstadoChoferComponent>) { }

  ngOnInit() {
    this.id_chofer = this.data.payload.id_chofer;
    this.desdeDate = this.data.payload.desde+":12:00:00";
    let fechaDesde= new Date(this.desdeDate);    
    this.hastaDate = this.data.payload.hasta+":12:00:00";
    let fechaHasta= new Date(this.hastaDate);
    this.itemForm = new FormGroup({
      id_chofer: new FormControl(this.id_chofer),
      estado: new FormControl(this.estado, [Validators.required]),
      desdeDate: new FormControl('', [Validators.required]),
      hastaDate: new FormControl('', [Validators.required]),
      observaciones: new FormControl(this.observaciones),
      causa_inactividad: new FormControl(this.causa_inactividad)
    });
    if (!this.data.isNew) {
      this.id = this.data.payload.id_estado_chofer;
      this.estado = this.data.payload.estado;
      this.itemForm.controls['estado'].setValue(this.estado);
      this.itemForm.controls['desdeDate'].setValue(fechaDesde);
      this.hastaDate = this.data.payload.hasta;
      this.itemForm.controls['hastaDate'].setValue(fechaHasta);
      this.observaciones = this.data.payload.observaciones;
      this.itemForm.controls['observaciones'].setValue(this.observaciones);
      this.causa_inactividad = (this.estado === '1') ? this.data.payload.observaciones : '';
      this.itemForm.controls['causa_inactividad'].setValue(this.causa_inactividad);
      this.onChangeEstado(this.estado);
    } else {
      this.estado = '0';
      let date10 = new Date((this.now.getFullYear() + 10) + '-12-31');
      this.itemForm.controls['desdeDate'].setValue(this.desdeDate);
      this.itemForm.controls['hastaDate'].setValue(this.hastaDate);
      this.itemForm.controls['estado'].setValue(this.estado);
      this.onChangeEstado(this.estado);
    }
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>, cmp: string) {
    if (cmp === "desde") {
      this.minDate = event.value;
    } else {
      this.maxDate = event.value;
    }
  }

  onChangeEstado(value) {
    this.mostrarCausasInatividad = (value === '1') ? true : false;
    if (value === '0') {
      this.observaciones = '';
      this.itemForm.controls['observaciones'].setValue(this.observaciones);
      this.mostrarFecha = false;
    } else {
      this.mostrarFecha = true;
    }
  }

  submit() {
    let dat = {
      id: this.id,
      id_chofer: this.id_chofer,
      estado: this.itemForm.controls['estado'].value,
      desde: this.itemForm.controls['desdeDate'].value,
      hasta: this.itemForm.controls['hastaDate'].value,
      observaciones: (this.itemForm.controls['estado'].value === '1') ? this.itemForm.controls['causa_inactividad'].value : this.itemForm.controls['observaciones'].value
    };
    this.dialogRef.close(dat);
  }

}
