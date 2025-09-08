import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepicker } from "saturn-datepicker";
import * as moment from "moment";
import { MatDialog, MatDialogRef, MatOption, MatPaginator, MatSelectChange, MatTableDataSource, PageEvent } from "@angular/material";
import { HomeService } from "../home.service";
import { ProductoMulti, TipoDespacho, Origenes, Proveedor } from "@app/shared/models/fertilizantes.model";
import { SeguimientoTerminal, ZonaCliente } from "@app/shared/models";
import { AppLoaderService, FertilizantesService, ReservasService } from "@app/shared/services";
import { Subscription } from "rxjs";
import { SeguimientoReservaDetalleReservaComponent } from "./seguimiento-reserva-detalle-reserva/seguimiento-reserva-detalle-reserva.component";

@Component({
  selector: 'app-seguimiento-reserva',
  templateUrl: './seguimiento-reserva.component.html',
  styleUrls: ['./seguimiento-reserva.component.scss'],
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
export class SeguimientoReservaComponent implements OnInit, OnDestroy {
  @ViewChild("picker") dateRange: SatDatepicker<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  primerDia = moment().format("YYYY-MM-DD");
  ultimoDia = '';
  chancedDate: boolean = true;

  selectedTerminal = 0;
  selectedTipoDespacho = 0;
  selectedEstado = 0;
  selectedProveedor = -1;
  selectedZona = 0;

  filtrosForm: FormGroup;
  public pageSize = 10;
  public totalSize = 0;
  public pageIndex = 0;
  pageEvent: PageEvent = new PageEvent();
  subscriptions: Subscription = new Subscription();
  dataSource = new MatTableDataSource<SeguimientoTerminal>();
  habilitarButton: boolean = false;
  esMuvinProveedor: boolean = false;

  listadoProductos: ProductoMulti[] = [
    { value: 0, display: 'Todos' }
  ];
  listadoTerminalCarga: Origenes[] = [
    {
      id: 0, id_localidad: 0, descripcion: 'Todos', bloqueado: 0,
      imagen: 0, id_persona_rol: 0, longitud: 0, latitud: 0, id_zona_destino: 0,
      id_situacion_puerto: 0, CodigoPlantaOncca: 0, tiempo_para_demorado: '',
      oculto: 0, solucion_muvin: 0
    }
  ];
  listadoDespachos: TipoDespacho[] = [
    { id: 0, descripcion: 'Todos', forma: '' },
  ];
  estados = [
    { id: 0, descripcion: 'Todos' },
    { id: 1, descripcion: 'Pendiente' },
    { id: 2, descripcion: 'Procesados' }
  ];
  listadoZonas: ZonaCliente[] = [
    { id: 0, descripcion: 'Todos' },
  ];
  displayedColumns: string[] = [
    'fecha',
    'reserva',
    'terminal',
    'tipo_despacho',
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
  listadoProveedores: Proveedor[] = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private homeService: HomeService,
    private loader: AppLoaderService,
    private reservasService: ReservasService,
    private fertilizantesService: FertilizantesService,
  ) {}

  ngOnInit() {
    this.loadFilters();
    this.buildItemForm();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Registros por Página:';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primera';
    this.paginator._intl.lastPageLabel = 'Última';
    this.paginator._intl.previousPageLabel = 'Anterior';
  }

  loadFilters() {
    this.esMuvinProveedor = localStorage.getItem("esMuvinProveedor") == 'true' ? true : false;
    this.getPersonaRolFertilizantes();
    this.getTerminalCarga(this.selectedProveedor);
    this.getTipoDespacho();
    this.getProductos();
    if (this.esMuvinProveedor) {
      this.getZonas();
      this.displayedColumns.splice(4, 0, 'cliente', 'zona');
    }
  }

  getPersonaRolFertilizantes() {
    this.subscriptions.add(this.fertilizantesService.getProovedores().subscribe(resp => {
      if (resp) {
        this.listadoProveedores = resp.data;
        if (this.esMuvinProveedor) {
          if (this.listadoProveedores.length > 0) {
            this.selectedProveedor = this.listadoProveedores[0].id;
            this.getTerminalCarga(this.selectedProveedor);
            this.habilitarButton = true;
          }
        }
      }
    }));
  }

  getTerminalCarga(selectedProveedor) {
    if (this.selectedProveedor != -1)
      this.subscriptions.add(
        this.fertilizantesService.getOrigenes(selectedProveedor).subscribe(origenes => {
          if (origenes) {
            origenes.data.forEach((element) => {
              this.listadoTerminalCarga.push(element);
            });
          }
        }));
  }

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

  getTipoDespacho() {
    this.subscriptions.add(this.fertilizantesService.getTipoDespacho().subscribe(resp => {
      if (resp) {
        resp.data.forEach((element) => {
          this.listadoDespachos.push(element);
        });
      }
    }));
  }

  getZonas() {
    this.reservasService.getSelectZonasClientes()
      .subscribe(resp => {
        if (resp) {
          this.listadoZonas = resp;
          this.listadoZonas.unshift({ id: 0, descripcion: 'Todos' });
        }
      });
  }

  buildItemForm() {
    this.filtrosForm = this.fb.group({
      rango_fecha: [{
        begin: new Date(this.primerDia + " 12:00:00"),
        end: new Date(this.primerDia + " 12:00:00"),
      }, Validators.required],
      terminal: [[0], Validators.required],
      producto: [[0]],
      reserva: [''],
      tipo_despacho: [[0]],
      proveedor: [''],
      estado: [[0]],
    })
    if (this.esMuvinProveedor) {
      this.filtrosForm.addControl('cliente', new FormControl(''));
      this.filtrosForm.addControl('zona', new FormControl(''));
    }
  }

  cambioRangoFecha() {
    const start = this.dateRange.beginDate;
    const end = this.dateRange.endDate;
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

  habilitarButtonBuscar() {
    if (!this.esMuvinProveedor)
      ((this.selectedProveedor > 0 && (this.selectedTerminal['length'] > 0 || this.selectedTerminal === 0))
        && !this.filtrosForm.controls['rango_fecha'].hasError('rango')) ?
        this.habilitarButton = true :
        this.habilitarButton = false
  }

  getServerData(event?: PageEvent) {
    if (event !== null) {
      event.pageIndex++;
    }
    this.submit(event);
  }

  onChange() {
    this.habilitarButtonBuscar();
  }

  onChangeProveedor(ev: MatSelectChange) {
    this.selectedProveedor = (ev.source.selected as MatOption).value;
    this.getTerminalCarga(this.selectedProveedor);
    this.habilitarButtonBuscar();
  }

  submit(params: PageEvent) {
    if (!this.filtrosForm.invalid) {
      this.loader.open();
      this.subscriptions.add(
        this.reservasService.seguimientoReservaFiltros(this.filtrosForm.value, params.pageIndex, params.pageSize, this.esMuvinProveedor).subscribe(resp => {
          this.loader.close();
          if (resp.success) {
            this.dataSource = resp.data;

            this.pageEvent.length = resp._meta.totalCount;
            this.pageEvent.pageSize = resp._meta.perPage;
            this.pageEvent.pageIndex = resp._meta.currentPage - 1;
            this.pageIndex = resp._meta.currentPage - 1;
            this.pageSize = resp._meta.perPage;
            this.totalSize = resp._meta.totalCount;
          }
        }));
    }
  }

  openPopupReservas(data: any) {
    this.loader.open();
    let detalleReserva = {
      id_reserva: data.reserva,
      id_cuenta_cliente: data['id_cuenta_cliente'] ? data['id_cuenta_cliente'] : "",
      //id_origen: this.filtrosForm.get("terminal").value,
      id_origen: data['id_terminal'],
      fecha: data['fecha'],
      estado: data['estado'] ? data['estado'] : "",
      reserva: data['reserva'],
    };
    let tieneChoferAsignado: boolean;
    (data['nombre_chofer'] !== null) ? tieneChoferAsignado = true : tieneChoferAsignado = false
    let viajeConfirmado: boolean;
    (data['arribo'] !== null) ? viajeConfirmado = true : viajeConfirmado = false

    this.subscriptions.add(
      this.reservasService.detalleReservasSeguimiento(detalleReserva).subscribe(resp => {
        let dialogRef: MatDialogRef<any> = this.dialog.open(SeguimientoReservaDetalleReservaComponent, {
          width: '90%',
          height: '90%',
          disableClose: true,
          data: { titleCupo: 'Detalle de Cupos', payload: resp, tieneChofer: tieneChoferAsignado, viajeConfirmado: viajeConfirmado }
        });
        dialogRef.afterClosed()
          .subscribe(res => {
            if (!res) {
              return;
            }
            this.submit(this.pageEvent);
          });
        this.loader.close();
      }));
  }

  aplicarSeleccionMultiple() {
    return (this.esMuvinProveedor) ? false : true;
  }
}
