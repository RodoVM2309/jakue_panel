import { Solicitud } from ".";

export class Asignacion {
  dia: string;
  receptorCuit: string;
  contraparte: string;
  contrato: string;
  destinatario: string;
  cantidad: number;
  disponibles: number;
  demandas: Solicitud[];
}
