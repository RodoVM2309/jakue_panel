import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-enviar-sms-trans',
  templateUrl: './enviar-sms-trans.component.html',
  styleUrls: ['./enviar-sms-trans.component.scss']
})
export class EnviarSmsTransComponent implements OnInit {
  public itemForm: FormGroup;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<EnviarSmsTransComponent>,
  private fb: FormBuilder) { }

  ngOnInit() {
    this.itemForm = this.fb.group({
      body: [ '', Validators.required],
    });
  }

  buildItemForm() {

  }

  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }

  cancelar() {
    this.dialogRef.close();
  }

}
