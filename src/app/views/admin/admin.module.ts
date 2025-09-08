import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgmCoreModule } from "@agm/core";
import { AgmJsMarkerClustererModule } from "@agm/js-marker-clusterer";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";
import {
  MatAutocompleteModule,
  MatProgressBarModule,
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule,
  MatChipsModule,
  MatSelectModule,
  MatTableModule,
  MatPaginatorModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTabsModule,
  MatToolbarModule,
  MatSortModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatMenuModule,
  MatRadioModule,
  MatProgressSpinnerModule,
  MatTableDataSource,
  MatDialogModule,
  MatSnackBarModule,
  MatSidenavModule,
  MatExpansionModule,
  MatDividerModule,
  MatTooltipModule,
  MatListModule,
  MatStepperModule
} from "@angular/material";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedModule } from "./../../shared/shared.module";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { CdkTableModule } from "@angular/cdk/table";
import { AdminRoutingModule } from "./admin-routing.module";
import { NgPipesModule, NgArrayPipesModule } from "ngx-pipes";
import { QuillModule } from "ngx-quill";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";

import { UsersComponent } from "./users/users/users.component";
import { RolesComponent } from "./roles/roles.component";
import { AddUserComponent } from "./users/add-user/add-user.component";
import { AddRolComponent } from "./roles/add-rol/add-rol.component";
import { PersonasComponent } from "./personas/personas.component";
import { RolesPersonaComponent } from "./personas/roles-persona/roles-persona.component";
import { DestinosComponent } from "./destinos/destinos.component";
import { AddDestinoComponent } from "./destinos/add-destino/add-destino.component";
import { EstadoPuertoComponent } from "./estado-puerto/estado-puerto.component";
import { SituacionPuertoComponent } from "./estado-puerto/situacion-puerto/situacion-puerto.component";
import { VincularCentroClienteComponent } from "./vincular-centro-cliente/vincular-centro-cliente.component";
import { BajadaMasivaComponent } from "./bajada-masiva/bajada-masiva.component";
import { VincularClienteComponent } from "./vincular-centro-cliente/vincular-cliente/vincular-cliente.component";
import { VincularCentroCorredorComponent } from "./vincular-centro-corredor/vincular-centro-corredor.component";
import { VincularCorredorComponent } from "./vincular-centro-corredor/vincular-corredor/vincular-corredor.component";
import { VincularCentroOperadorComponent } from "./vincular-centro-operador/vincular-centro-operador.component";
import { VincularOperadorComponent } from "./vincular-centro-operador/vincular-operador/vincular-operador.component";
import { ProductosComponent } from "./productos/productos.component";
import { AddProductosComponent } from "./productos/add-productos/add-productos.component";
import { PromocionesComponent } from "./promociones/promociones.component";
import { AddPromocionesComponent } from "./promociones/add-promociones/add-promociones.component";
import { SubirImagenesComponent } from "./promociones/subir-imagenes/subir-imagenes.component";
import { GanadoresPromocionesComponent } from "./promociones/ganadores-promociones/ganadores-promociones.component";
import { TipoDestinoComponent } from "./tipo-destino/tipo-destino.component";
import { AddTipoDestinoComponent } from "./tipo-destino/add-tipo-destino/add-tipo-destino.component";
import { DesvioMotivoComponent } from "./desvio-motivo/desvio-motivo.component";
import { AddDesvioMotivoComponent } from "./desvio-motivo/add-desvio-motivo/add-desvio-motivo.component";
import { RazonRechazoComponent } from "./razon-rechazo/razon-rechazo.component";
import { AddRazonRechazoComponent } from "./razon-rechazo/add-razon-rechazo/add-razon-rechazo.component";
import { ZonaDestinoComponent } from "./zona-destino/zona-destino.component";
import { AddZonaDestinoComponent } from "./zona-destino/add-zona-destino/add-zona-destino.component";
import { MapaOficinaComponent } from "./mapa-oficina/mapa-oficina.component";
import { AddMapaOficinaComponent } from "./mapa-oficina/add-mapa-oficina/add-mapa-oficina.component";
import { MapaRadaresComponent } from "./mapa-radares/mapa-radares.component";
import { AddMapaRadaresComponent } from "./mapa-radares/add-mapa-radares/add-mapa-radares.component";
import { MapaRutaComponent } from "./mapa-ruta/mapa-ruta.component";
import { AddMapaRutaComponent } from "./mapa-ruta/add-mapa-ruta/add-mapa-ruta.component";
import { BocasComponent } from "./bocas/bocas.component";
import { ParametroChatComponent } from "./parametro-chat/parametro-chat.component";
import { AddParametroChatComponent } from "./parametro-chat/add-parametro-chat/add-parametro-chat.component";
import { SubirImagenParametroComponent } from "./parametro-chat/subir-imagen-parametro/subir-imagen-parametro.component";
import { MapaEstacionesComponent } from "./mapa-estaciones/mapa-estaciones.component";
import { AddBocasComponent } from "./bocas/add-bocas/add-bocas.component";
import { MapaTalleresComponent } from "./mapa-talleres/mapa-talleres.component";
import { AddMapaTalleresComponent } from "./mapa-talleres/add-mapa-talleres/add-mapa-talleres.component";
import { DocumentoComponent } from "./documento/documento.component";
import { SubirFicherosComponent } from "./documento/subir-ficheros/subir-ficheros.component";
import { AddDocumentoComponent } from "./documento/add-documento/add-documento.component";
import { ManualComponent } from "./manual/manual.component";
import { SubirManualComponent } from "./manual/subir-manual/subir-manual.component";
import { AddManualComponent } from "./manual/add-manual/add-manual.component";
import { EstandarComponent } from "./estandar/estandar.component";
import { AddEstandarComponent } from "./estandar/add-estandar/add-estandar.component";
import { SubirEstandarComponent } from "./estandar/subir-estandar/subir-estandar.component";
import { ZonaChoferesLibresComponent } from "./zona-choferes-libres/zona-choferes-libres.component";
import { AddZonaChoferesLibresComponent } from "./zona-choferes-libres/add-zona-choferes-libres/add-zona-choferes-libres.component";
import { SituacionpuertoComponent } from "./situacionpuerto/situacionpuerto.component";
import { AddSituacionpuertoComponent } from "./situacionpuerto/add-situacionpuerto/add-situacionpuerto.component";
import { PaisComponent } from "./pais/pais.component";
import { AddPaisComponent } from "./pais/add-pais/add-pais.component";
import { ProvinciaComponent } from "./provincia/provincia.component";
import { AddProvinciaComponent } from "./provincia/add-provincia/add-provincia.component";
import { LocalidadComponent } from "./localidad/localidad.component";
import { AddLocalidadComponent } from "./localidad/add-localidad/add-localidad.component";
import { OrigenesComponent } from "./origenes/origenes.component";
import { AddOrigenComponent } from "./origenes/add-origen/add-origen.component";
import { EquiposComponent } from "./equipos/equipos.component";
import { CamionComponent } from "./camion/camion.component";
import { AcopladoComponent } from "./acoplado/acoplado.component";
import { AddCamionComponent } from "./camion/add-camion/add-camion.component";
import { VincularCentroTransporteComponent } from "./vincular-centro-transporte/vincular-centro-transporte.component";
import { VincularTransporteComponent } from "./vincular-centro-transporte/vincular-transporte/vincular-transporte.component";
import { ZonaCentroComponent } from "./zona-centro/zona-centro.component";
import { AddZonaCentroComponent } from "./zona-centro/add-zona-centro/add-zona-centro.component";
import { AsignacionZonaChoferComponent } from "./vincular-centro-transporte/asignacion-zona-chofer/asignacion-zona-chofer.component";
import { AsignacionAliasChoferComponent } from "./vincular-transporte-chofer/asignacion-alias-chofer/asignacion-alias-chofer.component";
import { VincularTransporteChoferComponent } from "./vincular-transporte-chofer/vincular-transporte-chofer.component";
import { VincularChoferComponent } from "./vincular-transporte-chofer/vincular-chofer/vincular-chofer.component";
import { AddAcopladoComponent } from "./acoplado/add-acoplado/add-acoplado.component";
import { ConsultasComponent } from "./consultas/consultas.component";
import { ResponderComponent } from "./consultas/responder/responder.component";
import { VariarKmComponent } from "./centros/variar-km/variar-km.component";
import { InteligenciaComponent } from "./inteligencia/inteligencia.component";
import { UsuarioComponent } from './auditoria/usuario.component';
import { UsuarioLogComponent } from './auditoria/usuariolog.component';
import { AuditoriaComponent } from './auditoria/auditoria.component';
import { AuditoriaMenuComponent } from './auditoria-centro/auditoria-menu.component';
import { ErrorLogMenuComponent } from './auditoria/errorlog-menu.component';
import { ErrorLogComponent } from './auditoria/errorlog.component';
import { AddEquipoComponent } from "./equipos/add-equipo/add-equipo.component";
import { VincularEquipoComponent } from "./vincular-transporte-chofer/vincular-equipo/vincular-equipo.component";
import { CamionDisponibleComponent } from "./inteligencia/camion-disponible/camion-disponible.component";
import { VincularCentroIntermediarioComponent } from "./vincular-centro-intermediario/vincular-centro-intermediario.component";
import { VincularIntermediarioComponent } from "./vincular-centro-intermediario/vincular-intermediario/vincular-intermediario.component";
import { VincularCentroEntregadorComponent } from "./vincular-centro-entregador/vincular-centro-entregador.component";
import { VincularCentroDestinatarioComponent } from "./vincular-centro-destinatario/vincular-centro-destinatario.component";
import { VincularDestinatarioComponent } from "./vincular-centro-destinatario/vincular-destinatario/vincular-destinatario.component";
import { VincularZonaChoferComponent } from "./vincular-zona-chofer/vincular-zona-chofer.component";
import { VincularZonaComponent } from "./vincular-zona-chofer/vincular-zona/vincular-zona.component";
import { DestinatarioComponent } from "./destinatario/destinatario.component";
import { CorredorComponent } from "./corredor/corredor.component";
import { OperadorComponent } from "./operador/operador.component";
import { CentrosComponent, TipoIntervinientesDialog } from "./centros/centros.component";
import { EntregadorComponent } from "./entregador/entregador.component";
import { ChoferPerdidoComponent } from "./chofer-perdido/chofer-perdido.component";
import { TrabajadoresComponent } from "./trabajadores/trabajadores.component";
import { FlotaIntermediarioComponent } from "./../../shared/components/home/flota-intermediario/flota-intermediario.component";
import { PorEvaluarComponent } from "./../../shared/components/home/por-evaluar/por-evaluar.component";
import { MapaChoferLibreComponent } from "./mapa-chofer-libre/mapa-chofer-libre.component";
import { ConcursoComponent } from "./concurso/concurso.component";
import { AddConcursoComponent } from "./concurso/add-concurso/add-concurso.component";
import { SubirPdfConcursoComponent } from "./concurso/subir-pdf-concurso/subir-pdf-concurso.component";
import { NoticiaComponent } from "./noticia/noticia.component";
import { AddNoticiaComponent } from "./noticia/add-noticia/add-noticia.component";
import { SubirImagenNoticiaComponent } from "./noticia/subir-imagen-noticia/subir-imagen-noticia.component";
import { SorteoComponent } from "./sorteo/sorteo.component";
import { AddSorteoComponent } from "./sorteo/add-sorteo/add-sorteo.component";
import { SubirImagenSorteoComponent } from "./sorteo/subir-imagen-sorteo/subir-imagen-sorteo.component";
import { GanadoresSorteoComponent } from "./sorteo/ganadores-sorteo/ganadores-sorteo.component";
import { AddGanadoresSorteoComponent } from "./sorteo/ganadores-sorteo/add-ganadores-sorteo/add-ganadores-sorteo.component";
import { EstadisticaComponent } from "./estadistica/estadistica.component";
import { ListadoPedidosComponent } from "./estadistica/listado-pedidos/listado-pedidos.component";
import { ListadoViajesComponent } from "./estadistica/listado-viajes/listado-viajes.component";
import { AddListaNegraComponent } from "./vincular-zona-chofer/add-lista-negra/add-lista-negra.component";
import { ListaNegraComponent } from "./lista-negra/lista-negra.component";
import { EditListaNegraComponent } from "./lista-negra/edit-lista-negra/edit-lista-negra.component";
import { AgregarChoferRucComponent } from "./lista-negra/agregar-chofer-ruc/agregar-chofer-ruc.component";
import { MotivoListaNegraComponent } from "./motivo-lista-negra/motivo-lista-negra.component";
import { AddListaNegraMotivoComponent } from "./motivo-lista-negra/add-lista-negra-motivo/add-lista-negra-motivo.component";
import { ConfigurarCentroComponent } from "./configurar-centro/configurar-centro.component";
import { ConfigurarMuvinComponent } from "./configurar-muvin/configurar-muvin.component";
import { PerfilComponent } from "./personas/perfil/perfil.component";
import { RankingsComponent } from "./rankings/rankings.component";
import { ListadoChoferesComponent } from "./rankings/listado-choferes/listado-choferes.component";
import { ListadoRechazadosComponent } from "./rankings/listado-rechazados/listado-rechazados.component";
import { ListadoDesviadosComponent } from "./rankings/listado-desviados/listado-desviados.component";
import { ProductosViajesComponent } from "./rankings/productos-viajes/productos-viajes.component";
import { DesactivarRolComponent } from "./personas/desactivar-rol/desactivar-rol.component";
import { ReportCentrosComponent } from "./reportes/report-centros/report-centros.component";
import { BusquedaFlotaComponent } from "./busqueda-flota/busqueda-flota.component";
import { AddBusquedaFlotaComponent } from "./busqueda-flota/add-busqueda-flota/add-busqueda-flota.component";
import { NuevosProveedoresComponent } from "./nuevos-proveedores/nuevos-proveedores.component";
import { GestionarBusquedaComponent } from "./busqueda-flota/gestionar-busqueda/gestionar-busqueda.component";
import { TipoCentrosComponent } from "./centros/tipo-centros/tipo-centros.component";
import { ChoferVencidoComponent } from "./chofer-vencido/chofer-vencido.component";
import { EditVencimientoLicenciaComponent } from "./edit-vencimiento-licencia/edit-vencimiento-licencia.component";
import { ChoferesUnistallComponent } from "./choferes-uninstall/choferes-uninstall.component";
import { HojaRutaComponent } from "./hoja-ruta/hoja-ruta.component";

