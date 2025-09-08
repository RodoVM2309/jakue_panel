import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstadoDescargaComponent }  from './estado-descarga.component';

const routes: Routes = [];

export const EstadoDescargaRoutes: Routes = [
  { path: '', component: EstadoDescargaComponent, data: { title: 'Estado de Descargas' } }  
];
