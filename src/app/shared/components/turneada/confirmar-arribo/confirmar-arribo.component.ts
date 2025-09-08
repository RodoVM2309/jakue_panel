import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppAlertService } from '../../../services/app-alert/app-alert.service';
import {  MatDialog,  MatSnackBar, MatSidenav, MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { AppConfirmService } from '../../../services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppErrorService } from '../../../services/app-error/app-error.service';
import { HomeService } from '../../home/home.service';

import { CentrosService } from './../../../services/centros.service';
import { Page } from '../../../models/page';
import { ChoferZona } from '../../../models/chofer-zona';

@Component({
  selector: 'app-confirmar-arribo',
  templateUrl: './confirmar-arribo.component.html',
  styleUrls: ['./confirmar-arribo.component.scss']
})
export class ConfirmarArriboComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public choferes: ChoferZona[];
  public allchoferes: ChoferZona[];
  page = new Page();
  public getItemSub: Subscription;
  public totalChoferes: number = 0;
  public totalApp: number = 0;
  public totalChoferesOcupados: number = 0;
  filtro = {
    patente: '',
    cuit: '',
    transportista: '',
    nombre: ''
  };
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };
  displayedColumns: string[] = ['chofer', 'patente', 'patente_acoplado', 'cuit', 'transportista', 'estado', 'acciones'];
  dataSource= new MatTableDataSource();
  pageEvent: PageEvent;
  constructor(private centrosService: CentrosService, public router: Router, private dialog: MatDialog,
     private confirmService: AppConfirmService,
    private errorService: AppErrorService, 
    private loader: AppLoaderService, 
    private alertService: AppAlertService,
    private homeService: HomeService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Arribos por Página";
    this.paginator._intl.nextPageLabel = "Siguiente";
    this.paginator._intl.firstPageLabel = "Primero";
    this.paginator._intl.lastPageLabel = "Último Arribo";
    this.paginator._intl.previousPageLabel = "Anterior";
    this.setPage(null);
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
  getAllChoferesCentro() {
    this.centrosService.getAllChoferesCentro().subscribe(pagedData => {
      this.allchoferes = pagedData.data;
      this.dataSource = new MatTableDataSource(this.allchoferes);

    });
  }
  revertirDisponibilidadChofer(chofer) {
    this.confirmService.confirm({ message: '¿Esta seguro que quiere cancelar el arribo del chofer ' + chofer.nombre_persona+ '?' })
      .subscribe(res => {
        if (res) {        
          this.centrosService.revertirDisponibilidadChofer(chofer.id).subscribe(pagedData => {
            this.alertService.confirm({ message: '¡Cancelado el Arribo del chofer '+chofer.nombre_persona+ '!', tipo: 'exito' }).subscribe(res => {
              if (res) {
                this.setPage(null);
              }
            },
              err => {                
                this.errorService.confirm({ message: 'Error, no se pudo cancelar el arribo' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
          });
        }
      })


  }
  cambiarDisponibilidadChofer(chofer) {
    this.centrosService.cambiarDisponibilidadChofer(chofer.id).subscribe(pagedData => {
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
        patente: '',
        cuit: '',
        transportista: '',
        nombre: ''
      };
    };
    this.loader.open();
    this.centrosService.getChoferesCentroListaTipo2(params, this.filtro)
    .subscribe(pagedData => {
      this.choferes = pagedData.data;
      this.dataSource.data= this.choferes;
      this.loader.close();      
      this.page.totalElements = pagedData._meta.totalCount;      
      this.page.pageNumber = pagedData._meta.currentPage - 1;      
    },
    err => {
      this.loader.close();
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
      case 'patente':
        this.filtro.patente = val;
        break;
      case 'cuit':
        this.filtro.cuit = val;
        break;
      case 'transportista':
        this.filtro.transportista = val;
        break;
      case 'nombre':
        this.filtro.nombre = val;
        break;
      default:
        break;
    }   
    this.setPage(null);
    
  }


}
