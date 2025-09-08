import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Cabecera } from 'app/shared/models/cabecera';

@Component({
  selector: 'app-ver-cabecera',
  templateUrl: './ver-cabecera.component.html',
  styleUrls: ['./ver-cabecera.component.scss']
})
export class VerCabeceraComponent implements OnInit {
  public verCabeceraForm: FormGroup;
  cabecera: Cabecera;
  styleWidth = '60%';
  valorStyleWidth = 60;
  fontSize = '12px';
  valorFontSize = 12;
  heightInter = '229px';
  heightGranos = '170px';
  heightRow = '25px';
  height2Row = '50px';
  height3Row = '75px';
  height4Row = '100px';
  height5Row = '130px';
  title = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VerCabeceraComponent>,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.cabecera = this.data.payload;
    this.title = this.data.title;
    console.log(this.cabecera);
    //this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {

    this.verCabeceraForm = this.fb.group({
      titulo: new FormControl(item.titulo),
      nombreTitular: new FormControl(item.nombreTitular),
      idCuitTitula: new FormControl(item.idCuitTitula),
      nombreIntermediarioFlete: new FormControl(item.nombreIntermediarioFlete),
      idCuitIntermediarioFlete: new FormControl(item.idCuitIntermediarioFlete),
      nombreRemitente: new FormControl(item.nombreRemitente),
      idCuitRemComercial: new FormControl(item.idCuitRemComercial),
      nombreCorredorComprador: new FormControl(item.nombreCorredorComprador),
      idCuitCorredorC: new FormControl(item.idCuitCorredorC),
      nombreMercadoATermino: new FormControl(item.nombreMercadoATermino),
      idCuitMercadoATermino: new FormControl(item.idCuitMercadoATermino),
      nombreCorredorVendedor: new FormControl(item.nombreCorredorVendedor),
      idCuitCorredorV: new FormControl(item.idCuitCorredorV),
      nombreEntregador: new FormControl(item.nombreEntregador),
      idCuitRepresentanteEntregador: new FormControl(item.idCuitRepresentanteEntregador),
      nombreDestinatario: new FormControl(item.nombreDestinatario),
      idCuitDestinatario: new FormControl(item.idCuitDestinatario),
      nroContrato: new FormControl(item.nroContrato),
      nombreIntermediario1: new FormControl(item.nombreIntermediario1),
      idCuitIntermediario1: new FormControl(item.idCuitIntermediario1),
      nombreIntermediario2: new FormControl(item.nombreIntermediario2),
      idCuitIntermediario2: new FormControl(item.idCuitIntermediario2),
      caratula: new FormControl(item.caratula),
      comentario: new FormControl(item.comentario),
      observaciones: new FormControl(item.observaciones)
    })
  }

  cerrar() {
    this.dialogRef.close();
  }

  aumentarVer(): void {
    let tempSize = this.valorStyleWidth + 10;
    if (tempSize <= 100) {
      this.valorStyleWidth = tempSize;
      this.styleWidth = this.valorStyleWidth.toString() + '%';
    }
  }
  disminuirVer(): void {
    let tempSize = this.valorStyleWidth - 10;
    if (tempSize >= 60) {
      this.valorStyleWidth = tempSize;
      this.styleWidth = this.valorStyleWidth.toString() + '%';
    }
  }


}
