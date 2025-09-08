import { Injectable } from "@angular/core";
import { BehaviorSubject, Subscription, Observable, Subject, Subscriber } from 'rxjs';
import { URL_SERVICIOS } from "environments/environment.prod";

interface IMenuItem {
  type: string; // Possible values: link/dropDown/icon/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
}
interface IChildItem {
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;
  sub?: IChildItem[];
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

interface Exception {
  name: string; // Used as display text for item and title for separator type
  value: string; // Rol que elimina
}

@Injectable()
export class NavigationService {
  cen: IMenuItem[];
  constructor() {
    this.cen = this.centro;
  }

  defaultMenu: IMenuItem[] = [
    {
      name: "HOME",
      type: "link",
      tooltip: "GOHOME",
      icon: "home",
      state: "panel-pedido/pedido"
    }
  ];
  defaultException: Exception[] = [
    {
      name: "Panel Cupos",
      value: "esClienteFinal"
    }
  ]


  separatorMenu: IMenuItem[] = [
    {
      type: "separator",
      name: "Custom components"
    },
    {
      name: "HOME",
      type: "link",
      tooltip: "GOHOME",
      icon: "home",
      state: "panel-pedido/pedido"
    }
  ];

  iconMenu: IMenuItem[] = [
    {
      name: "HOME",
      type: "link",
      tooltip: "GOHOME",
      icon: "home",
      state: "panel-pedido/pedido"
    }
  ];

  centro_no_user: IMenuItem[] = [
    {
      name: "global.logisticDashboard",
      type: "dropDown",
      tooltip: "global.logisticDashboard",
      icon: "home",
      sub: [
        {
          name: "global.dashboardOrder1",
          type: "link",
          icon: "blur_on",
          state: "panel-pedido/pedido"
        },
        /*  {
           name: "Panel Cupos",
           type: "link",
           icon: "blur_on",
           state: "/cupo/cuponera"
         }, */
        {
          name: "difusiones.nav",
          type: "link",
          icon: "person_add",
          state: "panel-pedido/difusion"
        },
        /* {
          name: "Mapa",
          type: "link",
          icon: "place",
          state: "home/mapa"
        }*/
      ]
    },
    {
      name: "global.configCentro",
      type: "dropDown",
      tooltip: "global.configCentro",
      icon: "settings",
      sub: [
        {
          name: "vincularCentroOperador.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/vincular-centro-operador"
        },
        {
          name: "centroListaNegra.nav",
          type: "link",
          icon: "assignment",
          state: "centro/listanegra"
        },
        {
          name: "centroListaViajesRechazados.nav",
          type: "link",
          icon: "assignment",
          state: "centro/lista-viajes-rechazados"
        }
      ]
    },
    {
      name: "global.logisticParams",
      type: "dropDown",
      tooltip: "global.logisticParams",
      icon: "build",
      sub: [
        {
          name: "vincularCentroIntemediario.nav",
          type: "link",
          icon: "laptop_chromebook",
          state: "centro/vincular-centro-intermediario"
        },
        {
          name: "vincularCentroTransporte.nav",
          type: "link",
          icon: "person_pin",
          state: "centro/vincular-centro-transporte"
        },
        {
          name: "vincularzonaChofer.nav",
          type: "link",
          icon: "local_shipping",
          state: "centro/vincular-zona-chofer"
        },
        {
          name: "origenes.nav",
          type: "link",
          icon: "my_location",
          state: "centro/origenes"
        },
        {
          name: "zonaCentro.nav",
          type: "link",
          icon: "map",
          state: "centro/zona-centro"
        }
      ]
    },
    {
      name: "cargaMasivaFlota.nav",
      type: "link",
      tooltip: "cargaMasivaFlota.nav",
      icon: "unarchive",
      state: "panel-pedido/carga-masiva"
    },
    {
      name: "person.nav",
      type: "link",
      tooltip: "person.nav",
      icon: "fingerprint",
      state: "centro/trabajadores"
    } /*,
    {
      name: 'Choferes',
      type: 'link',
      tooltip: 'Choferes vencidos',
      icon: 'fingerprint',
      state: 'centro/vencidos',
    }*/,
    {
      name: "SIGNOUT",
      type: "link",
      tooltip: "SIGNOUT",
      icon: "exit_to_app",
      state: "/sessions/signin"
    }
  ];

