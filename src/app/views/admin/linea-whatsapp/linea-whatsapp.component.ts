import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { TranslateService } from '@ngx-translate/core';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { MessageService } from 'app/shared/services/message.service';

@Component({
  selector: 'app-linea-whatsapp',
  templateUrl: './linea-whatsapp.component.html',
  styleUrls: ['./linea-whatsapp.component.scss']
})
export class LineaWhatsappComponent implements OnInit {
  public itemForm: FormGroup;
  usuarioWhatsapp: string = '0';
  usuarioWhatsapp1: boolean = false;
  usuarioWhatsapp0: boolean = false;
  chanceValue: boolean = false;
  public getItemSub: Subscription;
  tipoAccionInicial: number = 0;
 
  constructor(
    private formBuilder: FormBuilder,
    private nomencladoresService: NomencladoresService,
    private loader: AppLoaderService, private alertService: AppAlertService,
    private translate: TranslateService,
    private errorService: AppErrorService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    
    this.itemForm = this.formBuilder.group({
      'tipoAccionSeleccionado': [0],
    });
    this.getItemSub = this.nomencladoresService.getConfiguracionCentro()
      .subscribe(data => {
        this.tipoAccionInicial = data.data.linea_whats_app;
        this.usuarioWhatsapp = data.data.linea_whats_app;
        this.usuarioWhatsapp0 = this.tipoAccionInicial === 0 ? true : false;
        this.usuarioWhatsapp1 = this.tipoAccionInicial === 1 ? true : false;
        this.itemForm.setValue({
          tipoAccionSeleccionado: data.data.linea_whats_app
        });
      });
  }

  onChangeUsuarioWhatsapp(valor) {
    let temp: string = '0';
    switch (valor) {
      case 0:
        if (!this.usuarioWhatsapp0)
          this.usuarioWhatsapp0 = !this.usuarioWhatsapp0;
        if (this.usuarioWhatsapp0) {
          this.usuarioWhatsapp1 = false;
          temp = '0';
        }

        if (temp != this.tipoAccionInicial.toString())
          this.chanceValue = true;
        else
          this.chanceValue = false;
        break;
      case 1:
        if (!this.usuarioWhatsapp1)
          this.usuarioWhatsapp1 = !this.usuarioWhatsapp1;
        if (this.usuarioWhatsapp1) {
          this.usuarioWhatsapp0 = false;
          temp = '1';
        }

        if (temp != this.tipoAccionInicial.toString())
          this.chanceValue = true;
        else
          this.chanceValue = false;
        break;
      default:
        break;
    }
  }
  valorTurneada() {
    let tipoTemp = '';
    if (this.usuarioWhatsapp1)
      tipoTemp = '1'
    else tipoTemp = '0'
    return tipoTemp
  }
  submit() {
    let temp: string = '';
    temp = this.valorTurneada();
    switch (temp) {
      case '0':
        this.tipoAccionInicial = 0;
        break;
      case '1':
        this.tipoAccionInicial = 1;
        break;
      default:
        break;
    }
    
    let datos = {
      //id_centro: id_centro,
      linea_whats_app: temp
    };
    this.loader.open();
    this.getItemSub = this.nomencladoresService.putConfiguracionCentro(datos)
      .subscribe(data => {
        this.loader.close();
        this.chanceValue = false;
        localStorage.setItem('linea_whats_app', temp);
        this.translate.get('usuario-whatsapp.guardarOk').subscribe((res: string) => {
          this.alertService.confirm({ message: res, tipo: 'exito' }).subscribe(res1 => {
            if (res1) {
               if (temp == '0') {
                this.messageService.sendMessage('QuitarLineaWhatsapp');
              }
              else {
                this.messageService.sendMessage('AddLineaWhatsapp');
              } 
            }
          });
        });
      },
        err => {
          this.loader.close();
          this.translate.get('usuario-whatsapp.errorGuardar').subscribe((res: string) => {
            this.errorService.confirm({ message: res }).subscribe(res1 => {
              if (res1) {
                return;
              }
            });
          })
        });
  }

}
