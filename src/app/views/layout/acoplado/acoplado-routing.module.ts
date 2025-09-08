import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AcopladoComponent} from './acoplado.component';

export const AcopladoRoutingModule: Routes = [
  { path: '', component: AcopladoComponent, data: { title: 'Acoplados' } }
];

