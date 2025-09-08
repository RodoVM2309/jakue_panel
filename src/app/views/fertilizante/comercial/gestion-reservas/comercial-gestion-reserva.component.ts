import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepicker } from "saturn-datepicker";
import * as moment from "moment";
import { MatDialog, MatDialogRef, MatOption, MatPaginator, MatSelectChange, MatTableDataSource, PageEvent } from "@angular/material";
import { ProductoMulti, TipoDespacho, Origenes, Reserva, DetalleReserva, AsignacionDirecta } from "@app/shared/models/fertilizantes.model";
import { AppLoaderService, FertilizantesService, ReservasService } from "@app/shared/services";
import { Subscription } from "rxjs";
import { HomeService } from "@app/shared/components/home/home.service";
import { ChoferZona } from "@app/shared/models";
import { SeguimientoReservaDetalleReservaComponent } from "@app/shared/components/home/seguimiento-reserva/seguimiento-reserva-detalle-reserva/seguimiento-reserva-detalle-reserva.component";
import { ListaChoferComponent } from "@app/shared/components/home/add-pedido-fertilizantes/lista-chofer/lista-chofer.component";
import { ComercialGestionReservaCambiarChoferComponent } from "./comercial-gestion-reserva-cambiar-chofer/comercial-gestion-reserva-cambiar-chofer.component";
import { SelectionModel } from "@angular/cdk/collections";
import { ComercialSeguimientoDetalleReservasComponent } from "../seguimiento/comercial-seguimiento-detalle-reserva/comercial-seguimiento-detalle-reserva.component";
import { DerivarReservaComponent } from "@app/shared/components/derivar-reserva/derivar-reserva.component"
import { AppAlertComponent } from "@app/shared/services/app-alert/app-alert.component";

const _ = require("lodash"); 
export interface SeguimientoTerminal {
  fecha: string;
  despacho: string;
  cliente: string;
  reserva: string;
  cupo: string;
  id_cupo: string;
  producto: string;
  detalle_producto: string;
  tn: string;
  nombre_chofer: string;
  patente: string;
  arribo: string;
  cont: string;
  selected: boolean;
  estado: string;
}



