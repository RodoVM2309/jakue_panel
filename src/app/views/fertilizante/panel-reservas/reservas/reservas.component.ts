import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  OnDestroy,
  AfterViewInit,
  ViewChildren,
  QueryList,
  EventEmitter,
  Output,
  Input,
} from "@angular/core";
import {
  MatDialogRef,
  MatDialog,
  PageEvent,
  MatPaginator,
  MatPaginatorIntl,
} from "@angular/material";

import { Subscription } from "rxjs";

import { ReservasService } from "app/shared/services/reservas.service";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { DetalleReservasComponent } from "../detalle-reservas/detalle-reservas.component";
import { HomeService } from "app/shared/components/home/home.service";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { ExelService } from "app/shared/services/exel.service";
import { Page } from "app/shared/models/page";
import { DetalleReserva } from "@app/shared/models/fertilizantes.model";
import { CustomPaginator } from "app/shared/helpers/CustomPaginatorConfiguration";

export interface CabeceraDespacho {
  item: string[];
  class: string;
}
export interface DatosReserva {
  id_cliente: string;
  id_pedido: string;
  fecha_desde: string;
  grupo_cliente: string;
  cliente: string;
  zona: string;
  tipos: Tipo[];
  recibidas: number;
  procesadas: number;
}

export interface Tipo {
  recibidas: string;
  procesadas: string;
}

@Component({
  selector: "app-reservas",
  templateUrl: "./reservas.component.html",
  styleUrls: ["./reservas.component.scss"],
  providers: [{ provide: MatPaginatorIntl, useValue: CustomPaginator() }],
})
export class ReservasComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() page_actual: EventEmitter<number> = new EventEmitter();

  public fechaModificada: string = "";
  subcriptiondataReservas: Subscription;
  despachos = [];
  cupo = [];
  array_exp = [];
  now = new Date();
  pageCount = 0;
  totalCount = 0;
  pageEvent: PageEvent;
  page = new Page();
  filtros: any;
  detalleReserva: DetalleReserva;

  reservas: DatosReserva[] = [];

  constructor(
    private dialog: MatDialog,
    private reservasService: ReservasService,
    private loader: AppLoaderService,
    private homeService: HomeService,
    private errorService: AppErrorService,
    private excelService: ExelService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.cargaIncial();
    this.filtroEmitido();
  }

  openPopupResevas(data: any, estado) {
    this.loader.open();
    let detalleReserva = {
      id_cuenta_cliente: data["id_cliente"],
      id_origen: this.filtros["id_origen"],
      fecha: this.filtros["fecha"],
      id_pedido: "", //en esta caso va vacio para que muestre todos los pedidos
      estado: estado,
    };
    this.reservasService.detalleReservas(detalleReserva).subscribe((resp) => {
      const dialogRef: MatDialogRef<any> = this.dialog.open(
        DetalleReservasComponent,
        {
          width: "90%",
          height: "90%",
          disableClose: true,
          data: { title: "title", payload: resp, estado, isNew: "isNew" },
        }
      );
      this.loader.close();
    });
  }

  ngOnDestroy() {
    this.subcriptiondataReservas.unsubscribe();
  }

  cargaIncial() {
    this.loader.open();
    // Armo la cabecera
    this.reservasService.capacidadTerminal().subscribe((resp) => {
      this.despachos = Object.values(resp.despachos);
      this.loader.close();
    });
    this.subcriptiondataReservas = this.reservasService.dataReservas$.subscribe(
      (result) => {
        this.reservas = [];
        result.data.forEach((resp) => {
          let tiposArray: Tipo[] = [];
          let total_recibidas = 0;
          let total_procesadas = 0;
          this.despachos.forEach((despacho) => {
            let tipoDR =
              despacho.toLowerCase() != "costado vapor"
                ? despacho.toLowerCase() + "_reservas"
                : "costado_vapor_reservas";
            let tipoDC =
              despacho.toLowerCase() != "costado vapor"
                ? despacho.toLowerCase() + "_cupos"
                : "costado_vapor_cupos";
            let tipo: Tipo = {
              recibidas: resp[tipoDR],
              procesadas: resp[tipoDC],
            };
            total_recibidas += parseInt(resp[tipoDR]);
            total_procesadas += parseInt(resp[tipoDC]);
            //console.log({total_recibidas,total_procesadas});
            tiposArray.push(tipo);
          });
          let reserva: DatosReserva = {
            cliente: resp.cliente,
            id_cliente: resp.id_cliente,
            grupo_cliente: resp.grupo_cliente,
            zona: resp.zona,
            recibidas: total_recibidas,
            procesadas: total_procesadas,
            fecha_desde: resp.fecha_desde,
            id_pedido: resp.id_pedido,
            tipos: tiposArray,
          };
          this.reservas.push(reserva);
        });
        this.pageCount = result._meta.pageCount;
        this.totalCount = result._meta.totalCount;
      }
    );
  }

  filtroEmitido() {
    this.subcriptiondataReservas = this.reservasService.filtros$.subscribe(
      (resp) => {
        this.filtros = resp;
      }
    );
  }
  getServerData(event) {
    let pagina: number = event.pageIndex;
    this.page_actual.emit(pagina);
  }
  exportarResevas() {
    if (!this.reservas.length) {
      this.errorService.confirm({
        message: "No existen Reservas a exportar",
      });
    } else {
      this.fechaModificada = this.homeService.formatoFecha(
        this.now,
        "amd",
        "_"
      );
      this.excelService.exportAsExcelFile(
        this.reservas,
        `${this.fechaModificada}_Reservas`
      );
    }
  }
}
