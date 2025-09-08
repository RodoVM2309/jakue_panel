import { NgModule, InjectionToken, OnInit } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { AsignacionComponent } from './asignacion/asignacion.component';
import { DetalleDadorComponent } from './detalle-dador/detalle-dador.component';
import { AsignadosReceptorComponent } from './asignados-receptor/asignados-receptor.component';
import { PanelConsolidadoComponent } from './panel-consolidado/panel-consolidado.component';
import { MapaCuposComponent } from './mapa-cupos/mapa-cupos.component';
import { CuponeraComponent } from './cuponera/cuponera.component';
import {ListadoContratoComponent} from './listado-contrato/listado-contrato.component';

import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');
const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'cuponera',
      component: CuponeraComponent,
      data: { title: 'Cupo', breadcrumb: 'Cupo' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'asignacion',
      component: AsignacionComponent,
      data: { title: 'Asignacion', breadcrumb: 'Asignacion' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'detalle-dador',
      component: DetalleDadorComponent,
      data: { title: 'Detalle por Dador', breadcrumb: 'Detalle por Dador' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'asignados-receptor',
      component: AsignadosReceptorComponent,
      data: { title: 'Asignados por Receptor', breadcrumb: 'Asignados por Receptor' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'panel-consolidado',
      component: PanelConsolidadoComponent,
      data: { title: 'Panel Consolidado', breadcrumb: 'Panel Consolidado' }
    }]
  },  
  {
    path: '',
    children: [{
      path: 'mapa-cupos',
      component: MapaCuposComponent,
      data: { title: 'Mapa Cupos', breadcrumb: 'Mapa Cupos' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'listado-contrato',
      component: ListadoContratoComponent,
      data: { title: 'Listado de Contratos/Fijaciones', breadcrumb: 'Listado de Contratos/Fijaciones' }
    }]
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
export class CupoRoutingModule implements OnInit{ 

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
