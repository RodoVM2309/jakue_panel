export class Origen {
  slice(): any {
    throw new Error("Method not implemented.");
  }
  filter(arg0: (option: any) => boolean): Origen[] {
    throw new Error("Method not implemented.");
  }
  id: number;
  id_localidad: string;
  descripcion: string;
  direccion: string;
  nombre_contacto: string;
  telefono: string;
  email: string;
  bloqueado: number;
  id_persona_rol: string;
  longitud: string;
  latitud: string;
  nombre_localidad: string;
  nombre_centro: string;
  desc_bloqueado: string;
  imagen?: number;
  imagenC?: string;
}
