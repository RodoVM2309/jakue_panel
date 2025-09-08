import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material";
//import { ListadoSolicitud } from "@app/shared/components/cupo/asignacion-v2/asignacion-v2.component";
import { AsignarSinSolicitudComponent } from "@app/shared/components/cupo/asignar-sin-solicitud/asignar-sin-solicitud.component";
import { CupoService } from "@app/shared/components/cupo/cupo.service";
import {
  CentroSinEMail,
  DiaSemana
} from "@app/shared/components/cupo/cuponera/cuponera.component";
import { AppAtencionService, MessageService } from "@app/shared/services";
import { HotTableComponent } from "@handsontable-pro/angular";
import * as Handsontable from "handsontable-pro";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { ListadoSolicitudes, Seleccion, Solicitud } from "../../models";
import { FunctionInitFormGestion } from "../gestion/functions";
@Component({
  selector: "app-grid-solicitudes",
  templateUrl: "./grid-solicitudes.component.html",
  styleUrls: ["./grid-solicitudes.component.scss"],
})
export class GridSolicitudesComponent implements OnInit {
  @Input() variables;
  @Input() dias: DiaSemana[] = [];
  @Input() myData;
  @Input() listSinEmail: CentroSinEMail[] = [];
  @Input() set listadoSolicitudes(data: ListadoSolicitudes[]) {
    this.listSolicitudes = data;
  }
  @ViewChild("hot") hot: HotTableComponent;
  @ViewChild("tablaSolicitudes") tablaSolicitudes: ElementRef;
  listSolicitudes: ListadoSolicitudes[] = [];
  tableSettings: any = {
    stretchH: "all",
    width: "100%",
    colWidths: [70, 70, 70, 35, 20, 40, 40, 40, 40, 40, 45],
    // colWidths: 128,
    maxRows: 300,
    manualRowResize: false,
    manualColumnResize: false,
    className: "htCenter",
    manualRowMove: false,
    manualColumnMove: false,
    filters: false,
    // dropdownMenu: true,

    // autoWrapRow: false,
    minSpareRows: false,
    columnSorting: false,
    fillHandle: false,
    currentRowClassName: "currentRow",
    currentColClassName: "currentCol",
    rowHeaderWidth: 30,
    rowHeights: "44px",
    viewportColumnRenderingOffset: 27,
    viewportRowRenderingOffset: "auto",
    height: 370,
    disableVisualSelection: ["header"],
    //beforeRefreshDimensions: false,
    allowInsertRow: true,
    contextMenu: false,
    rowHeaders: false,
    columns: [
      {
        data: "zona",
        type: "text",
        readOnly: true,
      },
      {
        data: "comercial",
        type: "text",
        readOnly: true,
      },
      {
        data: "cliente",
        type: "text",
        readOnly: true,
      },
      {
        data: "contrato",
        type: "text",
        readOnly: true,
      },

      {
        data: "saldo",
        type: "text",
        readOnly: true,
      },
      {
        data: "dia0.solicitados",
        type: "numeric",
        readOnly: true,
      },
      {
        data: "dia1.solicitados",
        type: "numeric",
        readOnly: true,
      },
      {
        data: "dia2.solicitados",
        type: "numeric",
        readOnly: true,
      },
      {
        data: "dia3.solicitados",
        type: "numeric",
        readOnly: true,
      },
      {
        data: "dia4.solicitados",
        type: "numeric",
        readOnly: true,
      },
      {
        data: "total_solicitados",
        type: "numeric",
        readOnly: true,
      },
    ],
    colHeaders: true,

    /* colHeaders: [
      "ZONA",
      "COMERCIAL",
      "CLIENTE",
      "DESTINATARIO",
      "CONTRATO",
      "SALDO",
      "",
      "",
      "",
      "",
      "",
      "TOTAL_SOLICITADOS",
    ], */
    afterValidate: function (isValid, value, row, prop) {
      if (value == false) {
        alert("Invalid");
        //Value = isValid
        // row = inserted invalid value
        //prop = row index changed
      }
    },
    cells: function (row, col) {
      return true;
    },
  };
  renderButtons(instance, td, row, col, prop, value, cellProperties) {
    td.innerHTML = "<button onclick='alert()' type='button'>press</button>";
  }
  private hotInstance;
  instance: Handsontable;
  colHeaders: string[] = [];
  rowHeaders: string[] = [];
  agregarsolicitud = true;
  seleccionados: Seleccion[] = [];
  hoyMoment: moment.Moment = moment();
  hoyString = moment().format("YYYY-MM-DD");
  topaddSolicitad = 455;
  leftaddSolicitad = 47;
  topaddSolicitadbootom = 75;
  interval: any;
  private subscription: Subscription;
  message: any;

