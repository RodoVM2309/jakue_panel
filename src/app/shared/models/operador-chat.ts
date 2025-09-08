export class OperadorChat {
  id: string;
  nombre: string;
  apellidos: string;
  id_centro: number;
  telefono?: string;
}
export class OperadorClienteChat {
  id: string;
  nombre: string;
  apellidos: string;
  id_centro: number;
  telefono?: string;
  cuitCentro?: string;
  id_padre: number;
  nombreCentro: string;
}
