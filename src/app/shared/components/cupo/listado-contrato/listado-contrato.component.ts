import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSidenav, MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { AppConfirmService } from '../../../services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppErrorService } from '../../../services/app-error/app-error.service';
import { AppAtencionService } from '../../../services/app-atencion/app-atencion.service';
import { TranslateService } from '@ngx-translate/core';

import { CentrosService } from './../../../services/centros.service';
import { Page } from '../../../models/page';


export class ListadoContrato {
  alfanumericoCupo: string;
  nombreDestino: string;
  nombreProducto: string;
  numeroContrato: string;
  nombreDador: string;
}
@Component({
  selector: 'app-listado-contrato',
  templateUrl: './listado-contrato.component.html',
  styleUrls: ['./listado-contrato.component.scss']
})
export class ListadoContratoComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public listadoContrato: ListadoContrato[] = [];
  page = new Page();
  public getItemSub: Subscription;
  filtro = {
    alfanumericoCupo: '',
    numeroContrato: '',
  };
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };
  displayedColumns: string[] = ['alfanumericoCupo', 'nombreDestino', 'nombreProducto', 'numeroContrato', 'nombreDador'];
  dataSource = new MatTableDataSource();
  pageEvent: PageEvent;
  constructor(private centrosService: CentrosService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private errorService: AppErrorService, private atencionService: AppAtencionService,
    private loader: AppLoaderService, private alertService: AppAlertService, 
    private translate: TranslateService,) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.translate.get('listado-contrato.itemsPerPageLabel').subscribe((res: string) => {
      this.paginator._intl.itemsPerPageLabel = res
    });
    this.translate.get('listado-contrato.nextPageLabel').subscribe((res: string) => {
      this.paginator._intl.nextPageLabel = res
    });
    this.translate.get('listado-contrato.firstPageLabel').subscribe((res: string) => {
      this.paginator._intl.firstPageLabel = res
    });
    this.translate.get('listado-contrato.lastPageLabel').subscribe((res: string) => {
      this.paginator._intl.lastPageLabel = res
    });
    this.translate.get('listado-contrato.previousPageLabel').subscribe((res: string) => {
      this.paginator._intl.previousPageLabel = res
    });
    
    this.setPage(null);
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
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
    //this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro === undefined) {
      this.filtro = {
        alfanumericoCupo: '',
        numeroContrato: '',
      };
    };
    this.centrosService.getListadoContratoCentro(params, this.filtro)
      .subscribe(pagedData => {

        this.listadoContrato = pagedData.data;
        this.dataSource.data = this.listadoContrato;
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
      },
        err => {
          this.loader.close();
          this.translate.get('listado-contrato.errorSearchContratos').subscribe((res: string) => {
           
            this.errorService.confirm({ message: res }).subscribe(res1 => {
              if (res1) {
                return;
              }
            });
          });
          
        });
  }
  updateFilter(event, param) {
    const val = event.target.value;

    switch (param) {
      case 'numeroContrato':
        this.filtro.numeroContrato = val;
        break;
      case 'alfanumericoCupo':
        this.filtro.alfanumericoCupo = val;
        break;
            default:
        break;
    }
    this.setPage(null);
    
  }

}