  transportista: IMenuItem[] = [
    {
      name: "HOME",
      type: "link",
      tooltip: "GOHOME",
      icon: "home",
      state: "panel-pedido/difusion"
    },
    {
      name: "viajes.nav",
      type: "link",
      tooltip: "viajes.nav",
      icon: "directions",
      state: "panel-pedido/viaje"
    },
    {
      name: "camiones.nav",
      type: "link",
      tooltip: "camiones.nav",
      icon: "local_shipping",
      state: "transportista/camiones"
    },
    {
      name: "acoplados.nav",
      type: "link",
      tooltip: "Acoplados",
      icon: "event_seat",
      state: "transportista/acoplados"
    },
    {
      name: "equipos.nav",
      type: "link",
      tooltip: "equipos.nav",
      icon: "contacts",
      state: "transportista/equipos"
    },
    {
      name: "choferes.default",
      type: "link",
      tooltip: "choferes.default",
      icon: "streetview",
      state: "transportista/vincular-transporte-chofer"
    },
    {
      name: "SIGNOUT",
      type: "link",
      tooltip: "SIGNOUT",
      icon: "exit_to_app",
      state: "/sessions/signin"
    }
  ];
  destinatario: IMenuItem[] = [
    {
      name: "HOME",
      type: "link",
      tooltip: "GOHOME",
      icon: "home",
      state: "destinatario/panel"
    },
    /* {
      name: "Viajes",
      type: "link",
      tooltip: "Ir a Viajes",
      icon: "local_shipping",
      state: "home/viaje"
    }, */
    {
      name: "SIGNOUT",
      type: "link",
      tooltip: "SIGNOUT",
      icon: "exit_to_app",
      state: "/sessions/signin"
    }
  ];
  destino: IMenuItem[] = [
    {
      name: "Buscar",
      type: "link",
      tooltip: "Buscar",
      icon: "find_in_page",
      state: "destino/porteria"
    },
    // {
    //   name: "global.configDestino",
    //   type: "link",
    //   tooltip: "global.configDestino",
    //   icon: "settings",
    //   state: "destino/configuracion-puerto"
    // },
    /* {
      name: "Viajes",
      type: "link",
      tooltip: "Ir a Viajes",
      icon: "local_shipping",
      state: "home/viaje"
    }, */
    {
      name: "SIGNOUT",
      type: "link",
      tooltip: "SIGNOUT",
      icon: "exit_to_app",
      state: "/sessions/signin"
    }
  ];
  magyp: IMenuItem[] = [
    {
      name: "Panel Magyp",
      type: "dropDown",
      tooltip: "GOHOME",
      icon: "home",
      sub: [
        {
          name: "Dashboard",
          type: "link",
          icon: "blur_on",
          state: "magyp/gestion/dashboard"
        },
        {
          name: "Detalle Transportistas",
          type: "link",
          icon: "blur_on",
          state: "magyp/gestion/detalle"
        },
        {
          name: "Seguimiento STOP",
          type: "link",
          icon: "place",
          state: "magyp/gestion/seguimiento"
        },
        {
          name: "Contacto Magyp",
          type: "link",
          icon: "place",
          state: "magyp/gestion/contacto"
        }
      ]
    },
    {
      name: "Administración",
      type: "dropDown",
      tooltip: "global.configMagyp",
      icon: "settings",
      sub: [
        {
          name: "Cadenas",
          type: "link",
          icon: "blur_on",
          state: "magyp/administracion/cadenas"
        },
        {
          name: "Autoridad de Salud",
          type: "link",
          icon: "blur_on",
          state: "magyp/administracion/autoridades"
        },
        {
          name: "Whatsapp",
          type: "link",
          icon: "place",
          state: "magyp/administracion/whatsapp"
        }
      ]
    },
    /* {
      name: "Viajes",
      type: "link",
      tooltip: "Ir a Viajes",
      icon: "local_shipping",
      state: "home/viaje"
    }, */
    {
      name: "SIGNOUT",
      type: "link",
      tooltip: "SIGNOUT",
      icon: "exit_to_app",
      state: "/sessions/signin"
    }
  ];
  fertilizantes: IMenuItem[] = [
    {
      name: "Parámetros Logísticos",
      type: "dropDown",
      tooltip: "Parámetros Logísticos",
      icon: "build",
      sub: [
        {
          name: "Lugares de Carga",
          type: "link",
          icon: "blur_on",
          state: "fertilizante/origenes"
        },
      ]
    },
    {
      name: "SIGNOUT",
      type: "link",
      tooltip: "SIGNOUT",
      icon: "exit_to_app",
      state: "/sessions/signin"
    }
  ];

  consultor: IMenuItem[] = [
    {
      name: "home",
      type: "link",
      tooltip: "Consultas Choferes",
      icon: "message",
      state: "admin/consulta/0"
    }
  ];
  marketing: IMenuItem[] = [
    {
      name: "configurarCentro.nav",
      type: "link",
      tooltip: "configurarCentro.nav",
      icon: "settings",
      state: "marketing/config"
    },
    {
      name: "notificaciones.nav",
      type: "link",
      tooltip: "notificaciones.nav",
      icon: "notification_important",
      state: "marketing/notificaciones"
    },
    {
      name: "SIGNOUT",
      type: "link",
      tooltip: "SIGNOUT",
      icon: "exit_to_app",
      state: "/sessions/signin"
    }
  ];

