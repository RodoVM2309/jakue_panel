import { Component, OnInit, Inject, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  PageEvent,
  MatSort,
  MatTableDataSource,
  MatDialogRef,
  MatDialog,
} from "@angular/material";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  SatDatepickerModule,
} from "saturn-datepicker";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

import * as moment from "moment";
import { SatDatepicker } from "saturn-datepicker";
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

//Modelos
import { Cliente, GrupoCliente } from 'app/shared/models/monitor-comercial';
import { ZonaCliente } from 'app/shared/models/zona';
import { ComboSelect, SeguimientoTerminal } from 'app/shared/models/seguimiento';
import { SeguimientoDB } from 'app/shared/inmemory-db/segimiento';

import { ReservasService } from 'app/shared/services/reservas.service';
import { FertilizantesService } from 'app/shared/services/fertilizantes.service';
import { DetalleProductoRP, ProductoFertilizante, ProductoMulti, TipoDespacho, TiposDespachos } from '@app/shared/models/fertilizantes.model';



import { Puerto } from 'app/shared/models/puerto';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Productos } from 'app/shared/models/horario-fertilizantes';

import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { Page } from 'app/shared/models/page';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { ExelService } from 'app/shared/services/exel.service';
import { HomeService } from 'app/shared/components/home/home.service';
import { DetalleReserva } from '@app/shared/models/fertilizantes.model';
import { ComercialSeguimientoDetalleReservasComponent } from './comercial-seguimiento-detalle-reserva/comercial-seguimiento-detalle-reserva.component';

// Solo para pruebas
const ELEMENT_DATA: SeguimientoTerminal[] = [];
@Component({
  selector: 'app-comercial-seguimiento',
  templateUrl: './comercial-seguimiento.component.html',
  styleUrls: ['./comercial-seguimiento.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MAT_MOMENT_DATE_FORMATS,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es-ES",
    },
  ],
})
export class ComercialSeguimientoComponent implements OnInit {
  filtrosForm: FormGroup;
  public fechaModificada: string = "";

  subcriptiondataReservas: Subscription;

  now = new Date();

  /* Declaraciòn de filtros inicial */
  primerDia;
  ultimoDia;
  selectedZona = 0;
  selectedProducto = 0;
  selectedTipoDespacho = 0;
  selectedEstado = 0;
  listadoTerminalCarga: Puerto[] = [];
  listadoDespachos: TipoDespacho[] = [
    {
      id: 0,
      descripcion: 'Todos',
      forma: ''
    },
  ];
  listadoZonas: ZonaCliente[] = [
    {
      id: 0,
      descripcion: 'Todos'
    },
  ];
  listadoGrupoClientes: GrupoCliente[] = [];
  listadoProductos: ProductoMulti[] = [
    {
      value: 0,
      display: 'Todos'
    }
  ];
  estados = [
    {
      id: 0,
      descripcion: 'Todos'
    },
    {
      id: 1,
      descripcion: 'Pendiente'
    },
    {
      id: 2,
      descripcion: 'Procesados'
    }
  ];
  totalCamiones = 0;
  totalTn = 0;
  /* Declaraciòn de filtros inicial */

  /* Configuracion de tabla */
  displayedColumns: string[] = [
    //'id_cuenta_cliente',
    'fecha',
    'fecha_solicitud',
    'reserva',
    'terminal',
    'tipo_despacho',
    'zona',
    'cliente',
    'producto',
    'tn',
    'nombre_chofer',
    'cupo',
    'terminal_cupo',
    'fecha_cupo',
    'turno',
    'fecha_arribo',
    'estado',
  ];

  data = new SeguimientoDB();
  selectedTerminal = "";
  dataSource = new MatTableDataSource<SeguimientoTerminal>();
  /* Configuracion de tabla */

  filtros : any;
  detalleReserva : DetalleReserva ;

  /* Declaración de eventos */
  subscriptions: Subscription = new Subscription();
  pageEvent: PageEvent = new PageEvent();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("picker") dateRange: SatDatepicker<any>;
  filteredOptions: Observable<ProductoFertilizante[]>;
  public pageSize = 10;
  public totalSize = 0;
  public pageIndex = 0;
  /* Declaración de eventos */
  chancedDate: boolean = true;
  habilitarButton: boolean = false;

  constructor(
    private fb: FormBuilder,
    private fertilizantesService: FertilizantesService,
    private reservasService: ReservasService,
    private loader: AppLoaderService,
    private homeService: HomeService,
    private errorService: AppErrorService,
    private excelService: ExelService,
    private dialog: MatDialog,
  ) {

  }



  ngOnInit() {
    //this.loadData();
    this.getTerminalCarga();
    this.getTipoDespacho();
    this.getZonas();
    this.getGrupoClientes();
    this.getProductos();
    this.primerDia = moment().format("YYYY-MM-DD");
    this.ultimoDia = '';
    this.buildItemForm();
    this.filtroEmitido();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Registros por Página:';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primera';
    this.paginator._intl.lastPageLabel = 'Última';
    this.paginator._intl.previousPageLabel = 'Anterior';
  }

  buildItemForm() {
    this.filtrosForm = this.fb.group({
      rango_fecha: [{
        begin: new Date(this.primerDia + " 12:00:00"),
        end: new Date(this.primerDia + " 12:00:00"),
      }, Validators.required],
      id_terminal: ['', Validators.required],
      id_tipo: [[0]],
      id_zona: [''],
      id_grupo_cliente: [''],
      id_producto: [[0]],
      id_reserva: [''],
      cliente: [''],
      id_estado: [[0]],
    })
  }

