import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reducir',
  templateUrl: './reducir.component.html',
  styleUrls: ['./reducir.component.scss']
})
export class ReducirComponent implements OnInit {
  cantReducir = 0;
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReducirComponent>,
    private fb: FormBuilder, ) { }


  ngOnInit() {
    this.buildItemForm(this.data.payload);

  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id],
      origen: [item.origen.descripcion],
      zonaDestino: [item.zonaDestino.descripcion],
      producto: [item.producto.descripcion],
      dador: [item.nombre_cliente],
      total: [item.cantidad],
      reduccion: [item.reduccion],
      viajeAsignados: [item.viajes_asignados],
      viajeXAsignar: [item.cantidad + item.reduccion - item.viajes_asignados],
      quantity: [this.cantReducir, [Validators.required, Validators.min((item.cantidad + item.reduccion-(item.viajes_asignados-item.viajes_bloqueados) ) * (-1))]]
    })
  }
  submit() {
    this.dialogRef.close(this.itemForm.value)
  }

}
