export class Dador {
  slice(): any {
    throw new Error("Method not implemented.");
  }
  filter(arg0: (option_c: any) => boolean): Dador[] {
    throw new Error("Method not implemented.");
  }
    id_centro:string;
    id_cliente:string;
    bloqueado: boolean;
    nombre_cliente: string;
    nombre_centro: string;
}

export class DadorPrePedido {
  id: number;
  descripcion: string;
}
