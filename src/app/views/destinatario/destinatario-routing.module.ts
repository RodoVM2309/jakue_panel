import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule,  ActivatedRouteSnapshot } from '@angular/router';

import { PanelComponent} from './panel/panel.component';

const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'panel',
      component: PanelComponent,
      data: { title: 'Panel Destinatario', breadcrumb: 'DESTINATARIO' }
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
export class DestinatarioRoutingModule { }
