export class MarcadorMapa {
  latitud: number;
  longitud: number;
  patente: string;
  nombreChofer: string;
  nombreTransportista: string;
  telefono: string;
  updateAt: string;
  estado: number; //0:choferesDisponibles-iconUrlGreen  1: choferesViajes-iconUrlBlue 2: choferes atrasados
  icon: string;
}

export class MarcadorMapaPedido extends MarcadorMapa {
  patente_acoplado: string;
}
