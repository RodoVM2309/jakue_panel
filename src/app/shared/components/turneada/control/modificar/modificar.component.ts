import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDatepickerInputEvent, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { CentrosService } from 'app/shared/services/centros.service';
import { Subscription } from 'rxjs';
import { Lista } from '../../estado-choferes/estado-choferes.component';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.component.html',
  styleUrls: ['./modificar.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es-ES"
    }
  ]
})
export class ModificarComponent implements OnInit {
  itemForm: FormGroup;
  public getItemSub: Subscription;
  id_lista_actual: number;
  id_lista_nueva: number;
  id_viaje: '';
  id_lista_pedido: number;
  observaciones: string = "";
  public listas: Lista[];
  public id_tipo_turneada = '';
  public id_chofer = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ModificarComponent>,
  private loader: AppLoaderService,
   private alertService: AppAlertService,
  private nomencladoresService: NomencladoresService,
  private errorService: AppErrorService,
  public centroService: CentrosService,
  ) { }

  ngOnInit() {
    this.id_tipo_turneada = localStorage.getItem('tipo_turneada');
    this.id_viaje = this.data.payload.id_viaje;
    this.id_chofer = this.data.payload.id_chofer;
    this.id_lista_pedido =parseInt(this.data.payload.id_lista_pedido);
    this.itemForm = new FormGroup({
      id_lista_nueva: new FormControl(null,Validators.required),
      observaciones: new FormControl(this.observaciones,Validators.required)
    });
    this.getListaCentro();
  }
  getListaCentro() {
    this.getItemSub = this.centroService.getMisListaCentro(this.id_chofer)
      .subscribe(data => {
        this.listas =[];
        data.data.forEach(element => {
          if (element.id != this.id_lista_pedido)
          this.listas.push(element)
        });
      });
  }

  submit(){
    this.loader.open();
    let dataPost = {
      id_viaje: this.id_viaje,
      id_lista_actual: this.itemForm.controls["id_lista_nueva"].value,
      observaciones: this.itemForm.controls["observaciones"].value,
    }
    this.nomencladoresService.postViajeCambiarLista(dataPost)
      .subscribe(data => {

        if (this.loader !== null) {
          this.loader.close();
        };
        this.alertService.confirm({ message: '¡Estado Modificado!', tipo: 'exito' }).subscribe(res => {
          if (res) {
            this.dialogRef.close(1);
            return;
          }
        });
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'No se puede agregar el modificar.' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
  }

}
