import { FormControl, FormGroup } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { PersonRazonSocial } from "@app/shared/models";
import { CentroDador, Producto, TablaFecha, ZonaCupoCentro } from "./models";
import { ThemePalette } from "@angular/material";
import { ElementRef, ViewChild } from "@angular/core";

export class Variables {
  formData = {};
  addSolicitudForm: FormGroup;
  public getItemSub: Subscription;
  centroDadores: CentroDador[] = [];
  filteredOptions: Observable<string[]>;
  productos: Producto[];
  medios: any;
  minDate = new Date();
  maxDate: any;
  minFecha = new Date();
  es_cupo = true;
  public inactivo: boolean = false;
  public isDisabled: boolean;
  //incorrect_demandado_cuit: boolean = false;
  incorrect_corredor_cuit: boolean = false;
  esContraparteCorredor: boolean = false;
  esContraparteDador: boolean = false;
  isIncorrectContraparte: boolean = false;
  soyContraparte: boolean = false;
  incorrect_destinatario_cuit: boolean = false;
  incorrect_codigoCosecha: boolean = false;
  noError = 0;
  estado = true;
  min = 10;
  max = 99;
  minValue: any;
  maxValue: any;
  maxValue2: any;
  esDadorCupo= localStorage.getItem("esDadorCupo") === "1" ? true : false;
  esCorredor: boolean = localStorage.getItem("tipo_interviniente") === "1" ? true : false;
  esClienteFinal=localStorage.getItem("esClienteFinal") === "1" ? true : false;
  options: string[] = [];
  validForm: boolean = false;
  isInicio: boolean = true;
  micuit: string= localStorage.getItem("cuit_cuil");
  mismo_cuit: boolean = false;
  demandado = " (Sin definir)";

  zonas: ZonaCupoCentro[] = [
    {
      id: 0,
      descripcion: "Sin especificar",
    },
  ];

  //filteredOptionsCorredores: Observable<Razon[]>;
  filteredOptionsCorredores: PersonRazonSocial[] = [];
  filteredOptionsContrapartes: PersonRazonSocial[] = [];
  filteredOptionsDestinatarios: PersonRazonSocial[] = [];
  filteredOptionsDestinatarios2: Observable<PersonRazonSocial[]>;
  isLoading = false;
  noEsCorredorDemandando = false;
  tablaFechas: TablaFecha[] = [];
  cantDias = 7;
  cantidadCupos = 0;
  selectedFecha = false;
  invalidFechaCant = false;
  personEmpty = new PersonRazonSocial("", "");
  color: ThemePalette = "accent";
  usaMTR: boolean = localStorage.getItem("usaMtr") == "1" ? true : false;
  invalidZona = false;

}
