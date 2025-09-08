import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsignarViajeRetornoComponent } from './asignar-viaje-retorno.component';
import { AddSmsRetornoComponent } from './add-sms-retorno/add-sms-retorno.component';

export const AsignarViajeRetornoRoutes: Routes = [
  { path: '', component: AsignarViajeRetornoComponent, data: { title: 'Asignar Viajes' } },
  {
    path: '',
    children: [{
      path: 'addsms',
      component: AddSmsRetornoComponent,
      data: { title: 'Enviar SMS', breadcrumb: 'ENVIAR SMS' }
    }]
  }  
];

