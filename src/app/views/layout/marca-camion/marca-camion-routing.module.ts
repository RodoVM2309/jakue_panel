import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {MarcaCamionComponent} from './marca-camion.component';


export const MarcaCamionRoutes: Routes = [
  { path: '', component: MarcaCamionComponent, data: { title: 'Marca Camion' } }
];
