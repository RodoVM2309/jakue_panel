export class HorarioPuerto {
  dia: number;
  dia_semana: string;
  id_puerto: number;
  hora_inicio: string;
  hora_fin: string;
  tam_ventana: string;
  tam_ventanaHora: string;
  cam_ventana: number;
  productos: Productos[];
  list_productos: string;
  list_productosShort: string;
  ventanillas: Ventanilla[];
}
export class Ventanilla {
  id: number;
  dia: number;
  id_puerto: number;
  inicio: string;
  fin: string;
}

export class Productos {
  id: number;
  descripcion: string;
  cupo_obligatorio: number;
  codigo: string;
}


export class Filtro {
  id_destino: string;
  id_producto: string;
  sem: string;
}




export interface ConfigBanda {
  success: boolean;
  status: number;
  data: Data;
}

export interface Data {
  configuracion_destino: Configuracion_destino;
  rowHeaders: string[];
  colHeaders: string[];
  total_turnos_producto: number[];
  total_productos_puerto: number[];
  dataSet: DataSet[];
}


export interface Configuracion_destino {
  id_destino: string;
  id_producto: string;
  estado?: string;
  corte?: string;
  semana?: number;
  turno_banda?: number;
  amp_cupo_antes?: number;
  amp_cupo_despues?: number;
  banda?: number;
  tolerancia_horas_antes?: number;
  tolerancia_horas_despues?: number;
  tolerancia?: number;
  acciones?: number;
  grilla?: number[];
}

export interface DataSet {
  lunes: string;
  martes: string;
  miercoles: string;
  jueves: string;
  viernes: string;
  sabado: string;
  domingo: string;
}




