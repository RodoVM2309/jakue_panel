import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'app/shared/services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {
  tipocentro: any;
  navLinks = [];
  background = 'primary';

  esDadorCupo: string = '';
  esTurneador: boolean = false;
  rol: string = '';
  panelPedido: string = '';
  panelCupo: string = '';
  panelDifusion: string = '';
  panelDestinatario: string = '';
  panelDestino: string = '';
  panelNotificacion: string = '';
  subscription: Subscription;
  message: any;
  usaMTR: boolean = false;
  esClienteFinal: boolean = false;


  constructor(public router: Router,
    private translate: TranslateService,
    private messageService: MessageService,) {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.message = message;
      switch (this.message.text) {
        case 'CambioIdioma':
          this.defineNavLinks();
          break;
        case 'QuitarTurneada':
          this.defineNavLinks();
          break;
        case 'AddTurneada':
          this.defineNavLinks();
          break;
        default:
          this.defineNavLinks();
          break;
      }
    });
  }


  ngOnInit() {
    this.esDadorCupo = localStorage.getItem("esDadorCupo");
    this.esTurneador = localStorage.getItem("tipo_turneada") !== '0' ? true : false;
    this.esClienteFinal = localStorage.getItem("esClienteFinal") == '1' ? true : false;
    this.usaMTR = localStorage.getItem("usaMtr") == "1" ? true : false;
    this.rol = localStorage.getItem("rol");
    this.defineNavLinks();
    this.tipocentro = localStorage.getItem('clienteMuvin');
  }


  defineNavLinks() {
    this.navLinks = [];
    this.esTurneador = localStorage.getItem("tipo_turneada") !== '0' ? true : false;
    switch (this.rol) {
      case '1':
        this.translate.get('global.dashboardOrder').subscribe((res: string) => {
          this.navLinks = [
            {
              ruta: '/panel-pedido/pedido',
              name: res
            }
          ]
        });
        break;
      case '3':
        let esDadorCupo:Number = Number(localStorage.getItem('esDadorCupo'));
        let esDadorDestino:Number = Number(localStorage.getItem('dador_turno_destino'));
        if (this.esDadorCupo === '1') {
          this.translate.get('global.dashboardCupo').subscribe((res: string) => {
            this.navLinks.push({
              ruta: '/cupo/cuponera',
              name: res
            })
          });
        }
        this.translate.get('global.dashboardOrder').subscribe((res: string) => {
          this.navLinks.push({
            ruta: this.esClienteFinal ? '/panel-pedido/pedido' : '/panel-pedido/viajes',
            name: res
          });
        });
        if(esDadorDestino===1 && esDadorCupo ===1){
          this.translate.get('panelDestino.turnos').subscribe((res: string) => {
            this.navLinks.push({
              ruta: '/destino/turnos',
              name: res
            });
          });
        }

        break;
      case '4':
        this.translate.get('global.dashboardOrder').subscribe((res: string) => {
          this.navLinks = [
            {
              ruta: '/panel-pedido/difusion',
              name: 'PANEL DIFUSION'
            }
          ];
        });
        break;
      case '6':
        this.translate.get('global.dashboardAddressee').subscribe((res: string) => {
          this.navLinks = [
            {
              ruta: '/destinatario/panel',
              name: res
            }
          ];
        });
        break;
      case '7':
        this.navLinks = [];
        this.navLinks.push({
          ruta: '/destino/porteria',
          name: 'Portería'
        });
        // this.translate.get('panelDestino.turnos').subscribe((res: string) => {
        //   this.navLinks.push({
        //     ruta: '/destino/turnos',
        //     name: res
        //   });
        // });
        // this.translate.get('panelDestino.gestion').subscribe((res: string) => {
        //   this.navLinks.push({
        //     ruta: '/destino/gestion-plantas',
        //     name: res
        //   })
        // });
        break;
      case '13':
        this.translate.get('global.dashboardNotifications').subscribe((res: string) => {
          this.navLinks = [
            {
              ruta: '/marketing/notificaciones',
              name: res
            }
          ];
        });

        break;
      case '14':
        this.navLinks = [];
        this.translate.get('panelMagyp.gestion').subscribe((res: string) => {
          this.navLinks.push({
            ruta: '/magyp/gestion',
            name: res
          });
        });
        this.translate.get('panelMagyp.administracion').subscribe((res: string) => {
          this.navLinks.push({
            ruta: '/magyp/administracion',
            name: res
          })
        });
        break;
      case '15':
        this.navLinks = [];
        this.translate.get('fertilizante.admin-bandas').subscribe((res: string) => {
          this.navLinks.push({
            ruta: '/fertilizante/admin-bandas',
            name: 'TURNOS'
          });
        });
        this.translate.get('fertilizante.gestion').subscribe((res: string) => {
          this.navLinks.push({
            ruta: '/fertilizante/gestion',
            name: 'PANEL TERMINAL'
          });
        });
        this.translate.get('fertilizante.comercial').subscribe((res: string) => {
          this.navLinks.push({
            ruta: '/fertilizante/comercial',
            name: 'PANEL COMERCIAL'
          });
        });
        break;
      case '16':
        this.navLinks = [];
        this.translate.get('panelMtr.panelMtr').subscribe((res: string) => {
          this.navLinks.push({
            ruta: '/mtr/caratulas',
            name: 'MERCADO'
          });
        });
        break;

      default:
        this.translate.get('global.dashboardOrder').subscribe((res: string) => {
          this.navLinks = [
            {
              ruta: '/panel-pedido/pedido',
              name: res
            }
          ]
        });
        break;
    };
    console.log(this.navLinks);
  }

  gotopedido() {
    this.router.navigateByUrl('/panel-pedido/pedido');
  }
  gotoDespedido() {
    this.router.navigateByUrl('/panel-pedido/descarga');
  }
  gotoMapa() {
    this.router.navigateByUrl('/panel-pedido/mapa');
  }
  gotoMapacupos() {
    this.router.navigateByUrl('/panel-pedido/mapa-cupos');
  }
  gotoAddPedido() {
    this.router.navigateByUrl('/panel-pedido/addPedido');
  }

  doSomething() {
    alert('¡Esta acción no está permitida!');
  }

}