  admin: IMenuItem[] = [
    {
      name: "global.logisticDashboard",
      type: "dropDown",
      tooltip: "Paneles Principales",
      icon: "home",
      sub: [
        {
          name: "global.dashboardOrder1",
          type: "link",
          icon: "blur_on",
          state: "panel-pedido/pedido"
        },
        /*  {
           name: "choferLibre.nav",
           type: "link",
           icon: "person_add",
           state: "admin/chofer-libre"
         }, */
        {
          name: "choferPerdido.nav",
          type: "link",
          icon: "priority_high",
          state: "admin/chofer-perdido"
        },
        {
          name: "mapaChoferLibre.nav",
          type: "link",
          icon: "map",
          state: "admin/mapa-chofer-libre"
        }
      ]
    },
    {
      name: "person.nav",
      type: "link",
      tooltip: "person.nav",
      icon: "people",
      state: "admin/personas"
    },
    // {
    //   name: "destinos.nav",
    //   type: "link",
    //   tooltip: "destinos.nav",
    //   icon: "directions_boat",
    //   state: "admin/destinos"
    // }
    {
      name: "destinos.nav",
      type: "dropDown",
      tooltip: "Administración",
      icon: "directions_boat",
      state: "",
      sub: [
        {
          icon: "directions_boat",
          name: "Playas intermedias",
          state: "admin/playas-intermedias"
        },
        {
          icon: "directions_boat",
          name: "Destinos Finales",
          state: "admin/destinos"
        },
      ]
    }
    ,
    {
      name: "centros.nav",
      type: "link",
      tooltip: "centros.nav",
      icon: "grade",
      state: "admin/centros"
    },
    {
      name: "global.inteligenciaLogistica",
      type: "link",
      tooltip: "global.inteligenciaLogistica",
      icon: "memory",
      state: "admin/inteligencia"
    },
    {
      name: "global.auditoria",
      type: "link",
      tooltip: "global.auditoria",
      icon: "assessment",
      state: "admin/auditoria"
    },
    {
      name: "global.errorLog",
      type: "link",
      tooltip: "global.errorLog",
      icon: "report_off",
      state: "admin/errorlog"
    },
    {
      name: "global.optionsFleet",
      type: "dropDown",
      tooltip: "global.optionsFleet",
      icon: "local_shipping",
      state: "admin",
      sub: [
        {
          name: "camiones.nav",
          type: "dropDown",
          icon: "blur_on",
          state: "camiones",
          sub: [
            { name: "camiones.marcas", state: "marcaCamion" },
            { name: "Tipos de Camiones ", state: "tipoCamion" }
          ]
        },
        {
          name: "acoplados.nav",
          type: "dropDown",
          icon: "blur_on",
          state: "acoplados",
          sub: [
            { name: "acoplados.marcas", state: "marcaAcoplado" },
            { name: "acoplados.tipos", state: "tipoAcoplado" }
          ]
        }
      ]
    },
    {
      name: "global.generalParams",
      type: "dropDown",
      tooltip: "Administración",
      icon: "settings",
      state: "",
      sub: [
        { icon: "people_outline", name: "Roles", state: "admin/roles" },
        /*{ icon: 'people_outline', name: 'Usuarios ', state: 'usuarios' }, */
        {
          icon: "people_outline",
          name: "productos.nav",
          state: "admin/productos"
        },
        {
          icon: "people_outline",
          name: "combustibles.nav",
          state: "admin/combustible"
        },
        {
          icon: "people_outline",
          name: "tipoDestino.nav",
          state: "admin/tipo-destino"
        },
        {
          icon: "people_outline",
          name: "zonaDestino.nav",
          state: "admin/zona-destino"
        },
        {
          icon: "people_outline",
          name: "zonasChoferesLibres.nav",
          state: "admin/zona-choferes-libres"
        },
        {
          icon: "people_outline",
          name: "estadosDestinos.nav",
          state: "admin/situacionpuerto"
        },
        {
          icon: "people_outline",
          name: "desvioMotivo.nav",
          state: "admin/desvio-motivo"
        },
        {
          icon: "people_outline",
          name: "motivoListaNegra.nav",
          state: "admin/motivo-lista-negra"
        },
        {
          icon: "people_outline",
          name: "razonRechazo.nav",
          state: "admin/razon-rechazo"
        },
        {
          icon: "blur_on",
          name: "destinatario.nav",
          state: "admin/destinatario",
          type: "link"
        },
        {
          icon: "blur_on",
          name: "corredores.nav",
          state: "admin/corredor",
          type: "link"
        },
        {
          icon: "blur_on",
          name: "vincularCentroOperador.nav",
          state: "admin/operador",
          type: "link"
        },
        {
          icon: "blur_on",
          name: "entregador.nav",
          state: "admin/entregador",
          type: "link"
        },
        {
          icon: "people_outline",
          name: "pais.nav",
          state: "admin/pais"
        },
        {
          icon: "people_outline",
          name: "provincias.nav",
          state: "admin/provincia"
        }
      ]
    },
    {
      name: "global.reportStatistics",
      type: "dropDown",
      tooltip: "global.reportStatistics",
      icon: "assessment",
      sub: [
        {
          name: "centros.nav",
          type: "link",
          icon: "blur_on",
          state: "admin/reportes/centro"
        }
      ]
    },
    {
      name: "global.appParams",
      type: "dropDown",
      tooltip: "global.appParams",
      icon: "phonelink_setup",
      sub: [
        {
          name: "Manuales Necesarios",
          type: "link",
          icon: "blur_on",
          state: "admin/manual"
        },
        {
          name: "global.optimizeTime",
          type: "dropDown",
          icon: "local_offer",
          sub: [
            {
              name: "documento.nav",
              type: "link",
              icon: "blur_on",
              state: "admin/documento"
            },
            {
              name: "estandar.nav",
              type: "link",
              icon: "person_add",
              state: "admin/estandar"
            },
            {
              name: "mapaRadares.nav",
              type: "link",
              icon: "priority_high",
              state: "admin/mapa-radares"
            },
            {
              name: "mapaTalleres.nav",
              type: "link",
              icon: "map",
              state: "admin/mapa-talleres"
            },
            {
              name: "mapaRuta.nav",
              type: "link",
              icon: "map",
              state: "admin/mapa-ruta"
            },
            {
              name: "mapaOficina.nav",
              type: "link",
              icon: "map",
              state: "admin/mapa-oficina"
            }
          ]
        },
        /* {
          name: "sorteo.nav",
          type: "link",
          icon: "map",
          state: "admin/sorteo"
        }, */
        {
          name: "concurso.nav",
          type: "link",
          icon: "priority_high",
          state: "admin/concurso"
        },
        {
          name: "noticia.nav",
          type: "link",
          icon: "person_add",
          state: "admin/noticia"
        }
      ]
    },
    {
      name: "consulta.nav",
      type: "link",
      tooltip: "Consultas Choferes",
      icon: "message",
      state: "admin/consulta/0"
    },
    {
      name: "configurarCentro.nav",
      type: "link",
      tooltip: "configurarCentro.nav",
      icon: "portrait",
      state: "admin/configurar-muvin"
    },

    {
      name: "parametroChat.nav",
      type: "link",
      tooltip: "Parámetro Chat",
      icon: "phonelink_setup",
      state: "admin/parametro-chat"
    },
    {
      name: "global.estacionesServicios",
      type: "dropDown",
      tooltip: "global.estacionesServicios",
      icon: "local_gas_station",
      sub: [
        {
          name: "boca.nav",
          type: "link",
          icon: "local_gas_station",
          state: "admin/boca"
        },
        {
          name: "mapaEstaciones.nav",
          type: "link",
          icon: "blur_on",
          state: "admin/mapa-estaciones"
        }
      ]
    },




    {
      name: "SIGNOUT",
      type: "link",
      tooltip: "SIGNOUT",
      icon: "exit_to_app",
      state: "/sessions/signin"
    }
  ];

