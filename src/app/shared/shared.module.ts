import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";

import { AgmCoreModule } from "@agm/core";
import { AgmDirectionModule } from "agm-direction";
// ONLY REQUIRED FOR **SIDE** NAVIGATION LAYOUT
import { HeaderSideComponent } from "./components/header-side/header-side.component";
import { SidebarSideComponent } from "./components/sidebar-side/sidebar-side.component";

// ONLY REQUIRED FOR **TOP** NAVIGATION LAYOUT
import { HeaderTopComponent } from "./components/header-top/header-top.component";
import { SidebarTopComponent } from "./components/sidebar-top/sidebar-top.component";

import { InfoPersonaComponent } from "../views/admin/personas/info-persona/info-persona.component";
// ALL TIME REQUIRED
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { CustomizerComponent } from "./components/customizer/customizer.component";
import { DataTablePagerComponent } from "./components/datatable-pager/datatable-pager.component";
import { HeaderMenuComponent } from "./components/header-menu/header-menu.component";
import { AdminLayoutComponent } from "./components/layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./components/layouts/auth-layout/auth-layout.component";
import { NotificationsComponent } from "./components/notifications/notifications.component";
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { AppComfirmComponent } from "./services/app-confirm/app-confirm.component";
import { AppLoaderComponent } from "./services/app-loader/app-loader.component";

// DIRECTIVES
import { DropdownAnchorDirective } from "./directives/dropdown-anchor.directive";
import { DropdownLinkDirective } from "./directives/dropdown-link.directive";
import { AppDropdownDirective } from "./directives/dropdown.directive";
import { EgretSideNavToggleDirective } from "./directives/egret-side-nav-toggle.directive";
import { FontSizeDirective } from "./directives/font-size.directive";
import { ScrollToDirective } from "./directives/scroll-to.directive";

// PIPES
import { AuthImagePipe } from './pipes/auth-image.pipe';
import { ExcerptPipe } from "./pipes/excerpt.pipe";
import { GetValueByKeyPipe } from "./pipes/get-value-by-key.pipe";
import { RelativeTimePipe } from "./pipes/relative-time.pipe";

import { DistanciaPipe } from "./pipes/distancia.pipe";

// SERVICES
import { AppAlertComponent } from "./services/app-alert/app-alert.component";
import { AppAlertService } from "./services/app-alert/app-alert.service";
import { AppAtencionComponent } from "./services/app-atencion/app-atencion.component";
import { AppAtencionService } from "./services/app-atencion/app-atencion.service";
import { AppConfirmService } from "./services/app-confirm/app-confirm.service";
import { AppErrorComponent } from "./services/app-error/app-error.component";
import { AppErrorService } from "./services/app-error/app-error.service";
import { AppLoaderService } from "./services/app-loader/app-loader.service";
import { AdminAuthGuard } from "./services/auth/admin-auth.guard";
import { AuthGuard } from "./services/auth/auth.guard";
import { CentroAuthGuard } from "./services/auth/centro-auth.guard";
import { TermAuthGuard } from "./services/auth/term-auth.guard";
import { TranspAuthGuard } from "./services/auth/transp-auth.guard";
import { LayoutService } from "./services/layout.service";
import { NavigationService } from "./services/navigation.service";
import { RoutePartsService } from "./services/route-parts.service";
import { ThemeService } from "./services/theme.service";
//import { HomeComponent} from './components/home/home.component';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { CentroAdministraCuposComponent } from "app/shared/components/cupo/add-cupos-solicitados/centro-administra-cupos/centro-administra-cupos.component";
import { SubirLogoCentroComponent } from "app/views/admin/centros/subir-logo-centro/subir-logo-centro.component";
import { AddPersonaComponent } from "app/views/admin/personas/add-persona/add-persona.component";
import { VincularEntregadorComponent } from "app/views/admin/vincular-centro-entregador/vincular-entregador/vincular-entregador.component";
import { VerCabeceraComponent } from "app/views/ccpp/cabecera/ver-cabecera/ver-cabecera.component";
import { DetalleCuposComponent } from 'app/views/fertilizante/panel-reservas/detalle-cupos/detalle-cupos.component';
import { AddCuposSolicitadosComponent } from "../shared/components/cupo/add-cupos-solicitados/add-cupos-solicitados.component";
import { AddPedidoRapidoComponent } from "../shared/components/cupo/add-pedido-rapido/add-pedido-rapido.component";
import { ConfeccionCCPPComponent } from "../shared/components/cupo/confeccion-ccpp/confeccion-ccpp.component";
import { AddPedidoCortoComponent } from "../shared/components/home/add-pedido-corto/add-pedido-corto.component";
import { AddPedidoRetornoComponent } from "../shared/components/home/add-pedido-retorno/add-pedido-retorno.component";
import { AddPedidoComponent } from "../shared/components/home/add-pedido/add-pedido.component";
import { CondicionesViajeComponent } from "../shared/components/home/condiciones-viaje/condiciones-viaje.component";
import { ExperienciaAcotadaComponent } from "../shared/components/home/experiencia-acotada/experiencia-acotada.component";
import { PerfilComponent } from "../shared/components/home/perfil/perfil.component";
import { EvaluarComponent } from "../shared/components/home/por-evaluar/evaluar/evaluar.component";
import { InfoPedidoComponent } from "../shared/components/home/por-evaluar/info-pedido/info-pedido.component";
import { AddCabeceraComponent } from '../views/ccpp/cabecera/add-cabecera/add-cabecera.component';
import { VerCcppComponent } from '../views/ccpp/consulta/ver-ccpp/ver-ccpp.component';
import { DerivarReservaComponent } from "./components/derivar-reserva/derivar-reserva.component";
import { FooterSocketComponent } from './components/footer-socket/footer-socket.component';
import { AddSmsComponent } from "./components/home/asignar-viaje/add-sms/add-sms.component";
import { ListaChoferesComponent } from './components/home/lista-choferes/lista-choferes.component';
import { SeleccionarPedidoComponent } from "./components/home/seleccionar-pedido/seleccionar-pedido.component";

