import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-sms',
  templateUrl: './add-sms.component.html',
  styleUrls: ['./add-sms.component.scss']
})
export class AddSmsComponent implements OnInit {
  public itemForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddSmsComponent>,
    private fb: FormBuilder) { }

  ngOnInit() {
    console.log(this.data);

    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      mensaje: [item.mensaje || '', Validators.required],
      celular: [item.celular || '']
    });
  }

  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }

}
