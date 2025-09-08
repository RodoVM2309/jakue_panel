export interface Cliente {
  id: number;
  razon_social: string;
}
export interface GrupoCliente {
  id: number;
  descripcion: string;
  id_proveedor: number;
}
