import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormControl, } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { emailMultiValidator } from 'app/shared/directives/multipleEmails';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { CcppService } from '../../../../shared/services/ccpp.service';
import { AppErrorService } from '../../../../shared/services/app-error/app-error.service';
import * as jspdf from 'jspdf';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

export interface Mail {
  name: string;
}

@Component({
  selector: 'app-notificar-inconsistencia',
  templateUrl: './notificar-inconsistencia.component.html',
  styleUrls: ['./notificar-inconsistencia.component.scss']
})
export class NotificarInconsistenciaComponent implements OnInit {
  notificarForm: FormGroup;
  selectedFile: File = null;
  pdfTemp: any;
  msgAdjunto = '<-- Por favor adjunte la Carta de Porte';
  inconsistencia = this.data.payload;

  mailusuario = '';

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  mailarray: Mail[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NotificarInconsistenciaComponent>,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    private ccppService: CcppService,
    private errorService: AppErrorService,
  ) { }

  ngOnInit() {   
    this.notificarForm = new FormGroup({
      email: new FormControl("", [Validators.required]),
      cuerpo: new FormControl(""),
      adjunto: new FormControl(null, [Validators.required]),
    });

    let canvas = this.data.canva;
    // Few necessary setting options
    var imgWidth = 208;
    var pageHeight = 295;
    var imgHeight = canvas.height * imgWidth / canvas.width;
    var heightLeft = imgHeight;

    const contentDataURL = canvas.toDataURL("image/jpeg", 1.0)
    let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
    var position = 0;
    pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight)
    
    // pdf.save('CCPP N ' + inconsistencia.cartaPorte + '.pdf'); // Generated PDF
    var blob = pdf.output('blob');
    this.notificarForm.controls['adjunto'].setValue(blob);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Agregando mail
    if ((value || '').trim()) {
      
      //  comprobando si puedo agregar el maail al arreglo 
      if (this.notificarForm.controls["email"].value.toString() !== "") {
        let emailsparam = this.notificarForm.controls["email"].value.toString();        
        if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(emailsparam)) {
            this.notificarForm.controls["email"].markAsDirty();
            return;
          } else {
            this.mailarray.push({name: value.trim()});
            this.mailusuario = '';      
            this.mailarray.forEach((mail, i)=>{
              this.mailusuario += mail.name + ';';
            });
          }
      } else {
          this.notificarForm.valid;
      }
    }

    // Reset todos los mail
    if (input) {
      input.value = '';
    }
  }

  remove(correo: Mail): void {
    const index = this.mailarray.indexOf(correo);

    if (index >= 0) {
      this.mailarray.splice(index, 1);
      this.mailusuario = '';      
      this.mailarray.forEach((mail, i)=>{
        this.mailusuario += mail.name + ';';
      });
      // this.notificarForm.controls["email"].setValue(
      //   this.mailusuario
      // );
    }
  }

  cerrar() {
    this.dialogRef.close();
  }

  submit(){    
    this.loader.open('Notificando inconsistencia CCPP...');
    console.log(this.inconsistencia.cartaPorte);
      let nombre_pdf = (this.inconsistencia.cartaPorte == '' || this.inconsistencia.cartaPorte == null) ? 'Inconsistencia' : this.inconsistencia.cartaPorte;
      this.ccppService.sendMensaje_inc(this.notificarForm.value, 'CCPP-' + nombre_pdf + '.pdf', this.mailusuario)
        .subscribe(resp => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.alertService.confirm({ message: '¡Inconsistencia CCP notificada correctamente!', tipo: 'exito' }).subscribe(res1 => {
            if (res1) {
              this.dialogRef.close(1);
              return;
            }
          });
        },
          err => {
            this.loader.close();
            this.errorService.confirm({ message: '¡Ocurrió un error al notificar inconsistencia CCP!' })
              .subscribe(res1 => {
                if (res1) {
                }
              });
          })
  }

  onFileSelected(event) {
    console.log(event);
    this.selectedFile = <File>event.target.files[0];
    let extension = event.target.files[0].type.split("/");
    if (
      extension[1] === "pdf" ||
      extension[1] === "PDF"
    ) {
      let reader = new FileReader();
      let urlPdfTemp = reader.readAsDataURL(this.selectedFile);
      reader.onloadend = () => (this.pdfTemp = reader.result);
      this.msgAdjunto = 'Carta de Porte adjuntada: ' + this.selectedFile.name;
      this.notificarForm.controls['adjunto'].setValue(this.selectedFile);
    } else {
      this.msgAdjunto = '<-- Por favor adjunte la Carta de Porte';
      this.notificarForm.controls['adjunto'].setValue(null);
    }
  }

}
