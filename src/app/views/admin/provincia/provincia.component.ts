import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { ProvinciaService } from './../../../shared/services/provincia.service';
import { Provincia } from './../../../shared/models/provincia';
import { AddProvinciaComponent } from './add-provincia/add-provincia.component';
import { LocalidadComponent } from '../localidad/localidad.component';

import { PersonasService } from './../../../shared/services/personas.service';

export class Pais {
  id: number;
  descripcion: string;
};

@Component({
  selector: 'app-provincia',
  templateUrl: './provincia.component.html',
  styleUrls: ['./provincia.component.scss']
})
export class ProvinciaComponent implements OnInit {
  public itemForm: FormGroup;
  public provincias: Provincia[];
  public getItemSub: Subscription;
  paises: Pais[];
  
  constructor(
    private provinciasService: ProvinciaService, 
    public router: Router, 
    private dialog: MatDialog,
    private snack: MatSnackBar, 
    private confirmService: AppConfirmService,
    private loader: AppLoaderService, 
    private personasService: PersonasService, 
    private fb: FormBuilder, 
    private alertService:AppAlertService) { }

  ngOnInit() {
    this.itemForm = this.fb.group({
      pais: ['1', Validators.required]
    });
    this.getItems();
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  
  getItems() {
    this.getItemSub = this.personasService.getProvincias(1)
      .subscribe(data => {
        this.provincias = data.data;
      });
      this.personasService.getPais()
      .subscribe(data => {
        this.paises = data.data.paises;
      });
  }

  getItemspais(idpais: any) {
    this.getItemSub = this.personasService.getProvincias(idpais)
      .subscribe(data => {
        this.provincias = data.data;
      });
      this.personasService.getPais()
      .subscribe(data => {
        this.paises = data.data.paises;
      });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.provincias.filter(function(d) {
      return d.descripcion.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.provincias = temp;
    if(val === ''){
      this.getItemspais(this.itemForm.controls['pais'].value);
    }
  }

  getProvincias() {
    this.loader.open();
    this.getProvinciasxPais(this.itemForm.controls['pais'].value);
  }

  getProvinciasxPais(v) {
    this.personasService.getProvincias(v)
      .subscribe(data => {
        this.provincias = data.data;
        if (this.loader !== null) {
          this.loader.close();
        }
      });
  }

 
  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Provincia' : 'Modificar Provincia';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddProvinciaComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew, pais: this.itemForm.controls['pais'].value}
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {
          this.provinciasService.postProvincias(res)
            .subscribe(data => {
              //this.provincias.unshift(data);
              this.getItemspais(data.data.id_pais);
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Provincia agregada!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Provincia ya se encuentra ingresada' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        } else {
          this.provinciasService.updateProvincias(res)
            .subscribe(data => {
              //this.getItems();
              this.getItemspais(data.data.id_pais);
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Provincia modificada!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Provincia no se puede modificar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }

  openPopUp_localidades(data: any) {
    let title = 'Localidades';
    let localidadesref: MatDialogRef<any> = this.dialog.open(LocalidadComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, provincia: data, pais: this.itemForm.controls['pais'].value}
    });

    localidadesref.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.loader.open();
        
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar la Provincia?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.provinciasService.deleteProvincias(row.id)
            .subscribe(data => {
              this.loader.close();
              this.getItemspais(this.itemForm.controls['pais'].value);              
              this.snack.open('Provincia eliminada!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Provincia no se puede eliminar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }
}
