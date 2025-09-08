import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionComponent} from './gestion/gestion.component';
import { AdministracionComponent } from './administracion/administracion.component';
import { MagypAuthGuard } from 'app/shared/services/auth/magyp-auth.guard';

const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'gestion',
      component: GestionComponent,
      canActivate: [MagypAuthGuard],

      data: { title: 'Dashboard', breadcrumb: 'DASHBOARD' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'gestion/:opcion',
      component: GestionComponent,
      canActivate: [MagypAuthGuard],

      data: { title: 'Dashboard', breadcrumb: 'DASHBOARD' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'administracion',
      component: AdministracionComponent,
      canActivate: [MagypAuthGuard],

      data: { title: 'Administración', breadcrumb: 'ADMINISTRACIÓN' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'administracion/:opcion',
      component: AdministracionComponent,
      canActivate: [MagypAuthGuard],

      data: { title: 'Administración', breadcrumb: 'ADMINISTRACIÓN' }
    }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MagypRoutingModule { }
