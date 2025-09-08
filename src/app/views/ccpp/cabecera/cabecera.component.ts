import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Page } from 'app/shared/models/page';
import { CcppService } from 'app/shared/services/ccpp.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { AddCabeceraComponent } from './add-cabecera/add-cabecera.component';
import { MatDialogRef, MatDialog, MatSnackBar, MatSidenav } from '@angular/material';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';
import { Cabecera } from 'app/shared/models/cabecera';
import { VerCabeceraComponent } from './ver-cabecera/ver-cabecera.component';
import { CopiaCabeceraComponent } from './copia-cabecera/copia-cabecera.component';
import { UserService } from 'app/shared/services/user.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.scss']
})
export class CabeceraComponent implements OnInit {
  public lista_cabeceras: Cabecera[] = [];
  public getItemSub: Subscription;
  page = new Page();
  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Cabeceras</span>
      </div>
    `
  };
  filtro = {
    titulo: '',
  };
  buscarForm: FormGroup;


  constructor(
    private ccppService: CcppService,
    private errorService: AppErrorService,
    private loader: AppLoaderService,
    private dialog: MatDialog,
    private confirmService: AppConfirmService,
    private alertService: AppAlertService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.page.size= 10;
    this.setPage({ offset: 0 });
    this.buscarForm = this.fb.group({
      titulo: ['']
    });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro === undefined) {
      this.filtro = {
        titulo: '',
      };
    };
    this.loader.open('Buscando cabeceras');
    this.getItemSub =this.ccppService.getAllCabeceras(this.page.pageNumber, this.page.size)
      .subscribe(pagedData => {
        this.loader.close();
        this.lista_cabeceras = pagedData.data;
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage;
        this.page.size = pagedData._meta.perPage;
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'Error, al buscar las cabeceras' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
  }

  buscarCabecera() {
    let titulo = this.buscarForm.controls['titulo'].value;
    if (titulo.length === 0) {
      this.setPage({ offset: 0 });
    } else {
      this.loader.open('Buscando cabeceras');
      this.ccppService.searchCabecera(titulo)
      .subscribe(pagedData => {
        this.loader.close();
        this.lista_cabeceras = pagedData.data;
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage;
        this.page.size = pagedData._meta.perPage;
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'Error, al buscar las cabeceras' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
    }
  }

  openPopUp(data: any = {}, isNew) {
    let title = 'Cabecera';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddCabeceraComponent, {
      width: '75vw',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew ,id_cabecera: {}}
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        } else {
          this.page.pageNumber--;
          this.setPage({ offset: this.page.pageNumber });
        }
      });
  }
  openPopUpVer(data: any = {}) {
    let title = 'CABECERA';
    let dialogRef: MatDialogRef<any> = this.dialog.open(VerCabeceraComponent, {
      width: '75vw',
      height: '90vh',
      disableClose: true,
      data: { title: title, payload: data }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {

        } else {
        }
      });
  }

  openPopUpCopia(data: Cabecera) {
    let title = 'Cabecera';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CopiaCabeceraComponent, {
      width: '75vw',
      disableClose: true,
      data: { title: title, payload: data }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        } else {
          this.page.pageNumber--;
          this.setPage({ offset: this.page.pageNumber });
        }
      });
  }

  deleteCabecera(row: Cabecera) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar la cabecera: ' + row.titulo + ' ?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.ccppService.deleteCabecera(row.id)
            .subscribe(data => {
              this.loader.close();
              this.page.pageNumber--;
              this.setPage({ offset: this.page.pageNumber });
              this.alertService.confirm({ message: '¡Cabecera eliminada correctamente!', tipo: 'exito' }).subscribe(res1 => {
                if (res1) {
                  return;
                }
              });
              return;
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Esta cabecera no se puede eliminar' })
                  .subscribe(res1 => {
                    if (res1) {
                    }
                  });

              });
        }
      })
  }
}
