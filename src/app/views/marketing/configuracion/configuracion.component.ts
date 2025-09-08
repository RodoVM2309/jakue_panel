import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';

import { MarketingService } from '../../../shared/services/marketing.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit, OnDestroy {
  public itemForm: FormGroup;
  public getItemSub: Subscription;

  horas: number = 0;
  horasInicial: number = 0;
  km: number = 0;
  kmInicial: number = 0;
  newConfiguracion = true;

  id_centro = '';

  constructor(public router: Router, private formBuilder: FormBuilder, 
    private loader: AppLoaderService, private alertService: AppAlertService,
    private errorService: AppErrorService,private marketingService: MarketingService) { }

  ngOnInit() {
    this.getItems();
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
  getItems() {
    this.itemForm = this.formBuilder.group({
      'horas': [null, [Validators.required, Validators.min(0), Validators.max(48)]],
      //'km': [null, [Validators.required, Validators.min(10), Validators.max(200)]]
    });
    this.getItemSub = this.marketingService.getConfiguracionNotificaciones()
      .subscribe(data => {
        this.horasInicial = data.data.horas;
            this.kmInicial = data.data.km;
            this.itemForm.setValue ({
              horas : data.data.horas,
              //km: data.data.km
            });
            this.newConfiguracion = false;
      });

  }
  get f() { return this.itemForm.controls; }

  submit() {
    let datos = {
      horas: this.f.horas.value,
      //km: this.f.km.value
    };
    this.loader.open();
     if ( this.newConfiguracion) {
      this.getItemSub = this.marketingService.postConfiguracionMarketing(datos)
      .subscribe(data => {
        this.loader.close();
        this.alertService.confirm({ message: '¡Configuración  guardada correctamente!', tipo: 'exito' }).subscribe(res => {
          if (res) {
           this.router.navigateByUrl('/marketing/notificaciones');
          }
        });
      });
     }else{
      this.getItemSub = this.marketingService.putConfiguracionMarketing(datos)
      .subscribe(data => {
        this.loader.close();
        this.alertService.confirm({ message: '¡Configuración  guardada correctamente!', tipo: 'exito' }).subscribe(res => {
          if (res) {
           this.router.navigateByUrl('/marketing/notificaciones');
          }
        });
      },
      err => {
        this.loader.close();
        this.errorService.confirm({ message: 'La configuración no se pudo guardar, intentelo nuevamente' }).subscribe(res => {
          if (res) {
            return;
          }
        });
      });
     }
    
    this.loader.close();
    
  }

  closeForm() {
    this.router.navigateByUrl('/marketing/notificaciones');
  }

}
