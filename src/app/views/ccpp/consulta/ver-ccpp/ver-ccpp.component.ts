import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Cabecera } from 'app/shared/models/cabecera';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CcppService } from 'app/shared/services/ccpp.service';
import { Subscription } from 'rxjs';


export class ErrorAplicar {
  nombreTitular: string | null;
  idCuitTitula: string | null;
  nombreIntermediario: string | null;
  idCuitIntermediario: string | null;
  nombreRemitente: string | null;
  idCuitRemComercial: string | null;
  nombreCorredorComprador: string | null;
  idCuitCorredorC: string | null;
  nombreMercadoATermino: string | null;
  idCuitMercadoATermino: string | null;
  nombreCorredorVendedor: string | null;
  idCuitCorredorV: string | null;
  nombreEntregador: string | null;
  idCuitRepresentanteEntregador: string | null;
  nombreDestinatario: string | null;
  idCuitDestinatario: string | null;
  nombreDestino: string | null;
  idCuitDestino: string | null;
  nombreIntermediarioFlete: string | null;
  idCuitIntermediarioFlete: string | null;
  nombreTransportista: string | null;
  idCuitTransportista: string | null;
  nombreChofer: string | null;
  idCuitChofer: string | null;
  nombreIntermediario1: string | null;
  idCuitIntermediario1: string | null;
  nombreIntermediario2: string | null;
  idCuitIntermediario2: string | null;
  caratulaMercadoATermino: string | null;
  comentario: string | null;
}
@Component({
  selector: 'app-ver-ccpp',
  templateUrl: './ver-ccpp.component.html',
  styleUrls: ['./ver-ccpp.component.scss']
})
export class VerCcppComponent implements OnInit {
  public verCcppForm: FormGroup;
  cabecera: any;
  ccpp: any;
  styleWidth = '70%';
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
  cartaPorte = "";
  stateAplicar = false;
  accion = 'Aplicar';
  cabeceraCupo: Cabecera = new Cabecera();
  otracabeceraCupo: any;
  estadoAplicar: ErrorAplicar;
  colorInicial = '#fff';
  //colorOk='#4df14d';
  colorOk = '#fff';
  colorAdvertencia = '#fff';
  //colorAdvertencia='#e5e75e';
  colorError = '#fff';
  //colorError='#e75e5e';
  idCabecera = 0;
  public getItemSub: Subscription;
  mostrarBtnAplicar = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VerCcppComponent>,
    private fb: FormBuilder, private ccppService: CcppService,
    private loader: AppLoaderService,
  ) { }

  ngOnInit() {
    this.ccpp = this.data.cartaPorte;
    this.extraerCabeceraCupo(this.ccpp);
    this.inicializar();
    this.cartaPorte = this.ccpp.cartaPorte;
    this.idCabecera = this.data.cabecera ? this.data.cabecera.id : null;

    if (this.idCabecera) {
      this.loader.open('Buscando datos en V3');
      this.getItemSub = this.ccppService.getIdCabecera(this.idCabecera)
        .subscribe(pagedData => {
          //console.log(pagedData.data);
          this.loader.close();
          this.cabecera = pagedData.data;
          //this.mostrarBtnAplicar=true;
          //this.aplique(this.cabecera);  
          this.chanceEstado(this.cabecera);
        },
          err => {
          });
    }

  }

  buildItemForm(item) {
    this.verCcppForm = this.fb.group({
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
  extraerCabeceraCupo(item) {
    let cabeceraCupo: Cabecera = new Cabecera();;
    this.cabeceraCupo.id = item.id;
    this.cabeceraCupo.titulo = item.titulo;
    this.cabeceraCupo.nombreTitular = item.nombreTitular;
    this.cabeceraCupo.idCuitTitula = item.idCuitTitula;
    this.cabeceraCupo.nombreIntermediario = item.nombreIntermediario;
    this.cabeceraCupo.idCuitIntermediario = item.idCuitIntermediario;
    this.cabeceraCupo.nombreRemitente = item.nombreRemitente;
    this.cabeceraCupo.idCuitRemComercial = item.idCuitRemComercial;
    this.cabeceraCupo.nombreCorredorComprador = item.nombreCorredorComprador;
    this.cabeceraCupo.idCuitCorredorC = item.idCuitCorredorC;
    this.cabeceraCupo.nombreMercadoATermino = item.nombreMercadoATermino;
    this.cabeceraCupo.idCuitMercadoATermino = item.idCuitMercadoATermino;
    this.cabeceraCupo.nombreCorredorVendedor = item.nombreCorredorVendedor;
    this.cabeceraCupo.idCuitCorredorV = item.idCuitCorredorV;
    this.cabeceraCupo.nombreEntregador = item.nombreEntregador;
    this.cabeceraCupo.idCuitRepresentanteEntregador = item.idCuitRepresentanteEntregador;
    this.cabeceraCupo.nombreDestinatario = item.nombreDestinatario;
    this.cabeceraCupo.idCuitDestinatario = item.idCuitDestinatario;
    this.cabeceraCupo.nombreDestino = item.nombreDestino;
    this.cabeceraCupo.idCuitDestino = item.idCuitDestino;
    this.cabeceraCupo.nombreIntermediarioFlete = item.nombreIntermediarioFlete;
    this.cabeceraCupo.idCuitIntermediarioFlete = item.idCuitIntermediarioFlete;
    this.cabeceraCupo.nombreTransportista = item.nombreTransportista;
    this.cabeceraCupo.idCuitTransportista = item.idCuitTransportista;
    this.cabeceraCupo.nombreChofer = item.nombreChofer;
    this.cabeceraCupo.idCuitChofer = item.idCuitChofer;
    this.cabeceraCupo.nombreIntermediario1 = item.nombreIntermediario1;
    this.cabeceraCupo.idCuitIntermediario1 = item.idCuitIntermediario1;
    this.cabeceraCupo.nombreIntermediario2 = item.nombreIntermediario2;
    this.cabeceraCupo.idCuitIntermediario2 = item.idCuitIntermediario2;
    this.cabeceraCupo.caratulaMercadoATermino = item.caratulaMercadoATermino;
    this.cabeceraCupo.comentario = item.comentario;
  }

  inicializar() {
    this.estadoAplicar = new ErrorAplicar();
    this.estadoAplicar.nombreTitular = this.colorInicial;
    this.estadoAplicar.idCuitTitula = this.colorInicial;
    this.estadoAplicar.nombreIntermediario = this.colorInicial;
    this.estadoAplicar.idCuitIntermediario = this.colorInicial;
    this.estadoAplicar.nombreRemitente = this.colorInicial;
    this.estadoAplicar.idCuitRemComercial = this.colorInicial;
    this.estadoAplicar.nombreCorredorComprador = this.colorInicial;
    this.estadoAplicar.idCuitCorredorC = this.colorInicial;
    this.estadoAplicar.nombreMercadoATermino = this.colorInicial;
    this.estadoAplicar.idCuitMercadoATermino = this.colorInicial;
    this.estadoAplicar.nombreCorredorVendedor = this.colorInicial;
    this.estadoAplicar.idCuitCorredorV = this.colorInicial;
    this.estadoAplicar.nombreEntregador = this.colorInicial;
    this.estadoAplicar.idCuitRepresentanteEntregador = this.colorInicial;
    this.estadoAplicar.nombreDestinatario = this.colorInicial;
    this.estadoAplicar.idCuitDestinatario = this.colorInicial;
    this.estadoAplicar.nombreDestino = this.colorInicial;
    this.estadoAplicar.idCuitDestino = this.colorInicial;
    this.estadoAplicar.nombreIntermediarioFlete = this.colorInicial;
    this.estadoAplicar.idCuitIntermediarioFlete = this.colorInicial;
    this.estadoAplicar.nombreTransportista = this.colorInicial;
    this.estadoAplicar.idCuitTransportista = this.colorInicial;
    this.estadoAplicar.nombreChofer = this.colorInicial;
    this.estadoAplicar.idCuitChofer = this.colorInicial;
    this.estadoAplicar.nombreIntermediario1 = this.colorInicial;
    this.estadoAplicar.idCuitIntermediario1 = this.colorInicial;
    this.estadoAplicar.nombreIntermediario2 = this.colorInicial;
    this.estadoAplicar.idCuitIntermediario2 = this.colorInicial;
    this.estadoAplicar.caratulaMercadoATermino = this.colorInicial;
    this.estadoAplicar.comentario = this.colorInicial;

  }

  aplicarCabecera() {
    this.stateAplicar = true;
    this.accion = 'Deshacer';
    this.chanceEstado(this.cabecera);
    this.aplique(this.cabecera);


  }
  noAplicarCabecera() {
    this.accion = 'Aplicar'
    this.stateAplicar = false;
    this.inicializar();
    this.aplique(this.cabeceraCupo);
  }

  chanceEstado(item) {
    for (const key in this.estadoAplicar) {
      if (Object.prototype.hasOwnProperty.call(this.estadoAplicar, key)) {
        //const element = this.estadoAplicar[key];
        this.chanceEstadoItem(item, key);
      }
    }

  }

  chanceEstadoItem(item, key) {
    if ((this.ccpp[key] == null || this.ccpp[key] == '') && item[key] !== null) {
      this.ccpp[key] = item[key];
      this.estadoAplicar[key] = this.colorOk;
    } else {
      if (this.ccpp[key] === item[key]) {
        this.estadoAplicar[key] = this.colorAdvertencia;
      } else {
        if ((item[key] == null || item[key] == '') && this.ccpp[key] !== null) {
          this.estadoAplicar[key] = this.colorOk;
          // this.ccpp[key]=item[key];
        } else {
          this.estadoAplicar[key] = this.colorError;
        }
      }
    }
  }


  aplique(item) {
    this.ccpp.titulo = item.titulo;
    this.ccpp.nombreTitular = item.nombreTitular;
    this.ccpp.idCuitTitula = item.idCuitTitula;
    this.ccpp.nombreIntermediario = item.nombreIntermediario;
    this.ccpp.idCuitIntermediario = item.idCuitIntermediario;
    this.ccpp.nombreRemitente = item.nombreRemitente;
    this.ccpp.idCuitRemComercial = item.idCuitRemComercial;
    this.ccpp.nombreCorredorComprador = item.nombreCorredorComprador;
    this.ccpp.idCuitCorredorC = item.idCuitCorredorC;
    this.ccpp.nombreMercadoATermino = item.nombreMercadoATermino;
    this.ccpp.idCuitMercadoATermino = item.idCuitMercadoATermino;
    this.ccpp.nombreCorredorVendedor = item.nombreCorredorVendedor;
    this.ccpp.idCuitCorredorV = item.idCuitCorredorV;
    this.ccpp.nombreEntregador = item.nombreEntregador;
    this.ccpp.idCuitRepresentanteEntregador = item.idCuitRepresentanteEntregador;
    this.ccpp.nombreDestinatario = item.nombreDestinatario;
    this.ccpp.idCuitDestinatario = item.idCuitDestinatario;
    this.ccpp.nombreDestino = item.nombreDestino;
    this.ccpp.idCuitDestino = item.idCuitDestino;
    this.ccpp.nombreIntermediarioFlete = item.nombreIntermediarioFlete;
    this.ccpp.idCuitIntermediarioFlete = item.idCuitIntermediarioFlete;
    this.ccpp.nombreTransportista = item.nombreTransportista;
    this.ccpp.idCuitTransportista = item.idCuitTransportista;
    this.ccpp.nombreChofer = item.nombreChofer;
    this.ccpp.idCuitChofer = item.idCuitChofer;
    this.ccpp.nombreIntermediario1 = item.nombreIntermediario1;
    this.ccpp.idCuitIntermediario1 = item.idCuitIntermediario1;
    this.ccpp.nombreIntermediario2 = item.nombreIntermediario2;
    this.ccpp.idCuitIntermediario2 = item.idCuitIntermediario2;
    this.ccpp.caratulaMercadoATermino = item.caratulaMercadoATermino;
    this.ccpp.comentario = item.comentario;
  }



}
