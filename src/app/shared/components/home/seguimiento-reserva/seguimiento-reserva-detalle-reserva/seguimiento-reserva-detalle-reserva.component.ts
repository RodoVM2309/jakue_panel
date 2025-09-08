import { Component, OnInit, Inject, OnDestroy, ViewChildren, QueryList, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '@angular/material';
import { AsignacionDirecta, DetalleReserva, Reserva } from '@app/shared/models/fertilizantes.model';
import { FertilizantesService } from '@app/shared/services';
import { HomeService } from 'app/shared/components/home/home.service';
import { ExelService } from 'app/shared/services/exel.service';
import { ListaChoferComponent } from '../../add-pedido-fertilizantes/lista-chofer/lista-chofer.component';


@Component({
  selector: 'app-seguimiento-reserva-detalle-reserva',
  templateUrl: './seguimiento-reserva-detalle-reserva.component.html',
  styleUrls: ['./seguimiento-reserva-detalle-reserva.component.scss']
})

export class SeguimientoReservaDetalleReservaComponent implements OnInit {
  @ViewChild("id_chofer") id_chofer: ElementRef;
  //@ViewChild("nombre_chofer") nombre_chofer: ElementRef;
  nombre_chofer: string;
  @ViewChild("patente") patente: ElementRef;

  listaDetalleCargas: DetalleReserva[] = [];
  reserva: Reserva;
  destino: string;
  solicitante: string;
  observaciones: string;
  filtrosForm: FormGroup;
  estados = [
    {
      id: 0,
      descripcion: 'Todos'
    },
    {
      id: 1,
      descripcion: 'Procesados'
    }
  ];
  estado: number = 0;
  fechaModificada: string = "";
  now = new Date();
  nombreBtnChofer = 'ASIGNAR CHOFER';
  dataChofer;
  habilitarButtonCambiarChofer = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private fertilizantesService: FertilizantesService,
    public dialogRef: MatDialogRef<SeguimientoReservaDetalleReservaComponent>,
    private snack: MatSnackBar,
    private homeService: HomeService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.estado = this.data['estado'];
    this.buildItemForm(this.data.payload);
    this.filtrosForm.get('id_estado').valueChanges.subscribe(estado => {
      this.estado = estado;
    });
    if (this.data.tieneChofer) this.nombreBtnChofer = 'CAMBIAR CHOFER';
    this.habilitarButtonCambiarChofer = this.data.viajeConfirmado;
  }

  buildItemForm(pedidos: DetalleReserva[]) {
    this.listaDetalleCargas = pedidos;
    //this.listaPedidosTemp = pedidos;
    this.filtrosForm = this.fb.group({
      cliente: [pedidos[0].cliente || ''],
      terminal: [pedidos[0].terminal || ''],
      id_estado: [this.estado]
    });
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

  gotoHome() {
    this.dialogRef.close(this.dataChofer);
  }

  openPopListadoChofer(detalleReserva: any) {
    let index = -1;
    this.listaDetalleCargas.forEach((element: DetalleReserva) => {
      index = element.reservas.findIndex(reserva => reserva === detalleReserva);
      if (index != -1) {
        this.reserva = element.reservas[index];
      }
    })

    //let index = this.listaDetalleCargas.findIndex(x => x.reservas === detalleReserva);
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
        this.nombreBtnChofer = 'CAMBIAR CHOFER';
        detalleReserva.id_chofer = res['id'];
        detalleReserva.chofer = res['nombre_persona'];
        detalleReserva.patente_camion = (res['patente']) ? res['patente'].toUpperCase() : 'XXXXXX';
        detalleReserva.patente_acoplado = (res['patente_acoplado']) ? res['patente_acoplado'].toUpperCase() : 'XXXXXX';
        this.updateChofer(detalleReserva);
      });
  }

  updateChofer(detalleReserva: Reserva) {
    let data = {
      id_chofer: detalleReserva.id_chofer,
      id_reserva: this.reserva['id_reserva_real']
    }
    this.fertilizantesService.updateChoferReservaSeguimiento(data).subscribe(res => {
      if (!res) {
        return;
      }
      this.dataChofer = {
        id_reserva: this.reserva['id_reserva_real'],
        nombre_chofer: detalleReserva.chofer
      }
    });
  }
}
