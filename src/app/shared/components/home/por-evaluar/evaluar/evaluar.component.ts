import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder,  FormGroup } from '@angular/forms';

@Component({
  selector: 'app-evaluar',
  templateUrl: './evaluar.component.html',
  styleUrls: ['./evaluar.component.scss']
})
export class EvaluarComponent implements OnInit {
  public itemForm: FormGroup;
  starList: boolean [] = [false, false, false, false, false];
  rating: number = 0;
  id_viaje=0;
  datos:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<EvaluarComponent>,
  private fb: FormBuilder) { }

  ngOnInit() {
  }
  

  submit() {
   this.datos = {
    id_viaje: this.data.payload.id,
    evaluacion: this.rating
  }
    this.dialogRef.close( this.datos);
  }

  setStar(datos: any) {
    this.rating = datos + 1;
    for (var i = 0; i <= 4 ; i++) {
      if (i <= datos) {
        this.starList[i] = true;
      } else {
        this.starList[i] = false;
      }
    }
  }
}
