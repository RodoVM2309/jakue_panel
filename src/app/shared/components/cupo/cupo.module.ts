import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgmCoreModule } from "@agm/core";
import { AgmJsMarkerClustererModule } from "@agm/js-marker-clusterer";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { GridModule, ExcelModule } from "@progress/kendo-angular-grid";

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
import { TranslateModule } from "@ngx-translate/core";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SharedModule } from "../../shared.module";
import { QuillModule } from "ngx-quill";

import { CupoRoutingModule } from "./cupo-routing.module";
import { CupoComponent } from "./cupo.component";

import { AsignacionComponent } from "./asignacion/asignacion.component";
import { DetalleDadorComponent } from "./detalle-dador/detalle-dador.component";
import { AsignadosReceptorComponent } from "./asignados-receptor/asignados-receptor.component";
import { PanelConsolidadoComponent } from "./panel-consolidado/panel-consolidado.component";
import { MapaCuposComponent } from "./mapa-cupos/mapa-cupos.component";

import { AgmDirectionModule } from "agm-direction";
import { AgmMarkerSpiderModule } from "agm-oms";
import { CuponeraComponent } from "./cuponera/cuponera.component";
import { InformacionCupoComponent } from "./informacion-cupo/informacion-cupo.component";
import { DetalleConsolidadoComponent } from "./detalle-consolidado/detalle-consolidado.component";
import { AsignarSolicitudComponent, AppCaratulasDiferentesComponent } from "./asignar-solicitud/asignar-solicitud.component";
import { AsignarSinSolicitudComponent } from "./asignar-sin-solicitud/asignar-sin-solicitud.component";
import { DevolverComponent } from "./devolver/devolver.component";
import { AddCuposDisponiblesComponent } from "./add-cupos-disponibles/add-cupos-disponibles.component";
import { RecuperarComponent } from "./recuperar/recuperar.component";
import { InformacionDemandaComponent } from "./informacion-demanda/informacion-demanda.component";
import { SolicitudesCupoComponent } from './solicitudes-cupo/solicitudes-cupo.component';
import { MostrarObservComponent } from './asignar-solicitud/mostrar-observ/mostrar-observ.component';

import { ModificarCargaCupoComponent } from './modificar-carga-cupo/modificar-carga-cupo.component';
import { ListadoContratoComponent } from './listado-contrato/listado-contrato.component';
import { CambiarDemandaComponent } from './informacion-demanda/cambiar-demanda/cambiar-demanda.component';
import { AplicarCabeceraComponent } from './aplicar-cabecera/aplicar-cabecera.component';
import { EditarCabeceraComponent } from './editar-cabecera/editar-cabecera.component';
import { InfoAplicarCabeceraComponent } from './info-aplicar-cabecera/info-aplicar-cabecera.component';
import { AddAlfanumericoComponent } from './add-cupos-disponibles/add-alfanumerico/add-alfanumerico.component';
import { NuevaCabeceraComponent } from './add-cupos-disponibles/nueva-cabecera/nueva-cabecera.component';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { HotTableModule } from '@handsontable-pro/angular';

import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
//import { MaritechDateRangepickerComponent} from './maritech-daterangepicker.component';
import { MuvinDatepickerComponent } from './muvin-datepicker/muvin-datepicker.component';
import { AsignacionV2Component } from './asignacion-v2/asignacion-v2.component';
import { RechazarSolicitudComponent } from './rechazar-solicitud/rechazar-solicitud.component';
import { OrderrByPipe } from "app/shared/pipes/orderr-by.pipe";
import { MatBadgeModule } from '@angular/material/badge';
import { RecuperarV2Component } from './recuperar-v2/recuperar-v2.component';
import { PanelConsolidadoV2Component } from './panel-consolidado-v2/panel-consolidado-v2.component';
import { InformacionCupoV2Component } from './informacion-cupo-v2/informacion-cupo-v2.component';
import { UsuarioSinEmailComponent } from './usuario-sin-email/usuario-sin-email.component';
import { VerCartaPorteComponent } from './ver-carta-porte/ver-carta-porte.component';
import { MotivoRechazoComponent } from './recuperar/motivo-rechazo/motivo-rechazo.component';
import { RechazarCuposComponent } from './rechazar-cupos/rechazar-cupos.component';
//import { AddSolicitudesC3Component } from './cupera3/add-solicitudes-c3/add-solicitudes-c3.component';
import { AsignacionC3Component } from './cupera3/asignacion-c3/asignacion-c3.component';
import { FiltrosAsignacionC3Component } from './cupera3/asignacion-c3/components/filtros-asignacion-c3/filtros-asignacion-c3.component';
import { SelectAllOptionComponent } from './cupera3/asignacion-c3/components/filtros-asignacion-c3/select-all-option/select-all-option.component';
import { DetalleProductoZonaComponent } from './cupera3/asignacion-c3/components/detalle-producto-zona/detalle-producto-zona.component';
import { GridSolicitudesComponent } from './cupera3/asignacion-c3/components/grid-solicitudes/grid-solicitudes.component';
import { GestionComponent } from './cupera3/asignacion-c3/components/gestion/gestion.component';
import { DetalleZonaComponent } from './cupera3/asignacion-c3/components/detalle-zona/detalle-zona.component';
import { DetalleCupoChoferComponent } from "./detalle-cupo-chofer/detalle-cupo-chofer.component";
import { SharedFilterCupo } from "@app/shared-filter-cupo/shared-filter-cupo.module";
import { DetalleConsolidadoDerivacionComponent } from "./detalle-consolidado-derivacion/detalle-consolidado-derivacion.component";

