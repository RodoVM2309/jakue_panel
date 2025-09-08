import { Component, OnInit, PipeTransform, Pipe } from "@angular/core";
import { Router } from "@angular/router";
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { BocaService } from "./../../../shared/services/boca.service";
import { Page } from "../../../shared/models/page";
import { map, startWith } from "rxjs/operators";
import { PersonasService } from "app/shared/services/personas.service";
import { Observable } from "rxjs";
import { FormGroup, FormBuilder } from "@angular/forms";

export class Estaciones {
  id: number;
  razon_social: string;
  direccion: string;
  nombre_localidad: string;
  nombre_provincia: string;
  latitud: number;
  longitud: number;
  rrcc: string;
  es_agro: string;
  localidad: any;
}

export class Pais {
  id: number;
  descripcion: string;
}

export class Provincia {
  id: number;
  descripcion: string;
}

export class Localidad {
  id: number;
  descripcion: string;
  id_provincia: number;
}

export class Rsocial {
  id_provincia: number;
  id_localidad: number;
  descripcion: string;
}

@Component({
  selector: "app-mapa-estaciones",
  templateUrl: "./mapa-estaciones.component.html",
  styleUrls: ["./mapa-estaciones.component.scss"]
})
export class MapaEstacionesComponent implements OnInit {
  public itemForm: FormGroup;
  public choferes: Estaciones[];
  public choferesTodos: Estaciones[];
  public tempChoferesViajes: Estaciones[];
  page = new Page();

  idchoferlibre: any;
  lat: number = -32.96104572191259;
  lng: number = -61.15374192669714;
  zoom: number = 7;

  previous;
  isCustomizerOpen = false;
  public iconUrlGreen =
    "https://panel.muvinapp.com/estaciones/gulkmarker2.png";

  selectlocalidad: any;
  selectrs: any;
  selectProv: any;

  paises: Pais[];
  provincias: Provincia[];
  localidades: Localidad[];
  obj_localidades: Localidad[];

  objFiltrado: Estaciones[];
  rsociales: Rsocial[];
  obj_rs: Rsocial[];
  filteredOptions: Observable<Localidad[]>;
  agrupado_mapa: boolean;

  vertodo: boolean;
  vertodors: boolean;
  vertodoprov: boolean;

  constructor(
    private bocaService: BocaService,
    public router: Router,
    private loader: AppLoaderService,
    private personasService: PersonasService,
    private fb: FormBuilder,
  ) {
    this.agrupado_mapa = false;
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.selectlocalidad = '270';
    this.vertodo = true;
    this.vertodors = true;
    this.vertodoprov = true;
  }

  ngOnInit() {
    this.getPais();
    this.cargarTodos();
    this.itemForm = this.fb.group({
      id_provincia: [""],
      id_localidad: [""],
      pais: [""],
      provincia: [ ""],
      rsocial: [ ""]
    });
  }

  ngOnDestroy() {

  }

  agruparMapa() {
    this.agrupado_mapa = !this.agrupado_mapa;
  }

  get f() {
    return this.itemForm.controls;
  }

  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

  cargarTodos() {
    this.provincias      = [];
    this.localidades     = [];
    this.obj_localidades = [];
    this.rsociales       = [];
    this.obj_rs          = [];

    let prov = {
      id: 0,
      descripcion: 'Ver todos'
    };
    this.provincias.push(prov);

    let localid = {
      id: 0,
      descripcion: 'Ver todos',
      id_provincia: 0
    };
    this.localidades.push(localid);

    let rsoci = {
      id_localidad: 0,
      id_provincia: 0,
      descripcion: 'Ver todas'
    };
    this.rsociales.push(rsoci);

    this.bocaService.getAllBocaTodos().subscribe(pagedData => {
      this.choferesTodos = pagedData.data;
      this.choferesTodos.forEach(estacion => {
        prov = {
          id: estacion.localidad.id_provincia,
          descripcion: estacion.nombre_provincia,
        };
        this.provincias.push(prov);
        localid = {
          id: estacion.localidad.id,
          descripcion: estacion.localidad.descripcion,
          id_provincia: estacion.localidad.id_provincia
        };
        this.localidades.push(localid);

        rsoci = {
          id_provincia: estacion.localidad.id_provincia,
          id_localidad: estacion.localidad.id,
          descripcion: estacion.razon_social
        };
        this.rsociales.push(rsoci);

      });
      this.obj_localidades = this.localidades;
      this.obj_rs          = this.rsociales;
    });
  }

