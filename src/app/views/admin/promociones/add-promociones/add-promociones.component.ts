import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-add-promociones',
  templateUrl: './add-promociones.component.html',
  styleUrls: ['./add-promociones.component.scss']
})
export class AddPromocionesComponent implements OnInit {
  public itemForm: FormGroup;
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddPromocionesComponent>,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      nombre: [item.nombre || '', Validators.required],
      cant_beneficiarios: [item.cant_beneficiarios || '', Validators.required],
      intervalo: [item.intervalo || '', Validators.required],
      titulo: [item.titulo || '', Validators.required],
      descripcion: [item.descripcion || '']
    });
  }

  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }

}
