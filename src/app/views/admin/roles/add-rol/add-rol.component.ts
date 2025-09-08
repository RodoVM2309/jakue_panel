import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-rol',
  templateUrl: './add-rol.component.html',
  styleUrls: ['./add-rol.component.scss']
})
export class AddRolComponent implements OnInit {
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddRolComponent>,
  private fb: FormBuilder) { }


  ngOnInit() {
    this.buildItemForm(this.data.payload)
  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      name: [item.name || '', Validators.required],
      description: [item.description || '', Validators.required]
    })
  }
  submit() {
    this.dialogRef.close(this.itemForm.value);
  }


}
