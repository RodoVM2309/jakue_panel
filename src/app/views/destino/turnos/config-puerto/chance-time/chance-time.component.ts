import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-chance-time',
  templateUrl: './chance-time.component.html',
  styleUrls: ['./chance-time.component.scss']
})
export class ChanceTimeComponent implements OnInit {
  public itemForm: FormGroup;
  hora: number;
  horaString: string;
  minutos: number;
  minutosString: string;
  segundos: number;
  segundosString: string;
  tiempo_demorado: string;
  arrayTiempo = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChanceTimeComponent>,
  ) { }

  ngOnInit() {
    this.tiempo_demorado = this.data.payload;
    this.arrayTiempo = this.tiempo_demorado.split(':');
    this.horaString = this.arrayTiempo[0];
    this.hora = parseInt(this.arrayTiempo[0]);
    this.minutosString = this.arrayTiempo[1];
    this.minutos = parseInt(this.arrayTiempo[1]);
    this.segundosString = this.arrayTiempo[2] ? this.arrayTiempo[2] : '00';
    this.segundos = this.arrayTiempo[2] ? parseInt(this.arrayTiempo[2]) : 0;
    /* this.itemForm = new FormGroup({
      hora:new FormControl(this.hora, [Validators.required,Validators.min(0),Validators.max(24)]),
      minutos:new FormControl(this.minutos, [Validators.required,Validators.min(0),Validators.max(60)]),
      segundos:new FormControl(this.segundos, [Validators.required,Validators.min(0),Validators.max(60)]),
    }); */

  }
  sumaHora() {
    let hora = parseInt(this.horaString);
    if (hora < 24) {
      hora++;
      if (hora < 10)
        this.horaString = '0' + hora.toString();
      else
        this.horaString = hora.toString();
    }
  }
  restaHora() {
    let hora = parseInt(this.horaString);
    if (hora > 0) {
      hora--;
      if (hora < 10)
        this.horaString = '0' + hora.toString();
      else
        this.horaString = hora.toString();
    }
  }
  sumaMinutos() {
    let temp = parseInt(this.minutosString);
    if (temp < 60) {
      temp++;
      if (temp < 10)
        this.minutosString = '0' + temp.toString();
      else
        this.minutosString = temp.toString();
    }
  }
  restaMinutos() {
    let temp = parseInt(this.minutosString);
    if (temp > 0) {
      temp--;
      if (temp < 10)
        this.minutosString = '0' + temp.toString();
      else
        this.minutosString = temp.toString();
    }
  }
  sumaSegundos() {
    let temp = parseInt(this.segundosString);
    if (temp < 60) {
      temp++;
      if (temp < 10)
        this.segundosString = '0' + temp.toString();
      else
        this.segundosString = temp.toString();
    }
  }
  restaSegundos() {
    let temp = parseInt(this.segundosString);
    if (temp > 0) {
      temp--;
      if (temp < 10)
        this.segundosString = '0' + temp.toString();
      else
        this.segundosString = temp.toString();
    }
  }

  summit() {
    this.dialogRef.close(this.horaString + ':' + this.minutosString + ':' + this.segundosString)
  }


}
