import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule,ActivatedRouteSnapshot } from '@angular/router';

import {ChoferesComponent} from './choferes/choferes.component';
const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [
  {
  path: '',
  children: [{
    path: 'choferes',
    component: ChoferesComponent,
    data: { title: 'Documentacion Choferes', breadcrumb: 'Choferes' }
  }]
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
export class DocumentosRoutingModule { }
