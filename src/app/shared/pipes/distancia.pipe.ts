import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'distancia' })
export class DistanciaPipe implements PipeTransform {

  transform(value: any) {
    if(!(value)) return "Sin GPS";
    let km = Math.floor(value);
    //console.log(km);

    if (km > 0 && km < 50 ) {
      return " 0 - 50";
    }
    if (km > 50 && km < 100 ) {
      return " 50 - 100";
    }
    if (km > 100 ) {
      return "Más de 100 Km";
    }


  }
}
