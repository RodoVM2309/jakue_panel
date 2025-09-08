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
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AddSmsComponent } from 'app/shared/components/home/asignar-viaje/add-sms/add-sms.component'

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

// Solo para pruebas
const ELEMENT_DATA: SeguimientoTerminal[] = [];
@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.scss'],
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
export class SeguimientoComponent implements OnInit, AfterViewInit {

  @ViewChild(SelectAutocompleteComponent) multiSelect: SelectAutocompleteComponent;

  filtrosForm: FormGroup;
  public fechaModificada: string = "";
  now = new Date();
  selectedZona = 0;
  selectedProducto = 0;
  primerDia;
  ultimoDia;
  listado_clientes: Cliente[] = [
    {
      id: 0,
      razon_social: 'Todos'
    },
  ];

  listado_grupoClientes: GrupoCliente[] = [];
  listado_tipo: TipoDespacho[] = [];
  listado_productos: ProductoMulti[] = [
    {
      value: 0,
      display: 'Todos'
    }
  ];
  listado_detalleProductos: DetalleProductoRP[] = [];
  listadoTerminalCarga: Puerto[] = [];
  listado_zona: ZonaCliente[] = [
    {
      id: 0,
      descripcion: 'Todos'
    },
  ];
  km_terminal: ComboSelect[] = [
    {
      id: 0,
      descripcion: 'Todos'
    },
    {
      id: 1,
      descripcion: '0 - 50 Km'
    },
    {
      id: 2,
      descripcion: '50 - 100 Km'
    },
    {
      id: 3,
      descripcion: 'Más de 100 Km'
    },
    {
      id: 4,
      descripcion: 'Sin GPS'
    }
  ];
  documentacion: ComboSelect[] = [
    {
      id: 0,
      descripcion: 'NO OK'
    },
    {
      id: 1,
      descripcion: 'OK'
    },

  ];
  estado_arribo: ComboSelect[] = [
    {
      id: 0,
      descripcion: 'No Arribado'
    },
    {
      id: 1,
      descripcion: 'Arribado'
    },
    {
      id: 2,
      descripcion: 'Todos'
    },

  ];

  displayedColumns: string[] = [
    'fecha',
    'despacho',
    'consignatario',
    /*  'grupo_cliente', */
    'cliente',
    'reserva',
    'cupo',
    'producto',
    'detalle_producto',
    'tn',
    'km_term',
    'empresa_transp',
    'nombre_chofer',
    'patente',
    'dni_chofer',
    'doc',
    'fecha_turno',
    'arribo',
    'cont'
  ];
  data = new SeguimientoDB();
  selectedTerminal = "";
  dataSource = new MatTableDataSource<SeguimientoTerminal>();

  //pageEvent: PageEvent;
  //page = new Page();
  pageEvent: PageEvent = new PageEvent();
  //page = new Page();

  public pageSize = 10;
  public totalSize = 0;
  public pageIndex = 0;

  totalTn = 0;
  totalCamiones = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("picker") dateRange: SatDatepicker<any>;
  public getItemSub: Subscription;
  filteredOptions: Observable<ProductoFertilizante[]>;

  constructor(private fb: FormBuilder,
    public router: Router,
    private dialog: MatDialog,
    private reservasService: ReservasService,
    private fertilizantesService: FertilizantesService,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    private errorService: AppErrorService,
    private excelService: ExelService,
    private homeService: HomeService,
  ) {
    /*  this.page.pageNumber = 0;
     this.page.size = 10; */
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 10;
  }

