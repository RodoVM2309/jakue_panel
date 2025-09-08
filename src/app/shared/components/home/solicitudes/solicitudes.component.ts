import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
  MatDialogRef,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  PageEvent
} from "@angular/material";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';
import { Subscription } from "rxjs";
import { HomeService } from "../home.service";
import { FormGroup, FormControl } from '@angular/forms';
import {CambiarDemandaComponent} from './cambiar-demanda/cambiar-demanda.component';
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { AppAtencionService } from "app/shared/services/app-atencion/app-atencion.service";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { AppAlertService } from "app/shared/services/app-alert/app-alert.service";


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss'],
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
  ],
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

export class SolicitudesComponent implements OnInit {
  minDate = new Date();
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();

  displayedColumns: string[] = [
    "first_color",
    "producto",
    "fechadesde",
    "fechahasta",
    "zona",
    "demandado",
    "cantidad",
    "asignado",
    "acciones"
  ];

  displayedColumns2: string[] = [
    "alfanumericoCupo",
    "cartaPorte",
    "fechaCupo",
    "estado_cupo",
    "estado_viaje",
    "nombre_destino",
    "nombre_chofer"
  ];
  expandedElement: PeriodicElement;
  public getItemSub: Subscription;
  resumenSolicitud: any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Solicitudes Disponibles</span>
      </div>
    `
  };

  pageEvent: PageEvent;
  pageIndex: number;
  pageSize: number;
  totalSize: number;
  esDadorCupo: any;
  esClienteFinal: any;
  filtro = {
    producto: '',
    fecha_desde: '',
    fecha_hasta: '',
    oculto: 0
  };
  minDate2: any;
  maxDate: any;
  filtrarForm: FormGroup;
  constructor(
    private homeService: HomeService,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private atencionService: AppAtencionService,
    private errorService: AppErrorService,
    private alertService: AppAlertService
    ) { }

  ngOnInit() {
    this.filtrarForm = new FormGroup({
      selectedFecha1: new FormControl(this.filtro.fecha_desde),
      selectedFecha2: new FormControl(this.filtro.fecha_hasta)
    });
    this.esDadorCupo = localStorage.getItem("esDadorCupo") === '1' ? true : false;
    this.esClienteFinal = localStorage.getItem("esClienteFinal") === '1' ? true : false;
    if (!this.esDadorCupo && this.esClienteFinal) {
      this.paginator._intl.itemsPerPageLabel = "Solicitudes por Página";
      this.paginator._intl.nextPageLabel = "Siguiente";
      this.paginator._intl.firstPageLabel = "Primero";
      this.paginator._intl.lastPageLabel = "Último Cupo";
      this.paginator._intl.previousPageLabel = "Anterior";
      this.filtrarForm.controls['selectedFecha1'].setValue(this.filtro.fecha_desde);
      this.filtrarForm.controls['selectedFecha2'].setValue(this.filtro.fecha_hasta);
      this.getServerData(null);
    }
  }

  getServerData(event?: PageEvent) {
    let params = {
      page: 1,
      per_page: 50
    };
    if (event !== null) {
      params.page = event.pageIndex + 1;
      params.per_page = event.pageSize;
    }
    if (this.filtro.fecha_desde !== '') {
      this.filtro.fecha_desde = this.homeService.formatoFecha(this.filtro.fecha_desde, "amd", "-");
    }
    if (this.filtro.fecha_hasta !== '') {
      this.filtro.fecha_hasta = this.homeService.formatoFecha(this.filtro.fecha_hasta, "amd", "-");
    }
    this.loader.open();
    this.getItemSub = this.homeService.getSolicitudByDemandante(params, this.filtro)
      .subscribe(data => {
        this.loader.close();
        if (data.success) {

          //console.log(data.data);
          let sol:any[] = [];
          for( let i = 0; i < data.data.length ; i++ ){
            sol.push( data.data[i] );
            if( data.data[i].motivo != null ){
              let motivo = data.data[i].motivo.descripcion;
              sol[i].motivo = motivo;
              sol[i].motivos = 'SOLICITUD RECHAZADA' + ' - Motivo : ' + data.data[i].motivo + " - Comentario : " + data.data[i].comentario 
            } else {
              sol[i].motivos = "";
            }
            
          }
          console.log("New = ",sol);

          this.dataSource.data = sol;//data.data;
          //this.dataSource.data = data.data;
          //this.dataSource2.data = [];
          this.pageIndex = data._meta.currentPage - 1;
          this.pageSize = data._meta.perPage;
          this.totalSize = data._meta.totalCount;
        }
      },
      (err) => {
        this.loader.close();
        if (err.status === 422) {
          this.atencionService.confirm({
            message: err.message,
          });
        } else {
          this.errorService.confirm({ message: err }).subscribe((res) => {
            if (res) {
              return;
            }
          });
        }
      });
  }

  cargarDetalle(row): any {
    this.dataSource2.data = [];
    this.getItemSub = this.homeService.getDetalleSolicitud(row.id_demanda_cupo)
      .subscribe(data => {
        this.dataSource2.data = data.data;
      });
    return row;
  }

  isCustomizerOpen: boolean = false;
  updateFilter(event, param) {
    let val;
    if (param === 'fecha_desde') {
      this.minDate2 = event.value;
      val = event.target.value.toString().toLowerCase();
    } else {
      if (param === 'fecha_hasta') {
        this.maxDate = event.value;
        val = event.target.value.toString().toLowerCase();
      } else {
        val = event;
      }
    }
    eval('this.filtro.' + param + ' = val');
    if (!this.esDadorCupo && this.esClienteFinal) {
      this.getServerData(null);
    }
  }

  limpiarFiltros() {
    this.filtro.producto = '';
    this.filtro.fecha_desde = '';
    this.filtro.fecha_hasta = '';
    this.minDate2 = '';
    this.maxDate = '';
    this.filtrarForm.controls['selectedFecha1'].setValue(this.filtro.fecha_desde);
    this.filtrarForm.controls['selectedFecha2'].setValue(this.filtro.fecha_hasta);
    if (!this.esDadorCupo && this.esClienteFinal) {
      this.getServerData(null);
    }
  }

  ocultarMostrarSolicitud(solicitud, visible,event) {
    event.stopPropagation();
    let label = visible == 1 ? "ocultado" : "mostrado";
    this.loader.open();
    if (!this.esDadorCupo && this.esClienteFinal) {
      this.homeService.putDemandaCupo({ id_demanda: solicitud.id_demanda_cupo, oculto: visible })
        .subscribe(data => {
          this.loader.close();
            this.alertService
              .confirm({
                message: " Se ha " + label + " la solicitud!",
                tipo: "exito",
              })
              .subscribe((res1) => {
                this.getServerData(null);
              });
          },
          (err) => {
            this.loader.close();
            if (err.status === 422) {
              this.atencionService.confirm({
                message: err.message,
              });
            } else {
              this.errorService.confirm({ message: err }).subscribe((res) => {
                if (res) {
                  return;
                }
              });
            }
          }
        );
    }

  }

  onCheckboxChange(value) {
    this.filtro.oculto = (value === true) ? 1 : 0;
    if (!this.esDadorCupo && this.esClienteFinal) {
      this.getServerData(null);
    }
  }

  openPopUpChanceDemanda(row,event) {
    event.stopPropagation();

    let heightPopUp: string = '50vh';
    let title = "MODIFICAR CANTIDAD DE CUPOS";
    let fecha: any;
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      CambiarDemandaComponent,
      {
        width: "55vw",
        height: heightPopUp,
        disableClose: true,
        data: {
          title: title,
          payload: {demanda:row}
        }
      }
    );

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getServerData(null);
      }
      return;
    });
  }

}
