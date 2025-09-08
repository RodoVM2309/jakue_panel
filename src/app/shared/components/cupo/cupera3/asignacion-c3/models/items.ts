export class Items {
  id: number;
  descripcion: string;
}

export class ItemsCuit {
  id: number;
  cuit: string;
  descripcion: string;
}
export class ItemsDestinatarios {
  id: number;
  cuit: string;
  descripcion: string;
  destinos: ItemsCuit[];
}
export class ItemsComercial {
  id: number;
  cuit: string;
  descripcion: string;
  clientes: ItemsCuit[];
}

export class ItemCartaPorte {
  comercial: ItemsCuit;
  cliente: ItemsCuit;
  contrato: string;
}

