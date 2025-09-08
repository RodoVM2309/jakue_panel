import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';

const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');
import { PanelComponent } from './panel/panel.component';
import { ConfigPuertoComponent } from './turnos/config-puerto/config-puerto.component';
import { TurnosComponent } from './turnos/turnos.component';
import { PlantasComponent } from './plantas/plantas.component'
import { DestinosResolverService } from 'app/shared/services/destinos-resolver.service';
import { DestinoAuthGuard } from 'app/shared/services/auth/destino-auth.guard';
import { GaritaComponent } from './garita/garita.component';

const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'panel',
      component: PanelComponent,
      canActivate: [DestinoAuthGuard],
      data: { title: 'Panel Destino', breadcrumb: 'DESTINO' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'configuracion-puerto',
      component: TurnosComponent,
      canActivate: [DestinoAuthGuard],
      data: { title: 'Configuración de puerto', breadcrumb: 'CONFIGURACION DE PUERTO' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'turnos',
      component: TurnosComponent,
      canActivate: [DestinoAuthGuard],
      resolve: {
        destinos: DestinosResolverService
      },
      data: { title: 'Turnos', breadcrumb: 'TURNOS' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'porteria',
      component: GaritaComponent,
      canActivate: [DestinoAuthGuard],
      resolve: {
        destinos: DestinosResolverService
      },
      data: { title: 'Porteria', breadcrumb: 'PORTERIA' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'gestion-plantas',
      component: PlantasComponent,
      canActivate: [DestinoAuthGuard],
      resolve: {
        destinos: DestinosResolverService
      },
      data: { title: 'Gestión Plantas', breadcrumb: 'Gestión Plantas' }
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
export class DestinoRoutingModule { }
