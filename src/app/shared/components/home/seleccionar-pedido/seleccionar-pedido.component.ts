import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-seleccionar-pedido',
  templateUrl: './seleccionar-pedido.component.html',
  styleUrls: ['./seleccionar-pedido.component.scss']
})
export class SeleccionarPedidoComponent implements OnInit {
  tipoPedido = 0;
  showCentro = false;
  showDador = false;
  rolAdminMuvin = false;
  escliente = false;
  esOperador = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SeleccionarPedidoComponent>) { }

  ngOnInit() {
    let rol: string = localStorage.getItem('rol');
    let cliente: string = localStorage.getItem('clienteMuvin');

    if (rol === '1') {
      this.showCentro = true;
      this.rolAdminMuvin = true;
    }
    if (rol === '5') {
      this.showDador = true;
    }
    if (rol === '3' || rol === '11') {
      if (cliente === '0') {
        this.escliente = true;
      }
    }
    if (rol === '11') {
      this.esOperador = true;
    }
    this.tipoPedido = this.data.tipoPedido;
  }

  closeForm(){
    this.dialogRef.close();
  }

  opcionSelect(opc) {
    switch (opc) {
      case 1:
        this.tipoPedido = 1;
        this.data.tipoPedido = 1;
        this.dialogRef.close(this.data);
        break;
      case 2:
        this.tipoPedido = 2;
        this.data.tipoPedido = 2;
        this.dialogRef.close(this.data);
        break;
      case 3:
        this.tipoPedido = 3;
        this.data.tipoPedido = 3;
        this.dialogRef.close(this.data);
        break;
      case 4:
        this.tipoPedido = 4;
        this.data.tipoPedido = 4;
        this.dialogRef.close(this.data);
        break;
      default:
        this.tipoPedido = 1;
        this.dialogRef.close(this.data);
        break;
    }
  }


}
