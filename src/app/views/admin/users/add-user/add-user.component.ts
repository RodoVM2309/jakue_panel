import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddUserComponent>,
  private fb: FormBuilder,) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload)
  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      userName: [item.userName || '', Validators.required],
      firstName: [item.firstName || '', Validators.required],
      lastName: [item.lastName || '', Validators.required],
      email: [item.email || ''],      
      phone: [item.phone || '']      
    })
  }

  submit() {
    this.dialogRef.close(this.itemForm.value)
  }

}
