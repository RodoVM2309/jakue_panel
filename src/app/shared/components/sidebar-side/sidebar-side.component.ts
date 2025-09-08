import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { ThemeService } from "../../services/theme.service";
import { Subscription, Subject, Observable } from "rxjs";
import PerfectScrollbar from "perfect-scrollbar";
import { MatDialogRef, MatDialog } from "@angular/material";
import { PerfilComponent } from "../home/perfil/perfil.component";
import { GlobalService } from "app/shared/models/global.service";
import { MessageService } from "app/shared/services/message.service";
import { FileUploadService } from "app/shared/services/file-upload.service";
import { UserService } from "app/shared/services/user.service";

@Component({
  selector: "app-sidebar-side",
  templateUrl: "./sidebar-side.component.html",
})
export class SidebarSideComponent implements OnInit, OnDestroy, AfterViewInit {
  private sidebarPS: PerfectScrollbar;
  public menuItems: any[];
  public hasIconTypeMenuItem: boolean;
  public iconTypeMenuTitle: string;
  private menuItemsSub: Subscription;
  currentUser = localStorage.getItem("nameUser");
  rol: any;
  user: any;
  ruta: any;
  ruta_logo: any;
  imagenTemp1: any;
  subscription: Subscription;
  message: any;
  private ngUnsubscribe = new Subject();
  esQuitarTurneada: boolean;
  esQuitarLineaWhatsapp: boolean;
  esQuitarTurneadaConfirmarArribo: boolean;

  constructor(
    private navService: NavigationService,
    public themeService: ThemeService,
    private dialog: MatDialog,
    private globalService: GlobalService,
    private messageService: MessageService,
    private fileUploadService: FileUploadService,
    private userService: UserService
  ) {
    this.subscription = this.messageService
      .getMessage()
      .subscribe((message) => {
        this.message = message;
        switch (this.message.text) {
          case "AddTurneada":
            this.userMenu();
            //this.gotoRefresh();
            break;
          case "QuitarTurneada":
            this.esQuitarTurneada = true;
            this.menuCentro();
            //this.gotoRefresh();
            break;
          case "AddTurneadaConfirmarArribo":
            this.userMenu();
            //this.gotoRefresh();
            break;
          case "AddLineaWhatsapp":
            this.userMenu();
            //this.gotoRefresh();
            break;
          case "QuitarTurneadaConfirmarArribo":
            this.esQuitarTurneadaConfirmarArribo = true;
            this.menuCentro();
            //this.gotoRefresh();
            break;
          case "QuitarLineaWhatsapp":
            this.esQuitarLineaWhatsapp = true;
            this.menuCentro();
            //this.gotoRefresh();
            break;
          case "CambioImagen":
            this.cambioImagen();
            break;
          default:
            break;
        }
      });
  }

