import { NgModule, InjectionToken, OnInit } from '@angular/core';
import { Routes, RouterModule,ActivatedRouteSnapshot } from '@angular/router';

import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

import { OrdenesRetiroComponent} from './ordenes-retiro/ordenes-retiro.component';

const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');
const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'retiro',
      component: OrdenesRetiroComponent,
      data: { title: 'Ordenes de Retiro', breadcrumb: 'Retiro' }
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
export class CombustibleRoutingModule  implements OnInit{ 
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
