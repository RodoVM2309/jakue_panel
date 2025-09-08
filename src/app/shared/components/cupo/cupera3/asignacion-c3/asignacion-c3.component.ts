import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import {
  DateAdapter,
  MatDialog, MatPaginator,
  MatSort,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material";
import {
  AppDateAdapter,
  APP_DATE_FORMATS
} from "@app/shared/helpers/date.adapter";
import { MessageService, NomencladoresService } from "@app/shared/services";
import { HotTableComponent } from "@handsontable-pro/angular";
import { CupoService } from "../../cupo.service";
import { CentroSinEMail, DiaSemana } from "../../cuponera/cuponera.component";
import { FunctionGetZonasCupoCentro, FunctionWorkDataTable } from "./functions";
import { ItemCartaPorte, ListadoSolicitudes } from "./models";
import {
  ListadoAsignacionProducto,
  ListadoAsignacionZona
} from "./models/listado-asignacion";
import { Variables } from "./variables";
//import { ListadoSolicitud } from "../../asignacion-v2/asignacion-v2.component";
@Component({
  selector: "app-asignacion-c3",
  templateUrl: "./asignacion-c3.component.html",
  styleUrls: ["./asignacion-c3.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es-ES",
    },
  ],
})
export class AsignacionC3Component implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() fecha: string;

  @Input() productos;
  @Input() myData;
  @Input() cantNotificaciones;
  @Input() listSinEmail: CentroSinEMail[] = [];
  @Input() dias: DiaSemana[] = [];
  @Output() cambiarFecha = new EventEmitter();
  @Output() chanceProductos = new EventEmitter();
  @Output() loadRecuperarEvent = new EventEmitter();
  @Output() loadNotificacionesEvent = new EventEmitter();
  @ViewChild("tablaSolicitudes") tablaSolicitudes: ElementRef;
  @ViewChild("tablaFiltros") tablaFiltros: ElementRef;
  @ViewChild("hot") hot: HotTableComponent;
  @Input() set dataCupera(data) {
    this.variables.cuposDisponiblesApi = data.cupos;
    this.variables.detallesDisponiblesApi = data.detalles;
    this.variables.solicitudesApi = data.solicitudes;
    if (
      this.variables.cuposDisponiblesApi.length > 0 ||
      this.variables.solicitudesApi.length > 0
    ) {
      this.chanceFiltro();
    }
    /* if () {
      this.analisisSolicitudes();
    } */
  }

  variables = new Variables();
  listadoAsignacionProducto: ListadoAsignacionProducto[] = [];

  constructor(
    private dialog: MatDialog,
    private cupoService: CupoService,
    private messageService: MessageService,
    private nomencladoresService: NomencladoresService
  ) {
    /* this.variables.getItemSub = this.messageService
      .getMessage()
      .subscribe((message) => {
        switch (message.text) {
          case "AsignacionC3":
            this.getData(message.data);
            this.dias= message.data.dias;
            this.chanceFiltro();
            break;
          default:
            break;
        }
      }); */
    this.variables.isInMobile = window.screen.width > 991 ? false : true;
  }

  ngOnInit() {
    this.getZonas();
    //this.getConfigCentro();
  }

  getData(data) {
    this.variables.cuposDisponiblesApi = data.cupos;
    this.variables.detallesDisponiblesApi = data.detalles;
    this.variables.solicitudesApi = data.solicitudes;
  }
  chanceFiltro() {
    if (this.variables.showDetalleProductoZona) {
      this.analisisCuposProducto();
      this.analisisSolicitudes();
      this.totalizarAsignacionProducto();
      this.messageService.sendMessage("enableFiltro", null, null);
    }
    if (this.variables.showDetalleZona) {
      this.analisisCuposProducto();
      this.analisisCuposZona();
      this.analisisSolicitudes();
      if (this.variables.chanceFiltroZona) {
        this.variables.showDetalleZona = false;
        this.variables.showDetalleProductoZona = true;
        this.variables.chanceFiltroZona = false;
        this.messageService.sendMessage("enableFiltro", null, null);
      }
      if (this.variables.filtro.idProductos.length > 1) {
        this.totalizarAsignacionProducto();
        this.variables.showDetalleZona = false;
        this.variables.showDetalleProductoZona = true;
        this.variables.chanceFiltroZona = false;
      } else {
        this.totalizarAsignacionZona();
        this.messageService.sendMessage(
          "chanceHandsonTable",
          "0",
          this.variables.listadoSolicitudes
        );
      }
    }

  }

  analisisCuposProducto() {
    this.variables.listadoAsignacionProducto = [];
    for (
      let index = 0;
      index < this.variables.cuposDisponiblesApi.length;
      index++
    ) {
      const element = this.variables.cuposDisponiblesApi[index];
      let itemIdZona = this.variables.filtro.idZonasCupo.find(
        (item) => item === element.idZona
      );
      if (itemIdZona) {
        let itemIdProducto = this.variables.filtro.idProductos.find(
          (item) => item === parseInt(element.id_producto)
        );
        if (itemIdProducto) {
          let prod = this.productos.find((item) => item.id === itemIdProducto);
          let prodZona = this.variables.listadoAsignacionProducto.find(
            (item) => item.idProducto === itemIdProducto
          );
          let tempDia = this.dias.find((item) => item.fecha === element.fecha);
          if (!prodZona) {
            //verificar el element si hay filtro de Destinatario y Destino
            let cumple = true;
            if (
              this.variables.filtro.cuitDestinatario.length > 0 &&
              this.variables.filtro.cuitDestino.length > 0
            ) {
              if (
                this.variables.filtro.cuitDestinatario !==
                element.cuit_destinatario ||
                this.variables.filtro.cuitDestino !== element.cuit_destino
              ) {
                cumple = false;
              }
            }
            if (cumple) {
              this.agregarDestinatarioDestino(element);
              let newElement = new ListadoAsignacionProducto();
              newElement.idProducto = prod.id;
              newElement.nombreProducto = prod.descripcion;
              newElement.dia0 = {
                asignados: 0,
                solicitados: 0,
                cupos: [],
              };
              newElement.dia1 = {
                asignados: 0,
                solicitados: 0,
                cupos: [],
              };
              newElement.dia2 = {
                asignados: 0,
                solicitados: 0,
                cupos: [],
              };
              newElement.dia3 = {
                asignados: 0,
                solicitados: 0,
                cupos: [],
              };
              newElement.dia4 = {
                asignados: 0,
                solicitados: 0,
                cupos: [],
              };
              newElement.total_asignados = 0;
              newElement.total_solicitados = 0;
              if (tempDia) {
                switch (tempDia.id) {
                  case 0:
                    newElement.dia0.asignados = 1;
                    newElement.dia0.cupos.push(element);
                    break;
                  case 1:
                    newElement.dia1.asignados = 1;
                    newElement.dia1.cupos.push(element);
                    break;
                  case 2:
                    newElement.dia2.asignados = 1;
                    newElement.dia2.cupos.push(element);
                    break;
                  case 3:
                    newElement.dia3.asignados = 1;
                    newElement.dia3.cupos.push(element);
                    break;
                  case 4:
                    newElement.dia4.asignados = 1;
                    newElement.dia4.cupos.push(element);
                    break;

                  default:
                    break;
                }
              }
              this.variables.listadoAsignacionProducto.push(newElement);
            }
          } else {
            let cumple = true;
            if (
              this.variables.filtro.cuitDestinatario.length > 0 &&
              this.variables.filtro.cuitDestino.length > 0
            ) {
              if (
                this.variables.filtro.cuitDestinatario !==
                element.cuit_destinatario ||
                this.variables.filtro.cuitDestino !== element.cuit_destino
              ) {
                cumple = false;
              }
            }
            if (cumple) {
              this.agregarDestinatarioDestino(element);
              if (tempDia) {
                switch (tempDia.id) {
                  case 0:
                    prodZona.dia0.asignados += 1;
                    prodZona.dia0.cupos.push(element);
                    break;
                  case 1:
                    prodZona.dia1.asignados += 1;
                    prodZona.dia1.cupos.push(element);
                    break;
                  case 2:
                    prodZona.dia2.asignados += 1;
                    prodZona.dia2.cupos.push(element);
                    break;
                  case 3:
                    prodZona.dia3.asignados += 1;
                    prodZona.dia3.cupos.push(element);
                    break;
                  case 4:
                    prodZona.dia4.asignados += 1;
                    prodZona.dia4.cupos.push(element);
                    break;

                  default:
                    break;
                }
              }
            }
          }
        }
      }
    }
  }
  analisisCuposZona() {
    this.variables.listadoAsignacionZona = [];
    for (
      let index = 0;
      index < this.variables.cuposDisponiblesApi.length;
      index++
    ) {
      const element = this.variables.cuposDisponiblesApi[index];
      let itemIdZona = this.variables.filtro.idZonasCupo.find(
        (item) => item === element.idZona
      );
      if (itemIdZona) {
        let itemIdProducto = this.variables.filtro.idProductos.find(
          (item) => item === parseInt(element.id_producto)
        );
        if (itemIdProducto) {
          let tempDia = this.dias.find((item) => item.fecha === element.fecha);
          let zona = this.variables.listadoAsignacionZona.find(
            (item) => item.idZona === itemIdZona
          );
          if (!zona) {
            //verificar el element si hay filtro de Destinatario y Destino
            let cumple = true;
            if (this.variables.filtro.cuitDestinatario.length > 0) {
              if (
                this.variables.filtro.cuitDestinatario !==
                element.idCuitDestinatario
              ) {
                cumple = false;
              }
            }
            if (cumple && this.variables.filtro.cuitDestino.length > 0) {
              if (this.variables.filtro.cuitDestino !== element.idCuitDestino) {
                cumple = false;
              }
            }
            if (cumple) {
              let newElement = new ListadoAsignacionZona();
              let zon = this.variables.zonasCupos.find(
                (item) => item.id === itemIdZona
              );
              newElement.idZona = itemIdZona;
              newElement.selected = false;
              newElement.zona = zon.descripcion;
              newElement.dia0 = {
                asignados: 0,
                solicitados: 0,
                cupos: [],
              };
              newElement.dia1 = {
                asignados: 0,
                solicitados: 0,
                cupos: [],
              };
              newElement.dia2 = {
                asignados: 0,
                solicitados: 0,
                cupos: [],
              };
              newElement.dia3 = {
                asignados: 0,
                solicitados: 0,
                cupos: [],
              };
              newElement.dia4 = {
                asignados: 0,
                solicitados: 0,
                cupos: [],
              };
              newElement.total_asignados = 0;
              newElement.total_solicitados = 0;
              if (tempDia) {
                switch (tempDia.id) {
                  case 0:
                    newElement.dia0.asignados = 1;
                    newElement.dia0.cupos.push(element);
                    break;
                  case 1:
                    newElement.dia1.asignados = 1;
                    newElement.dia1.cupos.push(element);
                    break;
                  case 2:
                    newElement.dia2.asignados = 1;
                    newElement.dia2.cupos.push(element);
                    break;
                  case 3:
                    newElement.dia3.asignados = 1;
                    newElement.dia3.cupos.push(element);
                    break;
                  case 4:
                    newElement.dia4.asignados = 1;
                    newElement.dia4.cupos.push(element);
                    break;

                  default:
                    break;
                }
              }
              this.variables.listadoAsignacionZona.push(newElement);
            }
          } else {
            let cumple = true;
            if (
              this.variables.filtro.cuitDestinatario.length > 0 &&
              this.variables.filtro.cuitDestino.length > 0
            ) {
              if (
                this.variables.filtro.cuitDestinatario !==
                element.cuit_destinatario ||
                this.variables.filtro.cuitDestino !== element.cuit_destino
              ) {
                cumple = false;
              }
            }
            if (cumple) {
              if (tempDia) {
                switch (tempDia.id) {
                  case 0:
                    zona.dia0.asignados += 1;
                    zona.dia0.cupos.push(element);
                    break;
                  case 1:
                    zona.dia1.asignados += 1;
                    zona.dia1.cupos.push(element);
                    break;
                  case 2:
                    zona.dia2.asignados += 1;
                    zona.dia2.cupos.push(element);
                    break;
                  case 3:
                    zona.dia3.asignados += 1;
                    zona.dia3.cupos.push(element);
                    break;
                  case 4:
                    zona.dia4.asignados += 1;
                    zona.dia4.cupos.push(element);
                    break;

                  default:
                    break;
                }
              }
            }
          }
        }
      }
    }
  }

  getConfigCentro() {
    this.variables.getItemSub = this.nomencladoresService
      .getConfiguracionCentro()
      .subscribe((data) => { });
  }

  analisisSolicitudes() {
    let indexEncSol = -1;
    let tempListadoSolicitudes: ListadoSolicitudes[] = [];
    for (let j = 0; j < this.variables.solicitudesApi.length; j++) {
      const element = this.variables.solicitudesApi[j];
      let isCorredor =
        this.variables.detallesDisponiblesApi.corredor_contraparte[
          element.corredor
        ].esCorredor == "0"
          ? false
          : true;
      let cuitComercial = isCorredor ? element.corredor : "00000000000";
      let comercial = isCorredor
        ? this.variables.detallesDisponiblesApi.corredor_contraparte[
          element.corredor
        ].razon_social
        : this.myData.lbCorredor;
      let cliente = isCorredor
        ? element.contraparte
          ? this.variables.detallesDisponiblesApi.corredor_contraparte[
            element.contraparte
          ].razon_social
          : ""
        : this.variables.detallesDisponiblesApi.corredor_contraparte[
          element.corredor
        ].razon_social;
      let cuitCliente = isCorredor
        ? cliente === ""
          ? ""
          : element.contraparte
        : element.corredor;
      let contrato = element.contrato == '0' ? 'DEUDA' : element.contrato;
      let zona =
        !element.id_zona_solicitud || element.id_zona_solicitud == ""
          ? ""
          : this.variables.detallesDisponiblesApi.zonas[
            element.id_zona_solicitud
          ].nombreZona;

      let cumple = true;
      if (this.variables.filtro.idZonasCupo.length > 0) {
        cumple = false;
        for (let i = 0; i < this.variables.filtro.idZonasCupo.length; i++) {
          if (
            element.id_zona_solicitud == this.variables.filtro.idZonasCupo[i]
          ) {
            cumple = true;
            break;
          }
        }
      }
      if (this.variables.filtro.cuitComercial.length > 0) {
        if (this.variables.filtro.cuitComercial !== cuitComercial) {
          cumple = false;
        }
      }
      if (cumple && this.variables.filtro.cuitCliente.length > 0) {
        if (this.variables.filtro.cuitCliente !== cuitCliente) {
          if (this.variables.filtro.cuitCliente !== "00000000000") {
            cumple = false;
          } else {
            if (cuitCliente !== "") {
              cumple = false;
            }
          }
        }
      }
      if (cumple && this.variables.filtro.contrato.length > 0) {
        if (this.variables.filtro.contrato !== contrato) {
          if (this.variables.filtro.contrato !== "Sin nominar contrato") {
            cumple = false;
          } else {
            if (element.contrato !== "") {
              cumple = false;
            }
          }
        }
      }
      if (cumple) {
        const dataCartaCliente =
          cliente === ""
            ? null
            : {
              id: cuitCliente,
              cuit: cuitCliente,
              descripcion: cliente,
            };
        let dataCartaPorte: ItemCartaPorte = {
          comercial: {
            id: cuitComercial,
            cuit: cuitComercial,
            descripcion: comercial,
          },
          cliente: dataCartaCliente,
          contrato: contrato,
        };
        FunctionWorkDataTable.AddElementCartaPorte(
          this.variables,
          dataCartaPorte
        );

        let itemListadoSolicitud = tempListadoSolicitudes.find(
          (item) =>
            item.comercialCuit === cuitComercial &&
            item.zona === zona &&
            item.clienteCuit === cuitCliente &&
            item.contrato === contrato
        );
        let tempDia = this.dias.find((item) => item.fecha === element.fecha);
        if (this.variables.listadoAsignacionProducto.length > 0) {
          this.actListAsigProducto(
            parseInt(element.id_producto),
            tempDia,
            parseInt(element.cantidad) - parseInt(element.asignado)
          );
        }
        if (
          (element.id_zona_solicitud || element.id_zona_solicitud !== "") &&
          this.variables.listadoAsignacionZona.length > 0
        ) {
          this.actListAsigZonas(
            parseInt(element.id_zona_solicitud),
            tempDia,
            parseInt(element.cantidad) - parseInt(element.asignado)
          );
        }
        if (!itemListadoSolicitud) {
          let newSolicitud = new ListadoSolicitudes();
          newSolicitud.comercial = comercial;
          newSolicitud.comercialCuit = cuitComercial;
          newSolicitud.zona = zona;
          newSolicitud.id_zona_solicitud = element.id_zona_solicitud;
          newSolicitud.cliente = cliente;
          newSolicitud.clienteCuit = cuitCliente;
          newSolicitud.contrato = contrato == '0' ? 'DEUDA' : contrato;
          newSolicitud.saldo = element.saldo ? element.saldo : 0;
          newSolicitud.dia0 = {
            solicitados: 0,
            solicitudes: [],
          };
          newSolicitud.dia1 = {
            solicitados: 0,
            solicitudes: [],
          };
          newSolicitud.dia2 = {
            solicitados: 0,
            solicitudes: [],
          };
          newSolicitud.dia3 = {
            solicitados: 0,
            solicitudes: [],
          };
          newSolicitud.dia4 = {
            solicitados: 0,
            solicitudes: [],
          };
          newSolicitud.total_solicitados = 0;

          newSolicitud.observaciones = [];
          newSolicitud.isSelected = [0, 0, 0, 0, 0];
          newSolicitud.propia = false;
          let obs = element.observaciones
            ? element.observaciones == ""
              ? "SIN OBSERVACIONES"
              : element.observaciones.length > 250
                ? element.observaciones.substring(0, 250)
                : element.observaciones
            : "";
          if (tempDia) {
            switch (tempDia.id) {
              case 0:
                newSolicitud.dia0.solicitados =
                  parseInt(element.cantidad) - parseInt(element.asignado);
                newSolicitud.dia0.solicitudes = [element];
                newSolicitud.observaciones.push(
                  tempDia.dia +
                  "/" +
                  tempDia.mes +
                  "-" +
                  newSolicitud.dia0.solicitados.toString() +
                  "C: " +
                  obs
                );
                break;
              case 1:
                newSolicitud.dia1.solicitados =
                  parseInt(element.cantidad) - parseInt(element.asignado);
                newSolicitud.dia1.solicitudes = [element];
                newSolicitud.observaciones.push(
                  tempDia.dia +
                  "/" +
                  tempDia.mes +
                  "-" +
                  newSolicitud.dia1.solicitados.toString() +
                  "C: " +
                  obs
                );
                break;
              case 2:
                newSolicitud.dia2.solicitados =
                  parseInt(element.cantidad) - parseInt(element.asignado);
                newSolicitud.dia2.solicitudes = [element];
                newSolicitud.observaciones.push(
                  tempDia.dia +
                  "/" +
                  tempDia.mes +
                  "-" +
                  newSolicitud.dia2.solicitados.toString() +
                  "C: " +
                  obs
                );
                break;
              case 3:
                newSolicitud.dia3.solicitados =
                  parseInt(element.cantidad) - parseInt(element.asignado);
                newSolicitud.dia3.solicitudes = [element];
                newSolicitud.observaciones.push(
                  tempDia.dia +
                  "/" +
                  tempDia.mes +
                  "-" +
                  newSolicitud.dia3.solicitados.toString() +
                  "C: " +
                  obs
                );
                break;
              case 4:
                newSolicitud.dia4.solicitados =
                  parseInt(element.cantidad) - parseInt(element.asignado);
                newSolicitud.dia4.solicitudes = [element];
                newSolicitud.observaciones.push(
                  tempDia.dia +
                  "/" +
                  tempDia.mes +
                  "-" +
                  newSolicitud.dia4.solicitados.toString() +
                  "C: " +
                  obs
                );
                break;

              default:
                break;
            }
          } else {
          }
          tempListadoSolicitudes.push(newSolicitud);
        } else {
          if (tempDia) {
            let obs = element.observaciones
              ? element.observaciones == ""
                ? "SIN OBSERVACIONES"
                : element.observaciones.length > 250
                  ? element.observaciones.substring(0, 250)
                  : element.observaciones
              : "";
            switch (tempDia.id) {
              case 0:
                let ant0 = itemListadoSolicitud.dia0.solicitados;
                itemListadoSolicitud.dia0.solicitados =
                  ant0 +
                  parseInt(element.cantidad) -
                  parseInt(element.asignado);
                itemListadoSolicitud.observaciones.push(
                  tempDia.dia +
                  "/" +
                  tempDia.mes +
                  "-" +
                  element.disponibles.toString() +
                  "C: " +
                  obs
                );
                itemListadoSolicitud.dia0.solicitudes.push(element);

                break;
              case 1:
                let ant1 = itemListadoSolicitud.dia1.solicitados;
                itemListadoSolicitud.dia1.solicitados =
                  ant1 +
                  parseInt(element.cantidad) -
                  parseInt(element.asignado);
                itemListadoSolicitud.observaciones.push(
                  tempDia.dia +
                  "/" +
                  tempDia.mes +
                  "-" +
                  element.disponibles.toString() +
                  "C: " +
                  obs
                );
                itemListadoSolicitud.dia1.solicitudes.push(element);

                break;
              case 2:
                let ant2 = itemListadoSolicitud.dia2.solicitados;
                itemListadoSolicitud.dia2.solicitados =
                  ant2 +
                  parseInt(element.cantidad) -
                  parseInt(element.asignado);
                itemListadoSolicitud.observaciones.push(
                  tempDia.dia +
                  "/" +
                  tempDia.mes +
                  "-" +
                  element.disponibles.toString() +
                  "C: " +
                  obs
                );
                itemListadoSolicitud.dia2.solicitudes.push(element);

                break;
              case 3:
                let ant3 = itemListadoSolicitud.dia3.solicitados;
                itemListadoSolicitud.dia3.solicitados =
                  ant3 +
                  parseInt(element.cantidad) -
                  parseInt(element.asignado);
                itemListadoSolicitud.observaciones.push(
                  tempDia.dia +
                  "/" +
                  tempDia.mes +
                  "-" +
                  element.disponibles.toString() +
                  "C: " +
                  obs
                );
                itemListadoSolicitud.dia3.solicitudes.push(element);

                break;
              case 4:
                let ant4 = itemListadoSolicitud.dia4.solicitados;
                itemListadoSolicitud.dia4.solicitados =
                  ant4 +
                  parseInt(element.cantidad) -
                  parseInt(element.asignado);
                itemListadoSolicitud.observaciones.push(
                  tempDia.dia +
                  "/" +
                  tempDia.mes +
                  "-" +
                  element.disponibles.toString() +
                  "C: " +
                  obs
                );
                itemListadoSolicitud.dia4.solicitudes.push(element);

                break;
              default:
                break;
            }
          }
        }

        tempListadoSolicitudes.forEach((element) => {
          let obs = "";
          if (element.observaciones.length == 0) {
            obs = "Sin Observaciones";
          } else {
            obs = "Observaciones:";
            element.observaciones.forEach((elem) => {
              obs = obs + "\n " + elem;
            });
          }
          element.obser = obs;
          element.total_solicitados =
            element.dia0.solicitados +
            element.dia1.solicitados +
            element.dia2.solicitados +
            element.dia3.solicitados +
            element.dia4.solicitados;
        });
      }
    }

    //this.dataSourceSolicitudes.data = this.tempListadoSolicitudes;

    this.variables.listadoSolicitudes = tempListadoSolicitudes;

    /*   this.listadoSolicitudesPropia.forEach((element) => {
      let caratulaparams = {
        descripcion:
          !element.dia0_solicitudes[0].caratula ||
          element.dia0_solicitudes[0].caratula == ""
            ? "Sin nominar"
            : element.dia0_solicitudes[0].caratula,
      };
      if (this.filtro.caratula == "") {
        this.addCaratula(caratulaparams);
        this.listadoSolicitudes.push(element);
      } else {
        if (caratulaparams.descripcion === this.filtro.caratula) {
          this.addCaratula(caratulaparams);
          this.listadoSolicitudes.push(element);
        }
      }
    }); */

    /*  this.listadoAsignacion.sort((a, b) =>
      a.nombreDestinatario.localeCompare(b.nombreDestinatario)
    );
    this.dataSource.data = this.listadoAsignacion;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.changeDetectorRefs.detectChanges(); */
    //}

    /*  if (this.isSelectedDestinatario) {
      this.disabledCorredor = false;
      this.disabledContraparte = false;
      this.disabledDestSolicitud = false;
      this.disabledContrato = false;
      this.disabledZona = false;
      this.disabledCaratula = false;
    } else {
      this.disabledCorredor = true;
      this.disabledContraparte = true;
      this.disabledDestSolicitud = true;
      this.disabledContrato = true;
      this.disabledZona = true;
      this.disabledCaratula = true;
    } */

    /*   if (this.contrapartes.length > 0) {
      this.ordenarContraparte();
    }
    if (this.destinatariosSolicitudes.length > 0) {
      this.ordenarDestinatariosSolicitudes();
    }
    if (this.contratos.length > 0) {
      this.ordenarContratos();
    }
    if (this.zonas.length > 0) {
      this.ordenarZonas();
    }
    if (this.caratulas.length > 0) {
      this.ordenarCaratulas();
    } */
  }

  actListAsigProducto(id_producto: number, tempDia, cantidad: number) {
    let indexListAsignacion =
      this.variables.listadoAsignacionProducto.findIndex(
        (item) => item.idProducto == id_producto
      );
    if (indexListAsignacion != -1) {
      switch (tempDia.id) {
        case 0:
          this.variables.listadoAsignacionProducto[
            indexListAsignacion
          ].dia0.solicitados =
            this.variables.listadoAsignacionProducto[indexListAsignacion].dia0
              .solicitados + cantidad;
          break;
        case 1:
          this.variables.listadoAsignacionProducto[
            indexListAsignacion
          ].dia1.solicitados =
            this.variables.listadoAsignacionProducto[indexListAsignacion].dia1
              .solicitados + cantidad;
          break;
        case 2:
          this.variables.listadoAsignacionProducto[
            indexListAsignacion
          ].dia2.solicitados =
            this.variables.listadoAsignacionProducto[indexListAsignacion].dia2
              .solicitados + cantidad;
          break;
        case 3:
          this.variables.listadoAsignacionProducto[
            indexListAsignacion
          ].dia3.solicitados =
            this.variables.listadoAsignacionProducto[indexListAsignacion].dia3
              .solicitados + cantidad;
          break;
        case 4:
          this.variables.listadoAsignacionProducto[
            indexListAsignacion
          ].dia4.solicitados =
            this.variables.listadoAsignacionProducto[indexListAsignacion].dia4
              .solicitados + cantidad;

          break;

        default:
          break;
      }
    }
  }
  actListAsigZonas(idZona: number, tempDia, cantidad: number) {
    let indexListAsignacion = this.variables.listadoAsignacionZona.findIndex(
      (item) => item.idZona == idZona
    );
    if (indexListAsignacion != -1) {
      switch (tempDia.id) {
        case 0:
          this.variables.listadoAsignacionZona[
            indexListAsignacion
          ].dia0.solicitados =
            this.variables.listadoAsignacionZona[indexListAsignacion].dia0
              .solicitados + cantidad;
          break;
        case 1:
          this.variables.listadoAsignacionZona[
            indexListAsignacion
          ].dia1.solicitados =
            this.variables.listadoAsignacionZona[indexListAsignacion].dia1
              .solicitados + cantidad;
          break;
        case 2:
          this.variables.listadoAsignacionZona[
            indexListAsignacion
          ].dia2.solicitados =
            this.variables.listadoAsignacionZona[indexListAsignacion].dia2
              .solicitados + cantidad;
          break;
        case 3:
          this.variables.listadoAsignacionZona[
            indexListAsignacion
          ].dia3.solicitados =
            this.variables.listadoAsignacionZona[indexListAsignacion].dia3
              .solicitados + cantidad;
          break;
        case 4:
          this.variables.listadoAsignacionZona[
            indexListAsignacion
          ].dia4.solicitados =
            this.variables.listadoAsignacionZona[indexListAsignacion].dia4
              .solicitados + cantidad;
          break;

        default:
          break;
      }
    }
  }

  totalizarAsignacionProducto() {
    this.variables.listadoAsignacionProducto.forEach((element) => {
      element.total_asignados =
        element.dia0.asignados +
        element.dia1.asignados +
        element.dia2.asignados +
        element.dia3.asignados +
        element.dia4.asignados;
      element.total_solicitados =
        element.dia0.solicitados +
        element.dia1.solicitados +
        element.dia2.solicitados +
        element.dia3.solicitados +
        element.dia4.solicitados;
    });
    this.messageService.sendMessage(
      "CambioDetallesZonasProducto",
      "0",
      this.variables.listadoAsignacionProducto
    );
  }

  totalizarAsignacionZona() {
    this.variables.listadoAsignacionZona.forEach((element) => {
      element.total_asignados =
        element.dia0.asignados +
        element.dia1.asignados +
        element.dia2.asignados +
        element.dia3.asignados +
        element.dia4.asignados;
      element.total_solicitados =
        element.dia0.solicitados +
        element.dia1.solicitados +
        element.dia2.solicitados +
        element.dia3.solicitados +
        element.dia4.solicitados;
    });
    this.variables.listadoAsignacionZona = this.variables.listadoAsignacionZona;
    this.messageService.sendMessage(
      "CambioDetallesZonas",
      "0",
      this.variables.listadoAsignacionZona
    );
    /* if (this.variables.showDetalleZona) {
      this.messageService.sendMessage(
        "CambioDetallesZonas",
        "0",
        this.variables.listadoAsignacionZona
      );
    } */
  }

  agregarDestinatarioDestino(element) {
    let destinatarioparams = {};
    if (element.idCuitDestinatario) {
      destinatarioparams = {
        cuit: element.idCuitDestinatario,
        razon_social:
          this.variables.detallesDisponiblesApi.destinatarios[
            element.idCuitDestinatario
          ].razon_social,
      };
    }
    let destinoparams = {};
    if (element.id_destino) {
      destinoparams = {
        id: 0,
        cuit: element.idCuitDestino,
        descripcion:
          this.variables.detallesDisponiblesApi.destino[element.id_destino]
            .nombreDestino,
      };
    }
    FunctionWorkDataTable.AddDestinatario(
      this.variables,
      destinatarioparams,
      destinoparams
    );
  }

  getZonas() {
    FunctionGetZonasCupoCentro.getAllZonas(
      this.cupoService,
      this.variables,
      localStorage.getItem("cuit_cuil")
    );
  }

  addProducto(prod) {
    let encontrado = false;
    for (let i = 0; i < this.productos.length; i++) {
      if (this.productos[i].id === prod.id) {
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      this.productos.push(prod);
    }
  }

  chanceDate(event) {
    //this.variables.showDetalleProductoZona = true;
    // this.variables.showDetalleZona = false;
    this.cambiarFecha.emit({ fecha: event.fecha });
  }
  selectedRowProducto(itemRowProducto: ListadoAsignacionProducto) {
    this.messageService.sendMessage(
      "seleccionarProducto",
      "0",
      itemRowProducto.idProducto
    );
    /*  let produc = this.productos.find((el) => el.id == itemRowProducto.idProducto);
    const anotherList: any[] = [produc.id];
    this.variables.filtro.idProductos = anotherList; */
    this.messageService.sendMessage("updateTable", null, null);
    this.variables.showDetalleZona = true;
    this.variables.showDetalleProductoZona = false;
    this.analisisCuposZona();
    this.analisisSolicitudes();
    this.totalizarAsignacionZona();
  }
}
