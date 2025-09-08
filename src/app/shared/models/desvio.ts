import { Viaje} from './viaje';
export class Desvio {
    id:number;
    id_viaje:number;
    fecha:Date;
    id_destino:number;
    id_desvio_motivo:number;
    observaciones:string;
    nombre_viaje: Viaje;

}