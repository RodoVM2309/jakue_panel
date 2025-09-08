import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/users/users.component';
import { RolesComponent } from './roles/roles.component';
import { PersonasComponent } from './personas/personas.component';
import { DestinosComponent } from './destinos/destinos.component';
import { PlayasIntermediasComponent } from './playas-intermedias/playas-intermedias.component';
import { EstadoPuertoComponent } from './estado-puerto/estado-puerto.component';
import { VincularCentroClienteComponent } from './vincular-centro-cliente/vincular-centro-cliente.component';
import { VincularCentroCorredorComponent } from './vincular-centro-corredor/vincular-centro-corredor.component';
import { VincularCentroOperadorComponent } from './vincular-centro-operador/vincular-centro-operador.component';
import { ProductosComponent } from './productos/productos.component';
import { PromocionesComponent } from './promociones/promociones.component';
import { TipoDestinoComponent } from './tipo-destino/tipo-destino.component';
import { DesvioMotivoComponent } from './desvio-motivo/desvio-motivo.component';
import { MotivoListaNegraComponent } from './motivo-lista-negra/motivo-lista-negra.component';
import { RazonRechazoComponent } from './razon-rechazo/razon-rechazo.component';
import { ZonaDestinoComponent } from './zona-destino/zona-destino.component';
import { MapaOficinaComponent } from './mapa-oficina/mapa-oficina.component';
import { MapaRadaresComponent } from './mapa-radares/mapa-radares.component';
import { BocasComponent } from './bocas/bocas.component';
import { ParametroChatComponent } from './parametro-chat/parametro-chat.component';
import { MapaEstacionesComponent } from './mapa-estaciones/mapa-estaciones.component';
import { MapaRutaComponent } from './mapa-ruta/mapa-ruta.component';
import { MapaTalleresComponent } from './mapa-talleres/mapa-talleres.component';
import { DocumentoComponent } from './documento/documento.component';
import { ManualComponent } from './manual/manual.component';
import { EstandarComponent } from './estandar/estandar.component';
import { ZonaChoferesLibresComponent } from './zona-choferes-libres/zona-choferes-libres.component';
import { SituacionpuertoComponent } from './situacionpuerto/situacionpuerto.component';
import { PaisComponent } from './pais/pais.component';
import { OrigenesComponent } from './origenes/origenes.component';
import { ProvinciaComponent } from './provincia/provincia.component';
import { LocalidadComponent } from './localidad/localidad.component';
import { EquiposComponent } from './equipos/equipos.component';
import { CamionComponent } from './camion/camion.component';
import { AcopladoComponent } from './acoplado/acoplado.component';
import { VincularCentroTransporteComponent } from './vincular-centro-transporte/vincular-centro-transporte.component';
import { VincularTransporteChoferComponent } from './vincular-transporte-chofer/vincular-transporte-chofer.component';
import { ZonaCentroComponent } from './zona-centro/zona-centro.component';
import { ConsultasComponent } from './consultas/consultas.component';
import { VincularCentroEntregadorComponent } from './vincular-centro-entregador/vincular-centro-entregador.component';
import { VincularCentroEmpresaComponent } from './vincular-centro-empresa/vincular-centro-empresa.component';
import { VincularCentroDestinatarioComponent } from './vincular-centro-destinatario/vincular-centro-destinatario.component';
import { BajadaMasivaComponent } from './bajada-masiva/bajada-masiva.component';
import { VincularCentroIntermediarioComponent } from './vincular-centro-intermediario/vincular-centro-intermediario.component';
import { VincularZonaChoferComponent } from './vincular-zona-chofer/vincular-zona-chofer.component';
import { DestinatarioComponent } from './destinatario/destinatario.component';
import { CorredorComponent } from './corredor/corredor.component';
import { OperadorComponent } from './operador/operador.component';
import { CentrosComponent } from './centros/centros.component';
import { EntregadorComponent } from './entregador/entregador.component';
import { ChoferPerdidoComponent } from './chofer-perdido/chofer-perdido.component';
import { TrabajadoresComponent } from './trabajadores/trabajadores.component';
import { ChoferVencidoComponent } from './chofer-vencido/chofer-vencido.component';
import { FlotaIntermediarioComponent } from './../../shared/components/home/flota-intermediario/flota-intermediario.component';
import { PorEvaluarComponent } from './../../shared/components/home/por-evaluar/por-evaluar.component';
import { MapaChoferLibreComponent } from './mapa-chofer-libre/mapa-chofer-libre.component';
import { InteligenciaComponent } from './inteligencia/inteligencia.component';
//import { AuditoriaComponent } from './auditoria/auditoria.component';
import { UsuarioComponent } from './auditoria/usuario.component';
import { UsuarioLogComponent } from './auditoria/usuariolog.component';
import { EstadisticaComponent } from './estadistica/estadistica.component';
import { ListaNegraComponent } from './lista-negra/lista-negra.component';
import { ConfigurarCentroComponent } from './configurar-centro/configurar-centro.component';
import { ConfigurarMuvinComponent } from './configurar-muvin/configurar-muvin.component';
import { ConcursoComponent } from './concurso/concurso.component';
import { NoticiaComponent } from './noticia/noticia.component';
import { SorteoComponent } from './sorteo/sorteo.component';
import { RankingsComponent } from './rankings/rankings.component';
import { ReportCentrosComponent } from './reportes/report-centros/report-centros.component';
import { NuevosProveedoresComponent } from './nuevos-proveedores/nuevos-proveedores.component';
import { BusquedaFlotaComponent } from './busqueda-flota/busqueda-flota.component';
import { GestionarBusquedaComponent } from './busqueda-flota/gestionar-busqueda/gestionar-busqueda.component';
import { ChoferesUnistallComponent } from './choferes-uninstall/choferes-uninstall.component';
import { HojaRutaComponent } from './hoja-ruta/hoja-ruta.component';
import { GestionarMotivosComponent } from './gestionar-motivos/gestionar-motivos.component'
import { TipoCombustibleComponent } from './tipo-combustible/tipo-combustible.component';
import { WhatsappPropiosComponent } from './whatsapp-propios/whatsapp-propios.component';
import { WhatsappClientesComponent } from './whatsapp-clientes/whatsapp-clientes.component';
import { AuditoriaMenuComponent } from './auditoria-centro/auditoria-menu.component';
//import { AuditoriaCentroComponent } from './auditoria-centro/auditoria-centro.component';
//import { ErrorLogCentroComponent } from './auditoria-centro/errorlog-centro';
//import { ErrorLogMenuComponent } from './auditoria-centro/errorlog-menu.component';
import { ErrorLogMenuComponent } from './auditoria/errorlog-menu.component';
import { ListaViajesRechazadosComponent } from './lista-viajes-rechazados/lista-viajes-rechazados.component';
import { ListaTurneadaComponent } from './lista-turneada/lista-turneada.component';
import { ListaChoferesEstadosComponent } from './lista-choferes-estados/lista-choferes-estados.component';
import { ReporteTurneadasComponent } from './reporte-turneadas/reporte-turneadas.component';
import { MostrarLogsComponent } from './mostrar-logs/mostrar-logs.component';
import { ConfirmarArriboComponent } from './confirmar-arribo/confirmar-arribo.component';
import { TipoTurneadaComponent } from './tipo-turneada/tipo-turneada.component';
import { UsuarioWhatsappComponent } from './usuario-whatsapp/usuario-whatsapp.component';
import { LogisticaComponent } from './logistica/logistica.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { StopComponent } from './stop/stop.component';
import { ProductosCentroComponent } from './productos-centro/productos-centro.component';
import { ConfigurarDadoresComponent } from './configurar-dadores/configurar-dadores.component';
import { LineaWhatsappComponent } from './linea-whatsapp/linea-whatsapp.component';