  ngOnInit() {
    this.getTerminalCarga();
    this.getTipoDespacho();
    this.getGrupoClientes();
    this.getZonas();
    this.getProductos();
    this.primerDia = moment().format("YYYY-MM-DD");
    // this.ultimoDia = moment().add(5, 'days').format("YYYY-MM-DD");
    this.ultimoDia = '';
    this.buildItemForm();

    this.filtrosForm.get("id_producto").valueChanges.subscribe(producto => {
      if (producto.length > 1) {
        this.filtrosForm.get('id_detalleProducto').setValue('');
        this.filtrosForm.get('id_detalleProducto').disable();
        this.filtrosForm.get('id_detalleProducto').updateValueAndValidity();
      } else {
        this.filtrosForm.get('id_detalleProducto').setValue('');
        this.filtrosForm.get('id_detalleProducto').enable();
        this.filtrosForm.get('id_detalleProducto').updateValueAndValidity();
      }
    });
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
      id_tipo: ['', Validators.required],
      consignatario: [''],
      id_zona: [''],
      id_grupoCliente: [''],
      cliente: [''],
      cupo: [''],
      id_producto: [[0]],
      id_detalleProducto: [{
        value: '',
        disabled: (this.selectedProducto === 0) ? false : true,
      }],
      km_terminal: [0],
      empresaTransporte: [''],
      dniChofer: [''],
      doc: [''],
      arribo: [0],
    })
  }


  cambioRangoFecha() {
    const begin = this.filtrosForm.value.rango_fecha.begin;
    const end = this.filtrosForm.value.rango_fecha.end;
    const dif = end.diff(begin, "days");
    if (dif > 5) {
      this.filtrosForm.setErrors({ 'invalid': true });
    }

  }
  getTerminalCarga() {
    this.fertilizantesService.getFetilizantesOrigen(true)
      .subscribe(resp => {
        if (resp) {
          this.listadoTerminalCarga = resp.data;
        }
      });
  }
  getGrupoClientes() {
    this.reservasService.getGrupoClientes()
      .subscribe(resp => {
        if (resp) {
          this.listado_grupoClientes = resp;
        }
      });
  }
  getTipoDespacho() {
    this.fertilizantesService.getTipoDespacho().subscribe(resp => {
      if (resp) {
        this.listado_tipo = resp.data;
        this.listado_tipo.unshift({ id: 0, descripcion: 'Todos', forma: '' });
      }
    });
  }
  getZonas() {
    this.reservasService.getSelectZonasClientes()
      .subscribe(resp => {
        if (resp) {
          this.listado_zona = resp;
          this.listado_zona.unshift({ id: 0, descripcion: 'Todos' });
        }
      });
  }

  getProductos() {
    this.getItemSub = this.fertilizantesService.getProductosFertilizantes()
      .subscribe(resp => {
        if (resp) {
          resp.data.map(tipo => {
            let producto = {
              display: tipo.descripcion,
              value: tipo.id
            };
            this.listado_productos.push(producto);
          });
        }
      });

  }
  getDetalleProductoFertilizantes() {
    let obj = [];
    obj = this.filtrosForm.get('id_producto').value;
    if (obj.length == 1 && obj[0] != 0) {
      this.selectedProducto = 1;
      this.getItemSub = this.fertilizantesService.getDetalleProductoFertilizantes(obj[0])
        .subscribe(resp => {
          this.listado_detalleProductos = resp.data;
        });
    } else {
      this.selectedProducto = 0;
    }
  }

  onChange(ev: MatSelectChange) {
    this.selectedTerminal = (ev.source.selected as MatOption).viewValue;
  }

  getServerData(event?: PageEvent) {

    if (event !== null) {
      event.pageIndex++;
    }
    this.submit(event);

  }

  submit(params: PageEvent) {
    if (!this.filtrosForm.invalid) {
      this.loader.open();
      this.reservasService.seguimientoFiltros(this.filtrosForm.value, params.pageIndex, params.pageSize).subscribe(resp => {
        this.loader.close();
        this.totalTn = 0;
        resp.data.forEach(sumatoria => {
          this.totalTn += Number(sumatoria['tn']);
        });

        this.totalCamiones = resp.data.length;
        if (resp.success) {
          this.dataSource = resp.data;
          //this.page.totalElements = resp._meta['totalCount'];
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
    this.reservasService.exportarDatosMonitorTerminal(this.filtrosForm.value).subscribe(resp => {
      if (resp.length == 0) {
        this.errorService.confirm({
          message:
            "No existen Datos a exportar"
        });
      } else {
        this.fechaModificada = this.homeService.formatoFecha(this.now, "amd", "_");
        let hora = this.homeService.formatoHora(this.now);
        this.excelService.exportAsExcelFile(resp, `${this.fechaModificada}_${hora}_MONITOR_TERMINAL`);
      }
    });

  }

  confirmarArribo(id_reserva: string, event?: PageEvent) {
    this.loader.open();
    this.fertilizantesService.confirmarArribo({ id_reserva })
      .subscribe(res => {
        this.loader.close();
        this.alertService
          .confirm({
            message: res.data.message,
            tipo: "exito"
          }).subscribe(res => {
            if (res) {
              if (event !== null) {
                event.pageIndex++;
              }
              this.submit(event);
              //this.submit(null);
              return;
            }
          });
      });
  }

  openPopUpwhatsapp(data: any = {}, isNew?) {
    let data2 = {
      mensaje: '',
      celular: data.celular
    }
    let title = 'Mensaje Whatsapp al Chofer';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddSmsComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data2, isNew: isNew }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        var newString = res.mensaje.replace('', "%20");
        window.open("https://api.whatsapp.com/send?phone=?phone=+549" + res.celular + "&text=" + newString, "_blank");
      });
  }

}
