export class Person {
    id: number;
    id_tipo_persona: number;
    id_pais: number;
    nombre: string;
    id_localidad: number;
    apellidos: string;
    razon_social: string;
    cuit_cuil: string;
    domicilio: string;
    telefono: string;
    movil_key:string;
    email: string;
    localidad: {
        id: number;
        id_provincia: number;
        descripcion: string;
        codigopostal: string;
        provincia: {
            id: number;
            descripcion: string;
            id_pais: number;
            pais: {
                id: number;
                descripcion: string;
            }
        }
    };
    tipoPersona: {
        id: number;
        descripcion: string;
    }
};
