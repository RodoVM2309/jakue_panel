import { AgmCoreModule } from "@agm/core";
import { AgmJsMarkerClustererModule } from "@agm/js-marker-clusterer";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ExcelModule, GridModule } from "@progress/kendo-angular-grid";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

import { CdkTableModule } from "@angular/cdk/table";
import { FlexLayoutModule } from "@angular/flex-layout";
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
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { QuillModule } from "ngx-quill";
import { SharedModule } from "../../shared.module";

import { AgmDirectionModule } from "agm-direction";
import { AgmMarkerSpiderModule } from "agm-oms";
import { CdkDetailRowDirective } from "../../directives/cdk-detail-row.directive";
import { AddPedidoDadorCortoComponent } from "../home/add-pedido-dador-corto/add-pedido-dador-corto.component";
import { AddPedidoDadorRetornoComponent } from "../home/add-pedido-dador-retorno/add-pedido-dador-retorno.component";
import { AddPedidoDadorComponent } from "../home/add-pedido-dador/add-pedido-dador.component";
import { ConfirmarPedidoRetornoComponent } from "../home/confirmar-pedido-retorno/confirmar-pedido-retorno.component";
import { ConfirmarPedidoComponent } from "../home/confirmar-pedido/confirmar-pedido.component";
import { ListarListaComponent } from '../turneada/listar-lista/listar-lista.component';
import { AddOrigenComponent } from "./add-origen/add-origen.component";
import { AsignarIntermediariosComponent } from "./asignar-intermediarios/asignar-intermediarios.component";
import { AsignarViajeRetornoComponent } from './asignar-viaje-retorno/asignar-viaje-retorno.component';
import { AddCupoComponent } from './asignar-viaje/add-cupo/add-cupo.component';
import { AsignarViajeComponent } from './asignar-viaje/asignar-viaje.component';
import { CargaMasivaComponent } from './carga-masiva/carga-masiva.component';
import { CargaPedidoComponent } from "./carga-pedido/carga-pedido.component";
import { CargaComponent } from "./carga/carga.component";
import { CondicionesViaje2Component } from "./condiciones-viaje2/condiciones-viaje2.component";
import { ConfiguracionCentroComponent } from "./configuracion-centro/configuracion-centro.component";
import { ConfirmCargaDestinoComponent } from "./confirm-carga-destino/confirm-carga-destino.component";
import { ConfirmCargaParametrosComponent } from "./confirm-carga-parametros/confirm-carga-parametros.component";
import { ConfirmCargaRetornoComponent } from "./confirm-carga-retorno/confirm-carga-retorno.component";
import { ConfirmCargaComponent } from "./confirm-carga/confirm-carga.component";
import { CupoPedidoComponent } from './cupo-pedido/cupo-pedido.component';
import { CupoEntregadorComponent } from "./cupos-disponibles/cupo-entregador/cupo-entregador.component";
import { CuposDisponiblesComponent } from "./cupos-disponibles/cupos-disponibles.component";
import { CuposVinculadosComponent } from "./cupos-vinculados/cupos-vinculados.component";
import { DetalleCupoComponent } from "./cupos-vinculados/detalle-cupo/detalle-cupo.component";
import { MapaCuposVinculadosComponent } from "./cupos-vinculados/mapa-cupos-vinculados/mapa-cupos-vinculados.component";
import { DescargaComponent } from "./descarga/descarga.component";
import { DesvioRetornoComponent } from "./desvio-retorno/desvio-retorno.component";
import { DesvioComponent } from "./desvio/desvio.component";
import { DifusionesComponent } from "./difusiones/difusiones.component";
import { AddRechazoViajeComponent } from './edit-viaje/add-rechazo-viaje/add-rechazo-viaje.component';
import { EditViajeComponent } from "./edit-viaje/edit-viaje.component";
import { AddEstadoDescargaRetornoComponent } from "./estado-descarga/add-estado-descarga-retorno/add-estado-descarga-retorno.component";
import { AddEstadoDescargaComponent } from "./estado-descarga/add-estado-descarga/add-estado-descarga.component";
import { AddRechazoCaladaRetornoComponent } from "./estado-descarga/add-rechazo-calada-retorno/add-rechazo-calada-retorno.component";
import { AddRechazoCaladaComponent } from "./estado-descarga/add-rechazo-calada/add-rechazo-calada.component";
import { EstadoViajeComponent } from "./estado-viaje/estado-viaje.component";
import { ExtenderFechaComponent } from "./extender-fecha/extender-fecha.component";
import { HeaderViewsComponent } from "./header-views/header-views.component";
import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { InfoSubpedidoComponent } from "./info-subpedido/info-subpedido.component";
import { VariarSubpedidoComponent } from "./info-subpedido/variar-subpedido/variar-subpedido.component";
import { InfoViajeComponent } from "./info-viaje/info-viaje.component";
import { ListaChoferesObservacionesComponent } from './lista-choferes/lista-choferes-observaciones/lista-choferes-observaciones.component';
import { MapaCuposComponent } from "./mapa-cupos/mapa-cupos.component";
import { MapaComponent } from "./mapa/mapa.component";
import { NotificarTransportistasComponent } from './mapa/notificar-transportistas/notificar-transportistas.component';
import { NotFoundComponent } from "./not-found/not-found.component";
import { PedidoDadorComponent } from "./pedido-dador/pedido-dador.component";
import { PedidoObservacionesComponent } from "./pedido-observaciones/pedido-observaciones.component";
import { PrepedidoComponent } from './prepedido/prepedido.component';
import { ReducirComponent } from "./reducir/reducir.component";
import { SiniestroComponent } from "./siniestro/siniestro.component";
import { CambiarDemandaComponent } from './solicitudes/cambiar-demanda/cambiar-demanda.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { ViajeComponent } from "./viaje/viaje.component";
import { VincularClienteComponent } from "./vincular-cliente/vincular-cliente.component";
import { WhatsappComponent } from "./whatsapp/whatsapp.component";

