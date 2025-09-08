import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';

import { ListaNegraMotivosService } from './../../../shared/services/lista-negra-motivos.service';
import { ListaNegraMotivo } from './../../../shared/models/listaNegraMotivo';
import {AddListaNegraMotivoComponent} from './add-lista-negra-motivo/add-lista-negra-motivo.component'

@Component({
  selector: 'app-motivo-lista-negra',
  templateUrl: './motivo-lista-negra.component.html',
  styleUrls: ['./motivo-lista-negra.component.scss']
})
export class MotivoListaNegraComponent implements OnInit, OnDestroy {
  public lista_negra_motivo: ListaNegraMotivo[];
  public getItemSub: Subscription;

  constructor(private lista_negra_motivoService: ListaNegraMotivosService, 
    public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private loader: AppLoaderService, private alertService: AppAlertService) { }

  ngOnInit() {
    this.getItems();
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  getItems() {
    this.getItemSub = this.lista_negra_motivoService.getAllListaNegraMotivo()
      .subscribe(data => {
        this.lista_negra_motivo = data.data;
      });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.lista_negra_motivo.filter(function(d) {
      return d.descripcion.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.lista_negra_motivo = temp;
    if(val === ''){
      this.getItems();
    }
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Motivo de Lista Negra' : 'Modificar Motivo de Lista Negra';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddListaNegraMotivoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {
          this.lista_negra_motivoService.postListaNegraMotivo(res)
            .subscribe(data => {
              this.lista_negra_motivo.unshift(data);
              this.getItems();
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Motivo de  Lista Negra agregado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Motivo de Lista Negra ya se encuentra ingresado' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        } else {
          this.lista_negra_motivoService.updateListaNegraMotivo(res)
            .subscribe(data => {
              this.lista_negra_motivo = data;
              this.getItems();
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Motivo de Lista Negra modificado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Motivo de Lista Negra no se puede modificar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar este Motivo Lista Negra?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.lista_negra_motivoService.deleteListaNegraMotivo(row.id)
            .subscribe(data => {
              this.loader.close();
              this.lista_negra_motivo = data;
              this.getItems();              
              this.snack.open('Motivo de Lista Negra eliminado!', 'OK', { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Este Motivo Lista Negra no se puede eliminar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }

}
