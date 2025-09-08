import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { FormGroup } from '@angular/forms';
import { Cabecera } from 'app/shared/models/cabecera';
import { PersonasService } from 'app/shared/services/personas.service';

@Component({
  selector: 'app-ver-carta-porte',
  templateUrl: './ver-carta-porte.component.html',
  styleUrls: ['./ver-carta-porte.component.scss'],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class VerCartaPorteComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VerCartaPorteComponent>,
    private dialog: MatDialog,
    private personasService: PersonasService
  ) { }

  ngOnInit() {
    this.cabecera = this.data.payload;
    this.title = this.data.title;
    if (this.cabecera.idCuitTitula){
      this. buscarPerson(this.cabecera.idCuitTitula,'titular');
    }
    if (this.cabecera.idCuitIntermediario){
      this. buscarPerson(this.cabecera.idCuitIntermediario,'intermediario');
    }
    if (this.cabecera.idCuitRemComercial){
      this. buscarPerson(this.cabecera.idCuitRemComercial,'remitenteComercial');
    }
    if (this.cabecera.idCuitCorredorC){
      this. buscarPerson(this.cabecera.idCuitCorredorC,'nombreCorredorComprador');
    }
    if (this.cabecera.idCuitMercadoATermino){
      this. buscarPerson(this.cabecera.idCuitMercadoATermino,'nombreMercadoATermino');
    }
    if (this.cabecera.idCuitCorredorV){
      this. buscarPerson(this.cabecera.idCuitCorredorV,'nombreCorredorVendedor');
    }
    if (this.cabecera.idCuitRepresentanteEntregador){
      this. buscarPerson(this.cabecera.idCuitRepresentanteEntregador,'nombreEntregador');
    }
    if (this.cabecera.idCuitIntermediarioFlete){
      this. buscarPerson(this.cabecera.idCuitIntermediarioFlete,'nombreIntermediarioFlete');
    }
    if (this.cabecera.idCuitTransportista){
      this. buscarPerson(this.cabecera.idCuitTransportista,'nombreTransportista');
    }
    if (this.cabecera.idCuitChofer){
      this. buscarPerson(this.cabecera.idCuitChofer,'nombreChofer');
    }
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

  buscarPerson(cuit,campo){
    this.personasService.getPersonaNombreByCuit(cuit).subscribe(
      (resp) => {
        switch (campo) {
          case 'titular':
            this.cabecera.nombreTitular= resp.data;
            break;
          case 'intermediario':
            this.cabecera.nombreIntermediario= resp.data;
            break;
          case 'remitenteComercial':
            this.cabecera.nombreRemitente= resp.data;
            break;
          case 'nombreCorredorComprador':
            this.cabecera.nombreCorredorComprador= resp.data;
            break;
          case 'nombreMercadoATermino':
            this.cabecera.nombreMercadoATermino= resp.data;
            break;
          case 'nombreCorredorVendedor':
            this.cabecera.nombreCorredorVendedor= resp.data;
            break;
          case 'nombreEntregador':
            this.cabecera.nombreEntregador= resp.data;
            break;
          case 'nombreIntermediarioFlete':
            this.cabecera.nombreIntermediarioFlete= resp.data;
            break;
          case 'nombreTransportista':
            this.cabecera.nombreTransportista= resp.data;
            break;
          case 'nombreChofer':
            this.cabecera.nombreChofer= resp.data;
            break;

          default:
            break;
        }
      },
      (err) => {
        console.log(err);

      }
    );
  }

}
