import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { CentrosService } from './../../../../shared/services/centros.service';
import { Subscription, of } from 'rxjs';
import { Intermediario } from 'app/views/admin/vincular-centro-intermediario/vincular-intermediario/vincular-intermediario.component';

export class Operador {
  id: number;
  nombre_persona: string;
}
@Component({
  selector: 'app-confirmar-pedido-retorno',
  templateUrl: './confirmar-pedido-retorno.component.html',
  styleUrls: ['./confirmar-pedido-retorno.component.scss']
})
export class ConfirmarPedidoRetornoComponent implements OnInit {
  cantReducir = 0;
  public itemForm: FormGroup;
  public getItemSub: Subscription;
  intermediarios: Intermediario[];
  operadores: Operador[];
  mostrarIntermediario: boolean = false;
  mostrarOperador: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmarPedidoRetornoComponent>,
    private fb: FormBuilder, 
    private centrosService: CentrosService) { }


  ngOnInit() {
    this.buildItemForm(this.data.payload);
    this.getItems();
  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id],
      id_cliente: [item.id_cliente],
      id_centro: [item.id_centro],
      solicitud: [item.solicitud],
      id_observador: [item.id_observador],
      selectedIntermediario: new FormControl(''),
      selectedOperador: new FormControl(''),
      ckIntermediario: new FormControl(''),
      ckOperador: new FormControl('')
    });
  }
  submit() {
    this.dialogRef.close(this.itemForm.value)
  }
  getItems() {

    this.getItemIntermediarios();
    this.getItemOperadores();
  }

  getItemIntermediarios() {
    this.getItemSub = this.centrosService.getIntermediarioByIdCentroSelect()
      .subscribe(data => {
        this.intermediarios = data.data;
      });
  }

  getItemOperadores() {
    this.getItemSub = this.centrosService.getOperadoreByIdCentroSelect()
      .subscribe(data => {
        this.operadores = data.data;
      });
  }

  onChange(event) {
    this.mostrarIntermediario = event.checked;
    if (event.checked) {
      this.mostrarOperador = false;
      this.itemForm.controls['ckOperador'].setValue(false);
      this.itemForm.controls['selectedOperador'].setValue('');
    }
  }

  onChange2(event) {
    this.mostrarOperador = event.checked;
    if (event.checked) {
      this.mostrarIntermediario = false;
      this.itemForm.controls['ckIntermediario'].setValue(false);
    }
  }
}
