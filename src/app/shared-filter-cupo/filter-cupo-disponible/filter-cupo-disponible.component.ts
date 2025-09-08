import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { createFormPedido } from '@app/shared/components/cupo/asignacion-v2/functions';
import {
  CuposDisponible,
  DestinoFilter,
  OrigenDestino,
  Transportadora,
} from '@app/shared/components/home/cupos-disponibles/models/cupos-disponible';
import { CuposDisponiblesService } from '@app/shared/components/home/cupos-disponibles/services/cupos-disponibles.service';
import { HomeService } from '@app/shared/components/home/home.service';
import { Product } from 'app/shared/models/product.model';
import * as ExcelJS from 'exceljs/dist/exceljs';
import * as moment from 'moment';

//import Excel from 'exceljs/modern.browser';


@Component({
  selector: 'app-filter-cupo-disponible',
  templateUrl: './filter-cupo-disponible.component.html',
  styleUrls: ['./filter-cupo-disponible.component.scss']
})
export class FilterCupoDisponibleComponent implements OnInit {
  dataExcel: CuposDisponible[];
  @Input()
  productos: Product[];
  @Input()
  transportadoras: Transportadora[];
  @Input()
  origenDestinos: OrigenDestino[];
  @Input()
  destinos: DestinoFilter[];
  @Output() onDateSelect: EventEmitter<any> = new EventEmitter<any>();
  pageIndex: number;
  public pageSize = 50;
  public totalSize = 0;
  public total: string = ''
  filtrarForm: FormGroup;
  now = moment(new Date()).format("YYYY-MM-DD");
  selected = {
    opcion: "",
    value: "",
  }
  filtro = {
    id_producto: null,
    fechaCupo: this.now,
    id_origen: null,
    id_transportadora: null,
    id_destino: null,
    idCupoTerminal: "",
    nombreDestino: "",
    nombreProducto: "",
    dadorCuit:
      localStorage.getItem("dador_seleccionado") == null
        ? ""
        : localStorage.getItem("dador_seleccionado"),
    cosecha: "",
    nroContrato: "",
    usado: 0,
    vencido: 0
  };

  constructor(private homeService: HomeService,
    private cupoService: CuposDisponiblesService) {
    this.init()

  }

  ngOnInit() {
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.productos != undefined) {
      if (changes.productos.currentValue != undefined) {
        this.filtrarForm.controls['selectedProducto'].setValue(this.productos[0].id)
      }
    }
    if (changes.transportadoras) {
      if (changes.transportadoras.currentValue) {
        this.filtrarForm.controls['selectedTransportadora'].setValue(this.transportadoras[0].id_usuario)
      }
    }

