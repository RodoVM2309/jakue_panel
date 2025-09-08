import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { AppAlertService } from "../../../shared/services/app-alert/app-alert.service";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material";
import { Subscription } from "rxjs";
import {
  AppDateAdapter,
  APP_DATE_FORMATS
}  from '@helpers/date.adapter';

import { ExelService } from "../../../shared/services/exel.service";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { egretAnimations } from "../../../shared/animations/egret-animations";
import { HojaRuta} from 'app/shared/models/hoja-ruta';
import { ReportesService } from "app/shared/services/reportes.service";

@Component({
  selector: 'app-hoja-ruta',
  templateUrl: './hoja-ruta.component.html',
  styleUrls: ['./hoja-ruta.component.scss'],
  animations: egretAnimations,
  providers: [ReportesService,
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
export class HojaRutaComponent implements OnInit {
  public hojaRutas: HojaRuta[];
  hojaForm: FormGroup;
  public getItemSub: Subscription;
  minDate: any;
  maxDate: any;
  fecha_desde: any;
  fecha_hasta: any;
  constructor(
    private reportesService: ReportesService,
    public router: Router,
    private excelService: ExelService,
  ) { }

  ngOnInit() {
    this.hojaRutas=[];
    this.hojaForm = new FormGroup({
      desdeDate: new FormControl(new Date(), [Validators.required]),
      hastaDate: new FormControl(new Date(), [Validators.required])      
    });
    this.fecha_desde = this.f.desdeDate.value.toISOString();
    this.fecha_hasta = this.f.desdeDate.value.toISOString();
    this.cargarTodos();
  }
  get f() {
    return this.hojaForm.controls;
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
   this.reportesService.getHojaRuta(this.fecha_desde,this.fecha_hasta)
   .subscribe(pagedData => {
     this.hojaRutas=pagedData.data;
   })
  }

  Ejecutarfiltro() {
    this.fecha_desde = this.f.desdeDate.value.toISOString();
    this.fecha_hasta = this.f.hastaDate.value.toISOString();    
    this.cargarTodos();
  }

  exportAsXLSX(): void {
    let array_exp = [];
    
      if (this.hojaRutas.length > 0) {
        for (let i = 0; i < this.hojaRutas.length; i++) {
          let exportar = {
            Fecha_I: this.hojaRutas[i].fecha_desde,
            Fecha_F: this.hojaRutas[i].fecha_hasta,
            generador_razon_social:this.hojaRutas[i].generador_razon_social,
            generador_cuit: this.hojaRutas[i].generador_cuit,
            lugar_origen: this.hojaRutas[i].lugar_origen,
            lugar_destino: this.hojaRutas[i].lugar_destino,
            chofer_razon_social: this.hojaRutas[i].chofer_razon_social,
            chofer_cuit: this.hojaRutas[i].chofer_cuit,
            chofer_telefono: this.hojaRutas[i].chofer_telefono,
            camion_patente:this.hojaRutas[i].camion_patente,
            camion_marca: this.hojaRutas[i].camion_marca,
            acoplado_patente: this.hojaRutas[i].acoplado_patente,
            acoplado_marca: this.hojaRutas[i].acoplado_marca,
            cupo: this.hojaRutas[i].cupo,
            calada: this.hojaRutas[i].calada,
            difusion_intermediario:this.hojaRutas[i].difucion_intermediario,
            difusion_libre: this.hojaRutas[i].difucion_libre,
            difusion_fecha: this.hojaRutas[i].difucion_fecha,
            postulacion: this.hojaRutas[i].postulacion,
            postulacion_fecha: this.hojaRutas[i].postulacion_fecha,
            m50c_fecha:this.hojaRutas[i].m50c_fecha,
            m50c_estado: this.hojaRutas[i].m50c_estado,
            cargado_fecha:this.hojaRutas[i].cargado_fecha,
            cargado_longitud: this.hojaRutas[i].cargado_longitud,
            cargado_latitud: this.hojaRutas[i].cargado_latitud,
            cargado_estado: this.hojaRutas[i].cargado_estado,
            m50d_estado: this.hojaRutas[i].m50d_estado,
            desvio_motivo: this.hojaRutas[i].desvio_motivo,
            vacio_fecha: this.hojaRutas[i].vacio_fecha,
            vacio_longitud: this.hojaRutas[i].vacio_longitud,
            vacio_latitud: this.hojaRutas[i].vacio_latitud,
            vacio_estado: this.hojaRutas[i].vacio_estado,
            vacio_calada: this.hojaRutas[i]. vacio_calada,
            cargado_carta_porte: this.hojaRutas[i]. cargado_carta_porte,
            m50d_fecha: this.hojaRutas[i]. m50d_fecha,
            acoplado_tipo: this.hojaRutas[i]. acoplado_tipo,
            camion_tipo: this.hojaRutas[i]. camion_tipo,
            condiciones_pago: this.hojaRutas[i]. condiciones_pago,
            da_gasoil: this.hojaRutas[i]. da_gasoil,
            localidad_carga: this.hojaRutas[i]. localidad_carga,
            medio_pago: this.hojaRutas[i]. medio_pago,
            precio_viaje: this.hojaRutas[i]. precio_viaje,
            precio_viaje2: this.hojaRutas[i]. precio_viaje2,
            producto: this.hojaRutas[i]. producto,
            tipo_precio: this.hojaRutas[i]. tipo_precio
          };
          array_exp.push(exportar);
        }
        this.excelService.exportAsExcelFile(array_exp, "Hoja de Ruta");
      }
    
    
  }

}
