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
import { Cupo } from 'app/shared/models/cupo';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CupoService } from 'app/shared/components/cupo/cupo.service';
import { NoFoundComponent } from './no-found/no-found.component';
import * as moment from "moment";

export class Cupos {
  id_cupo: string;
  cupo: string;
  cartaPorte: string;
  dominio: string;
  ctg: string;
  nombreChofer: string;
  cuitChofer: string;
  nombreTransportista: string;
  fecha: string;
  fecha_turno : string;
  inicio: string;
  fin: string;
  fechaArribado: string;
  tiempo_para_demorado: string;

}

export class Chofer {
  chofer: string;
  fecha: string;
  fecha_turno: string;
  patente: string;
  cartaPorte: string;
  cuit: string;
  ctg: string;
  transportista: string;
  turno: string;
  estado: number;
  estadoString: string;
  color: string;
  inicio: string;
  fin: string;
}
@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss'],
  providers: [CupoService],
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
    "cuit",
    "transportista",
    "turno",
    "estado",
  ];
  cupo: Chofer;
  cupos: Chofer[] = [];
  alfanumericoCupo = '';
  encontrado = false;
  opcion = 'alfanumerico';
  cupoApi: Cupos;
  tolerancia_horas_antes:string;
  tolerancia_horas_despues:string;
  fecha_turno: Date;

  constructor(private fb: FormBuilder,
    private loader: AppLoaderService,
    private cupoService: CupoService,
    private dialog: MatDialog, ) { }

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
      case 0:
        this.stringCriterio = '4- Ingresar Carta Porte';
        this.opcion = 'cartaporte';
        break;
      case 1:
        this.stringCriterio = '1- Ingresar Código';
        this.opcion = 'alfanumerico';
        break;
      case 2:
        this.stringCriterio = '2- Ingresar CTG';
        this.opcion = 'ctg';
        break;
      case 3:
        this.stringCriterio = '3- Ingresar Patente';
        this.opcion = 'dominio';
        break;

      default:
        break;
    }
  }

  buscar() {
    this.loader.open();
    let filtro = {
      campo : this.opcion,
      cadena: this.buscarForm.controls['criterio'].value
    }
    this.cupoService
      .getBuscarCupo(filtro)
      .subscribe(
        res => {
          this.loader.close();
          if (res.data) {
            this.cupos = [];
            this.encontrado = true;
            this.tolerancia_horas_antes   = res.data.tolerancia_horas_antes;
            this.tolerancia_horas_despues = res.data.tolerancia_horas_despues;
            this.fecha_turno              = res.data.fecha_turno;
            this.cupoApi                  = res.data.result;
            this.cupo                     = new Chofer();
            this.alfanumericoCupo         = this.cupoApi.cupo;
            this.cupo.chofer              = this.cupoApi.nombreChofer;
            this.cupo.patente             = this.cupoApi.dominio;
            this.cupo.cartaPorte          = this.cupoApi.cartaPorte;
            this.cupo.cuit                = this.cupoApi.cuitChofer;
            this.cupo.ctg                 = this.cupoApi.ctg;
            this.cupo.turno               = this.cupoApi.fecha;
            this.cupo.inicio              = this.cupoApi.inicio;
            this.cupo.fin                 = this.cupoApi.fin;
            this.cupo.transportista       = this.cupoApi.nombreTransportista;
            let defaultFecha = moment(Date()).format("YYYY-MM-DD HH:mm:ss");
            let defautlHora = moment(Date()).format("HH:mm:ss");
            let horaArribo = this.dameTiempo(defautlHora);
            let inicio = this.dameTiempo(this.cupoApi.inicio);
            //console.log({inicio,horaArribo,defaultFecha});
            let fin = this.dameTiempo(this.cupoApi.fin);
            if (defaultFecha < res.data.fecha_minima) {
              let end = moment(this.fecha_turno + this.cupo.inicio, 'YYYY-MM-DD HH:mm:ss');
              this.cupo.color = '#c20b1d';

              let duration = moment.duration(end.diff(defaultFecha));
              //console.log(duration);
              let dias   = duration.days();
              let hours = duration.hours();
              let min   = duration.minutes();
              //console.log({dias,hours,min});
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
            //console.log(res.data);
            //console.log(this.opcion);
            let titleError = '';
            this.cupos = [];
            this.buscarForm.controls['criterio'].setValue('');
            this.encontrado = false;
            this.dataSource.data = this.cupos;
            switch (this.opcion) {
              case 'cartaporte':
                titleError = ' CARTA DE PORTE NO ENCONTRADA'
                break;
              case 'alfanumerico':
                titleError = ' CUPO NO ENCONTRADO'
                break;
              case 'ctg':
                titleError = ' CTG NO ENCONTRADO'
                break;
              case 'dominio':
                titleError = 'PATENTE NO ENCONTRADA'
                break;

              default:
                break;
            }
            //console.log(titleError);
            this.openPopNotFound(titleError);
          }

        },
        error => {
          this.encontrado = false;
          this.loader.close();
          this.openPopNotFound('ERROR EN LA API');
        })



  }

  openPopNotFound(title) {
    let dialogRef: MatDialogRef<any> = this.dialog.open(NoFoundComponent, {
      width: '40vw',
      disableClose: false,
      data: { title: title }
    })
    dialogRef.afterClosed()
      .subscribe(result => {
        return;
      })
  }


  dameTiempo(time: string) {
    let horas = parseInt(time.substring(0, 2));
    let minutes = parseInt(time.substring(3, 5));
    let segundos = parseInt(time.substring(7, 9));
    return horas * 3600 + minutes * 60 + segundos
  }

}
