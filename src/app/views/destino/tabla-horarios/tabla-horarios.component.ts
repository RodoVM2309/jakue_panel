import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import * as Handsontable from 'handsontable-pro';

//Servicios
import { HorarioPuertoService } from 'app/shared/services/horario-puerto.service';
import { Subscription } from 'rxjs';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { AppAtencionService } from 'app/shared/services/app-atencion/app-atencion.service';

export class Seleccion {
  fila_horario: number;
  col_dia: number;
}


@Component({
  selector: 'app-tabla-horarios',
  templateUrl: './tabla-horarios.component.html',
  styleUrls: ['./tabla-horarios.component.scss']
})
export class TablaHorariosComponent implements OnInit, OnDestroy {
  @Input() turno_banda: number = 0;
  @Input() id_producto: number;
  @Input() id_destino: number;
  @Output() gridSeleccionada: EventEmitter<any> = new EventEmitter();
  instance: Handsontable;
  seleccionados: Seleccion[] = [];
  arrayHeader = [];
  colHeader = [];
  cantidad_seleccionado: number = 0;

  subcriptionFiltro: Subscription;

  constructor(private horarioPuertoService: HorarioPuertoService,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,) {

  }

  ngOnInit() {
    this.subcriptionFiltro = this.horarioPuertoService.filtros$.subscribe(res => {
      //console.log('Recibiendo valores',res);
      this.aplicarFilto(res);
    }, err => {
      //console.log(err.error.data.message);
      this.errorService.confirm({ message: err.error.data.message }).subscribe(res => {
        if (res) {
          return;
        }
      });
    });

  }
  ngOnDestroy(): void {
    this.subcriptionFiltro.unsubscribe();
  }


  aplicarFilto(data) {
    //console.log('haciendo la peticion',data);
    let id_producto = data.id_producto;
    let id_destino = data.id_destino;
    let sem = data.sem;
    this.horarioPuertoService.getBandaHorariasFiltro(id_producto, id_destino, sem).subscribe(resp => {
      //console.log('Obteniendo datos',resp);
      // Preparo la nueva configuracion de la tabla
      let settings = {
        colHeaders: resp.data.colHeaders,
        rowHeaders: resp.data.rowHeaders,
        maxRows: resp.data.rowHeaders.length
      };
      //console.log("Cantidad  filas",resp.data.rowHeaders.length);
      //console.log("Cantidad columnas",resp.data.dataSet.length);
      this.colHeader = resp.data.colHeaders;
      let data = resp.data.dataSet;
      // Actualizo los datos de configuracion de la tabla
      this.instance.updateSettings(settings);
      // cargo la data de la tabla
      this.instance.loadData(data);
    }, err => {
      //console.log(err.error.data.message);
      this.atencionService.confirm({ message: err.error.data.message }).subscribe(res => {
        if (res) {
          return;
        }
      });
    });

  }
  tableSettings: any = {
    stretchH: "all",
    colWidths: [47, 47, 47, 47, 47, 47, 47],
    // colWidths: 128,
    maxRows: 300,
    manualRowResize: false,
    manualColumnResize: false,
    className: "htCenter",
    manualRowMove: false,
    manualColumnMove: false,
    contextMenu: false,
    filters: false,
    dropdownMenu: false,
    autoWrapRow: false,
    minSpareRows: false,
    columnSorting: false,
    fillHandle: false,
    currentRowClassName: 'currentRow',
    // set width for all row headers
    rowHeaderWidth: 150,
    //colHeaders: true,
    viewportColumnRenderingOffset: 27,
    viewportRowRenderingOffset: "auto",
    height: 450,
    autoRowSize: true,
    // allowInsertColumn: false,
    // allowInsertRow: false,
    // allowRemoveColumn: false,
    // allowRemoveRow: false,
    // autoWrapRow: false,
    // autoWrapCol: false,
    // stretchH: "all",
    // width: 924,
    // autoWrapRow: true,
    //height: 487,
    // rowHeaders: true,

    columns: [
      {
        data: 'lunes',
        type: 'text',
        readOnly: true,
      },
      {
        data: 'martes',
        type: 'text',
        readOnly: true
      },
      {
        data: 'miercoles',
        type: 'text',
        readOnly: true
      },
      {
        data: 'jueves',
        type: 'text',
        readOnly: true
      },
      {
        data: 'viernes',
        type: 'text',
        readOnly: true
      },
      {
        data: 'sabado',
        type: 'text',
        readOnly: true
      },
      {
        data: 'domingo',
        type: 'text',
        readOnly: true
      },
    ],

    // Aqui se pone el arreglo de fechas enviados por la api.
    colHeaders: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
    // Agui hay que poner el arreglo de horarios enviados por la api.
    rowHeaders: [],
    afterValidate: function (isValid, value, row, prop) {
      if (value == false) {
        //console.log( value, row, prop)
        alert("Invalid")
        //Value = isValid
        // row = inserted invalid value
        //prop = row index changed
      }

    }
  };
  // Aqui se pone el arreglo de cantidades por fila enviados por la api.
  dataset = [];

