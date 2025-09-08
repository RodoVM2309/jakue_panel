import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {MarcaAcopladoComponent} from './marca-acoplado.component';


export const MarcaAcopladoRoutes: Routes = [
  { path: '', component: MarcaAcopladoComponent, data: { title: 'Marca Acoplado' } }
];
