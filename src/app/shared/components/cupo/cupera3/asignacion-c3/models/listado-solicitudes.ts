import { DiaSolicitudes } from "./dia";

export class ListadoSolicitudes {
  comercial: string;
  comercialCuit: string;
  zona: string;
  id_zona_solicitud: string;
  cliente: string;
  clienteCuit: string;
  destino: string;
  destinoCuit: string;
  contrato: string;
  cantidad: number;
  disponibles: number;
  saldo: number;
  total_solicitados: number;
  observaciones:string[];
  dia0: DiaSolicitudes;
  dia1: DiaSolicitudes;
  dia2: DiaSolicitudes;
  dia3: DiaSolicitudes;
  dia4: DiaSolicitudes;
  isSelected: number[];
  obser: any;
  propia: boolean;
}
