import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
  MatDialogRef,
  MatSnackBar,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  PageEvent,
  Sort,
} from "@angular/material";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { AppDateAdapter, APP_DATE_FORMATS } from "@shared/helpers/date.adapter";
import { BehaviorSubject, Observable, Subscription, of } from "rxjs";
import { HomeService } from "../../home/home.service";
import { CambiarDemandaComponent } from "../informacion-demanda/cambiar-demanda/cambiar-demanda.component";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { AppAtencionService } from "app/shared/services/app-atencion/app-atencion.service";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { AppAlertService } from "app/shared/services/app-alert/app-alert.service";
import { Cupo } from "app/shared/models/v2-disponibles";
import { DetalleConsolidadoComponent } from "../detalle-consolidado/detalle-consolidado.component";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}

export class Solicitud {
  fechaCupo: string;
  fechaHasta: string;
  id_demanda_cupo: number;
  id_demandante: number;
  observaciones: string;
  codigoCosecha: number;
  id_producto: number;
  asignado: number;
  id_gestiona: null;
  contrato: string;
  contraparte: null;
  cantidad: number;
  zona: string;
  fechaDesde: string;
  nombreDemandante: string;
  cuitDemandate: string;
  nombreDemandado: string;
  nombreProducto: string;
  nombreZonaSolicitud: null;
  nombreGestiona: string;
  alfanumerico: Alfanumerico[];
  nombreContraparte: string;
  enViaje: number;
  ctg: number;
  sin_ctg: number;
  en_destino: number;
  descargado: number;
  motivo: string;
  motivos: string;
}

export class Alfanumerico {
  id: number;
  id_cupo: number;
  dadorCuit: string | null;
  receptorCuit: string | null;
  primero: number | null;
  ultimo: number | null;
  vinculado: number | null;
  id_demanda: number | null;
  nroContrato: string | null;
  fecha: string | null;
  contraparte: string | null;
  caratula_mtr: string | null;
  id_caratula: string | null;
  caratula_mtr_original: string | null;
  canal: string | null;
  idCupoEstado: string | null;
  estadoCalculado: string | null;
  idCupoTerminal: string | null;

}

