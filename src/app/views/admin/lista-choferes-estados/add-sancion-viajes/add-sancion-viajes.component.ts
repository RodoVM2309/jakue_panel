import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-sancion-viajes',
  templateUrl: './add-sancion-viajes.component.html',
  styleUrls: ['./add-sancion-viajes.component.scss']
})
export class AddSancionViajesComponent implements OnInit {
  itemForm: FormGroup;
  id: any;
  id_chofer: any;
  motivo: any = "";
  cantidad: any = 1;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddSancionViajesComponent>) { }

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
