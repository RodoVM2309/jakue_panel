import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material";
import { AppCaratulasDiferentesComponent } from "@app/shared/components/cupo/asignar-solicitud/asignar-solicitud.component";
import { CupoService } from "@app/shared/components/cupo/cupo.service";
import {
  CentroSinEMail,
  DiaSemana,
} from "@app/shared/components/cupo/cuponera/cuponera.component";
import { RechazarSolicitudComponent } from "@app/shared/components/cupo/rechazar-solicitud/rechazar-solicitud.component";
import { UsuarioSinEmailComponent } from "@app/shared/components/cupo/usuario-sin-email/usuario-sin-email.component";
import { HomeService } from "@app/shared/components/home/home.service";
import { Cabecera, Cupo } from "@app/shared/models";
import {
  AppAlertService,
  AppAtencionService,
  AppErrorService,
  AppLoaderService,
  CcppService,
  MessageService,
} from "@app/shared/services";
import { VerCabeceraComponent } from "@app/views/ccpp/cabecera/ver-cabecera/ver-cabecera.component";
import { VerCcppComponent } from "@app/views/ccpp/consulta/ver-ccpp/ver-ccpp.component";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { Items } from "../../models";

@Component({
  selector: "app-gestion",
  templateUrl: "./gestion.component.html",
  styleUrls: ["./gestion.component.scss"],
})
export class GestionComponent implements OnInit {
  @Input() variables;
  @Input() dias: DiaSemana[] = [];
  @Input() listSinEmail: CentroSinEMail[] = [];
  @Output() loadNotificacionesEvent = new EventEmitter();
  @Output() loadRecuperarEvent = new EventEmitter();
  @Input() cantNotificaciones;
  @Output() cambiarFecha = new EventEmitter();

  valorValidInput = 0;
  hoyMoment: moment.Moment = moment();
  hoyString = moment().format("YYYY-MM-DD");
  private subscription: Subscription;
  message: any;

  constructor(
    private atencionService: AppAtencionService,
    private ccppService: CcppService,
    private dialog: MatDialog,
    private cupoService: CupoService,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    private homeService: HomeService,
    private errorService: AppErrorService,
    private messageService: MessageService
  ) {
    this.subscription = this.messageService
      .getMessage()
      .subscribe((message) => {
        this.message = message;
        switch (this.message.text) {
          case "initOptionCupera3":
            this.inicializarOpciones();
            break;
          default:
            break;
        }
      });
  }

  ngOnInit() {}

  selectAccion(cmd) {
    this.variables.placeholderAccion = "";
    let error = true;
    switch (cmd.value) {
      case 0:
        this.variables.disabledCuposXModulos = false;
        this.variables.gestionForm.controls["cuposxModulos"].setValue(0);
        this.variables.validatedForm = false;
        this.variables.disabledSelectCabecera = false;
        this.variables.toolTipModulo = "Cupos por Módulos";
        break;
      case 1:
        this.variables.disabledCuposXModulos = true;
        this.variables.gestionForm.controls["cuposxModulos"].setValue("");
        this.variables.disabledSelectCabecera = false;
        let msg = "";
        let validacion = this.sumaColumn(0, "0");
        error = validacion.value;
        msg = validacion.dias;
        this.variables.toolTipModulo =
          "Este campo no es editable debido a que seleccionó la opción ASIGNAR TODOS";
        this.variables.validatedForm = true;

        break;
      case 2:
        this.variables.toolTipModulo =
          "Este campo no es editable debido a que seleccionó la opción RECHAZAR";
        this.variables.disabledCuposXModulos = true;
        this.variables.disabledSelectCabecera = true;
        this.variables.gestionForm.controls["selectedCabecera"].setValue("");
        this.variables.gestionForm.controls["cuposxModulos"].setValue("");
        this.variables.validatedForm = true;
        break;
      default:
        break;
    }
  }

