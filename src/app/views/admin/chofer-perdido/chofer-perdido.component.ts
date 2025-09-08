import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { PersonasService } from './../../../shared/services/personas.service';
import { AddPersonaComponent } from './../personas/add-persona/add-persona.component'
import { Page } from '../../../shared/models/page';

export class ChoferLibre {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  id_tipo_camion: number;
  fecha: string;
  tipo_camion: string;
}

@Component({
  selector: 'app-chofer-perdido',
  templateUrl: './chofer-perdido.component.html',
  styleUrls: ['./chofer-perdido.component.scss']
})
export class ChoferPerdidoComponent implements OnInit {
  public choferes: ChoferLibre[];
  page = new Page();
  public filtro;
  public getItemSub: Subscription;
  idchoferlibre: any;
  lat: number = -32.96104572191259;
  lng: number = -61.15374192669714;
  zoom: number = 7;
  constructor(private personasService: PersonasService, 
    public router: Router, private dialog: MatDialog, 
    private snack: MatSnackBar, 
    private loader: AppLoaderService, private alertService: AppAlertService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    //this.getItems();
    this.setPage({ offset: 0 });
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filtro = event.target.value.toLowerCase();
    this.setPage({ offset: 0 });
  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro == undefined) {
      this.filtro = '';
    }
    this.personasService.getAllChoferesPerdidos(this.page.pageNumber, this.filtro).subscribe(pagedData => {
      this.choferes = pagedData.data;
      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;

    });
  }
  openPopUpAgregarChofer(data: any = {}) {
    this.idchoferlibre = data.id;
    let dialogRefPersona: MatDialogRef<any> = this.dialog.open(AddPersonaComponent, {
      width: '720px',
      disableClose: true,
      data: { title: 'Agregar Chofer Libre a Personas', payload: { nombre: data.nombre, apellidos: data.apellidos, usuario: { email: data.email }, id_tipo_persona: 1, razon_social: data.apellidos + ', ' + data.nombre, telefono: data.telefono }, isNew: true }
    });
    dialogRefPersona.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.loader.open();
        this.personasService.postPersona(res)
          .subscribe(data => {
            let id_usuario;
            if (data.success) {
              id_usuario = data.data.id;
              this.personasService.postRolPersona({
                id_rol: 2,
                id_usuario: id_usuario
              }).subscribe(data => {
                if (data.success) {
                  this.loader.close();
                  this.setPage({ offset: 0 });
                  this.snack.open('Chofer agregado!', 'OK', { duration: 4000 });                  
                } else {
                  this.loader.close();
                  this.alertService.confirm({ message: 'Hay errores al agregar persona rol!' });
                }
              }, err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Hay errores al agregar persona rol!.1' });
              });
            } else {
              this.loader.close();
              this.alertService.confirm({ message: 'Hay errores alagregar la persona!' });
            }
          },
            err => {
              this.loader.close();
              this.alertService.confirm({ message: 'Hay errores alagregar la persona!.1' });
            });
      });
  }
  

}
