import { Dia, ListadoAsignacion, ListadoSolicitud, Solicitud } from "../models";

export module FunctionCreate {
  export function solicitudPropia(): Solicitud {
    return {
      id_demanda_cupo: null,
      idCuitDestinatario: null,
      idCuitDestino: null,
      id_producto: null,
      id_zona_solicitud: null,
      fecha: null,
      corredor: null,
      demandanteCuit: null,
      destinatario: null,
      observaciones: null,
      contraparte: null,
      contrato: null,
      cantidad: null,
      asignado: null,
      corredor_demanda: null,
      propia: true,
      disponibles: null,
      caratula: null,
    };
  }

  export function listadoSolicitud(cliente): ListadoSolicitud {
    const solicitudPropia = this.solicitudPropia();
    return {
      corredor: "DIRECTO",
      corredorCuit: "00000000000",
      contraparte: cliente.nombre_interno.toUpperCase(),
      contraparteCuit: cliente.cuit_interno,
      demandanteCuit: null,
      contrato: null,
      destinatario: null,
      zona: null,
      observaciones: [],
      saldo: 0,
      dia0_solicitados: 0,
      dia1_solicitados: 0,
      dia2_solicitados: 0,
      dia3_solicitados: 0,
      dia4_solicitados: 0,
      dia5_solicitados: 0,
      dia6_solicitados: 0,
      total_solicitados: 0,
      dia0_solicitudes: [solicitudPropia],
      dia1_solicitudes: [solicitudPropia],
      dia2_solicitudes: [solicitudPropia],
      dia3_solicitudes: [solicitudPropia],
      dia4_solicitudes: [solicitudPropia],
      dia5_solicitudes: [solicitudPropia],
      dia6_solicitudes: [solicitudPropia],
      isSelected: [0, 0, 0, 0, 0],
      obser: null,
      propia: true,
      id_centro: cliente.id_interno,
    };
  }

  export function listadoAsignacion(element, detallesDisponiblesApi, tempDia): ListadoAsignacion {
    let newElement = new ListadoAsignacion();
    newElement.idCuitDestinatario = element.idCuitDestinatario;
    newElement.nombreDestinatario = detallesDisponiblesApi
      .destinatarios[element.idCuitDestinatario].razon_social
      ? detallesDisponiblesApi.destinatarios[
        element.idCuitDestinatario
      ].razon_social
      : " Sin razón social";
    let destinatarioparams = {
      cuit: newElement.idCuitDestinatario,
      razon_social: newElement.nombreDestinatario,
    };

    let dia = new Dia();
    dia.asignados = 0;
    dia.solicitados = 0;
    dia.solicitudes = [];
    dia.cupos = [];
    newElement.dia0 = this.newItemDia();
    newElement.dia1 = this.newItemDia();
    newElement.dia2 = this.newItemDia();
    newElement.dia3 = this.newItemDia();
    newElement.dia4 = this.newItemDia();
    newElement.dia5 = this.newItemDia();
    newElement.dia6 = this.newItemDia();
    newElement.total_asignados = 1;
    newElement.total_solicitados = 0;
    if (tempDia) {
      switch (tempDia.id) {
        case 0:
          newElement.dia0.asignados = 1;
          newElement.dia0.cupos.push(element);
          break;
        case 1:
          newElement.dia1.asignados = 1;
          newElement.dia1.cupos.push(element);
          break;
        case 2:
          newElement.dia2.asignados = 1;
          newElement.dia2.cupos.push(element);
          break;
        case 3:
          newElement.dia3.asignados = 1;
          newElement.dia3.cupos.push(element);
          break;
        case 4:
          newElement.dia4.asignados = 1;
          newElement.dia4.cupos.push(element);
          break;
        case 5:
          newElement.dia5.asignados = 1;
          newElement.dia5.cupos.push(element);
          break;
        case 6:
          newElement.dia6.asignados = 1;
          newElement.dia6.cupos.push(element);
          break;

        default:
          break;
      }
    }
    return newElement
  }

  export function newItemDia() {
    return {
      asignados: 0,
      solicitados: 0,
      cupos: [],
      solicitudes: [],
    }
  }
}
