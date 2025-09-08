import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-tipo-acoplado',
  templateUrl: './add-tipo-acoplado.component.html',
  styleUrls: ['./add-tipo-acoplado.component.scss']
})
export class AddTipoAcopladoComponent implements OnInit {
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddTipoAcopladoComponent>,
  private fb: FormBuilder,) { }

  
  ngOnInit() {
    this.buildItemForm(this.data.payload)
  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      descripcion: [item.descripcion || '', Validators.required]
    })
  }
  submit() {
    this.dialogRef.close(this.itemForm.value)
  }

}
