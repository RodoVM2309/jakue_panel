import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { AppAtencionService } from 'app/shared/services/app-atencion/app-atencion.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { CentrosService } from 'app/shared/services/centros.service';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import {  Subscription} from 'rxjs';
import { MessageService } from 'app/shared/services/message.service';
export class Lista {
  id?: number;
  id_centro: number;
  nombre: string;
}

@Component({
  selector: 'app-listar-lista',
  templateUrl: './listar-lista.component.html',
  styleUrls: ['./listar-lista.component.scss']
})
export class ListarListaComponent implements OnInit {
  public itemFormLista: FormGroup;
  public isNueva: boolean = false;
  public listas: Lista[];
  public getItemSub: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ListarListaComponent>,
    private fb: FormBuilder,
    private errorService: AppErrorService,
    private loader: AppLoaderService,
    private messageService: MessageService,
    private alertService: AppAlertService,
    private nomencladoresService: NomencladoresService,
    private centroService: CentrosService
  ) { }

  ngOnInit() {
    
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    this.getItemSub = this.centroService.getAllListaCentro(item.id_tipo_turneada)
    .subscribe(data => {
      this.listas = data.data;
    });

    let id_pedido = item.id_pedido;
    let id_tipo_turneada = item.id_tipo_turneada !== undefined ? item.id_tipo_turneada : localStorage.getItem('tipo_turneada');
    let dataform = {
      id_pedido: [item.id_pedido],
      id_lista: null
    };
    this.itemFormLista = this.fb.group(dataform);
  }

  submit() {
    this.loader.open();
    let datafrm = this.itemFormLista.value;

    let dataPost = {
      id: datafrm.id_pedido,
      id_lista: datafrm.id_lista
    }
    this.nomencladoresService.postConfirmarPedido(dataPost).subscribe(
      data => {
        if (this.loader !== null) {
          
          this.loader.close();
        }
        this.alertService
          .confirm({ message: "Pedido actualizado!", tipo: "exito" })
          .subscribe(res => {
            if (res) {
              this.messageService.sendMessage('Nuevo Pedido');
              this.dialogRef.close(data);
            }
          });
      },
      err => {
        if (this.loader !== null) {
          this.loader.close();
        }
        this.errorService
          .confirm({ message: "Esta pedido no se pudo modificar" })
          .subscribe(res => {
            if (res) {
              //return;
            }
          });
      }
    );

  }

}
