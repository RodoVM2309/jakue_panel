import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar, MatRadioChange } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { PlayasIntermediasService } from './../../../shared/services/playas-intermedias.service';
import { PlayaIntermedia } from './../../../shared/models/playa-intermedia';
import { SituacionPuertoService } from './../../../shared/services/situacion-puerto.service';
import { SituacionPuerto } from './../../../shared/models/situacion-puerto';
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
import { AddPlayaIntermediaComponent } from './add-playa-intermedia/add-playa-intermedia.component';

@Component({
  selector: 'app-playas-intermedias',
  templateUrl: './playas-intermedias.component.html',
  styleUrls: ['./playas-intermedias.component.scss']
})
export class PlayasIntermediasComponent implements OnInit {
  @ViewChild('playaIntermediaSearchInput') playaIntermediaSearchInput: ElementRef;
  public playas_intermedias: PlayaIntermedia[];
  page = new Page();
  public getItemSub: Subscription;
  public  filtro;
  situaciones: SituacionPuerto[];
  selectSituacion: string;
  selectedPlayaIntermedia: PlayaIntermedia;
  temp = [];

  constructor(private playasIntermediasService: PlayasIntermediasService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService, private situacionService: SituacionPuertoService,
    private loader: AppLoaderService, private alertService: AppAlertService) {
      this.page.pageNumber = 0;
      this.page.size = 10;
     }

  ngOnInit() {
    this.setPage({ offset: 0 });
    fromEvent(this.playaIntermediaSearchInput.nativeElement, 'keyup').pipe(

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
    this.loader.open('Cargando Playas Intermedias');
    this.page.pageNumber = pageInfo.offset + 1;
      if(this.filtro == undefined){
        this.filtro = '';
      }
    this.playasIntermediasService.getAllPlayasIntermedias(this.page.pageNumber, this.filtro).subscribe(pagedData => {
      this.playas_intermedias = this.temp = pagedData.data;
      for (let i = 0; i < this.playas_intermedias.length; i++) {
        this.playas_intermedias[i].desc_bloqueado = (this.playas_intermedias[i].bloqueado === 1) ? 'SI' : 'NO';
        this.playas_intermedias[i].desc_solucion_muvin = (this.playas_intermedias[i].solucion_muvin === 1) ? 'SI' : 'NO';
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
      this.alertService.confirm({ message: 'Error al buscar las playas intermedias ' });
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
    this.selectedPlayaIntermedia = row;
    this.selectSituacion = row.id_situacion_puerto;
  }

  onChange(mrChange: MatRadioChange) {
    this.selectedPlayaIntermedia.id_situacion_puerto = mrChange.value;
    this.loader.open();
    this.playasIntermediasService.updatePlayaIntermedia(this.selectedPlayaIntermedia)
      .subscribe(data => {
        this.setPage({ offset: 0 });
        if (this.loader !== null) {
          this.loader.close();
        }
        this.snack.open('Actualizada la Playa Intermedia!', 'OK', { duration: 4000 });
        return;
      },err => {
        this.loader.close();
        this.alertService.confirm({ message: 'Error: No se pudo actualizar ' });
      })
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Playa Intermedia' : 'Modificar Playa Intermedia';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPlayaIntermediaComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        if (isNew) {
          this.loader.open();
          this.playasIntermediasService.postPlayaIntermedia(res)
            .subscribe(data => {
              this.playas_intermedias.unshift(data);
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Playa Intermedia Agregada!', 'OK', { duration: 4000 });
              this.setPage({ offset: 0 });
              return;
            },err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Error: No se pudo agregar la playa intermedia' });
            })

        } else {
          this.loader.open();
          this.playasIntermediasService.updatePlayaIntermedia(res)
            .subscribe(resp => {
              let playa_intermediaUpdate= resp.data;
              this.playas_intermedias = this.playas_intermedias.filter((value, key) => {
                if (value.id === playa_intermediaUpdate.id) {
                  value.descripcion = playa_intermediaUpdate.descripcion;
                  value.id_localidad = playa_intermediaUpdate.id_localidad;
                  value.direccion = playa_intermediaUpdate.direccion;
                  value.telefono = playa_intermediaUpdate.telefono;
                  value.email = playa_intermediaUpdate.email;
                  value.longitud = playa_intermediaUpdate.longitud;
                  value.latitud = playa_intermediaUpdate.latitud;
                  value.id_zona_destino = playa_intermediaUpdate.id_zona_destino;
                  value.domicilio = playa_intermediaUpdate.domicilio;
                  value.desc_solucion_muvin = (playa_intermediaUpdate.solucion_muvin === 1) ? 'SI' : 'NO';
                }
                return true;
              });
              //this.destinos = data;
              if (this.loader !== null) {
                this.loader.close();
              }
             // this.setPage({ offset: 0 });
              this.snack.open('Playa Intermedia modificada!', 'OK', { duration: 4000 });
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
    this.confirmService.confirm({ message: 'Está seguro de eliminar la playa intermedia: ' + row.descripcion + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.playasIntermediasService.deletePlayaIntermedia(row.id)
            .subscribe(data => {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.playas_intermedias = this.playas_intermedias.filter((value, key) => {
                return value.id !== row.id;
              });
              //this.destinos = data;
              //this.setPage({ offset: 0 });
              this.snack.open('Playa Intermedia Eliminada!', 'OK', { duration: 4000 });
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
