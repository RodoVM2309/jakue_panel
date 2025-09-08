import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-zona-centro',
  templateUrl: './add-zona-centro.component.html',
  styleUrls: ['./add-zona-centro.component.scss']
})

export class AddZonaCentroComponent implements OnInit {
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddZonaCentroComponent>,
  private fb: FormBuilder) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload)
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      descripcion: [item.descripcion || '', Validators.required]
    });
  }

  submit() {
    this.dialogRef.close(this.itemForm.value);
  }

}
