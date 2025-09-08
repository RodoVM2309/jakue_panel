import { estados } from "../functions/logs-busqueda";
import { CupoAsignado, ScanPorteria } from "../interfaces/types";

export class LogsBusqueda {
  id: string;
  cupo: string;
  estado: string;
  terminal: string;
  producto: string;
  fecha: string;
  fechaArribado: string;
  fechaDescargado: null;
  nombreChofer: string;
  telefonoChofer: string;
  rucChofer: string;
  placaCamion: string;
  placaAcoplado: string;
  scanPorteria: ScanPorteria;
  cupoAsignados: CupoAsignado[];

  constructor(data) {
    this.id = data.id;
    this.cupo = data.cupo;
    this.estado = data.estado;
    this.terminal = data.terminal;
    this.producto = data.producto;
    this.fecha = data.fecha;
    this.fechaArribado = data.fechaArribado;
    this.fechaDescargado = data.fechaDescargado;
    this.nombreChofer = data.nombreChofer;
    this.telefonoChofer = data.telefonoChofer;
    this.rucChofer = data.rucChofer;
    this.placaCamion = data.placaCamion;
    this.placaAcoplado = data.placaAcoplado;
    this.scanPorteria = data.scanPorteria;
    this.cupoAsignados = data.cupoAsignados;
  }

  get procedencia() {
    if (this.cupoAsignados.length > 0) {
      let procedencia = '';
      for(let value of this.cupoAsignados) {
        procedencia += `${value.nombreReceptor} => `;
      }
      procedencia = procedencia.substring(0, procedencia.length - 4);
      return procedencia;
    } else {
      return "Sin asignaciones"
    }
  }

  get chofer() {
    return (this.nombreChofer) ? this.nombreChofer : "Sin asignaciones";
  }

  get patente() {
    return (this.placaCamion) ? this.placaCamion : "Sin asignaciones";
  }

  get estadoClave() {
    if (this.estado == null || this.estado == '' || this.estado == "null") {
      return "SIN PROCESAR";
    } else {
      return estados[this.estado].clave;
    }
  }

  get fechaScan() {
    return (this.scanPorteria) ? this.scanPorteria.fecha : "No Escaneado"
  }
}
