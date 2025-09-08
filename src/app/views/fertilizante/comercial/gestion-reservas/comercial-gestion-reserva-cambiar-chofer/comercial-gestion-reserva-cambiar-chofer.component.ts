import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '@angular/material';
import { ListaChoferComponent } from '@app/shared/components/home/add-pedido-fertilizantes/lista-chofer/lista-chofer.component';
import { ChoferZona } from '@app/shared/models';
import { AsignacionDirecta } from '@app/shared/models/fertilizantes.model';
import { FertilizantesService } from '@app/shared/services';
import { HomeService } from 'app/shared/components/home/home.service';

@Component({
  selector: 'app-comercial-gestion-reserva-cambiar-chofer',
  templateUrl: './comercial-gestion-reserva-cambiar-chofer.component.html',
  styleUrls: ['./comercial-gestion-reserva-cambiar-chofer.component.scss']
})

export class ComercialGestionReservaCambiarChoferComponent implements OnInit {
  dataChofer;
  chofer: ChoferZona;
  habilitarButtonCambiarChofer = true;
  asignacionChofer: AsignacionDirecta[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private fertilizantesService: FertilizantesService,
    public dialogRef: MatDialogRef<ComercialGestionReservaCambiarChoferComponent>,
    private snack: MatSnackBar,
    private homeService: HomeService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.chofer = this.data.dataPayload['datos_chofer'];
    this.habilitarButtonCambiarChofer = this.data.dataPayload['viaje_confirmado'];
  }

  gotoHome() {
    this.dialogRef.close(this.dataChofer);
  }

  openPopListadoChofer() {
    let title = 'CAMBIAR CHOFER';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ListaChoferComponent, {
      width: '90%',
      height: '90%',
      disableClose: true,
      data: { title: title, payload: { index: this.data.dataPayload['index'] }, isNew: true }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.chofer = new ChoferZona();
        this.chofer.id = res['id'];
        this.chofer.cuit_persona = res['cuit'];
        this.chofer.nombre_persona = res['nombre_persona'];
        this.chofer.patente = (res['patente']) ? res['patente'].toUpperCase() : 'XXXXXX';
        this.chofer.patente_acoplado = (res['patente_acoplado']) ? res['patente_acoplado'].toUpperCase() : 'XXXXXX';
        this.chofer['telefono'] = res['telefono'];
        this.updateChofer();
      });
  }

  updateChofer() {
    let index = this.asignacionChofer.findIndex(asignacion => asignacion.id_reserva === this.data.dataPayload['id_reserva']);
    if (index != -1) {
      this.asignacionChofer.splice(index, 1, {
        id_chofer: this.chofer.id,
        id_reserva: this.data.dataPayload['id_reserva'],
      });
    } else {
      this.asignacionChofer.push({
        id_chofer: this.chofer.id,
        id_reserva: parseInt(this.data.dataPayload['id_reserva']),
      });
    }
    this.fertilizantesService.updateChoferReserva(this.asignacionChofer).subscribe(res => {
      if (!res) {
        return;
      }
      this.dataChofer = {
        id_reserva: this.data.dataPayload['id_reserva'],
        nombre_chofer: this.chofer.nombre_persona
      }
    });
  }
}
