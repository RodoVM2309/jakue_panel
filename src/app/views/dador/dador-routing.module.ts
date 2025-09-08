import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { MisCentrosComponent } from '../../views/admin/mis-centros/mis-centros.component';

const routes: Routes = [
  
  {
    path: '',
    children: [{
      path: 'mis-centros',
      component: MisCentrosComponent,
      data: { title: 'Mis centros', breadcrumb: 'MIS CENTROS' }
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DadorRoutingModule { }
