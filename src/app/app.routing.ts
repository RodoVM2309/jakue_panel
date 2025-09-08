import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/services/auth/auth.guard';
import { TermAuthGuard } from './shared/services/auth/term-auth.guard';
import { DadorAuthGuard } from './shared/services/auth/dador-auth.guard';
import { AdminAuthGuard } from './shared/services/auth/admin-auth.guard';
import { CentroAuthGuard } from './shared/services/auth/centro-auth.guard';
import { TranspAuthGuard } from './shared/services/auth/transp-auth.guard';
import { DestinoAuthGuard } from './shared/services/auth/destino-auth.guard';
import { MagypAuthGuard } from './shared/services/auth/magyp-auth.guard';
import { MtrAuthGuard } from './shared/services/auth/mtr-auth.guard';
import { FertilizantesAuthGuard } from './shared/services/auth/fertilizantes-auth.guard';
import { TermsAndConditionsComponent } from '../app/views/sessions/terms-and-conditions/terms-and-conditions.component'
import { PoliticaDePrivacidadComponent } from '../app/views/politica-de-privacidad/politica-de-privacidad.component'


export const rootRouterConfig: Routes = [
  {
    path: '',
    redirectTo: 'sessions/signin',
    pathMatch: 'full'
  },
  {
    path: 'politicadeprivacidad',
    component: PoliticaDePrivacidadComponent,
    data: { title: 'Política de Privacidad' }
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent,
    canActivate: [AuthGuard],
    data: { title: 'Terminos y condiciones' }
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: './views/sessions/sessions.module#SessionsModule',
        data: { title: 'Session' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [TermAuthGuard],
    children: [
      {
        path: 'panel-pedido',
        loadChildren: './shared/components/home/home.module#HomeModule',
        data: { title: 'PANEL PEDIDO', breadcrumb: 'PANEL PEDIDO' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: 'admin',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Administracion', breadcrumb: 'Administracion' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [CentroAuthGuard],
    children: [
      {
        path: 'centro',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Administracion', breadcrumb: 'Administracion' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'destinatario',
        loadChildren: './views/destinatario/destinatario.module#DestinatarioModule',
        data: { title: 'Destinatario', breadcrumb: 'Destinatario' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [DadorAuthGuard],
    children: [
      {
        path: 'dador',
        loadChildren: './views/dador/dador.module#DadorModule',
        data: { title: 'Mis centros', breadcrumb: 'MIS CENTROS' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule',
        data: { title: 'Dashboard', breadcrumb: 'DASHBOARD' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'cupo',
        loadChildren: './shared/components/cupo/cupo.module#CupoModule',
        data: { title: 'Cupo', breadcrumb: 'cupo' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'others',
        loadChildren: './views/others/others.module#OthersModule',
        data: { title: 'Others', breadcrumb: 'OTHERS' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'marketing',
        loadChildren: './views/marketing/marketing.module#MarketingModule',
        data: { title: 'Marketing', breadcrumb: 'Marketing' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [DestinoAuthGuard, TermAuthGuard],
    children: [
      {
        path: 'destino',
        loadChildren: './views/destino/destino.module#DestinoModule',
        data: { title: 'Destino', breadcrumb: 'Destino' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'combustible',
        loadChildren: './shared/components/combustible/combustible.module#CombustibleModule',
        data: { title: 'Combustible', breadcrumb: 'combustible' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'documentacion',
        loadChildren: './shared/components/documentos/documentos.module#DocumentosModule',
        data: { title: 'Documentos', breadcrumb: 'documentos' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [FertilizantesAuthGuard, TermAuthGuard],
    children: [
      {
        path: 'fertilizante',
        loadChildren: './views/fertilizante/fertilizante.module#FertilizanteModule',
        data: { title: 'fertilizantes', breadcrumb: 'Fertilizantes' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [MagypAuthGuard, TermAuthGuard],
    children: [
      {
        path: 'magyp',
        loadChildren: './views/magyp/magyp.module#MagypModule',
        data: { title: 'Magyp', breadcrumb: 'MAGyP' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [MtrAuthGuard, TermAuthGuard],
    children: [
      {
        path: 'mtr',
        loadChildren: './views/mtr/mtr.module#MtrModule',
        data: { title: 'Mtr', breadcrumb: 'MTR' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [CentroAuthGuard, TermAuthGuard],
    children: [
      {
        path: 'ccpp',
        loadChildren: './views/ccpp/ccpp.module#CcppModule',
        data: { title: 'CCPP', breadcrumb: 'CCPP' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'turneada',
        loadChildren: './shared/components/turneada/turneada.module#TurneadaModule',
        data: { title: 'Turneada', breadcrumb: 'turneada' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'vincular-centro-cliente',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Vincular centro-cliente', breadcrumb: 'VINCULAR CENTRO-CLIENTE' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'vincular-centro-empresa',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Vincular centro-empresa', breadcrumb: 'VINCULAR CENTRO-EMPRESA' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'vincular-centro-intermediario',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Vincular centro-intermediario', breadcrumb: 'VINCULAR CENTRO-INTERMEDIARIO' }
      }
    ]
  },

  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'vincular-centro-corredor',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Vincular centro-corredor', breadcrumb: 'VINCULAR CENTRO-CORREDOR' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'vincular-centro-operador',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Vincular centro-operador', breadcrumb: 'VINCULAR CENTRO-OPERADOR' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'vincular-centro-transporte',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Vincular centro-transporte', breadcrumb: 'VINCULAR CENTRO-TRANSPORTE' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'vincular-centro-intermediario',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Vincular centro-intermediario', breadcrumb: 'VINCULAR CENTRO-INTERMEDIARIO' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'vincular-centro-entregador',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Vincular centro-entregador', breadcrumb: 'VINCULAR CENTRO-ENTREGADOR' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'vincular-centro-destinatario',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Vincular centro-destinatario', breadcrumb: 'VINCULAR CENTRO-DESTINATARIO' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'bajada-masiva',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Bajada Masiva', breadcrumb: 'BAJADA MASIVA' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'nuevos-proveedores',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Nuevos proveedores', breadcrumb: 'NUEVOS PROVEEDORES' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'vincular-transporte-chofer',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Vincular transporte-chofer', breadcrumb: 'VINCULAR TRANSPORTE-CHOFER' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'vincular-zona-chofer',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Vincular zona-chofer', breadcrumb: 'VINCULAR ZONA-CHOFER' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'estadoDescarga/:id',
        loadChildren: './shared/components/home/estado-descarga/estado-descarga.module#EstadoDescargaModule',
        data: { title: 'estadoDescarga', breadcrumb: 'Estado de las descarga' }
      }
    ]
  },

  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminAuthGuard, TermAuthGuard],
    children: [
      {
        path: 'admin/camiones/marcaCamion',
        loadChildren: './views/layout/marca-camion/marca-camion.module#MarcaCamionModule',
        data: { title: 'Marca Camion', breadcrumb: 'Marca Camión' }
      }
    ]
  }, {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminAuthGuard, TermAuthGuard],
    children: [
      {
        path: 'admin/acoplados/marcaAcoplado',
        loadChildren: './views/layout/marca-acoplado/marca-acoplado.module#MarcaAcopladoModule',
        data: { title: 'Marca Acoplados', breadcrumb: 'Marca Acoplado' }
      }
    ]
  }, {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminAuthGuard, TermAuthGuard],
    children: [
      {
        path: 'admin/camiones/tipoCamion',
        loadChildren: './views/layout/tipo-camion/tipo-camion.module#TipoCamionModule',
        data: { title: 'Tipo Camion', breadcrumb: 'Tipo Camión' }
      }
    ]
  }, {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminAuthGuard, TermAuthGuard],
    children: [
      {
        path: 'admin/acoplados/tipoAcoplado',
        loadChildren: './views/layout/tipo-acoplado/tipo-acoplado.module#TipoAcopladoModule',
        data: { title: 'Tipos Acoplados', breadcrumb: 'Tipo Acoplados' }
      }
    ]
  },


  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [TranspAuthGuard, TermAuthGuard],
    children: [
      {
        path: 'transportista',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Administracion', breadcrumb: 'Administracion' }
      }
    ]
  },

  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'corredor',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Corredor', breadcrumb: 'Corredor' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'entregador',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Entregador', breadcrumb: 'Entregador' }
      }
    ]
  },

  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'chofer-libre',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Chofer Libre', breadcrumb: 'Chofer Libre' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, TermAuthGuard],
    children: [
      {
        path: 'chofer-perdido',
        loadChildren: './views/admin/admin.module#AdminModule',
        data: { title: 'Chofer Perdido', breadcrumb: 'Chofer Perdido' }
      }
    ]
  },
];

