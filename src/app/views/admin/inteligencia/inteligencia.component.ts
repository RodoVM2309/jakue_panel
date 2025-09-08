import { AfterViewInit, Component,  OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource, MatDialogRef,
  MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { CentrosService } from './../../../shared/services/centros.service';
import { Inteligencia } from './../../../shared/models/inteligencia';
import { SituacionPuertoService } from './../../../shared/services/situacion-puerto.service';
import { SituacionPuerto } from './../../../shared/models/situacion-puerto';
import { NomencladoresService } from './../../../shared/services/nomencladores.service';
import { InfoPersonaComponent } from './../personas/info-persona/info-persona.component';
import { CamionDisponibleComponent } from './camion-disponible/camion-disponible.component';
import { Page } from '../../../shared/models/page';
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

 let ELEMENT_DATA: Inteligencia[];
@Component({
  selector: 'app-inteligencia',
  templateUrl: './inteligencia.component.html',
  styleUrls: ['./inteligencia.component.scss']
})
export class InteligenciaComponent implements OnInit , OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public inteligencias: Inteligencia[];
  page = new Page();
  public getItemSub: Subscription;
  situaciones: SituacionPuerto[];
  selectSituacion: string;
  selectedDestino: Inteligencia;
  loading = false;
  temp = [];
  interval: any;
  displayedColumns: string[] = ['tipo', 'id', 'nombre_generador', 'nombre_dador', 'nombre_producto',
    'nombre_lugar_carga', 'zona_destino', 'fecha_desde', 'fecha_hasta', 'nombre_centro', 'prioridad',
    'km', 'camiones_pendientes', 'cant_camiones_disponibles', 'cant_camiones_muvin', 'cant_camiones_clientes', 'viajes_inteligentes'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(private inteligenciasService: CentrosService, public router: Router, private dialog: MatDialog,
     private confirmService: AppConfirmService,
    private errorService: AppErrorService, 
    private atencionService: AppAtencionService,
     private nomecladoresServices: NomencladoresService,
    private loader: AppLoaderService, private alertService: AppAlertService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    // this.getItems();
    this.setPage({ offset: 0 });
    ELEMENT_DATA = [];
    this.getAds();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
  getAds() {
    this.interval = setInterval(() => {
      this.setPage({ offset: 0 });
    }, 40000);
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const columns = Object.keys(this.temp[0]);
    columns.splice(columns.length - 1);

    if (!columns.length)
      return;

    const rows = this.temp.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.inteligencias = rows;
  }

  
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    ELEMENT_DATA = [];
    this.inteligenciasService.getAllInteligencia(this.page.pageNumber)
    .subscribe(pagedData => {
      this.inteligencias = this.temp = pagedData.data;
      for (let i = 0; i < this.inteligencias.length; i++) {
        ELEMENT_DATA.push(this.inteligencias[i]);
      }
      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;
      this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    });
  }
  stopProp(e) {
    e.stopPropagation();
  }

  CambiarCliente(row) {
    const accion = (row.cliente_muvin === 'NO') ? 'poner' : 'quitar';
    this.confirmService.confirm({ message: '¿Está seguro de Modificar el estado del Centro: ' + row.nombre_persona + '?' })
      .subscribe(res => {
        if (res) {
          if (accion === 'poner') {
            this.loader.open();
            this.nomecladoresServices.postPonerCliente(row)
              .subscribe(data => {
                this.loader.close();
                this.alertService.confirm({ message: '¡Modificado Centro como Cliente!', tipo: 'exito' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              }, err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Problemas Modificando el Centro' + err });
              });
          } else {
            this.loader.open();
            this.nomecladoresServices.postQuitarCliente(row)
              .subscribe(data => {
                this.loader.close();
                this.atencionService.confirm({ message: 'El Centro ya no es Cliente!', tipo: 'exito' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              }, err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Problemas Modificando el Centro' + err });
              });
          }

        }
      });
  }
  CambiarVisualiza(row) {
    const accion = (row.visualiza_flota_intermediario === 'NO') ? 'poner' : 'quitar';
    this.confirmService.confirm({ message: '¿Está seguro de Modificar si visualiza la flota de intermediarios: ' + row.nombre_persona + '?' })
      .subscribe(res => {
        if (res) {
          if (accion === 'poner') {
            this.loader.open();
            this.nomecladoresServices.postPonerVisualiza(row)
              .subscribe(data => {
                this.loader.close();
                this.alertService.confirm({ message: '¡Modificado Centro para visulizar!', tipo: 'exito' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              }, err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Problemas Modificando el Centro' + err });
              });
          } else {
            this.loader.open();
            this.nomecladoresServices.postQuitarVisualiza(row)
              .subscribe(data => {
                this.loader.close();
                this.atencionService.confirm({ message: 'El Centro ya no Visualiza!', tipo: 'exito' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              }, err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Problemas Modificando el Centro' + err });
              });
          }

        }
      });
  }
  openPopUpInfoPersona(data: any = {}) {
    let title = 'Información del Perfil';
    let dialogRef: MatDialogRef<any> = this.dialog.open(InfoPersonaComponent, {
      width: '1024px',
      height: '73vh',
      disableClose: true,
      data: { title: title, payload: { id: data.id } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }
  showLibres(data: any = {}) {
    let title = 'Cantidad de camiones libres disponibles ';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CamionDisponibleComponent, {
      width: '1200px',
      height: '600px',
      disableClose: true,
      data: { title: title, payload: { data: data, tipo: 1 } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }
  showMuvin(data: any = {}) {
    let title = 'Cantidad de camiones Muvin disponibles ';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CamionDisponibleComponent, {
      width: '1024px',
      height: '640px',
      disableClose: false,
      data: { title: title, payload: { data: data, tipo: 2 } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }
  showClientes(data: any = {}) {
    let title = 'Cantidad de camiones Clientes disponibles ';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CamionDisponibleComponent, {
      width: '1024px',
      height: '640px',
      disableClose: false,
      data: { title: title, payload: { data: data, tipo: 3 } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }
}
