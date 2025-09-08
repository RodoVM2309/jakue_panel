import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { NomencladoresService } from '../../../../shared/services/nomencladores.service';




@Component({
  selector: 'app-variar-km',
  templateUrl: './variar-km.component.html',
  styleUrls: ['./variar-km.component.scss']
})

export class VariarKmComponent implements OnInit {
 row;
 valor : number;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VariarKmComponent>,
    private nomecladoresServices: NomencladoresService) { }

  ngOnInit() {
    this.row=(this.data.payload);
    
  }
  public modificarcant(e: any) {
    this.valor = e;
  }

  guardar() {
    this.row.km = this.valor;    
    this.nomecladoresServices.postPonerKm(this.row)
      .subscribe(data => {       
        this.dialogRef.close();
      });

      
  }
  submit() {

    this.dialogRef.close();
  }


}