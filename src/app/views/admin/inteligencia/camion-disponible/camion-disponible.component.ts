import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { PersonasService } from './../../../../shared/services/personas.service';
import { AddPersonaComponent } from './../../personas/add-persona/add-persona.component';
import { Page } from '../../../../shared/models/page';
import { AppErrorService } from '../../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../../shared/services/app-atencion/app-atencion.service';
import { AddSmsComponent } from 'app/shared/components/home/asignar-viaje/add-sms/add-sms.component';
import { SendsmsService } from '../../../../shared/services/sendsms.service';

export class ChoferDisponible {
  id_chofer: number;
  nombre_chofer: string;
  celular: string;
  transportista: string;
  intermediario: string;
  id_tipo_acoplado: number;
  tipo_acoplado: string;
  longitud: number;
  latitud: string;
  distancia: number;
  nombre_centro: string;
}

@Component({
  selector: 'app-camion-disponible',
  templateUrl: './camion-disponible.component.html',
  styleUrls: ['./camion-disponible.component.scss']
})
export class CamionDisponibleComponent implements OnInit {
  public choferes: ChoferDisponible[];
  public choferesTodos: ChoferDisponible[];
  page = new Page();
  public  filtro;
  public  filtroNombre;
  public  filtroApellido;
  public getItemSub: Subscription;
  idchoferlibre: any;
  lat: number = -32.96104572191259;
  lng: number = -61.15374192669714;
  zoom: number = 7;
  previous;
  seleccionados = [];
  llamar = false;
  @ViewChild('myTable') table: any;
  showEmpresa = true;

  public iconUrlGreen = 'https://mt.google.com/vt/icon?psize=30&font=fonts/arialuni_t.ttf&color=ff304C13&name=icons/spotlight/spotlight-waypoint-a.png&ax=43&ay=48&text=%E2%80%A2';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private personasService: PersonasService,
    public router: Router, private dialog: MatDialog, private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    public dialogRef: MatDialogRef<CamionDisponibleComponent>,
    private errorService: AppErrorService, private atencionService: AppAtencionService,
    private loader: AppLoaderService, private alertService: AppAlertService, private smsService: SendsmsService) {
      this.page.pageNumber = 0;
      this.page.size = 10;
     }
 /*  ngOnInit() {
    this.buildItemForm(this.data.payload, this.data.provincia);
  }  */
  ngOnInit() {
     /* this.cargarTodos()
     this.setPage({ offset: 0 }); */
     if(this.data.payload.tipo === 1){
      this.showEmpresa = false;
      this.choferes = this.data.payload.data.camiones_disponibles;
     }else {
      if(this.data.payload.tipo === 2){
        this.choferes = this.data.payload.data.camiones_muvin;
       } else {
        this.choferes = this.data.payload.data.camiones_clientes;
       }
     }
     
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filtro = event.target.value.toLowerCase();
    this.setPage({ offset: 0 });
  }
  updateFilterNombre(event) {
    const val = event.target.value.toLowerCase();
    this.filtroNombre = event.target.value.toLowerCase();
    this.setPage({ offset: 0 });
  }
  updateFilterApellido(event) {
    const val = event.target.value.toLowerCase();
    this.filtroApellido = event.target.value.toLowerCase();
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro === undefined) {
      this.filtro = '';
    }
    if (this.filtroNombre === undefined) {
      this.filtroNombre = '';
    }
    if (this.filtroApellido === undefined) {
      this.filtroApellido = '';
    }    
  }
  cargarTodos(){
   
  }
  openPopUpAgregarChofer(data: any = {}) {
    this.idchoferlibre = data.id;
    let dialogRefPersona: MatDialogRef<any> = this.dialog.open(AddPersonaComponent, {
      width: '720px',
      disableClose: true,
      data: { title: 'Agregar Chofer Libre a Personas',
       payload: { nombre: data.nombre, apellidos: data.apellidos, 
       usuario: { email: data.email }, id_tipo_persona: 1, razon_social: data.apellidos + ', ' + data.nombre, 
       telefono: data.telefono }, isNew: true }
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
                        this.alertService.confirm({ message: '¡Chofer agregado!', tipo: 'exito' }).subscribe(res => {
                          if (res) {
                            return;
                          }
                        });                  
                } else {
                  this.loader.close();
                  this.errorService.confirm({ message: 'Hay errores al agregar persona rol!' });
                }

              }, err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Hay errores al agregar persona rol!' });
              });
            } else {
              this.loader.close();
              this.errorService.confirm({ message: 'Hay errores alagregar la persona!' });
            }

          },
            err => {
              this.loader.close();
              this.errorService.confirm({ message: 'Hay errores al agregar la persona!' });
            });
      });
  }
  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar el chofer: ' + row.nombre +' '+row.apellidos + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.personasService.postChoferPerdido(row)
            .subscribe(data => {
              this.setPage({ offset: 0 });
                  this.loader.close();
                  this.alertService.confirm({ message: '¡Chofer libre eliminado!', tipo: 'exito' }).subscribe(res => {
                    if (res) {
                      return;
                    }
                  });
            });
        }
      });
  }

  openPopUpwhatsapp(data: any = {}, isNew?) {
    let title = 'Mensaje Whatsapp al Chofer';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddSmsComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        var newString = res.mensaje.replace('', "%20");
        window.open("https://web.whatsapp.com/send?phone=+549" + res.celular + "&text=" + newString, "_blank");
      });
  }

  onSelect({ selected }) {
    this.seleccionados = [];
    if (selected.length > 0) {
      this.llamar = true;
    } else {
      this.llamar = false;
    }
    this.seleccionados.splice(0, this.seleccionados.length);
    this.seleccionados.push(...selected);
  }

  openPopUpsms(data: any = {}, isNew?) {
    let title = 'Mensaje SMS a Choferes';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddSmsComponent, {
      width: '920px',
      height: '640px',
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
        for (let i = 0; i < this.seleccionados.length; i++) {
          let message = res.mensaje;
          let numbers = parseInt(this.seleccionados[i].celular);
          let contenido = { message: message, number: numbers };
            this.smsService.postSMS(contenido)
            .subscribe(data => {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('¡SMS Enviados!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.atencionService.confirm({ message: 'No se pudieron enviar los SMS' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }
  getRowHeight(row) {
    if (!row) return 50;
    if (row.height === undefined) return 50;
    return row.height;
  }
  toggleExpandRow(row){
    this.table.rowDetail.toggleExpandRow(row);
  }
  onDetailToggle(event) {
  }

}
