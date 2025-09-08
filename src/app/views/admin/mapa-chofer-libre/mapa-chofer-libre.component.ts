import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatProgressBar, MatButton, MatSelect, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { PersonasService } from './../../../shared/services/personas.service';
import { NomencladoresService } from './../../../shared/services/nomencladores.service';
import { ZonaChoferesLibresService } from './../../../shared/services/zona-choferes-libres.service';
import { AddPersonaComponent } from './../personas/add-persona/add-persona.component';
import { Page } from '../../../shared/models/page';
import { PagedData } from '../../../shared/models/paged-data';
import { ExelService } from '../../../shared/services/exel.service';
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';

export class ChoferLibre {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  id_tipo_acoplado: number;
  fecha: string;
  tipo_acoplado: string;
  cupon: string;
 latitud: number;
  longitud: number;
  last_update:string;
}

@Component({
  selector: 'app-mapa-chofer-libre',
  templateUrl: './mapa-chofer-libre.component.html',
  styleUrls: ['./mapa-chofer-libre.component.scss']
})
export class MapaChoferLibreComponent implements OnInit {

  public choferes: ChoferLibre[];
  public choferesTodos: ChoferLibre[];
  public tempChoferesViajes: ChoferLibre[];
  page = new Page();
  public filtro;
  public filtroNombre;
  public tiposCamiones;
  public zonaChoferes;
  public filtroApellido;
  public filtroHr;
  public getItemSub: Subscription;
  idchoferlibre: any;
  lat: number = -32.96104572191259;
  lng: number = -61.15374192669714;
  zoom: number = 7;
  selectedFilterZonaChofer: any;
  selectedFilterHoras: any;
  selectedFilterTipoAcoplado: any;
  previous;
  isCustomizerOpen = false;
  public iconUrlGreen = 'https://mt.google.com/vt/icon?psize=30&font=fonts/arialuni_t.ttf&color=ff304C13&name=icons/spotlight/spotlight-waypoint-a.png&ax=43&ay=48&text=%E2%80%A2';

  constructor(private personasService: PersonasService,
    public router: Router, private dialog: MatDialog, private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private excelService: ExelService,
    private nomecladoresServices: NomencladoresService,
    private zonaChoferesLibresService: ZonaChoferesLibresService,
    private errorService: AppErrorService, private atencionService: AppAtencionService,
    private loader: AppLoaderService, private alertService: AppAlertService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.cargarTodos();
    this.getItemsTiposCamion();
    this.getItemsZonaChoferes();
    //this.setPage({ offset: 0 });
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

  getItemsTiposCamion() {
    this.tiposCamiones = [];
    this.getItemSub = this.nomecladoresServices.getAllTipoCamionesSelect()
      .subscribe(data => {
        /*let tipoInicial = {
          id: 0, descripcion: "Sin filtro"
        }
        this.tiposCamiones.push(tipoInicial);*/
        data.data.tipoCamion.forEach(element => {
          this.tiposCamiones.push(element)
        });
      })
  }

  getItemsZonaChoferes() {
    this.zonaChoferes = [];
    this.getItemSub = this.zonaChoferesLibresService.getAllZonaChoferesLibresSelect()
      .subscribe(data => {
        /*let tipoInicial = {
          id: 0, descripcion: "Sin filtro"
        }
        this.zonaChoferes.push(tipoInicial);*/
        data.data.forEach(element => {
          this.zonaChoferes.push(element)
        });
      })
  }
  cargarTodos() {
    this.personasService.getAllChoferesLibresTodos()
      .subscribe(pagedData => {
        this.choferesTodos = pagedData.data;
        this.tempChoferesViajes = this.choferesTodos
      });
  }
  chanceSelectTipo() {
    let codcondiciones = '';
    let valorescondiciones = '';
    if (this.selectedFilterZonaChofer !== 0 && this.selectedFilterZonaChofer !== undefined) {
      codcondiciones = '1';
      valorescondiciones = this.selectedFilterZonaChofer.toString();
    }
    if (this.selectedFilterTipoAcoplado !== 0 && this.selectedFilterTipoAcoplado !== undefined) {
      codcondiciones += (codcondiciones !== '') ? ',2' : '2';
      valorescondiciones += (valorescondiciones !== '') ? ',' + this.selectedFilterTipoAcoplado.toString() : this.selectedFilterTipoAcoplado.toString();
    }
    if (this.selectedFilterHoras !== 0 && this.selectedFilterHoras !== undefined) {
      codcondiciones += (codcondiciones !== '') ? ',3' : '3';
      valorescondiciones += (valorescondiciones !== '') ? ',' + this.selectedFilterHoras.toString() : this.selectedFilterHoras.toString();
    }
    this.choferesTodos = this.modificarArray(this.tempChoferesViajes, codcondiciones, valorescondiciones);
  }

  modificarArray(arrayvalue, codcondiciones, valorescondiciones) {
    let arraytemp = [];
    let cod_condiciones = codcondiciones.split(',');
    let valores_condiciones = valorescondiciones.split(',');
    let cont = 0;
    let cont2;
    if (codcondiciones !== '') {
      for (let i = 0; i < arrayvalue.length; i++) {
        cont = 0;
        cont2 = -1;
        for (let j = 0; j < cod_condiciones.length; j++) {
          cont2++;
          switch (cod_condiciones[j]) {
            case '1':
              if (arrayvalue[i].id_zona !== null) {
                if (arrayvalue[i].id_zona.toString() === valores_condiciones[cont2])
                  cont++;
              }
              break;
            case '2':
              if (arrayvalue[i].id_tipo_acoplado !== null) {
                if (arrayvalue[i].id_tipo_acoplado.toString() === valores_condiciones[cont2])
                  cont++;
              }
              break;
            default:
              if (arrayvalue[i].time_last_update !== null) {
                if (parseInt(arrayvalue[i].time_last_update) < parseInt(valores_condiciones[cont2]))
                  cont++;
              }
              break;
          }
        }
        if (cont === cod_condiciones.length)
          arraytemp.push(arrayvalue[i]);
      }
      arrayvalue = arraytemp;
    }
    return arrayvalue;
  }

  limpiarFiltros() {
    this.selectedFilterZonaChofer = undefined;
    this.selectedFilterHoras = undefined;
    this.selectedFilterTipoAcoplado = undefined;
    this.chanceSelectTipo();
  }

  limpiarinfowind() {
    if (this.previous) {
      this.previous.close();
      this.previous = undefined;
    }
  }
}
