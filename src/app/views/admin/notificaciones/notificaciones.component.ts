import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { MessageService } from 'app/shared/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss']
})
export class NotificacionesComponent implements OnInit {
  public itemFormNotificaciones: FormGroup;
  public getItemSub: Subscription;

  idCentro = '';

  incorrect_emails: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private loader: AppLoaderService, private alertService: AppAlertService,
    private errorService: AppErrorService, private nomencladoresService: NomencladoresService,
    private messageService: MessageService,
    private translate: TranslateService, private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
      .subscribe(data => this.idCentro = data.data);
    this.getItems();
  }
  getItems() {
    this.itemFormNotificaciones = new FormGroup({
      email: new FormControl('')
    });
    this.getItemSub = this.nomencladoresService.getConfiguracionCentro()
      .subscribe(data => {
        if (data.data.email_postulacion != null)
          this.itemFormNotificaciones.setValue({
            email: data.data.email_postulacion
          });
        this.comprobarEmails();
      });
  }
  submitNotificaciones() {
    console.log(this.idCentro);
    let datos = {
      id_centro: this.idCentro,
      email_postulacion: this.itemFormNotificaciones.controls["email"].value
    };
    this.loader.open();
    this.getItemSub = this.nomencladoresService.putConfiguracionCentro(datos)
      .subscribe(data => {
        this.loader.close();
        this.translate.get('configuracion-notificaciones.guardarOk').subscribe((res: string) => {
          this.alertService.confirm({ message: res, tipo: 'exito' }).subscribe(res1 => {
            if (res1) {
              return;
            }
          })
        });
      },
        err => {
          this.loader.close();
          this.translate.get('configuracion-notificaciones.errorGuardar').subscribe((res: string) => {
            this.errorService.confirm({ message: res }).subscribe(res1 => {
              if (res1) {
                return;
              }
            });
          })
        });
  }
  comprobarEmails() {
    let info_emails = [];
    this.incorrect_emails = false;
    this.itemFormNotificaciones.invalid;
    if (this.itemFormNotificaciones.controls["email"].value.toString() !== "") {
      let emailsparam = this.itemFormNotificaciones.controls["email"].value.toString();
      info_emails = emailsparam.split(";");
      for (let i = 0; i < info_emails.length; i++) {
        if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(info_emails[i])) {
          this.itemFormNotificaciones.controls["email"].markAsDirty();
          //this.itemFormNotificaciones.controls["email"].invalid;
          this.incorrect_emails = true;
          this.itemFormNotificaciones.invalid;
          return;
        }
      }
      this.incorrect_emails = false;
      this.itemFormNotificaciones.valid;
    } else {
      this.itemFormNotificaciones.invalid;
      this.incorrect_emails = true;
    }
  }

}
