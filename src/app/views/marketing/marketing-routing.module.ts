import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { NotificacionesManualesComponent} from './notificaciones-manuales/notificaciones-manuales.component';

const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'config',
      component: ConfiguracionComponent,
      data: { title: 'Configuración', breadcrumb: 'CONFIGURACION' }
    },
    {
      path: 'notificaciones',
      component: NotificacionesManualesComponent,
      data: { title: 'Notificaciones', breadcrumb: 'NOTIFICACION' }
    }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule { }
