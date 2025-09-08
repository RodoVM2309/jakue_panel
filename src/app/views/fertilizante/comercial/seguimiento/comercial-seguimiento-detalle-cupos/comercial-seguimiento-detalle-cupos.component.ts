import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DetalleCupo } from '@app/shared/models/detalle-cupo';
import { DetalleReserva, Reserva } from '@app/shared/models/fertilizantes.model';


@Component({
  selector: 'app-comercial-seguimiento-detalle-cupos',
  templateUrl: './comercial-seguimiento-detalle-cupos.component.html',
  styleUrls: ['./comercial-seguimiento-detalle-cupos.component.scss']
})
export class ComercialSeguimientoDetalleCuposComponent implements OnInit {
  displayedColumns: string[] = [
    'fecha',
    'cupo',
    'reserva',
    'tipo_despacho',
    'producto',
    'producto_erp',
    'cantidad',
    'composicion',
    'terminal',
    'st_oc',
    'contrato',
    'estado'
  ];
  isNew: string;
  //dataSource: DetalleCupo[] = [];
  @Input() detalleCupo: DetalleCupo[];
  //dataSource: DetalleCupo[];
  reservas:Reserva

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
     public dialogRef: MatDialogRef<ComercialSeguimientoDetalleCuposComponent>,) { }

  ngOnInit() {    
    /*this.isNew      = this.data.isNew ;
    if (this.isNew != 'monitor_comercial') {
      this.displayedColumns.splice(11,1); //estado
      this.displayedColumns.splice(5,1);// producto erp
      this.displayedColumns.splice(2,1);//reserva
    }*/
    console.log(this.detalleCupo);
    
    //this.dataSource = this.data.payload;
  }
}
