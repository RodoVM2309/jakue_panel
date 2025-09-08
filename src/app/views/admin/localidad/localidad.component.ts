import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';

import { LocalidadService } from './../../../shared/services/localidad.service';
import { Localidad } from './../../../shared/models/localidad';
import { AddLocalidadComponent } from './add-localidad/add-localidad.component';


@Component({
  selector: 'app-localidad',
  templateUrl: './localidad.component.html',
  styleUrls: ['./localidad.component.scss']
})
export class LocalidadComponent implements OnInit {
  public localidades: Localidad[];
  public getItemSub: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogLocaRef: MatDialogRef<LocalidadComponent>,
    private localidadService: LocalidadService, public router: Router, private dialog: MatDialog,
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
    this.getItemSub = this.localidadService.getAllLocalidad(this.data.provincia)
      .subscribe(data => {
        this.localidades = data.data;
      });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.localidades.filter(function(d) {
      return d.descripcion.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.localidades = temp;
    if(val === ''){
      this.getItems();
    }
  }

  cerrar(){    
    this.dialogLocaRef.close();
  }

  openPopUp(datos: any = {}, isNew?) {
    let title = isNew ? 'Agregar Localidad' : 'Modificar localidad';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddLocalidadComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: datos, isNew: isNew, provincia: this.data.provincia}
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.loader.open();
        if (isNew) {
          this.localidadService.postLocalidad(res)
            .subscribe(data => {
              this.localidades.unshift(data);
              this.getItems();
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Localidad agregada!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Localidad ya se encuentra ingresada' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        } else {
          this.localidadService.updateLocalidad(res)
            .subscribe(data => {
              this.localidades = data;
              this.getItems();
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Localidad modificada!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Localidad no se puede modificar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar la Localidad?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.localidadService.deleteLocalidad(row.id)
            .subscribe(data => {
              this.loader.close();
              this.localidades = data;
              this.getItems();              
              this.snack.open('Localidad eliminada!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Localidad no se puede eliminar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }
}
