export class ChoferZona {
    id: number;
    id_rol: number;
    id_usuario: number;
    nombre_persona: string;
    direccion_persona: string;
    localidad_persona: string;
    nombre_rol: string;
    cuit_persona: string;
    longitud: number;
    latitud: number;
    id_equipo: number;
    id_chofer_equipo: number;
    estado: string;
    patente: string;
    distancia: number;
    nombre_transportista: string;
    intermediario_transportista: string;
    id_intermediario: number;
    celular: string;
    tipo_acoplado: number;
    patente_acoplado: string;
    zona_activa: {
      id: number;
      descripcion: string;
      id_centro: number;
      nombre_centro: string;
    };
    nombre_zona: string;
    id_zona: number;
    app_instalada: number;
    desc_app: string;
    enListaNegra: string;
    evaluacion: number;
  }