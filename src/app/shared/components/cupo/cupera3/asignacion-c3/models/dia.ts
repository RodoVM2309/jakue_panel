import {Cupo} from './cupo';
import { Solicitud} from './solicitud';
export class DiaCupos {
  asignados: number;
  solicitados: number;
  cupos: Cupo[];
}
export class DiaSolicitudes {
  solicitados: number;
  solicitudes: Solicitud[];

}