  dador: IMenuItem[] = [
    {
      name: "global.logisticDashboard",
      type: "dropDown",
      tooltip: "Paneles Principales",
      icon: "home",
      sub: [
        {
          name: "global.dashboardOrder1",
          type: "link",
          icon: "blur_on",
          state: "panel-pedido/pedido"
        },
        /*  {
           name: "Panel Cupos",
           type: "link",
           icon: "blur_on",
           state: "/cupo/cuponera"
         }, */
        /*  {
           name: "Mapa",
           type: "link",
           icon: "place",
           state: "home/mapa"
         } */
      ]
    },
    {
      name: "global.commercialParams",
      type: "dropDown",
      tooltip: "global.commercialParams",
      icon: "settings",
      sub: [
        {
          name: "centros.nav",
          type: "link",
          icon: "business_center",
          state: "dador/mis-centros"
        }
      ]
    },
    {
      name: "SIGNOUT",
      type: "link",
      tooltip: "SIGNOUT",
      icon: "exit_to_app",
      state: "/sessions/signin"
    }
  ];
  centro: IMenuItem[] = [
    {
      name: "global.logisticDashboards",
      type: "dropDown",
      tooltip: "global.logisticDashboards",
      icon: "home",
      sub: [
        {
          name: "global.dashboardOrder1",
          type: "link",
          icon: "blur_on",
          state: "panel-pedido/pedido"
        },
       /*  {
          name: "global.preOrder",
          type: "link",
          icon: "blur_on",
          state: "panel-pedido/prepedido"
        },
        {
          name: "MAP",
          type: "link",
          icon: "place",
          state: "panel-pedido/mapa"
        } */
      ]
    },
    {
      name: "global.configCentro",
      type: "dropDown",
      tooltip: "global.configCentro",
      icon: "settings",
      sub: [
       /*  {
          name: "tipo-turneado.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/configuracion-tipo-turneado"
        },
        {
          name: "logistica.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/configuracion-logistica"
        }, */
        {
          name: "configuracion-notificaciones.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/configuracion-notificaciones"
        },
        /* {
          name: "configuracion-stop.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/configuracion-stop"
        }, */
        {
          name: "configuracion-productos-centro.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/configuracion-productos-centro"
        },
        {
          name: "centroListaNegra.nav",
          type: "link",
          icon: "assignment",
          state: "centro/listanegra"
        },
        /* {
          name: "configuracion-dadores.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/configuracion-dadores"
        },
        {
          name: "vincularCentroOperador.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/vincular-centro-operador"
        },
        {
          name: "centroPorEvaluar.nav",
          type: "link",
          icon: "local_activity",
          state: "centro/por-evaluar"
        },
        {
          name: "centroListaViajesRechazados.nav",
          type: "link",
          icon: "assignment",
          state: "centro/lista-viajes-rechazados"
        },
        {
          name: "centroLineaWhatsapp.nav",
          type: "link",
          icon: "assignment",
          state: "centro/configuracion-linea-whatsapp"
        } */
      ]
    },
    /* {
      name: "busquedaFlota.nav",
      type: "link",
      tooltip: "Búsqueda de Flota",
      icon: "search",
      state: "centro/busqueda-flota"
    }, */
    {
      name: "cargaMasivaFlota.nav",
      type: "link",
      tooltip: "cargaMasivaFlota.nav",
      icon: "unarchive",
      state: "panel-pedido/carga-masiva"
    },
    {
      name: "global.logisticParams",
      type: "dropDown",
      tooltip: "global.logisticParams",
      icon: "build",
      sub: [
         {
          name: "vincularCentroIntemediario.nav",
          type: "link",
          icon: "laptop_chromebook",
          state: "centro/vincular-centro-intermediario"
        },
       /* {
          name: "vincularCentroTransporte.nav",
          type: "link",
          icon: "person_pin",
          state: "centro/vincular-centro-transporte"
        }, */
        {
          name: "vincularzonaChofer.nav",
          type: "link",
          icon: "local_shipping",
          state: "centro/vincular-zona-chofer"
        },
       /*  {
          name: "combustibleRetiro.nav",
          type: "link",
          icon: "blur_on",
          state: "combustible/retiro"
        }, */
        {
          name: "origenes.nav",
          type: "link",
          icon: "my_location",
          state: "centro/origenes"
        },
        /* {
          name: "zonaCentro.nav",
          type: "link",
          icon: "map",
          state: "centro/zona-centro"
        } */
      ]
    },
    {
      name: "global.commercialParams",
      type: "dropDown",
      tooltip: "global.commercialParams",
      icon: "contact_mail",
      sub: [
        {
          name: "vincularCentroCliente.nav",
          type: "link",
          icon: "business_center",
          state: "centro/vincular-centro-cliente"
        },
        /* {
          name: "vincularCentroDestinatario.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/vincular-centro-destinatario"
        },
        {
          name: "vincularCentroCorredor.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/vincular-centro-corredor"
        },
        {
          name: "vincularCentroEntregador.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/vincular-centro-entregador"
        }, */
        {
          name: "vincularCentroEmpresa.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/vincular-centro-empresa"
        }
      ]
    },
    /* {
      name: "global.reportStatistics",
      type: "dropDown",
      tooltip: "global.reportStatistics",
      icon: "assessment",
      sub: [
        {
          name: "bajadaMasiva.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/bajada-masiva"
        },
        {
          name: "estadistica.nav",
          type: "link",
          icon: "assessment",
          state: "centro/estadistica"
        },
        {
          name: "rankings.nav",
          type: "link",
          icon: "place",
          state: "centro/rankings"
        },
        {
          name: "nuevosProveedores.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/nuevos-proveedores"
        },
        {
          name: "hojaRuta.nav",
          type: "link",
          icon: "keyboard_hide",
          state: "centro/hoja-ruta"
        }
      ]
    },*/
    {
      name: "whatsappPropio.nav",
      type: "link",
      tooltip: "whatsappPropio.nav",
      icon: "face",
      state: "centro/whatsapp-propios"
    },
    {
      name: "whatsappCliente.nav",
      type: "link",
      tooltip: "whatsappCliente.nav",
      icon: "supervised_user_circle",
      state: "centro/whatsapp-clientes"
    }, 
    {
      name: "auditoriaCentro.nav",
      type: "link",
      tooltip: "auditoriaCentro.nav",
      icon: "assessment",
      state: "centro/auditoria-interna"
    },
    {
      name: "errorLog.nav",
      type: "link",
      tooltip: "errorLog.nav",
      icon: "report_off",
      state: "centro/error-interno"
    },
   /*  {
      name: "person.nav",
      type: "link",
      tooltip: "person.nav",
      icon: "fingerprint",
      state: "centro/trabajadores"
    } */
  ];
  // -centro
  centroVisualizaFlota: IMenuItem[] = [
    {
      name: "global.logisticParams",
      type: "dropDown",
      tooltip: "global.logisticParams",
      icon: "build",
      sub: [
        {
          name: "flotaIntermediario.nav",
          type: "link",
          icon: "airline_seat_recline_normal",
          state: "centro/flota-intermediario"
        },
        {
          name: "documentacionChoferes.nav",
          type: "link",
          icon: "blur_on",
          state: "documentacion/choferes"
        }
      ]
    },
    {
      name: "whatsappPropio.nav",
      type: "link",
      tooltip: "whatsappPropio.nav",
      icon: "face",
      state: "centro/whatsapp-propios"
    },
  ];
  // -centroVisualizaFlota
  centroTurneada: IMenuItem[] = [
    {
      name: "global.logisticDashboards",
      type: "dropDown",
      tooltip: "global.logisticDashboards",
      icon: "home",
      sub: [
        {
          name: "global.dashboardTurneado1",
          type: "dropDown",
          icon: "list",
          sub: [
            {
              name: "panelTurneado.lista-choferes.title",
              type: "link",
              icon: "blur_on",
              state: "turneada/turneada/0"
            },
            {
              name: "panelTurneado.lista-turneado.title",
              type: "link",
              icon: "blur_on",
              state: "turneada/turneada/1"
            }
          ]
        }
      ]
    },
    {
      name: "global.configCentro",
      type: "dropDown",
      tooltip: "global.configCentro",
      icon: "settings",
      sub: [
        {
          name: "centroGestionMotivos.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/gestionar-motivos"
        }
      ]
    },
    {
      name: "global.reportStatistics",
      type: "dropDown",
      tooltip: "global.reportStatistics",
      icon: "assessment",
      sub: [
        {
          name: "turneadas.nav",
          type: "link",
          icon: "list",
          state: "centro/reporte-turneadas"
        }
      ]
    }
  ];
  // -centroTurneada
  centroTurneadaOrdenLlegada: IMenuItem[] = [
    {
      name: "global.logisticDashboards",
      type: "dropDown",
      tooltip: "global.logisticDashboards",
      icon: "home",
      sub: [
        {
          name: "global.dashboardTurneado1",
          type: "dropDown",
          icon: "list",
          sub: [
            {
              name: "confirmarArribo.nav",
              type: "link",
              icon: "laptop_chromebook",
              state: "turneada/turneada/2"
            }
          ]
        }
      ]
    }
  ];
  centroTurneadaHistoricoViaje: IMenuItem[] = [
    {
      name: "global.logisticDashboards",
      type: "dropDown",
      tooltip: "global.logisticDashboards",
      icon: "home",
      sub: [
        {
          name: "global.dashboardTurneado1",
          type: "dropDown",
          icon: "list",
          sub: [
            {
              name: "panelTurneado.control-mensual.title",
              type: "link",
              icon: "laptop_chromebook",
              state: "turneada/turneada/2"
            },
          ]
        }
      ]
    }
  ];
  centroLineaWhatsapp: IMenuItem[] = [
    {
      name: "global.configCentro",
      type: "dropDown",
      tooltip: "global.configCentro",
      icon: "settings",
      sub: [
        {
          name: "centroUsuarioWhatsapp.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/configuracion-usuario-whatsapp"
        }
      ]
    }
  ];
  centroClienteFinal: IMenuItem[] = [
    /* {
      name: "listado-contrato.nav",
      type: "link",
      icon: "calendar_view_day",
      tooltip: "listado-contrato.nav",
      state: "cupo/listado-contrato"
    }, */
  ];
  // -centroTurneadaOrdenLlegada

