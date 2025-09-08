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


import { CcppRoutingModule } from './ccpp-routing.module';
import { CcppComponent } from './ccpp.component';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { InconsistenciaComponent } from './inconsistencia/inconsistencia.component';
import { AuditoriaComponent } from './auditoria/auditoria.component';
import { ConsultaComponent } from './consulta/consulta.component';
//import { AddCabeceraComponent } from './cabecera/add-cabecera/add-cabecera.component';
//import { VerCabeceraComponent } from './cabecera/ver-cabecera/ver-cabecera.component';
import { CopiaCabeceraComponent } from './cabecera/copia-cabecera/copia-cabecera.component';
import { VerInconsistenciaComponent } from './inconsistencia/ver-inconsistencia/ver-inconsistencia.component';
import { NotificarInconsistenciaComponent } from './inconsistencia/notificar-inconsistencia/notificar-inconsistencia.component';
//import { VerCcppComponent } from './consulta/ver-ccpp/ver-ccpp.component';


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
    CcppRoutingModule,
  ],
  declarations: [
    CcppComponent,
    CabeceraComponent,
    InconsistenciaComponent,
    AuditoriaComponent,
    ConsultaComponent,
    //AddCabeceraComponent,
    //VerCabeceraComponent,
    CopiaCabeceraComponent,
    VerInconsistenciaComponent,
    NotificarInconsistenciaComponent,
    //VerCcppComponent
  ],
  entryComponents: [
    //AddCabeceraComponent,
    //VerCabeceraComponent,
    CopiaCabeceraComponent,
    VerInconsistenciaComponent,
    NotificarInconsistenciaComponent,
    //VerCcppComponent
  ]
})
export class CcppModule { }
