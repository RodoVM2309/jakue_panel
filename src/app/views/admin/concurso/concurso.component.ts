import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';

import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { PromocionesService } from './../../../shared/services/promociones.service';
import { Concurso } from './../../../shared/models/promocion.model';
import { AddConcursoComponent } from './add-concurso/add-concurso.component';
import { Page } from '../../../shared/models/page';
import { SubirPdfConcursoComponent } from './subir-pdf-concurso/subir-pdf-concurso.component';
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';

@Component({
  selector: 'app-concurso',
  templateUrl: './concurso.component.html',
  styleUrls: ['./concurso.component.scss']
})
export class ConcursoComponent implements OnInit {
  public documento: Concurso[];
  page = new Page();
  hay: boolean;
  public getItemSub: Subscription;
  constructor(private documentoService: PromocionesService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private loader: AppLoaderService, private errorService: AppErrorService, private atencionService: AppAtencionService, private alertService: AppAlertService) {
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
    this.documentoService.getAllConcursos(this.page.pageNumber).subscribe(pagedData => {
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
    this.documentoService.getHayConcursoVigente().subscribe(pagedData => {
      if (pagedData.data.length != 0)
        this.hay = true;
      else
        this.hay = false;
    });
  }
  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Concurso' : 'Modificar Concurso';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddConcursoComponent, {
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
          this.documentoService.postConcurso(res)
            .subscribe(data => {
              this.documento.unshift(data);
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Concurso agregado!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Este Concurso ya se encuentra ingresado' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        } else {
          this.documentoService.updateConcurso(res)
            .subscribe(data => {
              this.documento = data;
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Concurso modificada!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Este Concurso no se puede modificar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
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
      this.confirmService.confirm({ message: '¿Está seguro de Modificar la vigencia del Concurso: ' + row.nombre + '?' })
        .subscribe(res => {
          if (res) {
            if (accion === 'poner') {
              this.loader.open();
              this.documentoService.postPonerConcursoVigente(row)
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
              this.documentoService.postQuitarConcursoVigente(row)
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
  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar este Concurso?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.documentoService.deleteConcurso(row.id)
            .subscribe(data => {
              this.documento = data;
              this.setPage({ offset: 0 });
              this.loader.close();
              this.snack.open('Concurso eliminado!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Esta Concurso no se puede eliminar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }
  subir(data) {
    let title = 'Subir PDF de las bases del Concurso';
    let dialogRef: MatDialogRef<any> = this.dialog.open(SubirPdfConcursoComponent, {
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
        this.documentoService.updateConcurso(res)
          .subscribe(data => {
            this.documento = data;
            this.setPage({ offset: 0 });
            if (this.loader !== null) {
              this.loader.close();
            }
            this.snack.open('Concurso modificada!', 'OK', { duration: 4000 });
            return;
          },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Esta Concurso no se puede modificar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
      });
  }
}