  ngOnInit() {
    this.menuItemsSub = this.navService.menuBlank$.subscribe((menuItem) => {
      this.menuItems = menuItem;
      //Checks item list has any icon type.
      this.hasIconTypeMenuItem = !!this.menuItems.filter(
        (item) => item.type === "icon"
      ).length;
    });
    this.userService
      .getIdPersonaRol(localStorage.getItem("rol"))
      .subscribe((data) => (this.user = data.data));
    this.userMenu();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    if (this.sidebarPS) {
      this.sidebarPS.destroy();
    }
    if (this.menuItemsSub) {
      this.menuItemsSub.unsubscribe();
    }
  }
  userMenu() {
    this.menuItems = [];
    this.menuItems = [...this.menuItems];
    if (this.menuItemsSub) {
      this.menuItemsSub.unsubscribe();
    }
    this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
    this.rol = localStorage.getItem("rol");
    switch (this.rol) {
      case "1":
        this.menuItemsSub = this.navService.menuadmin$.subscribe((menuItem) => {
          this.menuItems = menuItem;
          //Checks item list has any icon type.
          this.hasIconTypeMenuItem = !!this.menuItems.filter(
            (item) => item.type === "icon"
          ).length;
        });
        break;
      case "3":
        let token: string = localStorage.getItem("token");
        this.ruta_logo =
          this.globalService.apiHost + "centro/imagen-down?r=" + token;
        //this.buscarImagen();
        //this.downloadImagen();
        let cliente: string = localStorage.getItem("clienteMuvin");
       // console.log(cliente)
        let visualiza_flota: string = localStorage.getItem(
          "visualiza_flota_intermediario"
        );
        let esDadorCupo: string = localStorage.getItem("esDadorCupo");
        let esIntermediario: boolean =
          localStorage.getItem("esIntermediario") == "true" ? true : false;
        let visualizaLog: boolean =
          localStorage.getItem("visualizaLog") == "true" ? true : false;
        let visualizaTurneada: boolean =
          localStorage.getItem("tipo_turneada") == "0" ? false : true;
        let visualizaTurneadaOrdenLlegada: boolean =
          localStorage.getItem("tipo_turneada") !== "2" ? false : true;
        let visualizaTurneadaHistoricoViaje: boolean =
          localStorage.getItem("tipo_turneada") !== "1" ? false : true;
        let esClienteFinal: boolean =
          localStorage.getItem("esClienteFinal") !== "1" ? false : true;
        let usuarioWhatsapp1 =
          localStorage.getItem("linea_whats_app") === "1" ? true : false;
        switch (cliente) {
          case "1": //clienteMuvin this.menuItems = this.navService.otromenucentro;
            //this.navService.menucentro$
            let menu = [];
            this.menuItems = [...this.menuItems];

            this.menuItemsSub = this.navService.menucentrov$.subscribe(
              (menuItem) => {
                //console.log(menuItem)
                this.menuItems = menuItem;
                if (visualiza_flota === "1") {
                  //adicionar las opciones de que visualiza_flota.
                  this.menuItemsSub =
                    this.navService.menucentroVisualizaFlota$.subscribe(
                      (menuItemV) => {
                        this.addMenuOpcion(this.menuItems, menuItemV);
                        this.hasIconTypeMenuItem = !!this.menuItems.filter(
                          (item) => item.type === "icon"
                        ).length;
                        //this.menuItems = menuItemV;
                      }
                    );
                }
                if (esDadorCupo === "1") {
                  //adicionar las opciones de que visualiza_flota.
                  this.menuItemsSub =
                    this.navService.menucentroDador$.subscribe((menuItemV) => {
                      this.addMenuOpcion(this.menuItems, menuItemV);
                      this.hasIconTypeMenuItem = !!this.menuItems.filter(
                        (item) => item.type === "icon"
                      ).length;
                      //this.menuItems = menuItemV;
                    });
                }
                if (esIntermediario) {
                  //adicionar las opciones de que visualiza_flota.
                  this.menuItemsSub =
                    this.navService.menucentroIntermediario$.subscribe(
                      (menuItemV) => {
                        this.addMenuOpcion(this.menuItems, menuItemV);
                        this.hasIconTypeMenuItem = !!this.menuItems.filter(
                          (item) => item.type === "icon"
                        ).length;
                        //this.menuItems = menuItemV;
                      }
                    );
                }
                if (visualizaLog) {
                  //adicionar las opciones de que visualiza_flota.
                  this.menuItemsSub = this.navService.menucentroLog$.subscribe(
                    (menuItemV) => {
                      this.addMenuOpcion(this.menuItems, menuItemV);
                      this.hasIconTypeMenuItem = !!this.menuItems.filter(
                        (item) => item.type === "icon"
                      ).length;
                      //this.menuItems = menuItemV;
                    }
                  );
                }
                if (esClienteFinal) {
                  //adicionar las opciones de que visualiza_flota.
                  this.menuItemsSub =
                    this.navService.menucentroClienteFinal$.subscribe(
                      (menuItemV) => {
                        this.addMenuOpcion(this.menuItems, menuItemV);
                        this.hasIconTypeMenuItem = !!this.menuItems.filter(
                          (item) => item.type === "icon"
                        ).length;
                        //this.menuItems = menuItemV;
                      }
                    );
                }
                if (visualizaTurneada) {
                  //adicionar las opciones de que visualiza_flota.
                  this.menuItemsSub =
                    this.navService.menucentroTurneada$.subscribe(
                      (menuItemV) => {
                        this.addMenuOpcion(this.menuItems, menuItemV);
                        this.hasIconTypeMenuItem = !!this.menuItems.filter(
                          (item) => item.type === "icon"
                        ).length;
                        //this.menuItems = menuItemV;
                      }
                    );
                }
                if (visualizaTurneadaOrdenLlegada) {
                  //adicionar las opciones de que visualiza_flota.
                  this.menuItemsSub =
                    this.navService.menucentroTurneadaOrdenLlegada$.subscribe(
                      (menuItemV) => {
                        this.addMenuOpcion(this.menuItems, menuItemV);
                        this.hasIconTypeMenuItem = !!this.menuItems.filter(
                          (item) => item.type === "icon"
                        ).length;
                        //this.menuItems = menuItemV;
                      }
                    );
                }
                if (visualizaTurneadaHistoricoViaje) {
                  //adicionar las opciones de que visualiza_flota.
                  this.menuItemsSub =
                    this.navService.menucentroTurneadaHistoricoViaje$.subscribe(
                      (menuItemV) => {
                        this.addMenuOpcion(this.menuItems, menuItemV);
                        this.hasIconTypeMenuItem = !!this.menuItems.filter(
                          (item) => item.type === "icon"
                        ).length;
                        //this.menuItems = menuItemV;
                      }
                    );
                }
                if (usuarioWhatsapp1) {
                  //adicionar las opciones de que visualiza_flota.
                  this.menuItemsSub =
                    this.navService.menucentroLineaWhatsapp$.subscribe(
                      (menuItemV) => {
                        this.addMenuOpcion(this.menuItems, menuItemV);
                        this.hasIconTypeMenuItem = !!this.menuItems.filter(
                          (item) => item.type === "icon"
                        ).length;
                        //this.menuItems = menuItemV;
                      }
                    );
                }

                this.menuItemsSub = this.navService.menucentroSalir$.subscribe(
                  (menuItemV) => {
                    this.addMenuOpcion(this.menuItems, menuItemV);
                    this.hasIconTypeMenuItem = !!this.menuItems.filter(
                      (item) => item.type === "icon"
                    ).length;
                  }
                );
                this.hasIconTypeMenuItem = !!this.menuItems.filter(
                  (item) => item.type === "icon"
                ).length;
              }
            );

            break;
          case "2": //centro libre
            this.menuItemsSub = this.navService.menucentro_libre$.subscribe(
              (menuItem) => {
                this.menuItems = menuItem;
                this.hasIconTypeMenuItem = !!this.menuItems.filter(
                  (item) => item.type === "icon"
                ).length;
              }
            );
            break;
          default:
            //centro no usuario.
            this.menuItemsSub = this.navService.menucentro_no_user$.subscribe(
              (menuItem) => {
                this.menuItems = menuItem;
                //Checks item list has any icon type.
                this.hasIconTypeMenuItem = !!this.menuItems.filter(
                  (item) => item.type === "icon"
                ).length;
              }
            );
            break;
        }
        break;
      case "4":
        this.menuItemsSub = this.navService.menutransportista$.subscribe(
          (menuItem) => {
            this.menuItems = menuItem;
            //Checks item list has any icon type.
            this.hasIconTypeMenuItem = !!this.menuItems.filter(
              (item) => item.type === "icon"
            ).length;
          }
        );
        break;
      case "5":
        this.menuItemsSub = this.navService.menudador$.subscribe((menuItem) => {
          this.menuItems = menuItem;
          //Checks item list has any icon type.
          this.hasIconTypeMenuItem = !!this.menuItems.filter(
            (item) => item.type === "icon"
          ).length;
        });
        break;
      case "6":
        this.menuItemsSub = this.navService.menudestinatario$.subscribe(
          (menuItem) => {
            this.menuItems = menuItem;
            //Checks item list has any icon type.
            this.hasIconTypeMenuItem = !!this.menuItems.filter(
              (item) => item.type === "icon"
            ).length;
          }
        );
        break;
      case "7":
        this.menuItemsSub = this.navService.menudestino$.subscribe(
          (menuItem) => {
            this.menuItems = menuItem;
            //Checks item list has any icon type.
            this.hasIconTypeMenuItem = !!this.menuItems.filter(
              (item) => item.type === "icon"
            ).length;
          }
        );
        break;
      case "11":
        this.menuItemsSub = this.navService.menuoperador$.subscribe(
          (menuItem) => {
            this.menuItems = menuItem;
            //Checks item list has any icon type.
            this.hasIconTypeMenuItem = !!this.menuItems.filter(
              (item) => item.type === "icon"
            ).length;
          }
        );
        break;
      case "12":
        this.menuItemsSub = this.navService.menuconsultor$.subscribe(
          (menuItem) => {
            this.menuItems = menuItem;
            //Checks item list has any icon type.
            this.hasIconTypeMenuItem = !!this.menuItems.filter(
              (item) => item.type === "icon"
            ).length;
          }
        );
        break;
      case "13":
        this.menuItemsSub = this.navService.menumarketing$.subscribe(
          (menuItem) => {
            this.menuItems = menuItem;
            //Checks item list has any icon type.
            this.hasIconTypeMenuItem = !!this.menuItems.filter(
              (item) => item.type === "icon"
            ).length;
          }
        );
        break;
      case "14":
        this.menuItemsSub = this.navService.menumagyp$.subscribe((menuItem) => {
          this.menuItems = menuItem;
          //Checks item list has any icon type.
          this.hasIconTypeMenuItem = !!this.menuItems.filter(
            (item) => item.type === "icon"
          ).length;
        });
        break;
        case "15":
        //Checks item list has any icon type.
        this.menuItemsSub = this.navService.menufertilizantes$.subscribe(
          (menuItem) => {
            this.menuItems = menuItem;
            this.hasIconTypeMenuItem = !!this.menuItems.filter(
              (item) => item.type === "icon"
            ).length;
            //console.log(menuItem)
          }

          
        );
        break;
      case "16":
        this.menuItemsSub = this.navService.menumtr$.subscribe((menuItem) => {
          this.menuItems = menuItem;
          this.hasIconTypeMenuItem = !!this.menuItems.filter(
            (item) => item.type === "icon"
          ).length;
        });
        break;
      
      default:
        this.menuItemsSub = this.navService.menuBlank$.subscribe((menuItem) => {
          this.menuItems = menuItem;
          //Checks item list has any icon type.
          this.hasIconTypeMenuItem = !!this.menuItems.filter(
            (item) => item.type === "icon"
          ).length;
        });
        break;
    }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.sidebarPS = new PerfectScrollbar("#scroll-area", {
        suppressScrollX: true,
      });
    });
  }

  menuCentro() {
    let token: string = localStorage.getItem("token");
    this.ruta_logo =
      this.globalService.apiHost + "centro/imagen-down?r=" + token;
    localStorage.setItem("imagen", this.ruta_logo);
    let cliente: string = localStorage.getItem("clienteMuvin");
    let visualiza_flota: string = localStorage.getItem(
      "visualiza_flota_intermediario"
    );
    let esDadorCupo: string = localStorage.getItem("esDadorCupo");
    let esIntermediario: boolean =
      localStorage.getItem("esIntermediario") == "true" ? true : false;
    let visualizaLog: boolean =
      localStorage.getItem("visualizaLog") == "true" ? true : false;
    let visualizaTurneadaOrdenLlegada: boolean =
      localStorage.getItem("tipo_turneada") !== "2" ? false : true;
    let visualizaTurneadaHistoricoViaje: boolean =
      localStorage.getItem("tipo_turneada") !== "1" ? false : true;
    switch (cliente) {
      case "1": //clienteMuvin this.menuItems = this.navService.otromenucentro;
        //this.navService.menucentro$
        let menu = [];
        this.menuItems = [...this.menuItems];

        this.menuItemsSub = this.navService.menucentrov$.subscribe(
          (menuItem) => {
            this.menuItems = menuItem;
            if (visualiza_flota === "1") {
              //adicionar las opciones de que visualiza_flota.
              this.menuItemsSub =
                this.navService.menucentroVisualizaFlota$.subscribe(
                  (menuItemV) => {
                    this.addMenuOpcion(this.menuItems, menuItemV);
                    this.hasIconTypeMenuItem = !!this.menuItems.filter(
                      (item) => item.type === "icon"
                    ).length;
                    //this.menuItems = menuItemV;
                  }
                );
            }
            if (esDadorCupo === "1") {
              //adicionar las opciones de que visualiza_flota.
              this.menuItemsSub = this.navService.menucentroDador$.subscribe(
                (menuItemV) => {
                  this.addMenuOpcion(this.menuItems, menuItemV);
                  this.hasIconTypeMenuItem = !!this.menuItems.filter(
                    (item) => item.type === "icon"
                  ).length;
                  //this.menuItems = menuItemV;
                }
              );
            }
            if (esIntermediario) {
              //adicionar las opciones de que visualiza_flota.
              this.menuItemsSub =
                this.navService.menucentroIntermediario$.subscribe(
                  (menuItemV) => {
                    this.addMenuOpcion(this.menuItems, menuItemV);
                    this.hasIconTypeMenuItem = !!this.menuItems.filter(
                      (item) => item.type === "icon"
                    ).length;
                    //this.menuItems = menuItemV;
                  }
                );
            }
            if (visualizaLog) {
              //adicionar las opciones de que visualiza_flota.
              this.menuItemsSub = this.navService.menucentroLog$.subscribe(
                (menuItemV) => {
                  this.addMenuOpcion(this.menuItems, menuItemV);
                  this.hasIconTypeMenuItem = !!this.menuItems.filter(
                    (item) => item.type === "icon"
                  ).length;
                  //this.menuItems = menuItemV;
                }
              );
            }
            if (this.esQuitarTurneada) {
              //adicionar las opciones de que visualiza_flota.
              this.menuItemsSub = this.navService.menucentroTurneada$.subscribe(
                (menuItemV) => {
                  this.quitarMenuOpcion(this.menuItems, menuItemV);
                  this.hasIconTypeMenuItem = !!this.menuItems.filter(
                    (item) => item.type === "icon"
                  ).length;
                  //this.menuItems = menuItemV;
                }
              );
            }
            if (
              this.esQuitarTurneada ||
              visualizaTurneadaOrdenLlegada ||
              visualizaTurneadaHistoricoViaje
            ) {
              //adicionar las opciones de que visualiza_flota.
              this.menuItemsSub =
                this.navService.menucentroTurneadaOrdenLlegada$.subscribe(
                  (menuItemV) => {
                    this.quitarMenuOpcion(this.menuItems, menuItemV);
                    this.hasIconTypeMenuItem = !!this.menuItems.filter(
                      (item) => item.type === "icon"
                    ).length;
                    //this.menuItems = menuItemV;
                  }
                );
            }
            if (this.esQuitarLineaWhatsapp) {
              //adicionar las opciones de que visualiza_flota.
              this.menuItemsSub =
                this.navService.menucentroLineaWhatsapp$.subscribe(
                  (menuItemV) => {
                    this.quitarMenuOpcion(this.menuItems, menuItemV);
                    this.hasIconTypeMenuItem = !!this.menuItems.filter(
                      (item) => item.type === "icon"
                    ).length;
                    //this.menuItems = menuItemV;
                  }
                );
            }
            this.menuItemsSub = this.navService.menucentroSalir$.subscribe(
              (menuItemV) => {
                this.addMenuOpcion(this.menuItems, menuItemV);
                this.hasIconTypeMenuItem = !!this.menuItems.filter(
                  (item) => item.type === "icon"
                ).length;
                //this.menuItems = menuItemV;
              }
            );
            this.hasIconTypeMenuItem = !!this.menuItems.filter(
              (item) => item.type === "icon"
            ).length;
          }
        );
        break;
    }
  }
  cambioImagen() {
    this.ruta_logo = localStorage.getItem("imagen");
  }

  downloadImagen() {
    this.fileUploadService.getImagen().subscribe((res: any) => {
      localStorage.setItem("imagen2", res);
      this.ruta_logo = res;
    });
  }
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        this.ruta_logo = reader.result;
      },
      false
    );
    if (image) {
      reader.readAsDataURL(image);
    }
  }
  addMenuOpcion(menuItem, menuItemR) {
    for (let index = 0; index < menuItemR.length; index++) {
      const element = menuItemR[index];
      let enc = false;

      if (menuItem) {
        for (let i = 0; i < menuItem.length; i++) {
          const elementMenu = menuItem[i];
          if (element.name == elementMenu.name) {
            enc = true;
            //lo encontre pero tengo que analizar si tiene sub
            if (element.sub) {
              if (element.sub.length > 0) {
                element.sub.forEach((elem) => {
                  let encontrarSub = false;
                  let indiceEnc = 0;
                  for (let j = 0; j < elementMenu.sub.length; j++) {
                    const el = elementMenu.sub[j];
                    if (elem.name == el.name) {
                      encontrarSub = true;
                      indiceEnc = j;
                      //lo encontre pero tengo que analizar si tiene sub
                      if (elem.sub) {
                        if (elem.sub.length > 0) {
                          let encontrarSub1 = false;
                          elem.sub.forEach((sub_elem) => {
                            encontrarSub1 = false;
                            el.sub.forEach((sub_el) => {
                              if (sub_elem.name == sub_el.name) {
                                encontrarSub1 = true;
                              }
                            });
                            if (!encontrarSub1)
                              menuItem[i].sub[indiceEnc].sub.push(sub_elem);
                          });
                        }
                      }
                    }
                  }
                  if (!encontrarSub) {
                    menuItem[i].sub.push(elem);
                  } else {
                    menuItem[i].sub[indiceEnc].state = elem.state;
                  }
                });
              } else {
                // no tiene sub
                menuItem[i].state = element.state;
              }
            } else {
              element.disabled = false;
            }
          }
        }
        if (!enc) {
          //no encontre el element en el menu
          element.disabled = false;
          menuItem.push(element); //no la encontre, por tanto añadir.
        }
      }
    }
    return menuItem;
  }
  quitarMenuOpcion(menuItem, menuItemR) {
    let menuIt = [];
    for (let index = 0; index < menuItemR.length; index++) {
      const element = menuItemR[index];
      let enc = false;
      for (let i = 0; i < menuItem.length; i++) {
        const elementMenu = menuItem[i];
        if (element.name !== elementMenu.name) {
          menuIt.push(elementMenu);
        } else {
          enc = true;
          if (element.sub) {
            if (element.sub.length > 0) {
              //busco el subMenu para quitarlo
              let newArray = [];
              element.sub.forEach((elem) => {
                for (let j = 0; j < elementMenu.sub.length; j++) {
                  const el = elementMenu.sub[j];
                  if (elem.name !== el.name) {
                    newArray.push(el);
                  }
                }
                elementMenu.sub = newArray;
                menuIt.push(elementMenu);
              });
            }
          } else {
            element.disabled = true;
          }
        }
        //aqui
      }
    }
    return menuIt;
  }
  mostrarPerfil() {
    let dialogRef: MatDialogRef<any> = this.dialog.open(PerfilComponent, {
      width: "720px",
      disableClose: true,
      data: { title: "Perfil", payload: {} },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
    });
  }
}
