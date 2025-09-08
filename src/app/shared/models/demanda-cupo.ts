export class DemandaCupo {
    "id_demanda_cupo" : number;
    "fechaCupo": string;
    "fechaDesde": string;
    "fechaHasta": string;
    "id_demandante": number;
    "id_demandado": number;
    "observaciones": string;
    "codigoCosecha": number;
    "id_producto":number;
    "cantidad": number;
    "asignado": number;
    "contrato": string;
    "zona": string;
    "nombreDemandante":string;
    "nombreDemandado": string;
    "nombreProducto": string;
    "alfanumerico"?: [{
        id_cupo: number;
        observaciones?: string;
    }];
}