  sumaColumn(value: number, tipo: string): { value: boolean; dias: string } {
    let error = false;
    let dias: string = "";
    let dia0_suma = 0;
    let dia1_suma = 0;
    let dia2_suma = 0;
    let dia3_suma = 0;
    let dia4_suma = 0;
    let dia0_cantidad = 0;
    let dia1_cantidad = 0;
    let dia2_cantidad = 0;
    let dia3_cantidad = 0;
    let dia4_cantidad = 0;
    this.variables.preAsignacion.forEach((element) => {
      let valor = tipo === "1" ? value : element.cantidad;
      switch (element.dia) {
        case "0":
          dia0_suma = dia0_suma + valor;
          dia0_cantidad = dia0_cantidad + element.cantidad;
          break;
        case "1":
          dia1_suma = dia1_suma + valor;
          dia1_cantidad = dia1_cantidad + element.cantidad;
          break;
        case "2":
          dia2_suma = dia2_suma + valor;
          dia2_cantidad = dia2_cantidad + element.cantidad;
          break;
        case "3":
          dia3_suma = dia3_suma + valor;
          dia3_cantidad = dia3_cantidad + element.cantidad;
          break;
        case "4":
          dia4_suma = dia4_suma + valor;
          dia4_cantidad = dia4_cantidad + element.cantidad;
          break;
        default:
          break;
      }
    });
    if (dia0_suma > 0) {
      if (dia0_suma > this.variables.selectedItemAsignacion.dia0.asignados) {
        error = true;
        dias =
          dias.length > 0
            ? dias +
              ", " +
              this.dias[0].dia_semana_string +
              "." +
              this.dias[0].dia +
              "/" +
              this.dias[0].mes
            : this.dias[0].dia_semana_string +
              "." +
              this.dias[0].dia +
              "/" +
              this.dias[0].mes;
      }
    }
    if (dia1_suma > 0) {
      if (dia1_suma > this.variables.selectedItemAsignacion.dia1.asignados) {
        error = true;
        dias =
          dias.length > 0
            ? dias +
              ", " +
              this.dias[1].dia_semana_string +
              "." +
              this.dias[1].dia +
              "/" +
              this.dias[1].mes
            : this.dias[1].dia_semana_string +
              "." +
              this.dias[1].dia +
              "/" +
              this.dias[1].mes;
      }
    }
    if (dia2_suma > 0) {
      if (dia2_suma > this.variables.selectedItemAsignacion.dia2.asignados) {
        dias =
          dias.length > 0
            ? dias +
              ", " +
              this.dias[2].dia_semana_string +
              "." +
              this.dias[2].dia +
              "/" +
              this.dias[2].mes
            : this.dias[2].dia_semana_string +
              "." +
              this.dias[2].dia +
              "/" +
              this.dias[2].mes;
        error = true;
      }
    }
    if (dia3_suma > 0) {
      if (dia3_suma > this.variables.selectedItemAsignacion.dia3.asignados) {
        error = true;
        dias =
          dias.length > 0
            ? dias +
              ", " +
              this.dias[3].dia_semana_string +
              "." +
              this.dias[3].dia +
              "/" +
              this.dias[3].mes
            : this.dias[3].dia_semana_string +
              "." +
              this.dias[3].dia +
              "/" +
              this.dias[3].mes;
      }
    }
    if (dia4_suma > 0) {
      if (dia4_suma > this.variables.selectedItemAsignacion.dia4.asignados) {
        error = true;
        dias =
          dias.length > 0
            ? dias +
              ", " +
              this.dias[4].dia_semana_string +
              "." +
              this.dias[4].dia +
              "/" +
              this.dias[4].mes
            : this.dias[4].dia_semana_string +
              "." +
              this.dias[4].dia +
              "/" +
              this.dias[4].mes;
      }
    }
    return { value: error, dias: dias };
  }
  sumaColumnSolicitud(
    value: number,
    tipo: string
  ): { value: boolean; dias: string } {
    let error = false;
    let dias: string = "";

    let dia0_cantidad = 0;
    let dia1_cantidad = 0;
    let dia2_cantidad = 0;
    let dia3_cantidad = 0;
    let dia4_cantidad = 0;
    this.variables.preAsignacion.forEach((element) => {
      let valor = tipo === "1" ? value : element.cantidad;
      switch (element.dia) {
        case "0":
          dia0_cantidad = dia0_cantidad + element.cantidad;
          break;
        case "1":
          dia1_cantidad = dia1_cantidad + element.cantidad;
          break;
        case "2":
          dia2_cantidad = dia2_cantidad + element.cantidad;
          break;
        case "3":
          dia3_cantidad = dia3_cantidad + element.cantidad;
          break;
        case "4":
          dia4_cantidad = dia4_cantidad + element.cantidad;
          break;
        default:
          break;
      }
    });
    if (this.variables.integracionCentro) {
      if (dia0_cantidad > 0 && value > dia0_cantidad) {
        error = true;
        dias =
          dias.length > 0
            ? dias +
              ", " +
              this.dias[0].dia_semana_string +
              "." +
              this.dias[0].dia +
              "/" +
              this.dias[0].mes
            : this.dias[0].dia_semana_string +
              "." +
              this.dias[0].dia +
              "/" +
              this.dias[0].mes;
      }
      if (dia1_cantidad > 0 && value > dia1_cantidad) {
        error = true;
        dias =
          dias.length > 0
            ? dias +
              ", " +
              this.dias[1].dia_semana_string +
              "." +
              this.dias[1].dia +
              "/" +
              this.dias[1].mes
            : this.dias[1].dia_semana_string +
              "." +
              this.dias[1].dia +
              "/" +
              this.dias[1].mes;
      }

      if (dia2_cantidad > 0 && value > dia2_cantidad) {
        error = true;
        dias =
          dias.length > 0
            ? dias +
              ", " +
              this.dias[2].dia_semana_string +
              "." +
              this.dias[2].dia +
              "/" +
              this.dias[2].mes
            : this.dias[2].dia_semana_string +
              "." +
              this.dias[2].dia +
              "/" +
              this.dias[2].mes;
      }
      if (dia3_cantidad > 0 && value > dia3_cantidad) {
        error = true;
        dias =
          dias.length > 0
            ? dias +
              ", " +
              this.dias[3].dia_semana_string +
              "." +
              this.dias[3].dia +
              "/" +
              this.dias[3].mes
            : this.dias[3].dia_semana_string +
              "." +
              this.dias[3].dia +
              "/" +
              this.dias[3].mes;
      }
      if (dia4_cantidad > 0 && value > dia4_cantidad) {
        error = true;
        dias =
          dias.length > 0
            ? dias +
              ", " +
              this.dias[4].dia_semana_string +
              "." +
              this.dias[4].dia +
              "/" +
              this.dias[4].mes
            : this.dias[4].dia_semana_string +
              "." +
              this.dias[4].dia +
              "/" +
              this.dias[4].mes;
      }
    }

    return { value: error, dias: dias };
  }
  trackByFn(index, item) {
    return item.id; // unique id corresponding to the item
  }

  selectCabecera(cmd) {
    if (cmd.value != -1) {
      this.variables.placeholderCabecera = "";
      this.ccppService.getIdCabecera(cmd.value).subscribe(
        (pagedData) => {
          this.variables.selectedCabecera = pagedData.data;
        },
        (err) => {}
      );
    }
  }

