/// <reference types="@types/googlemaps" />
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  Inject,
  ViewEncapsulation
} from "@angular/core";
import {
  MatTableDataSource,
  MatDialogRef,
  MatDialog,
  MatProgressBar,
  MatButton,
  MatSelect,
  MatSnackBar,
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_DIALOG_DATA,
  MatRadioChange
} from "@angular/material";
import {
  Validators,
  FormGroup,
  FormControl,
  ValidatorFn,
  AbstractControl
} from "@angular/forms";

import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';

import { UserService } from "../../../services/user.service";
import { AppLoaderService } from "../../../../shared/services/app-loader/app-loader.service";
import { AppErrorService } from "../../../../shared/services/app-error/app-error.service";
import { AppAlertService } from "../../../../shared/services/app-alert/app-alert.service";
import {
  AppDateAdapter,
  APP_DATE_FORMATS
} from "@shared/helpers/date.adapter";

import { BooleanCcpp, Ccpp } from "app/shared/models/ccpp";
declare let googlemaps: any;
import { AmazingTimePickerService } from 'amazing-time-picker';
import { CcppService } from "app/shared/services/ccpp.service";
import { HomeService } from "../../home/home.service";
import { PersonasService } from "app/shared/services/personas.service";

import * as html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';

@Component({
  selector: 'app-confeccion-ccpp',
  templateUrl: './confeccion-ccpp.component.html',
  styleUrls: ['./confeccion-ccpp.component.scss'],
  providers: [
    UserService,
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
export class ConfeccionCCPPComponent implements OnInit {
  ccpp: Ccpp;
  boolCcpp: BooleanCcpp = new BooleanCcpp();
  confeccionCCPPForm: FormGroup;
  notificarForm: FormGroup;
  tipoAccion = [
    { id: 1, descripcion: 'Declaración de calidad' },
    { id: 2, descripcion: 'Conforme' },
    { id: 3, descripcion: 'Condicional' }
  ];
  arrayObservaciones: string[] = ['', '', '', ''];
  public getItemSub: Subscription;

  styleWidth = '100%';
  valorStyleWidth = 100;
  fontSize = '12px';
  valorFontSize = 12;
  heightInter = '229px';
  heightGranos = '170px';
  heightRow = '25px';
  height2Row = '50px';
  height3Row = '75px';
  height4Row = '100px';
  height5Row = '130px';

  cabecera = {
    nombreTitular: "",
    idCuitTitula: "",
    nombreIntermediario: "",
    idCuitIntermediario: "",
    nombreRemitente: "",
    idCuitRemComercial: "",
    nombreCorredorComprador: "",
    idCuitCorredorC: "",
    nombreMercadoATermino: "",
    idCuitMercadoATermino: "",
    nombreCorredorVendedor: "",
    idCuitCorredorV: "",
    nombreEntregador: "",
    idCuitRepresentanteEntregador: "",
    nombreDestinatario: "",
    idCuitDestinatario: "",
    nombreDestino: "",
    idCuitDestino: "",
    nombreIntermediarioFlete: "",
    idCuitIntermediarioFlete: "",
    nombreTransportista: "",
    idCuitTransportista: "",
    nombreChofer: "",
    idCuitChofer: "",
    nroContrato: "",
    nombreIntermediario1: "",
    idCuitIntermediario1: "",
    nombreIntermediario2: "",
    idCuitIntermediario2: "",
    caratulaMercadoATermino: "",
    comentario: ""
  };

  @ViewChild('idCuitTitula') idCuitTitula: ElementRef;
  @ViewChild('idCuitIntermediario') idCuitIntermediario: ElementRef;
  @ViewChild('idCuitRemComercial') idCuitRemComercial: ElementRef;
  @ViewChild('idCuitCorredorC') idCuitCorredorC: ElementRef;
  @ViewChild('idCuitMercadoATermino') idCuitMercadoATermino: ElementRef;
  @ViewChild('idCuitCorredorV') idCuitCorredorV: ElementRef;
  @ViewChild('idCuitRepresentanteEntregador') idCuitRepresentanteEntregador: ElementRef;
  @ViewChild('idCuitIntermediarioFlete') idCuitIntermediarioFlete: ElementRef;
  @ViewChild('idCuitTransportista') idCuitTransportista: ElementRef;
  @ViewChild('idCuitChofer') idCuitChofer: ElementRef;
  @ViewChild('idCuitIntermediario1') idCuitIntermediario1: ElementRef;
  @ViewChild('idCuitIntermediario2') idCuitIntermediario2: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private ccppService: CcppService,
    private personasService: PersonasService,
    private errorService: AppErrorService,
    private alertService: AppAlertService,
    private loader: AppLoaderService,
    public homeService: HomeService,
    private atp: AmazingTimePickerService,
    public dialogRef: MatDialogRef<ConfeccionCCPPComponent>) { }

  ngOnInit() {
    this.notificarForm = new FormGroup({
      email: new FormControl("", [Validators.required]),
      cuerpo: new FormControl("", [Validators.required]),
      adjunto: new FormControl(null),
    });

    this.ccpp = this.data.payload;
    // console.log(this.data.payload);
    this.confeccionCCPPForm = new FormGroup({
      id: new FormControl(this.ccpp.id),
      cartaPorte: new FormControl({
        value: this.ccpp.cartaPorte,
        disabled: (this.ccpp.cartaPorte == "" || this.ccpp.cartaPorte == null) ? false : true
      }),
      fechaCarga: new FormControl(this.ccpp.fechaCarga === null ? null : new Date(this.ccpp.fechaCarga.substring(0, 10) + ' 12:00:00')),
      fechaVencimiento: new FormControl(this.ccpp.fechaVencimiento === null ? null : new Date(this.ccpp.fechaVencimiento.substring(0, 10) + ' 12:00:00')),
      nombreTitular: new FormControl({
        value: this.ccpp.nombreTitular,
        disabled: (this.ccpp.nombreTitular == "" || this.ccpp.nombreTitular == null) ? false : true
      }),
      idCuitTitula: new FormControl({
        value: this.ccpp.idCuitTitula,
        disabled: (this.ccpp.idCuitTitula == "" || this.ccpp.idCuitTitula == null) ? false : true
      }),
      nombreIntermediario: new FormControl({
        value: this.ccpp.nombreIntermediario,
        disabled: (this.ccpp.nombreIntermediario == "" || this.ccpp.nombreIntermediario == null) ? false : true
      }),
      idCuitIntermediario: new FormControl({
        value: this.ccpp.idCuitIntermediario,
        disabled: (this.ccpp.idCuitIntermediario == "" || this.ccpp.idCuitIntermediario == null) ? false : true
      }),
      nombreRemitente: new FormControl({
        value: this.ccpp.nombreRemitente,
        disabled: (this.ccpp.nombreRemitente == "" || this.ccpp.nombreRemitente == null) ? false : true
      }),
      idCuitRemComercial: new FormControl({
        value: this.ccpp.idCuitRemComercial,
        disabled: (this.ccpp.idCuitRemComercial == "" || this.ccpp.idCuitRemComercial == null) ? false : true
      }),
      nombreCorredorComprador: new FormControl({
        value: this.ccpp.nombreCorredorComprador,
        disabled: (this.ccpp.nombreCorredorComprador == "" || this.ccpp.nombreCorredorComprador == null) ? false : true
      }),
      idCuitCorredorC: new FormControl({
        value: this.ccpp.idCuitCorredorC,
        disabled: (this.ccpp.idCuitCorredorC == "" || this.ccpp.idCuitCorredorC == null) ? false : true
      }),
      nombreMercadoATermino: new FormControl({
        value: this.ccpp.nombreMercadoATermino,
        disabled: (this.ccpp.nombreMercadoATermino == "" || this.ccpp.nombreMercadoATermino == null) ? false : true
      }),
      idCuitMercadoATermino: new FormControl({
        value: this.ccpp.idCuitMercadoATermino,
        disabled: (this.ccpp.idCuitMercadoATermino == "" || this.ccpp.idCuitMercadoATermino == null) ? false : true
      }),
      nombreCorredorVendedor: new FormControl({
        value: this.ccpp.nombreCorredorVendedor,
        disabled: (this.ccpp.nombreCorredorVendedor == "" || this.ccpp.nombreCorredorVendedor == null) ? false : true
      }),
      idCuitCorredorV: new FormControl({
        value: this.ccpp.idCuitCorredorV,
        disabled: (this.ccpp.idCuitCorredorV == "" || this.ccpp.idCuitCorredorV == null) ? false : true
      }),
      nombreEntregador: new FormControl({
        value: this.ccpp.nombreEntregador,
        disabled: (this.ccpp.nombreEntregador == "" || this.ccpp.nombreEntregador == null) ? false : true
      }),
      idCuitRepresentanteEntregador: new FormControl({
        value: this.ccpp.idCuitRepresentanteEntregador,
        disabled: (this.ccpp.idCuitRepresentanteEntregador == "" || this.ccpp.idCuitRepresentanteEntregador == null) ? false : true
      }),
      nombreDestinatario: new FormControl({
        value: this.ccpp.nombreDestinatario,
        disabled: (this.ccpp.nombreDestinatario == "" || this.ccpp.nombreDestinatario == null) ? false : true
      }),
      idCuitDestinatario: new FormControl({
        value: this.ccpp.idCuitDestinatario,
        disabled: (this.ccpp.idCuitDestinatario == "" || this.ccpp.idCuitDestinatario == null) ? false : true
      }),
      nombreDestino: new FormControl({
        value: this.ccpp.nombreDestino,
        disabled: (this.ccpp.nombreDestino == "" || this.ccpp.nombreDestino == null) ? false : true
      }),
      idCuitDestino: new FormControl({
        value: this.ccpp.idCuitDestino,
        disabled: (this.ccpp.idCuitDestino == "" || this.ccpp.idCuitDestino == null) ? false : true
      }),
      nombreIntermediarioFlete: new FormControl({
        value: this.ccpp.nombreIntermediarioFlete,
        disabled: (this.ccpp.nombreIntermediarioFlete == "" || this.ccpp.nombreIntermediarioFlete == null) ? false : true
      }),
      idCuitIntermediarioFlete: new FormControl({
        value: this.ccpp.idCuitIntermediarioFlete,
        disabled: (this.ccpp.idCuitIntermediarioFlete == "" || this.ccpp.idCuitIntermediarioFlete == null) ? false : true
      }),
      nombreTransportista: new FormControl({
        value: this.ccpp.nombreTransportista,
        disabled: (this.ccpp.nombreTransportista == "" || this.ccpp.nombreTransportista == null) ? false : true
      }),
      idCuitTransportista: new FormControl({
        value: this.ccpp.idCuitTransportista,
        disabled: (this.ccpp.idCuitTransportista == "" || this.ccpp.idCuitTransportista == null) ? false : true
      }),
      nombreChofer: new FormControl({
        value: this.ccpp.nombreChofer,
        disabled: (this.ccpp.nombreChofer == "" || this.ccpp.nombreChofer == null) ? false : true
      }),
      idCuitChofer: new FormControl({
        value: this.ccpp.idCuitChofer,
        disabled: (this.ccpp.idCuitChofer == "" || this.ccpp.idCuitChofer == null) ? false : true
      }),
      nombreIntermediario1: new FormControl({
        value: this.ccpp.nombreIntermediario1,
        disabled: (this.ccpp.nombreIntermediario1 == "" || this.ccpp.nombreIntermediario1 == null) ? false : true
      }),
      idCuitIntermediario1: new FormControl({
        value: this.ccpp.idCuitIntermediario1,
        disabled: (this.ccpp.idCuitIntermediario1 == "" || this.ccpp.idCuitIntermediario1 == null) ? false : true
      }),
      nombreIntermediario2: new FormControl({
        value: this.ccpp.nombreIntermediario2,
        disabled: (this.ccpp.nombreIntermediario2 == "" || this.ccpp.nombreIntermediario2 == null) ? false : true
      }),
      idCuitIntermediario2: new FormControl({
        value: this.ccpp.idCuitIntermediario2,
        disabled: (this.ccpp.idCuitIntermediario2 == "" || this.ccpp.idCuitIntermediario2 == null) ? false : true
      }),
      granoNombre: new FormControl({
        value: this.ccpp.granoNombre,
        disabled: (this.ccpp.granoNombre == "" || this.ccpp.granoNombre == null) ? false : true
      }),
      tipoGrano: new FormControl({
        value: this.ccpp.tipoGrano,
        disabled: (this.ccpp.tipoGrano == "" || this.ccpp.tipoGrano == null) ? false : true
      }),
      cosecha: new FormControl({
        value: this.ccpp.cosecha,
        disabled: (this.ccpp.cosecha == null) ? false : true
      }),
      nroContrato: new FormControl({
        value: this.ccpp.nroContrato,
        disabled: (this.ccpp.nroContrato == "" || this.ccpp.nroContrato == null) ? false : true
      }),
      granoPesadaDestino: new FormControl({
        value: this.ccpp.granoPesadaDestino === null ? false : true,
        disabled: (this.ccpp.granoPesadaDestino == null) ? false : true
      }),
      granoKgEstimado: new FormControl({
        value: this.ccpp.granoKgEstimado,
        disabled: (this.ccpp.granoKgEstimado == null) ? false : true
      }),
      granoCalidad: new FormControl({
        value: this.ccpp.granoCalidad,
        disabled: (this.ccpp.granoCalidad == null) ? false : true
      }),
      granoConforme: new FormControl({
        value: this.ccpp.granoConforme,
        disabled: (this.ccpp.granoConforme == null) ? false : true
      }),
      granoCondicional: new FormControl({
        value: this.ccpp.granoCondicional,
        disabled: (this.ccpp.granoCondicional == null) ? false : true
      }),
      granoPesoBruto: new FormControl({
        value: this.ccpp.granoPesoBruto,
        disabled: (this.ccpp.granoPesoBruto == null) ? false : true
      }),
      granoPesoTara: new FormControl({
        value: this.ccpp.granoPesoTara,
        disabled: (this.ccpp.granoPesoTara == "" || this.ccpp.granoPesoTara == null) ? false : true
      }),
      granoPesoNeto: new FormControl({
        value: this.ccpp.granoPesoNeto,
        disabled: (this.ccpp.granoPesoNeto == "" || this.ccpp.granoPesoNeto == null) ? false : true
      }),
      caratulaMercadoATermino: new FormControl({
        value: this.ccpp.caratulaMercadoATermino,
        disabled: (this.ccpp.caratulaMercadoATermino == "" || this.ccpp.caratulaMercadoATermino == null) ? false : true
      }),
      comentario: new FormControl({
        value: this.ccpp.comentario,
        disabled: (this.ccpp.comentario == "" || this.ccpp.comentario == null) ? false : true
      }),
      procedenciaEstablecimiento: new FormControl({
        value: this.ccpp.procedenciaEstablecimiento,
        disabled: (this.ccpp.procedenciaEstablecimiento == "" || this.ccpp.procedenciaEstablecimiento == null) ? false : true
      }),
      procedenciaDireccion: new FormControl({
        value: this.ccpp.procedenciaDireccion,
        disabled: (this.ccpp.procedenciaDireccion == "" || this.ccpp.procedenciaDireccion == null) ? false : true
      }),
      procedenciaLocalidad: new FormControl({
        value: this.ccpp.procedenciaLocalidad,
        disabled: (this.ccpp.procedenciaLocalidad == "" || this.ccpp.procedenciaLocalidad == null) ? false : true
      }),
      procedenciaProvincia: new FormControl({
        value: this.ccpp.procedenciaProvincia,
        disabled: (this.ccpp.procedenciaProvincia == "" || this.ccpp.procedenciaProvincia == null) ? false : true
      }),
      destinoGranoDireccion: new FormControl({
        value: this.ccpp.destinoGranoDireccion,
        disabled: (this.ccpp.destinoGranoDireccion == "" || this.ccpp.destinoGranoDireccion == null) ? false : true
      }),
      destinoGranoLocalidad: new FormControl({
        value: this.ccpp.destinoGranoLocalidad,
        disabled: (this.ccpp.destinoGranoLocalidad == "" || this.ccpp.destinoGranoLocalidad == null) ? false : true
      }),
      destinoGranoProvincia: new FormControl({
        value: this.ccpp.destinoGranoProvincia,
        disabled: (this.ccpp.destinoGranoProvincia == "" || this.ccpp.destinoGranoProvincia == null) ? false : true
      }),
      transporteCamion: new FormControl({
        value: this.ccpp.transporteCamion,
        disabled: (this.ccpp.transporteCamion == "" || this.ccpp.transporteCamion == null) ? false : true
      }),
      transporteCamion2: new FormControl({
        value: this.ccpp.transporteCamion2,
        disabled: (this.ccpp.transporteCamion2 == "" || this.ccpp.transporteCamion2 == null) ? false : true
      }),
      transporteCamion3: new FormControl({
        value: this.ccpp.transporteCamion3,
        disabled: (this.ccpp.transporteCamion3 == "" || this.ccpp.transporteCamion3 == null) ? false : true
      }),
      transporteAcoplado: new FormControl({
        value: this.ccpp.transporteAcoplado,
        disabled: (this.ccpp.transporteAcoplado == "" || this.ccpp.transporteAcoplado == null) ? false : true
      }),
      transporteTarifaReferencia: new FormControl({
        value: this.ccpp.transporteTarifaReferencia,
        disabled: (this.ccpp.transporteTarifaReferencia == "" || this.ccpp.transporteTarifaReferencia == null) ? false : true
      }),
      transporteTarifa: new FormControl({
        value: this.ccpp.transporteTarifa,
        disabled: (this.ccpp.transporteTarifa == "" || this.ccpp.transporteTarifa == null) ? false : true
      }),
      kmRecorrer: new FormControl({
        value: this.ccpp.kmRecorrer,
        disabled: (this.ccpp.kmRecorrer == null) ? false : true
      }),
      transportePagadorFlete: new FormControl({
        value: this.ccpp.transportePagadorFlete,
        disabled: (this.ccpp.transportePagadorFlete == "" || this.ccpp.transportePagadorFlete == null) ? false : true
      }),
      transporteFletePago: new FormControl({
        value: this.ccpp.transporteFletePago,
        disabled: (this.ccpp.transporteFletePago == "" || this.ccpp.transporteFletePago == null) ? false : true
      }),
      destinoFechaArribo: new FormControl(this.ccpp.destinoFechaArribo === null ? null : new Date(this.ccpp.destinoFechaArribo.substring(0, 10) + ' 12:00:00')),
      destinoHoraArribo: new FormControl(this.ccpp.destinoFechaArribo === null ? '00:00' : this.ccpp.destinoHoraArribo),
      destinoFechaDescarga: new FormControl(this.ccpp.destinoFechaDescarga === null ? null : new Date(this.ccpp.destinoFechaDescarga.substring(0, 10) + ' 12:00:00')),
      destinoHoraDescarga: new FormControl(this.ccpp.destinoHoraDescarga === null ? '00:00' : this.ccpp.destinoHoraDescarga),
      destinoNumeroTurno: new FormControl({
        value: this.ccpp.destinoNumeroTurno,
        disabled: (this.ccpp.destinoNumeroTurno == "" || this.ccpp.destinoNumeroTurno == null) ? false : true
      }),
      destinoPesoBruto: new FormControl({
        value: this.ccpp.destinoPesoBruto,
        disabled: (this.ccpp.destinoPesoBruto == "" || this.ccpp.destinoPesoBruto == null) ? false : true
      }),
      destinoPesoTara: new FormControl({
        value: this.ccpp.destinoPesoTara,
        disabled: (this.ccpp.destinoPesoTara == "" || this.ccpp.destinoPesoTara == null) ? false : true
      }),
      destinoPesoNeto: new FormControl({
        value: this.ccpp.destinoPesoNeto,
        disabled: (this.ccpp.destinoPesoNeto == "" || this.ccpp.destinoPesoNeto == null) ? false : true
      }),
      destinoObservaciones: new FormControl({
        value: this.ccpp.destinoObservaciones,
        disabled: (this.ccpp.destinoObservaciones == "" || this.ccpp.destinoObservaciones == null) ? false : true
      }),
      desvioCuitDestino: new FormControl({
        value: this.ccpp.desvioCuitDestino,
        disabled: (this.ccpp.desvioCuitDestino == "" || this.ccpp.desvioCuitDestino == null) ? false : true
      }),
      desvioCuitDestinatario: new FormControl({
        value: this.ccpp.desvioCuitDestinatario,
        disabled: (this.ccpp.desvioCuitDestinatario == "" || this.ccpp.desvioCuitDestinatario == null) ? false : true
      }),
      desvioDomicilio: new FormControl({
        value: this.ccpp.desvioDomicilio,
        disabled: (this.ccpp.desvioDomicilio == "" || this.ccpp.desvioDomicilio == null) ? false : true
      }),
      desvioLocalidad: new FormControl({
        value: this.ccpp.desvioLocalidad,
        disabled: (this.ccpp.desvioLocalidad == "" || this.ccpp.desvioLocalidad == null) ? false : true
      }),
      nroPlantaRuca: new FormControl({
        value: this.ccpp.nroPlantaRuca,
        disabled: (this.ccpp.nroPlantaRuca == "" || this.ccpp.nroPlantaRuca == null) ? false : true
      }),
      desvioFecha: new FormControl(this.ccpp.desvioFecha === null ? null : new Date(this.ccpp.desvioFecha.substring(0, 10) + ' 12:00:00')),
      desvioOrdenadoPor: new FormControl({
        value: this.ccpp.desvioOrdenadoPor,
        disabled: (this.ccpp.desvioOrdenadoPor == "" || this.ccpp.desvioOrdenadoPor == null) ? false : true
      }),
      numeroMatriculaRecibidor: new FormControl({
        value: this.ccpp.numeroMatriculaRecibidor,
        disabled: (this.ccpp.numeroMatriculaRecibidor == "" || this.ccpp.numeroMatriculaRecibidor == null) ? false : true
      }),
      numeroMatriculaEntregador: new FormControl({
        value: this.ccpp.numeroMatriculaEntregador,
        disabled: (this.ccpp.numeroMatriculaEntregador == "" || this.ccpp.numeroMatriculaEntregador == null) ? false : true
      }),
    });

    this.boolCcpp.stringfechaCarga = this.boolCcpp.fechaCarga ? this.homeService.formatoFecha(this.confeccionCCPPForm.controls["fechaCarga"].value, "dma", "-") : '';
    this.boolCcpp.stringfechaVencimiento = this.boolCcpp.fechaVencimiento ? this.homeService.formatoFecha(this.confeccionCCPPForm.controls["fechaVencimiento"].value, "dma", "-") : '';
    this.boolCcpp.stringdestinoFechaArribo = this.boolCcpp.destinoFechaArribo ? this.homeService.formatoFecha(this.confeccionCCPPForm.controls["destinoFechaArribo"].value, "dma", "-") : '';
    this.boolCcpp.stringdestinoFechaDescarga = this.boolCcpp.destinoFechaDescarga ? this.homeService.formatoFecha(this.confeccionCCPPForm.controls["destinoFechaDescarga"].value, "dma", "-") : '';
    this.boolCcpp.stringdesvioFecha = this.boolCcpp.desvioFecha ? this.homeService.formatoFecha(this.confeccionCCPPForm.controls["desvioFecha"].value, "dma", "-") : '';
    this.completaRazonSocial();
  }


  completaRazonSocial() {

    fromEvent(this.idCuitTitula.nativeElement, 'keyup').pipe(
      pluck('target', 'value'),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      //console.log(text);
      let cuit = text.toLowerCase();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          //console.log(resp);
          this.confeccionCCPPForm.controls['nombreTitular'].setValue(resp.data);
        },
          err => {
          });
    });
    /* idCuitIntermediario */
    fromEvent(this.idCuitIntermediario.nativeElement, 'keyup').pipe(
      pluck('target', 'value'),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      //console.log(text);
      let cuit = text.toLowerCase();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          //console.log(resp);
          this.confeccionCCPPForm.controls['nombreIntermediario'].setValue(resp.data);
        },
          err => {
          });
    });
    /* idCuitRemComercial */
    fromEvent(this.idCuitRemComercial.nativeElement, 'keyup').pipe(
      pluck('target', 'value'),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      //console.log(text);
      let cuit = text.toLowerCase();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          //console.log(resp);
          this.confeccionCCPPForm.controls['nombreRemitente'].setValue(resp.data);
        },
          err => {
          });
    });
    /* idCuitCorredorC */
    fromEvent(this.idCuitCorredorC.nativeElement, 'keyup').pipe(
      pluck('target', 'value'),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      //console.log(text);
      let cuit = text.toLowerCase();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          //console.log(resp);
          this.confeccionCCPPForm.controls['nombreCorredorComprador'].setValue(resp.data);
        },
          err => {
          });
    });
    /*idCuitMercadoATermino*/
    fromEvent(this.idCuitMercadoATermino.nativeElement, 'keyup').pipe(
      pluck('target', 'value'),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      //console.log(text);
      let cuit = text.toLowerCase();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          //console.log(resp);
          this.confeccionCCPPForm.controls['nombreMercadoATermino'].setValue(resp.data);
        },
          err => {
          });
    });
    /*idCuitCorredorV*/
    fromEvent(this.idCuitCorredorV.nativeElement, 'keyup').pipe(
      pluck('target', 'value'),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      //console.log(text);
      let cuit = text.toLowerCase();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          //console.log(resp);
          this.confeccionCCPPForm.controls['nombreCorredorVendedor'].setValue(resp.data);
        },
          err => {
          });
    });
    /*idCuitRepresentanteEntregador*/
    fromEvent(this.idCuitRepresentanteEntregador.nativeElement, 'keyup').pipe(
      pluck('target', 'value'),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      //console.log(text);
      let cuit = text.toLowerCase();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          //console.log(resp);
          this.confeccionCCPPForm.controls['nombreEntregador'].setValue(resp.data);
        },
          err => {
          });
    });
    /*idCuitIntermediarioFlete*/
    fromEvent(this.idCuitIntermediarioFlete.nativeElement, 'keyup').pipe(
      pluck('target', 'value'),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      //console.log(text);
      let cuit = text.toLowerCase();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          //console.log(resp);
          this.confeccionCCPPForm.controls['nombreIntermediarioFlete'].setValue(resp.data);
        },
          err => {
          });
    });
    /*idCuitTransportista*/
    fromEvent(this.idCuitTransportista.nativeElement, 'keyup').pipe(
      pluck('target', 'value'),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      //console.log(text);
      let cuit = text.toLowerCase();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          //console.log(resp);
          this.confeccionCCPPForm.controls['nombreTransportista'].setValue(resp.data);
        },
          err => {
          });
    });
    /*idCuitChofer*/
    fromEvent(this.idCuitChofer.nativeElement, 'keyup').pipe(
      pluck('target', 'value'),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      //console.log(text);
      let cuit = text.toLowerCase();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          //console.log(resp);
          this.confeccionCCPPForm.controls['nombreChofer'].setValue(resp.data);
        },
          err => {
          });
    });
    /*nombreIntermediario1*/
    fromEvent(this.idCuitIntermediario1.nativeElement, 'keyup').pipe(
      pluck('target', 'value'),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      //console.log(text);
      let cuit = text.toLowerCase();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          //console.log(resp);
          this.confeccionCCPPForm.controls['nombreIntermediario1'].setValue(resp.data);
        },
          err => {
          });
    });
    /*nombreIntermediario2*/
    fromEvent(this.idCuitIntermediario2.nativeElement, 'keyup').pipe(
      pluck('target', 'value'),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      //console.log(text);
      let cuit = text.toLowerCase();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          //console.log(resp);
          this.confeccionCCPPForm.controls['nombreIntermediario2'].setValue(resp.data);
        },
          err => {
          });
    });

  }

  closeModal() {
    this.dialogRef.close();
  }

  printPage() {
    this.loader.open('Preparando para imprimir', 'Carta Porte');
    this.armarCabecera().then(resp => {
      this.loader.close();
      setTimeout(function () { window.print(); }, 1000);
    });
  }

  async armarCabecera() {
    return new Promise((resolve, reject) => {
      this.cabecera.nombreTitular = this.confeccionCCPPForm.controls['nombreTitular'].value;
      this.cabecera.idCuitTitula = this.confeccionCCPPForm.controls['idCuitTitula'].value;
      this.cabecera.nombreIntermediario = this.confeccionCCPPForm.controls['nombreIntermediario'].value;
      this.cabecera.idCuitIntermediario = this.confeccionCCPPForm.controls['idCuitIntermediario'].value;
      this.cabecera.nombreRemitente = this.confeccionCCPPForm.controls['nombreRemitente'].value;
      this.cabecera.idCuitRemComercial = this.confeccionCCPPForm.controls['idCuitRemComercial'].value;
      this.cabecera.nombreCorredorComprador = this.confeccionCCPPForm.controls['nombreCorredorComprador'].value;
      this.cabecera.idCuitCorredorC = this.confeccionCCPPForm.controls['idCuitCorredorC'].value;
      this.cabecera.nombreMercadoATermino = this.confeccionCCPPForm.controls['nombreMercadoATermino'].value;
      this.cabecera.idCuitMercadoATermino = this.confeccionCCPPForm.controls['idCuitMercadoATermino'].value;
      this.cabecera.nombreCorredorVendedor = this.confeccionCCPPForm.controls['nombreCorredorVendedor'].value;
      this.cabecera.idCuitCorredorV = this.confeccionCCPPForm.controls['idCuitCorredorV'].value;
      this.cabecera.nombreEntregador = this.confeccionCCPPForm.controls['nombreEntregador'].value;
      this.cabecera.idCuitRepresentanteEntregador = this.confeccionCCPPForm.controls['idCuitRepresentanteEntregador'].value;
      this.cabecera.nombreDestinatario = this.confeccionCCPPForm.controls['nombreDestinatario'].value;
      this.cabecera.idCuitDestinatario = this.confeccionCCPPForm.controls['idCuitDestinatario'].value;
      this.cabecera.nombreDestino = this.confeccionCCPPForm.controls['nombreDestino'].value;
      this.cabecera.idCuitDestino = this.confeccionCCPPForm.controls['idCuitDestino'].value;
      this.cabecera.nombreIntermediarioFlete = this.confeccionCCPPForm.controls['nombreIntermediarioFlete'].value;
      this.cabecera.idCuitIntermediarioFlete = this.confeccionCCPPForm.controls['idCuitIntermediarioFlete'].value;
      this.cabecera.nombreTransportista = this.confeccionCCPPForm.controls['nombreTransportista'].value;
      this.cabecera.idCuitTransportista = this.confeccionCCPPForm.controls['idCuitTransportista'].value;
      this.cabecera.nombreChofer = this.confeccionCCPPForm.controls['nombreChofer'].value;
      this.cabecera.idCuitChofer = this.confeccionCCPPForm.controls['idCuitChofer'].value;
      this.cabecera.nombreIntermediario1 = this.confeccionCCPPForm.controls['nombreIntermediario1'].value;
      this.cabecera.idCuitIntermediario1 = this.confeccionCCPPForm.controls['idCuitIntermediario1'].value;
      this.cabecera.nombreIntermediario2 = this.confeccionCCPPForm.controls['nombreIntermediario2'].value;
      this.cabecera.idCuitIntermediario2 = this.confeccionCCPPForm.controls['idCuitIntermediario2'].value;
      this.cabecera.nroContrato = this.confeccionCCPPForm.controls['nroContrato'].value;
      this.cabecera.caratulaMercadoATermino = this.confeccionCCPPForm.controls['caratulaMercadoATermino'].value;
      this.cabecera.comentario = this.confeccionCCPPForm.controls['comentario'].value;
      setTimeout(function () { resolve(this.cabecera); }, 4000);
    });
  }

  open(ev: any) {

    const amazingTimePicker = this.atp.open({
      time: this.confeccionCCPPForm.controls['destinoHoraArribo'].value,
      theme: 'dark',
      arrowStyle: {
        background: 'red',
        color: 'white'
      }
    });
    amazingTimePicker.afterClose().subscribe(time => {
      console.log(time);
      this.confeccionCCPPForm.controls['destinoHoraArribo'].setValue(time);
    });
  }

  open1(ev: any) {

    const amazingTimePicker1 = this.atp.open({
      time: this.confeccionCCPPForm.controls['destinoHoraDescarga'].value,
      theme: 'dark',
      arrowStyle: {
        background: 'red',
        color: 'white'
      }
    });
    amazingTimePicker1.afterClose().subscribe(time => {
      console.log(time);
      this.confeccionCCPPForm.controls['destinoHoraDescarga'].setValue(time);
    });
  }

  submit(pos = 1) {
    if (pos == 1) {
      this.loader.open('Guardando', 'Carta Porte');
    }
    let data = this.confeccionCCPPForm.value;
    data.fechaCarga = this.confeccionCCPPForm.controls["fechaCarga"].value === null ? null : this.homeService.formatoFecha(this.confeccionCCPPForm.controls["fechaCarga"].value, "amd", "-");
    data.fechaVencimiento = this.confeccionCCPPForm.controls["fechaVencimiento"].value === null ? null : this.homeService.formatoFecha(this.confeccionCCPPForm.controls["fechaVencimiento"].value, "amd", "-");
    data.destinoFechaArribo = this.confeccionCCPPForm.controls["destinoFechaArribo"].value === null ? null : this.homeService.formatoFecha(this.confeccionCCPPForm.controls["destinoFechaArribo"].value, "amd", "-");
    data.destinoFechaDescarga = this.confeccionCCPPForm.controls["destinoFechaDescarga"].value === null ? null : this.homeService.formatoFecha(this.confeccionCCPPForm.controls["destinoFechaDescarga"].value, "amd", "-");
    data.desvioFecha = this.confeccionCCPPForm.controls["desvioFecha"].value === null ? null : this.homeService.formatoFecha(this.confeccionCCPPForm.controls["desvioFecha"].value, "amd", "-");
    data.granoPesadaDestino = this.confeccionCCPPForm.controls["granoPesadaDestino"].value ? 1 : 0;
    data.granoCalidad = this.confeccionCCPPForm.controls["granoCalidad"].value ? 1 : 0;
    data.granoConforme = this.confeccionCCPPForm.controls["granoConforme"].value ? 1 : 0;
    data.granoCondicional = this.confeccionCCPPForm.controls["granoCondicional"].value ? 1 : 0;

    data.nombreTitular = this.confeccionCCPPForm.controls['nombreTitular'].value === "" ? null : this.confeccionCCPPForm.controls['nombreTitular'].value;
    data.idCuitTitula = this.confeccionCCPPForm.controls['idCuitTitula'].value === "" ? null : this.confeccionCCPPForm.controls['idCuitTitula'].value;
    data.nombreIntermediario = this.confeccionCCPPForm.controls['nombreIntermediario'].value === "" ? null : this.confeccionCCPPForm.controls['nombreIntermediario'].value;
    data.idCuitIntermediario = this.confeccionCCPPForm.controls['idCuitIntermediario'].value === "" ? null : this.confeccionCCPPForm.controls['idCuitIntermediario'].value;
    data.nombreRemitente = this.confeccionCCPPForm.controls['nombreRemitente'].value === "" ? null : this.confeccionCCPPForm.controls['nombreRemitente'].value;
    data.idCuitRemComercial = this.confeccionCCPPForm.controls['idCuitRemComercial'].value === "" ? null : this.confeccionCCPPForm.controls['idCuitRemComercial'].value;
    data.nombreCorredorComprador = this.confeccionCCPPForm.controls['nombreCorredorComprador'].value === "" ? null : this.confeccionCCPPForm.controls['nombreCorredorComprador'].value;
    data.idCuitCorredorC = this.confeccionCCPPForm.controls['idCuitCorredorC'].value === "" ? null : this.confeccionCCPPForm.controls['idCuitCorredorC'].value;
    data.nombreMercadoATermino = this.confeccionCCPPForm.controls['nombreMercadoATermino'].value === "" ? null : this.confeccionCCPPForm.controls['nombreMercadoATermino'].value;
    data.idCuitMercadoATermino = this.confeccionCCPPForm.controls['idCuitMercadoATermino'].value === "" ? null : this.confeccionCCPPForm.controls['idCuitMercadoATermino'].value;
    data.nombreCorredorVendedor = this.confeccionCCPPForm.controls['nombreCorredorVendedor'].value === "" ? null : this.confeccionCCPPForm.controls['nombreCorredorVendedor'].value;
    data.idCuitCorredorV = this.confeccionCCPPForm.controls['idCuitCorredorV'].value === "" ? null : this.confeccionCCPPForm.controls['idCuitCorredorV'].value;
    data.nombreEntregador = this.confeccionCCPPForm.controls['nombreEntregador'].value === "" ? null : this.confeccionCCPPForm.controls['nombreEntregador'].value;
    data.idCuitRepresentanteEntregador = this.confeccionCCPPForm.controls['idCuitRepresentanteEntregador'].value === "" ? null : this.confeccionCCPPForm.controls['idCuitRepresentanteEntregador'].value;
    data.nombreDestinatario = this.confeccionCCPPForm.controls['nombreDestinatario'].value === "" ? null : this.confeccionCCPPForm.controls['nombreDestinatario'].value;
    data.idCuitDestinatario = this.confeccionCCPPForm.controls['idCuitDestinatario'].value === "" ? null : this.confeccionCCPPForm.controls['idCuitDestinatario'].value;
    data.nombreDestino = this.confeccionCCPPForm.controls['nombreDestino'].value === "" ? null : this.confeccionCCPPForm.controls['nombreDestino'].value;
    data.idCuitDestino = this.confeccionCCPPForm.controls['idCuitDestino'].value === "" ? null : this.confeccionCCPPForm.controls['idCuitDestino'].value;
    data.nombreIntermediarioFlete = this.confeccionCCPPForm.controls['nombreIntermediarioFlete'].value === "" ? null : this.confeccionCCPPForm.controls['nombreIntermediarioFlete'].value;
    data.idCuitIntermediarioFlete = this.confeccionCCPPForm.controls['idCuitIntermediarioFlete'].value === "" ? null : this.confeccionCCPPForm.controls['idCuitIntermediarioFlete'].value;
    data.nombreTransportista = this.confeccionCCPPForm.controls['nombreTransportista'].value === "" ? null : this.confeccionCCPPForm.controls['nombreTransportista'].value;
    data.idCuitTransportista = this.confeccionCCPPForm.controls['idCuitTransportista'].value === "" ? null : this.confeccionCCPPForm.controls['idCuitTransportista'].value;
    data.nombreChofer = this.confeccionCCPPForm.controls['nombreChofer'].value === "" ? null : this.confeccionCCPPForm.controls['nombreChofer'].value;
    data.idCuitChofer = this.confeccionCCPPForm.controls['idCuitChofer'].value === "" ? null : this.confeccionCCPPForm.controls['idCuitChofer'].value;
    data.nombreIntermediario1 = this.confeccionCCPPForm.controls['nombreIntermediario1'].value === "" ? null : this.confeccionCCPPForm.controls['nombreIntermediario1'].value;
    data.idCuitIntermediario1 = this.confeccionCCPPForm.controls['idCuitIntermediario1'].value === "" ? null : this.confeccionCCPPForm.controls['idCuitIntermediario1'].value;
    data.nombreIntermediario2 = this.confeccionCCPPForm.controls['nombreIntermediario2'].value === "" ? null : this.confeccionCCPPForm.controls['nombreIntermediario2'].value;
    data.idCuitIntermediario2 = this.confeccionCCPPForm.controls['idCuitIntermediario2'].value === "" ? null : this.confeccionCCPPForm.controls['idCuitIntermediario2'].value;
    data.nroContrato = this.confeccionCCPPForm.controls['nroContrato'].value === "" ? null : this.confeccionCCPPForm.controls['nroContrato'].value;
    data.caratulaMercadoATermino = this.confeccionCCPPForm.controls['caratulaMercadoATermino'].value === "" ? null : this.confeccionCCPPForm.controls['caratulaMercadoATermino'].value;
    data.comentario = this.confeccionCCPPForm.controls['comentario'].value === "" ? null : this.confeccionCCPPForm.controls['comentario'].value;

    // console.log('CCPP:', data);

    console.log(this.loader);

    this.getItemSub = this.ccppService.updateCcpp(data)
      .subscribe(resp => {
        if (this.loader !== null) {
          this.loader.close();
        }
        this.alertService.confirm({ message: '¡Carta Porte actualizada correctamente!', tipo: 'exito' }).subscribe(res1 => {
          if (res1) {
            this.dialogRef.close(1);
            return;
          }
        });
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'Errores' })
            .subscribe(res1 => {
              if (res1) {
              }
            });
        })

  }


  public async notificarccpp() {
    this.loader.open('Guardando y Notificando', 'Carta Porte');
    var element = document.getElementById('print-ccpp');

    await html2canvas(element, {
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight * 2,
      onclone: function (clonedDoc) {
        clonedDoc.getElementById('print-ccpp').style.opacity = 1;
      }
    }).then(canvas => {
      // para descargar la ccpp
      // let enlace = document.createElement('a');
      // enlace.download = "ccpp.png";
      // // Convertir la imagen a Base64
      // enlace.href = canvas.toDataURL();
      // // Hacer click en él
      // enlace.click();

      // enviar por mail
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL("image/jpeg", 1.0);
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight)

      var blob = pdf.output('blob');
      this.notificarForm.controls['adjunto'].setValue(blob);

      this.ccppService.sendMensaje_inc(this.notificarForm.value, 'CCPP.pdf', this.notificarForm.controls['email'].value)
        .subscribe(resp => {
          console.log(resp);
          this.submit(2);
        },
          err => {
            if (this.loader !== null) {
              this.loader.close();
            }
            this.errorService.confirm({ message: '¡Ocurrió un error al notificar la CCPP!' })
              .subscribe(res1 => {
                return;
              });

          })
    });
  }




}
