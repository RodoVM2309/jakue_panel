import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
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
  MatTabsModule,
  MatToolbarModule,
  MatSortModule,
  MatMenuModule,
  MatRadioModule,
  MatProgressSpinnerModule,
  MatTableDataSource,
  MatDialogModule,
  MatSnackBarModule,
  MatSidenavModule,
  MatExpansionModule,
  MatDividerModule,
  MatTooltipModule
} from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from './../../shared/shared.module';

import { DadorRoutingModule } from './dador-routing.module';

import { MisCentrosComponent } from '../admin/mis-centros/mis-centros.component';

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
    MatExpansionModule,
    MatTabsModule,
    MatTabsModule,
    MatMenuModule,
    MatRadioModule,
    MatToolbarModule,
    FlexLayoutModule,
    SharedModule,
    MatDialogModule,
    MatSidenavModule,
    MatSnackBarModule,
    DadorRoutingModule,
    MatDividerModule,
    MatTooltipModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyBKesIXvH_yWq7YhJoEZ8sh3snbHWWd3MM' })
  ],
  declarations: [MisCentrosComponent],
  entryComponents: [MisCentrosComponent]
})
export class DadorModule { }
