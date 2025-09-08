import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSidenav,MatDialogRef, MatDialog } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';
import { NomencladoresService } from '../../services/nomencladores.service';
import { Subscription } from 'rxjs';
import { ListaChoferesComponent } from '../home/lista-choferes/lista-choferes.component';
import { Notificacion } from 'app/shared/models/notificacion';
import { MessageService } from 'app/shared/services/message.service';

export class ListaDisponibles {
  id_lista: number;
  nombre: string;
  disponibles: number;
  id_pedido: number;
  pedidos: any[];
  por_asignar: number;
  space: number;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {
  @Input() notificPanel;
  @Input() Lista;
  public getItemSub: Subscription;
  subscription: Subscription;
  lista : ListaDisponibles[]; 
  isList: boolean= false; 
  // Dummy notifications
  notifications: Notificacion[]=[]; 
  message: any;  

  constructor(
    private router: Router, 
    public nomencladoresService: NomencladoresService,
    private messageService: MessageService,
    private dialog: MatDialog,) {
      this.subscription = this.messageService.getMessage().subscribe(message => {       
        this.message = message;
        switch (this.message.text) {
          case 'NuevaConsulta':
            this.buscarConsultas();
            break;
            case 'EliminarNotificacionConsulta':
              this.eliminarNotificacionConsulta(this.message.id)
              break;       
          default:
            break;
        }      
       });
    }

  ngOnInit() {
    this.notifications=[];
    this.lista= [];
    //getListaCentroDisponible
    this.buscarConsultas();
    if (localStorage.getItem('rol')== '3') {
      this.getItemSub = this.nomencladoresService
      .getListaCentroDisponible()
      .subscribe(data => {
        this.lista= [];
        data.data.forEach(element => {
          let temp= new (ListaDisponibles);
          temp= element;
          temp.space= 60-temp.nombre.length;
        });
        this.lista= data.data;

        this.isList= true;
      })
      , err => {
      };
    }; 
    this.router.events.subscribe((routeChange) => {
        if (routeChange instanceof NavigationEnd) {
          this.notificPanel.close();
        }
    });
  }
  buscarConsultas(){
    var guardado = localStorage.getItem('consultas');
    this.notifications=[];
    this.notifications=JSON.parse(guardado);
  }

  eliminarNotificacionConsulta(id_chofer){
    let temp =[];
    if (this.notifications) {
      this.notifications.forEach(element => {
        if (element.id!==id_chofer)
          temp.push(element);
      });
      this.notifications= temp;
      localStorage.removeItem('consultas');
      localStorage.setItem('consultas', JSON.stringify(temp));
    }    
    
  }
  
  gotoConsulta(id_chofer){
    this.messageService.sendMessage('GotoConsulta',id_chofer);

  }

 
  clearAll(e) {
    e.preventDefault();
    this.lista= [];
    //this.notifications = [];
  }
  addChoferesListaDisponibles(id_pedido) {
    let title = "Seleccionar Choferes en la Lista ";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ListaChoferesComponent,
      {
        width: "80vw",
        height: '88vh',
        disableClose: true,
        data: { title: title, payload: { id_pedido: id_pedido } }
      }
    );
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }

      return;
    });
  }
}
