import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsignarViajeComponent } from './asignar-viaje.component';
import { AddSmsComponent } from './add-sms/add-sms.component';

export const AsignarViajeRoutes: Routes = [
  { path: '', component: AsignarViajeComponent, data: { title: 'Asignar Viajes' } },
  {
    path: '',
    children: [{
      path: 'addsms',
      component: AddSmsComponent,
      data: { title: 'Enviar SMS', breadcrumb: 'ENVIAR SMS' }
    }]
  }  
];

