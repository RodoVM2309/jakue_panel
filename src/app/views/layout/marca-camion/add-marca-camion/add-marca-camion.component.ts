import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-marca-camion',
  templateUrl: './add-marca-camion.component.html',
  styleUrls: ['./add-marca-camion.component.scss']
})
export class AddMarcaCamionComponent implements OnInit {
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddMarcaCamionComponent>,
  private fb: FormBuilder) { }

  
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
    this.dialogRef.close(this.itemForm.value);
  }

}
