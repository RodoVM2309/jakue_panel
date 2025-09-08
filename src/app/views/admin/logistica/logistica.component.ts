import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { MessageService } from 'app/shared/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-logistica',
  templateUrl: './logistica.component.html',
  styleUrls: ['./logistica.component.scss']
})
export class LogisticaComponent implements OnInit {
  public itemForm: FormGroup;
  chanceValue: boolean = false;
  public getItemSub: Subscription;
  horas: number = 0;
  horasInicial: number = 0;
  km: number = 0;
  kmInicial: number = 0;
  idCentro = '';
  newConfiguracion = true;
  constructor(
    private loader: AppLoaderService, private alertService: AppAlertService,
    private errorService: AppErrorService, private nomencladoresService: NomencladoresService,
    private translate: TranslateService, private userService: UserService
  ) { }

  ngOnInit() {
    this.getItems();
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
    .subscribe(data => this.idCentro = data.data);

  }
  getItems() {
    this.itemForm = new FormGroup({
      horas: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(48)]),
      condiciones_viaje: new FormControl(null, Validators.required),
      km: new FormControl(null, [Validators.required, Validators.min(10), Validators.max(200)])
    });

    this.getItemSub = this.nomencladoresService.getConfiguracionCentro()
      .subscribe(data => {
        this.horasInicial = data.data.horas;
        this.kmInicial = data.data.km;
        this.itemForm.setValue({
          horas: data.data.horas,
          km: data.data.km,
          condiciones_viaje: data.data.condiciones_viaje
        });
        this.newConfiguracion = false;

      });
  }
  submit() {
    let datos = {
      id_centro: this.idCentro,
      horas: this.itemForm.controls["horas"].value,
      km: this.itemForm.controls["km"].value,
      condiciones_viaje: (this.itemForm.controls["condiciones_viaje"].value ? 1 : 0)
    };
    this.loader.open();
    if (this.newConfiguracion) {
      this.getItemSub = this.nomencladoresService.postConfiguracionCentro(datos)
        .subscribe(data => {
          this.loader.close();
          this.translate.get('logistica.guardarOk').subscribe((res: string) => {
            this.alertService.confirm({ message: '¡Configuración del Centro guardada correctamente!', tipo: 'exito' }).subscribe(res => {
              if (res) { }
            })
          });
        });
    } else {
      this.getItemSub = this.nomencladoresService.putConfiguracionCentro(datos)
        .subscribe(data => {
          this.loader.close();
          this.translate.get('logistica.guardarOk').subscribe((res: string) => {
            this.alertService.confirm({ message: '¡Configuración del Centro guardada correctamente!', tipo: 'exito' })
              .subscribe(res1 => {
                if (res1) { 
                  return;
                }
              })
          });
        },
          err => {
            this.loader.close();
            this.translate.get('logistica.errorGuardar').subscribe((res: string) => {
              this.errorService.confirm({ message: res }).subscribe(res1 => {
                if (res1) {
                  return;
                }
              });
            })
          });
    }

    this.loader.close();


  }

}