  validarInput(cmd) {
    if (cmd.target.value != "" && parseInt(cmd.target.value) > 0) {
      this.variables.validatedForm = true;
      let valida = true;
      let error1 = false; // suma del valor  por día sea menor que los disponibles
      let error2 = false; // suma del valor   por día sea menor que las solicitudes
      let msg1 = "";
      let msg2 = "";
      if (valida) {
        let validacion1 = this.sumaColumn(parseInt(cmd.target.value), "1");
        error1 = validacion1.value;
        msg1 = validacion1.dias;
        /* let validacion2 = this.sumaColumnSolicitud(
          parseInt(cmd.target.value),
          "1"
        );
        error2 = validacion2.value;
        msg2 = validacion2.dias;
        valida = !error1 ? (!error2 ? true : false) : false;*/
        valida = !error1 ;
      }
      if (valida) {
        this.variables.validatedForm = true;
      } else {
        this.variables.validatedForm = false;
        if (error1) {
          this.atencionService.confirm({
            message:
              "La cantidad de cupos por módulos que está intentando asignar excede la cantidad de cupos disponibles ",
          });}
         /*  if (error2) {
            this.atencionService.confirm({
              message:
                "La cantidad de cupos por módulos que está intentando asignar excede la cantidad de cupos solicitados ",
            });
            this.variables.gestionForm.controls["cuposxModulos"].setValue(
              this.valorValidInput
            );
            return false;
          } */
      }
    } else {
      this.variables.validatedForm = false;
    }
    let minData = moment();
    this.hoyMoment = moment(this.hoyString);
    this.variables.preAsignacion.forEach((element) => {
      let di = element.dia;
      let fec = this.dias[di].fecha;
      let otrFecha = moment(fec);
      if (otrFecha < minData) {
        minData = otrFecha;
      }
    });
    if (minData >= this.hoyMoment) {
      this.variables.validFecha = true;
      this.variables.valorValidInput = parseInt(cmd.target.value);
    } else {
      this.variables.validFecha = false;
    }
  }

  confirmar_notificar() {
    //let valid = this.validarSendNotificacion();
    let valid = this.listSinEmail.length > 0 ? false : true;

    if (valid) {
      if (this.variables.gestionForm.controls["selectedAccion"].value == 2) {
        this.rechazar(true);
      } else {
        this.asignarCupo(
          this.variables.gestionForm.controls["selectedAccion"].value,
          true
        );
      }
    } else {
      this.listSinEmail.forEach((element) => {
        this.openPopUpSinEmail(element, "CONFIRMAR-NOTIFICAR");
        /* if (element.email.length == 0) {
        } */
      });
    }
  }
  confirmar() {
    if (this.variables.gestionForm.controls["selectedAccion"].value == 2) {
      this.rechazar(false);
    } else {
      this.asignarCupo(
        this.variables.gestionForm.controls["selectedAccion"].value,
        false
      );
    }
  }

