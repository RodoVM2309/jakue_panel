import { Routes } from '@angular/router';
import { AdminBandasComponent } from './admin-bandas/admin-bandas.component';
import { ComercialComponent } from './comercial/comercial.component';
import { GestionComponent } from './gestion/gestion.component';
import { OrigenesComponent } from './origenes/origenes.component';

export const FertilizanteRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'origenes',
      component: OrigenesComponent,
      data: { title: 'Monitor', breadcrumb: 'MONITOR' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'gestion',
      component: GestionComponent,
      data: { title: 'Hedge', breadcrumb: 'HEDGE' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'admin-bandas',
      component: AdminBandasComponent,
      data: { title: 'Easy Edging', breadcrumb: 'EASY EDGING' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'comercial',
      component: ComercialComponent,
      data: { title: 'Comercial', breadcrumb: 'COMERCIAL' }
    }]
  },
];
