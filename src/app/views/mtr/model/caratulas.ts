import { Page } from "@app/shared/models";

export interface Caratula {
  id: number;
  caratula: string;
  mesEntrega: string;
  cuitComprador: string;
  razonSocialComprador: string;
  cuitCorredorComprador: string;
  razonSocialCorredorComprador: string;
  cuitCorredorVendedor: string;
  razonSocialCorredorVendedor: string;
  cuitVendedor: string;
  razonSocialVendedor: string;
  saltoCorredorComprador: number;
  saltoCorredorVendedor: number;
  kilosIniciales: number;
  kilosRecibidosWink: number;
  activo: number;
  cupos: Cupo[];
}

export interface Cupo {
  id_caratula: string;
  alfanumerico: string;
  idCupoEstado: null;
  fecha: string;
  fechaArribado: null;
  fechaDescargado: null;
  lo_posee: string;
}

export interface ReporteMtr {
  Alfanumerico: string;
  Estado: null;
  Fecha: string;
  FechaArribado: null;
  FechaDescargado: null;
  Caratula: string;
  MesEntrega: string;
  CuitComprador: string;
  Comprador: string;
  CuitCorredorComprador: string;
  CorredorComprador: string;
  cuitCorredorVendedor: string;
  CorredorVendedor: string;
  CuitVendedor: string;
  Vendedor: string;
  KilosIniciales: number;
  KilosRecibidosWink: number;
  Activo: number;
}

export interface FiltroCaratula {
  caratula: string;
  mesEntrega: string;
  cuitComprador: string;
  cuitCorredorComprador: string;
  cuitCorredorVendedor: string;
  cuitVendedor: string;
  activo: number;
  idCupoTerminal: string;
  descargado: number;
  noCartaPorte: string;
}


export interface ResponseCaratula {
  caratulas: Caratula[];
  page: Page;
}