import { AddPedidoFertilizantesComponent } from "./add-pedido-fertilizantes/add-pedido-fertilizantes.component";
import { TwoDigitDecimaNumberDirective } from "./add-pedido-fertilizantes/decimal.directive";
import { AsignarDirectoComponent } from "./asignar-directo/asignar-directo.component";
import { AsignarViajeFertilizanteComponent } from './asignar-viaje-fertilizante/asignar-viaje-fertilizante.component';
import { AsignarReservaComponent } from "./asignar-viaje-retorno/asignar-reserva/asignar-reserva.component";


import { SelectAutocompleteModule } from "mat-select-autocomplete";
import { SatDatepickerModule } from "saturn-datepicker";
import { EditPedidoFertilizantesComponent } from './edit-pedido-fertilizantes/edit-pedido-fertilizantes.component';
import { SeguimientoReservaDetalleCuposComponent } from "./seguimiento-reserva/seguimiento-reserva-detalle-cupos/seguimiento-reserva-detalle-cupos.component";
import { SeguimientoReservaDetalleReservaComponent } from "./seguimiento-reserva/seguimiento-reserva-detalle-reserva/seguimiento-reserva-detalle-reserva.component";
import { SeguimientoReservaComponent } from "./seguimiento-reserva/seguimiento-reserva.component";

import { AddSmsRetornoComponent } from '@home/asignar-viaje-retorno/add-sms-retorno/add-sms-retorno.component';
import { AddPedidoMasivoComponent } from './add-pedido-masivo/add-pedido-masivo.component';
import { ChofDisponiblesComponent } from './cupos-disponibles/chof-disponibles/chof-disponibles.component';

