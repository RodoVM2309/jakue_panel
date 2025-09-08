import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { MediaChange, ObservableMedia } from "@angular/flex-layout";
import { MatDialogRef, MatDialog, MatSnackBar, MatSidenav } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';

import { Consulta, ConsultaSocket } from './../../../shared/models/consulta';
import { Respuesta } from './../../../shared/models/respuesta';
import { ConsultasService } from './../../../shared/services/consultas.service';
import { RespuestasService } from './../../../shared/services/respuestas.service';
import { ResponderComponent } from './responder/responder.component';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';
//import { WebsocketService } from 'app/shared/services/websocket.service';
import { ConsultaService } from 'app/shared/services/consulta.service';
//import { Chofer } from '../vincular-transporte-chofer/vincular-chofer/vincular-chofer.component';
import { MessageService } from 'app/shared/services/message.service';
export class Chofer {
  id: number;
  id_chofer: number;
  mensaje: string;
  fecha: string;
  archivada: number;
  nombre_chofer: string;
  respuesta_consultas: Respuesta[];
  tipo: number;
  tipo_det: string;
  cantidad: number;
}
@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.scss'],
  animations: egretAnimations,
  providers: [ConsultasService]
})
export class ConsultasComponent implements OnInit, OnDestroy {
  public itemForm: FormGroup;
  consultas: Consulta[];
  public getItemSub: Subscription;
  isMobile;
  screenSizeWatcher: Subscription;
  isSidenavOpen: Boolean = true;
  selectToggleFlag = false;
  interval: any;
  miStep: any;
  activeConsulta: Consulta;
  newConsulta: Consulta;
  ini = true;
  mensaje = '';
  cantidadConsultas = 0;
  listachoferes: any;
  listaconsultas: any;
  activeChofer: Chofer = {
    id: 0,
    id_chofer: 0,
    mensaje: '',
    fecha: '',
    archivada: 0,
    nombre_chofer: '',
    respuesta_consultas: [],
    tipo: 0,
    tipo_det: '',
    cantidad: 0
  };
  previoChofer: Chofer;

