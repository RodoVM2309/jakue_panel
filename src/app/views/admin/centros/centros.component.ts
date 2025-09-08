import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  Inject,
} from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import {
  MatDialogRef,
  MatDialog,
  MatSnackBar,
  MatRadioChange,
  MatPaginator,
  MatSort,
  MatTableDataSource,
  PageEvent,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { AppConfirmService } from "../../../shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { Subscription } from "rxjs";
import { AppAlertService } from "../../../shared/services/app-alert/app-alert.service";
import { CentrosService } from "./../../../shared/services/centros.service";
import { SituacionPuertoService } from "./../../../shared/services/situacion-puerto.service";
import { SituacionPuerto } from "./../../../shared/models/situacion-puerto";
import { NomencladoresService } from "./../../../shared/services/nomencladores.service";
import { ExelService } from "../../../shared/services/exel.service";
import { InfoPersonaComponent } from "./../personas/info-persona/info-persona.component";
import { Page } from "../../../shared/models/page";

import { AppErrorService } from "../../../shared/services/app-error/app-error.service";
import { AppAtencionService } from "../../../shared/services/app-atencion/app-atencion.service";
import { TipoCentrosComponent } from "./tipo-centros/tipo-centros.component";
import { SubirLogoCentroComponent } from "./subir-logo-centro/subir-logo-centro.component";
import { UserService } from "app/shared/services/user.service";

export class Centro {
  id: number;
  id_rol: number;
  id_usuario: number;
  nombre_persona: string;
  cuit_persona: string;
  direccion_persona: string;
  localidad_persona: string;
  nombre_rol: string;
  cliente_muvin: string;
  visualiza_flota_intermediario: string;
  ve_choferes_libres: string;
  dador_cupo: string;
  cliente_final: string;
  km: string;
  condiciones_viaje: number;
  condiciones: string;
  cargarTotalizadorChofer: {
    total_choferes: number;
    choferes_app_instalada: number;
  };
  desc_tipo?: string;
  linea_whats_app?: string;
  contratoRequerido?: string;
  usaCupera?: number;
  esDestinatario?: number;
  tipo_interviniente?: string;
}
@Component({
  selector: "app-centros",
  templateUrl: "./centros.component.html",
  styleUrls: ["./centros.component.scss"],
})
export class CentrosComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public centros: Centro[];
  public allCentros: Centro[];
  page = new Page();
  public getItemSub: Subscription;
  situaciones: SituacionPuerto[];
  selectSituacion: string;
  selectedDestino: Centro;
  filtro = "";
  filtro_cuit = "";
  temp = [];
  pageCount: number;
  displayedColumns: string[] = [
    "nombre_persona",
    "cuit_persona",
    "localidad_persona",
    "desc_tipo",
    "tipo_interviniente",
    "visualiza_flota_intermediario",
    "km",
    "condiciones",
    "ve_choferes_libres",
    "dador_cupo",
    "cliente_final",
    "linea_whatsapp",
    "contratoRequerido",
    "usaCupera",
    "asDestinatario",
    "acciones",
  ];
  dataSource = new MatTableDataSource();
  pageEvent: PageEvent = new PageEvent();

  tipoInterviniente = null;

  constructor(
    private centrosService: CentrosService,
    public router: Router,
    private dialog: MatDialog,
    private confirmService: AppConfirmService,
    private excelService: ExelService,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,
    private nomecladoresServices: NomencladoresService,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    private changeDetectorRefs: ChangeDetectorRef,
    private userService: UserService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    //this.getItems();
    this.paginator._intl.itemsPerPageLabel = "Centros por Página";
    this.paginator._intl.nextPageLabel = "Siguiente";
    this.paginator._intl.firstPageLabel = "Primero";
    this.paginator._intl.lastPageLabel = "Último Centro";
    this.paginator._intl.previousPageLabel = "Anterior";
    this.initPageEvent();
    this.setPage(this.pageEvent);
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
  initPageEvent() {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 10;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filtro = val;
    this.initPageEvent();
    this.setPage(this.pageEvent);
  }
  updateFilter1(event) {
    const val = event.target.value.toLowerCase();
    this.filtro_cuit = val;
    this.initPageEvent();
    this.setPage(this.pageEvent);
  }
  setPage(event?: PageEvent) {
    event.pageIndex++;
    this.centrosService
      .getAllCentros(event.pageIndex, this.filtro, this.filtro_cuit)
      .subscribe((pagedData) => {
        this.centros = this.temp = pagedData.data;
        for (let i = 0; i < this.centros.length; i++) {
          switch (this.centros[i].cliente_muvin.toString()) {
            case "1":
              this.centros[i].desc_tipo = "Centro Muvin";
              break;
            case "2":
              this.centros[i].desc_tipo = "Dador de Carga";
              break;
            default:
              this.centros[i].desc_tipo = "Centro No Cliente";
              break;
          }
          this.centros[i].condiciones =
            this.centros[i].condiciones_viaje.toString() === "0" ? "NO" : "SI";
          this.centros[i].visualiza_flota_intermediario =
            this.centros[i].visualiza_flota_intermediario.toString() === "0"
              ? "NO"
              : "SI";
          this.centros[i].ve_choferes_libres =
            this.centros[i].ve_choferes_libres.toString() === "0" ? "NO" : "SI";
          this.centros[i].dador_cupo =
            this.centros[i].dador_cupo.toString() === "0" ? "NO" : "SI";
          this.centros[i].cliente_final =
            this.centros[i].cliente_final.toString() === "0" ? "NO" : "SI";
          this.centros[i].km = this.centros[i].km == null ? "NO" : "SI";
          this.centros[i].linea_whats_app =
            this.centros[i].linea_whats_app.toString() === "0" ? "NO" : "SI";
          this.centros[i].contratoRequerido =
            this.centros[i].contratoRequerido.toString() === "0" ? "NO" : "SI";
        }
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage;
        this.pageEvent.length = pagedData._meta.totalCount;
        this.pageEvent.pageIndex = pagedData._meta.currentPage;
        this.pageEvent.pageSize = pagedData._meta.perPage;
        this.pageCount = pagedData._meta.pageCount;
        this.page.size = pagedData._meta.perPage;
        this.dataSource.data = this.centros;
        this.changeDetectorRefs.detectChanges();
      });
  }
  stopProp(e) {
    e.stopPropagation();
  }

  CambiarTipoCentro(row) {
    this.confirmService
      .confirm({
        message:
          "¿Está seguro de Modificar el tipo del Centro: " +
          row.nombre_persona +
          "?",
      })
      .subscribe((res) => {
        if (res) {
          this.openPopUpTipoCentro(row);
        }
      });
  }

  CambiarCondiciones(row) {
    const idCentro = row.id;
    const accion = row.condiciones === "NO" ? "poner" : "quitar";
    this.confirmService
      .confirm({
        message:
          "¿Está seguro de Modificar si tiene condiciones de viaje: " +
          row.nombre_persona +
          "?",
      })
      .subscribe((res) => {
        if (res) {
          if (accion === "poner") {
            this.loader.open();
            this.nomecladoresServices.postPonerCondiciones(row).subscribe(
              (data) => {
                this.loader.close();
                this.alertService
                  .confirm({
                    message:
                      "¡Modificado Centro para tener condiciones de viaje!",
                    tipo: "exito",
                  })
                  .subscribe((res) => {
                    if (res) {
                      this.pageEvent.pageIndex--;
                      this.setPage(this.pageEvent);
                      return;
                    }
                  });
              },
              (err) => {
                this.loader.close();
                this.errorService.confirm({
                  message: "Problemas Modificando el Centro" + err,
                });
              }
            );
          } else {
            this.loader.open();
            this.nomecladoresServices.postQuitarCondiciones(row).subscribe(
              (data) => {
                this.loader.close();
                this.atencionService
                  .confirm({
                    message: "El Centro ya no tienen condiciones de viaje!",
                    tipo: "exito",
                  })
                  .subscribe((res) => {
                    if (res) {
                      this.pageEvent.pageIndex--;
                      this.setPage(this.pageEvent);
                      return;
                    }
                  });
              },
              (err) => {
                this.loader.close();
                this.errorService.confirm({
                  message: "Problemas Modificando el Centro" + err,
                });
              }
            );
          }
        }
      });
  }
  CambiarVisualiza(row) {
    const accion =
      row.visualiza_flota_intermediario === "NO" ? "poner" : "quitar";
    this.confirmService
      .confirm({
        message:
          "¿Está seguro de Modificar si visualiza la flota de intermediarios: " +
          row.nombre_persona +
          "?",
      })
      .subscribe((res) => {
        if (res) {
          if (accion === "poner") {
            this.loader.open();
            this.nomecladoresServices.postPonerVisualiza(row).subscribe(
              (data) => {
                this.loader.close();
                this.alertService
                  .confirm({
                    message: "¡Modificado Centro para visulizar!",
                    tipo: "exito",
                  })
                  .subscribe((res) => {
                    if (res) {
                      this.pageEvent.pageIndex--;
                      this.setPage(this.pageEvent);
                      return;
                    }
                  });
              },
              (err) => {
                this.loader.close();
                this.errorService.confirm({
                  message: "Problemas Modificando el Centro" + err,
                });
              }
            );
          } else {
            this.loader.open();
            this.nomecladoresServices.postQuitarVisualiza(row).subscribe(
              (data) => {
                this.loader.close();
                this.atencionService
                  .confirm({
                    message: "El Centro ya no Visualiza!",
                    tipo: "exito",
                  })
                  .subscribe((res) => {
                    if (res) {
                      this.pageEvent.pageIndex--;
                      this.setPage(this.pageEvent);
                      return;
                    }
                  });
              },
              (err) => {
                this.loader.close();
                this.errorService.confirm({
                  message: "Problemas Modificando el Centro" + err,
                });
              }
            );
          }
        }
      });
  }
  CambiarVerLibres(row) {
    const accion = row.ve_choferes_libres === "NO" ? "poner" : "quitar";
    this.confirmService
      .confirm({
        message:
          "¿Está seguro de Modificar si centro " +
          row.nombre_persona +
          " puede ver la flota de los choferes libres (huérfanos) ?",
      })
      .subscribe((res) => {
        if (res) {
          if (accion === "poner") {
            this.loader.open();
            this.nomecladoresServices.postPonerVeChoferesLibres(row).subscribe(
              (data) => {
                this.loader.close();
                this.alertService
                  .confirm({
                    message: "¡Modificado Centro para ver los choferes libres!",
                    tipo: "exito",
                  })
                  .subscribe((res) => {
                    if (res) {
                      this.pageEvent.pageIndex--;
                      this.setPage(this.pageEvent);
                      return;
                    }
                  });
              },
              (err) => {
                this.loader.close();
                this.errorService.confirm({
                  message: "Problemas Modificando el Centro" + err,
                });
              }
            );
          } else {
            this.loader.open();
            this.nomecladoresServices.postQuitarVeChoferesLibres(row).subscribe(
              (data) => {
                this.loader.close();
                this.atencionService
                  .confirm({
                    message: "El Centro ya no ve los choferes libres!",
                    tipo: "exito",
                  })
                  .subscribe((res) => {
                    if (res) {
                      return;
                    }
                  });
              },
              (err) => {
                this.loader.close();
                this.errorService.confirm({
                  message: "Problemas Modificando el Centro" + err,
                });
              }
            );
          }
        }
      });
  }
  CambiarDadorCupo(row) {
    const accion = row.dador_cupo === "NO" ? "poner" : "quitar";
    this.confirmService
      .confirm({
        message:
          "¿Está seguro de Modificar si centro " +
          row.nombre_persona +
          " será dador de cupo ?",
      })
      .subscribe((res) => {
        if (res) {
          if (accion === "poner") {
            this.loader.open();
            this.nomecladoresServices.postPonerDadorCupo(row).subscribe(
              (data) => {
                this.loader.close();
                this.alertService
                  .confirm({
                    message: "¡Modificado Centro para que sea dador de cupo!",
                    tipo: "exito",
                  })
                  .subscribe((res) => {
                    if (res) {
                      this.pageEvent.pageIndex--;
                      this.setPage(this.pageEvent);
                      return;
                    }
                  });
              },
              (err) => {
                this.loader.close();
                this.errorService.confirm({
                  message: "Problemas Modificando el Centro",
                });
              }
            );
          } else {
            this.loader.open();
            this.nomecladoresServices.postQuitarDadorCupo(row).subscribe(
              (data) => {
                this.loader.close();
                this.atencionService
                  .confirm({
                    message: "El Centro ya no es dador de cupo!",
                    tipo: "exito",
                  })
                  .subscribe((res) => {
                    if (res) {
                      this.pageEvent.pageIndex--;
                      this.setPage(this.pageEvent);
                      return;
                    }
                  });
              },
              (err) => {
                this.loader.close();
                this.errorService.confirm({
                  message: "Problemas Modificando el Centro" + err,
                });
              }
            );
          }
        }
      });
  }
  CambiarClienteFinal(row) {
    const accion = row.cliente_final === "NO" ? "poner" : "quitar";
    this.confirmService
      .confirm({
        message:
          "¿Está seguro de Modificar si centro " +
          row.nombre_persona +
          " es Cliente Final ?",
      })
      .subscribe((res) => {
        if (res) {
          if (accion === "poner") {
            this.loader.open();
            this.nomecladoresServices.postPonerClienteFinal(row).subscribe(
              (data) => {
                this.loader.close();
                this.alertService
                  .confirm({
                    message: "¡Modificado Centro para que sea Cliente Final!",
                    tipo: "exito",
                  })
                  .subscribe((res) => {
                    if (res) {
                      this.pageEvent.pageIndex--;
                      this.setPage(this.pageEvent);
                      return;
                    }
                  });
              },
              (err) => {
                this.loader.close();
                this.errorService.confirm({
                  message: "Problemas Modificando el Centro" + err,
                });
              }
            );
          } else {
            this.loader.open();
            this.nomecladoresServices.postQuitarClienteFinal(row).subscribe(
              (data) => {
                this.loader.close();
                this.atencionService
                  .confirm({
                    message: "El Centro ya no es Cliente final!",
                    tipo: "exito",
                  })
                  .subscribe((res) => {
                    if (res) {
                      this.pageEvent.pageIndex--;
                      this.setPage(this.pageEvent);
                      return;
                    }
                  });
              },
              (err) => {
                this.loader.close();
                this.errorService.confirm({
                  message: "Problemas Modificando el Centro" + err,
                });
              }
            );
          }
        }
      });
  }
  CambiarLineaWhatsapp(row) {
    const accion = row.linea_whats_app === "NO" ? "poner" : "quitar";
    this.confirmService
      .confirm({
        message:
          "¿Está seguro de Modificar si centro " +
          row.nombre_persona +
          "tiene línea whatsapp ?",
      })
      .subscribe((res) => {
        if (res) {
          if (accion === "poner") {
            this.loader.open();

            this.nomecladoresServices.postPonerLineaWhatsapp(row).subscribe(
              (data) => {
                this.loader.close();
                this.alertService
                  .confirm({
                    message: "¡Modificado Centro con línea whatsapp!",
                    tipo: "exito",
                  })
                  .subscribe((res) => {
                    if (res) {
                      this.pageEvent.pageIndex--;
                      this.setPage(this.pageEvent);
                      return;
                    }
                    this.pageEvent.pageIndex--;
                    this.setPage(this.pageEvent);
                  });
              },
              (err) => {
                this.loader.close();
                this.errorService.confirm({
                  message: "Problemas Modificando el Centro" + err,
                });
              }
            );
          } else {
            this.loader.open();
            this.nomecladoresServices.postQuitarLineaWhatsapp(row).subscribe(
              (data) => {
                this.loader.close();
                this.atencionService
                  .confirm({
                    message: "El Centro ya no posee línea whatsapp!",
                    tipo: "exito",
                  })
                  .subscribe((res) => {
                    if (res) {
                      this.pageEvent.pageIndex--;
                      this.setPage(this.pageEvent);
                      return;
                    }
                    this.pageEvent.pageIndex--;
                    this.setPage(this.pageEvent);
                  });
              },
              (err) => {
                this.loader.close();
                this.errorService.confirm({
                  message: "Problemas Modificando el Centro" + err,
                });
              }
            );
          }
        }
      });
  }
  CambiarUsaCupera(row) {
    const accion = row.usaCupera === 1 ? "poner" : "quitar";

    let mensage =
      row.usaCupera === 1
        ? "¿Modificar que el centro " + row.nombre_persona + " use cupera 2.0 ?"
        : "¿Modificar que el centro " +
          row.nombre_persona +
          " no use cupera 2.0 ?";

    this.confirmService.confirm({ message: mensage }).subscribe((res) => {
      if (res) {
        if (accion === "poner") {
          this.loader.open();

          this.nomecladoresServices.postUsaCupera(row).subscribe(
            (data) => {
              this.loader.close();
              this.alertService
                .confirm({
                  message: "¡Modificado Centro para que use cupera 2.0!",
                  tipo: "exito",
                })
                .subscribe((res) => {
                  if (res) {
                    this.pageEvent.pageIndex--;
                    this.setPage(this.pageEvent);
                    return;
                  }
                  this.pageEvent.pageIndex--;
                  this.setPage(this.pageEvent);
                });
            },
            (err) => {
              this.loader.close();
              this.errorService.confirm({
                message: "Problemas Modificando el Centro" + err,
              });
            }
          );
        } else {
          this.loader.open();
          this.nomecladoresServices.postQuitarUsaCupera(row).subscribe(
            (data) => {
              this.loader.close();
              this.atencionService
                .confirm({
                  message: "¡El Centro ya no utiliza la cupera 2.0!",
                  tipo: "exito",
                })
                .subscribe((res) => {
                  if (res) {
                    this.pageEvent.pageIndex--;
                    this.setPage(this.pageEvent);
                    return;
                  }
                  this.pageEvent.pageIndex--;
                  this.setPage(this.pageEvent);
                });
            },
            (err) => {
              this.loader.close();
              this.errorService.confirm({
                message: "Problemas Modificando el Centro" + err,
              });
            }
          );
        }
      }
    });
  }
  CambiarEsDestinatario(row) {
    const accion = row.esDestinatario === 0 ? "poner" : "quitar";

    let mensage =
      row.esDestinatario === 0
        ? "¿Modificar que el centro " +
          row.nombre_persona +
          " no solicitar cupos ?"
        : "¿Modificar que el centro " +
          row.nombre_persona +
          " pueda solicitar cupos ?";

    this.confirmService.confirm({ message: mensage }).subscribe((res) => {
      if (res) {
        if (accion === "poner") {
          this.loader.open();

          this.nomecladoresServices.postEsDestinatario(row).subscribe(
            (data) => {
              this.loader.close();
              this.alertService
                .confirm({
                  message: "¡El Centro no podrá solicitar cupos!",
                  tipo: "exito",
                })
                .subscribe((res) => {
                  if (res) {
                    this.pageEvent.pageIndex--;
                    this.setPage(this.pageEvent);
                    return;
                  }
                  this.pageEvent.pageIndex--;
                  this.setPage(this.pageEvent);
                });
            },
            (err) => {
              this.loader.close();
              this.errorService.confirm({
                message: "Problemas Modificando el Centro" + err,
              });
            }
          );
        } else {
          this.loader.open();
          this.nomecladoresServices.postQuitarEsDestinatario(row).subscribe(
            (data) => {
              this.loader.close();
              this.atencionService
                .confirm({
                  message: "El Centro podrá solicitar cupos!",
                  tipo: "exito",
                })
                .subscribe((res) => {
                  if (res) {
                    this.pageEvent.pageIndex--;
                    this.setPage(this.pageEvent);
                    return;
                  }
                  this.pageEvent.pageIndex--;
                  this.setPage(this.pageEvent);
                });
            },
            (err) => {
              this.loader.close();
              this.errorService.confirm({
                message: "Problemas Modificando el Centro" + err,
              });
            }
          );
        }
      }
    });
  }
  CambiarKm(row) {
    const accion = row.km === "NO" ? "poner" : "quitar";
    this.confirmService
      .confirm({
        message:
          "¿Está seguro de Modificar la Inteligencia Logística de: " +
          row.nombre_persona +
          "?",
      })
      .subscribe((res) => {
        if (res) {
          if (accion === "poner") {
            this.loader.open();
            this.nomecladoresServices.postPonerKm(row).subscribe(
              (data) => {
                this.loader.close();
                this.alertService
                  .confirm({
                    message: "¡Modificado Centro para Inteligencia Logística!",
                    tipo: "exito",
                  })
                  .subscribe((res) => {
                    if (res) {
                      this.pageEvent.pageIndex--;
                      this.setPage(this.pageEvent);
                      return;
                    }
                  });
              },
              (err) => {
                this.loader.close();
                this.errorService.confirm({
                  message: "Problemas Modificando el Centro" + err,
                });
              }
            );
          } else {
            this.loader.open();
            this.nomecladoresServices.postQuitarKm(row).subscribe(
              (data) => {
                this.loader.close();
                this.atencionService
                  .confirm({
                    message: "El Centro ya no Inteligencia Logística!",
                    tipo: "exito",
                  })
                  .subscribe((res) => {
                    if (res) {
                      this.pageEvent.pageIndex--;
                      this.setPage(this.pageEvent);
                      return;
                    }
                  });
              },
              (err) => {
                this.loader.close();
                this.errorService.confirm({
                  message: "Problemas Modificando el Centro" + err,
                });
              }
            );
          }
        }
      });
  }

  openPopUpInfoPersona(data: any = {}) {
    let title = "Información del Perfil - Centro";
    let dialogRef: MatDialogRef<any> = this.dialog.open(InfoPersonaComponent, {
      width: "720px",
      height: "73vh",
      disableClose: true,
      data: { title: title, payload: { id: data.id_usuario } },
    });
    dialogRef.afterClosed().subscribe((res) => {
      return;
    });
  }

  openPopUpTipoCentro(data: any = {}) {
    let title = "Modificar tipo del Centro";
    let dialogRef: MatDialogRef<any> = this.dialog.open(TipoCentrosComponent, {
      width: "420px",
      disableClose: true,
      data: {
        title: title,
        payload: {
          id_usuario: data.id_usuario,
          cliente_muvin: data.cliente_muvin,
        },
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
      const datos = {
        id_usuario: res.id,
        cliente_muvin: res.tipo,
      };
      let desc_tipo = "Centro No Cliente";
      switch (res.tipo) {
        case 1:
          desc_tipo = "Centro Muvin";
          break;
        case 2:
          desc_tipo = "Dador de Carga";
          break;
        default:
          break;
      }
      this.loader.open();
      this.nomecladoresServices.putUsuario(datos).subscribe(
        (data) => {
          this.loader.close();
          // this.setPage(this.pageEvent);
          this.alertService
            .confirm({
              message: "¡Modificado Centro como tipo: " + desc_tipo + "!",
              tipo: "exito",
            })
            .subscribe((res) => {
              if (res) {
                this.pageEvent.pageIndex--;
                this.setPage(this.pageEvent);
                return;
              }
              this.pageEvent.pageIndex--;
              this.setPage(this.pageEvent);
            });
        },
        (err) => {
          this.loader.close();
          this.errorService.confirm({
            message: "Problemas Modificando el tipo del Centro" + err,
          });
        }
      );
    });
  }

  CambiarInterviniente(data: any = {}): void {
    const dialogRef = this.dialog.open(TipoIntervinientesDialog, {
      width: "250px",
      data: { tipoInterviniente: this.tipoInterviniente },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.tipoInterviniente = res;

      const datos = {
        id_usuario: data.id_usuario,
        tipo_interviniente: res,
      };

      this.loader.open();
      this.nomecladoresServices.putUsuarioInterviniente(datos).subscribe(
        (data) => {
          this.loader.close();
          this.pageEvent.pageIndex--;
          this.setPage(this.pageEvent);
          this.alertService
            .confirm({
              message: "¡Modificado el tipo de intervinente!",
              tipo: "exito",
            })
            .subscribe((res) => {
              if (res) {
                this.pageEvent.pageIndex--;
                this.setPage(this.pageEvent);
                return;
              }
            });
        },
        (err) => {
          this.loader.close();
          this.errorService.confirm({
            message: "Problemas Modificando el tipo de interviniente" + err,
          });
        }
      );
    });
  }

  subir(data) {
    let title = "Subir logo del centro";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      SubirLogoCentroComponent,
      {
        width: "720px",
        disableClose: true,
        data: { title: title, payload: data },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
    });
  }

  exportAsXLSX(): void {
    this.loader.open();
    let array_exp = [];
    if (this.centros.length > 0) {
      for (let i = 0; i < this.centros.length; i++) {
        let exportar = {
          Razon_Social: this.centros[i].nombre_persona,
          CUIT: this.centros[i].cuit_persona,
          Localidad: this.centros[i].localidad_persona,
          Tipo: this.centros[i].desc_tipo,
          Visualiza_Flota_intermediario: this.centros[i]
            .visualiza_flota_intermediario,
          Inteligencia_Logística: this.centros[i].km,
          Condiciones_de_viaje: this.centros[i].condiciones,
          Ve_Choferes_Libres: this.centros[i].ve_choferes_libres,
          Dador_Cupo: this.centros[i].dador_cupo,
          Cliente_Final: this.centros[i].cliente_final,
        };
        array_exp.push(exportar);
      }
      if (this.loader !== null) {
        this.loader.close();
      }
      this.excelService.exportAsExcelFile(array_exp, "Listado Centros");
    }
  }
  exportAsXLSX2(): void {
    this.loader.open();
    this.allCentros = [];
    let contador = 0;
    for (let index = 1; index < this.pageCount + 1; index++) {
      this.centrosService
        .getAllCentros(index, this.filtro, this.filtro_cuit)
        .subscribe((data) => {
          this.allCentros = data.data;
          contador++;
          for (let i = 0; i < data.data.length; i++) {
            let tempCentro = new Centro();
            tempCentro = data.data[i];

            switch (tempCentro.cliente_muvin.toString()) {
              case "1":
                tempCentro.desc_tipo = "Centro Muvin";
                break;
              case "2":
                tempCentro.desc_tipo = "Dador de Carga";
                break;
              default:
                tempCentro.desc_tipo = "Centro No Cliente";
                break;
            }
            tempCentro.condiciones =
              tempCentro.condiciones_viaje.toString() === "0" ? "NO" : "SI";
            tempCentro.visualiza_flota_intermediario =
              tempCentro.visualiza_flota_intermediario.toString() === "0"
                ? "NO"
                : "SI";
            tempCentro.ve_choferes_libres =
              tempCentro.ve_choferes_libres.toString() === "0" ? "NO" : "SI";
            tempCentro.dador_cupo =
              tempCentro.dador_cupo.toString() === "0" ? "NO" : "SI";
            tempCentro.cliente_final =
              tempCentro.cliente_final.toString() === "0" ? "NO" : "SI";
            tempCentro.km = tempCentro.km.toString() === "0" ? "NO" : "SI";
            this.allCentros.push(tempCentro);
          }
          if (contador == this.pageCount + 1) {
            let array_exp = [];
            if (this.allCentros.length > 0) {
              for (let i = 0; i < this.allCentros.length; i++) {
                let exportar = {
                  Razon_Social: this.allCentros[i].nombre_persona,
                  CUIT: this.allCentros[i].cuit_persona,
                  Localidad: this.allCentros[i].localidad_persona,
                  Tipo: this.allCentros[i].desc_tipo,
                  Visualiza_Flota_intermediario: this.allCentros[i]
                    .visualiza_flota_intermediario,
                  Inteligencia_Logística: this.allCentros[i].km,
                  Condiciones_de_viaje: this.allCentros[i].condiciones,
                  Ve_Choferes_Libres: this.allCentros[i].ve_choferes_libres,
                  Dador_Cupo: this.allCentros[i].dador_cupo,
                  Cliente_Final: this.allCentros[i].cliente_final,
                };
                array_exp.push(exportar);
              }
              if (this.loader !== null) {
                this.loader.close();
              }
              this.excelService.exportAsExcelFile(array_exp, "Listado Centros");
            }
          } else {
          }
        }),
        (err) => {
          this.loader.close();
          this.alertService.confirm({
            message: "Error: No se pudo buscar todos los centros ",
          });
        };
    }
  }

  contratoObligatorio(row) {
    const accion = row.contratoRequerido === "NO" ? 1 : 0;
    this.confirmService
      .confirm({
        message:
          "¿Está seguro de modificar que sea obligatorio el Contrato/Fijación en las demandas?",
      })
      .subscribe((res) => {
        if (res) {
          let datos = {
            id_centro: row.id,
            contratoRequerido: accion,
          };
          this.loader.open();
          this.getItemSub = this.nomecladoresServices
            .putConfiguracionCentroContrato(datos)
            .subscribe(
              (data) => {
                this.loader.close();
                this.alertService
                  .confirm({ message: "Modificado con éxito.", tipo: "exito" })
                  .subscribe((res1) => {
                    if (res1) {
                      this.pageEvent.pageIndex--;
                      this.setPage(this.pageEvent);
                      return;
                    }
                  });
              },
              (err) => {
                this.loader.close();
                this.errorService
                  .confirm({ message: "Error al modificar." })
                  .subscribe((res1) => {
                    if (res1) {
                      this.pageEvent.pageIndex--;
                      this.setPage(this.pageEvent);
                      return;
                    }
                  });
              }
            );
        }
      });
  }
}

export interface Intervinientes {
  value: string;
  viewValue: string;
}

@Component({
  selector: "tipoIntervinientes",
  templateUrl: "tipoIntervinientes.html",
})
export class TipoIntervinientesDialog {
  intervinientes: Intervinientes[] = [
    { value: "0", viewValue: "No Aplica" },
    { value: "1", viewValue: "Corredor" },
  ];

  selected = "0";

  constructor(
    public dialogRef: MatDialogRef<TipoIntervinientesDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
