import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HomeService } from 'app/shared/components/home/home.service';

import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ExelService } from 'app/shared/services/exel.service';
import { ReservasService } from 'app/shared/services/reservas.service';
import { DetalleCuposComponent } from '../detalle-cupos/detalle-cupos.component';
import {ReservasDB} from '../../../../shared/inmemory-db/reservas-db'

 interface DetalleReserva {
  id: string;
  id_cliente: string;
  cliente: string;
  terminal: string;
  destino: string;
  solicitante?: any;
  observaciones?: string;
  estado: number;
  reservas: Reserva[];
}
interface Reserva {
  id_reserva: string;
  id_pedido: string;
  id_reserva_real: number;
  id_chofer?: number;
  stoc: string;
  fecha_pedido: string;
  chofer?: string;
  patente_acoplado?: string;
  patente_camion?: string;
  cuit: string;
  estado?: string;
  productos: Producto[];
}

interface Producto {
  id_tipo_despacho: string;
  tipo_despacho: string;
  producto: string;
  contrato: string;
  composicion?: string;
  cantidad: number;
}
export interface ExportDatos {
  cliente:string;
  terminal:string;
  estado: any;
  solicitante:string;
  destino:string;
  reserva:string;
  fecha:string;

  cuit_chofer?:string;
  nombre_chofer?:string;
  patente_camion?:string;
  patente_acoplado?:string;
  st_oc:string;

  tipo_despacho:string;
  producto:string;
  contrato:string;
  composicion:string;
  cantidad:number;

  observacion:string;
}



@Component({
  selector: 'app-detalle-reservas',
  templateUrl: './detalle-reservas.component.html',
  styleUrls: ['./detalle-reservas.component.scss']
})

export class DetalleReservasComponent implements OnInit {


  listaPedidos : DetalleReserva[] = [] ;
  listaPedidosTemp : DetalleReserva[] = [] ;
  reservaslista : Reserva[] = [] ;
  destino: string;
  solicitante: string;
  observaciones: string;
  filtrosForm    : FormGroup;
  estados  = [
    {
      id: 0,
      descripcion: 'Todos'
    },
    {
      id: 1,
      descripcion: 'Procesados'
    }
  ];
  estado : number  = 0 ;
  fechaModificada: string = "";
  now       = new Date();
  productosExp = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DetalleReservasComponent>,
    private dialog: MatDialog,
    private reservasService: ReservasService,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private excelService: ExelService,
    private homeService: HomeService,
  ) { }

  ngOnInit() {
    this.estado = this.data['estado'];
    this.buildItemForm(this.data.payload);
    this.filtrosForm.get('id_estado').valueChanges.subscribe(estado => {
      this.estado  = estado;
    });
  }

  buildItemForm(pedidos:DetalleReserva[]) {
    this.listaPedidos     = pedidos;
    this.listaPedidosTemp = pedidos;
    this.filtrosForm = this.fb.group({
      cliente: [pedidos[0].cliente || ''],
      terminal: [pedidos[0].terminal || ''],
      id_estado: [this.estado]
    });
  }

  submit(){
    let listaTemp = JSON.parse(JSON.stringify(this.listaPedidos));
    listaTemp.forEach(element => {
      if(this.estado != 0) {
        element.reservas = element.reservas.filter(reserva => parseInt(reserva.estado) == this.estado );
      }
    });
    this.listaPedidosTemp = JSON.parse(JSON.stringify(listaTemp));
  }

  copyTextToClipboard(text) {

    const txtArea = document.createElement("textarea");
    txtArea.id = 'txt';
    txtArea.style.position = 'fixed';
    txtArea.style.top = '0';
    txtArea.style.left = '0';
    txtArea.style.opacity = '0';
    txtArea.value = text;
    document.body.appendChild(txtArea);
    txtArea.select();
    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      if (successful) {
        this.snack.open(`Código copiado!  ${text} `, 'OK', { duration: 4000 })
        return true;
      }
    } catch (err) {
    } finally {
      document.body.removeChild(txtArea);
    }
    return false;
  }
  openPopupDetalleCupo(id_reserva_real: number){
      this.reservasService.detalleCupoProveedor(id_reserva_real).subscribe( resp => {
        const dialogRef: MatDialogRef<any> = this.dialog.open(DetalleCuposComponent, {
          width: '90%',
          height: '90%',
          disableClose: true,
          data: { title: 'DETALLE DE CUPOS', payload: resp, isNew: 'monitor_comercial' }
        });
      });

  }
  exportarReservas() {
    if (!this.listaPedidosTemp.length) {
      return ;
    } else {
      this.fechaModificada = this.homeService.formatoFecha(this.now, "amd", "_");
      let cliente = this.filtrosForm.get('cliente').value.replace(/ /g,"_");
      let terminal = this.filtrosForm.get('terminal').value.replace(/ /g,"_");
      let archivo = `${this.fechaModificada}_${cliente}_${terminal}`;
      let infoExpo: ExportDatos[] = [];

      this.listaPedidosTemp.forEach(pedido => {
        //console.log(pedido);
        pedido['reservas'].forEach(reserva => {
          //console.log(reserva);
          reserva['productos'].forEach(prod => {
            let info: ExportDatos  = {
              cliente : pedido['cliente'],
              terminal:  pedido['terminal'],
              estado      : (reserva['estado'] != '0') ? 'PROCESADAS': 'RECIBIDAS',
              solicitante :  pedido['solicitante'],
              destino     :  pedido['destino'],
              reserva     : reserva.id_reserva,
              fecha       : reserva.fecha_pedido,

              cuit_chofer      : reserva.cuit,
              nombre_chofer    : reserva.chofer,
              patente_camion   : reserva.patente_camion,
              patente_acoplado : reserva.patente_acoplado,
              st_oc            : reserva.stoc,

              tipo_despacho    : prod['tipo_despacho'],
              producto         : prod['producto'],
              contrato         : prod['contrato'],
              composicion      : prod['composicion'],
              cantidad         : prod['cantidad'],

              observacion      : pedido['observaciones'],
            }
            infoExpo.push(info);
          });
        });
      });
     this.excelService.exportAsExcelFile(infoExpo, `${archivo}`);

    }

  }

  gotoHome() {
    this.dialogRef.close();
  }

}
