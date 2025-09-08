export class HorarioFertilizantes {
  dia:              number;
  dia_semana:       string;
  id_origen:        number;
  hora_inicio:      string;
  hora_fin:         string;
  tam_ventana:      string;
  tam_ventanaHora:  string;
  cam_ventana:      number;
  productos:        Productos[];
  ventanillas:      Ventanilla[];
}
export class Ventanilla {
  id:             number;
  dia:            number;
  id_origen:      number;
  inicio:         string;
  fin:            string;
}

export class Productos {
    id:               number;
    descripcion:      string;
    cupo_obligatorio: number;
    codigo:           string;
}


export class Filtro {
  id_tipo_despacho: string;
  id_origen: string;
  sem: string;
  m?: string;
}

export interface ConfigBanda {
  success: boolean;
  status: number;
  data: Data;
}

export interface Data {
  configuracion_origen: Configuracion_origen;
  rowHeaders: string[];
  colHeaders: string[];
  total_turnos_producto: number[];
  total_productos_origen: number[];
  dataSet: DataSet[];
}


export interface Configuracion_origen {
id_tipo_despacho: string;
id_origen: string;
estado?: string;
corte?: string;
m: string;
semana?: number;
turno_banda?: number;
amp_cupo_antes?: number;
amp_cupo_despues?: number;
banda?: number;
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




