import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AddAcopladoComponent} from './add-acoplado/add-acoplado.component';
import { NomencladoresService } from './../../../shared/services/nomencladores.service';
import { Acoplado } from '../../../shared/models/acoplado';

@Component({
  selector: 'app-acoplado',
  templateUrl: './acoplado.component.html',
  styleUrls: ['./acoplado.component.scss']
})
export class AcopladoComponent implements OnInit {
  public acoplados : Acoplado[];
  public getItemSub: Subscription;
  constructor(private nomencladoresService:NomencladoresService,public router: Router,private dialog: MatDialog,
    private snack: MatSnackBar,private confirmService: AppConfirmService,
    private loader: AppLoaderService) { }
 
    ngOnInit() {
      this.getItems();
    }
    ngOnDestroy() {
      if (this.getItemSub) {
        this.getItemSub.unsubscribe()
      }
    }
    getItems() {
      this.getItemSub = this.nomencladoresService.getAllMarcaCamionesSelect()
        .subscribe(data => {
          this.acoplados = data.data.marcaCamion;
        })
    }
    openPopUp(data: any = {}, isNew?) {
      let title = isNew ? 'Adicionar nuevo Acoplado' : 'Actualizar Acoplado';
      let dialogRef: MatDialogRef<any> = this.dialog.open(AddAcopladoComponent, {
        width: '720px',
        disableClose: true,
        data: { title: title, payload: data, isNew:isNew }
      })
      dialogRef.afterClosed()
        .subscribe(res => {
          if(!res) {
            // If user press cancel
            return;
          }
         // this.loader.open();
          if (isNew) {
            this.nomencladoresService.postMarcaCamion(res)
              .subscribe(data => {
                this.acoplados.unshift(data);
                this.getItems();
               // this.loader.close();
                //this.snack.open('Rol Adicionado!', 'OK', { duration: 4000 })
                return of(this.acoplados.slice()).pipe(delay(1000));
              })
          } else {
            this.nomencladoresService.updateMarcaCamion(res)
              .subscribe(data => {
                this.acoplados = data;
                this.getItems();
                /* this.loader.close();
                this.snack.open('Rol Actualizado!', 'OK', { duration: 4000 }) */
                return of(this.acoplados.slice()).pipe(delay(1000));
              })
          }
        })
    }
    deleteItem(row) {
      this.confirmService.confirm({message: `Ud. está seguro de eliminar el acoplado: ${row.descripcion}?`})
        .subscribe(res => {
          if (res) {
            //this.loader.open();
            this.nomencladoresService.deleteMarcaCamion(row.id)
              .subscribe(data => {
                this.acoplados = data;
                this.getItems();
                
                return of(this.acoplados.slice()).pipe(delay(1000));
              })
          }
        })
    }


}
