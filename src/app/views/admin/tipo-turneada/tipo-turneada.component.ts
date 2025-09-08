import { Component, OnInit } from '@angular/core';
import { FormControl,  FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { MessageService } from 'app/shared/services/message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tipo-turneada',
  templateUrl: './tipo-turneada.component.html',
  styleUrls: ['./tipo-turneada.component.scss']
})
export class TipoTurneadaComponent implements OnInit {
  public itemForm: FormGroup;
  tipoTurneada: string = '';
  tipoTurneada0: boolean = false;
  tipoTurneada1: boolean = false;
  tipoTurneada2: boolean = false;
  chanceValue: boolean = false;
  public getItemSub: Subscription;
  tipoAccion = [
    { id: 1, descripcion: 'Pérdida de turno' },
    { id: 2, descripcion: 'Ocupa último lugar' }
  ];
  tipoAccionInicial: number = 0;
  constructor( private formBuilder: FormBuilder,
    private loader: AppLoaderService, private alertService: AppAlertService,
    private errorService: AppErrorService, private nomencladoresService: NomencladoresService,
    private messageService: MessageService,
    private translate: TranslateService, ) { }

  ngOnInit() {
    this.tipoTurneada = localStorage.getItem('tipo_turneada');
    this.tipoTurneada0 = localStorage.getItem('tipo_turneada') === '0' ? true : false;
    this.tipoTurneada1 = localStorage.getItem('tipo_turneada') === '1' ? true : false;
    this.tipoTurneada2 = localStorage.getItem('tipo_turneada') === '2' ? true : false;
    this.itemForm = this.formBuilder.group({
      'tipoAccionSeleccionado': [0],
    });
    this.getItemSub = this.nomencladoresService.getConfiguracionCentro()
      .subscribe(data => {
        this.tipoAccionInicial = data.data.id_tipo_turneada == 2 ? data.data.accion_rechazo_viaje : 0;
        this.itemForm.setValue({
          tipoAccionSeleccionado: data.data.id_tipo_turneada == 2 ? data.data.accion_rechazo_viaje : 0
        });
      });
  }
  onChangeTipoTurneada(valor) {
    let temp: string = '';
    switch (valor) {
      case 1:
        this.tipoTurneada1 = !this.tipoTurneada1;
        if (this.tipoTurneada1)
          this.tipoTurneada2 = false;
        temp = this.valorTurneada();
        if (temp != this.tipoTurneada)
          this.chanceValue = true;
        else
          this.chanceValue = false;
        break;
      case 2:
        this.tipoTurneada2 = !this.tipoTurneada2;
        if (this.tipoTurneada2)
          this.tipoTurneada1 = false;
        temp = this.valorTurneada();
        if (temp != this.tipoTurneada || this.itemForm.controls["tipoAccionSeleccionado"].value != this.tipoAccionInicial)
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
    if (!this.tipoTurneada1 && !this.tipoTurneada2)
      tipoTemp = '0'
    else {
      if (this.tipoTurneada1)
        tipoTemp = '1'
      else tipoTemp = '2'
    }
    return tipoTemp
  }
  onChangeModo(value) {
    if (value != this.tipoAccionInicial)
      this.chanceValue = true;
    else
      this.chanceValue = false;
  }
  submit() {
    let temp: string = '';
    temp = this.valorTurneada();
    switch ( temp) {
      case '0':
        this.tipoAccionInicial = 0;
        break;    
      case '1':
        this.tipoAccionInicial = 1;
        break;    
      default:
        this.tipoAccionInicial = 2;
        break;
    }
    
    let datos = {
      //id_centro: id_centro,
      id_tipo_turneada: temp,
      accion_rechazo_viaje: this.tipoTurneada2 ? this.itemForm.controls["tipoAccionSeleccionado"].value : 0,
    };
    this.loader.open();
    this.getItemSub = this.nomencladoresService.putConfiguracionCentro(datos)
      .subscribe(data => {
        this.loader.close();
        localStorage.setItem('tipo_turneada', temp);
        this.translate.get('tipo-turneado.guardarOk').subscribe((res: string) => {
          this.alertService.confirm({ message: res, tipo: 'exito' }).subscribe(res1 => {
            if (res1) {
              this.chanceValue = true;
              if (temp == '0') {
                this.messageService.sendMessage('QuitarTurneada');
              }
              else {
                this.messageService.sendMessage('AddTurneada');
              }
              
            }
            
          });
        });
      },
        err => {
          this.loader.close();
          this.translate.get('tipo-turneado.errorGuardar').subscribe((res: string) => {
            this.errorService.confirm({ message: res }).subscribe(res1 => {
              if (res1) {
                return;
              }
            });
          })
        });
  }

}
