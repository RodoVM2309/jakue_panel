import { Component, OnInit, Inject } from '@angular/core';
import {  MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormControl, FormBuilder, FormGroup,  Validators } from '@angular/forms';
import {  Subscription } from 'rxjs';
import { NomencladoresService } from '../../../../services/nomencladores.service';

export class variarSubpedido {
  id: number;
  fecha_desde: string;
  fecha_hasta: string;
  id_origen: number;
  id_zona_destino: number;
  id_cliente: number;
  id_centro: number;
  cantidad: number;
  reduccion: number;
  id_producto: number;
  bloqueado: number;
  oculto: number;
  id_operador: number;
  id_observador: number;
  solicitud: number;
  id_generador: number;
  id_pedido_padre: number;
  tipo: number;
  _fecha_desde: string;
  _fecha_hasta: string;
  nombre_cliente: string;
  nombre_centro: string;
  nombre_observador: string;
  nombre_generador: string;
  viajes_asignados: number;
  estados: {
    Pendiente: number;
    A_Km_de_origen: string;
    Cargado: number;
    A_km_de_destino: number;
    En_destino: number;
    Conforme: number;
    Rechazado: number;
    Esperando: number;
    Descargado: number;
  };
  zonaDestino: {
    id: number;
    descripcion: string;
  };
  producto: {
    id: number;
    descripcion: string;
    cupo_obligatorio: number;
  };
  origen: {
    id: number;
    id_localidad: number;
    descripcion: string;
    direccion: string;
    nombre_contacto: string;
    telefono: string;
    email: string;
    bloqueado: number;
    id_persona_rol: number;
    longitud: number;
    latitud: number;
    id_zona_destino: number;
    domicilio: null,
    id_tipo_destino: number;
    id_situacion_puerto: number;
    horas_atraso: number;
  };
  viajes_bloqueados: number;
  desvios: number;
  tipo_pedido: string;
};


@Component({
  selector: 'app-variar-subpedido',
  templateUrl: './variar-subpedido.component.html',
  styleUrls: ['./variar-subpedido.component.scss']
})

export class VariarSubpedidoComponent implements OnInit {
  public itemForm: FormGroup;
  public getItemSub: Subscription;
  public pedido;
  public viajes_x_asignar = 0;
  public cant = [];
  public cantfalt = [];
  public propioData: any;
  public quantity: any;
  public minimo: any;
  public valor: any;
  public pedidoPadre: number;
  public cantidadPadre: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VariarSubpedidoComponent>,
    private nomecladoresServices: NomencladoresService,
   ) { }

  ngOnInit() {

    this.pedido = this.data.payload;
    this.viajes_x_asignar = this.data.xAsignar;
    this.minimo = (this.pedido.cantidad > 0)? this.pedido.cantidad * (-1) : 0; //this.pedido.cantidad - this.pedido.viajes_asignados;
    this.pedidoPadre = this.data.pedidoPadre;
    this.cantidadPadre = this.data.cantidadPadre;
    this.itemForm = new FormGroup({
      quantity: new FormControl(null, [Validators.required, Validators.min(this.minimo), Validators.max(this.viajes_x_asignar)])
    });
  }
  public modificarcant(e: any) {
    this.valor = e;
  }

  guardar() {
    this.valor = this.valor;
    //this.pedido.cantidad = parseInt(this.pedido.cantidad) + parseInt(this.valor);
    const datos = {
      id: this.pedido.id,
      cantidad: parseInt(this.pedido.cantidad) + parseInt(this.valor)
    };
    this.nomecladoresServices.postConfirmarPedido(datos)
      .subscribe(data => {       
        this.dialogRef.close();
      });

      
  }
  submit() {

    this.dialogRef.close();
  }


}