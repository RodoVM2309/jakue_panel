import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatIconModule,
  MatCardModule,
  MatMenuModule,
  MatProgressBarModule,
  MatButtonModule,
  MatChipsModule,
  MatListModule,
  MatGridListModule
 } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../../shared/shared.module';

import { AcopladoRoutingModule } from './acoplado-routing.module';
import { AcopladoComponent } from './acoplado.component';
import { AddAcopladoComponent } from './add-acoplado/add-acoplado.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AcopladoRoutingModule)
  ],
  declarations: [AcopladoComponent, AddAcopladoComponent]
})
export class AcopladoModule { }
