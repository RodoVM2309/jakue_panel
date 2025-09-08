import { FormGroup } from "@angular/forms";
import { PageEvent } from "@angular/material";
import { Product } from "@app/shared/models";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { Viaje } from "./models/viaje";


export class Variables {
  filtrarForm: FormGroup;
  showTable: boolean = true;
  productos: Product[];
  now = moment(new Date()).format("YYYY-MM-DD");
  hoy = new Date();
  idCentro = null;
  filtro = {
    id_producto: null,
    fecha: this.now,
  };
  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Cupos Disponibles</span>
      </div>
    `
  };
  viajes: Viaje[] = [];
  pageEvent: PageEvent = new PageEvent();
  public getItemSub: Subscription;

}