  centroDador: IMenuItem[] = [
    {
      name: "global.logisticDashboards",
      type: "dropDown",
      tooltip: "global.logisticDashboards",
      icon: "home",
      sub: [
        {
          name: "global.dashboardCupo1",
          type: "link",
          icon: "blur_on",
          state: "/cupo/cuponera"
        }
      ]
    }
  ]
  centroLog: IMenuItem[] = [
    {
      name: "Logs",
      type: "link",
      tooltip: "Logs",
      icon: "find_in_page",
      state: "centro/mostrar-logs"
    }
  ]
  centroSalir: IMenuItem[] = [
    {
      name: "SIGNOUT",
      type: "link",
      tooltip: "SIGNOUT",
      icon: "exit_to_app",
      state: "/sessions/signin"
    }
  ]
  centroIntermediario: IMenuItem[] = [
    {
      name: "global.logisticDashboard",
      type: "dropDown",
      tooltip: "Paneles Principales",
      icon: "home",
      sub: [
        {
          name: "difusiones.nav",
          type: "link",
          icon: "person_add",
          state: "panel-pedido/difusion"
        }
      ]
    }
  ]
  centrov: IMenuItem[] = [
    {
      name: "global.logisticDashboard",
      type: "dropDown",
      tooltip: "Paneles Principales",
      icon: "home",
      sub: [
        {
          name: "global.dashboardOrder1",
          type: "link",
          icon: "blur_on",
          state: "panel-pedido/pedido"
        },
        /*  {
           name: "Panel Cupos",
           type: "link",
           icon: "blur_on",
           state: "/cupo/cuponera"
         }, */
        {
          name: "difusiones.nav",
          type: "link",
          icon: "person_add",
          state: "panel-pedido/difusion"
        },
        /*  {
           name: "Mapa",
           type: "link",
           icon: "place",
           state: "home/mapa"
         }*/
      ]
    },
    {
      name: "global.configCentro",
      type: "dropDown",
      tooltip: "global.configCentro",
      icon: "settings",
      sub: [
        {
          name: "configurarCentro.nav",
          type: "link",
          icon: "business_center",
          state: "centro/configurar-centro"
        },
        {
          name: "vincularCentroOperador.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/vincular-centro-operador"
        },
        {
          name: "centroPorEvaluar.nav",
          type: "link",
          icon: "local_activity",
          state: "centro/por-evaluar"
        },
        {
          name: "centroListaNegra.nav",
          type: "link",
          icon: "assignment",
          state: "centro/listanegra"
        },
        {
          name: "centroListaViajesRechazados.nav",
          type: "link",
          icon: "assignment",
          state: "centro/lista-viajes-rechazados"
        }
      ]
    },
    {
      name: "busquedaFlota.nav",
      type: "link",
      tooltip: "busquedaFlota.nav",
      icon: "search",
      state: "centro/busqueda-flota"
    },
    {
      name: "cargaMasivaFlota.nav",
      type: "link",
      tooltip: "cargaMasivaFlota.nav",
      icon: "unarchive",
      state: "panel-pedido/carga-masiva"
    },
    {
      name: "global.logisticParams",
      type: "dropDown",
      tooltip: "global.logisticParams",
      icon: "build",
      sub: [
        {
          name: "vincularCentroIntemediario.nav",
          type: "link",
          icon: "laptop_chromebook",
          state: "centro/vincular-centro-intermediario"
        },
        {
          name: "vincularCentroTransporte.nav",
          type: "link",
          icon: "person_pin",
          state: "centro/vincular-centro-transporte"
        },
        {
          name: "vincularzonaChofer.nav",
          type: "link",
          icon: "local_shipping",
          state: "centro/vincular-zona-chofer"
        },
        {
          name: "flotaIntermediario.nav",
          type: "link",
          icon: "airline_seat_recline_normal",
          state: "centro/flota-intermediario"
        },
        {
          name: "combustibleRetiro.nav",
          type: "link",
          icon: "blur_on",
          state: "combustible/retiro"
        },
        {
          name: "documentacionChoferes.nav",
          type: "link",
          icon: "blur_on",
          state: "documentacion/choferes"
        },
        {
          name: "origenes.nav",
          type: "link",
          icon: "my_location",
          state: "centro/origenes"
        },
        {
          name: "zonaCentro.nav",
          type: "link",
          icon: "map",
          state: "centro/zona-centro"
        }
      ]
    },
    {
      name: "global.commercialParams",
      type: "dropDown",
      tooltip: "global.commercialParams",
      icon: "contact_mail",
      sub: [
        {
          name: "vincularCentroCliente.nav",
          type: "link",
          icon: "business_center",
          state: "centro/vincular-centro-cliente"
        },
        {
          name: "vincularCentroDestinatario.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/vincular-centro-destinatario"
        },
        {
          name: "corredores.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/vincular-centro-corredor"
        },
        {
          name: "vincularCentroEntregador.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/vincular-centro-entregador"
        }
      ]
    },
    {
      name: "global.reportStatistics",
      type: "dropDown",
      tooltip: "global.reportStatistics",
      icon: "assessment",
      sub: [
        {
          name: "bajadaMasiva.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/bajada-masiva"
        },
        {
          name: "estadistica.nav",
          type: "link",
          icon: "assessment",
          state: "centro/estadistica"
        },
        {
          name: "rankings.nav",
          type: "link",
          icon: "place",
          state: "centro/rankings"
        },
        {
          name: "nuevosProveedores.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/nuevos-proveedores"
        }, {
          name: "hojaRuta.nav",
          type: "link",
          icon: "keyboard_hide",
          state: "centro/hoja-ruta"
        }
      ]
    },
    /* {
      name: "Turneada",
      type: "dropDown",
      tooltip: "Turneada",
      icon: "assignment",
      sub: [
        {
          name: "Lista de Turneada",
          type: "link",
          icon: "blur_on",
          state: "centro/lista-turneada"
        },
        {
          name: "Estado de Choferes",
          type: "link",
          icon: "blur_on",
          state: "centro/lista-choferes-estados"
        }
      ]
    }, */
    {
      name: "estadoChofer.nav",
      type: "link",
      icon: "assignment",
      tooltip: "Estado de Choferes",
      state: "centro/lista-choferes-estados"
    },
    {
      name: "whatsappPropio.nav",
      type: "link",
      tooltip: "whatsappPropio.nav",
      icon: "face",
      state: "centro/whatsapp-propios"
    },
    {
      name: "whatsappCliente.nav",
      type: "link",
      tooltip: "whatsappCliente.nav",
      icon: "supervised_user_circle",
      state: "centro/whatsapp-clientes"
    },
    {
      name: "auditoriaCentro.nav",
      type: "link",
      tooltip: "auditoriaCentro.nav",
      icon: "assessment",
      state: "centro/auditoria-interna"
    },
    {
      name: "person.nav",
      type: "link",
      tooltip: "person.nav en Centro",
      icon: "fingerprint",
      state: "centro/trabajadores"
    },
    {
      name: "Logs",
      type: "link",
      tooltip: "Ver logs",
      icon: "find_in_page",
      state: "centro/mostrar-logs"
    },
    {
      name: "SIGNOUT",
      type: "link",
      tooltip: "SIGNOUT",
      icon: "exit_to_app",
      state: "/sessions/signin"
    }
  ];
  operador: IMenuItem[] = [
    {
      name: "global.logisticDashboard",
      type: "dropDown",
      tooltip: "global.logisticDashboard",
      icon: "home",
      sub: [
        {
          name: "global.dashboardOrder1",
          type: "link",
          icon: "blur_on",
          state: "panel-pedido/pedido"
        },
        /*   {
            name: "Panel Cupos",
            type: "link",
            icon: "blur_on",
            state: "/cupo/cuponera"
          }, */
        /* {
          name: "Mapa",
          type: "link",
          icon: "place",
          state: "home/mapa"
        }, */
        {
          name: "centroPorEvaluar.nav",
          type: "link",
          icon: "local_activity",
          state: "centro/por-evaluar"
        },
        {
          name: "centroListaNegra.nav",
          type: "link",
          icon: "assignment",
          state: "centro/listanegra"
        },
        {
          name: "centroListaViajesRechazados.nav",
          type: "link",
          icon: "assignment",
          state: "centro/lista-viajes-rechazados"
        }
      ]
    },
    {
      name: "global.logisticParams",
      type: "dropDown",
      tooltip: "global.logisticParams",
      icon: "build",
      sub: [
        {
          name: "vincularCentroIntemediario.nav",
          type: "link",
          icon: "laptop_chromebook",
          state: "centro/vincular-centro-intermediario"
        },
        {
          name: "vincularCentroTransporte.nav",
          type: "link",
          icon: "person_pin",
          state: "centro/vincular-centro-transporte"
        },
        {
          name: "vincularzonaChofer.nav",
          type: "link",
          icon: "local_shipping",
          state: "centro/vincular-zona-chofer"
        },
        {
          name: "flotaIntermediario.nav",
          type: "link",
          icon: "airline_seat_recline_normal",
          state: "centro/flota-intermediario"
        },
        {
          name: "origenes.nav",
          type: "link",
          icon: "my_location",
          state: "centro/origenes"
        },
        {
          name: "zonaCentro.nav",
          type: "link",
          icon: "map",
          state: "centro/zona-centro"
        }
      ]
    },
    {
      name: "global.commercialParams",
      type: "dropDown",
      tooltip: "global.commercialParams",
      icon: "settings",
      sub: [
        {
          name: "vincularCentroCliente.nav",
          type: "link",
          icon: "business_center",
          state: "centro/vincular-centro-cliente"
        },
        {
          name: "vincularCentroDestinatario.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/vincular-centro-destinatario"
        },
        {
          name: "corredores.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/vincular-centro-corredor"
        },
        {
          name: "vincularCentroEntregador.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/vincular-centro-entregador"
        }
      ]
    },
    {
      name: "global.reportStatistics",
      type: "dropDown",
      tooltip: "global.reportStatistics",
      icon: "assessment",
      sub: [
        {
          name: "bajadaMasiva.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/bajada-masiva"
        },
        {
          name: "estadistica.nav",
          type: "link",
          icon: "assessment",
          state: "centro/estadistica"
        },
        {
          name: "rankings.nav",
          type: "link",
          icon: "place",
          state: "centro/rankings"
        },
        {
          name: "nuevosProveedores.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/nuevos-proveedores"
        },
        {
          name: "hojaRuta.nav",
          type: "link",
          icon: "keyboard_hide",
          state: "centro/hoja-ruta"
        },
      ]
    },
    {
      name: "person.nav",
      type: "link",
      tooltip: "person.nav en Centro",
      icon: "fingerprint",
      state: "centro/trabajadores"
    },
    {
      name: "SIGNOUT",
      type: "link",
      tooltip: "SIGNOUT",
      icon: "exit_to_app",
      state: "/sessions/signin"
    }
  ];

