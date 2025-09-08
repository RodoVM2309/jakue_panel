import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatPaginator,
  MatSort,
  MatDialogRef,
  MatDialog,
  MatSnackBar,
} from "@angular/material";
import { CupoVinculado } from "../../../models/cupoViculado";
import { Product } from "../../../models/product.model";
import { HomeService } from "../home.service";
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import {
  tap,
} from "rxjs/operators";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material";
import { NomencladoresService } from "../../../../shared/services/nomencladores.service";
import { MapaCuposVinculadosComponent } from "./mapa-cupos-vinculados/mapa-cupos-vinculados.component";
import { AppLoaderService } from "../../../../shared/services/app-loader/app-loader.service";
import { AppAtencionService } from "../../../services/app-atencion/app-atencion.service";
import { AddSmsComponent } from "../asignar-viaje/add-sms/add-sms.component";
import { SendsmsService } from "../../../../shared/services/sendsms.service";
import { BehaviorSubject, Observable, Subscription, of } from "rxjs";
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { catchError, finalize } from "rxjs/operators";
import { Cupo } from "app/shared/models/cupo";
import { DetalleCupoComponent } from './detalle-cupo/detalle-cupo.component'

import * as moment from "moment";
import { CentroProductoService } from "@app/shared/services";
@Component({
  selector: "app-cupos-vinculados",
  templateUrl: "./cupos-vinculados.component.html",
  styleUrls: ["./cupos-vinculados.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es-AR"
    }
  ]
})
export class CuposVinculadosComponent implements OnInit {
  cuposVinculados: CupoVinculado[] = [];
  filtrarForm: FormGroup;
  productos: Product[];
  seleccionados = [];
  isCustomizerOpen2: boolean = false;
  now = new Date;
  public getItemSub: Subscription;
  dataSource: CupoDataSource;
  displayedColumns: string[] = [
    "first_color",
    "alfanumericoCupo",
    "nombreChofer",
    "nombreDestino",
    "destinatarioCuit",
    "cartaPorte",
    "corredorCuit",
    "entregadorNombre",
    "estado",
    "producto",
    "fecha",
    "distancia",
    "mapa",
    "acciones"
  ];
  filtros_especiales = [{ id: 1, tipo: "Vencidos" }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Cupos Vinculados</span>
      </div>
    `
  };
  filtro = {
    id_producto: null,
    fechaCupo: '',
    alfanumericoCupo: "",
    nombreChofer: "",
    nombreDestino: "",
    destinatarioCuit: "",
    cartaPorte: "",
    corredorCuit: "",
    entregadorCuit: "",
    nombreEstadoCupo: "",
    vencido: 0
  };
  public pageSize = 50;
  public totalSize = 0;
  filtroespeciales = [];
  esDadorCupo: string = '';
  esClienteFinal: string = '';
  showTable: boolean = false;
  constructor(
    private homeService: HomeService,
    private nomencladoresService: NomencladoresService,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private centroProductoService: CentroProductoService
  ) { }

  ngOnInit() {
    this.filtrarForm = new FormGroup({
      selectedProducto: new FormControl(this.filtro.id_producto),
      selectedFecha: new FormControl(this.now)
    });
    this.esDadorCupo = localStorage.getItem("esDadorCupo");
    this.esClienteFinal = localStorage.getItem("esClienteFinal");
    if (this.esDadorCupo === '1' || this.esClienteFinal === '1') {
      this.showTable = true;
      this.dataSource = new CupoDataSource(this.homeService, this.loader);
      this.dataSource.loadCuposVinculados(this.filtro);
      this.getCuposVinculados();
      this.getItemsProductos();
      this.paginator._intl.itemsPerPageLabel = "Cupos por Página";
      this.paginator._intl.nextPageLabel = "Siguiente";
      this.paginator._intl.firstPageLabel = "Primero";
      this.paginator._intl.lastPageLabel = "Último Cupo";
      this.paginator._intl.previousPageLabel = "Anterior";
    }


  }
  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadCuposPages())).subscribe();
  }

  loadCuposPages() {
    this.dataSource.loadCuposVinculados(
      this.filtro,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize
    );
    this.getCuposVinculados();
  }
  gotoRefresh() {
    this.dataSource.loadCuposVinculados(this.filtro);
    this.getCuposVinculados();
  }

  getCuposVinculados() {
    this.getItemSub = this.homeService
      .getCuposVinculados(
        this.filtro,
        this.paginator.pageIndex,
        this.paginator.pageSize
      )
      .subscribe(data => {
        this.totalSize = data._meta.totalCount;
        //this.iterator();
        //this.dataSource.sort = this.sort;
      });
  }

  getItemsProductos() {
    this.centroProductoService.getCentroProducto().subscribe((productos) => {
      this.productos = productos.data;
    });

  }

  gotoMapaCupo(data: any = {}) {
    let das = data;
    let title = "Mostrar Mapa";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      MapaCuposVinculadosComponent,
      {
        width: "90vw",
        height: "93vh",
        disableClose: false,
        data: { title: title, payload: data }
      }
    );
    dialogRef.afterClosed().subscribe(res => { });
  }

  openPopUpwhatsapp(data: any = {}) {
    const title = "Mensaje Whatsapp al Chofer";
    const dialogRef: MatDialogRef<any> = this.dialog.open(AddSmsComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: data }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      const newString = res.mensaje.replace("", "%20");
      window.open(
        "https://web.whatsapp.com/send?phone=+549" +
        res.celular +
        "&text=" +
        newString,
        "_blank"
      );
    });
  }

  openPopUpsms(data: any = {}) {
    const title = "Mensaje SMS a Choferes";
    const dialogRef: MatDialogRef<any> = this.dialog.open(AddSmsComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: data }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      return;

    });
  }
  openPopUpInfoCupo(data: any = {}) {
    let title = 'Información de Cupo';
    let dialogRef: MatDialogRef<any> = this.dialog.open(DetalleCupoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: { id: data.id_cupo } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }
  aplicarFiltro(valor, cmp) {
    switch (valor) {
      case "fechaCupo":
        this.filtro.fechaCupo = this.homeService.formatoFecha(
          cmp.value,
          "amd",
          "-"
        );
        break;
      case "id_producto":
        this.filtro.id_producto = cmp.value;
        break;
      case "alfanumericoCupo":
        this.filtro.alfanumericoCupo = cmp.target.value;
        break;
      case "nombreChofer":
        this.filtro.nombreChofer = cmp.target.value;
        break;
      case "nombreDestino":
        this.filtro.nombreDestino = cmp.target.value;
        break;
      case "destinatarioCuit":
        this.filtro.destinatarioCuit = cmp.target.value;
        break;
      case "cartaPorte":
        this.filtro.cartaPorte = cmp.target.value;
        break;
      case "corredorCuit":
        this.filtro.corredorCuit = cmp.target.value;
        break;
      case "entregadorCuit":
        this.filtro.entregadorCuit = cmp.target.value;
        break;
      case "nombreEstadoCupo":
        this.filtro.nombreEstadoCupo = cmp.target.value;
        break;
    }
    this.loadCuposPages();
  }
  updateFilter2(event) {
    const valores = event.value;
    this.filtro.vencido = 0;
    this.filtroespeciales = valores;
    for (let i = 0; i < valores.length; i++) {
      switch (valores[i]) {
        case 1: // Pendientes por asignar
          this.filtro.vencido = 1;
          // arraytemp = this.conocerPendientesAsignar(arraytemp);
          break;
        /* case 2: // Pedidos en rojo
          this.filtro.pedidos_rojos = 1;
          //  arraytemp = this.conocerPedidosEnRojo(arraytemp);
          break;
        case 3: // En tiempo
          this.filtro.en_tiempo = 1;
          //  arraytemp = this.conocerPedidosEnTiempo(arraytemp);
          break;
        case 4: // Fuera de tiempo
          this.filtro.fuera_tiempo = 1;
          //  arraytemp = this.conocerPedidosFueraTiempo(arraytemp);
          break;
        case 5: // Pedidos cerrados
          this.filtro.pedidos_cerrados = 1;
          break; */
        case 6: // Pedidos en difusion
          this.filtro.vencido = 0;
          break;
      }
    }
    this.loadCuposPages();
  }

  limpiarFiltros() {
    this.filtro = {
      id_producto: null,
      fechaCupo: "",
      alfanumericoCupo: "",
      nombreChofer: "",
      nombreDestino: "",
      destinatarioCuit: "",
      cartaPorte: "",
      corredorCuit: "",
      entregadorCuit: "",
      nombreEstadoCupo: "",
      vencido: 0
    };
    this.filtrarForm.controls["selectedProducto"].setValue("");
    this.filtrarForm.controls["selectedFecha"].setValue("");
    this.loadCuposPages();
  }
}

export class CupoDataSource implements DataSource<Cupo> {
  private cuposSubject = new BehaviorSubject<Cupo[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private homeService: HomeService,
    private loader: AppLoaderService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<Cupo[]> {
    return this.cuposSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.cuposSubject.complete();
    this.loadingSubject.complete();
  }

  loadCuposVinculados(filter = {}, pageIndex = 1, pageSize = 5) {
    this.loadingSubject.next(true);

    this.homeService
      .getCuposVinculados(filter, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(cupos => {
        this.cuposSubject.next(cupos.data);
      });
  }
}
