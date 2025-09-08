import { Cupo } from "./cupo";
import { Solicitud } from "./solicitud";

export class Dia {
  asignados: number;
  solicitados: number;
  cupos: Cupo[];
  solicitudes: Solicitud[];
}
