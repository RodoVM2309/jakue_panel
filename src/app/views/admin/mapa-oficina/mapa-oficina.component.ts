import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MapaOficinaService } from './../../../shared/services/mapa-oficina.service';
import { MapaOficina } from './../../../shared/models/mapa-oficina';
import { AddMapaOficinaComponent } from './add-mapa-oficina/add-mapa-oficina.component';
import { Page } from '../../../shared/models/page';
import { PagedData } from '../../../shared/models/paged-data';

@Component({
  selector: 'app-mapa-oficina',
  templateUrl: './mapa-oficina.component.html',
  styleUrls: ['./mapa-oficina.component.scss']
})
export class MapaOficinaComponent implements OnInit {
  public zona_destino: MapaOficina[];
  page = new Page();
  public getItemSub: Subscription;
  constructor(private zona_destinoService: MapaOficinaService, public router: Router, private dialog: MatDialog,
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
      this.zona_destinoService.getAllMapaOficina(this.page.pageNumber).subscribe(pagedData => {
        this.zona_destino = pagedData.data;
        
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
        
      });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.zona_destino.filter(function(d) {
      return d.descripcion.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.zona_destino = temp;
    if(val === ''){
      this.setPage({ offset: 0 });
    }
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Oficina' : 'Modificar Oficina';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddMapaOficinaComponent, {
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
          this.zona_destinoService.postMapaOficina(res)
            .subscribe(data => {
              this.zona_destino.unshift(data);
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
          this.zona_destinoService.updateMapaOficina(res)
            .subscribe(data => {
              this.zona_destino = data;
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
          this.zona_destinoService.deleteMapaOficina(row.id)
            .subscribe(data => {
              this.zona_destino = data;
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
