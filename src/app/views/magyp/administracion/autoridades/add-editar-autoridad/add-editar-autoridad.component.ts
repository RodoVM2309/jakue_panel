import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { MagypAutoridad } from 'app/shared/models/magyp-cadena';

@Component({
  selector: 'app-add-editar-autoridad',
  templateUrl: './add-editar-autoridad.component.html',
  styleUrls: ['./add-editar-autoridad.component.scss']
})
export class AddEditarAutoridadComponent implements OnInit {
  autoridadForm: FormGroup;
  action: string;
  traduccionAction: string;
  local_data: any;
  isDelete = false;
  isAdd = false;
  isEdit = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddEditarAutoridadComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: MagypAutoridad
  ) {
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

  ngOnInit() {
    if (!this.isDelete) {
      this.autoridadForm = this.formBuilder.group({
        descripcion: [this.isAdd ? '' : this.local_data.descripcion, Validators.required],
      });
    }
  }
  get f() { return this.autoridadForm.controls; }

  doAction() {
    if (!this.isDelete) {
      this.local_data.descripcion = this.f.descripcion.value;
      this.dialogRef.close({ event: this.action, data: this.local_data });
    } else {
      this.dialogRef.close({ event: 'Delete', data: this.local_data });
    }

  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