import { AddChoferComponent } from "@app/views/admin/personas/add-chofer/add-chofer.component";
import { AddCuposSolicitadosV2Component } from "./components/cupo/add-cupos-solicitados-v2/add-cupos-solicitados-v2.component";
import { EditPhoneComponent } from "./components/cupo/add-pedido-rapido/editPhone/editPhone.component";
import { AddSolicitudesC3Component } from './components/cupo/cupera3/add-solicitudes-c3/add-solicitudes-c3.component';
import { EditPatenteComponent } from "./components/cupo/edit-patente/edit-patente.component";
import { ListaChoferComponent } from "./components/home/add-pedido-fertilizantes/lista-chofer/lista-chofer.component";
import { rucValidatorDirective } from "./directives/rucValidator.directive";
import { SharedMaterialModule } from "./shared-material.module";


const classesToInclude = [
  HeaderTopComponent,
  SidebarTopComponent,
  SidenavComponent,
  NotificationsComponent,
  SidebarSideComponent,
  HeaderSideComponent,
  AdminLayoutComponent,
  AuthLayoutComponent,
  BreadcrumbComponent,
  DataTablePagerComponent,
  AppComfirmComponent,
  AppAlertComponent,
  AppErrorComponent,
  AppAtencionComponent,
  AppLoaderComponent,
  CustomizerComponent,
  DataTablePagerComponent,
  HeaderMenuComponent,
  FontSizeDirective,
  ScrollToDirective,
  AppDropdownDirective,
  DropdownAnchorDirective,
  DropdownLinkDirective,
  EgretSideNavToggleDirective,
  RelativeTimePipe,
  ExcerptPipe,
  GetValueByKeyPipe,
  AuthImagePipe,
  DistanciaPipe,
  rucValidatorDirective,
  ListaChoferComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    NgxDatatableModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    AgmCoreModule,
    AgmDirectionModule,
    SharedMaterialModule,
  ],
  entryComponents: [
    AppComfirmComponent,
    AppLoaderComponent,
    AppAlertComponent,
    AddSmsComponent,
    CondicionesViajeComponent,
    AppErrorComponent,
    AppAtencionComponent,
    AddCuposSolicitadosComponent,
    InfoPersonaComponent,
    EvaluarComponent,
    InfoPedidoComponent,
    PerfilComponent,
    SubirLogoCentroComponent,
    AddPedidoComponent,
    AddPedidoRetornoComponent,
    AddPedidoCortoComponent,
    AddPersonaComponent,
    AddPedidoRapidoComponent,
    EditPatenteComponent,
    ConfeccionCCPPComponent,
    SeleccionarPedidoComponent,
    VincularEntregadorComponent,
    ExperienciaAcotadaComponent,
    CentroAdministraCuposComponent,
    ListaChoferesComponent,
    AddCabeceraComponent,
    VerCcppComponent,
    VerCabeceraComponent,
    DetalleCuposComponent,
    DerivarReservaComponent,
    ListaChoferComponent,
    AddSolicitudesC3Component,
    AddCuposSolicitadosV2Component,
    AddChoferComponent,
    EditPhoneComponent
  ],
  providers: [
    ThemeService,
    LayoutService,
    NavigationService,
    RoutePartsService,
    AuthGuard,
    TermAuthGuard,
    AdminAuthGuard,
    TranspAuthGuard,
    CentroAuthGuard,
    AppConfirmService,
    AppLoaderService,
    AppAlertService,
    AppErrorService,
    AppAtencionService
    // LandingPageService
  ],
  declarations: [
    classesToInclude,
    InfoPersonaComponent,
    AddSmsComponent,
    EvaluarComponent,
    InfoPedidoComponent,
    PerfilComponent,
    AddPedidoComponent,
    AddPedidoRetornoComponent,
    AddPedidoCortoComponent,
    AddPersonaComponent,
    SubirLogoCentroComponent,
    AddCuposSolicitadosComponent,
    CondicionesViajeComponent,
    SeleccionarPedidoComponent,
    AddPedidoRapidoComponent,
    ConfeccionCCPPComponent,
    VincularEntregadorComponent,
    ExperienciaAcotadaComponent,
    CentroAdministraCuposComponent,
    ListaChoferesComponent,
    FooterSocketComponent,
    AuthImagePipe,
    AddCabeceraComponent,
    VerCcppComponent,
    VerCabeceraComponent,
    AddCuposSolicitadosV2Component,
    DetalleCuposComponent,
    DerivarReservaComponent,
    AddSolicitudesC3Component,
    AddCuposSolicitadosV2Component,
    AddChoferComponent,
    EditPatenteComponent,
    EditPhoneComponent
  ],
  exports: classesToInclude
})
export class SharedModule { }
