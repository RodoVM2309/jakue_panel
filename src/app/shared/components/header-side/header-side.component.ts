import {
  Component, Input, OnInit, Renderer2
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LayoutService } from "../../services/layout.service";
import { ThemeService } from "../../services/theme.service";
//import { FireserviService } from "app/fireservi.service";
//import {AngularFirestore,  AngularFirestoreDocument} from "@angular/fire/firestore";
import { OnDestroy } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material";
import { Notificacion } from "app/shared/models/notificacion";
import { MessageService } from "app/shared/services/message.service";
import { NomencladoresService } from "app/shared/services/nomencladores.service";
import { Subscription } from "rxjs";
import { ExperienciaAcotadaComponent } from "../home/experiencia-acotada/experiencia-acotada.component";
//import { WebsocketService } from "app/shared/services/websocket.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ConsultaSocket } from "app/shared/models/consulta";

export class ListaDisponibles {
  id_lista: string;
  nombre: string;
  disponibles: string;
  id_pedido: any[];
  por_asignar: string;
}
@Component({
  selector: "app-header-side",
  templateUrl: "./header-side.template.html",
  styleUrls: ["./header-side.component.scss"],
  providers: [NomencladoresService],
})
export class HeaderSideComponent implements OnInit, OnDestroy {
  filtrarForm: FormGroup;
  @Input() notificPanel;
  public availableLangs = [
    {
      name: "ESPAÑOL",
      code: "es",
      flag: "flag-icon-es",
    },
    {
      name: "ENGLISH",
      code: "en",
      flag: "flag-icon-us",
    },
  ];
  currentLang = this.availableLangs[0];
  rolCentro = localStorage.getItem("rol") === "3" ? true : false;
  rolAdmin = localStorage.getItem("rol") === "1" ? true : false;
  roloperador = localStorage.getItem("rol") === "11" ? true : false;
  rolConsultor = localStorage.getItem("rol") === "12" ? true : false;
  rolDador = localStorage.getItem("rol") === "5" ? true : false;
  esDadorCupo = localStorage.getItem("esDadorCupo") === "1" ? true : false;
  esClienteFinal =
    localStorage.getItem("esClienteFinal") === "1" ? true : false;
  esClienteMuvin = localStorage.getItem("clienteMuvin") === "1" ? true : false;
  rol = localStorage.getItem("rol");
  public egretThemes;
  public layoutConf: any;
  habilitarFiltroDador: boolean = false;
  getItemSub: Subscription;
  subscription: Subscription;
  filtro = {
    dadorCuit: "",
  };
  dadores: any = [];
  //dador_cof: AngularFirestoreDocument<any>;
  lista: ListaDisponibles[];
  countChoferesDisponibles: number = 0;
  interval: any;
  message: any;
  notifications: Notificacion[] = [];
  topbar_magyp = localStorage.getItem("rol") === "14" ? true : false;
  paramsSubscription: Subscription;

