export interface ScanPorteria {
  id: string;
  id_cupo: string;
  alfanumerido: string;
  accion: string;
  app: string;
  detalle: string;
  fecha: string;
  id_user: string;
}

export interface FiltroInterno {
  campo: string;
  valor: string;
}

export interface CupoAsignado {
  id: string;
  id_cupo: string;
  rucDador: string;
  nombreDador: string;
  rucReceptor: string;
  nombreReceptor: string;
  fechaAsignacion: string;
}
