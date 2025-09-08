import { Component, OnInit, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { HomeService } from "../../../../shared/components/home/home.service";
import { MatTableDataSource, MatDialogRef, MatDialog, MatSnackBar, PageEvent, MatTable,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE } from '@angular/material';

import { FormGroup, FormControl } from "@angular/forms";
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MagypService } from '../../../../shared/services/magyp.service';
import { MagypContacto } from '../../../../shared/models/magyp-contacto';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppErrorService } from '../../../../shared/services/app-error/app-error.service';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';


import { ExelService } from "../../../../shared/services/exel.service";


@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss'],
  providers: [MagypService,
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'es-ES'
    }],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class ContactoComponent implements OnInit {
  minDate:any;
  maxDate:any;
  @ViewChild(MatTable) table: MatTable<any>;
  dataSource = new MatTableDataSource<any>();
  filtrarForm: FormGroup;
  now = new Date();
  filtro = {
    fechafiltro: this.now
  };
  displayedColumns: string[] = [
    "fecha",
    "hora",
    "telefono",
    "nombreIngreso",
    "mensaje",
    "acciones",
  ];
  pageEvent: PageEvent = new PageEvent();
  contactos: MagypContacto[] = [];
  fechas = {
    fechaDesde: '',
    fechaHasta: ''
  }
  fechaDesde: string ='2020-06-23';
  fechaHasta: string ='2020-06-23';

  constructor(
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private homeService: HomeService,
    private magypService: MagypService,
    private confirmService: AppConfirmService,
    private errorService: AppErrorService,
    private alertService: AppAlertService,
    private excelService: ExelService,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 10;
  }

  ngOnInit() {
    this.filtrarForm = new FormGroup({
      selectedFecha: new FormControl(this.filtro.fechafiltro),
      selectedFecha2: new FormControl(this.filtro.fechafiltro)
    });
    this.fechaDesde = this.homeService.formatoFecha(this.now, "amd", "-");
    this.fechaHasta = this.homeService.formatoFecha(this.now, "amd", "-");
    this.minDate = this.filtro.fechafiltro;
    this.maxDate = this.filtro.fechafiltro;
      this.setPage(this.pageEvent);

  }

  setPage(event?: PageEvent) {
    event.pageIndex++;
    this.loader.open();
    this.fechas.fechaDesde = this.fechaDesde;
    this.fechas.fechaHasta = this.fechaHasta;
    this.magypService.getContactos(this.fechas)
    .subscribe(
      res => {
        this.loader.close();
        this.contactos = res.data;
        //console.log(this.contactos);
        this.dataSource.data = this.contactos;
        //console.log(this.contactos);
      },
      error => {
        this.loader.close();
      }
    );
  }

  aplicarFiltroFechaDesde(fecha1, fecha2) {

    this.fechaDesde = this.homeService.formatoFecha(fecha1.value, "amd", "-");
    this.fechaHasta = this.homeService.formatoFecha(fecha2, "amd", "-");

    this.setPage(this.pageEvent);
  }

  aplicarFiltroFechaHasta(fecha1, fecha2) {

    this.fechaDesde = this.homeService.formatoFecha(fecha1, "amd", "-");
    this.fechaHasta = this.homeService.formatoFecha(fecha2.value, "amd", "-");
    this.setPage(this.pageEvent);

  }



  deleteItem(element){
   // console.log(element);
    this.confirmService.confirm({ message: '¿Está seguro de eliminar el mensaje?'})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.magypService.deleteMensaje(element.id)
            .subscribe(data => {
              this.loader.close();
              this.setPage(this.pageEvent);
              this.alertService.confirm({ message: '!Mensaje eliminado correctamente!', tipo: 'exito' }).subscribe(res1 => {
                if (res1) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'No se pudo eliminar el mensaje' });
              });
        }
      });
  }

  exportAsXLSX(): void {
    this.loader.open();
    let array_exp = [];
    if (this.contactos.length > 0) {
      for (let i = 0; i < this.contactos.length; i++) {
        let exportar = {
          Fecha: this.contactos[i].fecha,
          Hora: this.contactos[i].hora,
          Celular: this.contactos[i].telefono,
          Provincia: this.contactos[i].id_provincia,
          Mensaje: this.contactos[i].mensaje,
        };
        array_exp.push(exportar);
      }
      if (this.loader !== null) {
        this.loader.close();
      }
      this.excelService.exportAsExcelFile(array_exp, 'Listado Consultas');
    }
  }


  exportAsXLSX1(): void {
    let array_exp = [];

      if(this.contactos.length > 0){
          for( let i = 0; i< this.contactos.length; i++){
            let exportar = {
              Fecha: this.contactos[i].fecha,
              Hora: this.contactos[i].hora,
              Celular: this.contactos[i].telefono,
              Menu_Ingreso: this.contactos[i].nombreIngreso,
              Mensaje: this.contactos[i].mensaje
            };
            array_exp.push(exportar);
          }
          this.excelService.exportAsExcelFile(array_exp, "Contactos");
      }else{
        this.errorService.confirm({ message: 'No hay registros cargados' });
      };

  }


  addEvent(type: string, event: MatDatepickerInputEvent<Date>, cmp: string) {
    if (cmp === "desde") {
      this.minDate = event.value;
    } else {
      this.maxDate = event.value;
    }
  }

}
