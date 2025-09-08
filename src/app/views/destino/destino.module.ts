import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AgmCoreModule } from "@agm/core";
import { AgmJsMarkerClustererModule } from "@agm/js-marker-clusterer";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GridModule, ExcelModule } from "@progress/kendo-angular-grid";
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { NgFallimgModule } from 'ng-fallimg';
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
import { DestinoRoutingModule } from './destino-routing.module';
import { PanelComponent } from './panel/panel.component';
import { ConfigPuertoComponent } from './turnos/config-puerto/config-puerto.component';
import { ConfigPuertoPopupComponent } from './turnos/config-puerto/config-puerto-popup/config-puerto-popup.component';
import { ConfigDiaPopupComponent } from './turnos/config-puerto/config-dia-popup/config-dia-popup.component';
import { TurnosComponent } from './turnos/turnos.component';
import { ResumenComponent } from './turnos/resumen/resumen.component';
import { DisponiblesComponent } from './turnos/disponibles/disponibles.component';
import { DiarioComponent } from './turnos/resumen/diario/diario.component';
import { SemanalComponent } from './turnos/resumen/semanal/semanal.component';
import { MensualComponent } from './turnos/resumen/mensual/mensual.component';
import { EnviarSmsComponent } from './turnos/disponibles/enviar-sms/enviar-sms.component';
import { PlantasComponent } from './plantas/plantas.component';
import { PosicionComponent } from './plantas/posicion/posicion.component';
import { PendientesComponent } from './plantas/pendientes/pendientes.component';
import { ClearingCuposComponent } from './plantas/clearing-cupos/clearing-cupos.component';
import { InfoVentanillaComponent } from './turnos/disponibles/info-ventanilla/info-ventanilla.component';
import { ChanceTimeComponent } from './turnos/config-puerto/chance-time/chance-time.component';
import { EnviarSmsChoferesComponent } from './turnos/disponibles/enviar-sms-choferes/enviar-sms-choferes.component';
import { AdminEstadoComponent } from './turnos/config-puerto/admin-estado/admin-estado.component';
import { AddEditEstadoComponent } from './turnos/config-puerto/admin-estado/add-edit-estado/add-edit-estado.component';
import { BuscarComponent } from './turnos/buscar/buscar.component';
import { NoFoundComponent } from './turnos/buscar/no-found/no-found.component';
import { HotTableModule } from '@handsontable-pro/angular';
import { AdminBandasHorariasComponent } from './admin-bandas-horarias/admin-bandas-horarias.component';
import { TablaHorariosComponent } from './tabla-horarios/tabla-horarios.component';
import { GaritaComponent } from './garita/garita.component';
import { BuscadorGaritaComponent } from './garita/buscador-garita/buscador-garita.component';
import { ListadoLogsBusquedasComponent } from './logs-busquedas/components/listado-logs-busquedas/listado-logs-busquedas.component';
import { SinLogsComponent } from './logs-busquedas/components/sin-logs/sin-logs.component';
import { FiltrosLogsComponent } from './logs-busquedas/components/filtros-logs/filtros-logs.component';
import { DataLogsComponent } from './logs-busquedas/components/data-logs/data-logs.component';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { LogsBusquedaService } from './logs-busquedas/services/logs-busqueda.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  imports: [
    NgxMaterialTimepickerModule,
    SatDatepickerModule,
    SatNativeDateModule,
    HotTableModule,
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
    NgFallimgModule.forRoot({
      default: 'assets/images/products/icono-gral.png'
    }),
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
    DestinoRoutingModule,
  ],
  declarations: [PanelComponent, ConfigPuertoComponent, ConfigPuertoPopupComponent, ConfigDiaPopupComponent, TurnosComponent, ResumenComponent, DisponiblesComponent, DiarioComponent, SemanalComponent, MensualComponent, EnviarSmsComponent, PlantasComponent, PosicionComponent, PendientesComponent, ClearingCuposComponent, InfoVentanillaComponent, ChanceTimeComponent, EnviarSmsChoferesComponent, AdminEstadoComponent, AddEditEstadoComponent, BuscarComponent, NoFoundComponent, AdminBandasHorariasComponent, TablaHorariosComponent, GaritaComponent, BuscadorGaritaComponent, ListadoLogsBusquedasComponent, SinLogsComponent, FiltrosLogsComponent, DataLogsComponent],
  entryComponents: [ConfigPuertoPopupComponent, ConfigDiaPopupComponent, EnviarSmsComponent, PendientesComponent, InfoVentanillaComponent, ChanceTimeComponent, EnviarSmsChoferesComponent, AdminEstadoComponent, AddEditEstadoComponent, NoFoundComponent],
  providers: [
    LogsBusquedaService,
    DatePipe
  ]
})
export class DestinoModule { }