  centro_libre: IMenuItem[] = [
    {
      name: "global.logisticDashboard",
      type: "dropDown",
      tooltip: "Paneles Principales",
      icon: "home",
      sub: [
        {
          name: "global.dashboardOrder1",
          type: "link",
          icon: "blur_on",
          state: "panel-pedido/pedido"
        },
        {
          name: "difusiones.nav",
          type: "link",
          icon: "person_add",
          state: "panel-pedido/difusion"
        }
      ]
    },
    {
      name: "global.configCentro",
      type: "dropDown",
      tooltip: "global.configCentro",
      icon: "settings",
      sub: [
        {
          name: "configurarCentro.nav",
          type: "link",
          icon: "business_center",
          state: "centro/configurar-centro"
        }
      ]
    },
    {
      name: "global.commercialParams",
      type: "dropDown",
      tooltip: "global.commercialParams",
      icon: "contact_mail",
      sub: [
        {
          name: "vincularCentroCliente.nav",
          type: "link",
          icon: "business_center",
          state: "centro/vincular-centro-cliente"
        },
        {
          name: "vincularCentroDestinatario.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/vincular-centro-destinatario"
        },
        {
          name: "corredores.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/vincular-centro-corredor"
        },
        {
          name: "vincularCentroEntregador.nav",
          type: "link",
          icon: "blur_on",
          state: "centro/vincular-centro-entregador"
        }
      ]
    },
    {
      name: "SIGNOUT",
      type: "link",
      tooltip: "SIGNOUT",
      icon: "exit_to_app",
      state: "/sessions/signin"
    }
  ];

