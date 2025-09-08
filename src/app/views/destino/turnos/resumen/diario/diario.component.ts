import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatRadioChange } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material";
import { AppAlertService } from "app/shared/services/app-alert/app-alert.service";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { AppAtencionService } from "app/shared/services/app-atencion/app-atencion.service";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { Destinos } from '../../../../../shared/components/home/mapa-cupos/mapa-cupos.component';
import { HomeService } from 'app/shared/components/home/home.service';
import { CupoService } from 'app/shared/components/cupo/cupo.service';

export class Resumen {
  destino: string;
  producto: string;
  cupeados: number;
  descargados: number;
  solicitados: number;
  cumplidos: number;
}

@Component({
  selector: 'app-turnos-resumen-diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.scss']
})
export class DiarioComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  resumenDiario: Resumen[] = [];
  displayedColumns: string[] = [
    "destino",
    "producto",
    "cupeados",
    "descargados",
    "solicitados",
    "cumplidos"
  ];
  spans = [];
  resumenDiarioForm: FormGroup;
  now = new Date();
  filtro = {
    fechaCupo: this.now,
    id_producto: 0,
    producto: ''
  };
  public fechaBuscada: string = "";
  public fechaHoy: string = "";
  otrosproductos = [];



  constructor(
    private alertService: AppAlertService,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,
    private loader: AppLoaderService,
    private homeService: HomeService,
    private cupoService: CupoService,
  ) { }

  ngOnInit() {
    this.fechaHoy = this.homeService.formatoFecha(this.now, "amd", "-");
    this.fechaBuscada = this.homeService.formatoFecha(this.now, "amd", "-");
    this.resumenDiarioForm = new FormGroup({
      selectedFecha: new FormControl(this.filtro.fechaCupo),
      selectedProducto: new FormControl(this.filtro.id_producto)
    });
    this.getItems();
    this.getItemsProductos();
  }

  getItems() {
    this.resumenDiario = [{
      destino: "Destino 1",
      producto: "soja",
      cupeados: 10,
      descargados: 5,
      solicitados: 3,
      cumplidos: 3
    },
    {
      destino: "Destino 1",
      producto: "Maiz",
      cupeados: 15,
      descargados: 4,
      solicitados: 2,
      cumplidos: 1
    },
    {
      destino: "Destino 2",
      producto: "soja",
      cupeados: 10,
      descargados: 5,
      solicitados: 3,
      cumplidos: 3
    }
    ]

    this.dataSource.data = this.resumenDiario;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.spanRow("destino", d => d.destino);

  }
  spanRow(key, accessor) {
    this.spans = [];
    for (let i = 0; i < this.resumenDiario.length;) {
      let currentValue = accessor(this.resumenDiario[i]);
      let count = 1;

      // Iterate through the remaining rows to see how many match
      // the current value as retrieved through the accessor.
      for (let j = i + 1; j < this.resumenDiario.length; j++) {
        if (currentValue != accessor(this.resumenDiario[j])) {
          break;
        }
        count++;
      }
      if (!this.spans[i]) {
        this.spans[i] = {};
      }

      // Store the number of similar values that were found (the span)
      // and skip i to the next unique row.
      this.spans[i][key] = count;
      i += count;
    }
  }
  getRowSpan(col, index) {
    return this.spans[index] && this.spans[index][col];
  }
  aplicarFiltroFecha(fecha) {
    this.fechaBuscada = this.homeService.formatoFecha(fecha.value, "amd", "-");
  }

  getItemsProductos() {
    this.otrosproductos = [];
    this.cupoService.getProductos().subscribe(data => {
      data.data.forEach(element => {

        if (element.id !== 1 && element.id !== 2 && element.id !== 3 && element.id !== 5) {
          this.otrosproductos.push(element);
        }
      });
      if (this.otrosproductos.length > 0) {
        this.filtro.id_producto = this.otrosproductos[0].id;
        this.filtro.producto = this.otrosproductos[0].descripcion;
      }
      this.resumenDiarioForm.controls["selectedProducto"].setValue(this.filtro.id_producto)

    });
  }
  aplicarFiltroProducto(valor) {
    this.filtro.id_producto = valor.value;
    this.otrosproductos.forEach(element => {
      if (element.id == this.filtro.id_producto)
        this.filtro.producto = element.descripcion;
    });
  }


}
