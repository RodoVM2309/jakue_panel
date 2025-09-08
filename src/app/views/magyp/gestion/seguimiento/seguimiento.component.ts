import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

import { MatTable, MatTableDataSource, PageEvent, MatSnackBar } from '@angular/material';
import { MatDialogRef, MatDialog } from '@angular/material';

import { MagypService } from 'app/shared/services/magyp.service';
import { Test, ViajesSeguimiento, Transpor, UltimoTest } from 'app/shared/models/magyp-cadena';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.scss']
})
export class SeguimientoComponent implements OnInit {
  buscarForm: FormGroup;
  isSidenavOpen = true;
  cuitBuscar: string = '20268118803';
  patenteBuscar: string;
  criterios = [
    {
      id: 0,
      descripcion: 'CUIT Transportista'
    },
    {
      id: 1,
      descripcion: 'PATENTE'
    },
  ]
  mapCenter = {
    lat: -33.954506,
    lng: -59.681654
  }
  transportista: Transpor;
  stop: ViajesSeguimiento[] = [];
  activeViaje: ViajesSeguimiento;
  carga: any;
  zoom = 6;
  etiqueta = '';
  encontradoTrans = false;
  maxValor: number = 0;
  minValor: number = 0;

  public iconUrlBlue = 'https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png';

  previous;
  public iconUrlGray = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png";
  public iconUrlGreen = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_green.png";

  isSearchCuit = false;
  isSearchPatente = false;
  isInit = true;

  constructor(
    private loader: AppLoaderService,
    private magypService: MagypService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private fb: FormBuilder,) { }

  ngOnInit() {
    this.buscarForm = this.fb.group({
      id_criterio: [0, Validators.required],
    });
    this.chanceSelectTipo();
  }

  chanceSelectTipo() {
    this.isInit = false;
    let val = this.buscarForm.controls['id_criterio'].value;
    switch (val) {
      case 0:
        this.etiqueta = ' 1-CUIT';
        this.isSearchCuit = true;
        this.isSearchPatente = false;
        if (!this.buscarForm.contains('cuit')) {
          this.buscarForm.addControl('cuit', new FormControl("", [Validators.required]))
          if (this.buscarForm.contains('patente')) {
            this.buscarForm.removeControl('patente');
          }
        }

        break;
      case 1:
        this.etiqueta = '1- Patente';
        this.isSearchCuit = false;
        this.isSearchPatente = true;
        if (!this.buscarForm.contains('patente')) {
          this.buscarForm.addControl('patente', new FormControl("", [Validators.required, Validators.minLength(3)]))
          if (this.buscarForm.contains('cuit')) {
            this.buscarForm.removeControl('cuit');
          }
        }
        break;

      default:
        break;
    }
  }


  buscarTransportista() {
    this.loader.close();
    let data = {};
    if (this.buscarForm.controls['id_criterio'].value == 0) {
      data = {
        cuit: this.buscarForm.controls['cuit'].value,
        patente: ''
      };
    } else {
      data = {
        cuit: '',
        patente: this.buscarForm.controls['patente'].value
      };
    }
    this.loader.open('Espere por favor...', 'Buscando..');
    this.magypService.getSeguimiento(data)
    .subscribe(
      res => {
        this.loader.close();
        this.encontradoTrans = false;
        this.transportista = res.data.transportista;
        // console.log(this.transportista);
        if (res.data.stop.success === false) {
          // console.log('Error de STOP: "' + res.data.stop.data + '"');
          this.snack.open('Error al obtener datos de STOP', 'Cerrar', { duration: 4000 });
        }
        if (res.data.stop.data.length > 0) {
          res.data.stop.data.forEach(element => {
            element.latitudOrigen = parseFloat(element.latitudOrigen);
            element.longitudOrigen = parseFloat(element.longitudOrigen);
            element.latitudDestino = parseFloat(element.latitudDestino);
            element.longitudDestino = parseFloat(element.longitudDestino);
          });
          this.stop = res.data.stop.data;
          this.stop = this.stop.sort((a, b) => new Date(b.fechaActivado).getTime() - new Date(a.fechaActivado).getTime());
          this.activeViaje = this.stop[0];
        }
        if (this.transportista !== null) {
          this.encontradoTrans = true;
          let result = '';
          switch (parseInt(this.transportista.ultimoTest.resultado, 10)) {
            case 0:
              result = this.transportista.ultimoTest.fecha + ': No';
              break;
            case 1:
              result = this.transportista.ultimoTest.fecha + ': Sí > Negativo';
              break;
            case 2:
              result = this.transportista.ultimoTest.fecha + ': Sí > <span class="div-resultado">&nbsp;&nbsp; Positivo&nbsp;&nbsp;</span>';
              break;
            default:
              result = '<strong>NO INGRESADO</strong>';
          }
          switch (parseInt(this.transportista.ultimoTest.seguimiento, 10)) {
            case 0:
              this.transportista.ultimoTest.seguimientoString = 'No';
              break;
            case 1:
              this.transportista.ultimoTest.seguimientoString = 'Si';
              break;
            default:
              this.transportista.ultimoTest.seguimientoString = '<strong>NO INGRESADO</strong>';
          }

          this.transportista.ultimoTest.resultadoString = result;
        } else {
          if (res.data.stop.data.length === 0) {
            this.snack.open('No se encontraron resultados', 'Cerrar', { duration: 4000 });
          }
        }
      },
      error => {
        this.encontradoTrans =  false;
        this.loader.close();
        let message = '¡Se presentaron problemas al buscar los datos!';
        if (error.data) {
          if (error.data.message) {
            message = error.data.message;
          } else if (error.data[0].message) {
            message = error.data[0].message;
          }
        }
        this.snack.open(message, 'Cerrar', { duration: 4000 });
      }
    );

  }

  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }
  
  seleccionar(i) {
    this.activeViaje = this.stop[i];
  }
}