//Cupo2020

@NgModule({
  imports: [
    HotTableModule.forRoot(),
    SharedFilterCupo,
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
    TranslateModule,
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
    CupoRoutingModule,
    GridModule,
    ExcelModule,
    GooglePlaceModule,
    AgmDirectionModule,
    AgmMarkerSpiderModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatBadgeModule,
  ],
  declarations: [
    CupoComponent,
    AsignacionComponent,
    AddCuposDisponiblesComponent,
    DetalleDadorComponent,
    AsignadosReceptorComponent,
    PanelConsolidadoComponent,
    MapaCuposComponent,
    CuponeraComponent,
    InformacionCupoComponent,
    DetalleConsolidadoComponent,
    AsignarSolicitudComponent,
    AppCaratulasDiferentesComponent,
    AsignarSinSolicitudComponent,
    DevolverComponent,
    RecuperarComponent,
    InformacionDemandaComponent,
    SolicitudesCupoComponent,
    MostrarObservComponent,
    ModificarCargaCupoComponent,
    ListadoContratoComponent,
    CambiarDemandaComponent,
    AplicarCabeceraComponent,
    EditarCabeceraComponent,
    InfoAplicarCabeceraComponent,
    AddAlfanumericoComponent,
    NuevaCabeceraComponent,
    SeguimientoComponent,
    //MaritechDateRangepickerComponent,
    MuvinDatepickerComponent,
    AsignacionV2Component,
    RechazarSolicitudComponent,
    OrderrByPipe,
    RecuperarV2Component,
    PanelConsolidadoV2Component,
    InformacionCupoV2Component,
    UsuarioSinEmailComponent,
    VerCartaPorteComponent,
    MotivoRechazoComponent,
    RechazarCuposComponent,
    //AddSolicitudesC3Component,
    AsignacionC3Component,
    FiltrosAsignacionC3Component,
    SelectAllOptionComponent,
    DetalleProductoZonaComponent,
    GridSolicitudesComponent,
    GestionComponent,
    DetalleZonaComponent,
    DetalleCupoChoferComponent,
    DetalleConsolidadoDerivacionComponent
  ],
  entryComponents: [
    InformacionCupoComponent,
    DetalleConsolidadoComponent,
    AsignarSolicitudComponent,
    AppCaratulasDiferentesComponent,
    AsignarSinSolicitudComponent,
    AddCuposDisponiblesComponent,
    DevolverComponent,
    RecuperarComponent,
    MotivoRechazoComponent,
    InformacionDemandaComponent,
    MostrarObservComponent,
    ModificarCargaCupoComponent,
    CambiarDemandaComponent,
    AplicarCabeceraComponent,
    EditarCabeceraComponent,
    InfoAplicarCabeceraComponent,
    AddAlfanumericoComponent,
    NuevaCabeceraComponent,
    RechazarSolicitudComponent,
    InformacionCupoV2Component,
    UsuarioSinEmailComponent,
    VerCartaPorteComponent,
    RechazarCuposComponent,
    DetalleCupoChoferComponent,
    DetalleConsolidadoDerivacionComponent
    //AddSolicitudesC3Component
  ]
})
export class CupoModule { }
