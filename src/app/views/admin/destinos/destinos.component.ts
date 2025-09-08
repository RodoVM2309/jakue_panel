import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar, MatRadioChange } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { DestinosService } from './../../../shared/services/destinos.service';
import { Destino } from './../../../shared/models/destino';
import { SituacionPuertoService } from './../../../shared/services/situacion-puerto.service';
import { SituacionPuerto } from './../../../shared/models/situacion-puerto';
import { AddDestinoComponent } from './add-destino/add-destino.component';
import { InfoPersonaComponent } from './../personas/info-persona/info-persona.component';
import { Page } from '../../../shared/models/page';
import { of } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-destinos',
  templateUrl: './destinos.component.html',
  styleUrls: ['./destinos.component.scss']
})
export class DestinosComponent implements OnInit {
  @ViewChild('destinoSearchInput') destinoSearchInput: ElementRef;
  public destinos: Destino[];
  page = new Page();
  public getItemSub: Subscription;
  public  filtro;
  situaciones: SituacionPuerto[];
  selectSituacion: string;
  selectedDestino: Destino;
  temp = [];


  constructor(private destinosService: DestinosService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService, private situacionService: SituacionPuertoService,
    private loader: AppLoaderService, private alertService: AppAlertService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.setPage({ offset: 0 });
    fromEvent(this.destinoSearchInput.nativeElement, 'keyup').pipe(

      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.filtro = text.toLowerCase();
      this.setPage({ offset: 0 });
    });

  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  setPage(pageInfo) {
    this.loader.open('Cargando Destinos');
    this.page.pageNumber = pageInfo.offset + 1;
      if(this.filtro == undefined){
        this.filtro = '';
      }
    this.destinosService.getAllDestinos(this.page.pageNumber, this.filtro).subscribe(pagedData => {
      this.destinos = this.temp = pagedData.data;
      console.log(this.destinos);
      for (let i = 0; i < this.destinos.length; i++) {
        this.destinos[i].desc_bloqueado = (this.destinos[i].bloqueado === 1) ? 'SI' : 'NO';
        this.destinos[i].desc_solucion_muvin = (this.destinos[i].solucion_muvin === 1) ? 'SI' : 'NO';
        this.destinos[i].desc_playa_intermedia = (this.destinos[i].id_playa_intermedia) ? this.destinos[i].nombre_playa_intermedia : '';
      };
      this.getItemSub = this.situacionService.getAllSituacionPuerto()
        .subscribe(data => {
          this.situaciones = data.data;
        });
      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;
      if (this.loader !== null) {
        this.loader.close();
      }
    },err => {
      this.loader.close();
      this.alertService.confirm({ message: 'Error al buscar los destinos ' });
    })
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filtro = event.target.value.toLowerCase();
    this.setPage({ offset: 0 });

  }

  stopProp(e) {
    e.stopPropagation()
  }
  selSituacion(row) {
    this.selectedDestino = row;
    this.selectSituacion = row.id_situacion_puerto;
  }

  onChange(mrChange: MatRadioChange) {
    this.selectedDestino.id_situacion_puerto = mrChange.value;
    this.loader.open();
    this.destinosService.updateDestino(this.selectedDestino)
      .subscribe(data => {
        this.setPage({ offset: 0 });
        if (this.loader !== null) {
          this.loader.close();
        }
        this.snack.open('Actualizado Destino!', 'OK', { duration: 4000 });
        return;
      },err => {
        this.loader.close();
        this.alertService.confirm({ message: 'Error: No se pudo actualizar ' });
      })


  }
  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Destino' : 'Modificar Destino';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddDestinoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        console.log(res);
        if (!res) {
          // If user press cancel
          return;
        }
        if (isNew) {
          this.loader.open();
          this.destinosService.postDestino(res)
            .subscribe(data => {
              this.destinos.unshift(data);
              if (this.loader !== null) {
                this.loader.close();
              }
              //this.setPage({ offset: 0 });
              this.snack.open('Destino Agregado!', 'OK', { duration: 4000 });
              this.setPage({ offset: 0 });
              return;
            },err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Error: No se pudo agregar el destino ' });
            })

        } else {
          this.loader.open();
          this.destinosService.updateDestino(res)
            .subscribe(resp => {
              let destinoUpdate= resp.data;
              this.destinos = this.destinos.filter((value, key) => {
                if (value.id === destinoUpdate.id) {
                  value.descripcion = destinoUpdate.descripcion;
                  value.id_localidad = destinoUpdate.id_localidad;
                  value.direccion = destinoUpdate.direccion;
                  value.telefono = destinoUpdate.telefono;
                  value.email = destinoUpdate.email;
                  value.longitud = destinoUpdate.longitud;
                  value.latitud = destinoUpdate.latitud;
                  value.id_zona_destino = destinoUpdate.id_zona_destino;
                  value.domicilio = destinoUpdate.domicilio;
                  value.id_tipo_destino = destinoUpdate.id_tipo_destino;
                  value.desc_solucion_muvin = (destinoUpdate.solucion_muvin === 1) ? 'SI' : 'NO';
                  value.id_playa_intermedia = destinoUpdate.id_playa_intermedia;
                }
                return true;
              });
              //this.destinos = data;
              if (this.loader !== null) {
                this.loader.close();
              }
             // this.setPage({ offset: 0 });
              this.snack.open('Destino Modificado!', 'OK', { duration: 4000 });
              this.setPage({ offset: 0 });
              return;
            }, err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Error: No se pudo actualizar ' });
            })
        }
      });
  }
  deleteItem(row) {
    this.confirmService.confirm({ message: 'Está seguro de eliminar el destino: ' + row.descripcion + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.destinosService.deleteDestino(row.id)
            .subscribe(data => {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.destinos = this.destinos.filter((value, key) => {
                return value.id !== row.id;
              });
              //this.destinos = data;
              //this.setPage({ offset: 0 });
              this.snack.open('Destino eliminado!', 'OK', { duration: 4000 });
              return;
            }, err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Error: No se pudo eliminar ' });
            })
        }
      });
  }

  openPopUpInfoPersona(data: any = {}) {
    let title = 'Información del perfil - Destino';
    let dialogRef: MatDialogRef<any> = this.dialog.open(InfoPersonaComponent, {
      width: '720px',
      height: '73vh',
      disableClose: true,
      data: { title: title, payload: { id: data.id_usuario } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }



}
