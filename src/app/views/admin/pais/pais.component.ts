import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { PaisService } from './../../../shared/services/pais.service';
import { Pais } from './../../../shared/models/pais';
import { AddPaisComponent } from './add-pais/add-pais.component';

@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.scss']
})
export class PaisComponent implements OnInit {
  public paises: Pais[];
  public getItemSub: Subscription;
  constructor(private paisService: PaisService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private loader: AppLoaderService, private alertService:AppAlertService) { }

  ngOnInit() {
    this.getItems();
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  getItems() {
    this.getItemSub = this.paisService.getAllPais()
      .subscribe(data => {
        this.paises = data.data;
      });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.paises.filter(function(d) {
      return d.descripcion.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.paises = temp;
    if(val === ''){
      this.getItems();
    }
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar país' : 'Modificar país';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPaisComponent, {
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
          this.paisService.postPais(res)
            .subscribe(data => {
              this.paises.unshift(data);
              this.getItems();
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('País agregado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este País ya se encuentra ingresado' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        } else {
          this.paisService.updatePais(res)
            .subscribe(data => {
              this.paises = data;
              this.getItems();
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('País Modificado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este País no se puede modificar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar el país: ' + row.descripcion + '?'})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.paisService.deletePais(row.id)
            .subscribe(data => { 
              this.loader.close();
              this.paises = data;
              this.getItems();             
              this.snack.open('País eliminado!', 'OK', { duration: 4000 });
              return;
            });
        }
      },
      err => {
        this.loader.close();
        this.alertService.confirm({ message: 'Este País no se puede eliminar' }).subscribe(res => {
          if (res) {
            return;
          }
        });
      });
  }
}