  afterInit = (hotInstance) => {//cargar la data init , 
    //  Instancia completa luego de iniciar
    //console.log('afterInit', hotInstance);
    // Guardo la instancia en variable global
    this.instance = hotInstance;
    this.horarioPuertoService.getBandaHorariasFiltro(this.id_destino,this.id_producto,'actual').subscribe(resp => {
      //Respuesta del servicio general
      //console.log(resp);
      //Preparo la nueva configuracion de la tabla
      let settings = {
        colHeaders: resp.data.colHeaders,
        rowHeaders: resp.data.rowHeaders,
        maxRows: resp.data.rowHeaders.length
      };
      //console.log("Cantidad  filas",resp.data.rowHeaders.length);
      //console.log("Cantidad columnas",resp.data.dataSet.length);
      this.colHeader = resp.data.colHeaders;
      let data = resp.data.dataSet;
      // Actualizo los datos de configuracion de la tabla
      hotInstance.updateSettings(settings);
      // cargo la data de la tabla
      hotInstance.loadData(data);
    });
  }


  detectChanges = (hotInstance, row, prop, row2, prop2, selectionLayerLevel) => {
    this.cantidad_seleccionado = 0;
    this.seleccionados = [];
    //console.log('Instancia Completa', hotInstance);
    this.instance = hotInstance;
    // Me traigo el array completo de todas las celdas. Y por cada celda pinto el fondo de blanco.
    var todos = hotInstance.getData();
    for (let fila = 0; fila < todos.length; fila++) {
      const columnas = todos[fila];
      const count_columnas = columnas.length;
      for (let columna = 0; columna < count_columnas; columna++) {
        hotInstance.setCellMeta(fila, columna, 'className', 'un_selecionadas');
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
        for (var columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {
          hotInstance.setCellMeta(rowIndex, columnIndex, 'className', 'selecionadas');
          this.cantidad_seleccionado++;
          let seleccion: Seleccion = {
            "fila_horario": rowIndex,
            "col_dia": columnIndex
          };
          this.seleccionados.push(seleccion);
          // Cambio el valor de  la cantidad de turno en la grid seleccionada
          //this.instance.setDataAtCell(rowIndex, columnIndex, this.turno_banda);

        }
      }
    }
    // Emito los datos
    this.gridSeleccionada.emit({
      'grid_seleccionada': this.seleccionados,
      'cantidad_seleccionado': this.cantidad_seleccionado,
    });
    // renderizo toda la tabla con los nuevos campos.
    hotInstance.render();
    // Otros datos relacionados a la seleccion.
    /*  //console.log('fila inicial', row);
     //console.log('columna inicial', prop);
     //console.log('fila final', row2);
     //console.log('columna final', prop2);
     //console.log('Donde arranca la seleccion', selectionLayerLevel); */
  };

  // Función para cambiar los valores de las celdas seleccionadas.
  cambiar_valor() {
    //console.log("HEY");
    if (this.seleccionados.length > 0) {
      for (var index = 0; index < this.seleccionados.length; index += 1) {
        var item = this.seleccionados[index];
        var startRow = Math.min(item[0], item[2]);
        var endRow = Math.max(item[0], item[2]);
        var startCol = Math.min(item[1], item[3]);
        var endCol = Math.max(item[1], item[3]);

        for (var rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
          for (var columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {
            this.instance.setDataAtCell(rowIndex, columnIndex, '20');
          }
        }
      }
    }
  }
  // Pintar el día actual de la semana
  pintarDiaActual = (hotInstance, column, TH) => {
    //console.log('Instancia Completa', hotInstance);
    //console.log('column', column);
    //console.log('TH', TH);
    let date_ob = new Date();
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let diasSemana = new Array("Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado");

    //console.log(this.colHeader);
    let fecha_act = diasSemana[date_ob.getDay()] + " " + date + "/" + month;
    //console.log(fecha_act);
    if (this.colHeader.length > 0) {
      let d_ac = this.colHeader.indexOf(fecha_act);
      //console.log("Array hoy",this.colHeader[d_ac]);
      //console.log(fecha_act);
      if (d_ac != -1) {
        //console.log(d_ac);
        if (column == d_ac) {
          Handsontable.dom.addClass(TH, 'header_color');
        }
      }
    }
  }
}
