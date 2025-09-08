import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';


export const DashboardRoutes: Routes = [
  { path: '', component: DashboardComponent, data: { title: 'Dashboard' } }
];
