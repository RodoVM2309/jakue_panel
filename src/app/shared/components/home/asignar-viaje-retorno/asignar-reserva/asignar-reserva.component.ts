import { Component, OnInit, ViewChild, Inject, OnDestroy, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { AsignacionDirecta, DetalleReserva, Reserva } from '@app/shared/models/fertilizantes.model';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-asignar-reserva',
  templateUrl: './asignar-reserva.component.html',
  styleUrls: ['./asignar-reserva.component.scss']
})
export class AsignarReservaComponent implements OnInit {
  reservaslista : Reserva[] = [] ;
  destino: string;
  cliente: string;
  solicitante: string;
  observaciones: string;
  nombreBtnChofer = new Array();
  filtro          = new Array();
  asingacionReserva:  AsignacionDirecta[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    public dialogRef: MatDialogRef<AsignarReservaComponent>,) { }

  ngOnInit() {
    this.filtro = this.data.filtroReserva;
    this.getDatosReserva(this.data.payload);
   }

   getDatosReserva(item:DetalleReserva) {
    this.cliente          = item.cliente;
    this.destino          = item.destino;
    this.solicitante      = item.solicitante;
    this.observaciones    = item.observaciones;
    if(item){
      if (this.filtro.length > 0) {
        this.reservaslista = item.reservas.filter(filtro => {
          let index = this.filtro.findIndex(reserva => reserva['id_reserva_real'] === filtro['id_reserva_real']);
          if (index == -1) {
            return filtro;
          }
        });
      }else {
        this.reservaslista = item.reservas;
      }
    }
   }

   asignarReserva(reserva: any){
      this.dialogRef.close(reserva);
   }

   gotoHome() {
    this.dialogRef.close();
  }


}
