import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { Page } from '../../../shared/models/page';
import { PromocionesService } from './../../../shared/services/promociones.service';
import { Promocion } from './../../../shared/models/promocion.model';
import { AddPromocionesComponent } from './add-promociones/add-promociones.component';
import { SubirImagenesComponent } from './subir-imagenes/subir-imagenes.component';
import { GanadoresPromocionesComponent } from './ganadores-promociones/ganadores-promociones.component';


@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.scss']
})
export class PromocionesComponent implements OnInit {
  public promociones: Promocion[];
  page = new Page();
  public getItemSub: Subscription;
  ganadores: number;
  constructor(private promocionesService: PromocionesService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private loader: AppLoaderService, private alertService: AppAlertService) {
      this.page.pageNumber = 0;
      this.page.size = 10;
     }

  ngOnInit() {
       //this.getItems();
      this.setPage({ offset: 0 });
  }
  getGanadores(id) {
    this.promocionesService.getAllGanadoresPromociones(id)
      .subscribe(data => {
        this.ganadores = data.data.length;
      });
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
   setPage(pageInfo){
      this.page.pageNumber = pageInfo.offset + 1;
      this.promocionesService.getAllPromociones(this.page.pageNumber).subscribe(pagedData => {
        this.promociones = pagedData.data;
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
        
      });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.promociones.filter(function (d) {
      return d.nombre.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.promociones = temp;
    if (val === '') {
      this.setPage({ offset: 0 });
    }
  }
  subir(data){
    let title = 'Subir imagen de la Promoción';
    let dialogRef: MatDialogRef<any> = this.dialog.open(SubirImagenesComponent, {
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
        this.promocionesService.updatePromocion(res)
            .subscribe(data => {
              this.promociones = data;
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Promoción modificada!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Esta Promoción no se puede modificar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
      });
  }
  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Promoción' : 'Modificar Promoción';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPromocionesComponent, {
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
          this.promocionesService.postPromocion(res)
            .subscribe(data => {
              this.promociones.unshift(data);
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Promoción agregada!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Esta Promoción ya se encuentra ingresado' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        } else {
          this.promocionesService.updatePromocion(res)
            .subscribe(data => {
              this.promociones = data;
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Promoción modificada!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Esta Promoción no se puede modificar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }
  openGanadores(data) {
    let title = 'Ganadores de la Promoción';
    let dialogRef: MatDialogRef<any> = this.dialog.open(GanadoresPromocionesComponent, {
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
        this.loader.open();
        
          this.promocionesService.getAllGanadoresPromociones(data.id)
            .subscribe(data => {
              this.promociones.unshift(data);
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Promoción agregada!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Esta Promoción ya se encuentra ingresado' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar la Promoción?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.promocionesService.deletePromocion(row.id)
            .subscribe(data => {
              this.loader.close();
              this.promociones = data;
              this.setPage({ offset: 0 });              
              this.snack.open('Promoción eliminado!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Esta Promoción no se puede eliminar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }
}
