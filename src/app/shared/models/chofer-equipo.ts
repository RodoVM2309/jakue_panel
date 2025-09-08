export class ChoferEquipo {
    id: number;
    id_equipo: number;
    id_chofer: number;
    bloqueado: number;
    desc_bloqueado: string;
    nombre_chofer: {
        id: number;
        id_rol: number;
        id_usuario: number;
        nombre_persona: string;
        direccion_persona: string;
        localidad_persona: string;
        nombre_rol: string;
        cuit_persona: string;
    };
    nombre_equipo: {
        id: number;
        id_camion: number;
        id_acoplado: number;
        latitud: number;
        longitud: number;
        bloqueado: number;
        nombre_transportista: string;
        nombre_tipo_camion: string;
        nombre_marca_camion: string;
        anno_camion: number;
        patente_camion: number;
        bloqueado_camion: number;
        nombre_tipo_acoplado: string;
        nombre_marca_acoplado: string;
        anno_acoplado: number;
        patente_acoplado: number;
        bloqueado_acoplado: number;
    }
}