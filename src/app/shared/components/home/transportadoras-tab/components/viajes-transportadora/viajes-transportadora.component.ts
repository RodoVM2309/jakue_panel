import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DATE_FORMATS, MAT_DATE_LOCALE, PageEvent } from '@angular/material';
import { AddPedidoRapidoComponent } from '@app/shared/components/cupo/add-pedido-rapido/add-pedido-rapido.component';
import { AppDateAdapter, APP_DATE_FORMATS } from '@app/shared/helpers/date.adapter';
import { AppAtencionService, AppConfirmService, AppErrorService, AppLoaderService, CentroProductoService, ExelService, NomencladoresService, UserService } from '@app/shared/services';
import { DateAdapter } from 'saturn-datepicker';
import { HomeService } from '../../../home.service';
import { TransportadoraService } from '../../services/transportadora.service';

import { createForm, getProductos } from './functions';
import { Viaje } from './models/viaje';
import { Variables } from './variables';
import * as moment from "moment";

@Component({
  selector: 'app-viajes-transportadora',
  templateUrl: './viajes-transportadora.component.html',
  styleUrls: ['./viajes-transportadora.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
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
      useValue: "es-ES"
    }
  ]
})
export class ViajesTransportadoraComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  now = moment(new Date()).format("YYYY-MM-DD");
  yesterday = moment(new Date()).clone().subtract(1, 'days').format("YYYY-MM-DD");
  variables = new Variables();
  dataSource = new MatTableDataSource<Viaje>();
  displayedColumns: string[] = [
    "copiar",
    "idCupoTerminal",
    "destino",
    "producto",
    "proveedor",
    "chofer",
    "acciones",
    "voucher",
  ];
  constructor(
    private userService: UserService,
    private centroProductoService: CentroProductoService,
    private homeService: HomeService,
    private fb: FormBuilder,
    private excelService: ExelService,
    private transportadoraService: TransportadoraService,
    private loader: AppLoaderService,
    private atencionService: AppAtencionService,
    private errorService: AppErrorService,
    private dialog: MatDialog,
    private confirmService: AppConfirmService,
    private nomencladoresService: NomencladoresService,
  ) {
    this.variables.pageEvent.pageIndex = 0;
    this.variables.pageEvent.pageSize = 10;
  }

  ngOnInit() {
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
      .subscribe(data => this.variables.idCentro = data.data);
    createForm(this.variables, this.fb);
    this.getItems();
    this.paginator._intl.itemsPerPageLabel = "Por páginas:";
    this.paginator._intl.nextPageLabel = "Siguiente";
    this.paginator._intl.firstPageLabel = "Primero";
    this.paginator._intl.lastPageLabel = "Último";
    this.paginator._intl.previousPageLabel = "Anterior";
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} de ${length}`;
    };
  }

  gotoRefresh() {
    this.getServerData(null);
  }
  getItems() {
    getProductos(this.variables, this.centroProductoService, this.f);
    this.getFilter();
    this.getServerData(null);
  }
  getFilter() {
    this.variables.filtro.id_producto = this.f.selectedProducto.value;
    this.variables.filtro.fecha = this.homeService.formatoFecha(
      this.f.selectedFecha.value,
      "amd",
      "-"
    );
  }
  getServerData(event?: PageEvent) {
    if (event) {
      this.variables.pageEvent = event;
    } else {
      this.variables.pageEvent.pageIndex = 0;
    }

    //  this.loader.open();
    this.variables.getItemSub = this.transportadoraService.getViajes(this.variables.filtro, this.variables.pageEvent)
      .subscribe(data => {
        this.loader.close();
        this.variables.viajes = data.data;
        this.dataSource.data = this.variables.viajes;//data.data;
        this.variables.pageEvent.length = data._meta.totalCount;
        //  this.page.pageNumber = pagedData._meta.currentPage - 1;
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

  get f() {
    return this.variables.filtrarForm.controls;
  }
  aplicarFiltro(valor, cmp) {
    switch (valor) {
      case "fechaCupo":
        this.variables.filtro.fecha = this.homeService.formatoFecha(
          cmp.value,
          "amd",
          "-"
        );
        break;
      case "id_producto":
        this.variables.filtro.id_producto = cmp.value;
        break;

    };
    this.getServerData(null);
    //this.isFilter = true;
    //this.loadCuposPages();
    // this.obtenerCuposDisponibles();
  }


  limpiarFiltros() {
    this.variables.filtro.id_producto = null;
    this.variables.filtro.fecha = "";
    this.variables.filtrarForm.controls["selectedProducto"].setValue("");
    this.variables.filtrarForm.controls["selectedFecha"].setValue(new Date());
    //this.loadCuposPages();
  }

  messageUpdateText(data) {
    let text = "";
    for (let val of data) {
      text += val.id_cupoEstado === '1' ? `El cupo ${val.id_cupoTerminal} se encuentra ASIGNADO A UN CHOFER. ` + '<br>' : ` `;
      text += val.id_cupoEstado === '2' ? `El cupo ${val.id_cupoTerminal} se encuentra CARGADO. ` + '<br>' : ` `;
      text += val.id_cupoEstado === '3' ? `El cupo ${val.id_cupoTerminal} se encuentra DESCARGADO. ` + '<br>' : ` `;
      text += val.id_cupoEstado === '4' ? `El cupo ${val.id_cupoTerminal} se encuentra RECHAZADO. ` + '<br>' : ` `;
      text += val.id_cupoEstado === '5' ? `El cupo ${val.id_cupoTerminal} se encuentra EN DESTINO. ` + '<br>' : ` `;
    }

    this.confirmService
      .confirm({
        message: text
      }).subscribe(res => {
        this.gotoRefresh();
      });
  }

  async pedidoRapido(row, accion) {
    let listCupos = [];
    listCupos.push({
      id: row.id
    });
    
    try {
      let response = await this.nomencladoresService.getValidateCupo(listCupos, accion).toPromise();
      console.log(response)
    } catch (error) {
      console.log(error)
      this.messageUpdateText(error["error"].data)
      return false
    }

    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AddPedidoRapidoComponent,
      {
        width: "720px",
        height: "99vh",
        disableClose: true,
        data: {
          cupo: row.id,
          isUpdate: false,
          id_cupo_terminal: "",
          id_destino: row.destino.id,
          dador_turno_destino: row.destino.dador_turno_destino,
          id_origen: row.origen ? Number(row.origen.id) : null,
          origen_descripcion: row.origen ? row.origen.descripcion : null,
          isProveedor: false,
          es_derivacion: false
        }
      }
    );
    dialogRef.afterClosed().subscribe(res => {
      this.getServerData(null);
      return;
    });
  }

  async goUpdatePedido(cupo, accion) {
    let listCupos = [];
    listCupos.push({
      id: cupo.id
    });

    try {
      let response = await this.nomencladoresService.getValidateCupo(listCupos, accion).toPromise();
      console.log(response)
    } catch (error) {
      console.log(error)
      this.messageUpdateText(error["error"].data)
      return false
    }

    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AddPedidoRapidoComponent,
      {
        width: "720px",
        height: " 90vh",
        disableClose: true,
        data: {
          cupo: cupo.id,
          isUpdate: true,
          cuitChofer: cupo.cuitChofer,
          idViaje: cupo.en_viaje,
          id_cupo_terminal: cupo.idCupoTerminal,
          id_origen: cupo.origen ? Number(cupo.origen.id) : null,
          origen_descripcion: cupo.origen ? cupo.origen.descripcion : null,
          isProveedor: false,
          es_derivacion: false,
          id_destino: cupo.destino.id,
          dador_turno_destino: cupo.destino.dador_turno_destino,
          turno: cupo.id_turno
        }
      }
    );
    dialogRef.afterClosed().subscribe(res => {
      this.getServerData(null);
      return;
    });
  }

  copyTextToClipboard(text) {
    const txtArea = document.createElement("textarea");
    txtArea.id = 'txt';
    txtArea.style.position = 'fixed';
    txtArea.style.top = '0';
    txtArea.style.left = '0';
    txtArea.style.opacity = '0';
    txtArea.value = text;
    document.body.appendChild(txtArea);
    txtArea.select();
    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      if (successful) {
        return true;
      }
    } catch (err) {
    } finally {
      document.body.removeChild(txtArea);
    }
    return false;
  }
  descargarVoucher(cupo) {
    this.excelService.getVoucher(cupo.id).subscribe(image => {
      const url = URL.createObjectURL(new Blob([image]));
      const link = document.createElement('a');
      link.href = url;
      link.download = cupo.nombreChofer + ' - ' + cupo.idCupoTerminal + '.jpeg';
      link.click();
    });
  }


}