  constructor(
    private dialog: MatDialog,
    private cupoService: CupoService,
    private atencionService: AppAtencionService,
    private messageService: MessageService,
  ) {
    this.subscription = this.messageService
      .getMessage()
      .subscribe((message) => {
        this.message = message;
        switch (this.message.text) {

          case "chanceHandsonTable":
            this.chanceData(this.message.data);
            break;
          default:
            break;
        }
      });
  }

  ngOnInit() {
    this.interval = setInterval(() => {
      if (this.tablaSolicitudes) {
        let value = this.tablaSolicitudes.nativeElement.getBoundingClientRect();
        this.topaddSolicitad = value.top;
        this.leftaddSolicitad = value.left;
      }
    }, 100);
  }

  chanceData(data) {
    let infos = [];
    this.colHeaders = [];
    this.rowHeaders = infos;
    /* this.colHeaders.push('<div class="tooltip-button" ><span title="'  +
    '" class="material-icons">add_circle</span></div>'); */
    this.colHeaders.push("ZONA");
    this.colHeaders.push("COMERCIAL");
    this.colHeaders.push("CLIENTE");
    this.colHeaders.push("CONTRATO");
    this.colHeaders.push("SALDO");
    this.dias.forEach((element) => {
      this.colHeaders.push(
        element.dia_semana_string + "." + element.dia + "/" + element.mes
      );
    });
    this.colHeaders.push("SOLICITADOS");
    let settings = {
      colHeaders: this.colHeaders,
      rowHeaders: infos,
      maxRows: this.listSolicitudes.length,
    };
    this.hotInstance.updateSettings({
      data: data,
    });
    this.instance.loadData(data);
    this.instance.render();
  }

