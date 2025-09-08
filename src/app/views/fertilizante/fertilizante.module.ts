import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FertilizanteRoutes } from './fertilizante.routing';
import { RouterModule } from '@angular/router';

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
import { HotTableModule } from '@handsontable-pro/angular';

import { GestionComponent } from './gestion/gestion.component';
import { AdminBandasComponent } from './admin-bandas/admin-bandas.component';
import { TablaHorarioFertilizantesComponent } from './tabla-horario-fertilizantes/tabla-horario-fertilizantes.component';
import { OrigenesComponent } from './origenes/origenes.component';
import { AddOrigenComponent } from './origenes/add-origen/add-origen.component';
import { PanelReservasComponent } from './panel-reservas/panel-reservas.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { CapacidadTerminalComponent } from './panel-reservas/capacidad-terminal/capacidad-terminal.component';
import { ReservasComponent } from './panel-reservas/reservas/reservas.component';
import { DetalleReservasComponent } from './panel-reservas/detalle-reservas/detalle-reservas.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule } from 'saturn-datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { BuscarComponent } from './buscar/buscar.component';
import { ComercialComponent } from './comercial/comercial.component';
import { ComercialSeguimientoComponent } from './comercial/seguimiento/comercial-seguimiento.component';
import { ComercialSeguimientoDetalleReservasComponent } from './comercial/seguimiento/comercial-seguimiento-detalle-reserva/comercial-seguimiento-detalle-reserva.component';
import { ComercialSeguimientoDetalleCuposComponent } from './comercial/seguimiento/comercial-seguimiento-detalle-cupos/comercial-seguimiento-detalle-cupos.component';
import { ComercialGestionReservaComponent } from './comercial/gestion-reservas/comercial-gestion-reserva.component';
import { ListaChoferComponent } from '@app/shared/components/home/add-pedido-fertilizantes/lista-chofer/lista-chofer.component';
import { ComercialGestionReservaCambiarChoferComponent } from './comercial/gestion-reservas/comercial-gestion-reserva-cambiar-chofer/comercial-gestion-reserva-cambiar-chofer.component';

@NgModule({
  imports: [
    SelectAutocompleteModule,
    SatDatepickerModule,
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
    RouterModule.forChild(FertilizanteRoutes)
  ],
  declarations: [
    GestionComponent,
    AdminBandasComponent,
    TablaHorarioFertilizantesComponent,
    OrigenesComponent,
    AddOrigenComponent,
    PanelReservasComponent,
    SeguimientoComponent,
    CapacidadTerminalComponent,
    ReservasComponent,
    DetalleReservasComponent,
    BuscarComponent,
    ComercialComponent,
    ComercialSeguimientoComponent,
    ComercialSeguimientoDetalleReservasComponent,
    ComercialSeguimientoDetalleCuposComponent,
    ComercialGestionReservaComponent,
    //ListaChoferComponent,
    ComercialGestionReservaCambiarChoferComponent
  ],
  entryComponents: [
    AddOrigenComponent,
    DetalleReservasComponent,
    ComercialSeguimientoDetalleReservasComponent,
    //ListaChoferComponent,
    ComercialGestionReservaCambiarChoferComponent
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class FertilizanteModule { }
