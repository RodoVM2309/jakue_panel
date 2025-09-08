import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { PromocionesService } from './../../../shared/services/promociones.service';
import { Sorteo } from './../../../shared/models/promocion.model';
import { AddSorteoComponent } from './add-sorteo/add-sorteo.component';
import { GanadoresSorteoComponent } from './ganadores-sorteo/ganadores-sorteo.component';
import { Page } from '../../../shared/models/page';
import { PagedData } from '../../../shared/models/paged-data';
import { SubirImagenSorteoComponent } from './subir-imagen-sorteo/subir-imagen-sorteo.component';
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';

@Component({
  selector: 'app-sorteo',
  templateUrl: './sorteo.component.html',
  styleUrls: ['./sorteo.component.scss']
})
export class SorteoComponent implements OnInit {
  public documento: Sorteo[];
  page = new Page();
  hay: boolean;
  public getItemSub: Subscription;
  constructor(private documentoService: PromocionesService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private loader: AppLoaderService, private alertService: AppAlertService, private errorService: AppErrorService, private atencionService: AppAtencionService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.hay = false;
    //this.getItems();
    this.setPage({ offset: 0 });
    this.buscarVigente();
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    this.documentoService.getAllSorteos(this.page.pageNumber).subscribe(pagedData => {
      this.documento = pagedData.data;
      for (let i = 0; i < this.documento.length; i++) {
        this.documento[i].vigente = (this.documento[i].vigente.toString() === '0') ? 'NO' : 'SI';
      }
      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;

    });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.documento.filter(function (d) {
      return d.nombre.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.documento = temp;
    if (val === '') {
      this.setPage({ offset: 0 });
    }
  }
  buscarVigente() {
    
    this.documentoService.getHaySorteoVigente().subscribe(pagedData => {
     
      if (pagedData.data.length != 0)
        this.hay = true;
      else
        this.hay = false;

    });
   
  }
  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Sorteo' : 'Modificar Sorteo';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddSorteoComponent, {
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
          this.documentoService.postSorteo(res)
            .subscribe(data => {
              this.documento.unshift(data);
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Sorteo agregado!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Este Sorteo ya se encuentra ingresado' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        } else {
          this.documentoService.updateSorteo(res)
            .subscribe(data => {
              this.documento = data;
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Sorteo modificada!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Este Sorteo no se puede modificar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar este Sorteo?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.documentoService.deleteSorteo(row.id)
            .subscribe(data => {
              this.documento = data;
              this.setPage({ offset: 0 });
              this.loader.close();
              this.snack.open('Sorteo eliminado!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Esta Sorteo no se puede eliminar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }
  subir(data) {
    let title = 'Subir imagen del Sorteo';
    let dialogRef: MatDialogRef<any> = this.dialog.open(SubirImagenSorteoComponent, {
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
        this.documentoService.updateSorteo(res)
          .subscribe(data => {
            this.documento = data;
            this.setPage({ offset: 0 });
            if (this.loader !== null) {
              this.loader.close();
            }
            this.snack.open('Sorteo modificada!', 'OK', { duration: 4000 });
            return;
          },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Sorteo no se puede modificar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
      });
  }
  CambiarVigencia(row) {
    
    const accion = (row.vigente === 'NO') ? 'poner' : 'quitar';
      if (accion === 'poner' && this.hay) {
        this.atencionService.confirm({ message: 'Ya existe un sorteo Vigente!', tipo: 'exito' }).subscribe(res => {
          if (res) {
            return;
          }
        });
      } else {
        this.confirmService.confirm({ message: '¿Está seguro de Modificar la vigencia del Sorteo: ' + row.nombre + '?' })
          .subscribe(res => {
            if (res) {
              if (accion === 'poner') {
                this.loader.open();
                this.documentoService.postPonerSorteoVigente(row)
                  .subscribe(data => {
                    this.loader.close();
                    this.alertService.confirm({ message: '¡Modificado Concurso como Vigente!', tipo: 'exito' }).subscribe(res => {
                      this.hay = true;
                      if (res) {
                        return;
                      }
                    });
                  }, err => {
                    this.loader.close();
                    this.errorService.confirm({ message: 'Problemas Modificando el Concurso' + err });
                  });
              } else {
                this.loader.open();
                this.documentoService.postQuitarSorteoVigente(row)
                  .subscribe(data => {
                    this.loader.close();
                    this.atencionService.confirm({ message: 'El Concurso ya no es Vigente!', tipo: 'exito' }).subscribe(res => {
                      this.hay = false;
                      if (res) {
                        return;
                      }
                    });
                  }, err => {
                    this.loader.close();
                    this.errorService.confirm({ message: 'Problemas Modificando el Concurso' + err });
                  });
              }

            }
          });
      }

  }
  openGanadores(data) {
    let title = 'Ganadores de la Promoción';
    let dialogRef: MatDialogRef<any> = this.dialog.open(GanadoresSorteoComponent, {
      width: '720px',
      disableClose: false,
      data: { title: title, payload: data }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
          this.documentoService.getAllGanadoresSorteo(1, data.id)
            .subscribe(data => {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.documento.unshift(data);
              this.setPage({ offset: 0 });              
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
}
