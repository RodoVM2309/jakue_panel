import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-sms-retorno',
  templateUrl: './add-sms-retorno.component.html',
  styleUrls: ['./add-sms-retorno.component.scss']
})
export class AddSmsRetornoComponent implements OnInit {
  public itemForm: FormGroup;
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddSmsRetornoComponent>,
    private fb: FormBuilder) { }

  ngOnInit() {
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