  detectChanges = (hotInstance, changes, source) => {
    // Asocio la instancia general con la variable de instacia preparada, pudiendo luego acceder a la misma instancia
    this.instance = hotInstance;

    //  Inicializo el array de seleccionados
    this.seleccionados = [];
    this.variables.preAsignacion = [];
    FunctionInitFormGestion.initFormGestion(this.variables);
    this.variables.disabledSelectCabecera = true;
    this.variables.validatedForm = false;

    // Me traigo el array completo de todas las celdas. Y por cada celda pinto el fondo de blanco.
    var todos = hotInstance.getData();
    for (let fila = 0; fila < todos.length; fila++) {
      for (let columna = 0; columna < 10; columna++) {
        hotInstance.setCellMeta(fila, columna, "className", "un_selecionadas");
      }
    }

    // A los seleccionados le agrego la clase que pinta el fondo verde.
    var selected = hotInstance.getSelected();
    for (var index = 0; index < selected.length; index += 1) {
      var item = selected[index];
      var startRow = Math.min(item[0], item[2]);
      var endRow = Math.max(item[0], item[2]);
      var startCol = Math.min(item[1], item[3]);
      var endCol = Math.max(item[1], item[3]);
      for (var rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
        for (
          var columnIndex = startCol;
          columnIndex <= endCol;
          columnIndex += 1
        ) {
          let minData = moment();
          this.hoyMoment = moment(this.hoyString);
          let fec = this.dias[(columnIndex - 5).toString()].fecha;
          let otrFecha = moment(fec);
          if (otrFecha < minData) {
            minData = otrFecha;
          }
          if (minData >= this.hoyMoment) {
            hotInstance.setCellMeta(
              rowIndex,
              columnIndex,
              "className",
              "seleccionDemanda"
            );
            let seleccion: Seleccion = {
              fila_solicitud: rowIndex,
              col_dia: columnIndex,
            };
            this.seleccionados.push(seleccion);
          } else {
            this.variables.disabledAcciones = true;
          }
        }
      }
    }

    let alerta = false;

    // Trabajo con los seleccionados
    let diferentDestinatario = false;
    this.seleccionados.forEach((element) => {
      let columSolicitados = "dia" + (element.col_dia - 5).toString();
      let columSolicitudes = "dia" + (element.col_dia - 5).toString();
      /* let columSolicitudes =
        "dia" + (element.col_dia - 6).toString() + "_solicitudes"; */
      let columSelected = "dia" + (element.col_dia - 5).toString();

      const valorListadoSolicitudes =
        this.variables.listadoSolicitudes[element.fila_solicitud];

      let valorCellListadoSolicitudes = 0;
      let demandasListadoSolicitudes: Solicitud[] = [];
      let valorCellSelectedItemAsignacion = 0;
      let cuposCellSelectedItemAsignacion = [];

      for (let key in valorListadoSolicitudes) {
        if (key === columSolicitados) {
          valorCellListadoSolicitudes =
            valorListadoSolicitudes[key].solicitados;
        }
        if (key === columSolicitudes) {
          demandasListadoSolicitudes = valorListadoSolicitudes[key].solicitudes;
        }
      }
      for (let key in this.variables.selectedItemAsignacion) {
        if (key === columSelected) {
          valorCellSelectedItemAsignacion =
            this.variables.selectedItemAsignacion[key].asignados;
          /* cuposCellSelectedItemAsignacion = this.selectedItemAsignacion[key]
            .cupos; */
          continue;
        }
      }
      /* if (
        !valorListadoSolicitudes.propia &&
        valorListadoSolicitudes.destinatario.length > 0 &&
        valorListadoSolicitudes.destinatario !==
          this.variables.selectedItemAsignacion.nombreDestinatario
      ) {
        diferentDestinatario = true;
      } */

      let buscarSiTieneEmail =
        valorListadoSolicitudes.comercialCuit == "00000000000"
          ? valorListadoSolicitudes.clienteCuit
          : valorListadoSolicitudes.comercialCuit;
      if (buscarSiTieneEmail) {
        this.cupoService.getTieneEmailCuit(buscarSiTieneEmail).subscribe(
          (res) => {
            if (res.data.tiene_email_notificacion == "NO") {
              let temp = this.listSinEmail.find(
                (item) => item.cuit == buscarSiTieneEmail
              );
              if (temp == undefined) {
                let item = new CentroSinEMail();
                item.cuit = buscarSiTieneEmail;
                item.razon_social = res.data.razon_social;
                item.email = [];
                item.id = parseInt(res.data.id_usuario);

                this.listSinEmail.push(item);
              }
            }
          },
          (error) => { }
        );
      }

      this.variables.preAsignacion.push({
        dia: (element.col_dia - 5).toString(),
        receptorCuit: valorListadoSolicitudes.comercialCuit,
        contraparte: valorListadoSolicitudes.clienteCuit,
        contrato: valorListadoSolicitudes.contrato,
        destinatario: valorListadoSolicitudes.destinatario,
        demandas:
          demandasListadoSolicitudes.length > 0
            ? demandasListadoSolicitudes
            : null,
        cantidad: valorCellListadoSolicitudes,
        disponibles: valorCellSelectedItemAsignacion,
      });
    });
    if (this.variables.preAsignacion.length > 0) {
      this.variables.disabledAcciones = false;
      if (diferentDestinatario) {
        this.atencionService.confirm({
          message:
            "El DESTINATARIO indicado en la solicitud no coincide con el de los cupos por asignar ",
        });
      }
    } else {
      this.variables.disabledAcciones = true;
    }

    // Alerto que se selecciono valores con cero
    /* if (alerta) {
      this.errorService.confirm({
        message: "¡No puede seleccionar días sin solicitudes! ",
      });
    } */

    // Vuelvo a redenrizar toda la tabla para que salgan los cambios
    hotInstance.render();
  };
  afterInit = (hotInstance) => {
    this.instance = hotInstance;

    let infos = [];
    this.variables.listadoSolicitudes.forEach((element) => {
      let obs = "";
      if (element.observaciones.length == 0) {
        obs = "Sin Observaciones";
      } else {
        obs = "Observaciones:";
        element.observaciones.forEach((elem) => {
          obs = obs + "\n " + elem;
        });
      }
      infos.push(
        '<div class="tooltip-button" ><span title="' +
        obs +
        '" class="material-icons">feedback</span></div>'
      );
      element.obser = infos;
    });

    this.rowHeaders = infos;
    /* this.colHeaders.push('<div class="tooltip-button" ><span title="'  +
    '" class="material-icons">add_circle</span></div>'); */
    this.colHeaders.push("ZONA");
    this.colHeaders.push("COMERCIAL");
    this.colHeaders.push("CLIENTE");
    this.colHeaders.push("CONTRATO");
    this.colHeaders.push("SALDO");
    this.dias.forEach((element) => {
      this.colHeaders.push(
        element.dia_semana_string + "." + element.dia + "/" + element.mes
      );
    });
    this.colHeaders.push("SOLICITADOS");
    let settings = {
      colHeaders: this.colHeaders,
      rowHeaders: infos,
      maxRows: this.listSolicitudes.length,
    };

    //let data = this.listSolicitudes;
    let data = this.variables.listadoSolicitudes;

    hotInstance.updateSettings(settings);

    // cargo la data de la tabla
    hotInstance.loadData(data);

    this.agregarsolicitud = true;
  };

