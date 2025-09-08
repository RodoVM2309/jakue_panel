import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-stop',
  templateUrl: './stop.component.html',
  styleUrls: ['./stop.component.scss']
})
export class StopComponent implements OnInit {
  public itemFormStop: FormGroup;
  public getItemSub: Subscription;
  id_centro = '';
  
  constructor(
    private loader: AppLoaderService, private alertService: AppAlertService,
    private errorService: AppErrorService, private nomencladoresService: NomencladoresService,
    private translate: TranslateService,private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
      .subscribe(data => this.id_centro = data.data);
    this.getItems();
  }
  getItems() {
    this.itemFormStop = new FormGroup({
      api_key: new FormControl('')
    });
    this.getItemSub = this.nomencladoresService.getConfiguracionCentro()
      .subscribe(data => {
        
        this.itemFormStop.setValue({
          api_key: data.data.api_key_externa
        });
      });
  }
  submitStop() {
    let datos = {
      id_centro: this.id_centro,
      api_key_externa: this.itemFormStop.controls["api_key"].value
    };
    this.loader.open();
    this.getItemSub = this.nomencladoresService.putConfiguracionCentroKey(datos)
      .subscribe(data => {
        this.loader.close();
        this.translate.get('configuracion-stop.guardarOk').subscribe((res: string) => {
          this.alertService.confirm({ message: res, tipo: 'exito' }).subscribe(res1 => {
            if (res1) { 
              return;
            }
          })
        });   
      },
        err => {
          this.loader.close();
          this.translate.get('configuracion-stop.errorGuardar').subscribe((res: string) => {
            this.errorService.confirm({ message: res }).subscribe(res1 => {
              if (res1) {
                return;
              }
            });
          })   
        });
  }

}