import { MatDividerModule } from '@angular/material/divider';
import { CupoModule } from "../cupo/cupo.module";
import { PanelConsolidadoPedidoComponent } from "./panel-consolidado-pedido/panel-consolidado-pedido.component";
import { ViajesTransportadoraComponent } from "./transportadoras-tab/components/viajes-transportadora/viajes-transportadora.component";
import { TransportadorasTabComponent } from "./transportadoras-tab/containers/transportadoras-tab.component";
import { SharedFilterCupo } from "@app/shared-filter-cupo/shared-filter-cupo.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedFilterCupo,
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
      libraries: ["places"],
    }),
    AgmJsMarkerClustererModule,
    HomeRoutingModule,
    GridModule,
    ExcelModule,
    GooglePlaceModule,
    AgmDirectionModule,
    AgmMarkerSpiderModule,
    SatDatepickerModule,
    SelectAutocompleteModule,
    MatDividerModule,
    CupoModule

  ],
  declarations: [
    HomeComponent,
    AsignarViajeComponent,
    AsignarViajeRetornoComponent,
    CdkDetailRowDirective,
    CargaComponent,
    DescargaComponent,
    MapaComponent,
    HeaderViewsComponent,
    ReducirComponent,
    ExtenderFechaComponent,
    EditViajeComponent,
    EstadoViajeComponent,
    DesvioComponent,
    DesvioRetornoComponent,
    WhatsappComponent,
    NotFoundComponent,
    ConfirmCargaComponent,
    ConfirmCargaDestinoComponent,
    ConfirmCargaParametrosComponent,
    ViajeComponent,
    AddOrigenComponent,
    VincularClienteComponent,
    InfoViajeComponent,
    AddEstadoDescargaComponent,
    AddEstadoDescargaRetornoComponent,
    AddRechazoCaladaComponent,
    AddRechazoCaladaRetornoComponent,
    ConfirmCargaRetornoComponent,
    PedidoDadorComponent,
    AddPedidoDadorRetornoComponent,
    AddPedidoDadorComponent,
    ConfirmarPedidoComponent,
    ConfirmarPedidoRetornoComponent,
    MapaCuposComponent,
    InfoSubpedidoComponent,
    VariarSubpedidoComponent,
    AsignarIntermediariosComponent,
    AddPedidoDadorCortoComponent,
    ConfiguracionCentroComponent,
    PedidoObservacionesComponent,
    CondicionesViaje2Component,
    CuposDisponiblesComponent,
    CargaPedidoComponent,
    CuposVinculadosComponent,
    MapaCuposVinculadosComponent,
    CupoEntregadorComponent,
    SiniestroComponent,
    DetalleCupoComponent,
    DifusionesComponent,
    CupoPedidoComponent,
    SolicitudesComponent,
    PrepedidoComponent,
    ListarListaComponent,
    CambiarDemandaComponent,
    ListaChoferesObservacionesComponent,
    AddCupoComponent,
    CambiarDemandaComponent,
    CargaMasivaComponent,
    AddRechazoViajeComponent,
    NotificarTransportistasComponent,
    AddPedidoFertilizantesComponent,
    TwoDigitDecimaNumberDirective,
    //ListaChoferComponent,
    AsignarDirectoComponent,
    AsignarReservaComponent,
    AsignarViajeFertilizanteComponent,
    AddSmsRetornoComponent,
    SeguimientoReservaComponent,
    SeguimientoReservaDetalleReservaComponent,
    SeguimientoReservaDetalleCuposComponent,
    AddPedidoMasivoComponent,
    EditPedidoFertilizantesComponent,
    ChofDisponiblesComponent,
    PanelConsolidadoPedidoComponent,
    ViajesTransportadoraComponent,
    TransportadorasTabComponent
  ],
  entryComponents: [
    ReducirComponent,
    ExtenderFechaComponent,
    EditViajeComponent,
    EstadoViajeComponent,
    DesvioComponent,
    DesvioRetornoComponent,
    WhatsappComponent,
    ConfirmCargaComponent,
    ConfirmCargaParametrosComponent,
    ConfirmCargaDestinoComponent,
    AddOrigenComponent,
    VincularClienteComponent,
    InfoViajeComponent,
    AddEstadoDescargaComponent,
    AddEstadoDescargaRetornoComponent,
    AddRechazoCaladaComponent,
    AddRechazoCaladaRetornoComponent,
    ConfirmCargaRetornoComponent,
    AddPedidoDadorRetornoComponent,
    AddPedidoDadorComponent,
    ConfirmarPedidoComponent,
    ConfirmarPedidoRetornoComponent,
    InfoSubpedidoComponent,
    VariarSubpedidoComponent,
    AsignarIntermediariosComponent,
    AddPedidoDadorCortoComponent,
    AddPedidoFertilizantesComponent,
    AddPedidoMasivoComponent,
    ConfiguracionCentroComponent,
    PedidoObservacionesComponent,
    CondicionesViaje2Component,
    MapaCuposVinculadosComponent,
    CupoEntregadorComponent,
    SiniestroComponent,
    DetalleCupoComponent,
    CupoPedidoComponent,
    ListarListaComponent,
    CambiarDemandaComponent,
    ListaChoferesObservacionesComponent,
    AddCupoComponent,
    AddRechazoViajeComponent,
    NotificarTransportistasComponent,
    //ListaChoferComponent,
    AsignarDirectoComponent,
    AsignarReservaComponent,
    AddSmsRetornoComponent,
    SeguimientoReservaComponent,
    SeguimientoReservaDetalleReservaComponent,
    EditPedidoFertilizantesComponent,
    ChofDisponiblesComponent
  ]

})
export class HomeModule { }
