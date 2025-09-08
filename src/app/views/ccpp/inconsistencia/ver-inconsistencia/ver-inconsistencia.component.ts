import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Inconsistencia } from 'app/shared/models/inconsistencia';
import * as html2canvas from 'html2canvas';
import { NotificarInconsistenciaComponent } from '../notificar-inconsistencia/notificar-inconsistencia.component';


@Component({
  selector: 'app-ver-inconsistencia',
  templateUrl: './ver-inconsistencia.component.html',
  styleUrls: ['./ver-inconsistencia.component.scss']
})

export class VerInconsistenciaComponent implements OnInit {
  @ViewChild('htmlData') htmlData: ElementRef;

  styleWidth = '100%';
  fontSize = '12px';
  valorFontSize = 12;
  heightInter = '229px';
  heightGranos = '170px';
  heightRow = '25px';
  height2Row = '50px';
  height3Row = '75px';
  height4Row = '100px';
  height5Row = '130px';
  inconsistencia: Inconsistencia;
  errorInconsistencia = {
    idCuitCorredorV: { isChance: false, value: '' },
    idCuitCorredorC: { isChance: false, value: '' },
    idCuitDestinatario: { isChance: false, value: '' },
    idCuitDestino: { isChance: false, value: '' },
    idCuitIntermediarioFlete: { isChance: false, value: '' },
    idCuitMercadoATermino: { isChance: false, value: '' },
    idCuitRemComercial: { isChance: false, value: '' },
    idCuitRepresentanteEntregador: { isChance: false, value: '' },
    idCuitTitula: { isChance: false, value: '' },
    idCuitTransportista: { isChance: false, value: '' },
    idCuitChofer: { isChance: false, value: '' },
    cartaPorte: { isChance: false, value: '' },
    nombreDestino: { isChance: false, value: '' },
    nombreAnterior: { isChance: false, value: '' },
    idCuitIntermediario: { isChance: false, value: '' },
  }
  /* resume = new Resume();
  degrees = ['B.E.', 'M.E.', 'B.Com', 'M.Com']; */

  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VerInconsistenciaComponent>,
    private dialog: MatDialog,

  ) {
   /*  this.resume = JSON.parse(sessionStorage.getItem('resume')) || new Resume();
    if (!this.resume.experiences || this.resume.experiences.length === 0) {
      this.resume.experiences = [];
      this.resume.experiences.push(new Experience());
    }
    if (!this.resume.educations || this.resume.educations.length === 0) {
      this.resume.educations = [];
      this.resume.educations.push(new Education());
    }
    if (!this.resume.skills || this.resume.skills.length === 0) {
      this.resume.skills = [];
      this.resume.skills.push(new Skill());
    } */
  }

  ngOnInit() {
    this.inconsistencia = this.data.payload;
    console.log(this.inconsistencia);
    this.inconsistencia.auditorias.forEach(element => {
      this.errorInconsistencia[element.campo].isChance = true;
      this.errorInconsistencia[element.campo].value = element.valor_anterior;
      this.errorInconsistencia[element.campo].nombreAnterior = element.nombreAnterior;
    });
  }

  cerrar() {
    this.dialogRef.close();
  }

  submit() {
    console.log("submit");
  }

  // public captureScreen() {
  //   /* const documentDefinition = this.getDocumentDefinition();
  //   pdfMake.createPdf(documentDefinition).open(); */

  // }

  public async captureScreen()
  {
    var element = document.getElementById('contentToConvert');
    await html2canvas(element, {
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight * 2
    }).then(canvas => {        
        this.openPopUpNotificar({}, canvas);
      });
  }

  getDocumentDefinition() {
    return {
      content: [
        {
          text: 'Inconsistencia en la Carta Porte N:' + this.inconsistencia.cartaPorte,
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          style: 'columnExample',
          columns: [
            {
              text: 'Column 1'
            },
            {
              text: 'Column 2'
            },
            {
              text: 'Column 3'
            }
          ]
        },
        {
          style: 'tableExample',
          table: {
            widths: [160, 160, 160],
            heights: [20, 50, 70],
            body: [

              ['Column 1', 'Column 2', 'Column 3'],
              ['cloumn1', 'column B', 'Column 3'],
              ['row 2 with height 50', 'column B', 'Column 3'],
              ['row 3 with height 70', 'column B', 'Column 3']
            ]
          }
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        columnExample:{
          fontSize: 18,
          bold: true,
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      }
    }
  }

  openPopUpNotificar(data: any = {}, canva: any) {
    let title = 'Notificar';
    let dialogRef: MatDialogRef<any> = this.dialog.open(NotificarInconsistenciaComponent, {
      width: '60vw',
      height: '75vh',
      disableClose: true,
      data: { title: title, payload: this.inconsistencia, canva: canva }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        } else {
        }
      });
  }

}
