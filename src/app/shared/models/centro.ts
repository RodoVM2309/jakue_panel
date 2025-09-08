export class Centro {
  id: number;
  id_rol: number;
  id_usuario: number;
  nombre_persona: string;
  direccion_persona: string;
  localidad_persona: string;
  nombre_rol: string;
  cliente_muvin: string;
  visualiza_flota_intermediario: string;
  ve_choferes_libres: string;
  km: string;
  condiciones_viaje: number;
  condiciones: string;
  cargarTotalizadorChofer: {
    total_choferes: number;
    choferes_app_instalada: number;
  };
}

export class CentroCliente {
  id_centro: number;
  id_cliente: number;
  bloqueado: number;
  nombre_cliente: string;
  nombre_centro: string;
  desc_bloqueado: string;
}
export class CentroCorredor {
  id_centro: number;
  id_corredor: number;
  bloqueado: number;
  nombre_corredor: string;
  nombre_centro: string;
  desc_bloqueado: string;
}
export class CentroOperador {
  id_centro: number;
  id_operador: number;
  bloqueado: number;
  nombre_operador: string;
  nombre_centro: string;
  desc_bloqueado: string;
  cuit_cuil: string;
}

export class CentroTransporte {
  id_centro: number;
  id_transporte: number;
  bloqueado: number;
  id_intermediario: number;
  nombre_transporte: string;
  nombre_intermediario: string;
  nombre_centro: string;
  cantidad_choferes: number;
  desc_bloqueado: string;
}
export class TransportistaPostulado {
  id: number;
  id_rol: number;
  id_usuario: number;
  activo: number;
  nombre_persona: string;
  direccion_persona: string;
  localidad_persona: string;
  nombre_rol: string;
  cuit_persona: string;
  kmetros?: string;
  horas: string;
}
export class CentroIntermediario {
  id_centro: number;
  id_intermediario: number;
  bloqueado: number;
  nombre_transporte: string;
  nombre_intermediario: string;
  nombre_centro: string;
  desc_bloqueado: string;
}

export class CentroEntregador {
  id_centro: number;
  id_entregador: number;
  bloqueado: number;
  nombre_entregador: string;
  nombre_centro: string;
  desc_bloqueado: string;
}

export class CentroDestinatario {
  id_centro: number;
  id_destinatario: number;
  bloqueado: number;
  nombre_destinatario: string;
  nombre_centro: string;
  desc_bloqueado: string;
}
export class Whatsapp {
  id: number;
  id_centro: number;
  telefono: string;
  cuit_cliente: number;
  razon_social: string;
}
