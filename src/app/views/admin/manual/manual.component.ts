import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { ManualService } from './../../../shared/services/manual.service';
import { Documento } from './../../../shared/models/documento';
import { AddManualComponent } from './add-manual/add-manual.component';
import { Page } from '../../../shared/models/page';
import { SubirManualComponent } from './subir-manual/subir-manual.component';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss']
})
export class ManualComponent implements OnInit {
  public documento: Documento[];
  page = new Page();
  public getItemSub: Subscription;
  constructor(private manualService: ManualService, public router: Router, private dialog: MatDialog,
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
      this.manualService.getAllManual(this.page.pageNumber).subscribe(pagedData => {
        this.documento = pagedData.data;
        for (let i = 0; i < this.documento.length; i++) {
          this.documento[i].pdf = (this.documento[i].pdf.toString() === '0') ? 'NO' : 'SI';
        }
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
        
      });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.documento.filter(function(d) {
      return d.descripcion.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.documento = temp;
    if(val === ''){
      this.setPage({ offset: 0 });
    }
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Manual' : 'Modificar Manual';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddManualComponent, {
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
          this.manualService.postManual(res)
            .subscribe(data => {
              this.documento.unshift(data);
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Manual agregado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Manual ya se encuentra ingresado' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        } else {
          this.manualService.updateManual(res)
            .subscribe(data => {
              this.documento = data;
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Manual modificado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Manual no se puede modificar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar este Manual?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.manualService.deleteManual(row.id)
            .subscribe(data => {
              this.loader.close();
              this.documento = data;
              this.setPage({ offset: 0 });              
              this.snack.open('Manual eliminado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Manual no se puede eliminar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }
  subir(data){
    let title = 'Subir PDF del Manual';
    let dialogRef: MatDialogRef<any> = this.dialog.open(SubirManualComponent, {
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
        this.manualService.updateManual(res)
            .subscribe(data => {
              this.documento = data;
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Manual modificado!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Este Manual no se puede modificar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
      });
  }
}
