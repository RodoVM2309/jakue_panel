export class PlayaIntermedia {

  filter(arg0: (option_d: any) => boolean): PlayaIntermedia[] {
    throw new Error("Method not implemented.");
  }
  slice(): any {
    throw new Error("Method not implemented.");
  }

  id:                    number;
  id_localidad:          number;
  descripcion:           string;
  direccion:             null;
  nombre_contacto:       null;
  telefono:              string;
  email:                 null;
  bloqueado:             number;
  solucion_muvin:        number;
  imagen:                number;
  id_persona_rol:        number;
  longitud:              number;
  latitud:               number;
  id_zona_destino:       number;
  domicilio:             string;
  id_situacion_puerto:   number;
  horas_atraso:          number;
  CodigoPlantaOncca:     number;
  tam_ventana:           null;
  cam_ventana:           null;
  hora_inicio:           null;
  hora_fin:              null;
  nombreZonaDestino:     string;
  nombreTipoDestino:     string;
  nombreSituacionPuerto: string;
  desc_bloqueado:        string;
  desc_solucion_muvin:   string;
}
