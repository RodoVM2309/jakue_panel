import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NomencladoresService } from '../../../../services/nomencladores.service';
import { Pedido} from '../../../../models/pedido';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-info-pedido',
  templateUrl: './info-pedido.component.html',
  styleUrls: ['./info-pedido.component.scss']
})
export class InfoPedidoComponent implements OnInit {
  public itemForm: FormGroup;
  public getItemSub: Subscription;
  private pedido:Pedido;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<InfoPedidoComponent>,
  private fb: FormBuilder,
  private nomecladoresServices: NomencladoresService) { }

  ngOnInit() {
    this.getItemPedido(this.data.payload.id);
    this.buildItemForm();
  }
  getItemPedido(id) {
    this.getItemSub = this.nomecladoresServices.getPedido(id)
      .subscribe(data => {
        this.pedido=data.data[0];
        this.itemForm.controls['id'].setValue(id);
        this.itemForm.controls['pedidoId'].setValue(this.pedido.origen);
        this.itemForm.controls['cantidad'].setValue(this.pedido.cantidad);
        this.itemForm.controls['pedidoOrigen'].setValue(this.pedido.origen.descripcion);
        this.itemForm.controls['pedidoZona'].setValue(this.pedido.zonaDestino.descripcion);
        this.itemForm.controls['pedidoDador'].setValue(this.pedido.nombre_cliente);
        this.itemForm.controls['pedidoProducto'].setValue(this.pedido.producto.descripcion);
        this.itemForm.controls['pedidoFechaDesde'].setValue(this.pedido.fecha_desde);
        this.itemForm.controls['pedidoFechaHasta'].setValue(this.pedido.fecha_hasta);
        this.itemForm.controls['cantidadAsignados'].setValue(this.pedido.viajes_asignados);
        this.itemForm.controls['tipo_pedido'].setValue(this.pedido.tipo_pedido);
      });
  }
  buildItemForm() {
    this.itemForm = this.fb.group({
      id: [''],
      pedido: [''],
      pedidoId: [''],
      cantidad: [''],
      pedidoOrigen: [''],
      pedidoZona: [''],
      pedidoDador: [''],
      pedidoProducto: [''],
      pedidoFechaDesde: [''],
      pedidoFechaHasta: [''],
      cantidadAsignados: [''],
      tipo_pedido: ['']
    });
  }

  submit() {
    this.dialogRef.close();
  }

}
