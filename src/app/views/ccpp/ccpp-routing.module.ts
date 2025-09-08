import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CcppComponent } from './ccpp.component';
import { CentroAuthGuard } from 'app/shared/services/auth/centro-auth.guard';


const routes: Routes = [
  {
    path: '',
    children: [{
      path: ':opcion',
      component: CcppComponent,
      canActivate: [CentroAuthGuard],
      data: { title: 'CCPP Dashboard', breadcrumb: 'CCPP DASHBOARD' }
    }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CcppRoutingModule { }
