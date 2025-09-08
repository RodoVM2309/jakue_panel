import { Solicitud } from "./solicitud";

export class ListadoSolicitud {
  corredor: string | null;
  corredorCuit: string | null;
  contraparte: string | null;
  contraparteCuit: string | null;
  demandanteCuit: string | null;
  contrato: string | null;
  destinatario: string | null;
  zona: string | null;
  observaciones: string[] | null;
  saldo: number;
  dia0_solicitados: number;
  dia1_solicitados: number;
  dia2_solicitados: number;
  dia3_solicitados: number;
  dia4_solicitados: number;
  dia5_solicitados: number;
  dia6_solicitados: number;
  total_solicitados: number;
  dia0_solicitudes: Solicitud[];
  dia1_solicitudes: Solicitud[];
  dia2_solicitudes: Solicitud[];
  dia3_solicitudes: Solicitud[];
  dia4_solicitudes: Solicitud[];
  dia5_solicitudes: Solicitud[];
  dia6_solicitudes: Solicitud[];
  isSelected: number[];
  obser: any;
  propia: boolean;
  disponibles?: string | null;
  id_centro?: number;
}
