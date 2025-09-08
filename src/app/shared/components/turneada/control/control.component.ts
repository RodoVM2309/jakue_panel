import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppAlertService } from '../../../services/app-alert/app-alert.service';
import { MatDialog, MatDialogRef, MatSnackBar,  MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { AppLoaderService } from '../../../services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppErrorService } from '../../../services/app-error/app-error.service';
import { AppAtencionService } from '../../../services/app-atencion/app-atencion.service';
import { HomeService } from '../../home/home.service';

import { CentrosService } from './../../../services/centros.service';
import { Page } from '../../../models/page';
import { ViajeLista } from '../../../models/viaje-lista';
import { NomencladoresService } from '../../../services/nomencladores.service';
import { ModificarComponent } from './modificar/modificar.component';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public viajes: ViajeLista[];
  page = new Page();
  public getItemSub: Subscription;
  public totalChoferes: number = 0;
  public totalApp: number = 0;
  public totalChoferesOcupados: number = 0;
  filtro = {
    nombre: ''
  };
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };
  displayedColumns: string[] = ['id_pedido', 'nombre_chofer', 'nombre_lista', 'nombre_lista_pedido', 'create_at', 'creado_por', 'acciones'];

  dataSource = new MatTableDataSource();
  pageEvent: PageEvent;
  constructor(private centrosService: CentrosService,
    public router: Router, private dialog: MatDialog,
    private errorService: AppErrorService, 
    private loader: AppLoaderService, 
    private alertService: AppAlertService,
    private homeService: HomeService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Choferes por Página";
    this.paginator._intl.nextPageLabel = "Siguiente";
    this.paginator._intl.firstPageLabel = "Primero";
    this.paginator._intl.lastPageLabel = "Último Chofer";
    this.paginator._intl.previousPageLabel = "Anterior";
    this.setPage(null);
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  cambiarDisponibilidadChofer(id_chofer) {
    this.centrosService.cambiarDisponibilidadChofer(id_chofer).subscribe(pagedData => {
      this.alertService.confirm({ message: '¡Chofer Confirmado el Arribo !', tipo: 'exito' }).subscribe(res => {
        if (res) {
          this.setPage(null);
        }
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'Error, no se pudo confirmar el arribo' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });


    });
  }
  convierteFecha(fecha) {
    return this.homeService.formatoFecha(fecha, "amd", "-");
  }

  setPage(event?: PageEvent) {
    let params = {
      page: 1,
      per_page: this.page.size
    };
    if (event !== null) {
      params.page = event.pageIndex + 1;
      params.per_page = event.pageSize;
    }
    if (this.filtro === undefined) {
      this.filtro = {
        nombre: ''
      };
    };
    this.centrosService.getViajes(params, this.filtro)
      .subscribe(pagedData => {
        this.viajes = pagedData.data;       
        this.dataSource.data = this.viajes;
        this.loader.close();
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
      },
        err => {
          this.errorService.confirm({ message: 'Error, al buscar los choferes' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
  }

  updateFilter(event, param) {
    const val = event.target.value.toLowerCase();

    switch (param) {
      case 'nombre':
        this.filtro.nombre = val;
        break;
      default:
        break;
    }
    this.setPage(null);

  }
  openPopUpModificarLista(data: any = {}) {
    let datos = {
      id_viaje: data.id,
      id_lista_pedido: data.id_lista_pedido,
      id_chofer: data.id_chofer
    }
    let title = 'Elegir nueva lista';
    const dialogRef: MatDialogRef<any> = this.dialog.open(ModificarComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload:datos }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.setPage(null);
      })
  }

}
