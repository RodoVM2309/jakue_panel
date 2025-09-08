import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { AppAlertService } from "../../../shared/services/app-alert/app-alert.service";
import { MatDialogRef, MatDialog, MatSnackBar } from "@angular/material";
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { Subscription } from "rxjs";
import { VincularEquipoComponent } from "../vincular-transporte-chofer/vincular-equipo/vincular-equipo.component";
import { TransporteChoferService } from "./../../../shared/services/transporte-chofer.service";
import { CentrosService } from "./../../../shared/services/centros.service";
import { VincularZonaComponent } from "./vincular-zona/vincular-zona.component";
import { InfoPersonaComponent } from "./../personas/info-persona/info-persona.component";
import { AddListaNegraComponent } from "./add-lista-negra/add-lista-negra.component";
import { Page } from "../../../shared/models/page";
import { ChoferZona } from "../../../shared/models/chofer-zona";
import { PersonasService } from "./../../../shared/services/personas.service";
import { AppErrorService } from "../../../shared/services/app-error/app-error.service";
import { ExelService } from "../../../shared/services/exel.service";

@Component({
  selector: "app-vincular-zona-chofer",
  templateUrl: "./vincular-zona-chofer.component.html",
  styleUrls: ["./vincular-zona-chofer.component.scss"],
})
export class VincularZonaChoferComponent implements OnInit, OnDestroy {
  public choferes: ChoferZona[];
  public allchoferes: ChoferZona[];
  page = new Page();
  public getItemSub: Subscription;
  public totalChoferes: number = 0;
  public totalApp: number = 0;
  public totalChoferesOcupados: number = 0;
  filtro = {
    patente: "",
    cuit: "",
    transportista: "",
    nombre: "",
  };
  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Registros</span>
      </div>
    `,
  };

  constructor(
    private centrosService: CentrosService,
    public router: Router,
    private dialog: MatDialog,
    public personasService: PersonasService,
    private excelService: ExelService,
    private transportechoferService: TransporteChoferService,
    private errorService: AppErrorService,
    private loader: AppLoaderService,
    private alertService: AppAlertService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.getTotales();
    this.setPage({ offset: 0 });
    //this.getAllChoferesCentro();
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  getAllChoferesCentro() {
    this.centrosService.getAllChoferesCentro().subscribe((pagedData) => {
      this.allchoferes = pagedData.data;
    });
  }

  exportAsXLSX(): void {
    let array_exp = [];
    this.centrosService.getAllChoferesCentro().subscribe((pagedData) => {
      this.allchoferes = pagedData.data;
      if (this.allchoferes.length > 0) {
        for (let i = 0; i < this.allchoferes.length; i++) {
          let exportar = {
            Nombre: this.allchoferes[i].nombre_persona,
            Teléfono: this.allchoferes[i].celular,
            Chapa_Camión: this.allchoferes[i].patente,
            Chapa_Acoplado: this.allchoferes[i].patente_acoplado,
            Cedula_Identidad: this.allchoferes[i].cuit_persona,
            Transportista: this.allchoferes[i].nombre_transportista,
            Estado: this.allchoferes[i].estado,
          };
          array_exp.push(exportar);
        }
        this.excelService.exportAsExcelFile(
          array_exp,
          "Listado Flota administrada "
        );
      }
    });
  }

  getTotales() {
    this.centrosService.getTotalAppChoferesDescargada().subscribe((data) => {
      this.totalApp = data.data.choferes_app_instalada;
      this.totalChoferesOcupados = data.data.choferes_ocupados;
      this.totalChoferes = data.data.total_choferes;
    });
  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro === undefined) {
      this.filtro = {
        patente: "",
        cuit: "",
        transportista: "",
        nombre: "",
      };
    }
    this.centrosService
      .getChoferesCentro(this.page.pageNumber, this.filtro)
      .subscribe((pagedData) => {
        this.choferes = pagedData.data;
        for (let i = 0; i < this.choferes.length; i++) {
          if (this.choferes[i].zona_activa !== null) {
            this.choferes[i].nombre_zona =
              this.choferes[i].zona_activa.descripcion;
            this.choferes[i].id_zona = this.choferes[i].zona_activa.id;
          }
          this.choferes[i].desc_app =
            this.choferes[i].app_instalada === 0 ? "No" : "Si";
        }
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage;
        this.page.size = pagedData._meta.perPage;
      });
  }
  openPopUpVincularZona(data: any = {}) {
    let title = "Vincular Zona al Chofer";
    let dialogRef: MatDialogRef<any> = this.dialog.open(VincularZonaComponent, {
      width: "320px",
      disableClose: true,
      data: { title: title, payload: data },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.loader.open();
      if (res.id !== "") {
        this.centrosService.updateChoferZona(res).subscribe(
          (data) => {
            if (data.success) {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.setPage({ offset: 0 });
              this.alertService
                .confirm({ message: "¡Chofer actualizado!", tipo: "exito" })
                .subscribe((res) => {
                  if (res) {
                    return;
                  }
                });
            } else {
              this.errorService.confirm({
                message: "Error:" + data.data + "!",
              });
            }
          },
          (err) => {
            this.errorService.confirm({ message: "Error:" + err + "!" });
            return;
          }
        );
      } else {
        this.centrosService.postChoferZona(res).subscribe(
          (data) => {
            if (data.success) {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.setPage({ offset: 0 });
              this.alertService
                .confirm({ message: "¡Chofer actualizado!", tipo: "exito" })
                .subscribe((res) => {
                  if (res) {
                    return;
                  }
                });
            } else {
              this.errorService.confirm({
                message: "Error:" + data.data + "!",
              });
            }
          },
          (err) => {
            this.errorService.confirm({ message: "Error:" + err });
            return;
          }
        );
      }
    });
  }
  openPopUpVincularEquipo(data: any = {}) {
    this.loader.open();
    let isCentro = localStorage.getItem("rol") === "3" ? true : false;
    this.personasService.getChoferById(data.id, isCentro).subscribe(
      (data) => {
        if (data.success) {
          if (this.loader !== null) {
            this.loader.close();
          }
          if (data.data.chofer.estado === "Ocupado") {
            this.errorService.confirm({
              message:
                "¡No se puede cambiar de equipo al chofer porque el mismo está en un viaje!",
            });
            return;
          } else {
            let title = "Vincular Equipo al Chofer";
            let dialogRef: MatDialogRef<any> = this.dialog.open(
              VincularEquipoComponent,
              {
                width: "320px",
                disableClose: true,
                data: { title: title, payload: data },
              }
            );
            dialogRef.afterClosed().subscribe((res) => {
              if (!res) {
                // If user press cancel
                return;
              }
              this.loader.open();
              //if (res.id !== 0) {
              if (res.id_equipo === 0) {
                res.id_equipo = null;
              }
              let dat = {
                id: res.id,
                id_chofer: res.id_chofer,
                id_equipo: res.id_equipo,
              };
              if (localStorage.getItem("rol") === "3") {
                this.transportechoferService
                  .updateChoferEquipoFromCentro(dat)
                  .subscribe(
                    (data) => {
                      if (data.success) {
                        if (this.loader !== null) {
                          this.loader.close();
                        }
                        this.setPage({ offset: 0 });
                        this.alertService
                          .confirm({
                            message: "¡Chofer actualizado!",
                            tipo: "exito",
                          })
                          .subscribe((res) => {
                            if (res) {
                              return;
                            }
                          });
                      } else {
                        this.loader.close();
                        this.errorService.confirm({
                          message: "¡No se puede actualizar el Chofer!",
                        });
                      }
                    },
                    (err) => {
                      this.loader.close();
                      this.errorService.confirm({
                        message: "¡No se puede actualizar el Chofer!",
                      });
                      return;
                    }
                  );
              } else {
                this.transportechoferService.updateChoferEquipo(res).subscribe(
                  (data) => {
                    if (data.success) {
                      if (this.loader !== null) {
                        this.loader.close();
                      }
                      this.setPage({ offset: 0 });
                      this.alertService
                        .confirm({
                          message: "¡Chofer actualizado!",
                          tipo: "exito",
                        })
                        .subscribe((res) => {
                          if (res) {
                            return;
                          }
                        });
                    } else {
                      this.errorService.confirm({
                        message: "¡No se puede actualizar el Chofer!",
                      });
                    }
                  },
                  (err) => {
                    this.errorService.confirm({
                      message: "¡No se puede actualizar el Chofer!",
                    });
                    return;
                  }
                );
              }
              /*  } else {
                   if (res.id_equipo !== 0) {
                     this.transportechoferService.postChoferEquipo(res)
                       .subscribe(data => {
                         if (data.success) {
                           if (this.loader !== null) {
                             this.loader.close();
                           }
                           this.setPage({ offset: 0 });
                           this.alertService.confirm({ message: '¡Chofer actualizado!', tipo: 'exito' }).subscribe(res => {
                             if (res) {
                               return;
                             }
                           });
                         } else {
                           this.errorService.confirm({ message: '¡No se puede actualizar el Chofer!' });
                         }
                       }, err => {
                         this.errorService.confirm({ message: '¡No se puede actualizar el Chofer!' });
                         return;
                       });
                   }
                 } */
            });
          }
        } else {
          this.loader.close();
          this.errorService.confirm({
            message: "¡No se puede actualizar el Chofer!",
          });
        }
      },
      (err) => {
        this.loader.close();
        this.errorService.confirm({
          message: "¡No se puede actualizar el Chofer!",
        });
      }
    );
  }

  openPopUpAddBlackList(data: any = {}) {
    // Primero verificar si el chofer ya está en lista negra
    this.loader.open();
    const verificarData = {
      id_chofer: data.id_usuario,
      id_destino: 1, // Valor por defecto
    };

    this.centrosService.verificarChoferListaNegra(verificarData).subscribe(
      (verifyResponse) => {
        if (this.loader !== null) {
          this.loader.close();
        }

        if (
          verifyResponse.success &&
          verifyResponse.data &&
          verifyResponse.data.ocurrencias &&
          verifyResponse.data.ocurrencias.length > 0
        ) {
          // El chofer ya está en lista negra (hay al menos una ocurrencia)
          this.errorService.confirm({
            message: "¡El chofer ya se encuentra en lista negra activa!",
          });
          return;
        }

        // Si no está en lista negra (no hay ocurrencias), continuar con el flujo normal
        let title = "Agregar a la lista Negra";
        let dialogRef: MatDialogRef<any> = this.dialog.open(
          AddListaNegraComponent,
          {
            width: "640px",
            disableClose: true,
            data: { title: title, payload: data },
          }
        );

        dialogRef.afterClosed().subscribe((res) => {
          if (!res) {
            // If user press cancel
            return;
          }
          this.loader.open();
          this.centrosService.postChoferListaNegra(res).subscribe(
            (data) => {
              if (data.success) {
                if (this.loader !== null) {
                  this.loader.close();
                }
                this.setPage({ offset: 0 });
                this.alertService
                  .confirm({
                    message: "¡Chofer agregado en la lista negra con éxito!",
                    tipo: "exito",
                  })
                  .subscribe((res) => {
                    if (res) {
                      return;
                    }
                  });
              } else {
                if (this.loader !== null) {
                  this.loader.close();
                }
                this.errorService.confirm({
                  message: "Error:" + data.data + "!",
                });
              }
            },
            (err) => {
              if (this.loader !== null) {
                this.loader.close();
              }
              this.errorService.confirm({ message: "Error:" + err });
              return;
            }
          );
        });
      },
      (err) => {
        if (this.loader !== null) {
          this.loader.close();
        }
        this.errorService.confirm({
          message: "Error al verificar el estado del chofer: " + err,
        });
        return;
      }
    );
  }

  updateFilter(event, param) {
    const val = event.target.value.toLowerCase();
    switch (param) {
      case "patente":
        this.filtro.patente = val;
        break;
      case "cuit":
        this.filtro.cuit = val;
        break;
      case "transportista":
        this.filtro.transportista = val;
        break;
      case "nombre":
        this.filtro.nombre = val;
        break;
      default:
        break;
    }
    this.setPage({ offset: 0 });
  }

  openPopUpInfoPersona(data: any = {}) {
    const title = "Información del perfil - Chofer";
    const dialogRef: MatDialogRef<any> = this.dialog.open(
      InfoPersonaComponent,
      {
        width: "720px",
        height: "73vh",
        disableClose: true,
        data: { title: title, payload: { id: data.id_usuario } },
      }
    );

    dialogRef.afterClosed().subscribe((res) => {
      return;
    });
  }
}
