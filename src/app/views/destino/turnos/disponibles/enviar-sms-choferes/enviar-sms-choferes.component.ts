import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-enviar-sms-choferes',
  templateUrl: './enviar-sms-choferes.component.html',
  styleUrls: ['./enviar-sms-choferes.component.scss']
})
export class EnviarSmsChoferesComponent implements OnInit {
  public itemForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<EnviarSmsChoferesComponent>,
  private fb: FormBuilder) { }

  ngOnInit() {
    this.itemForm = this.fb.group({
      body: [ '', [Validators.required, this.customValidator()]],
    });
  }


  customValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = /^[A-Za-z0-9.,!¡()?¿\s]*$/.test(control.value); // Incluye ? y ¿
      return valid ? null : { invalidCharacters: true };
    };
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