  notificar() {
    //let valid = this.validarSendNotificacion();
    let valid = this.listSinEmail.length > 0 ? false : true;
    if (valid) {
      this.loader.open("Por favor espere..");
      let data = {};
      let sinEmail = [];
      data = {
        sinEmail: sinEmail,
      };
      this.cupoService.postEnviarNotificacion(data).subscribe(
        (res) => {
          this.loader.close();
          this.loadNotificacionesEvent.emit();
          if (res.status === 280) {
            this.atencionService.confirm({
              message: res.data + " !",
              tipo: "exito",
            });
          } else {
            this.alertService.confirm({
              message: res.data + " !",
              tipo: "exito",
            });
          }
        },
        (err) => {
          this.loader.close();
          this.atencionService.confirm({
            message: "Las notificaciones no pudieron ser enviadas ",
          });
        }
      );
    } else {
      this.listSinEmail.forEach((element) => {
        this.openPopUpSinEmail(element, "NOTIFICAR");
      });
    }
  }
  asignarCupo(tipo: number, notifica: boolean) {
    //entro con tipo==0 o tipo==1
    this.loader.open("Por favor espere..");

    let dia0_array_cupos = [];
    let dia1_array_cupos = [];
    let dia2_array_cupos = [];
    let dia3_array_cupos = [];
    let dia4_array_cupos = [];
    let caratulasCupos = [];
    let caratulasDemandas = [];

    this.variables.selectedItemAsignacion.dia0.cupos.forEach((element) => {
      dia0_array_cupos.push(element);
    });
    this.variables.selectedItemAsignacion.dia1.cupos.forEach((element) => {
      dia1_array_cupos.push(element);
    });
    this.variables.selectedItemAsignacion.dia2.cupos.forEach((element) => {
      dia2_array_cupos.push(element);
    });
    this.variables.selectedItemAsignacion.dia3.cupos.forEach((element) => {
      dia3_array_cupos.push(element);
    });
    this.variables.selectedItemAsignacion.dia4.cupos.forEach((element) => {
      dia4_array_cupos.push(element);
    });

    let arrayAsignacion = [];
    this.variables.preAsignacion.sort((a, b) =>
      a.cantidad < b.cantidad ? 1 : -1
    );
    for (let index = 0; index < this.variables.preAsignacion.length; index++) {
      const element = this.variables.preAsignacion[index];
      let data = {};
      let cupos: string[] = [];
      let count = 0;
      let contador = 0;

      if (element.cantidad == 0) {
        switch (element.dia) {
          case "0":
            count =
              this.variables.gestionForm.controls["selectedAccion"].value == 0
                ? parseInt(
                    this.variables.gestionForm.controls["cuposxModulos"].value
                  )
                : this.variables.gestionForm.controls["selectedAccion"].value ==
                  1
                ? dia0_array_cupos.length
                : 0;
            contador =
              dia0_array_cupos.length < count ? dia0_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia0_array_cupos.length > 0) {
                cupos.push(dia0_array_cupos[0].id);
                dia0_array_cupos.shift();
              }
            }
            break;
          case "1":
            count =
              this.variables.gestionForm.controls["selectedAccion"].value == 0
                ? parseInt(
                    this.variables.gestionForm.controls["cuposxModulos"].value
                  )
                : this.variables.gestionForm.controls["selectedAccion"].value ==
                  1
                ? dia1_array_cupos.length
                : 0;
            contador =
              dia1_array_cupos.length < count ? dia1_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia1_array_cupos.length > 0) {
                cupos.push(dia1_array_cupos[0].id);
                dia1_array_cupos.shift();
              }
            }
            break;
          case "2":
            count =
              this.variables.gestionForm.controls["selectedAccion"].value == 0
                ? parseInt(
                    this.variables.gestionForm.controls["cuposxModulos"].value
                  )
                : this.variables.gestionForm.controls["selectedAccion"].value ==
                  1
                ? dia2_array_cupos.length
                : 0;
            contador =
              dia2_array_cupos.length < count ? dia2_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia2_array_cupos.length > 0) {
                cupos.push(dia2_array_cupos[0].id);
                dia2_array_cupos.shift();
              }
            }
            break;
          case "3":
            count =
              this.variables.gestionForm.controls["selectedAccion"].value == 0
                ? parseInt(
                    this.variables.gestionForm.controls["cuposxModulos"].value
                  )
                : this.variables.gestionForm.controls["selectedAccion"].value ==
                  1
                ? dia3_array_cupos.length
                : 0;
            contador =
              dia3_array_cupos.length < count ? dia3_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia3_array_cupos.length > 0) {
                cupos.push(dia3_array_cupos[0].id);
                dia3_array_cupos.shift();
              }
            }
            break;
          case "4":
            count =
              this.variables.gestionForm.controls["selectedAccion"].value == 0
                ? parseInt(
                    this.variables.gestionForm.controls["cuposxModulos"].value
                  )
                : this.variables.gestionForm.controls["selectedAccion"].value ==
                  1
                ? dia4_array_cupos.length
                : 0;
            contador =
              dia4_array_cupos.length < count ? dia4_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia4_array_cupos.length > 0) {
                cupos.push(dia4_array_cupos[0].id);
                dia4_array_cupos.shift();
              }
            }
            break;

          default:
            break;
        }

        data = {
          receptorCuit:
            element.receptorCuit == "00000000000"
              ? element.contraparte
              : element.receptorCuit,
          contraparte:
            element.receptorCuit == "00000000000" ? null : element.contraparte,
          nroContrato: element.contrato,
          caratula: "",
          id_demanda: null,
          cupos: cupos,
        };
        arrayAsignacion.push(data);
      } else {
        // asignacion con solicitud
        count =
          tipo == 0
            ? parseInt(
                this.variables.gestionForm.controls["cuposxModulos"].value
              )
            : element.cantidad;
        switch (element.dia) {
          case "0":
            contador =
              dia0_array_cupos.length < count ? dia0_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              if (contador > 0) {
                const demanda = element.demandas[index];
                let cant =
                  parseInt(demanda.cantidad) < contador
                    ? parseInt(demanda.cantidad)
                    : contador;
                for (let index = 0; index < cant; index++) {
                  if (dia0_array_cupos.length > 0) {
                    cupos.push(dia0_array_cupos[0].id);
                    dia0_array_cupos.shift();
                  }
                }
                data = {
                  receptorCuit:
                    element.receptorCuit == "00000000000"
                      ? element.contraparte
                      : element.receptorCuit,
                  contraparte:
                    element.receptorCuit == "00000000000"
                      ? null
                      : element.contraparte,
                  nroContrato: element.contrato,
                  caratula: "",
                  id_demanda: demanda.id_demanda_cupo,
                  cupos: cupos,
                };
                arrayAsignacion.push(data);
                cupos = [];
                contador = contador - cant;
              }
            }
            if (contador > 0) {
              for (let index = 0; index < contador; index++) {
                if (dia0_array_cupos.length > 0) {
                  cupos.push(dia0_array_cupos[0].id);
                  dia0_array_cupos.shift();
                }
              }
              data = {
                receptorCuit:
                  element.receptorCuit == "00000000000"
                    ? element.contraparte
                    : element.receptorCuit,
                contraparte:
                  element.receptorCuit == "00000000000"
                    ? null
                    : element.contraparte,
                caratula: "",
                nroContrato: element.contrato,
                id_demanda: null,
                cupos: cupos,
              };
              arrayAsignacion.push(data);
            }
            break;
          case "1":
            contador =
              dia1_array_cupos.length < count ? dia1_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              caratulasDemandas.push(element.demandas[index].caratula);
              if (contador > 0) {
                const demanda = element.demandas[index];
                let cant =
                  parseInt(demanda.cantidad) < contador
                    ? parseInt(demanda.cantidad)
                    : contador;
                for (let index = 0; index < cant; index++) {
                  if (dia1_array_cupos.length > 0) {
                    cupos.push(dia1_array_cupos[0].id);
                    dia1_array_cupos.shift();
                  }
                }
                data = {
                  receptorCuit:
                    element.receptorCuit == "00000000000"
                      ? element.contraparte
                      : element.receptorCuit,
                  contraparte:
                    element.receptorCuit == "00000000000"
                      ? null
                      : element.contraparte,
                  nroContrato: element.contrato,
                  caratula: "",
                  id_demanda: demanda.id_demanda_cupo,
                  cupos: cupos,
                };
                arrayAsignacion.push(data);
                cupos = [];
                contador = contador - cant;
              }
            }
            if (contador > 0) {
              for (let index = 0; index < contador; index++) {
                if (dia1_array_cupos.length > 0) {
                  cupos.push(dia1_array_cupos[0].id);
                  caratulasCupos.push(dia1_array_cupos[0].caratula);
                  dia1_array_cupos.shift();
                }
              }
              data = {
                receptorCuit:
                  element.receptorCuit == "00000000000"
                    ? element.contraparte
                    : element.receptorCuit,
                contraparte:
                  element.receptorCuit == "00000000000"
                    ? null
                    : element.contraparte,
                nroContrato: element.contrato,
                caratula: "",
                id_demanda: null,
                cupos: cupos,
              };
              arrayAsignacion.push(data);
            }
            break;
          case "2":
            contador =
              dia2_array_cupos.length < count ? dia2_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              caratulasDemandas.push(element.demandas[index].caratula);
              if (contador > 0) {
                const demanda = element.demandas[index];
                let cant =
                  parseInt(demanda.cantidad) < contador
                    ? parseInt(demanda.cantidad)
                    : contador;
                for (let index = 0; index < cant; index++) {
                  if (dia2_array_cupos.length > 0) {
                    cupos.push(dia2_array_cupos[0].id);
                    dia2_array_cupos.shift();
                  }
                }
                data = {
                  receptorCuit:
                    element.receptorCuit == "00000000000"
                      ? element.contraparte
                      : element.receptorCuit,
                  contraparte:
                    element.receptorCuit == "00000000000"
                      ? null
                      : element.contraparte,
                  nroContrato: element.contrato,
                  caratula: "",
                  id_demanda: demanda.id_demanda_cupo,
                  cupos: cupos,
                };
                arrayAsignacion.push(data);
                cupos = [];
                contador = contador - cant;
              }
            }
            if (contador > 0) {
              for (let index = 0; index < contador; index++) {
                if (dia2_array_cupos.length > 0) {
                  cupos.push(dia2_array_cupos[0].id);
                  dia2_array_cupos.shift();
                }
              }
              data = {
                receptorCuit:
                  element.receptorCuit == "00000000000"
                    ? element.contraparte
                    : element.receptorCuit,
                contraparte:
                  element.receptorCuit == "00000000000"
                    ? null
                    : element.contraparte,
                nroContrato: element.contrato,
                caratula: "",
                id_demanda: null,
                cupos: cupos,
              };
              arrayAsignacion.push(data);
            }
            break;
          case "3":
            contador =
              dia3_array_cupos.length < count ? dia3_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              caratulasDemandas.push(element.demandas[index].caratula);
              if (contador > 0) {
                const demanda = element.demandas[index];
                let cant =
                  parseInt(demanda.cantidad) < contador
                    ? parseInt(demanda.cantidad)
                    : contador;
                for (let index = 0; index < cant; index++) {
                  if (dia3_array_cupos.length > 0) {
                    cupos.push(dia3_array_cupos[0].id);
                    dia3_array_cupos.shift();
                  }
                }
                data = {
                  receptorCuit:
                    element.receptorCuit == "00000000000"
                      ? element.contraparte
                      : element.receptorCuit,
                  contraparte:
                    element.receptorCuit == "00000000000"
                      ? null
                      : element.contraparte,
                  nroContrato: element.contrato,
                  caratula: "",
                  id_demanda: demanda.id_demanda_cupo,
                  cupos: cupos,
                };
                arrayAsignacion.push(data);
                cupos = [];
                contador = contador - cant;
              }
            }
            if (contador > 0) {
              for (let index = 0; index < contador; index++) {
                if (dia3_array_cupos.length > 0) {
                  cupos.push(dia3_array_cupos[0].id);
                  dia3_array_cupos.shift();
                }
              }
              data = {
                receptorCuit:
                  element.receptorCuit == "00000000000"
                    ? element.contraparte
                    : element.receptorCuit,
                contraparte:
                  element.receptorCuit == "00000000000"
                    ? null
                    : element.contraparte,
                nroContrato: element.contrato,
                caratula: "",
                id_demanda: null,
                cupos: cupos,
              };
              arrayAsignacion.push(data);
            }
            break;
          case "4":
            contador =
              dia4_array_cupos.length < count ? dia4_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              caratulasDemandas.push(element.demandas[index].caratula);
              if (contador > 0) {
                const demanda = element.demandas[index];
                let cant =
                  parseInt(demanda.cantidad) < contador
                    ? parseInt(demanda.cantidad)
                    : contador;
                for (let index = 0; index < cant; index++) {
                  if (dia4_array_cupos.length > 0) {
                    cupos.push(dia4_array_cupos[0].id);
                    dia4_array_cupos.shift();
                  }
                }
                data = {
                  receptorCuit:
                    element.receptorCuit == "00000000000"
                      ? element.contraparte
                      : element.receptorCuit,
                  contraparte:
                    element.receptorCuit == "00000000000"
                      ? null
                      : element.contraparte,
                  nroContrato: element.contrato,
                  caratula: "",
                  id_demanda: demanda.id_demanda_cupo,
                  cupos: cupos,
                };
                arrayAsignacion.push(data);
                cupos = [];
                contador = contador - cant;
              }
            }
            if (contador > 0) {
              for (let index = 0; index < contador; index++) {
                if (dia4_array_cupos.length > 0) {
                  cupos.push(dia4_array_cupos[0].id);
                  dia4_array_cupos.shift();
                }
              }
              data = {
                receptorCuit:
                  element.receptorCuit == "00000000000"
                    ? element.contraparte
                    : element.receptorCuit,
                contraparte:
                  element.receptorCuit == "00000000000"
                    ? null
                    : element.contraparte,
                nroContrato: element.contrato,
                caratula: "",
                id_demanda: null,
                cupos: cupos,
              };
              arrayAsignacion.push(data);
            }
            break;

          default:
            break;
        }
      }
    }
    let sinEmail = [];
    if (this.listSinEmail.length > 0) {
      this.listSinEmail.forEach((element) => {
        let emails = "";
        for (let index = 0; index < element.email.length; index++) {
          const email = element.email[index];
          if (emails == "") {
            emails += email;
          } else {
            emails += ";" + email;
          }
        }
        sinEmail.push({
          id: element.id,
          email: emails,
        });
      });
    }
    if (arrayAsignacion.length > 0) {
      let data = {
        asignaciones: arrayAsignacion,
        id_cabecera:
          this.variables.gestionForm.controls["selectedCabecera"].value != -1
            ? this.variables.gestionForm.controls["selectedCabecera"].value
            : "",
        notificacion: notifica ? 1 : 0,
        sinEmail: sinEmail,
        canal: "WEB",
      };
      this.cupoService.postAsignarCuposV32(data).subscribe(
        (res) => {
          this.loader.close();
          this.alertService
            .confirm({
              message: "Cupos Asignados correctamente!",
              tipo: "exito",
            })
            .subscribe((res1) => {
              if (res1) {
                this.variables.validatedForm = false;
                this.inicializarOpciones();
                this.cambiarFecha.emit({ fecha: this.variables.filtro.fecha });
                this.loadRecuperarEvent.emit();
                this.loadNotificacionesEvent.emit();
                //
                return;
              }
            });
        },
        (err) => {
          this.loader.close();
          if (err.status === 422) {
            this.atencionService.confirm({
              message: err.message,
            });
          } else {
            this.errorService.confirm({ message: err }).subscribe((res) => {
              if (res) {
                return;
              }
            });
          }
        }
      );
    } else {
      this.loader.close();
      this.atencionService.confirm({
        message: "No es posible asignar",
      });
    }
  }
  rechazar(notifica: boolean) {
    let isValid = true;
    for (let index = 0; index < this.variables.preAsignacion.length; index++) {
      const element = this.variables.preAsignacion[index];
      if (element.cantidad == 0) {
        isValid = false;
      }
    }
    if (isValid) {
      let dialogRef: MatDialogRef<any> = this.dialog.open(
        RechazarSolicitudComponent,
        {
          width: "50vw",
          disableClose: true,
          data: {},
        }
      );
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          return;
        }
        this.loader.open("Por favor espere..");
        let arrayAsignacion = [];
        let lastIndex = this.variables.preAsignacion.length - 1;
        for (let i = 0; i < this.variables.preAsignacion.length; i++) {
          const element = this.variables.preAsignacion[i];

          let demanda: number;
          for (let index = 0; index < element.demandas.length; index++) {
            const demanda = element.demandas[index];
            arrayAsignacion.push(demanda.id_demanda_cupo);
          }

          if (arrayAsignacion.length > 0) {
            let sinEmail = [];
            if (this.listSinEmail.length > 0) {
              this.listSinEmail.forEach((element) => {
                let emails = "";
                for (let index = 0; index < element.email.length; index++) {
                  const email = element.email[index];
                  if (emails == "") {
                    emails += email;
                  } else {
                    emails += ";" + email;
                  }
                }
                sinEmail.push({
                  id: element.id,
                  email: emails,
                });
              });
            }
            let data = {
              solicitudes: arrayAsignacion,
              id_motivo_rechazo: res.id,
              comentario: res.comentario,
              notificacion: notifica ? 1 : 0,
              sinEmail: sinEmail,
            };
            //llamada al método de rechazar

            this.cupoService.postRechazarCuposV3(data).subscribe(
              (res) => {
                if (i == lastIndex) {
                  this.loader.close();
                  this.inicializarOpciones();
                  this.loadNotificacionesEvent.emit();
                  this.variables.validatedForm = false;
                  this.cambiarFecha.emit({
                    fecha: this.variables.filtro.fecha,
                  });
                  this.alertService
                    .confirm({
                      message: "Solicitudes rechazadas correctamente!",
                      tipo: "exito",
                    })
                    .subscribe((res1) => {
                      if (res1) {
                        this.loadRecuperarEvent.emit();
                        this.loadNotificacionesEvent.emit();
                        return;
                      }
                    });
                }
              },
              (err) => {
                this.loader.close();
                this.variables.validatedForm = false;
                if (err.status === 422) {
                  this.atencionService.confirm({
                    message: err.message,
                  });
                } else {
                  this.errorService
                    .confirm({
                      message: "Error al rechazar la solicitud.",
                    })
                    .subscribe((res) => {
                      if (res) {
                        return;
                      }
                    });
                }
              }
            );
          }
        }
      });
    } else {
      this.atencionService.confirm({
        message: "No es posible rechazar",
      });
    }
  }

  openPopUpSinEmail(dato: CentroSinEMail, opcion: string) {
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      UsuarioSinEmailComponent,
      {
        width: "50vw",
        disableClose: false,
        data: {
          title: " asignando cupos",
          payload: {
            cuit: dato.cuit,
            razon: dato.razon_social,
            emails: dato.email,
          },
        },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        let temp = this.listSinEmail.find((item) => item.cuit === res.cuit);
        temp.email = res.email;
        let valido = this.validarSendNotificacion();
        //let valido = this.listSinEmail.length > 0 ? false : true;
        if (valido) {
          switch (opcion) {
            case "CONFIRMAR":
              break;
            case "CONFIRMAR-NOTIFICAR":
              if (
                this.variables.gestionForm.controls["selectedAccion"].value == 2
              ) {
                this.rechazar(true);
              } else {
                this.asignarCupo(
                  this.variables.gestionForm.controls["selectedAccion"].value,
                  true
                );
              }
              break;

            case "NOTIFICAR":
              let sinEmail = [];
              let data = {};
              if (this.listSinEmail.length > 0) {
                this.listSinEmail.forEach((element) => {
                  let emails = "";
                  for (let index = 0; index < element.email.length; index++) {
                    const email = element.email[index];
                    if (emails == "") {
                      emails += email;
                    } else {
                      emails += ";" + email;
                    }
                  }
                  sinEmail.push({
                    id: element.id,
                    email: emails,
                  });
                });
              }
              if (sinEmail.length > 0) {
                data = {
                  sinEmail: sinEmail,
                };
              }
              this.loader.open("Por favor espere..");
              this.cupoService.postEnviarNotificacion(data).subscribe(
                (res) => {
                  this.loader.close();
                  this.loadNotificacionesEvent.emit();
                  if (res.status === 280) {
                    this.atencionService.confirm({
                      message: res.data + " !",
                      tipo: "exito",
                    });
                  } else {
                    this.alertService.confirm({
                      message: res.data + " !",
                      tipo: "exito",
                    });
                  }
                },
                (err) => {
                  this.loader.close();
                  this.atencionService.confirm({
                    message: "Las notificaciones no pudieron ser enviadas ",
                  });
                }
              );
              break;

            default:
              break;
          }
        }
      }

      return;
    });
  }

  validarSendNotificacion(): boolean {
    let cant = 0;
    if (this.listSinEmail.length > 0) {
      this.listSinEmail.forEach((element) => {
        if (element.email.length > 0) {
          cant++;
        }
      });
      if (cant === this.listSinEmail.length) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  openPopUpVer(data: any = {}) {
    //let cuposAsignados: CuposAsignar[] = [];
    let cupos: Cupo[] = [];
    let cupoEnCero: Cupo;
    cupos = this.listCuposAsignar(
      this.variables.gestionForm.controls["selectedAccion"].value
    );
    if (cupos.length > 0) {
      cupoEnCero = cupos[0];

      let rowCabecera: Cabecera = null;
      this.variables.cabeceras.forEach((element) => {
        if (element.id === this.variables.selectedCabecera.id) {
          rowCabecera = element;
        }
      });
      this.ccppService.getCartaPorte(cupoEnCero.id).subscribe((data) => {
        let title = "Ver Carta Porte";

        let dialogRef: MatDialogRef<any> = this.dialog.open(VerCcppComponent, {
          width: "75vw",
          height: "90vh",
          disableClose: true,
          data: { cartaPorte: data.data, cabecera: rowCabecera },
        });
        dialogRef.afterClosed().subscribe((res) => {
          if (!res) {
            return;
          } else {
          }
        });
      });
    } else {
      let title = "CARTA PORTE";
      let dialogRef: MatDialogRef<any> = this.dialog.open(
        VerCabeceraComponent,
        {
          width: "75vw",
          height: "90vh",
          disableClose: true,
          data: { title: title, payload: this.variables.selectedCabecera },
        }
      );
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
        } else {
        }
      });
    }
  }

  listCuposAsignar(tipo: number) {
    let dia0_array_cupos = [];
    let dia1_array_cupos = [];
    let dia2_array_cupos = [];
    let dia3_array_cupos = [];
    let dia4_array_cupos = [];

    this.variables.selectedItemAsignacion.dia0.cupos.forEach((element) => {
      dia0_array_cupos.push(element);
    });
    this.variables.selectedItemAsignacion.dia1.cupos.forEach((element) => {
      dia1_array_cupos.push(element);
    });
    this.variables.selectedItemAsignacion.dia2.cupos.forEach((element) => {
      dia2_array_cupos.push(element);
    });
    this.variables.selectedItemAsignacion.dia3.cupos.forEach((element) => {
      dia3_array_cupos.push(element);
    });
    this.variables.selectedItemAsignacion.dia4.cupos.forEach((element) => {
      dia4_array_cupos.push(element);
    });

    let arrayAsignacion = [];
    let asignaciones = [];
    let cuposCompleto: Cupo[] = [];

    for (let index = 0; index < this.variables.preAsignacion.length; index++) {
      const element = this.variables.preAsignacion[index];

      let data = {};
      let cupos: string[] = [];

      let demanda: number;
      //demanda = element.demanda;
      let count = 0;

      let contador = 0;
      if (element.cantidad == 0 && tipo == 1) {
        continue;
      }
      if (element.cantidad == 0) {
        // asignacion sin solicitud
        count = parseInt(
          this.variables.gestionForm.controls["cuposxModulos"].value
        );
        switch (element.dia) {
          case "0":
            contador =
              dia0_array_cupos.length < count ? dia0_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia0_array_cupos.length > 0) {
                cupos.push(dia0_array_cupos[0].id);
                cuposCompleto.push(dia0_array_cupos[0]);
                dia0_array_cupos.shift();
              }
            }
            break;
          case "1":
            contador =
              dia1_array_cupos.length < count ? dia1_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia1_array_cupos.length > 0) {
                cupos.push(dia1_array_cupos[0].id);
                cuposCompleto.push(dia1_array_cupos[0]);
                dia1_array_cupos.shift();
              }
            }
            break;
          case "2":
            contador =
              dia2_array_cupos.length < count ? dia2_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia2_array_cupos.length > 0) {
                cupos.push(dia2_array_cupos[0].id);
                cuposCompleto.push(dia2_array_cupos[0]);
                dia2_array_cupos.shift();
              }
            }
            break;
          case "3":
            contador =
              dia3_array_cupos.length < count ? dia3_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia3_array_cupos.length > 0) {
                cupos.push(dia3_array_cupos[0].id);
                cuposCompleto.push(dia3_array_cupos[0]);
                dia3_array_cupos.shift();
              }
            }
            break;
          case "4":
            contador =
              dia4_array_cupos.length < count ? dia4_array_cupos.length : count;
            for (let index = 0; index < contador; index++) {
              if (dia4_array_cupos.length > 0) {
                cupos.push(dia4_array_cupos[0].id);
                cuposCompleto.push(dia4_array_cupos[0]);
                dia4_array_cupos.shift();
              }
            }
            break;

          default:
            break;
        }
      } else {
        // asignacion con solicitud
        count =
          tipo == 0
            ? parseInt(
                this.variables.gestionForm.controls["cuposxModulos"].value
              )
            : element.cantidad;
        switch (element.dia) {
          case "0":
            contador =
              dia0_array_cupos.length < count ? dia0_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              const demanda = element.demandas[index];
              let cant =
                parseInt(demanda.cantidad) < contador
                  ? parseInt(demanda.cantidad)
                  : contador;
              for (let index = 0; index < cant; index++) {
                if (dia0_array_cupos.length > 0) {
                  cupos.push(dia0_array_cupos[0].id);
                  cuposCompleto.push(dia0_array_cupos[0]);
                  dia0_array_cupos.shift();
                }
              }
              cupos = [];
              contador = contador - cant;
              if (contador == 0) {
                continue;
              }
            }
            break;
          case "1":
            contador =
              dia1_array_cupos.length < count ? dia1_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              const demanda = element.demandas[index];
              let cant =
                parseInt(demanda.cantidad) < contador
                  ? parseInt(demanda.cantidad)
                  : contador;
              for (let index = 0; index < cant; index++) {
                if (dia1_array_cupos.length > 0) {
                  cupos.push(dia1_array_cupos[0].id);
                  cuposCompleto.push(dia1_array_cupos[0]);
                  dia1_array_cupos.shift();
                }
              }
              cupos = [];
              contador = contador - cant;
              if (contador == 0) {
                continue;
              }
            }
            break;
          case "2":
            contador =
              dia2_array_cupos.length < count ? dia2_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              const demanda = element.demandas[index];
              let cant =
                parseInt(demanda.cantidad) < contador
                  ? parseInt(demanda.cantidad)
                  : contador;
              for (let index = 0; index < cant; index++) {
                if (dia2_array_cupos.length > 0) {
                  cupos.push(dia2_array_cupos[0].id);
                  cuposCompleto.push(dia2_array_cupos[0]);
                  dia2_array_cupos.shift();
                }
              }
              cupos = [];
              contador = contador - cant;
              if (contador == 0) {
                continue;
              }
            }
            break;
          case "3":
            contador =
              dia3_array_cupos.length < count ? dia3_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              const demanda = element.demandas[index];
              let cant =
                parseInt(demanda.cantidad) < contador
                  ? parseInt(demanda.cantidad)
                  : contador;
              for (let index = 0; index < cant; index++) {
                if (dia3_array_cupos.length > 0) {
                  cupos.push(dia4_array_cupos[0].id);
                  cuposCompleto.push(dia3_array_cupos[0]);
                  dia3_array_cupos.shift();
                }
              }
              cupos = [];
              contador = contador - cant;
              if (contador == 0) {
                continue;
              }
            }
            break;
          case "4":
            contador =
              dia4_array_cupos.length < count ? dia4_array_cupos.length : count;
            for (let index = 0; index < element.demandas.length; index++) {
              const demanda = element.demandas[index];
              let cant =
                parseInt(demanda.cantidad) < contador
                  ? parseInt(demanda.cantidad)
                  : contador;
              for (let index = 0; index < cant; index++) {
                if (dia4_array_cupos.length > 0) {
                  cupos.push(dia4_array_cupos[0].id);
                  cuposCompleto.push(dia4_array_cupos[0]);
                  dia4_array_cupos.shift();
                }
              }
              cupos = [];
              contador = contador - cant;
              if (contador == 0) {
                continue;
              }
            }
            break;

          default:
            break;
        }
      }
    }
    return cuposCompleto;
  }

  inicializarOpciones() {
    this.variables.gestionForm.controls["selectedAccion"].setValue("");
    this.variables.placeholderAccion = "  asignar/asignar todos/rechazar";
    this.variables.placeholderCabecera = "  3 > Seleccionar cabecera";
    this.variables.gestionForm.controls["cuposxModulos"].setValue("");
    this.variables.gestionForm.controls["selectedCabecera"].setValue("");
    this.variables.validatedForm = false;
  }
}
