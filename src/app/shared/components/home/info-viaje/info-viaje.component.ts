import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder,  FormGroup,  } from '@angular/forms';

@Component({
  selector: 'app-info-viaje',
  templateUrl: './info-viaje.component.html',
  styleUrls: ['./info-viaje.component.scss']
})

export class InfoViajeComponent implements OnInit {
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InfoViajeComponent>,
    private fb: FormBuilder,) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    let motivo:string='';
    if(item.calada_rechazada.length!=0){
      motivo= item.calada_rechazada[0].motivo_rechazo;
    }
    this.itemForm = this.fb.group({
      nombre_destinatario: ['' || item.nombre_destinatario],
      nombre_corredor: ['' || item.nombre_corredor],
      nombre_entregador: ['' || item.nombre_entregador],
      nombre_intermediario: ['' || item.nombre_intermediario],
      nombre_transportista: ['' || item.nombre_transportista],
      distance: ['' || item.distance],
      motivo_rechazo: ['' || motivo]
    });
  }

  submit() {
    this.dialogRef.close();
  }
}