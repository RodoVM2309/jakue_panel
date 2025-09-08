import { Component, OnInit, OnDestroy,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog,  MatSnackBar,  MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';

import { OrigenesService } from './../../../shared/services/origenes.service';
import { Origen } from './../../../shared/models/origen';
import { AddOrigenComponent } from './add-origen/add-origen.component';

import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';
import { SubirImagenOrigenComponent } from './subir-imagen-origen/subir-imagen-origen.component';
import { Page } from 'app/shared/models/page';


@Component({
  selector: 'app-origenes',
  templateUrl: './origenes.component.html',
  styleUrls: ['./origenes.component.scss']
})
export class OrigenesComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public itemForm: FormGroup;
  public origenes: Origen[];
  public getItemSub: Subscription;
  public searchControl: FormControl;
  dataSource=   new MatTableDataSource(); 
  tipocentro: any;
  displayedColumns: string[] = ['descripcion','nombre_localidad','desc_bloqueado','imagenC','acciones'];

  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Registros</span>
      </div>
    `
  };
  pageEvent: PageEvent;
  page = new Page();
  filtro = {
    descripcion: ''
  };
  constructor(private origenesService: OrigenesService, 
    public router: Router, private dialog: MatDialog,
    private confirmService: AppConfirmService,
    private errorService: AppErrorService, private atencionService: AppAtencionService,
    private loader: AppLoaderService, private alertService: AppAlertService) { 
      this.page.pageNumber = 0;
    this.page.size = 10;
    }

  ngOnInit() {
    this.tipocentro = localStorage.getItem('clienteMuvin');
    this.paginator._intl.itemsPerPageLabel = "Lugares de carga por Página";
    this.paginator._intl.nextPageLabel = "Siguiente";
    this.paginator._intl.firstPageLabel = "Primero";
    this.paginator._intl.lastPageLabel = "Último Lugar";
    this.paginator._intl.previousPageLabel = "Anterior";
    this.setPage(null);
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filtro.descripcion=val;    
    this.setPage(null);
    
  }

  setPage(event?: PageEvent) {
    let params = {
      page: 1,
      per_page: this.page.size,
      filtro_descripcion: this.filtro.descripcion===undefined ? '':this.filtro.descripcion     };
    if (event !== null) {
      params.page = event.pageIndex + 1;
      params.per_page = event.pageSize;
    };    
    //this.loader.open();
    this.getItemSub = this.origenesService.getAllOrigenes(params)
      .subscribe(data => {
       // this.loader.close();
        this.origenes = data.data;
        for (let i = 0; i < this.origenes.length; i++) {
          this.origenes[i].desc_bloqueado = (this.origenes[i].bloqueado === 0) ? 'NO' : 'SI';
          this.origenes[i].imagenC = (this.origenes[i].imagen.toString() === '0') ? 'NO' : 'SI';
        };
        this.page.totalElements=data._meta.totalCount;
        this.dataSource.data= this.origenes;
      },
      err => {
        //this.loader.close();
        this.errorService.confirm({ message: 'Error, al buscar los lugares de carga' }).subscribe(res => {
          if (res) {
            return;
          }
        })
      }); 
  }
  

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Lugar de Carga' : 'Modificar Lugar de Carga';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddOrigenComponent, {
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
          res.telefono= res.telefono.toString();
          this.origenesService.postOrigen(res)
            .subscribe(data => {
              this.origenes.unshift(data);
              this.setPage(null);
              if (this.loader !== null) {
                this.loader.close();
              }
              this.alertService.confirm({ message: '¡Lugar de Carga Agregado!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.atencionService.confirm({ message: 'Este Lugar de Carga ya se encuentra ingresado' });
              });
        } else {
          this.origenesService.updateOrigen(res)
            .subscribe(data => {
              this.origenes = data;
              this.setPage(null);
              if (this.loader !== null) {
                this.loader.close();
              }
              this.alertService.confirm({ message: '¡Lugar de Carga Modificado!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Este Lugar de Carga no se puede modificar' });
              });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar el Lugar de Carga: ' + row.descripcion + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          const datos = {
            id : row.id,
            oculto : 1 
          }
          this.origenesService.updateOrigen(datos)
            .subscribe(data => {
              this.loader.close();
              this.origenes = data;
              this.setPage(null);              
              this.alertService.confirm({ message: '¡Lugar de Carga eliminado!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Este Lugar de Carga no se puede eliminar' });
              });
        }
      });
  }

  bloqueoDesbloqueo(row) {
    const entidad = 'Lugar de Carga';
    const accion = (row.bloqueado === 0) ? 'bloquear' : 'desbloquear';
    const hecho = (row.bloqueado === 0) ? 'bloqueado' : 'desbloqueado';
    this.confirmService.confirm({ message: '¿Está seguro de ' + accion + ' el ' + entidad + ': ' + row.descripcion + '?' })
      .subscribe(res => {
        if (res) {
          row.bloqueado = (row.bloqueado === 0) ? 1 : 0;
          this.loader.open();
          this.origenesService.updateOrigen(row)
            .subscribe(data => {
              this.loader.close();
              this.setPage(null);
              this.alertService.confirm({ message: entidad + ' ' + hecho + '!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            }, err => {
              this.loader.close();
              this.errorService.confirm({ message: 'Error ocurrido al ' + accion + ' el ' + entidad + ' ' + err});
            });
        }
      });
  }

  subirImagen(data) {
    let title = 'Subir imagen del lugar de carga';
    let dialogRef: MatDialogRef<any> = this.dialog.open(SubirImagenOrigenComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          this.setPage(null);
          // If user press cancel
          return;
        }
      });
  }

}
