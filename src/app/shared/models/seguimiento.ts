export interface SeguimientoTerminal {
  fecha: string;
  despacho: string;
  consignatario: string;
  zona: string;
  grupo_cliente: string;
  cliente: string;
  reserva: string;
  cupo: string;
  id_cupo: string;
  producto: string;
  detalle_producto: string;
  tn: string;
  km_term: string;
  empresa_transp: string;
  nombre_chofer: string;
  patente: string;
  doc: string;
  fecha_turno: string;
  arribo: string;
  cont: string;
}

export interface ComboSelect {
  id: number;
  descripcion: string;
}