  mtr: IMenuItem[] = [
    {
      name: "Mercado",
      type: "dropDown",
      tooltip: "Mercado Termino",
      icon: "fact_check",
      sub: [
        {
          name: "Carátulas",
          type: "link",
          state: "mtr/caratulas"
        }
      ]
    },
    {
      name: "SIGNOUT",
      type: "link",
      tooltip: "SIGNOUT",
      icon: "exit_to_app",
      state: "/sessions/signin"
    }
  ];

  blankMenu: IMenuItem[] = [];

  iconTypeMenuTitle: string = "Frequently Accessed";
  //introducir todas las subscripciones

  //Asigno los menu por rol
  menuBlank = new BehaviorSubject<IMenuItem[]>([]);
  menuBlank$ = this.menuBlank.asObservable();
  menucentro = new BehaviorSubject<IMenuItem[]>(this.centro);
  menucentro$ = this.menucentro.asObservable();
  getMenuCentros(): Observable<IMenuItem[]> {
    return Observable.of(this.centro);
  }
  menucentroVisualizaFlota = new BehaviorSubject<IMenuItem[]>(this.centroVisualizaFlota);
  menucentroVisualizaFlota$ = this.menucentroVisualizaFlota.asObservable();
  menucentroDador = new BehaviorSubject<IMenuItem[]>(this.centroDador);
  menucentroDador$ = this.menucentroDador.asObservable();
  menucentroIntermediario = new BehaviorSubject<IMenuItem[]>(this.centroIntermediario);
  menucentroIntermediario$ = this.menucentroIntermediario.asObservable();
  menudestino = new BehaviorSubject<IMenuItem[]>(this.destino);
  menudestino$ = this.menudestino.asObservable();