const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'users',
      component: UsersComponent,
      data: { title: 'Usuarios', breadcrumb: 'USUARIOS' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'pais',
      component: PaisComponent,
      data: { title: 'Pais', breadcrumb: 'PAIS' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'provincia',
      component: ProvinciaComponent,
      data: { title: 'Provincias', breadcrumb: 'PROVINCIAS' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'consulta/:id_chofer',
      component: ConsultasComponent,
      data: { title: 'Consultas', breadcrumb: 'CONSULTAS' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'roles',
      component: RolesComponent,
      data: { title: 'Roles', breadcrumb: 'ROLES' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'personas',
      component: PersonasComponent,
      data: { title: 'Personas', breadcrumb: 'PERSONAS' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'origenes',
      component: OrigenesComponent,
      data: { title: 'Origenes', breadcrumb: 'ORIGENES' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'destinos',
      component: DestinosComponent,
      data: { title: 'Destinos', breadcrumb: 'DESTINOS' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'playas-intermedias',
      component: PlayasIntermediasComponent,
      data: { title: 'Playas intermedias', breadcrumb: 'PLAYAS INTERMEDIAS' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'centros',
      component: CentrosComponent,
      data: { title: 'Centros', breadcrumb: 'CENTROS' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'inteligencia',
      component: InteligenciaComponent,
      data: { title: 'Inteligencia Logística', breadcrumb: 'INTELIGENCIA LOGISTICA' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'auditoria',
      component: UsuarioComponent,
      data: { title: 'Auditoria Interna', breadcrumb: 'AUDITORIA INTERNA' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'errorlog',
      component: UsuarioLogComponent,
      data: { title: 'Error Log', breadcrumb: 'ERROR LOG' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'estado-puerto',
      component: EstadoPuertoComponent,
      data: { title: 'Estado del puerto', breadcrumb: 'ESTADO PUERTO' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'vincular-centro-cliente',
      component: VincularCentroClienteComponent,
      data: { title: 'Vincular centro-cliente', breadcrumb: 'VINCULAR CENTRO-CLIENTE' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'vincular-centro-corredor',
      component: VincularCentroCorredorComponent,
      data: { title: 'Vincular centro-corredor', breadcrumb: 'VINCULAR CENTRO-CORREDOR' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'vincular-centro-operador',
      component: VincularCentroOperadorComponent,
      data: { title: 'Vincular centro-operador', breadcrumb: 'VINCULAR CENTRO-OPERADOR' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'vincular-centro-transporte',
      component: VincularCentroTransporteComponent,
      data: { title: 'Vincular centro-transporte', breadcrumb: 'VINCULAR CENTRO-TRANSPORTE' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'vincular-transporte-chofer',
      component: VincularTransporteChoferComponent,
      data: { title: 'Vincular transporte-chofer', breadcrumb: 'VINCULAR TRANSPORTE-CHOFER' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'flota-intermediario',
      component: FlotaIntermediarioComponent,
      data: { title: 'Flota-Intermediario', breadcrumb: 'Flota-Intermediario' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'por-evaluar',
      component: PorEvaluarComponent,
      data: { title: 'Choferes por evaluar', breadcrumb: 'POR-EVALUAR' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'vincular-centro-destinatario',
      component: VincularCentroDestinatarioComponent,
      data: { title: 'Vincular centro-destinatario', breadcrumb: 'VINCULAR CENTRO-DESTINATARIO' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'vincular-centro-entregador',
      component: VincularCentroEntregadorComponent,
      data: { title: 'Vincular centro-entregador', breadcrumb: 'VINCULAR CENTRO-ENTREGADOR' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'vincular-centro-empresa',
      component: VincularCentroEmpresaComponent,
      data: { title: 'Vincular centro-empresa', breadcrumb: 'VINCULAR CENTRO-EMPRESA' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'vincular-zona-chofer',
      component: VincularZonaChoferComponent,
      data: { title: 'Vincular zona-chofer', breadcrumb: 'VINCULAR ZONA-CHOFER' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'bajada-masiva',
      component: BajadaMasivaComponent,
      data: { title: 'Bajada Masiva', breadcrumb: 'BAJADA MASIVA' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'nuevos-proveedores',
      component: NuevosProveedoresComponent,
      data: { title: 'Nuevos-proveedores', breadcrumb: 'NUEVOS PROVEEDORES' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'hoja-ruta',
      component: HojaRutaComponent,
      data: { title: 'Hoja de Ruta', breadcrumb: 'HOJA DE RUTA' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'busqueda-flota',
      component: BusquedaFlotaComponent,
      data: { title: 'Busqueda Flota', breadcrumb: 'BUSQUEDA DE FLOTA' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'gestionarBusqueda/:id',
      component: GestionarBusquedaComponent,
      data: { title: 'Gestionar Busqueda Flota', breadcrumb: 'GESTIONAR BUSQUEDA DE FLOTA' }
    }]
  },

  {
    path: '',
    children: [{
      path: 'destinatario',
      component: DestinatarioComponent,
      data: { title: 'Destinatario', breadcrumb: 'DESTINATARIO' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'corredor',
      component: CorredorComponent,
      data: { title: 'Corredor', breadcrumb: 'CORREDOR' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'entregador',
      component: EntregadorComponent,
      data: { title: 'Entregador', breadcrumb: 'ENTREGADOR' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'operador',
      component: OperadorComponent,
      data: { title: 'Operador', breadcrumb: 'OPERADOR' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'mapa-chofer-libre',
      component: MapaChoferLibreComponent,
      data: { title: 'Mapa Chofer Libre', breadcrumb: 'MAPA CHOFER LIBRE' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'chofer-perdido',
      component: ChoferPerdidoComponent,
      data: { title: 'Chofer Perdido', breadcrumb: 'CHOFER PERDIDO' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'zona-centro',
      component: ZonaCentroComponent,
      data: { title: 'Zonas', breadcrumb: 'ZONAS' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'choferes-unistall',
      component: ChoferesUnistallComponent,
      data: { title: 'Choferes no activos', breadcrumb: 'Choferes no activos' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'productos',
      component: ProductosComponent,
      data: { title: 'Administrar Productos ', breadcrumb: 'PRODUCTOS' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'combustible',
      component: TipoCombustibleComponent,
      data: { title: 'Administrar Combustible ', breadcrumb: 'COMBUSTIBLE' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'promociones',
      component: PromocionesComponent,
      data: { title: 'Administrar Promociones ', breadcrumb: 'PROMOCIONES' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'tipo-destino',
      component: TipoDestinoComponent,
      data: { title: 'Administrar Tipos Destino ', breadcrumb: 'TIPO DESTINO' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'desvio-motivo',
      component: DesvioMotivoComponent,
      data: { title: 'Administrar Motivos de desvio ', breadcrumb: 'MOTIVOS DESVIO' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'motivo-lista-negra',
      component: MotivoListaNegraComponent,
      data: { title: 'Administrar Motivos de Lista Negra ', breadcrumb: 'MOTIVOS LISTA NEGRA' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'razon-rechazo',
      component: RazonRechazoComponent,
      data: { title: 'Administrar Razon Rechazo ', breadcrumb: 'RAZON RECHAZO' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'manual',
      component: ManualComponent,
      data: { title: 'Administrar manuales ', breadcrumb: 'MANUAL' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'documento',
      component: DocumentoComponent,
      data: { title: 'Administrar documentos ', breadcrumb: 'DOCUMENTO' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'estandar',
      component: EstandarComponent,
      data: { title: 'Administrar estandares ', breadcrumb: 'ESTANDAR' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'mapa-radares',
      component: MapaRadaresComponent,
      data: { title: 'Administrar Mapa Radares ', breadcrumb: 'MAPA RADARES' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'mapa-talleres',
      component: MapaTalleresComponent,
      data: { title: 'Administrar Mapa Talleres ', breadcrumb: 'MAPA TALLERES' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'mapa-ruta',
      component: MapaRutaComponent,
      data: { title: 'Administrar Mapa Oficina Rutas ', breadcrumb: 'MAPA RUTA' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'boca',
      component: BocasComponent,
      data: { title: 'Administrar Bocas ', breadcrumb: 'BOCA' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'parametro-chat',
      component: ParametroChatComponent,
      data: { title: 'Administrar Parámetros del chat ', breadcrumb: 'PARAMETROCHAT' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'mapa-estaciones',
      component: MapaEstacionesComponent,
      data: { title: 'Mapa estaciones ', breadcrumb: 'MAPA ESTACIONES' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'mapa-oficina',
      component: MapaOficinaComponent,
      data: { title: 'Administrar Mapa Oficina Lnh', breadcrumb: 'MAPA OFICINA' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'zona-destino',
      component: ZonaDestinoComponent,
      data: { title: 'Administrar zonas destino ', breadcrumb: 'ZONAS DESTINO' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'zona-choferes-libres',
      component: ZonaChoferesLibresComponent,
      data: { title: 'Administrar zonas choferes libres ', breadcrumb: 'ZONAS CHOFERES LIBRES' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'situacionpuerto',
      component: SituacionpuertoComponent,
      data: { title: 'Administrar Situacion puerto ', breadcrumb: 'SITUACION PUERTO' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'equipos',
      component: EquiposComponent,
      data: { title: 'Administrar Equipos ', breadcrumb: 'EQUIPOS' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'camiones',
      component: CamionComponent,
      data: { title: 'Camion', breadcrumb: 'Camion' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'acoplados',
      component: AcopladoComponent,
      data: { title: 'Administrar Acoplados ', breadcrumb: 'Acoplados' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'vincular-centro-intermediario',
      component: VincularCentroIntermediarioComponent,
      data: { title: 'Administrar intermediarios ', breadcrumb: 'Intermediarios' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'localidad',
      component: LocalidadComponent,
      data: { title: 'Listar localidades ' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'trabajadores',
      component: TrabajadoresComponent,
      data: { title: 'Listar Trabajadores ', breadcrumb: 'Listar Trabajadores' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'vencidos',
      component: ChoferVencidoComponent,
      data: { title: 'Listar choferes vencidos ', breadcrumb: 'Listar choferes vencidos' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'concurso',
      component: ConcursoComponent,
      data: { title: 'Listar Concursos ', breadcrumb: 'Listar Concursos' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'sorteo',
      component: SorteoComponent,
      data: { title: 'Listar Sorteos ', breadcrumb: 'Listar Sorteos' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'noticia',
      component: NoticiaComponent,
      data: { title: 'Listar Noticias ', breadcrumb: 'Listar Noticias' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'estadistica',
      component: EstadisticaComponent,
      data: { title: 'Reportes y Estadistica ', breadcrumb: 'Estadistica' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'reportes/centro',
      component: ReportCentrosComponent,
      data: { title: 'Reportes Centro ', breadcrumb: 'Reportes Centro' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'listanegra',
      component: ListaNegraComponent,
      data: { title: 'Lista Negra de Choferes ', breadcrumb: 'ListaNegra' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'lista-viajes-rechazados',
      component: ListaViajesRechazadosComponent,
      data: { title: 'Lista Viajes Rechazados ', breadcrumb: 'Lista Viajes Rechazados' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'configurar-centro',
      component: ConfigurarCentroComponent,
      data: { title: 'Configuracion de Centro ', breadcrumb: 'Configuracion centro' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'configurar-muvin',
      component: ConfigurarMuvinComponent,
      data: { title: 'Configuracion de Muvin ', breadcrumb: 'Configuracion muvin' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'rankings',
      component: RankingsComponent,
      data: { title: 'Rankings', breadcrumb: 'RANKINGS' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'gestionar-motivos',
      component: GestionarMotivosComponent,
      data: { title: 'Gestionar Motivos', breadcrumb: 'Gestionar Motivos' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'whatsapp-propios',
      component: WhatsappPropiosComponent,
      data: { title: 'Whatsapp propios', breadcrumb: 'Whatsapp propios' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'whatsapp-clientes',
      component: WhatsappClientesComponent,
      data: { title: 'Whatsapp de clientes', breadcrumb: 'Whatsapp de clientes' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'auditoria-interna',
      component: AuditoriaMenuComponent,
      data: { title: 'Auditoria', breadcrumb: 'Auditoria' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'error-interno',
      component: ErrorLogMenuComponent,
      data: { title: 'Error Log', breadcrumb: 'Error Log' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'lista-turneada',
      component: ListaTurneadaComponent,
      data: { title: 'Lista de Turneada', breadcrumb: 'Lista de Turneada' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'lista-choferes-estados',
      component: ListaChoferesEstadosComponent,
      data: { title: 'Lista de Estado de Choferes', breadcrumb: 'Lista de Estado de Choferes' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'reporte-turneadas',
      component: ReporteTurneadasComponent,
      data: { title: 'Reportes turneadas', breadcrumb: 'Reportes turneadas' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'mostrar-logs',
      component: MostrarLogsComponent,
      data: { title: 'Mostrar logs', breadcrumb: 'Mostrar logs' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'confirmar-arribo',
      component: ConfirmarArriboComponent,
      data: { title: 'Confirmar Arribo', breadcrumb: 'Confirmar Arribo' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'configuracion-tipo-turneado',
      component: TipoTurneadaComponent,
      data: { title: 'Tipo Turneada', breadcrumb: 'Tipo Turneada' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'configuracion-usuario-whatsapp',
      component: UsuarioWhatsappComponent,
      data: { title: 'Usuario Whatsapp', breadcrumb: 'Usuario Whatsapp' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'configuracion-logistica',
      component: LogisticaComponent,
      data: { title: 'Configuración Logistica', breadcrumb: 'Configuración Logistica' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'configuracion-notificaciones',
      component: NotificacionesComponent,
      data: { title: 'Configuración Notificaciones', breadcrumb: 'Configuración Notificaciones' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'configuracion-stop',
      component: StopComponent,
      data: { title: 'Configuración STOP', breadcrumb: 'Configuración STOP' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'configuracion-productos-centro',
      component: ProductosCentroComponent,
      data: { title: 'Configuración Productos Centros', breadcrumb: 'Configuración Productos Centros' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'configuracion-dadores',
      component: ConfigurarDadoresComponent,
      data: { title: 'Configuración Dadores del centro', breadcrumb: 'Configuración Dadores del centro' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'configuracion-linea-whatsapp',
      component: LineaWhatsappComponent,
      data: { title: 'Linea Whatsapp', breadcrumb: 'Linea Whatsapp' }
    }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