  // Pintar la ultima columna de total de solicitados
  pintarSolicitado = (hotInstance, column, TH) => {
    if (column == 10) {
      Handsontable.dom.addClass(TH, "totalsolicitados");
    }
  };

  // Renderizar cada celda de la tabla en el momento que se crea
  renderRow = (hotInstance, td, row, col, prop, value, cellProperties) => {
    // Poner color a la columna de total solicitados
    if (col == 10) {
      td.style.background = "#FFF5CC";
    }

    // Aumentar tamaño de texto a las cantidades
    if (col > 4) {
      td.style.fontSize = "17px";
    }
  };

  limitarSeleccion = (hotInstance, event, TD, controller) => {
    if ((TD.col >= -1 && TD.col <= 4) || TD.col == 10) {
      event.stopImmediatePropagation();
    } else {
      if (this.variables.listadoSolicitudes.length > 0) {
        let minData = moment();
        this.hoyMoment = moment(this.hoyString);
        let fec = this.dias[(TD.col - 5).toString()].fecha;
        let otrFecha = moment(fec);
        if (otrFecha < minData) {
          minData = otrFecha;
        }
        if (minData < this.hoyMoment) {
          event.stopImmediatePropagation();
        }
      }
    }
  };

  limitarSeleccion2 = (hotInstance, event, TD, blockCalculations) => {
    if ((TD.col >= -1 && TD.col <= 4) || TD.col == 10) {
      event.stopImmediatePropagation();
    } else {
      if (this.variables.listadoSolicitudes.length > 0) {
        let minData = moment();
        this.hoyMoment = moment(this.hoyString);
        let fec = this.dias[(TD.col - 5).toString()].fecha;
        let otrFecha = moment(fec);
        if (otrFecha < minData) {
          minData = otrFecha;
        }
        if (minData < this.hoyMoment) {
          event.stopImmediatePropagation();
        }
      }
    }
  };

