import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatProgressBarModule,
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatChipsModule,
  MatGridListModule,
  MatListModule,
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

import { MarketingRoutingModule } from './marketing-routing.module';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { NotificacionesManualesComponent } from './notificaciones-manuales/notificaciones-manuales.component';
import { AddGrupoComponent } from './notificaciones-manuales/add-grupo/add-grupo.component';
import { ChoferesNotificacionComponent } from './notificaciones-manuales/choferes-notificacion/choferes-notificacion.component';
@NgModule({
  imports: [
    CommonModule,
    MarketingRoutingModule,
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
    MatChipsModule,
    MatGridListModule,
    MatListModule,
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
    MatDividerModule,
    MatTooltipModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyBKesIXvH_yWq7YhJoEZ8sh3snbHWWd3MM' })
  ],
  declarations: [ConfiguracionComponent, NotificacionesManualesComponent, AddGrupoComponent, ChoferesNotificacionComponent],
  entryComponents: [AddGrupoComponent,ChoferesNotificacionComponent]
})
export class MarketingModule { }
