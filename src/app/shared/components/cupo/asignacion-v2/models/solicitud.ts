export class Solicitud {
  id_demanda_cupo: string | null;
  idCuitDestinatario: string | null;
  idCuitDestino: string | null;
  id_producto: string | null;
  id_zona_solicitud: string | null;
  fecha: string | null;
  corredor: string | null;
  demandanteCuit: string | null;
  destinatario: string | null;
  observaciones: string | null;
  contraparte: string | null;
  contrato: string | null;
  cantidad: string | null;
  asignado: string | null;
  corredor_demanda: string | null;
  propia?: boolean;
  disponibles?: string | null;
  caratula?: string | null;
}
