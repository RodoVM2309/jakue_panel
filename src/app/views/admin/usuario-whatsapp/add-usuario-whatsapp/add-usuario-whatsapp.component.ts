import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-add-usuario-whatsapp',
  templateUrl: './add-usuario-whatsapp.component.html',
  styleUrls: ['./add-usuario-whatsapp.component.scss']
})
export class AddUsuarioWhatsappComponent implements OnInit {
  public itemForm: FormGroup;
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUsuarioWhatsappComponent>,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id_centro: [''],
      telefono: [ '', Validators.required],
      cuit_cliente: [ '', Validators.required],
      razon_social: [ '', Validators.required],
    });
    
  }

  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }

}