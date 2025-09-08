import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { MatTableDataSource, MatDialogRef, MatDialog } from '@angular/material';
import { FertilizantesService } from 'app/shared/services/fertilizantes.service';
import * as moment from "moment";
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppAtencionService } from 'app/shared/services/app-atencion/app-atencion.service';

export class Cupos {
  id_cupo: number;
  cupo: string;
  dominio: string;
  ctg: string;
  nombreChofer: string;
  cuitChofer: string;
  dniChofer: string;
  nombreTransportista: string;
  fecha: string;
  fecha_turno : string;
  inicio: string;
  fin: string;
  fecha_arribo: string;
  tiempo_para_demorado: string;
  id_reserva: string;

}

export class Chofer {
  id_cupo: number;
  chofer: string;
  fecha: string;
  fecha_turno: string;
  patente: string;
  fecha_arribo: string;
  cuit: string;
  dniChofer: string;
  ctg: string;
  transportista: string;
  turno: string;
  estado: number;
  estadoString: string;
  color: string;
  inicio: string;
  fin: string;
  id_reserva: string;
}

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss'],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class BuscarComponent implements OnInit {

  buscarForm: FormGroup;

  estadoActivo = 1;
  stringCriterio = '1- Ingresar Código';
  dataSource = new MatTableDataSource();

  displayedColumns: string[] = [
    "chofer",
    "patente",
    "dniChofer",
    "transportista",
    "turno",
    "estado",
    "fecha_arribo"
  ];

  cupo: Chofer;
  cupos: Chofer[] = [];
  alfanumericoCupo = '';
  encontrado = false;
  opcion = 'cupo';
  cupoApi: Cupos;
  tolerancia_horas_antes:string;
  tolerancia_horas_despues:string;
  fecha_turno: Date;

  constructor(private fb: FormBuilder,
              private fertilizantesService: FertilizantesService,
              private alertService: AppAlertService,
              private atencionService: AppAtencionService,
              private loader: AppLoaderService,) { }

  ngOnInit() {
    this.buscarForm = this.fb.group({
      criterio: ['', Validators.required]
    });
  }
  onCheckboxChangeEstadoActive(chck, i) {
    this.estadoActivo = chck.checked ? i : -1;
    this.buscarForm.controls['criterio'].setValue('');
    this.encontrado = false;
    switch (this.estadoActivo) {
      case -1:
        this.stringCriterio = 'Seleccione criterio';
        this.opcion = '';
        break;
      case 1:
        this.stringCriterio = '1- Ingresar Código Cupo';
        this.opcion = 'cupo';
        break;
      case 2:
        this.stringCriterio = '2- Ingresar Patente';
        this.opcion = 'dominio';
        break;
      case 3:
        this.stringCriterio = '3- DNI Chofer';
        this.opcion = 'dni';
        break;

      default:
        break;
    }
  }

  buscar(){
    let filtro = {
      campo : this.opcion,
      cadena: this.buscarForm.controls['criterio'].value
    }

    this.dataSource.data = [];
    this.fertilizantesService.getBuscarTurno(filtro)
      .subscribe(res => {
        if (res.data) {
          this.cupos = [];
          this.encontrado = true;
          this.tolerancia_horas_antes   = res.data.tolerancia_horas_antes;
          this.tolerancia_horas_despues = res.data.tolerancia_horas_despues;
          this.fecha_turno              = res.data.fecha_turno;
          this.cupoApi                  = res.data.result;
          this.cupo                     = new Chofer();
          this.cupo.id_cupo             = this.cupoApi.id_cupo;
          this.alfanumericoCupo         = this.cupoApi.cupo;
          this.cupo.chofer              = this.cupoApi.nombreChofer;
          this.cupo.patente             = this.cupoApi.dominio;
          this.cupo.fecha_arribo        = this.cupoApi.fecha_arribo;
          this.cupo.cuit                = this.cupoApi.cuitChofer;
          this.cupo.dniChofer           = this.cupoApi.dniChofer;
          this.cupo.turno               = this.cupoApi.fecha;
          this.cupo.inicio              = this.cupoApi.inicio;
          this.cupo.fin                 = this.cupoApi.fin;
          this.cupo.id_reserva          = this.cupoApi.id_reserva;
          this.cupo.transportista       = this.cupoApi.nombreTransportista;
          let defaultFecha = moment(Date()).format("YYYY-MM-DD HH:mm:ss");
          let fin          = this.dameTiempo(this.cupoApi.fin);
          if (defaultFecha < res.data.fecha_minima) {
            let end = moment(this.fecha_turno + this.cupo.inicio, 'YYYY-MM-DD HH:mm:ss');
            this.cupo.color = '#c20b1d';
            let duration = moment.duration(end.diff(defaultFecha));
            let dias   = duration.days();
            let hours = duration.hours();
            let min   = duration.minutes();
            this.cupo.estadoString = 'Temprano ' +dias+' dias ' + Math.round(hours) + 'hs : ' + Math.round(min) + 'min';
          }
          if (defaultFecha >= res.data.fecha_minima && defaultFecha < res.data.fecha_maxima) {
            this.cupo.estadoString = 'En tiempo';
            this.cupo.color = '#6aaf22';
          }
          if (defaultFecha > res.data.fecha_maxima) {
            let end = moment(this.fecha_turno + this.cupo.fin, 'YYYY-MM-DD HH:mm:ss');
            let duration = moment.duration(end.diff(defaultFecha));
            let dias   = duration.days();
            let hours = duration.hours();
            let min   = duration.minutes();
            this.cupo.estadoString = 'Tarde ' +dias+' dias ' + Math.round(hours) * -1 + 'hs: ' + Math.round(min) + 'min';
            this.cupo.color = '#c20b1d';
          }
          this.cupos.push(this.cupo);
          this.dataSource.data = this.cupos;
        } else {
          let titleError = '';
            this.encontrado = true;
            this.cupos = [];
            this.buscarForm.controls['criterio'].setValue('');
            this.encontrado = false;
            this.dataSource.data = this.cupos;
            switch (this.opcion) {
              case 'cupo':
                titleError = ' Cupo no encontrado.'
                break;
              case 'dni':
                titleError = ' DNI no encontrado.'
                break;
              case 'dominio':
                titleError = 'Patente no encontrada.'
                break;

              default:
                break;
            }
           let alertError = titleError + " <br> Intente con otro criterio de búsqueda";
            this.openPopNotFound(alertError);
        }
      });
  }

  confirmarArribo(id_reserva){
    this.loader.open();
    this.fertilizantesService.confirmarArribo({id_reserva})
      .subscribe(res => {
        this.loader.close();
        this.alertService
        .confirm({
          message: res.data.message,
          tipo: "exito"
        }).subscribe(res => {
          if (res) {
            this.buscar();
            return;
          }
        });
      });
  }

  openPopNotFound(title) {
    this.atencionService.confirm({
      title: 'ATENCIÓN',
      class: true,
      message: title,
      label_button: 'ENTENDIDO'
     }).subscribe(res => {
      if (res) {
        return;
      }
    });
  }

  dameTiempo(time: string) {
    let horas = parseInt(time.substring(0, 2));
    let minutes = parseInt(time.substring(3, 5));
    let segundos = parseInt(time.substring(7, 9));
    return horas * 3600 + minutes * 60 + segundos
  }


}
