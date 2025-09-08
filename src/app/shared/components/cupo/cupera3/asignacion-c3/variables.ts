import { FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import {
  Asignacion,
  Filtro,
  Items,
  ItemsComercial,
  ItemsCuit,
  ItemsDestinatarios,
  ListadoAsignacionProducto,
  ListadoAsignacionZona,
  ListadoSolicitudes,
  Seleccion,
} from "./models";
import * as moment from "moment";
import { DiaCupos } from "./models/dia";

export class Variables {
  getItemSub: Subscription;

  filtrarForm: FormGroup;
  gestionForm: FormGroup = new FormGroup({
    selectedAccion: new FormControl(""),
    cuposxModulos: new FormControl(""),
    selectedCabecera: new FormControl(""),
  });

  seleccionados: Seleccion[] = [];
  minDate = new Date();
  hoyString = moment().format("YYYY-MM-DD");
  hoyMoment: moment.Moment = moment();
  dia5Moment: moment.Moment = moment();
  validFecha = true;
  inicioComponente= true;
  visible = true;
  usaMTR: boolean = localStorage.getItem("usaMtr") == "1" ? true : false;
  cuposDisponiblesApi: any[] = [];
  solicitudesApi: any[] = [];
  detallesDisponiblesApi: any;
  filtro: Filtro = {
    idProductos: [],
    idZonasCupo: [],
    cuitComercial: "",
    cuitCliente: "",
    cuitDestinatario: "",
    cuitDestino: "",
    contrato: "",
    fecha: ''
  };
  zonasCupos: ItemsCuit[] = [];
  comerciales: ItemsComercial[] = [];
  clientes: ItemsCuit[] = [];
  destinatarios: ItemsDestinatarios[] = [];
  destinos: ItemsCuit[] = [];
  contratos: Items[] = [];
  showDetalleProductoZona = false;
  showDetalleZona = false;
  productosCupos: any[] = [];
  listadoAsignacionProducto: ListadoAsignacionProducto[] = [];
  listadoAsignacionZona: ListadoAsignacionZona[] = [];
  listadoSolicitudes: ListadoSolicitudes[] = [];
  selectedProductoRow: ListadoAsignacionProducto;
  initDiaCupo: DiaCupos = {
    asignados: 0,
    solicitados: 0,
    cupos: [],
  };
  isInMobile = false;
  placeholderAccion=' asignar/asignar todos/rechazar';
  placeholderCabecera=' 3 > Seleccionar cabecera';
  disabledAcciones = true;
  validatedForm = false;
  disabledSelectCabecera = true;
  preAsignacion: Asignacion[] = [];
  selectedItemAsignacion: ListadoAsignacionZona;
  acciones: Items[] = [
    {
      id: 0,
      descripcion: "Asignar",
    },
    {
      id: 1,
      descripcion: "Asignar todos",
    },
    {
      id: 2,
      descripcion: "Rechazar",
    },
  ];
  isSelectedZonaCupo:boolean = true;
  valorTextoSelect:string = '';
  chanceFiltroZona= false;
  integracionCentro:boolean= true;

}