@Component({
  selector: 'app-comercial-gestion-reserva',
  templateUrl: './comercial-gestion-reserva.component.html',
  styleUrls: ['./comercial-gestion-reserva.component.scss'],
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
export class ComercialGestionReservaComponent implements OnInit, OnDestroy {
  @ViewChild("picker") dateRange: SatDatepicker<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  primerDia = moment().format("YYYY-MM-DD");;
  ultimoDia = '';
  chancedDate: boolean = true;

  selectedTerminal = "";
  selectedTipoDespacho = 0;
  selectedEstado = 0;
  totalTn = 0;
  totalCamiones = 0;
  chofer: ChoferZona;

  filtrosForm: FormGroup;
  public pageSize = 10;
  public totalSize = 0;
  public pageIndex = 0;
  pageEvent: PageEvent = new PageEvent();
  subscriptions: Subscription = new Subscription();
  habilitarButton: boolean = false;
  hhh: Reserva;
  dataSource = new MatTableDataSource<SeguimientoTerminal>();
  selection = new SelectionModel<SeguimientoTerminal>(true, []);
  listaSelected = [];
  countSelected = 0;
  asignacionChofer: AsignacionDirecta[] = [];

  listadoProductos: ProductoMulti[] = [
    { value: 0, display: 'Todos' }
  ];
  listadoTerminalCarga: Origenes[] = [];
  listadoDespachos: TipoDespacho[] = [
    { id: 0, descripcion: 'Todos', forma: '' },
  ];
  estados = [
    { id: 0, descripcion: 'Todos' },
    { id: 1, descripcion: 'Pendientes' },
    { id: 2, descripcion: 'Derivadas' },
    { id: 3, descripcion: 'Procesadas' }
  ];
  displayedColumns: string[] = [
    'reserva',
    'fecha',
    'terminal',
    'tipo_despacho',
    'cliente_sucursal',
    'producto',
    'tn',
    'nombre_chofer',
    'estado',
    'todas'
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private homeService: HomeService,
    private loader: AppLoaderService,
    private reservasService: ReservasService,
    private fertilizantesService: FertilizantesService,
  ) { }

  ngOnInit() {
    this.loadFilters();
    this.buildItemForm();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadFilters() {
    this.getTerminalCarga();
    this.getTipoDespacho();
    this.getProductos();
  }

  getTerminalCarga() {
    this.fertilizantesService.getFetilizantesOrigen(true)
      .subscribe(origenes => {
        if (origenes) {
          this.listadoTerminalCarga = origenes.data;
        }
      });
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

  buildItemForm() {
    this.filtrosForm = this.fb.group({
      rango_fecha: [{
        begin: new Date(this.primerDia + " 12:00:00"),
        end: new Date(this.primerDia + " 12:00:00"),
      }, Validators.required],
      terminal: ['', Validators.required],
      tipo_despacho: [[0]],
      cliente: [''],
      producto: [[0]],
      reserva: [''],
      estado: [[0]],
    })
  }

  cambioRangoFecha() {
    const start = this.dateRange.beginDate;
    const end = this.dateRange.endDate;
    const dif = moment(new Date(end)).diff(new Date(start), "days");
    if (dif > 7) {
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
    (!!this.selectedTerminal
      && !this.filtrosForm.controls['rango_fecha'].hasError('rango')) ?
      this.habilitarButton = true :
      this.habilitarButton = false
  }

  onChange(ev: MatSelectChange) {
    this.selectedTerminal = (ev.source.selected as MatOption).viewValue;
    this.habilitarButtonBuscar();
  }

  submit(params: PageEvent) {
    if (!this.filtrosForm.invalid) {
      this.loader.open();
      this.subscriptions.add(
        this.reservasService.comercialGestionReservaFiltros(this.filtrosForm.value, params.pageIndex, params.pageSize).subscribe(resp => {
          this.loader.close();

          this.totalTn = 0;
          this.listaSelected = [];
          let reserva: SeguimientoTerminal
          resp.data.forEach((sumatoria: SeguimientoTerminal) => {
            this.totalTn += Number(sumatoria['tn']);
            if (sumatoria.estado !== "PROCESADO") {
              this.listaSelected.push(sumatoria);
            }
          });

          this.listaSelected.forEach((element: SeguimientoTerminal, index) => {
            if (element.estado == "DERIVADA") {
              this.listaSelected.splice(index, 1);
            }
          })

          if (resp.success) {
            this.dataSource.data = resp.data;

            this.pageEvent.length = resp._meta.totalCount;
            this.pageEvent.pageSize = resp._meta.perPage;
            this.pageEvent.pageIndex = resp._meta.currentPage - 1;
            this.pageIndex = resp._meta.currentPage - 1;
            this.pageSize = resp._meta.perPage;
            this.totalSize = resp._meta.totalCount;
          }       
          //Mejor usar lodash   
          this.totalCamiones = this.filterByReservaId(this.dataSource.data);
          
        }));
    }
  }

  filterByReservaId(arr: any): any {
    const response = [];
    const arrLength = arr.length;
    for (let i = 0; i < arrLength; i++) {
      const formula = arr[i];
      if (!this.isInArrayOfReservas(formula, response)) {
        response.push(formula);
      }
    }
    return response.length;
  }

  private isInArrayOfReservas(formula: any, response: any): boolean {
    const arrLength = response.length;
    for (let i = 0; i < arrLength; i++) {
      // Check each element by 'id_formula'
      if (response[i].reserva === formula.reserva) {
        return true;
      }
    }
    return false;
  }

  openPopupReservas(data: any) {
    this.loader.open();

    let detalleReserva = {
      id_reserva: data.reserva,
      id_cuenta_cliente: data['id_cuenta_cliente'] ? data['id_cuenta_cliente'] : "",
      id_origen: data['id_terminal'],
      fecha: data['fecha'],
      estado: data['estado'] ? data['estado'] : "",
      reserva: data['reserva'],
    };
    this.reservasService.detalleReservasSeguimiento(detalleReserva).subscribe(resp => {
      const dialogRef: MatDialogRef<any> = this.dialog.open(ComercialSeguimientoDetalleReservasComponent, {
        width: '90%',
        height: '90%',
        disableClose: true,
        data: { titleCupo: 'Detalle de Cupos', payload: resp, isNew: 'isNew' }
      });
      this.loader.close();
    });
  }

  openPopListadoChofer(reserva: any, index: number) {
    let title = 'ASIGNAR CHOFER';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ListaChoferComponent, {
      width: '90%',
      height: '90%',
      disableClose: true,
      data: { title: title, payload: { index: index }, isNew: true }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.chofer = res;
        let data: AsignacionDirecta[] = [{
          id_chofer: res['id'],
          id_reserva: parseInt(reserva['reserva'])
        }]
        this.updateChofer(data);
      });
  }

  async openPopupCambiarChofer(data: any, index: number) {
    let viajeConfirmado: boolean;
    (data['arribo'] !== null) ? viajeConfirmado = true : viajeConfirmado = false;
    this.chofer = await this.fertilizantesService.getDatosChofer(data['cuit_chofer']).toPromise();
    this.chofer.cuit_persona = data['cuit_chofer'];
    let datos = {
      datos_chofer: this.chofer,
      id_reserva: data['reserva'],
      viaje_confirmado: viajeConfirmado,
      index: index
    }

    let dialogRef: MatDialogRef<any> = this.dialog.open(ComercialGestionReservaCambiarChoferComponent, {
      width: '90%',
      height: '90%',
      disableClose: true,
      data: { titleCupo: 'Datos del Chofer', dataPayload: datos }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.submit(this.pageEvent);
      });
    this.loader.close();
  }

  updateChofer(data) {
    this.fertilizantesService.updateChoferReserva(data).subscribe(res => {
      if (!res) {
        return;
      }
      this.submit(this.pageEvent);
    });
  }

  getServerData(event?: PageEvent) {
    if (event !== null) {
      event.pageIndex++;
    }
    this.submit(event);
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row: SeguimientoTerminal) => {
        this.listaSelected.forEach((element: SeguimientoTerminal) => {
          if (element.reserva === row.reserva)
            this.selection.select(row);
        })
        /* if (row.estado !== "PROCESADO")
          this.selection.select(row);
        if (row.estado !== "DERIVADA") {
          this.selection.select(row);
        } */
      })
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listaSelected.length;
    return numSelected === numRows;
  }

  verificar(element: SeguimientoTerminal, i: number) {
    this.dataSource.data.forEach((row, index) => {
      if ((row.reserva == element.reserva) && (i !== index)) {
        (!this.selection.isSelected(element)) ? this.selection.select(row) : this.selection.deselect(row);
      }
    })

    
  }




  openModalDerivarReserva(){

    if( this.selection.selected.length > 0 ){
      //this.selection.selected()
      let reservasSelected = [];
      let flag = null;
      for(let i = 0;i < this.selection.selected.length;i++){
        if( flag == null ){
          flag = this.selection.selected[i]["reserva"];
          reservasSelected.push( parseInt( this.selection.selected[i]["reserva"] ) );
        } else {
          if( flag != this.selection.selected[i]["reserva"] ){
            flag = this.selection.selected[i]["reserva"];
            reservasSelected.push( parseInt( this.selection.selected[i]["reserva"] ) );
          }
        }
      }

     

      console.log("Selection = ",this.selection.selected,reservasSelected );

      let title = 'PEDIDOS MASIVOS';
      let dialogRef: MatDialogRef<any> = this.dialog.open( DerivarReservaComponent , {
        width: '350px', 
        height: '350px',
        //disableClose: true,
        data: { title: title,payload: { reservas : reservasSelected } }
      });

      dialogRef.afterClosed()
        .subscribe(res => {
          this.selection.clear();
          document.getElementById("btnSearch").click();
          /*if(res != undefined || res != null){
            document.getElementById("fileExcel").click();
          }*/
        
      });
    }

    
  }

}
