import { DiaCupos } from './dia';

export class ListadoAsignacionProducto {
  nombreProducto: string | null;
  idProducto: number | null;
  dia0: DiaCupos;
  dia1: DiaCupos;
  dia2: DiaCupos;
  dia3: DiaCupos;
  dia4: DiaCupos;
  total_asignados: number;
  total_solicitados: number;
}
export class ListadoAsignacionZona {
  zona: string | null;
  idZona: number | null;
  dia0: DiaCupos;
  dia1: DiaCupos;
  dia2: DiaCupos;
  dia3: DiaCupos;
  dia4: DiaCupos;
  total_asignados: number;
  total_solicitados: number;
  selected: boolean;
  selectable?: boolean;
}
