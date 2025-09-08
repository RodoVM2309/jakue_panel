import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';

import { NomencladoresService } from '../../../shared/services/nomencladores.service';

@Component({
  selector: 'app-configurar-muvin',
  templateUrl: './configurar-muvin.component.html',
  styleUrls: ['./configurar-muvin.component.scss']
})
export class ConfigurarMuvinComponent implements OnInit, OnDestroy {
  public itemForm: FormGroup;
  public emailForm: FormGroup;
  public getItemSub: Subscription;
  razonSocial: string = '';
  cuit: number = 0;
  domicilio: string = '';
  id_centro = 1;
  incorrect_emails: boolean = false;
  exists_emails: boolean = false;


  constructor(public router: Router, private formBuilder: FormBuilder,
    private loader: AppLoaderService, private alertService: AppAlertService,
    private errorService: AppErrorService,private nomencladoresService: NomencladoresService) { }

  ngOnInit() {
    this.getItems();

  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
  buildItemForm() {

    this.itemForm = this.formBuilder.group({
      'razonSocial': [null, Validators.required],
      'cuit': [null, Validators.required],
      'domicilio': [null, Validators.required],
      'email': [null]
    });
    this.emailForm = this.formBuilder.group({
      'emailMuvin': [null, Validators.required],
      'emailSiniestro': [null, Validators.required]
    });
  }
  getItems() {
    this.itemForm = this.formBuilder.group({
      'razonSocial': [null, Validators.required],
      'cuit': [null, Validators.required],
      'domicilio': [null, Validators.required],
      'email': [null]
    });
    this.emailForm = this.formBuilder.group({
      'emailMuvin': [null, Validators.required],
      'emailSiniestro': [null, Validators.required]
    });

    this.getItemSub = this.nomencladoresService.getConfiguracionMuvin()
      .subscribe(data => {
        this.itemForm.setValue ({
          razonSocial : data.data.razonSocial,
          cuit: data.data.cuit,
          domicilio: data.data.domicilio,
          email: data.data.email_postulacion
        });
        this.emailForm.setValue ({
          emailMuvin:data.data.email_muvin,
          emailSiniestro: data.data.email_siniestro
        })
      });

  }
  get f() { return this.itemForm.controls; }
  get g() { return this.emailForm.controls; }

  submit() {
    let cu=this.f.cuit.value;
    let datos = {
      razonSocial: this.f.razonSocial.value,
      cuit: cu.toString(),
      domicilio: this.f.domicilio.value,
      email_postulacion: this.f.email.value
    };
    this.loader.open();
      this.getItemSub = this.nomencladoresService.putConfiguracionMuvin(datos)
      .subscribe(data => {
        this.loader.close();
        this.alertService.confirm({ message: '¡Configuración de Muvin guardada correctamente!', tipo: 'exito' }).subscribe(res => {
          if (res) {
           this.router.navigateByUrl('/panel-pedido/pedido');
          }
        });
      },
      err => {
        this.loader.close();
        this.errorService.confirm({ message: 'La configuración de muvin no se pudo guardar, intentelo nuevamente' }).subscribe(res => {
          if (res) {
            return;
          }
        });
      });
    this.loader.close();
  }

  submitEmail() {
    let datos = {
      email_muvin:this.g.emailMuvin.value,
      email_siniestro: this.g.emailSiniestro.value
    };
    this.loader.open();
      this.getItemSub = this.nomencladoresService.putConfiguracionMuvin(datos)
      .subscribe(data => {
        this.loader.close();
        this.alertService.confirm({ message: '¡Configuración de Muvin guardada correctamente!', tipo: 'exito' }).subscribe(res => {
          if (res) {
           this.router.navigateByUrl('/panel-pedido/pedido');
          }
        });
      },
      err => {
        this.loader.close();
        this.errorService.confirm({ message: 'La configuración de muvin no se pudo guardar, intentelo nuevamente' }).subscribe(res => {
          if (res) {
            return;
          }
        });
      });
    this.loader.close();
  }

  closeForm() {
    this.router.navigateByUrl('/panel-pedido/pedido');
  }

  comprobarEmails() {
    let info_emails = [];
    this.incorrect_emails = false;
    this.itemForm.invalid;
    if (this.itemForm.controls["email"].value.toString() !== "") {
      let emailsparam = this.itemForm.controls["email"].value.toString();
      info_emails = emailsparam.split(";");
      for (let i = 0; i < info_emails.length; i++) {
        if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(info_emails[i])) {
          this.itemForm.controls["email"].markAsDirty();
          this.incorrect_emails = true;
          return;
        }
      }
      this.incorrect_emails = false;
    } else {
      this.itemForm.valid;
      this.incorrect_emails = false;
    }
  }

}
