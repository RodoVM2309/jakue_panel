import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'orderBy' })
export class OrderrByPipe implements PipeTransform {

  transform(records: Array<any>, args?: any): any {
    if (records.length > 0) {
      // esto es en el caso que el "Todos" tenga id -1
      let index = records.findIndex(item => item.id === '-1');
      let primer_elemento = records[index];

      records.splice(index, 1);

      records.sort(function (a, b) {
        if (a[args.property] < b[args.property]) {
          return -1 * args.direction;
        }
        else if (a[args.property] > b[args.property]) {
          return 1 * args.direction;
        }
        else {
          return 0;
        }
      });

      records.unshift(primer_elemento);

      return records;
    } else {
      return records;
    }

  };
}
