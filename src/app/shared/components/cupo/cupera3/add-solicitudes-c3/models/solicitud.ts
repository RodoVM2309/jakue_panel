import { Distribucion } from "./distribucion";

export class Solicitud {
  demandadoCuit?: string;
  corredor?: string;
  demandanteCuit?: string;
  contraparte?: string;
  destinatario?: string;
  id_producto: number;
  /* fechaCupo: string;
  fechaHasta: string;
  cantidad: string; */
  contrato: string;
  zona: string;
  //observaciones: string;
  codigoCosecha: string;
  id_demandante?: number;
  id_demandado?: number;
  id_gestiona?: number;
  id_zona_solicitud?: number;
  distribucion: Distribucion[];
  canal?: string;

}
