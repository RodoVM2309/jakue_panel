export class Promocion {
  public id: string;
  public nombre: string;
  public cant_beneficiarios: string;
  public intervalo: string;
}
export class Concurso {
  public id: string;
  public nombre: string;
  public fecha: string;
  public bases_pdf: string;
  public vigente: string;
}
export class Noticia {
  public id: string;
  public titulo: string;
  public bajada: string;
  public contenido: string;
  public fecha: string;
  public imagen: string;
  public fuente: string;
  public link_noticia_original: string;
}
export class Sorteo {
  public id: string;
  public nombre: string;
  public imagen: string;
  public fecha: string;
  public vigente: string;
}
export class GanadoresSorteo {
  public id_sorteo: string;
  public nombre: string;
  public apellidos: string;
  public dni: string;
  public telefono: string;
}