  menumagyp = new BehaviorSubject<IMenuItem[]>(this.magyp);
  menumagyp$ = this.menumagyp.asObservable();
  menumtr = new BehaviorSubject<IMenuItem[]>(this.mtr);
  menumtr$ = this.menumtr.asObservable();

  menufertilizantes = new BehaviorSubject<IMenuItem[]>(this.fertilizantes);
  menufertilizantes$ = this.menufertilizantes.asObservable();

  menucentroTurneada = new BehaviorSubject<IMenuItem[]>(this.centroTurneada);
  menucentroTurneada$ = this.menucentroTurneada.asObservable();
  menucentroTurneadaOrdenLlegada = new BehaviorSubject<IMenuItem[]>(this.centroTurneadaOrdenLlegada);
  menucentroTurneadaOrdenLlegada$ = this.menucentroTurneadaOrdenLlegada.asObservable();
  menucentroTurneadaHistoricoViaje = new BehaviorSubject<IMenuItem[]>(this.centroTurneadaHistoricoViaje);
  menucentroTurneadaHistoricoViaje$ = this.menucentroTurneadaHistoricoViaje.asObservable();
  menucentroLineaWhatsapp = new BehaviorSubject<IMenuItem[]>(this.centroLineaWhatsapp);
  menucentroLineaWhatsapp$ = this.menucentroLineaWhatsapp.asObservable();
  menucentroClienteFinal = new BehaviorSubject<IMenuItem[]>(this.centroClienteFinal);
  menucentroClienteFinal$ = this.menucentroClienteFinal.asObservable();
  menucentroLog = new BehaviorSubject<IMenuItem[]>(this.centroLog);
  menucentroLog$ = this.menucentroLog.asObservable();
  menucentroSalir = new BehaviorSubject<IMenuItem[]>(this.centroSalir);
  menucentroSalir$ = this.menucentroSalir.asObservable();

  menucentrov = new BehaviorSubject<IMenuItem[]>(this.centro);
  menucentrov$ = this.menucentrov.asObservable();

  menucentro_no_user = new BehaviorSubject<IMenuItem[]>(this.centro_no_user);
  menucentro_no_user$ = this.menucentro_no_user.asObservable();

  menucentro_libre = new BehaviorSubject<IMenuItem[]>(this.centro_libre);
  menucentro_libre$ = this.menucentro_libre.asObservable();

  menutransportista = new BehaviorSubject<IMenuItem[]>(this.transportista);
  menutransportista$ = this.menutransportista.asObservable();

  menudestinatario = new BehaviorSubject<IMenuItem[]>(this.destinatario);
  menudestinatario$ = this.menudestinatario.asObservable();

  menuoperador = new BehaviorSubject<IMenuItem[]>(this.operador);
  menuoperador$ = this.menuoperador.asObservable();

  menuconsultor = new BehaviorSubject<IMenuItem[]>(this.consultor);
  menuconsultor$ = this.menuconsultor.asObservable();

  menudador = new BehaviorSubject<IMenuItem[]>(this.dador);
  menudador$ = this.menudador.asObservable();

  menumarketing = new BehaviorSubject<IMenuItem[]>(this.marketing);
  menumarketing$ = this.menumarketing.asObservable();

  menuadmin = new BehaviorSubject<IMenuItem[]>(this.admin);
  menuadmin$ = this.menuadmin.asObservable();
  menue = new BehaviorSubject<IMenuItem[]>(this.admin);


  menuItems = new BehaviorSubject<IMenuItem[]>(this.iconMenu);
  menuItems$ = this.menuItems.asObservable();

  exceptionItems = new BehaviorSubject<Exception[]>(this.defaultException);
  menuException$ = this.menuItems.asObservable();

  publishNavigationChange(menuType: string) {
    switch (menuType) {
      case "separator-menu":
        this.menuItems.next(this.separatorMenu);
        break;
      case "icon-menu":
        this.menuItems.next(this.iconMenu);
        break;
      default:
        this.menuItems.next(this.defaultMenu);
    }
  }
}
