import { Respuesta } from './respuesta';
export class Consulta {
   public  index:number;
   public  id:number;
   public  id_chofer: number;
   public  mensaje: string;
   public  fecha: string;
   public  nombre_chofer: string;
   public  respuesta_consultas: Respuesta[];
   public  tipo:string;
   public  tipo_det:string;
   public  archivada: number;
   public  cantidad: number;
}

export class ConsultaSocket {
   id_chofer:              number;
   mensaje:                string;
   id:                     number;
   nombre_chofer:          string;
   respuesta_consultas:    Respuesta[];
   tipo:                   number;
   cantidad:               number;
}
