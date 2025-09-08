import { Component, OnInit, Inject, Optional } from '@angular/core';
import { EstadoPuerto } from 'app/shared/models/estado-puerto';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-edit-estado',
  templateUrl: './add-edit-estado.component.html',
  styleUrls: ['./add-edit-estado.component.scss']
})
export class AddEditEstadoComponent implements OnInit {
  estadoForm: FormGroup;
  action: string;
  traduccionAction: string;
  local_data: any;
  isDelete: boolean = false;
  isAdd: boolean = false;
  isEdit: boolean = false;

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddEditEstadoComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: EstadoPuerto) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    switch (this.action) {
      case 'Add':
        this.traduccionAction = 'Agregar'
        break;
      case 'Update':
        this.traduccionAction = 'Actualizar'
        break;
      case 'Delete':
        this.traduccionAction = 'Eliminar'
        break;

      default:
        break;
    }
    this.isDelete = this.action === 'Delete' ? true : false;
    this.isAdd = this.action === 'Add' ? true : false;
    this.isEdit = this.action === 'Update' ? true : false;
  }

  ngOnInit(): void {
    this.estadoForm = this.formBuilder.group({
      descripcion: [this.isAdd ? '' : this.local_data.descripcion, Validators.required],
      color: [this.isAdd ? '' :  this.local_data.color, Validators.required],
    });
}

get f() { return this.estadoForm.controls; }

doAction() {
  if (!this.isDelete) {
    this.local_data.descripcion = this.f.descripcion.value;
    this.local_data.color = this.f.color.value;
  }
  this.dialogRef.close({ event: this.action, data: this.local_data });
}

closeDialog() {
  this.dialogRef.close({ event: 'Cancel' });
}


}
