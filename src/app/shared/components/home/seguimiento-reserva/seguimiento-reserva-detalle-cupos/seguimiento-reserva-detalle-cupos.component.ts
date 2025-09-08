import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DetalleCupo } from '@app/shared/models/detalle-cupo';
import { DetalleReserva, Reserva } from '@app/shared/models/fertilizantes.model';


@Component({
  selector: 'app-seguimiento-reserva-detalle-cupos',
  templateUrl: './seguimiento-reserva-detalle-cupos.component.html',
  styleUrls: ['./seguimiento-reserva-detalle-cupos.component.scss']
})
export class SeguimientoReservaDetalleCuposComponent implements OnInit {
  displayedColumns: string[] = [
    'fecha',
    'cupo',
    'reserva',
    'tipo_despacho',
    'producto',
    'cantidad',
    'composicion',
    'terminal',
    'st_oc',
    'contrato'
  ];
  @Input() detalleCupo: DetalleCupo[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {}
}
