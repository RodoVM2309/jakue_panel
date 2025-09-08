import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-sancion-viaje',
  templateUrl: './add-sancion-viaje.component.html',
  styleUrls: ['./add-sancion-viaje.component.scss']
})
export class AddSancionViajeComponent implements OnInit {
  itemForm: FormGroup;
  id: any;
  id_chofer: any;
  motivo: any = "";
  cantidad: any = 1;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddSancionViajeComponent>) { }

ngOnInit() {
  this.id_chofer = this.data.payload.id_chofer;
  this.itemForm = new FormGroup({
    motivo: new FormControl(this.motivo, [Validators.required]),
    cantidad: new FormControl(this.cantidad, [Validators.required])
  });
}

submit() {
  let dat = {
    id: this.id,
    id_chofer: this.id_chofer,
    motivo : this.itemForm.controls['motivo'].value,
    cantidad : this.itemForm.controls['cantidad'].value,
  };
  this.dialogRef.close(dat);
}

}
