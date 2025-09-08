import { NgModule, InjectionToken, OnInit } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');
import { TurneadaComponent} from './turneada/turneada.component';
//import { ListaChoferesComponent } from './lista-choferes/lista-choferes.component';
import { ListaTurneadoComponent } from './lista-turneado/lista-turneado.component';
import { ConfirmarArriboComponent } from './confirmar-arribo/confirmar-arribo.component';
//import { ControlMensualComponent } from './control-mensual/control-mensual.component';
import { ControlComponent} from './control/control.component';

import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

const routes: Routes = [{
  path: '',
  children: [{
    path: 'turneada/:id',
    component: TurneadaComponent,
    data: { title: 'Turneada', breadcrumb: 'Turneada' }
  },
  {
    path: '',
    children: [{
      path: 'lista-turneado',
      component: ListaTurneadoComponent,
      data: { title: 'Lista de Turneado', breadcrumb: 'ListaTurneado' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'confirmar-arribo',
      component: ConfirmarArriboComponent,
      data: { title: 'Confirmar Arribo', breadcrumb: 'ConfirmarArribo' }
    }]
  },
  /* {
    path: '',
    children: [{
      path: 'control-mensual',
      component: ControlMensualComponent,
      data: { title: 'Control Mensual', breadcrumb: 'ControlMensual' }
    }]
  }, */
  {
    path: '',
    children: [{
      path: 'control',
      component: ControlComponent,
      data: { title: 'Control Mensual', breadcrumb: 'ControlMensual' }
    }]
  },
]
}];

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
export class TurneadaRoutingModule implements OnInit{ 
  constructor(private router: Router, private authenticationService: AuthService) 
  {
  }

  ngOnInit() {
    
    let acepto_tyc = parseInt(localStorage.getItem('accept_tyc'));
    
    if( acepto_tyc == 0 ){
      this.authenticationService.logout();
      this.router.navigateByUrl('/sessions/signin');
      return;
    }  

  }
}
