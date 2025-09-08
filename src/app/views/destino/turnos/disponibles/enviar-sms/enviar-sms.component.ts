import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { SendMessage } from '../disponibles.component'
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { DestinosService } from 'app/shared/services/destinos.service';
import { AppAtencionService } from "app/shared/services/app-atencion/app-atencion.service";
export class SendMess {
  horarios: number[]; 
  mensaje: string;
}
@Component({
  selector: 'app-enviar-sms',
  templateUrl: './enviar-sms.component.html',
  styleUrls: ['./enviar-sms.component.scss']
})
export class EnviarSmsComponent implements OnInit {
  public itemForm: FormGroup;
  listMensajes: SendMessage[];
  lista: SendMess[];


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EnviarSmsComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private destinosService: DestinosService,
    private atencionService: AppAtencionService,
    private snack: MatSnackBar) { }

  ngOnInit() {
    this.listMensajes = this.data.payload.listMensajes;
    this.itemForm = this.fb.group({
      body: ['', [Validators.required, this.customValidator()]]
    });
  }

  customValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = /^[A-Za-z0-9.,!¡()?¿\s]*$/.test(control.value); // Incluye ? y ¿
      return valid ? null : { invalidCharacters: true };
    };
  }

  submit() {
    console.log("Enviando mensajes");
    let lista = [];
    this.listMensajes.forEach(element => {
      lista.push(element.horarios);
    });
    let dat :SendMess= {
      horarios: lista,   
      mensaje: this.itemForm.controls['body'].value
    }
    this.loader.open();
    this.destinosService.postSmsDestino(dat).subscribe(
      data => {
        if (this.loader !== null) {
          this.loader.close();
        }
        this.snack.open("¡WhatsApp enviado!", "OK", { duration: 4000 });
        this.dialogRef.close(1);

      },
      err => {
        this.loader.close();
        this.atencionService
          .confirm({ message: "No se pudieron enviar los WhatsApp" })
          .subscribe(res => {
            if (res) {
              return;
            }
          });
      this.dialogRef.close();
      }
    );

  }
  cancelar() {
    this.dialogRef.close();
  }


}
