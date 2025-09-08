import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';


export interface DetalleCupo {
  fecha: string;
  cupo: string;
  reserva: string;
  tipo_despacho: string;
  producto: string;
  producto_erp: string;
  cantidad: string;
  composicion: string;
  terminal: string;
  st_oc: string;
  contrato: string;
  estado: string;
}


@Component({
  selector: 'app-detalle-cupos',
  templateUrl: './detalle-cupos.component.html',
  styleUrls: ['./detalle-cupos.component.scss']
})
export class DetalleCuposComponent implements OnInit {
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
  dataSource: DetalleCupo[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
     public dialogRef: MatDialogRef<DetalleCuposComponent>,) { }

  ngOnInit() {
    this.isNew      = this.data.isNew ;
    if (this.isNew != 'monitor_comercial') {
      this.displayedColumns.splice(11,1); //estado
      this.displayedColumns.splice(5,1);// producto erp
      this.displayedColumns.splice(2,1);//reserva
    }
    console.log("columnas a mostrar "+this.displayedColumns);
    console.log("columnas a mostrar "+this.isNew);
    this.dataSource = this.data.payload;
  }
  gotoHome() {
    this.dialogRef.close();
  }

}
