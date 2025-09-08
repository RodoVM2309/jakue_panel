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

import { MarcaAcopladoRoutes } from './marca-acoplado-routing.module';
import { MarcaAcopladoComponent } from './marca-acoplado.component';
import { AddMarcaAcopladoComponent } from './add-marca-acoplado/add-marca-acoplado.component';



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
    RouterModule.forChild(MarcaAcopladoRoutes)
  ],
  declarations: [MarcaAcopladoComponent, AddMarcaAcopladoComponent],
  entryComponents:[AddMarcaAcopladoComponent]
})
export class MarcaAcopladoModule { }
