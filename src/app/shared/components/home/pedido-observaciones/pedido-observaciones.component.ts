import { Component, OnInit, Inject } from '@angular/core';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder,  FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-pedido-observaciones',
  templateUrl: './pedido-observaciones.component.html',
  styleUrls: ['./pedido-observaciones.component.scss']
})
export class PedidoObservacionesComponent implements OnInit {
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PedidoObservacionesComponent>,
    private fb: FormBuilder) { }

    ngOnInit() {
      this.buildItemForm(this.data.payload);
    }

    buildItemForm(item) {
      this.itemForm = this.fb.group({
        id: [item.id],
        observaciones: new FormControl(item.observaciones)
      });
    }

    submit() {
      this.dialogRef.close(this.itemForm.value);
    }

}
