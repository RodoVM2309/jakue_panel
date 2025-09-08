import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MapaOficinaService } from './../../../shared/services/mapa-oficina.service';
import { MapaOficina } from './../../../shared/models/mapa-oficina';
import { AddMapaRadaresComponent } from './add-mapa-radares/add-mapa-radares.component';
import { Page } from '../../../shared/models/page';
import { PagedData } from '../../../shared/models/paged-data';

@Component({
  selector: 'app-mapa-radares',
  templateUrl: './mapa-radares.component.html',
  styleUrls: ['./mapa-radares.component.scss']
})
export class MapaRadaresComponent implements OnInit {
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
      this.mapa_oficinaService.getAllMapaRadares(this.page.pageNumber).subscribe(pagedData => {
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
    let title = isNew ? 'Agregar Radar' : 'Modificar Radar';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddMapaRadaresComponent, {
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
          this.mapa_oficinaService.postMapaRadares(res)
            .subscribe(data => {
              this.mapa_oficina.unshift(data);
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Radar agregado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Radar ya se encuentra ingresado' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        } else {
          this.mapa_oficinaService.updateMapaRadares(res)
            .subscribe(data => {
              this.mapa_oficina = data;
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Radar modificado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Radar no se puede modificar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar este Radar?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.mapa_oficinaService.deleteMapaRadares(row.id)
            .subscribe(data => {
              this.mapa_oficina = data;
              this.setPage({ offset: 0 });
              this.loader.close();
              this.snack.open('Radar eliminado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Radar no se puede eliminar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }
}
