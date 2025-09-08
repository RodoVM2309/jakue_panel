import { MatPaginatorIntl } from '@angular/material';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();
 customPaginatorIntl.itemsPerPageLabel = 'Registros por Página:';
 customPaginatorIntl.nextPageLabel = 'Siguiente';
 customPaginatorIntl.firstPageLabel = 'Primera';
 customPaginatorIntl.lastPageLabel = 'Última';
 customPaginatorIntl.previousPageLabel = 'Anterior';

  return customPaginatorIntl;
}
