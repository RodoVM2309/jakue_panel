import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from "@agm/core";
import { AgmJsMarkerClustererModule } from "@agm/js-marker-clusterer";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { GridModule, ExcelModule } from "@progress/kendo-angular-grid";
import { TranslateModule } from "@ngx-translate/core";

import { TurneadaRoutingModule } from './turneada-routing.module';

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
import { CdkTableModule } from "@angular/cdk/table";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SharedModule } from "../../shared.module";
import { QuillModule } from "ngx-quill";

import { AgmDirectionModule } from "agm-direction";
import { AgmMarkerSpiderModule } from "agm-oms";

import { TurneadaComponent } from './turneada/turneada.component';
import { ListaTurneadoComponent } from './lista-turneado/lista-turneado.component';
import { ConfirmarArriboComponent } from './confirmar-arribo/confirmar-arribo.component';
import { EstadoChoferesComponent } from './estado-choferes/estado-choferes.component';
import { AddEstadoChoferComponent } from './estado-choferes/add-estado-chofer/add-estado-chofer.component';
import { AddSancionViajeComponent } from './estado-choferes/add-sancion-viaje/add-sancion-viaje.component';

import {AddListaComponent} from './lista-turneado/add-lista/add-lista.component';
import {DuplicarListaComponent} from './lista-turneado/duplicar-lista/duplicar-lista.component';
import { ListaChoferesComponent} from './lista-turneado/lista-choferes/lista-choferes.component';
import { ControlComponent } from './control/control.component';
import { ModificarComponent } from './control/modificar/modificar.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
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
    MatTooltipModule,
    FlexLayoutModule,
    QuillModule,
    ChartsModule,
    NgxDatatableModule,
    SharedModule,
    CdkTableModule,
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
    TurneadaRoutingModule,
  ],
  declarations: [
    TurneadaComponent,
    ListaTurneadoComponent,
    ConfirmarArriboComponent,
    EstadoChoferesComponent,
    AddEstadoChoferComponent,
    AddSancionViajeComponent,
    AddListaComponent,
    DuplicarListaComponent,
    ListaChoferesComponent,
    ControlComponent,
    ModificarComponent
  ],
  entryComponents: [
    AddEstadoChoferComponent,
    AddSancionViajeComponent,
    AddListaComponent,
    DuplicarListaComponent,
    ListaChoferesComponent,
    ModificarComponent
  ]
})
export class TurneadaModule { }
