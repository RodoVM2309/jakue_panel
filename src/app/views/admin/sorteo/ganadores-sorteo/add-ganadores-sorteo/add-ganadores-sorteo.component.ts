import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PromocionesService } from './../../../../../shared/services/promociones.service';
@Component({
  selector: 'app-add-ganadores-sorteo',
  templateUrl: './add-ganadores-sorteo.component.html',
  styleUrls: ['./add-ganadores-sorteo.component.scss']
})
export class AddGanadoresSorteoComponent implements OnInit {
  public itemForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddGanadoresSorteoComponent>, private documentoService: PromocionesService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id_sorteo: [this.data.id_sorteo || ''],
      nombre: [item.nombre || '', Validators.required],
      apellidos: [item.apellidos || '', Validators.required],
      dni: [item.dni || '', Validators.required],
      email: [item.email || ''],
      telefono: [item.telefono || '', Validators.required],
    });
  }

  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }
  onChange(tem) {
    let va = 0;
    this.documentoService.buscarHuerfano(tem.srcElement.value).subscribe(
      pagedData => {
        if (pagedData.data) {
          this.itemForm.controls['nombre'].setValue(pagedData.data.nombre);
          this.itemForm.controls['apellidos'].setValue(pagedData.data.apellidos);
          this.itemForm.controls['email'].setValue(pagedData.data.email);
          this.itemForm.controls['telefono'].setValue(pagedData.data.telefono);
          va = 1;
        }
      });
    if (va == 0) {
      this.documentoService.buscarPersona(tem.srcElement.value).subscribe(
        pagedData => {
          if (pagedData.data) {
            this.itemForm.controls['nombre'].setValue(pagedData.data.nombre);
            this.itemForm.controls['apellidos'].setValue(pagedData.data.apellidos);
            this.itemForm.controls['email'].setValue(pagedData.data.email);
            this.itemForm.controls['telefono'].setValue(pagedData.data.telefono);
            va = 1;
          }
        });
    }
  }

}