  addSolicitudPropia() {
    let selectedCorredor = this.variables.comerciales.find(
      (item) => item.cuit === this.variables.filtro.cuitComercial
    );
    let corredor = {
      cuit: selectedCorredor ? selectedCorredor.cuit : "",
      descripcion: selectedCorredor ? selectedCorredor.descripcion : "",
    };
    let selectedContraparte = this.variables.clientes.find(
      (item) => item.cuit === this.variables.filtro.cuitCliente
    );

    let contraparte = {
      id: "",
      cuit: "",
      descripcion: "",
    };
    if (selectedContraparte) {
      contraparte = {
        id: selectedContraparte.id.toString(),
        cuit: selectedContraparte.cuit,
        descripcion: selectedContraparte.descripcion,
      };
    } else {
      for (let key in this.variables.detallesDisponiblesApi
        .corredor_contraparte) {
        if (
          this.variables.detallesDisponiblesApi.corredor_contraparte.hasOwnProperty(
            key
          )
        ) {
          if (
            this.variables.detallesDisponiblesApi.corredor_contraparte[key]
              .cuit == this.variables.filtro.cuitCliente
          ) {
            contraparte = {
              id: this.variables.filtrarForm.controls["selectedCliente"].value,
              cuit: this.variables.detallesDisponiblesApi.corredor_contraparte[
                key
              ].cuit,
              descripcion:
                this.variables.detallesDisponiblesApi.corredor_contraparte[key]
                  .razon_social,
            };
          }
        }
      }
    }

    let contrato = {
      id: 0,
      descripcion: this.variables.filtro.contrato,
    };
    let caratula = {
      id: null,
      descripcion: "",
    };

    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AsignarSinSolicitudComponent,
      {
        width: "60vw",
        // height: '95vh',
        disableClose: true,
        panelClass: "no-padding-dialog",
        data: {
          corredor: corredor,
          contraparte: contraparte,
          contrato: contrato,
          caratula: caratula,
        },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      // Cargo el popup con el formulario para agregar la nueva solicitud (esto es un ejemplo de como debería venir la nueva solicitud desúes de cerrar el form)
      let solicitudPropia = new Solicitud();
      solicitudPropia = {
        id_demanda_cupo: null,
        idCuitDestinatario: null,
        idCuitDestino: null,
        id_producto: null,
        id_zona_solicitud: null,
        fecha: null,
        corredor: null,
        demandanteCuit: null,
        destinatario: null,
        observaciones: null,
        contraparte: null,
        contrato: null,
        cantidad: null,
        asignado: null,
        corredor_demanda: null,
        propia: true,
        disponibles: null,
        caratula: res.caratula,
      };
      let caratulaparams = {
        descripcion:
          !res.caratula || res.caratula == "" ? "Sin nominar" : res.caratula,
      };
      //this.addCaratula(caratulaparams);
      let newsolicitud: ListadoSolicitudes = {
        comercial:
          res.corredorCuit == "00000000000"
            ? this.myData.lbCorredor
            : res.corredor.toUpperCase(),
        comercialCuit: res.corredorCuit,
        cliente: res.contraparte ? res.contraparte.toUpperCase() : "",
        clienteCuit: res.contraparteCuit,
        contrato: res.contrato,
        zona: null,
        observaciones: [],
        cantidad: 0,
        disponibles: 0,
        destino: null,
        destinoCuit: null,
        saldo: 0,
        id_zona_solicitud: null,
        dia0: {
          solicitados: 0,
          solicitudes: [],
        },
        dia1: {
          solicitados: 0,
          solicitudes: [],
        },
        dia2: {
          solicitados: 0,
          solicitudes: [],
        },
        dia3: {
          solicitados: 0,
          solicitudes: [],
        },
        dia4: {
          solicitados: 0,
          solicitudes: [],
        },

        total_solicitados: 0,
        isSelected: [0, 0, 0, 0, 0],
        obser: null,
        propia: true,
      };

      // Inserto el nuevo registro a la tabla
      this.variables.listadoSolicitudes.push(newsolicitud);
      //this.variables.listadoSolicitudesPropia.push(newsolicitud);
      //this.hot.getHandsontableInstance().render();
      // Inserto el nuevo icono de info de onservaciones
      let obs = "Sin Observaciones";

      /*  let obs = '';
          if ( element.observaciones.length==0){
            obs= 'Observaciones:';
            element.observaciones.forEach(elem => {
              obs= obs+'\n '+elem
            });
          }*/
      this.rowHeaders.push(
        '<div class="obs" ><span title="' +
        obs +
        '" class="material-icons">feedback</span></div>'
      );

      // Preparo la nueva configuracion de la tabla
      this.dias.forEach((element) => {
        this.colHeaders.push(
          element.dia_semana_string + "." + element.dia + "/" + element.mes
        );
      });
      this.colHeaders.push("SOLICITADOS");
      let settings = {
        colHeaders: this.colHeaders,
        rowHeaders: this.rowHeaders,
        maxRows: this.rowHeaders.length,
      };

      let data = this.listadoSolicitudes;
      ///

      // Actualizo los datos de configuracion de la tabla
      this.instance.updateSettings(settings);

      // cargo la data de la tabla
      this.instance.loadData(data);
      return;
    });
  }

  afterOnCellMouseDown(e, coords, TD) {
  }
}
