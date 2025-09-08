import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import {
  MatDialogRef, MAT_DIALOG_DATA, DateAdapter,
  MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatPaginator, MatDialog
}
  from '@angular/material';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, tap, delay } from 'rxjs/operators';
import { Chofer } from '../../../..//shared/models/chofer';
import { MarketingService } from '../../../..//shared/services/marketing.service';
import { Page } from '../../../..//shared/models/page';
import { AddSmsComponent } from '../../../..//shared/components/home/asignar-viaje/add-sms/add-sms.component';
import { AppLoaderService } from '../../../..//shared/services/app-loader/app-loader.service';
import { Notificacion } from '../../../..//shared/models/notificacion';
import { SendsmsService } from '../../../..//shared/services/sendsms.service';
import { AppAtencionService } from '../../../..//shared/services/app-atencion/app-atencion.service';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';

@Component({
  selector: 'app-choferes-notificacion',
  templateUrl: './choferes-notificacion.component.html',
  styleUrls: ['./choferes-notificacion.component.scss']
})
export class ChoferesNotificacionComponent implements OnInit {
  public getItemSub: Subscription;
  grupoNotificacion: any;
  listChoferes: Chofer[];
  page = new Page();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChoferesNotificacionComponent>,
    private marketingService: MarketingService, private dialog: MatDialog,
    private loader: AppLoaderService, private smsService: SendsmsService,
    private atencionService: AppAtencionService,private alertService: AppAlertService,
  ) {
    this.page.pageNumber = 0;
    this.page.totalElements = 0;
    this.page.size = 10;
  }

  /* Condicion para que se habilite el boton
  [disabled]="page.totalElements===0" */

  ngOnInit() {
    this.grupoNotificacion = this.data.payload;   
    this.setPage({ offset: 0 });
  }
  

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    this.loader.open();
    this.marketingService.getFiltroChoferes(this.page.pageNumber, this.grupoNotificacion.id)
      .subscribe(pagedData => {
        this.loader.close();
        this.listChoferes = pagedData.data;
        for (let index = 0; index < this.listChoferes.length; index++) {
          this.listChoferes[index].distancia = pagedData.data[index].kmetros;
        }
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
        
      },
        err => {
          this.loader.close();
        });
  }
  openPopUpSendNotificaciones() {
    const title = "Notificaciones a los Choferes";
    const dialogRef: MatDialogRef<any> = this.dialog.open(AddSmsComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: this.grupoNotificacion }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      let message = res.message;
      let isError = false;
      let datos = {
        id_grupo:this.grupoNotificacion.id,
        mensaje: res.mensaje
      } 
      this.marketingService.postNotificacionesGrupo(datos)
            .subscribe(data => {              
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              };
              this.alertService.confirm({title:'¡Notificiones enviadas!', message: ' ' +data.data.message, tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.atencionService.confirm({ message: 'Errores al enviar las notificaciones.' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });


    })


  }
  submit() {
    this.dialogRef.close();
  }

}