@Component({
  selector: "app-solicitudes-cupo",
  templateUrl: "./solicitudes-cupo.component.html",
  styleUrls: ["./solicitudes-cupo.component.scss"],
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
      ),
    ]),
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es-ES",
    },
  ],
})
export class SolicitudesCupoComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  minDate = new Date();
  solicitudes: Solicitud[] = [];
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  displayedColumns: string[] = [
    "first_color",
    "producto",
    "fechaCupo",
    "nombreDemandado",
    "contraparte",
    "cantidad",
    "asignado",
    "sin_ctg",
    "ctg",
    "en_destino",
    "descargados",
    "acciones",
  ];

  displayedColumns2: string[] = [
    "alfanumericoCupo",
    "cartaPorte",
    "fechaCupo",
    "estado_cupo",
    "estado_viaje",
    "nombre_destino",
    "nombre_chofer",
  ];
  expandedElement: PeriodicElement;
  public getItemSub: Subscription;
  resumenSolicitud: any;

  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Solicitudes Disponibles</span>
      </div>
    `,
  };
  filtro = {
    producto: "",
    fecha_desde: "",
    fecha_hasta: "",
    oculto: 0,
  };
  pageActual: PageEvent = new PageEvent();
  pageIndex: number;
  pageSize: number;
  totalSize: number;
  esDadorCupo: boolean;
  esClienteFinal: any;
  customSort: string;

  constructor(
    private homeService: HomeService,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private atencionService: AppAtencionService,
    private errorService: AppErrorService,
    private alertService: AppAlertService
  ) {
    this.pageActual.pageIndex = 0;
    this.pageActual.length = 0;
    this.pageActual.pageSize = 10;
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.customSort = '+cantidad'
    this.esDadorCupo =
      localStorage.getItem("esDadorCupo") === "1" ? true : false;
    this.esClienteFinal =
      localStorage.getItem("esClienteFinal") === "1" ? true : false;
    if (this.esDadorCupo && this.esClienteFinal) {
      this.paginator._intl.itemsPerPageLabel = "Solicitudes por Página";
      this.paginator._intl.nextPageLabel = "Siguiente";
      this.paginator._intl.firstPageLabel = "Primero";
      this.paginator._intl.lastPageLabel = "Último Cupo";
      this.paginator._intl.previousPageLabel = "Anterior";
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        const start = page * pageSize + 1;
        const end = (page + 1) * pageSize;
        return `${start} - ${end} de ${length}`;
      };
      this.getServerData(true, null);
    }
  }
  getServerData(load: boolean, event?: PageEvent) {
    let params = {
      page: 1,
      per_page: 10,
      sort: this.customSort
    };
    if (event !== null) {
      params.page = event.pageIndex + 1;
      params.per_page = event.pageSize;
    }
    this.pageActual.pageIndex = params.page;
    this.pageActual.pageSize = params.per_page;

    if (load) {
      this.loader.open();
    }
    this.getItemSub = this.homeService
      .getSolicitudByDemandante(params, this.filtro)
      .subscribe(
        (data) => {

          this.solicitudes = [];
          data.data.forEach((element) => {
            const solicitud = new Solicitud();
            solicitud.asignado = element.asignado;
            solicitud.cantidad = element.cantidad;
            solicitud.codigoCosecha = element.codigoCosecha;
            solicitud.contraparte = element.contraparte;
            solicitud.contrato = element.contrato;
            solicitud.cuitDemandate = element.cuitDemandate;
            solicitud.enViaje = element.enViaje;
            solicitud.fechaCupo = element.fechaCupo;
            solicitud.fechaDesde = element.fechaDesde;
            solicitud.fechaHasta = element.fechaHasta;
            solicitud.id_demanda_cupo = element.id_demanda_cupo;
            solicitud.id_demandante = element.id_demandante;
            solicitud.id_gestiona = element.id_gestiona;
            solicitud.id_producto = element.id_producto;
            solicitud.nombreContraparte = element.nombreContraparte ? element.nombreContraparte : '';
            solicitud.nombreDemandado = element.nombreDemandado ? element.nombreDemandado : '';
            solicitud.nombreDemandante = element.nombreDemandante;
            solicitud.nombreGestiona = element.nombreGestiona;
            solicitud.nombreProducto = element.nombreProducto;
            solicitud.nombreZonaSolicitud = element.nombreZonaSolicitud;
            solicitud.observaciones = element.observaciones;
            solicitud.sin_ctg = 0;
            solicitud.ctg = 0;
            solicitud.descargado = 0;
            solicitud.en_destino = 0;
            solicitud.alfanumerico = [];
            if (element.motivo != null) {
              solicitud.motivo = element.motivo.descripcion;
              solicitud.motivos = 'SOLICITUD RECHAZADA' + ' - Motivo : ' + solicitud.motivo + " - Comentario : " + element.comentario
            } else {
              solicitud.motivos = "";
            }
            if (element.alfanumerico != 'Sin asignar') {
              if (element.estadoCupo) {
                element.estadoCupo.forEach((cupo) => {
                  let newCupo = new Alfanumerico();
                  newCupo.id = cupo.id;
                  newCupo.id_cupo = cupo.id_cupo;
                  newCupo.dadorCuit = cupo.dadorCuit;
                  newCupo.receptorCuit = cupo.receptorCuit;
                  newCupo.primero = cupo.primero;
                  newCupo.ultimo = cupo.ultimo;
                  newCupo.vinculado = cupo.vinculado;
                  newCupo.id_demanda = cupo.id_demanda;
                  newCupo.nroContrato = cupo.nroContrato;
                  newCupo.fecha = cupo.fecha;
                  newCupo.contraparte = cupo.contraparte;
                  newCupo.caratula_mtr = cupo.caratula_mtr;
                  newCupo.id_caratula = cupo.id_caratula;
                  newCupo.caratula_mtr_original = cupo.caratula_mtr_original;
                  newCupo.canal = cupo.canal;
                  newCupo.idCupoEstado = cupo.idCupoEstado;
                  newCupo.idCupoTerminal = cupo.idCupoTerminal;
                  newCupo.estadoCalculado = "";
                  solicitud.alfanumerico.push(newCupo);
                });
              }
            }

            this.solicitudes.push(solicitud);
          });
          this.solicitudes.forEach((element) => {
            element.sin_ctg = 0;
            element.ctg = 0;
            element.descargado = 0;
            element.en_destino = 0;
            for (let index = 0; index < element.alfanumerico.length; index++) {
              const element1 = element.alfanumerico[index];
              if (element1.idCupoEstado == "1") {
                element.sin_ctg = element.sin_ctg + 1;
                element1.estadoCalculado = "sin_ctg";
                continue;
              }
              if (element1.idCupoEstado == "2") {
                element.ctg = element.ctg + 1;
                element1.estadoCalculado = "ctg";
                continue;
              }
              if (element1.idCupoEstado == "3") {
                element.descargado = element.descargado + 1;
                element1.estadoCalculado = "descargado";
                continue;
              }
              if (element1.idCupoEstado == "5") {
                element.en_destino = element.en_destino + 1;
                element1.estadoCalculado = "en_destino";
                continue;
              }
            }
          });
          this.dataSource.data = this.solicitudes;
          this.dataSource.sort = this.sort;
          this.dataSource2.data = [];

          this.pageIndex = data._meta.currentPage - 1;
          this.pageSize = data._meta.perPage;
          this.totalSize = data._meta.totalCount;
          this.loader.close();
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

  isCustomizerOpen: boolean = false;
  cargarDetalle(row): any {
    this.dataSource2.data = [];
    this.getItemSub = this.homeService
      .getDetalleSolicitud(row.id_demanda_cupo)
      .subscribe((data) => {
        this.dataSource2.data = data.data;
      });
    return row;
  }
  ocultarMostrarSolicitud(solicitud, visible, event) {
    event.stopPropagation();
    let label = visible == 1 ? "ocultado" : "mostrado";
    this.loader.open();
    if (this.esDadorCupo) {
      this.homeService
        .putDemandaCupo({
          id_demanda: solicitud.id_demanda_cupo,
          oculto: visible,
        })
        .subscribe(
          (data) => {
            this.loader.close();
            this.alertService
              .confirm({
                message: " Se ha " + label + " la solicitud!",
                tipo: "exito",
              })
              .subscribe((res1) => {
                this.getServerData(false, null);
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
    this.filtro.oculto = value === true ? 1 : 0;

    this.getServerData(true, null);
  }
  limpiarFiltros() {
    this.getServerData(true, null);
  }
  openPopUpChanceDemanda(row, event) {
    event.stopPropagation();

    let heightPopUp: string = "55vh";

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
          payload: { demanda: row },
        },
      }
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getServerData(false, null);
      }

      return;
    });
  }

  cargarAlfanumerico(valor, row, recupera?: boolean) {
    let someCupos: Cupo[] = [];
    let title = valor;
    let sin_ctg = false;
    let usaCupera = localStorage.getItem("usaCupera") == "2" ? true : false;
    switch (valor) {
      case "total":
        someCupos = row.alfanumerico;
        title = " Todos los cupos";
        break;
      case "ctg":
        someCupos = row.alfanumerico.filter(
          (item) => item.estadoCalculado === "ctg"
        );
        title = " Estado CTG";
        break;
      case "sin_ctg":
        someCupos = row.alfanumerico.filter(
          (item) => item.estadoCalculado === "sin_ctg"
        );
        title = " Sin CTG";
        sin_ctg = true;
        break;
      case "en_destino":
        someCupos = row.alfanumerico.filter(
          (item) => item.estadoCalculado === "en_destino"
        );
        title = "En Destino";
        break;
      case "descargado":
        someCupos = row.alfanumerico.filter(
          (item) => item.estadoCalculado === "descargado"
        );
        title = " Descargados";
        break;
      default:
        break;
    }
    if (someCupos.length > 0) {
      let heightPop: number = 30 + someCupos.length * 10;
      if (valor == "sin_ctg") {
        heightPop = heightPop + (usaCupera ? 10 : 20);
      }
      let heightPopUp: number = 50;
      if (heightPop > 80) heightPopUp = 80;
      else heightPopUp = heightPop;
      let fecha: any;
      let dialogRef: MatDialogRef<any> = this.dialog.open(
        DetalleConsolidadoComponent,
        {
          width: "55vw",
          height: heightPopUp.toString() + "vh",
          disableClose: true,
          data: {
            title: title,
            cupera: usaCupera ? 2 : 1,
            payload: {
              cupos: someCupos,
              height: heightPopUp,
              sinCtg: sin_ctg,
              recupera: recupera,
            },
          },
        }
      );
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          return;
        } else {
          //Llamar para refrescar los datos
        }
        return;
      });
    }
  }

  customSortVoid(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return
    }
    this.pageActual.pageIndex--;
    this.customSort = (sort.direction == "asc" ? '+' : '-') + sort.active;
    this.getServerData(true, this.pageActual)

  }
}
