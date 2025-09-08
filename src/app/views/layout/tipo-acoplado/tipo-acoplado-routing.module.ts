import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {TipoAcopladoComponent} from './tipo-acoplado.component';


export const TipoAcopladoRoutes: Routes = [
  { path: '', component: TipoAcopladoComponent, data: { title: 'Tipo Acoplado' } }
];
