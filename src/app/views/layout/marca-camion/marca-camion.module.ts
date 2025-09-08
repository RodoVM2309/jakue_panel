import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  MatProgressBarModule,
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule,
  MatSelectModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatTableDataSource,
  MatDialogModule,
  MatSnackBarModule
 } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../../shared/shared.module';

import { MarcaCamionRoutes } from './marca-camion-routing.module';
import { MarcaCamionComponent } from './marca-camion.component';
import { AddMarcaCamionComponent } from './add-marca-camion/add-marca-camion.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    MatProgressBarModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatSelectModule,
    FlexLayoutModule,
    SharedModule,
    MatDialogModule,
    MatSnackBarModule,
    RouterModule.forChild(MarcaCamionRoutes)
  ],
  declarations: [MarcaCamionComponent, AddMarcaCamionComponent],
  entryComponents:[AddMarcaCamionComponent]
})
export class MarcaCamionModule { }
