import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { egretAnimations } from "../../../animations/egret-animations";
import { MatProgressBar, MatButton,  MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import {  FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AddEstadoDescargaComponent } from './add-estado-descarga/add-estado-descarga.component';
import {
  AppConfirmService,
  AppLoaderService,
  AppAlertService,
  NomencladoresService,
 } from '@muvin/services';
import { EstadoDescarga,Viaje,ViajeEstadoDescarga } from '@muvin/models';



@Component({
  selector: 'app-estado-descarga',
  templateUrl: './estado-descarga.component.html',
  styleUrls: ['./estado-descarga.component.scss'],
  animations: egretAnimations
})
export class EstadoDescargaComponent implements OnInit, OnDestroy {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  addViajeForm: FormGroup;
  public getItemSub: Subscription;
  public viajes: Viaje[];
  public estadosDescarga: EstadoDescarga[];
  public viajesEstadosDescarga: ViajeEstadoDescarga[];

  fechaViaje: string;
  cupo: string;
  carta_porte: string;
  nombre_chofer: string;
  nombre_tipo_camion: string;
  nombre_entregador: string;
  nombre_corredor: string;
  nombre_estado_viaje: string;
  nombre_destino: string;
  nombre_dador: string;
  estado: string;
  id_viaje = this.route.snapshot.params['id'];
  nombre_destinatario: string;


  constructor(private router: Router, private route: ActivatedRoute, private nomecladoresServices: NomencladoresService,
    private snack: MatSnackBar, private confirmService: AppConfirmService, private dialog: MatDialog,
    private loader: AppLoaderService, private alertService: AppAlertService) { }

  ngOnInit() {
    this.getItemViaje();
    this.getEstadosDescarga();
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }
  }
  getItemViaje() {
    this.getItemSub = this.nomecladoresServices.getViaje(this.route.snapshot.params['id'])
      .subscribe(data => {
        this.fechaViaje = data.data.fecha;
        this.cupo = data.data.cupo;
        this.carta_porte = data.data.carta_porte;
        this.nombre_chofer = data.data.nombre_chofer;
        this.nombre_tipo_camion = data.data.nombre_tipo_camion;
        this.nombre_entregador = data.data.nombre_entregador;
        this.nombre_corredor = data.data.nombre_corredor;
        this.nombre_estado_viaje = data.data.nombre_estado_viaje;
        this.nombre_destino = data.data.nombre_destino;
        this.nombre_dador = data.data.nombre_dador;
        this.estado = data.data.estado;
        this.nombre_destinatario = data.data.nombre_destinatario;
      })
  }

  getEstadosDescarga() {
    this.getItemSub = this.nomecladoresServices.getAllEstadosDescargaViaje(this.route.snapshot.params['id'])
      .subscribe(data => {
        this.viajesEstadosDescarga = data.data;
      })
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Adicionar Estado de Descarga del Viaje' : 'Actualizar Estado de Descarga del Viaje';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddEstadoDescargaComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew, id_viaje: this.id_viaje }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {
          const datos = {
            id_viaje: res.id_viaje,
            id_estado: res.id_estado_descarga,
            fecha: res.fecha,
            descripcion: res.descripcion
          }
          this.nomecladoresServices.postEstadoDescargaViaje(datos)
            .subscribe(data => {
              if (data.success) {
                this.getEstadosDescarga();
                this.loader.close();
                this.snack.open('Estado de Descarga Adicionado!', 'OK', { duration: 4000 })
                const datos1 = {
                  id : res.id_viaje,
                  id_estado_viaje: 5
                }
                this.nomecladoresServices.postConfirmViaje(datos1)
                  .subscribe(data => {
                    //this.roles.unshift(data);
                    this.loader.close();

                    return
                  }, err => {
                    this.loader.close();
                    this.alertService.confirm({ message: 'Error! ' + err });
                  })
                return;
              } else {
                this.loader.close();

                this.alertService.confirm({ message: 'Error!:' + data.data });
              }
            }, err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Error!:' + err });
              return
            })
        } else {
          const datos = {
            id_viaje: res.id_viaje,
            id_estado: res.id_estado_descarga,
            fecha: res.fecha,
            descripcion: res.descripcion
          }
          this.nomecladoresServices.putEstadoDescargaViaje(datos)
            .subscribe(data => {
              this.getEstadosDescarga();
              this.loader.close();
              this.snack.open('Estado de Descarga Actualizado!', 'OK', { duration: 4000 });
              return
            }, err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Error!:' + err });
              return
            })
        }
      })
  }
  deleteItem(row) {
    this.confirmService.confirm({ message: `Ud. está seguro de eliminar el Estado de la Descarga: ${row.descripcion}?` })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.nomecladoresServices.deleteEstadoDescargaViaje(row.id_viaje, row.id_estado_descarga)
            .subscribe(data => {
              this.getEstadosDescarga();
              this.loader.close();
              this.snack.open('Estado de Descarga eliminada!', 'OK', { duration: 4000 })
              return
            })
        }
      })
  }
  gotoHome() {
    this.router.navigateByUrl('/panel-pedido/pedido');
  }
}
