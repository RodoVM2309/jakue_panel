import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from "@agm/core";
import { AgmJsMarkerClustererModule } from "@agm/js-marker-clusterer";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GridModule, ExcelModule } from "@progress/kendo-angular-grid";
import { AmazingTimePickerModule } from 'amazing-time-picker';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from "@angular/material";
import { MatFormFieldModule } from '@angular/material/form-field';
import { CdkTableModule } from "@angular/cdk/table";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SharedModule } from "../../shared/shared.module";
import { QuillModule } from "ngx-quill";
import { AgmDirectionModule } from "agm-direction";
import { AgmMarkerSpiderModule } from "agm-oms";
import { TranslateModule } from '@ngx-translate/core';

import { MagypRoutingModule } from './magyp-routing.module';
import { GestionComponent } from './gestion/gestion.component';
import { AdministracionComponent } from './administracion/administracion.component';
import { DashboardComponent } from './gestion/dashboard/dashboard.component';
import { DetalleComponent } from './gestion/detalle/detalle.component';
import { SeguimientoComponent } from './gestion/seguimiento/seguimiento.component';
import { ContactoComponent } from './gestion/contacto/contacto.component';
import { CadenasComponent } from './administracion/cadenas/cadenas.component';
import { AutoridadesComponent } from './administracion/autoridades/autoridades.component';
import { AddEditarComponent } from './administracion/cadenas/add-editar/add-editar.component';
import { AddEditarAutoridadComponent } from './administracion/autoridades/add-editar-autoridad/add-editar-autoridad.component';
import { WhatsappComponent } from './administracion/whatsapp/whatsapp.component';
import { AddTestComponent } from './gestion/detalle/add-test/add-test.component';
import { InfoTestComponent } from './gestion/detalle/info-test/info-test.component';
import { EnviarSmsTransComponent } from './gestion/detalle/enviar-sms-trans/enviar-sms-trans.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    FlexLayoutModule,
    QuillModule,
    ChartsModule,
    NgxDatatableModule,
    SharedModule,
    CdkTableModule,
    AmazingTimePickerModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBKesIXvH_yWq7YhJoEZ8sh3snbHWWd3MM",
      libraries: ["places"]
    }),
    AgmJsMarkerClustererModule,
    GridModule,
    ExcelModule,
    GooglePlaceModule,
    AgmDirectionModule,
    AgmMarkerSpiderModule,
    TranslateModule,
    MagypRoutingModule,
  ],
  declarations: [GestionComponent, AdministracionComponent, DashboardComponent, DetalleComponent, SeguimientoComponent, ContactoComponent, CadenasComponent, AutoridadesComponent, AddEditarComponent, AddEditarAutoridadComponent, WhatsappComponent, AddTestComponent, InfoTestComponent, EnviarSmsTransComponent],
  entryComponents: [AddEditarComponent, AddEditarAutoridadComponent, AddTestComponent, InfoTestComponent, EnviarSmsTransComponent]
})
export class MagypModule { }