  /* Terminal de carga */
  getTerminalCarga() {
    this.fertilizantesService.getFetilizantesOrigen(true)
      .subscribe(resp => {
        if (resp) {
          this.listadoTerminalCarga = resp.data;
        }
      });
  }
  onChange(ev: MatSelectChange) {
    this.selectedTerminal = (ev.source.selected as MatOption).viewValue;
    this.habilitarButtonBuscar();
  }
  /* Terminal de carga */

  getTipoDespacho() {
    this.subscriptions.add(this.fertilizantesService.getTipoDespacho().subscribe(resp => {
      if (resp) {
        resp.data.forEach((element) => {
          this.listadoDespachos.push(element);
        });
      }
    }));
  }
  /* Tipo de despacho */

  /* Zonas */
  getZonas() {
    this.reservasService.getSelectZonasClientes()
      .subscribe(resp => {
        if (resp) {
          this.listadoZonas = resp;
          this.listadoZonas.unshift({ id: 0, descripcion: 'Todos' });
        }
      });
  }
  /* Zonas */

  /* Grupo de Clientes */
  getGrupoClientes() {
    this.reservasService.getGrupoClientes()
      .subscribe(resp => {
        if (resp) {
          this.listadoGrupoClientes = resp;
          this.filtrosForm.controls['id_grupo_cliente'].setValue(resp[0].id);
        }
      });
  }
  /* Grupo de Clientes */

  /* Productos */
  getProductos() {
    this.subscriptions.add(this.fertilizantesService.getProductosFertilizantes()
      .subscribe(resp => {
        if (resp) {
          resp.data.map(tipo => {
            let producto = {
              display: tipo.descripcion,
              value: tipo.id
            };
            this.listadoProductos.push(producto);
          });
        }
      }));
  }
  /* Productos */

  getServerData(event?: PageEvent) {
    if (event !== null) {
      event.pageIndex++;
    }
    this.submit(event);
  }

  filtroEmitido(){
    this.subcriptiondataReservas =  this.reservasService.filtros$.subscribe( resp => {
      this.filtros = resp;
    });
  }

  cambioRangoFecha() {
    const start = this.dateRange.beginDate;
    const end = this.dateRange.endDate;
    const daterange = { start: start, end: end };
    const dif = moment(new Date(end)).diff(new Date(start), "days");
    if (dif > 5) {
      this.filtrosForm.controls["rango_fecha"].setErrors({
        rango: true,
      });
    } else {
      let newprimerDia = this.homeService.formatoFecha(start, "amd", "-");
      let newultimoDia = this.homeService.formatoFecha(end, "amd", "-");
      let cambioPrimerDia = newprimerDia !== this.primerDia ? true : false;
      let cambioUltimoDia = newultimoDia !== this.ultimoDia ? true : false;
      if (cambioPrimerDia || cambioUltimoDia) {
        this.chancedDate = true;
        this.primerDia = newprimerDia;
        this.ultimoDia = newultimoDia;
      } else {
        this.chancedDate = false;
      }
    }
    this.habilitarButtonBuscar();
  }

  habilitarButtonBuscar(){
    (!!this.selectedTerminal
      && !this.filtrosForm.controls['rango_fecha'].hasError('rango')) ?
      this.habilitarButton = true :
      this.habilitarButton = false
  }

  submit(params: PageEvent) {
    if (!this.filtrosForm.invalid) {
      this.loader.open();
      this.reservasService.comercialSeguimientoFiltros(this.filtrosForm.value, params.pageIndex, params.pageSize).subscribe(resp => {
        this.loader.close();
        this.totalTn = 0;

        resp.data.forEach(sumatoria => {
          this.totalTn += Number(sumatoria['tn']);
        });

        this.totalCamiones = resp.data.length;

        if (resp.success) {
          this.dataSource = resp.data;

          this.pageEvent.length = resp._meta.totalCount;
          this.pageEvent.pageSize = resp._meta.perPage;
          this.pageEvent.pageIndex = resp._meta.currentPage - 1;
          this.pageIndex = resp._meta.currentPage - 1;
          this.pageSize = resp._meta.perPage;
          this.totalSize = resp._meta.totalCount;
        }

      });
    }

  }

  exportarInfo() {
    this.reservasService.exportarDatosComercialSeguimiento(this.filtrosForm.value).subscribe(resp => {
      if (resp.length == 0) {
        this.errorService.confirm({
          message:
            "No existen Datos a exportar"
        });
      } else {
        this.fechaModificada = this.homeService.formatoFecha(this.now, "amd", "_");
        let hora = this.homeService.formatoHora(this.now);
        this.excelService.exportAsExcelFile(resp, `${this.fechaModificada}_${hora}_SEGUIMIENTO_COMERCIAL`);
      }
    });

  }

  openPopupReservas(data:any) {
    this.loader.open();

    let detalleReserva = {
      id_reserva: data.reserva,
      id_cuenta_cliente: data['id_cuenta_cliente'] ? data['id_cuenta_cliente'] : "",
      id_origen        : this.filtrosForm.get("id_terminal").value,
      fecha            : data['fecha_solicitud'],
      estado           : data['estado'] ? data['estado'] : "",
      reserva          : data['reserva'],
    };
    this.reservasService.detalleReservasSeguimiento(detalleReserva).subscribe( resp => {
     const dialogRef: MatDialogRef<any> = this.dialog.open(ComercialSeguimientoDetalleReservasComponent, {
        width: '90%',
        height: '90%',
        disableClose: true,
        data: { titleCupo: 'Detalle de Cupos', payload: resp, isNew: 'isNew' }
      });
      this.loader.close();
    });
  }

  ngOnDestroy(){
    this.subcriptiondataReservas.unsubscribe();
  }
}
