import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MtrAuthGuard } from 'app/shared/services/auth/mtr-auth.guard';
import { CaratulasComponent } from './caratulas/caratulas.component';

const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'caratulas',
      component: CaratulasComponent,
      canActivate: [MtrAuthGuard],
      data: { title: 'caratulas', breadcrumb: 'CARATULAS' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'caratulas/:opcion',
      component: CaratulasComponent,
      canActivate: [MtrAuthGuard],

      data: { title: 'caratulas', breadcrumb: 'CARATULAS' }
    }]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MtrRoutingModule { }