  constructor(
    private themeService: ThemeService,
    private layout: LayoutService,
    public translate: TranslateService,
    private renderer: Renderer2,
    private nomencladoresService: NomencladoresService,
    private dialog: MatDialog,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) //public wsService: F,
  {
    this.subscription = this.messageService
      .getMessage()
      .subscribe((message) => {
        this.message = message;
        switch (this.message.text) {
          case "CambioIdioma":
            this.cargarDadores();
            break;
          case "EliminarNotificacionConsulta":
            this.buscarConsultas();
            break;
          default:
            break;
        }
      });
  }
  ngOnInit() {
    this.notifications = [];
    let rou = this.router.url;
    console.log("Router:", rou);

    this.egretThemes = this.themeService.egretThemes;
    this.layoutConf = this.layout.layoutConf;
    this.translate.use(this.currentLang.code);
    localStorage.setItem("currentLang", this.currentLang.code);
    localStorage.removeItem("consultas");
    this.filtrarForm = new FormGroup({
      selectedDador: new FormControl(this.filtro.dadorCuit),
    });
    if (this.router.url == "/panel-pedido/pedido") {
      this.habilitarFiltroDador = false;
      if ((this.esDadorCupo || this.esClienteFinal) && this.rolCentro) {
        if (!this.esClienteMuvin && this.esClienteFinal) {
          let limitadoDador = localStorage.getItem("limitado_dador");
          if (limitadoDador === null) {
            this.habilitarFiltroDador = true;
            //  this.openExperienciaAcotada();
          } else {
            this.habilitarFiltroDador = false;
            this.filtro.dadorCuit = localStorage.getItem("select_dador_cuit");
            let selectDador = {
              nombre_persona: localStorage.getItem(
                "select_dador_nombre_persona"
              ),
              cuit: this.filtro.dadorCuit,
              id: localStorage.getItem("select_dador_id"),
            };
            this.dadores = [selectDador];
            this.filtrarForm.controls["selectedDador"].setValue(
              this.filtro.dadorCuit
            );
          }
        } else {
          this.habilitarFiltroDador = true;
          //this.cargarDadores();
        }
      }
    }
    // this.escucharSockets();
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
  escucharSockets() {
    /* this.wsService.listen('nueva-consulta')
      .subscribe((chofer: ConsultaSocket) => {
        this.agregarNuevaConsulta(chofer);
      }); */
  }
  agregarNuevaConsulta(chofer: ConsultaSocket) {
    let temp = new Notificacion();
    temp.message = "Nuevo Consulta realizada";
    (temp.time = chofer.nombre_chofer), (temp.icon = "local_taxi");
    temp.route = "/admin/consulta/" + chofer.id_chofer;
    temp.color = "primary";
    temp.id = chofer.id_chofer;
    if (!this.notifications) this.notifications = [];
    this.notifications.push(temp);
    localStorage.setItem("consultas", JSON.stringify(this.notifications));
    this.messageService.sendMessage("NuevaConsulta");

    /*  Agregar pedido al principio del array */
    //this.datostemp.unshift(pedido);
  }

  buscarConsultas() {
    var guardado = localStorage.getItem("consultas");
    this.notifications = [];
    this.notifications = JSON.parse(guardado);
    if (!this.notifications) this.notifications = [];
  }

  openExperienciaAcotada() {
    this.getItemSub = this.nomencladoresService
      .getAllDadoresByReceptor()
      .subscribe((data) => {
        let dadores = data.data;
        if (dadores.length > 0) {
          let title = "Experiencia Acotada";
          let dialogRef: MatDialogRef<any> = this.dialog.open(
            ExperienciaAcotadaComponent,
            {
              width: "420px",
              disableClose: false,
              data: { title: title, payload: dadores },
            }
          );
          dialogRef.afterClosed().subscribe((res) => {
            if (res === undefined || !res) {
              this.openExperienciaAcotada();
              return;
            }
            this.filtro.dadorCuit = res.cuit;
            this.seleccionardador({ value: res.cuit });
            let selectDador = {
              nombre_persona: res.nombre_persona,
              cuit: res.cuit,
              id: res.id,
            };
            this.dadores = [selectDador];
            this.filtrarForm.controls["selectedDador"].setValue(res.cuit);
            this.habilitarFiltroDador = true;
          });
        } else {
          this.filtro.dadorCuit = "XXXXXXXXXXX";
          let selectDador = {
            nombre_persona: this.filtro.dadorCuit,
            cuit: this.filtro.dadorCuit,
            id: 0,
          };
          localStorage.setItem("select_dador_id", "0");
          localStorage.setItem("select_dador_cuit", this.filtro.dadorCuit);
          localStorage.setItem(
            "select_dador_nombre_persona",
            this.filtro.dadorCuit
          );
          this.dadores = [selectDador];
          this.filtrarForm.controls["selectedDador"].setValue(
            this.filtro.dadorCuit
          );
          this.habilitarFiltroDador = false;
        }
      });
  }
  cargarDadores() {
    this.translate.get("global.Todos").subscribe((res: string) => {
      let todos = res;
      this.nomencladoresService.getAllDadoresByReceptor().subscribe((data) => {
        let selectDador = {
          nombre_persona: todos,
          cuit: "",
          id: 0,
        };
        this.dadores = [selectDador];
        data.data.forEach((element) => {
          this.dadores.push(element);
        });
        this.filtro.dadorCuit = "";
      });
    });
  }

  setLang(lng) {
    this.currentLang = lng;
    localStorage.setItem("currentLang", lng.code);
    this.translate.use(lng.code);
    this.messageService.sendMessage("CambioIdioma");
  }

  changeTheme(theme) {
    this.themeService.changeTheme(this.renderer, theme);
  }
  toggleNotific() {
    this.notificPanel.toggle();
  }
  toggleSidenav() {
    if (this.layoutConf.sidebarStyle === "closed") {
      return this.layout.publishLayoutChange({
        sidebarStyle: "full",
      });
    }
    this.layout.publishLayoutChange({
      sidebarStyle: "closed",
    });
  }

  toggleCollapse() {
    // compact --> full

    if (this.layoutConf.sidebarStyle === "compact") {
      return this.layout.publishLayoutChange(
        {
          sidebarStyle: "full",
        },
        { transitionClass: true }
      );
    }

    // * --> compact
    this.layout.publishLayoutChange(
      {
        sidebarStyle: "compact",
      },
      { transitionClass: true }
    );
  }

  seleccionardador(event) {
    localStorage.setItem("dador_seleccionado", event.value);
    this.messageService.sendMessage("CambioDadorSeleccionado");
  }
  /*   cargaListaPedidosDisponibles() {
      this.interval = setInterval(() => {
        this.getItemSub = this.nomencladoresService
          .getListaCentroDisponible()
          .subscribe(data => {
            this.lista = data.data;
            this.countChoferesDisponibles = this.lista.length;

          })
          , err => {
          };
      }, 60000);


    } */


  openSoporte() {
    window.open("https://api.whatsapp.com/send?phone=5491132875467&text=Hola,%20necesito%20ayuda.", "_blank");
  }
}
