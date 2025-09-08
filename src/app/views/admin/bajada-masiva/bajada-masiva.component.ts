import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { AppAlertService } from "../../../shared/services/app-alert/app-alert.service";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import {
  MatDialog,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatSnackBar
} from "@angular/material";
import { AppConfirmService } from "../../../shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { Subscription } from "rxjs";
import { NomencladoresService } from "./../../../shared/services/nomencladores.service";
import {
  AppDateAdapter,
  APP_DATE_FORMATS
} from '@helpers/date.adapter';
import { Page } from "../../../shared/models/page";
import { ExelService } from "../../../shared/services/exel.service";
import { AppErrorService } from "../../../shared/services/app-error/app-error.service";
import { AppAtencionService } from "../../../shared/services/app-atencion/app-atencion.service";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { egretAnimations } from "../../../shared/animations/egret-animations";

export class BajadaMasiva {
  id: number;
  nombre_generador: string;
  nombre_dador: string;
  nombre_producto: string;
  nombre_lugar_carga: string;
  zona_destino: string;
  fecha_desde: string;
  fecha_hasta: string;
  tipo_pedido: string;
  cantidad: string;
  viajes_asignados: string;
}
export class BajadaViaje {
  id_pedido: number;
  nombre_chofer: string;
  destino: string;
  fecha: string;
  fecha_cupo: string;
  carta_porte: string;
  cupo: string;
  nombre_corredor: string;
  nombre_entregador: string;
  nombre_destinatario: string;
  id_estado: number;
  estado: string;
  numeroContrato: string;
  nombre_transportista: string;
  patente_camion: string;
  patente_acoplado: string;
  fecha_descarga: string;
  tiempo_lugar_carga: string;
  tiempo_lugar_descarga: string;
}

@Component({
  selector: "app-bajada-masiva",
  templateUrl: "./bajada-masiva.component.html",
  styleUrls: ["./bajada-masiva.component.scss"],
  animations: egretAnimations,
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
export class BajadaMasivaComponent implements OnInit {
  public choferes: BajadaMasiva[];
  public bajadaMasiva: BajadaMasiva[];
  public bajadaViaje: BajadaViaje[];
  page = new Page();

  bajadaForm: FormGroup;
  public getItemSub: Subscription;
  idchoferlibre: any;
  minDate: any;
  maxDate: any;
  fecha_desde: any;
  fecha_hasta: any;
  tipo: number;
  checkedPedidos = false;
  tipos = [
    {
      id: 1,
      descripcion: "Pedidos"
    },
    {
      id: 2,
      descripcion: "Viajes"
    }
  ];
  constructor(
    private nomencladoresService: NomencladoresService,
    public router: Router,
    private excelService: ExelService,
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.bajadaForm = new FormGroup({
      desdeDate: new FormControl(new Date(), [Validators.required]),
      hastaDate: new FormControl(new Date(), [Validators.required]),
      tipoReporte: new FormControl("", [Validators.required])
    });
    this.fecha_desde = this.f.desdeDate.value.toISOString();
    this.fecha_hasta = this.f.desdeDate.value.toISOString();
    this.cargarTodos();
  }
  get f() {
    return this.bajadaForm.controls;
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>, cmp: string) {
    if (cmp === "desde") {
      this.minDate = event.value;
    } else {
      this.maxDate = event.value;
    }
  }

  
  cargarTodos() {
    this.nomencladoresService
      .getDatosPedidosViajes(this.fecha_desde, this.fecha_hasta, this.tipo)
      .subscribe(pagedData => {
        if (this.tipo == 1) {
          this.bajadaMasiva = pagedData.data;
          for (let i = 0; i < this.bajadaMasiva.length; i++) {
            this.bajadaMasiva[i].tipo_pedido =
              this.bajadaMasiva[i].tipo_pedido.toString() === "1"
                ? "Largo"
                : this.bajadaMasiva[i].tipo_pedido.toString() === "2"
                  ? "Retorno"
                  : "Corto";
          }
        } else {
          this.bajadaViaje = pagedData.data;
          
        }
      });
  }
  Ejecutarfiltro() {
    this.fecha_desde = this.f.desdeDate.value.toISOString();
    this.fecha_hasta = this.f.hastaDate.value.toISOString();
    this.tipo = this.f.tipoReporte.value;
    this.cargarTodos();
  }

  exportAsXLSX(): void {
    let array_exp = [];
    if (this.tipo == 1) {
      if (this.bajadaMasiva.length > 0) {
        for (let i = 0; i < this.bajadaMasiva.length; i++) {
          let exportar = {
            Tipo: this.bajadaMasiva[i].tipo_pedido,
            Id: this.bajadaMasiva[i].id,
            Generador: this.bajadaMasiva[i].nombre_generador,
            Cargador: this.bajadaMasiva[i].nombre_dador,
            Producto: this.bajadaMasiva[i].nombre_producto,
            Lugar_carga: this.bajadaMasiva[i].nombre_lugar_carga,
            Zona_destino: this.bajadaMasiva[i].zona_destino,
            F_desde: this.bajadaMasiva[i].fecha_desde,
            F_hasta: this.bajadaMasiva[i].fecha_hasta,
            Cantidad: this.bajadaMasiva[i].cantidad,
            Viajes_asignados: this.bajadaMasiva[i].viajes_asignados
          };
          array_exp.push(exportar);
        }
        this.excelService.exportAsExcelFile(array_exp, "Listado pedidos");
        
      }
    } else {
      if (this.bajadaViaje.length > 0) {
        for (let i = 0; i < this.bajadaViaje.length; i++) {
          let exportar = {
            Pedido: this.bajadaViaje[i].id_pedido,
            Chofer: this.bajadaViaje[i].nombre_chofer,
            Destino: this.bajadaViaje[i].destino,
            F_carga: this.bajadaViaje[i].fecha,
            F_cupo: this.bajadaViaje[i].fecha_cupo,
            Carta_porte: this.bajadaViaje[i].carta_porte,
            Cupo: this.bajadaViaje[i].cupo,
            Corredor: this.bajadaViaje[i].nombre_corredor,
            Entregador: this.bajadaViaje[i].nombre_entregador,
            Destinatario: this.bajadaViaje[i].nombre_destinatario,
            Estado: this.bajadaViaje[i].estado,
            N_contrato: this.bajadaViaje[i].numeroContrato,
            Empresa_transporte: this.bajadaViaje[i].nombre_transportista,
            Patente_chasis: this.bajadaViaje[i].patente_camion,
            Patente_acoplado: this.bajadaViaje[i].patente_acoplado,
            F_descarga: this.bajadaViaje[i].fecha_descarga,
            T_permanecia_origen: this.bajadaViaje[i].tiempo_lugar_carga,
            T_permanecia_destino: this.bajadaViaje[i].tiempo_lugar_descarga
          };
          array_exp.push(exportar);

        };
        this.excelService.exportAsExcelFile(array_exp, "Listado Viajes");
      }
    }
  }
  
}
