import { Component, OnInit, ViewChild, Inject, OnDestroy, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Observable, of, Subscription } from 'rxjs';
import { Validators, FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { AsignacionDirecta, DetalleReserva, Reserva } from '@app/shared/models/fertilizantes.model';
import { ReservasService } from 'app/shared/services/reservas.service';
import { ListaChoferComponent } from '../add-pedido-fertilizantes/lista-chofer/lista-chofer.component';
import { FertilizantesService } from 'app/shared/services/fertilizantes.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { DetalleCuposComponent } from 'app/views/fertilizante/panel-reservas/detalle-cupos/detalle-cupos.component';



@Component({
  selector: 'app-asignar-directo',
  templateUrl: './asignar-directo.component.html',
  styleUrls: ['./asignar-directo.component.scss']
})
export class AsignarDirectoComponent implements OnInit {
  reservaslista: Reserva[] = [];
  destino: string;
  cliente: string;
  terminal: string;
  solicitante: string;
  observaciones: string;
  nombreBtnChofer = new Array();
  addPedidoForm: FormGroup;
  asignacionDirecta: AsignacionDirecta[] = [];
  asignaCamion = 0;
  habilitarButtonCambiarChofer = true;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AsignarDirectoComponent>,
    private reservasService: ReservasService,
    private alertService: AppAlertService,
    private loader: AppLoaderService,
    private fertilizantesService: FertilizantesService,) { }


  ngOnInit() {
    this.asignaCamion = this.data.asignaCamion;
    this.getDatosReserva(this.data.payload);
  }

  getDatosReserva(item: DetalleReserva) {
    this.cliente = item[0].cliente;
    this.destino = item[0].destino;
    this.solicitante = item[0].solicitante;
    this.terminal = item[0].terminal;
    this.observaciones = item[0].observaciones;
    if (item) {
      this.reservaslista = item[0].reservas;
    }
    this.habilitarButtonCambiarChofer = this.data.viajeConfirmado;
  }
  openPopListadoChofer(reserva: any) {
    let index = this.reservaslista.findIndex(x => x === reserva);
    let title = 'ASIGNAR CHOFER';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ListaChoferComponent, {
      width: '90%',
      height: '90%',
      disableClose: true,
      data: { title: title, payload: { index: index }, isNew: true }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        reserva.id_chofer = res['id'];
        reserva.chofer = res['nombre_persona'];
        reserva.patente_camion = (res['patente']) ? res['patente'].toUpperCase() : 'XXXXXX';
        reserva.patente_acoplado = (res['patente_acoplado']) ? res['patente_acoplado'].toUpperCase() : 'XXXXXX';
        let index = this.asignacionDirecta.findIndex(asignacion => asignacion.id_reserva === reserva['id_reserva_real']);
        if (index != -1) {
          this.asignacionDirecta.splice(index, 1, {
            id_chofer: res['id'],
            id_reserva: reserva['id_reserva_real'],
          });
        } else {
          this.asignacionDirecta.push({
            id_chofer: res['id'],
            id_reserva: reserva['id_reserva_real'],
          });
        }
        //console.log("Obteniendo info",this.asignacionDirecta);
      });

  }
  openPopupDetalleCupo(id_reserva_real: number) {
    this.reservasService.detalleCupoCliente(id_reserva_real).subscribe(resp => {
      const dialogRef: MatDialogRef<any> = this.dialog.open(DetalleCuposComponent, {
        width: '90%',
        height: '90%',
        disableClose: true,
        data: { title: 'DETALLE DE CUPOS', payload: resp, isNew: 'asignacion_directa' }
      });
    });

  }


  submit() {
    // console.log(this.asignacionDirecta);
    this.loader.open();
    this.fertilizantesService.updateChoferReserva(this.asignacionDirecta).subscribe(resp => {
      this.loader.close();
      this.alertService
        .confirm({
          message: "¡Choferes actualizados correctamente!",
          tipo: "exito"
        });
      //console.log(resp);
      this.dialogRef.close();
    });

  }


  gotoHome() {
    this.dialogRef.close();
  }



}