  getPais() {
    this.personasService.getPais().subscribe(data => {
      this.paises = data.data.paises;
    });
  }

  getProvincias() {
    this.loader.open();
    this.getProvinciasxPais(this.itemForm.controls["pais"].value);
  }

  getProvinciasxPais(v) {
    this.personasService.getProvincias(v).subscribe(data => {
      this.provincias = data.data;
      this.localidades = [];
      if (this.loader !== null) {
        this.loader.close();
      }
    });
  }

  getLocalidades() {
    this.loader.open();
    this.getLocalidadesxProvincia(this.itemForm.controls["provincia"].value);
  }

  getLocalidadesxProvincia(v) {
    this.personasService.geLocalidades(v).subscribe(data => {
      this.localidades = data.data;
      this.filteredOptions = this.itemForm.controls[
        "id_localidad"
      ].valueChanges.pipe(
        startWith<string | Localidad>(""),
        map(value => (typeof value === "string" ? value : value.descripcion)),
        map(descripcion =>
          descripcion ? this._filter(descripcion) : this.localidades.slice()
        )
      );
      if (this.loader !== null) {
        this.loader.close();
      }
    });
  }

  filtrarProvincia() {
    this.vertodoprov     = false;
    const prov_filtrada  = this.itemForm.controls['id_provincia'].value;
    this.selectProv      = prov_filtrada.toString();
    this.obj_localidades = this.localidades;
    this.obj_localidades =  this.obj_localidades.filter(localidad =>  localidad.id_provincia === prov_filtrada);
    this.obj_rs          = this.rsociales;
    this.obj_rs          =  this.obj_rs.filter(razonsocial =>  razonsocial.id_provincia === prov_filtrada);
    let localid = {
      id: 0,
      descripcion: 'Ver todos',
      id_provincia: 0
    };
    this.obj_localidades.push(localid);

    let rsoci = {
      id_localidad: 0,
      id_provincia: 0,
      descripcion: 'Ver todas'
    };
    this.obj_rs.push(rsoci);
    if (prov_filtrada === 0) {
      this.vertodoprov = true;
      this.obj_localidades = this.localidades;    
      this.obj_rs          = this.rsociales;    
    }
  }

  filtrarlocalidad() {
    this.vertodo = false;
    const localida_filtrada = this.itemForm.controls['id_localidad'].value;
    this.vertodors = true;
    this.selectlocalidad    = localida_filtrada.toString();
    this.obj_rs             = this.rsociales;
    this.obj_rs             =  this.obj_rs.filter(razonsocial =>  razonsocial.id_localidad === localida_filtrada);
    let rsoci = {
      id_localidad: 0,
      id_provincia: 0,
      descripcion: 'Ver todas'
    };
    this.obj_rs.push(rsoci);
    if (localida_filtrada === 0) {
      this.vertodo = true;
      this.obj_rs  = this.rsociales; 
    }
  }

  filtrarrsocial() {
    this.vertodors = false;
    const rs = this.itemForm.controls['rsocial'].value;
    this.selectrs = rs.toString();
    if (rs === 'Ver todas') {
      this.vertodors = true;
    }
  }

  private _filter(descripcion: string): Localidad[] {
    const filterValue = descripcion.toLowerCase();
    return this.localidades.filter(
      option => option.descripcion.toLowerCase().indexOf(filterValue) >= 0
    );
  }

  limpiarFiltros() {
    this.vertodo = true;
    this.vertodors = true;
    this.vertodoprov = true;
    this.itemForm.controls['id_provincia'].setValue(null);
    this.itemForm.controls['id_localidad'].setValue(null);
    this.itemForm.controls['rsocial'].setValue(null);
  }

  limpiarinfowind() {
    if (this.previous) {
      this.previous.close();
      this.previous = undefined;
    }
  }
}


