export class SituacionPuerto {
    id: number;
    descripcion: string;
}

export class SituacionPuertoDestino {
    id_horario:     number;
    inicio:         string;
    fin:            string;
    ocupados:       number;
    cantidad:       number;
    porciento:      number;
    checked:        boolean;
}
