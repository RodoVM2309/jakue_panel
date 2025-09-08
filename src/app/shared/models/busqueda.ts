import {TipoAcoplado} from './tipo-acoplado';
export class Busqueda {
    id: number;
    id_centro: number;    
    fecha: string;
    id_producto: number;
    id_pedido: number;
    condiciones_pago: string;
    da_gasoil: number;
    da_gasoil_txt: string;
    da_efectivo: number;
    da_efectivo_txt: string;
    precio_viaje: number;
    carga_peligrosa: number;
    carga_peligrosa_txt: string;
    observaciones: string;
    id_medio_pago: number;
    longitud_localidad: string;
    latitud_localidad: string;
    longitud_zona_destino: string;
    latitud_zona_destino: string;
    localidad_carga: string;
    zona_destino: string;
    finalizada: number;
    nombre_producto: string;
    tipo_acoplado: TipoAcoplado[];
}