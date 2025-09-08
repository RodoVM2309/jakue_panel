import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Page } from 'app/shared/models/page';
import { MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { CentrosService } from 'app/shared/services/centros.service';
import { InfoLogComponent } from './info-log/info-log.component';
import { AppDateAdapter } from '@helpers/date.adapter';
import { APP_DATE_FORMATS } from '@helpers/date.adapter';
import { HomeService } from 'app/shared/components/home/home.service';

@Component({
  selector: 'app-mostrar-logs',
  templateUrl: './mostrar-logs.component.html',
  styleUrls: ['./mostrar-logs.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'es-ES'
    }
  ]
})
export class MostrarLogsComponent implements OnInit {
  public lista_logs: any[];
  public getItemSub: Subscription;
  public cuit: any;
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };
  page = new Page();
  filtro = {
    metodo: '',
    fecha: '',
    json_entrada: '',
    json_salida: ''
  }
  constructor(private dialog: MatDialog, private snack: MatSnackBar, private confirmService: AppConfirmService,
    public centroService: CentrosService, private loader: AppLoaderService, private alertService: AppAlertService,
    public homeService: HomeService, private errorService: AppErrorService) {
    this.page.pageNumber = 0;
    this.page.size = 20;
  }

  ngOnInit() {
    this.cuit = localStorage.getItem('cuit_cuil');
    if (this.cuit === '30709014370') {
      this.setPage({ offset: 0 });
    } else {
      this.confirmService.confirm({ message: 'Esta información no está disponible para usted!!!' }).subscribe(res => {
        if (res) {
          return;
        }
      });
    }
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    this.getItemSub = this.centroService.getMostrarLogsCentro(this.page.pageNumber, this.filtro)
      .subscribe(data => {
        this.lista_logs = data.data;
        this.page.totalElements = data._meta.totalCount;
        this.page.pageNumber = data._meta.currentPage - 1;
        this.page.size = data._meta.perPage;
      });
  }

  openPopUpInfo(data) {
    let title = 'Información del log: ' + data.id;
    const dialogRef: MatDialogRef<any> = this.dialog.open(InfoLogComponent, {
      width: '420px',
      disableClose: true,
      data: { title: title, payload: data }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }

      });

  }

  updateFilter(value, param) {
    let val = '';
    if (param === 'fecha') {
      if (value !== null) {
        val = this.homeService.formatoFecha(value, "amd", "-");
      } else {
        val = '';
      }
    } else {
      val = value;
    }
    eval('this.filtro.' + param + ' = val');
  }

  accionFiltrar() {
    if (this.cuit === '30709014370') {
      this.setPage({ offset: 0 });
    } else {
      this.confirmService.confirm({ message: 'Esta información no está disponible para usted!!!' }).subscribe(res => {
        if (res) {
          return;
        }
      });
    }
  }

}
