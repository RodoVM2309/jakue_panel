import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {TipoCamionComponent} from './tipo-camion.component';


export const TipoCamionRoutes: Routes = [
  { path: '', component: TipoCamionComponent, data: { title: 'Tipo Camion' } }
];
