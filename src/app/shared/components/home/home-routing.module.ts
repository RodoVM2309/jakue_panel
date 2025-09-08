import { InjectionToken, NgModule, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { PedidoResolverService } from 'app/shared/services/pedido-resolver.service';
import { AddPedidoRetornoComponent } from './add-pedido-retorno/add-pedido-retorno.component';
import { AddPedidoComponent } from './add-pedido/add-pedido.component';
import { AsignarViajeRetornoComponent } from './asignar-viaje-retorno/asignar-viaje-retorno.component';
import { AsignarViajeComponent } from './asignar-viaje/asignar-viaje.component';
import { CargaMasivaComponent } from './carga-masiva/carga-masiva.component';
import { CargaComponent } from './carga/carga.component';
import { CuposDisponiblesComponent } from './cupos-disponibles/cupos-disponibles.component';
import { DescargaComponent } from './descarga/descarga.component';
import { DifusionesComponent } from './difusiones/difusiones.component';
import { HomeComponent } from './home.component';
import { MapaCuposComponent } from './mapa-cupos/mapa-cupos.component';
import { MapaComponent } from './mapa/mapa.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PedidoDadorComponent } from './pedido-dador/pedido-dador.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PrepedidoComponent } from './prepedido/prepedido.component';
import { ViajeComponent } from './viaje/viaje.component';


import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { AsignarViajeFertilizanteComponent } from './asignar-viaje-fertilizante/asignar-viaje-fertilizante.component';
import { TransportadorasTabComponent } from './transportadoras-tab/containers/transportadoras-tab.component';

const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');
const routes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      component: HomeComponent,
      data: { title: 'Home', breadcrumb: 'Home' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'pedido',
      component: CargaComponent,
      data: { title: 'Carga', breadcrumb: 'CARGA' }
    }]
  },

  {
    path: '',
    children: [{
      path: 'asignarViaje/:id',
      component: AsignarViajeComponent,
      resolve: {
        pedido: PedidoResolverService
      },
      data: { title: 'Asignar Viaje', breadcrumb: 'ASIGNAR VIAJE' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'asignarViajeFertilizantes/:id/:m',
      component: AsignarViajeFertilizanteComponent,
      data: { title: 'Asignar Viaje retorno', breadcrumb: 'ASIGNAR VIAJE' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'asignarViajeRetorno/:id',
      component: AsignarViajeRetornoComponent,
      data: { title: 'Asignar Viaje retorno', breadcrumb: 'ASIGNAR VIAJE' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'descarga',
      component: DescargaComponent,
      data: { title: 'Descarga', breadcrumb: 'DESCARGA' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'difusion',
      component: DifusionesComponent,
      data: { title: 'Difusiones', breadcrumb: 'Difusiones' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'cupos-disponibles',
      component: CuposDisponiblesComponent,
      data: { title: 'Cupos Disponibles', breadcrumb: 'CUPOS DISPONIBLES' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'mapa',
      component: MapaComponent,
      data: { title: 'Mapa', breadcrumb: 'MAPA' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'mapa-cupos',
      component: MapaCuposComponent,
      data: { title: 'Mapa Cupos', breadcrumb: 'MAPA CUPOS' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'addPedido',
      component: AddPedidoComponent,
      data: { title: 'Adicionar Pedido', breadcrumb: 'ADICIONAR PEDIDO' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'addPedidoRetorno',
      component: AddPedidoRetornoComponent,
      data: { title: 'Adicionar Pedido Retorno', breadcrumb: 'ADICIONAR PEDIDO RETORNO' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'viaje',
      component: ViajeComponent,
      data: { title: 'Viajes', breadcrumb: 'Viajes' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'viajes',
      component: TransportadorasTabComponent,
      data: { title: 'Viajes', breadcrumb: 'Viajes' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'pedido-dador',
      component: PedidoDadorComponent,
      data: { title: 'Pedidos', breadcrumb: 'Pedidos' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'perfil',
      component: PerfilComponent,
      data: { tilte: 'Perfil', breadcrumb: 'Perfil' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'prepedido',
      component: PrepedidoComponent,
      data: { tilte: 'Pre Pedido', breadcrumb: 'PREPEDIDO' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'carga-masiva',
      component: CargaMasivaComponent,
      data: { tilte: 'Carga Masiva', breadcrumb: 'CARGA MASIVA' }
    }]
  },
  {
    path: 'externalRedirect',
    resolve: {
      url: externalUrlProvider
    },
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: externalUrlProvider,
      useValue: (route: ActivatedRouteSnapshot) => {
        const externalUrl = route.paramMap.get('externalUrl');
        window.open(externalUrl, '_blank');
      }
    }
  ]
})
export class HomeRoutingModule implements OnInit {

  constructor(private router: Router, private authenticationService: AuthService) {
  }

  ngOnInit() {
    let acepto_tyc = parseInt(localStorage.getItem('accept_tyc'));

    if (acepto_tyc == 0) {
      this.authenticationService.logout();
      this.router.navigateByUrl('/sessions/signin');
      return;
    }
  }
}
