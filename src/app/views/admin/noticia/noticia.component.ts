import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { PromocionesService } from './../../../shared/services/promociones.service';
import { Noticia } from './../../../shared/models/promocion.model';
import { AddNoticiaComponent } from './add-noticia/add-noticia.component';
import { Page } from '../../../shared/models/page';
import { SubirImagenNoticiaComponent } from './subir-imagen-noticia/subir-imagen-noticia.component';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss']
})
export class NoticiaComponent implements OnInit {
  public documento: Noticia[];
  page = new Page();
  public getItemSub: Subscription;
  constructor(private documentoService: PromocionesService, public router: Router, private dialog: MatDialog,
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
      this.documentoService.getAllNoticias(this.page.pageNumber).subscribe(pagedData => {
        this.documento = pagedData.data;
        
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
        
      });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.documento.filter(function(d) {
      return d.titulo.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.documento = temp;
    if(val === ''){
      this.setPage({ offset: 0 });
    }
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Noticia' : 'Modificar Noticia';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddNoticiaComponent, {
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
          this.documentoService.postNoticia(res)
            .subscribe(data => {
              this.documento.unshift(data);
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Noticia agregada!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Noticia ya se encuentra ingresada' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        } else {
          this.documentoService.updateNoticia(res)
            .subscribe(data => {
              this.documento = data;
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Noticia modificada!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Noticia no se puede modificar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar esta Noticia?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.documentoService.deleteNoticia(row.id)
            .subscribe(data => {
              this.loader.close();
              this.documento = data;
              this.setPage({ offset: 0 });              
              this.snack.open('Noticia eliminada!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Noticia no se puede eliminar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }
  subir(data){
    let title = 'Subir la imagen de la Noticia';
    let dialogRef: MatDialogRef<any> = this.dialog.open(SubirImagenNoticiaComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.documentoService.updateNoticia(res)
            .subscribe(data => {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.documento = data;
              this.setPage({ offset: 0 });              
              this.snack.open('Noticia modificada!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Esta Noticia no se puede modificar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
      });
  }
}
