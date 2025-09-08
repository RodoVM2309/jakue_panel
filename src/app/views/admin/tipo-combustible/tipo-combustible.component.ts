import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { Page } from '../../../shared/models/page';
import { NomencladoresService } from './../../../shared/services/nomencladores.service';
import { TipoCombustible } from './../../../shared/models/tipo-combustible';
import { AddTipoCombustibleComponent } from './add-tipo-combustible/add-tipo-combustible.component';

@Component({
  selector: 'app-tipo-combustible',
  templateUrl: './tipo-combustible.component.html',
  styleUrls: ['./tipo-combustible.component.scss']
})
export class TipoCombustibleComponent implements OnInit, OnDestroy {
  public tipoCombustible: TipoCombustible[];
  page = new Page();
  public getItemSub: Subscription;

  constructor(private nomencladoresService: NomencladoresService, 
    public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private loader: AppLoaderService, private alertService: AppAlertService) { 
      this.page.pageNumber = 0;
      this.page.size = 10;
    }

  ngOnInit() {
    this.setPage({ offset: 0 });
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
  setPage(pageInfo){
    this.page.pageNumber = pageInfo.offset + 1;
    this.nomencladoresService.getAllTipoCombustible(this.page.pageNumber).subscribe(pagedData => {
      this.tipoCombustible = pagedData.data;      
      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;
      
    });
}
updateFilter(event) {
  const val = event.target.value.toLowerCase();
  const temp = this.tipoCombustible.filter( (item) => {
    return item.nombre.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.tipoCombustible = temp;
  if (val === '') {
    this.setPage({ offset: 0 });
  }
}

openPopUp(data: any = {}, isNew?) {
  let title = isNew ? 'Agregar Combustible' : 'Modificar Combustible';
  let dialogRef: MatDialogRef<any> = this.dialog.open(AddTipoCombustibleComponent, {
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
        this.nomencladoresService.postTipoCombustible(res)
          .subscribe(data => {
            this.tipoCombustible.unshift(data);
            this.setPage({ offset: 0 });
            if (this.loader !== null) {
              this.loader.close();
            }
            this.snack.open('Combustible agregado!', 'OK', { duration: 4000 });
            return;
          },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este combustible ya se encuentra ingresado' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
      } else {
        this.nomencladoresService.updateTipoCombustible(res)
          .subscribe(data => {
            for (let index = 0; index < this.tipoCombustible.length; index++) {
              const element = this.tipoCombustible[index];
              if (element.id == data.id)
              this.tipoCombustible[index]= data              
            }            
            this.setPage({ offset: 0 });
            if (this.loader !== null) {
              this.loader.close();
            }
            this.snack.open('Combsutible actualizado correctamente!', 'OK', { duration: 4000 });
            return;
          },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Combustible no se puede modificar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
      }
    });
}

deleteItem(row) {
  this.confirmService.confirm({ message: '¿Está seguro de eliminar el Combustible: '+row.nombre+' ?' })
    .subscribe(res => {
      if (res) {
        this.loader.open();
        this.nomencladoresService.deleteTipoCombustible(row.id)
          .subscribe(data => { 
            this.loader.close();          
            this.setPage({ offset: 0 });            
            this.snack.open('Combustible eliminado!', 'OK', { duration: 4000 });
            return;
          },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Combustible no se puede eliminar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
      }
    });
}

}
