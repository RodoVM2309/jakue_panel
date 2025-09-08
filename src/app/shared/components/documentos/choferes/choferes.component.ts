import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { Page } from '../../../../shared/models/page';
import { AppErrorService } from '../../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../../shared/services/app-atencion/app-atencion.service';
import {
  MatDialogRef,
  MatSnackBar,
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material";
import { animate, state, style, transition, trigger } from '@angular/animations';

import { CentrosService } from '../../../services/centros.service';
import { DocumentosChoferes } from '../../../models/documentos_choferes';
import { SubirDocumentoComponent } from '../subir-documento/subir-documento.component';
import { MostrarDocumentoComponent } from '../mostrar-documento/mostrar-documento.component';
import { GlobalService } from "../../../../shared/models/global.service";

export interface MostrarFiltro {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-choferes',
  templateUrl: './choferes.component.html',
  styleUrls: ['./choferes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ChoferesComponent implements OnInit, OnDestroy {
  public getItemSub: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    'nombreChofer',
    'cuitChofer',
    'patenteCamion',
    'nombreTransportista',
    'recibo_sueldo',
    'form_931',
    'pago_931',
    'art',
    'licencia_conduccion',
    'dni',
    'examen_psicofisico',
    'vcto_examen_psicofisico',
    'curso_actualizacion',
    'seguro_carga',
    'seguro_accidentes',
    'comprobante_pago_monotributo',
    'acoplado',
    'inscripcion_ruta',
    'rto'
  ];
  expandedElement: DocumentosChoferes;
  totalSize = 5;
  tableWidth: string = '';
  public docChoferes: DocumentosChoferes[];

  page = new Page();
  filtro = {
    patente: '',
    cuit: '',
    transportista: '',
    nombre: ''
  };
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };
  selectedFilter: any;
  mostrarFiltro: MostrarFiltro[] = [
    { value: -1, viewValue: "Todas" },
    { value: 0, viewValue: "Pendientes" },
    { value: 1, viewValue: "Aprobadas" },
    { value: 2, viewValue: "Rechazadas" },
  ];
  constructor(private centrosService: CentrosService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private errorService: AppErrorService, private atencionService: AppAtencionService,
    private loader: AppLoaderService, private alertService: AppAlertService,
    private globalService: GlobalService,) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.setPage({ offset: 0 });
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro === undefined) {
      this.filtro = {
        patente: '',
        cuit: '',
        transportista: '',
        nombre: ''
      };
    };
    this.centrosService.getAllDocumentacionChoferesCentro(this.page.pageNumber, this.filtro)
      .subscribe(pagedData => {
        this.docChoferes = [];
        pagedData.data.forEach(element => {
          let chofer = new DocumentosChoferes();
          chofer.id = element.id;
          chofer.nombreChofer = element.nombre_persona;
          chofer.id_usuario = element.id_usuario;
          chofer.id_chofer = element.documentacion.id_chofer;
          chofer.nombreTransportista = element.nombre_transportista;
          chofer.cuitChofer = element.cuit_persona;
          chofer.patenteCamion = element.patente;
          chofer.recibo_sueldo = element.documentacion.recibo_sueldo;
          chofer.form_931 = element.documentacion.form_931;
          chofer.pago_931 = element.documentacion.pago_931;
          chofer.art = element.documentacion.art;
          chofer.licencia_conduccion = element.documentacion.licencia_conduccion;
          chofer.dni = element.documentacion.dni;
          chofer.examen_psicofisico = element.documentacion.examen_psicofisico;
          chofer.vcto_examen_psicofisico = element.documentacion.vcto_examen_psicofisico == null ? '----' : element.documentacion.vcto_examen_psicofisico;
          chofer.curso_actualizacion = element.documentacion.curso_actualizacion;
          chofer.seguro_carga = element.documentacion.seguro_carga;
          chofer.seguro_accidentes = element.documentacion.seguro_accidentes;
          chofer.comprobante_pago_monotributo = element.documentacion.comprobante_pago_monotributo;
          chofer.acoplado = element.documentacion.acoplado;
          chofer.inscripcion_ruta = element.documentacion.inscripcion_ruta;
          chofer.rto = element.documentacion.rto;
          this.docChoferes.push(chofer);
        });
        this.dataSource.data = this.docChoferes;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      });
  }
  updateFilter(event, param) {
    const val = event.target.value.toLowerCase();

    switch (param) {
      case 'patente':
        this.filtro.patente = val;
        break;
      case 'cuit':
        this.filtro.cuit = val;
        break;
      case 'transportista':
        this.filtro.transportista = val;
        break;
      case 'nombre':
        this.filtro.nombre = val;
        break;
      default:
        break;
    }
    // this.filtro = event.target.value.toLowerCase();
    this.setPage({ offset: 0 });
    /* const temp = this.corredores.filter(function (d) {
      return d.nombre_corredor.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.corredores = temp;
    if (val === '') {
      this.setPage({ offset: 0 });
    } */
  }
  chanceFiltro() {
    //this.filtro.estado=this.selectedFilter;
    this.setPage({ offset: 0 });

  }
  isCustomizerOpen: boolean = false;
  limpiarFiltros() {
    this.filtro = {
      patente: '',
      cuit: '',
      transportista: '',
      nombre: ''
    };
    this.setPage({ offset: 0 });
  }

  subirDocumento(data, tipo) {
    let title = '';
    let dialogRef: MatDialogRef<any> = this.dialog.open(SubirDocumentoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data, tipoDocumento: tipo }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          this.setPage({ offset: 0 });
          // If user press cancel
          return;
        }
      });
  }
  verDocumento(data, tipo) {
    let title = '';
    let dialogRef: MatDialogRef<any> = this.dialog.open(MostrarDocumentoComponent, {
      width: "80vw",
      height: '90vh',
      disableClose: true,
      data: { title: title, payload: data, tipoDocumento: tipo }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          this.setPage({ offset: 0 });
          // If user press cancel
          return;
        }
      });
  }
  descargarDocumento(data, tipo) {
    let columnaSubir='';
    switch (tipo) {
      case 1:
        columnaSubir = 'recibo_sueldo';
        break;
      case 2:
        columnaSubir = 'form_931';
        break;
      case 3:
        columnaSubir = 'pago_931';
        break;
      case 4:
        columnaSubir = 'art';
        break;
      case 5:
        columnaSubir = 'licencia_conduccion';
        break;
      case 6:
        columnaSubir = 'dni';
        break;
      case 7:
        columnaSubir = 'examen_psicofisico';
        break;
      case 8:
        columnaSubir = 'curso_actualizacion';
        break;
      case 9:
        columnaSubir = 'seguro_carga';
        break;
      case 10:
        columnaSubir = 'seguro_accidentes';
        break;
      case 11:
        columnaSubir = 'comprobante_pago_monotributo';
        break;
      case 12:
        columnaSubir = 'acoplado';
        break;
      case 13:
        columnaSubir = 'inscripcion_ruta';
        break;
      case 14:
        columnaSubir = 'rto';
        break;

      default:
        columnaSubir = '';
        break;
    };        
    window.open(this.globalService.apiHost + "documentacion-chofer/file-down?id=" + data.id_chofer + '&atributo=' + columnaSubir, "_blank");
  }

}