  @ViewChild(MatSidenav) private sideNav: MatSidenav;
  nuevaConsultaSubscription: Subscription;
  subscription: Subscription;
  message: any;
  id_chofer: number;
  constructor(public router: Router,
    private activatedRoute: ActivatedRoute, private dialog: MatDialog, private media: ObservableMedia,
    private snack: MatSnackBar, private confirmService: AppConfirmService, private fb: FormBuilder,
    private loader: AppLoaderService,
    private consultaService: ConsultaService, private respuestaService: RespuestasService,
    private atencionService: AppAtencionService,
    //public wsService: WebsocketService,
    private messageService: MessageService) {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.message = message;
      switch (this.message.text) {
        case 'GotoConsulta':
          this.gotoConsultas(this.message.id);
          break;

        default:
          break;
      }
    });
    this.activeConsulta = new Consulta();
  }

  ngOnInit() {
    this.listachoferes = [];
    this.listaconsultas = [];
    this.id_chofer = this.activatedRoute.snapshot.params['id_chofer'] ? parseInt(this.activatedRoute.snapshot.params['id_chofer']) : 0;
    this.getItems();
    this.itemForm = this.fb.group({
      mensaje: ['', Validators.required]
    });
    // this.escucharSockets();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
    if (this.nuevaConsultaSubscription) {
      this.nuevaConsultaSubscription.unsubscribe();
    }
  }
  escucharSockets() {
    // marcador-nuevo
    /* this.wsService.listen('nueva-consulta')
      .subscribe((chofer: ConsultaSocket) => {
        this.agregarNuevaConsulta(chofer);
      }); */
  }
  agregarNuevaConsulta(consulta: ConsultaSocket) {
    let choferNuevo = new Chofer();
    const indexChofer = this.listachoferes.findIndex(chof => parseInt(chof.id_chofer) === consulta.id_chofer);
    choferNuevo.id = consulta.id;
    choferNuevo.id_chofer = consulta.id_chofer;
    choferNuevo.nombre_chofer = consulta.nombre_chofer;
    choferNuevo.mensaje = consulta.mensaje;
    choferNuevo.respuesta_consultas = consulta.respuesta_consultas;
    choferNuevo.tipo_det = (consulta.tipo === 1) ? '  Chofer Libre' : '  Chofer Normal';
    choferNuevo.tipo = consulta.tipo;
    choferNuevo.cantidad = 0;
    if (indexChofer > -1) {
      choferNuevo.cantidad = this.listachoferes[indexChofer].cantidad;
      this.listachoferes.splice(indexChofer, 1);
    };
    choferNuevo.cantidad++;
    this.listachoferes.unshift(choferNuevo);
    const indexConsulta = this.listaconsultas.find(consul => consul.messageId === consulta.id);
    if (indexConsulta > -1) {
      this.listaconsultas[indexConsulta] = consulta;
    } else {
      this.listaconsultas.push(consulta);
    }
  }

  gotoConsultas(id: string) {
    this.id_chofer = parseInt(id);
    this.ini = true;
    this.getItems();
  }


  actualiza_panel() {
    this.interval = setInterval(() => {
      this.getItems();
    }, 10000);
  }

  detenerTimer() {
    clearInterval(this.interval);
  }


  openModulePanel(c: any) {
    if (this.miStep === c) {
      this.miStep = null;
    } else {
      this.miStep = c;
    }
  }

  getItems() {
    this.getItemSub = this.consultaService.getAllConsultasRecientes()
      .subscribe(data => {
        if (data.data.length > 0) {
          let todosChoferesDevueltos = data.data;
          todosChoferesDevueltos.forEach(chofer => {
            const element = this.listachoferes.find(chof => chof.id_chofer === chofer.id_chofer);
            const index = this.listachoferes.indexOf(element);
            let tipodesc = (chofer.tipo === 1) ? 'Chofer Normal' : 'Chofer Libre';
            chofer.cantidad = 0;
            chofer.tipo_det = tipodesc;
            if (index > -1) {
              this.listachoferes[index] = chofer;
            } else {
              if (this.ini)
                this.listachoferes.push(chofer);
              else
                this.listachoferes.unshift(chofer);
            }
          });
          if (this.ini) {
            const indexChofer = this.id_chofer != 0 ? this.listachoferes.findIndex(chof => parseInt(chof.id_chofer) === this.id_chofer) : -1;
            if (indexChofer > -1) {
              this.activeChofer = this.listachoferes[indexChofer];
              this.listachoferes.splice(indexChofer, 1);
              this.listachoferes.unshift(this.activeChofer);
            }
            this.activeChofer = this.listachoferes[0];
            this.previoChofer = this.activeChofer;
            this.showConsultas(this.activeChofer, 0);
            this.ini = false;
          } else {
            this.showConsultas(this.activeChofer, 0);
          }
        }
      },
        err => {
          this.loader.close();
          this.atencionService.confirm({ message: 'No existen consultas' });
        });
  }

  stopProp(e) {
    e.stopPropagation()
  }

  updateSidenav() {
    let self = this;
    setTimeout(() => {
      self.isSidenavOpen = !self.isMobile;
      self.sideNav.mode = self.isMobile ? 'over' : 'side';
    })
  }

  inboxSideNavInit() {
    this.isMobile = this.media.isActive('xs') || this.media.isActive('sm');
    this.updateSidenav();
    this.screenSizeWatcher = this.media.subscribe((change: MediaChange) => {
      this.isMobile = (change.mqAlias == 'xs') || (change.mqAlias == 'sm');
      this.updateSidenav();
    });
  }

  openPopUp(data: any = {}, isNew?) {
    let title = 'Respuesta';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ResponderComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.loader.open();
        this.respuestaService.postRespuesta(res)
          .subscribe(data => {
            this.getItems();
            if (this.loader !== null) {
              this.loader.close();
            }
            this.snack.open('Respuesta enviada correctamente!', 'OK', { duration: 4000 });
            return;
          },
            err => {
              this.loader.close();
              this.atencionService.confirm({ message: 'Esta Respuesta no se pudo agregar' });
            });
      });
  }
  sendRespuesta() {

  }

  archivarItem(row) {
    let index = row.index;
    row.archivada = 1;
    if (this.activeChofer.tipo === 0) {
      this.confirmService.confirm({ message: '¿Está seguro de archivar la consulta del chofer: ' + row.userName + ' ?' })
        .subscribe(res => {
          if (res) {
            this.loader.open();
            this.consultaService.putConsulta(row)
              .subscribe(data => {
                this.loader.close();
                this.snack.open('Consulta archivada correctamente !', 'OK', { duration: 4000 });
                this.getItems();
                return;
              },
                err => {
                  this.loader.close();
                  this.atencionService.confirm({ message: 'Esta Consulta no se pudo archivar ya que tiene histórico de respuestas' });
                });
          }
        });
    } else {
      this.confirmService.confirm({ message: '¿Está seguro de archivar la consulta  del chofer: ' + row.userName + ' ?' })
        .subscribe(res => {
          if (res) {
            this.loader.open();
            this.loader.close();
            this.snack.open('Consulta archivada correctamente !', 'OK', { duration: 4000 });
            this.getItems();
            return;
          }
        },
          err => {
            this.loader.close();
            this.atencionService.confirm({ message: 'Esta Consulta no se pudo archivar ya que tiene histórico de respuestas' });
          });
    }
  }

  deleteRespuesta(row, ind) {
    let index = this.activeConsulta.index;
    if (this.activeConsulta.tipo === '1') {
      this.confirmService.confirm({ message: '¿Está seguro de eliminar la respuesta: ' + row.mensaje })
        .subscribe(res => {
          if (res) {
            this.loader.open();
            this.consultaService.deleteRespuesta(row.id)
              .subscribe(data => {
                this.loader.close();
                this.activeConsulta = this.consultas[index];
                this.activeConsulta.respuesta_consultas.splice(ind, 1);
                this.snack.open('Respuesta eliminada correctamente !', 'OK', { duration: 4000 });
                return;
              },
                err => {
                  this.loader.close();
                  this.atencionService.confirm({ message: 'Esta respuesta no se pudo eliminar' });
                });
          }
        });
    } else {
      this.confirmService.confirm({ message: '¿Está seguro de eliminar la respuesta: ' + row.mensaje })
        .subscribe(res => {
          if (res) {
            this.loader.open();
            this.getItems();
            this.loader.close();
            this.snack.open('Respuesta eliminada correctamente !', 'OK', { duration: 4000 });
            return;
          }
        },
          err => {
            this.loader.close();
            this.atencionService.confirm({ message: 'Esta Respuesta no se pudo eliminar' });
          });
    }
    this.getItems();
    this.activeConsulta = this.consultas[0];
  }

  showDetail(chofer: any, consulta: any) {
    this.activeChofer = chofer;
    this.activeConsulta = consulta;
  }

  showConsultas(chofer: any, i: number) {
    if (this.previoChofer.id_chofer !== chofer.id_chofer) {
      this.listaconsultas = [];
      this.previoChofer = chofer;
    };
    this.activeChofer = chofer;
    this.getItemSub = this.consultaService.getConsultasByChofer(chofer)
      .subscribe(data => {
        let tempData = data.data;
        this.listachoferes[i].cantidad = 0;
        this.messageService.sendMessage('EliminarNotificacionConsulta', chofer.id_chofer);
        tempData.forEach(consulta => {
          const element = this.listaconsultas.find(consul => consul.messageId === consulta.messageId)
          const index = this.listaconsultas.indexOf(element);
          if (index > -1) {
            this.listaconsultas[index] = consulta;
          } else {
            this.listaconsultas.push(consulta);
          }
        });
      });
  }

}
