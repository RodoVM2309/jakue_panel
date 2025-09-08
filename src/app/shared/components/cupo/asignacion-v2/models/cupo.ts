export class Cupo {
  id: string;
  idCupoterminal: string | null;
  id_destino: string | null;
  id_producto: string | null;
  nroContrato: string | null;
  caratula: string | null;
  fecha: string | null;
  idCuitDestinatario: string | null;
  idCuitIntermediario: string | null;
  idCuitIntermediario1: string | null;
  idCuitIntermediario2: string | null;
  idCuitRemComercial: string | null;
  nombreRemitente: string | null;
  idCuitCorredorC: string | null;
  nombreCorredorComprador: string | null;
  idCuitMercadoATermino: string | null;
  idCuitCorredorV: string | null;
  nombreCorredorVendedor: string | null;
  idCuitRepresentanteEntregador: string | null;
  idCuitDestino: string | null;
  idCuitIntermediarioFlete: string | null;
  idCuitRemitenteC: string | null;
  idCuitTitula: string | null;
  idCuitTransportista: string | null;
  nombreDestinatario: string | null;
  nombreDestino: string | null;
  asignado: string | null;
  ultima_fecha_asignacion: string | null;
  soyReceptor: SoyReceptor;
  cupoAsignadoDadorCuit: string | null;
}

export interface SoyReceptor {
  id: string;
  id_cupo: string;
  receptorCuit: string;
  dadorCuit: string;
  dadorId: string;
  dadorNombre: string;
}

