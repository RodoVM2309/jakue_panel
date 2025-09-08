import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MapaOficinaService } from './../../../shared/services/mapa-oficina.service';
import { MapaOficina } from './../../../shared/models/mapa-oficina';
import { AddMapaRutaComponent } from './add-mapa-ruta/add-mapa-ruta.component';
import { Page } from '../../../shared/models/page';

@Component({
  selector: 'app-mapa-ruta',
  templateUrl: './mapa-ruta.component.html',
  styleUrls: ['./mapa-ruta.component.scss']
})
export class MapaRutaComponent implements OnInit {
  public mapa_oficina: MapaOficina[];
  page = new Page();
  public getItemSub: Subscription;
  constructor(private mapa_oficinaService: MapaOficinaService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private loader: AppLoaderService, private alertService:AppAlertService) {
      this.page.pageNumber = 0;
      this.page.size = 10;
     }

  ngOnInit() {
      //this.getItems();
      this.setPage({ offset: 0 });
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

    setPage(pageInfo){
      this.page.pageNumber = pageInfo.offset + 1;
      this.mapa_oficinaService.getAllMapaRuta(this.page.pageNumber).subscribe(pagedData => {
        this.mapa_oficina = pagedData.data;
        
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
        
      });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.mapa_oficina.filter(function(d) {
      return d.descripcion.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.mapa_oficina = temp;
    if(val === ''){
      this.setPage({ offset: 0 });
    }
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Oficina' : 'Modificar Oficina';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddMapaRutaComponent, {
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
        this.loader.open();
        if (isNew) {
          this.mapa_oficinaService.postMapaRuta(res)
            .subscribe(data => {
              this.mapa_oficina.unshift(data);
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Oficina agregada!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Oficina ya se encuentra ingresada' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        } else {
          this.mapa_oficinaService.updateMapaRuta(res)
            .subscribe(data => {
              this.mapa_oficina = data;
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Oficina modificada!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Oficina no se puede modificar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar esta Oficina?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.mapa_oficinaService.deleteMapaRuta(row.id)
            .subscribe(data => {
              this.mapa_oficina = data;
              this.setPage({ offset: 0 });
              this.loader.close();
              this.snack.open('Oficina eliminada!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Oficina no se puede eliminar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }
}