    if (changes.destinos ) {
      if (changes.destinos.currentValue) {
        this.filtrarForm.controls['selectedDestino'].setValue(this.destinos[0].id_destino)
      }
    }
    if (changes.origenDestinos) {
      if (changes.origenDestinos.currentValue) {
        this.filtrarForm.controls['selectedOrigenDestino'].setValue(this.origenDestinos[0].id_origen)

      }
    }
  }


  init() {
    this.filtrarForm = createFormPedido();
  }

  setInitFiltros() {
    this.filtrarForm.controls['selectedFecha'].setValue(new Date());
    this.filtrarForm.controls['selectedProducto'].setValue(this.productos[0].id);
    this.filtrarForm.controls['selectedTransportadora'].setValue(this.transportadoras[0].id_usuario);
    this.filtrarForm.controls['selectedDestino'].setValue(this.destinos[0].id_destino);
    this.filtrarForm.controls['selectedOrigenDestino'].setValue(this.origenDestinos[0].id_origen);
  }

  aplicarFiltro(valor, cmp) {
    this.selected.opcion = valor;
    this.selected.value = cmp.value;
    this.onDateSelect.emit(this.selected);
  }

  limpiarFiltros() {
    this.setInitFiltros();
    this.selected.opcion = this.filtrarForm.controls["selectedProducto"].value;
    this.selected.value = this.homeService.formatoFecha(
      this.filtrarForm.controls["selectedFecha"].value,
      "amd",
      "-"
    );
    this.onDateSelect.emit("limpiar");
  }
  /**
   * carga la variable dataExcel con los datos
   */
  async loadingDataExcel() {
    this.makeFiltro();
    this.pageIndex = 1;
    this.pageSize = 50;
    await this.cupoService.getCuposDisponiblesFilters(
      this.filtro,
      this.pageIndex,
      this.pageSize,
      this.total
    ).toPromise().then(
      result => {
        this.dataExcel = result;
      }
    )
  }
  /**
   * seteo filtro con el formulario
   */
  makeFiltro() {
    this.filtro.fechaCupo = this.homeService.formatoFecha(
      this.filtrarForm.controls["selectedFecha"].value,
      "amd",
      "-");
    this.filtro.id_producto = this.filtrarForm.controls["selectedProducto"].value;
    this.filtro.id_transportadora = this.filtrarForm.controls['selectedTransportadora'].value;
    this.filtro.id_destino = this.filtrarForm.controls['selectedDestino'].value;
    this.filtro.id_origen = this.filtrarForm.controls['selectedOrigenDestino'].value;
  }

  async downloadFile() {
    await this.loadingDataExcel();
    const arrayToDownload = [];
    for (let c = 0; c < this.dataExcel.length; c++) {
      const object: any = {};
      object.fecha = (this.dataExcel[c].fecha) ? this.dataExcel[c].fecha : '';
      object.cupo = (this.dataExcel[c].idCupoTerminal) ? this.dataExcel[c].idCupoTerminal : '';
      object.exportadora = (this.dataExcel[c].nombreDestinatario) ? this.dataExcel[c].nombreDestinatario : '';
      object.producto = (this.dataExcel[c].producto) ? this.dataExcel[c].producto.descripcion : '';
      object.chofer = (this.dataExcel[c].nombreChofer) ? this.dataExcel[c].nombreChofer : 'Sin chofer asignado';
      object.patente = (this.dataExcel[c].patente) ? this.dataExcel[c].patente: 'Sin chofer asignado';
      object.transportadora = (this.dataExcel[c].derivacion) ? this.dataExcel[c].derivacion.transportadora : '';
      object.origen = (this.dataExcel[c].origen) ? this.dataExcel[c].origen.descripcion : '';
      object.destino = (this.dataExcel[c].destino) ? this.dataExcel[c].destino.descripcion : '';
      object.estado = (this.dataExcel[c].idCupoEstado) ?
       this.getDescripcionEstado(this.dataExcel[c].idCupoEstado) : 'Sin chofer asignado';
      arrayToDownload.push(object);
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('data');
    worksheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 12  },
      { header: 'Cupo', key: 'cupo', width: 25  },
      { header: 'Producto', key: 'producto', width: 10  },
      { header: 'Exportadora', key: 'exportadora', width: 20  },
      { header: 'Chofer', key: 'chofer', width: 20 },
      { header: 'Chapa', key: 'patente', width: 20 },
      { header: 'Transportadora', key: 'transportadora', width: 17  },
      { header: 'Origen/Planta', key: 'origen', width: 20  },
      { header: 'Destino', key: 'destino', width: 27  },
      { header: 'Estado', key: 'estado', width: 18  },
    ];

    let headerRow = worksheet.getRow(1);
    headerRow.height = 25
    worksheet.header
    headerRow.eachCell((cell, number) => {
      cell.font = {
        name: 'Calibri',
        family: 2,
        size: 12,
        bold: true,
        italic: true,
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ffd966" },
      };
      cell.border = {
        left: {style:'thin', color: {argb:'000000'}},
        bottom: {style:'thin', color: {argb:'000000'}},
        right: {style:'thin', color: {argb:'000000'}}
      }
      cell.alignment = { vertical: "middle", horizontal: "center" };
    })

    worksheet.addRows(arrayToDownload);
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: {style:'thin', color: {argb:'000000'}},

          bottom: {style:'thin', color: {argb:'000000'}},
          left: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } },
        };
      });
    });

    const blob = await workbook.xlsx.writeBuffer();
    const blobData = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blobData);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = 'cupos' + "_" + 'disponibles' + '.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  getDescripcionEstado(idEstado:string):string{
    switch(idEstado){
      case '1':{
        return "En transito origen";
      }
      case '2':{
        return "Cargado";
      }
      case '3':{
        return "Descargado";
      }
      case '4':{
        return "Rechazado";
      }
      case '5': {
        return "Arribado";
      }
      default: {
        return "Sin chofer asignado";
      }
    }
  }
}