import { CamionAcopladoComponent } from "./vincular-centro-transporte/vincular-transporte/camion-acoplado/camion-acoplado.component";
import { GestionarMotivosComponent } from "./gestionar-motivos/gestionar-motivos.component";
import { AddMotivoComponent } from "./gestionar-motivos/add-motivo/add-motivo.component";
import { TipoCombustibleComponent } from "./tipo-combustible/tipo-combustible.component";
import { AddTipoCombustibleComponent } from "./tipo-combustible/add-tipo-combustible/add-tipo-combustible.component";
import { WhatsappPropiosComponent } from "./whatsapp-propios/whatsapp-propios.component";
import { AddOperadorChatComponent } from "./whatsapp-propios/add-operador-chat/add-operador-chat.component";
import { WhatsappClientesComponent } from "./whatsapp-clientes/whatsapp-clientes.component";
import { AuditoriaCentroComponent } from "./auditoria-centro/auditoria-centro.component";
import { ErrorLogCentroComponent } from "./auditoria-centro/errorlog-centro.component";
import { AddOperadorClienteChatComponent } from "./whatsapp-clientes/add-operador-cliente-chat/add-operador-cliente-chat.component";
import { ListaViajesRechazadosComponent } from './lista-viajes-rechazados/lista-viajes-rechazados.component';
import { ListaTurneadaComponent } from './lista-turneada/lista-turneada.component';
import { AddListaComponent } from './lista-turneada/add-lista/add-lista.component';
import { ListaChoferesComponent } from './lista-turneada/lista-choferes/lista-choferes.component';
import { ListaChoferesEstadosComponent } from './lista-choferes-estados/lista-choferes-estados.component';
import { AddEstadosChoferComponent } from './lista-choferes-estados/add-estados-chofer/add-estados-chofer.component';
import { AddSancionViajesComponent } from './lista-choferes-estados/add-sancion-viajes/add-sancion-viajes.component';
import { ReporteTurneadasComponent } from './reporte-turneadas/reporte-turneadas.component';
import { MostrarLogsComponent } from './mostrar-logs/mostrar-logs.component';
import { InfoLogComponent } from './mostrar-logs/info-log/info-log.component';
import { ConfirmarArriboComponent } from './confirmar-arribo/confirmar-arribo.component';
import { TipoTurneadaComponent } from './tipo-turneada/tipo-turneada.component';
import { UsuarioWhatsappComponent } from './usuario-whatsapp/usuario-whatsapp.component';
import { AddUsuarioWhatsappComponent } from './usuario-whatsapp/add-usuario-whatsapp/add-usuario-whatsapp.component';
import { LogisticaComponent } from './logistica/logistica.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { StopComponent } from './stop/stop.component';
import { ProductosCentroComponent } from './productos-centro/productos-centro.component';
import { ConfigurarDadoresComponent } from './configurar-dadores/configurar-dadores.component';
import { LineaWhatsappComponent } from './linea-whatsapp/linea-whatsapp.component';
import { VincularCentroEmpresaComponent } from './vincular-centro-empresa/vincular-centro-empresa.component';
import { VincularEmpresaComponent } from './vincular-centro-empresa/vincular-empresa/vincular-empresa.component';
import { PlayasIntermediasComponent } from './playas-intermedias/playas-intermedias.component';
import { AddPlayaIntermediaComponent } from './playas-intermedias/add-playa-intermedia/add-playa-intermedia.component';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatAutocompleteModule,
    NgxDatatableModule,
    ChartsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    QuillModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatExpansionModule,
    MatTabsModule,
    MatTabsModule,
    MatMenuModule,
    MatRadioModule,
    MatNativeDateModule,
    MatToolbarModule,
    FlexLayoutModule,
    SharedModule,
    MatDialogModule,
    MatTableModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatPaginatorModule,
    NgxDatatableModule,
    MatSnackBarModule,
    AdminRoutingModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatStepperModule,
    MatListModule,
    CdkTableModule,
    HttpClientModule,
    PerfectScrollbarModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBKesIXvH_yWq7YhJoEZ8sh3snbHWWd3MM",
      libraries: ["places"]
    }),
    AgmJsMarkerClustererModule,
    NgPipesModule,
    NgArrayPipesModule
  ],
  declarations: [
    UsersComponent,
    RolesComponent,
    AddUserComponent,
    AddRolComponent,
    AddProductosComponent,
    AddPromocionesComponent,
    SubirImagenesComponent,
    GanadoresPromocionesComponent,
    PersonasComponent,
    BocasComponent,
    AddBocasComponent,
    AddOperadorChatComponent,
    ParametroChatComponent,
    AddParametroChatComponent,
    SubirImagenParametroComponent,
    RolesPersonaComponent,
    DestinosComponent,
    ChoferVencidoComponent,
    AddDestinoComponent,
    AddPlayaIntermediaComponent,
    EstadoPuertoComponent,
    SituacionPuertoComponent,
    VincularCentroClienteComponent,
    VincularClienteComponent,
    VincularCentroCorredorComponent,
    BajadaMasivaComponent,
    VincularCorredorComponent,
    ProductosComponent,
    PromocionesComponent,
    TipoDestinoComponent,
    AddTipoDestinoComponent,
    InteligenciaComponent,
    UsuarioComponent,
    AuditoriaComponent,
    AuditoriaMenuComponent,
    UsuarioLogComponent,
    ErrorLogMenuComponent,
    ErrorLogComponent,
    VincularCentroOperadorComponent,
    VincularOperadorComponent,
    NuevosProveedoresComponent,
    DesvioMotivoComponent,
    AddDesvioMotivoComponent,
    RazonRechazoComponent,
    AddRazonRechazoComponent,
    ZonaDestinoComponent,
    AddZonaDestinoComponent,
    DocumentoComponent,
    AddDocumentoComponent,
    ManualComponent,
    AddManualComponent,
    EstandarComponent,
    AddEstandarComponent,
    SubirEstandarComponent,
    SubirFicherosComponent,
    SubirManualComponent,
    ZonaChoferesLibresComponent,
    AddZonaChoferesLibresComponent,
    SituacionpuertoComponent,
    AddSituacionpuertoComponent,
    PaisComponent,
    AddPaisComponent,
    ProvinciaComponent,
    AddProvinciaComponent,
    LocalidadComponent,
    AddLocalidadComponent,
    OrigenesComponent,
    AddOrigenComponent,
    EquiposComponent,
    CamionComponent,
    AcopladoComponent,
    AddCamionComponent,
    VincularCentroTransporteComponent,
    AddGanadoresSorteoComponent,
    VincularTransporteComponent,
    ZonaCentroComponent,
    AddZonaCentroComponent,
    AsignacionZonaChoferComponent,
    AsignacionAliasChoferComponent,
    VincularTransporteChoferComponent,
    GanadoresSorteoComponent,
    VincularChoferComponent,
    AddAcopladoComponent,
    AddEquipoComponent,
    VincularEquipoComponent,
    ConsultasComponent,
    ResponderComponent,
    VariarKmComponent,
    VincularCentroIntermediarioComponent,
    VincularIntermediarioComponent,
    VincularCentroEntregadorComponent,
    MapaOficinaComponent,
    AddMapaOficinaComponent,
    MapaRadaresComponent,
    AddMapaRadaresComponent,
    MapaRutaComponent,
    AddMapaRutaComponent,
    MapaTalleresComponent,
    AddMapaTalleresComponent,
    VincularCentroDestinatarioComponent,
    VincularDestinatarioComponent,
    CamionDisponibleComponent,
    VincularZonaChoferComponent,
    VincularZonaComponent,
    DestinatarioComponent,
    EntregadorComponent,
    CorredorComponent,
    OperadorComponent,
    ChoferPerdidoComponent,
    ConcursoComponent,
    NoticiaComponent,
    SorteoComponent,
    AddConcursoComponent,
    EditVencimientoLicenciaComponent,
    SubirPdfConcursoComponent,
    AddNoticiaComponent,
    SubirImagenNoticiaComponent,
    ConfigurarMuvinComponent,
    AddSorteoComponent,
    SubirImagenSorteoComponent,
    TrabajadoresComponent,
    CentrosComponent,
    TipoIntervinientesDialog,
    FlotaIntermediarioComponent,
    MapaChoferLibreComponent,
    EstadisticaComponent,
    ListadoPedidosComponent,
    ListadoViajesComponent,
    AddListaNegraComponent,
    ListaNegraComponent,
    EditListaNegraComponent,
    AgregarChoferRucComponent,
    PorEvaluarComponent,
    MotivoListaNegraComponent,
    AddListaNegraMotivoComponent,
    ConfigurarCentroComponent,
    PerfilComponent,
    RankingsComponent,
    ListadoChoferesComponent,
    ListadoRechazadosComponent,
    ListadoDesviadosComponent,
    ProductosViajesComponent,
    DesactivarRolComponent,
    ReportCentrosComponent,
    BusquedaFlotaComponent,
    AddBusquedaFlotaComponent,
    GestionarBusquedaComponent,
    TipoCentrosComponent,
    MapaEstacionesComponent,
    ChoferesUnistallComponent,
    HojaRutaComponent,
    CamionAcopladoComponent,
    GestionarMotivosComponent,
    AddMotivoComponent,
    TipoCombustibleComponent,
    AddTipoCombustibleComponent,
    AddListaComponent,
    ListaChoferesComponent,
    WhatsappPropiosComponent,
    WhatsappClientesComponent,
    AuditoriaComponent,
    AuditoriaCentroComponent,
    ErrorLogCentroComponent,
    AddOperadorClienteChatComponent,
    ListaChoferesEstadosComponent,
    AddEstadosChoferComponent,
    ListaViajesRechazadosComponent,
    ListaTurneadaComponent,
    AddSancionViajesComponent,
    ReporteTurneadasComponent,
    MostrarLogsComponent,
    InfoLogComponent,
    ConfirmarArriboComponent,
    TipoTurneadaComponent,
    UsuarioWhatsappComponent,
    LogisticaComponent,
    NotificacionesComponent,
    StopComponent,
    ProductosCentroComponent,
    ConfigurarDadoresComponent,
    AddUsuarioWhatsappComponent,
    LineaWhatsappComponent,
    VincularCentroEmpresaComponent,
    VincularEmpresaComponent,
    PlayasIntermediasComponent,
    AddPlayaIntermediaComponent,
  ],
  entryComponents: [
    AddUserComponent,
    AddRolComponent,
    AddProductosComponent,
    AddPromocionesComponent,
    SubirImagenesComponent,
    RolesPersonaComponent,
    EditVencimientoLicenciaComponent,
    GanadoresPromocionesComponent,
    AddGanadoresSorteoComponent,
    AddDestinoComponent,
    AddPlayaIntermediaComponent,
    EstadoPuertoComponent,
    SituacionPuertoComponent,
    AddDesvioMotivoComponent,
    AddRazonRechazoComponent,
    AddUsuarioWhatsappComponent,
    GanadoresSorteoComponent,
    VincularOperadorComponent,
    VincularClienteComponent,
    AddTipoDestinoComponent,
    AddZonaDestinoComponent,
    AddDocumentoComponent,
    AddEstandarComponent,
    SubirEstandarComponent,
    AddManualComponent,
    SubirManualComponent,
    SubirFicherosComponent,
    AddZonaChoferesLibresComponent,
    AddLocalidadComponent,
    VincularCorredorComponent,
    AddOrigenComponent,
    AddCamionComponent,
    AddSituacionpuertoComponent,
    AddPaisComponent,
    AddMapaOficinaComponent,
    AddMapaRadaresComponent,
    AddMapaRutaComponent,
    AddMapaTalleresComponent,
    CamionDisponibleComponent,
    VincularTransporteComponent,
    AddZonaCentroComponent,
    AsignacionZonaChoferComponent,
    AddProvinciaComponent,
    AsignacionAliasChoferComponent,
    VincularChoferComponent,
    AddAcopladoComponent,
    AddEquipoComponent,
    ConcursoComponent,
    NoticiaComponent,
    SorteoComponent,
    AddConcursoComponent,
    SubirPdfConcursoComponent,
    AddNoticiaComponent,
    SubirImagenNoticiaComponent,
    AddSorteoComponent,
    SubirImagenSorteoComponent,
    AddConcursoComponent,
    SubirPdfConcursoComponent,
    AddNoticiaComponent,
    ListadoPedidosComponent,
    ListadoViajesComponent,
    SubirImagenNoticiaComponent,
    AddSorteoComponent,
    SubirImagenSorteoComponent,
    VincularEquipoComponent,
    ResponderComponent,
    VincularIntermediarioComponent,
    VariarKmComponent,
    VincularDestinatarioComponent,
    AddBocasComponent,
    AddOperadorChatComponent,
    AddParametroChatComponent,
    SubirImagenParametroComponent,
    VincularZonaComponent,
    AddListaNegraComponent,
    EditListaNegraComponent,
    AgregarChoferRucComponent,
    AddListaNegraMotivoComponent,
    PerfilComponent,
    ListadoChoferesComponent,
    ListadoRechazadosComponent,
    ListadoDesviadosComponent,
    ProductosViajesComponent,
    DesactivarRolComponent,
    AddBusquedaFlotaComponent,
    TipoCentrosComponent,
    ChoferesUnistallComponent,
    CamionAcopladoComponent,
    AddMotivoComponent,
    AddTipoCombustibleComponent,
    AddListaComponent,
    ListaChoferesComponent,
    AddOperadorClienteChatComponent,
    AddEstadosChoferComponent,
    AddSancionViajesComponent,
    InfoLogComponent,
    VincularEmpresaComponent,
    TipoIntervinientesDialog,

  ]
})
export class AdminModule { }
