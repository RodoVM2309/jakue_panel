import { DetalleCupo } from "./detalle-cupo";

export interface TiposDespachos {
  success: boolean;
  status: number;
  data: TipoDespacho[];
}

export interface TipoDespacho {
  id: number;
  descripcion: string;
  forma: string;
}

//Productos
export interface ListadoProductosFertilizantes {
  success: boolean;
  status: number;
  data: ProductoFertilizante[];
}

export interface ProductoFertilizante {
  id: number;
  descripcion: string;
  cupo_obligatorio?: number;
  codigo?: any;
  id_tipo_producto?: number;
  id_tipo_despacho?: number;
}

export interface ProductoMulti {
  display: string;
  value: number;
}

// Rol fertilizantes
export interface ListaRolFertilizante {
  success: boolean;
  status: number;
  data: Persona[];
}

export interface Persona {
  id: number;
  id_rol: number;
  id_usuario: number;
  activo: number;
  nombre_persona: string;
  direccion_persona: string;
  localidad_persona: string;
  nombre_rol: string;
  cuit_persona: string;
  kmetros?: any;
  horas?: any;
}

export interface ListadoOrigenesFetilizantes {
  success: boolean;
  status: number;
  data: Origenes[];
}

export interface Origenes {
  id: number;
  id_localidad: number;
  descripcion: string;
  direccion?: any;
  nombre_contacto?: any;
  telefono?: any;
  email?: any;
  bloqueado: number;
  imagen: number;
  nombre_imagen?: any;
  id_persona_rol: number;
  longitud: number;
  latitud: number;
  id_zona_destino: number;
  domicilio?: any;
  id_tipo_destino?: any;
  id_situacion_puerto: number;
  horas_atraso?: any;
  CodigoPlantaOncca: number;
  hora_corte?: any;
  tiempo_para_demorado: string;
  oculto: number;
  solucion_muvin: number;
}


export interface PedidoFertilizantes {
  m: string;
  id_cliente: number;
  solicitante: string;
  terminal: number;
  id_origen: number;
  contrata?: any;
  estado?: number;
  observaciones: string;
  camiones: CamionFertilizante[];
}

export interface CamionFertilizante {
  fecha_pedido: string;
  id_chofer: string;
  stoc: string;
  productos: Producto[];
}

export interface Producto {
  id_tipo_despacho: string;
  tipo_despacho: string;
  contrato: string;
  id_producto: number;
  producto: string;
  composicion?: string;
  cantidad: number;
}

export interface DetalleReserva {
  id: string;
  id_cliente: string;
  cliente: string;
  terminal: string;
  destino: string;
  solicitante?: any;
  observaciones?: string;
  estado: number;
  reservas: Reserva[];
}



export interface Reserva {
  id_chofer?: number;
  chofer?: string;
  cuit?: string;
  estado?: string;
  id_reserva ?: string;
  patente_acoplado?: string;
  patente_camion?: string;
  stoc: string;
  fecha_pedido: string;
  productos: Producto[];
  cupos: DetalleCupo[]
}

export interface  AsignacionDirecta {
  id_chofer?: number;
  id_reserva: number;
}

export interface DetalleProductoRP {
  id: number;
  id_prod_erp: number;
  id_prod_muvin: number;
  descripcion_prod_erp: string;
}


export interface FiltrosSeguimiento {
  begin: string;
  end: string;
  id_terminal: number;
  id_tipo: number;
  consignatario: string;
  id_zona: number;
  id_grupoCliente: number;
  cliente: string;
  cupo: string;
  id_producto: string;
  id_detalleProducto: number;
  km_terminal: string;
  empresaTransporte: string;
  dniChofer: string;
  doc: string;
  page: number;
}

export interface Proveedor {
  id: number;
  razon_social: string;
  id_cliente: number;
}




