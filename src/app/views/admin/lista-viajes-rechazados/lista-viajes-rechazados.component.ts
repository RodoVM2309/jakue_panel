import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { CentrosService } from '../../../shared/services/centros.service';
import { Subscription } from 'rxjs';

import { Page } from '../../../shared/models/page';


@Component({
  selector: 'app-lista-viajes-rechazados',
  templateUrl: './lista-viajes-rechazados.component.html',
  styleUrls: ['./lista-viajes-rechazados.component.scss']
})
export class ListaViajesRechazadosComponent implements OnInit, OnDestroy {
  page = new Page();
  public filtro;
  viajes_rechazados: any;
  public getItemSub: Subscription;
  constructor(public router: Router, 
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private alertService: AppAlertService, private loader: AppLoaderService,
    private centro: CentrosService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.setPage({ offset: 0 });
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro === undefined) {
      this.filtro = '';
    }
    this.centro.getListaViajesRechazadosTurneada(this.page.pageNumber).subscribe(pagedData => {
      this.viajes_rechazados = pagedData.data;
      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;
    });
  }

  accionPenalizar(row, opt) {
    let mensaje = (opt === 1) ? "penalizar" : "no penalizar";
    this.confirmService.confirm({ message: `Está seguro de `+ mensaje + ` al chofer: ${row.nombreChofer} ?` })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          let dataP = {
            id_viaje: row.id_viaje,
            penalizar: opt
          };
          this.centro.penalizarChoferViajeRechazado(dataP)
            .subscribe(data => {
              this.setPage({ offset: 0 });
              this.loader.close();
              this.snack.open('Acción realizada con exito!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Error al realizar la  acción' });
              });
        }
      });
  }


}
