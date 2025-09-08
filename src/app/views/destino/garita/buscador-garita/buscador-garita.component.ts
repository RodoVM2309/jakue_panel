import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { MatTableDataSource, MatDialogRef, MatDialog } from '@angular/material';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CupoService } from 'app/shared/components/cupo/cupo.service';
import { NoFoundComponent } from 'app/views/destino/turnos/buscar/no-found/no-found.component';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { AppErrorService } from '@app/shared/services';

export interface Cupo {
  id: string;
  cupo: string;
  estado: number;
  terminal: string;
  producto: string;
  fecha: string;
  fechaArribado: null;
  fechaDescargado: null;
  nombreChofer: null;
  rucChofer: null;
  placaCamion: null;
  placaAcoplado: null;
  cupoAsignados: CupoAsignado[];
}

export interface CupoAsignado {
  rutDador: string;
  nombreDador: string;
  rutReceptor: string;
  nombreReceptor: string;
}

@Component({
  selector: 'app-buscador-garita',
  templateUrl: './buscador-garita.component.html',
  styleUrls: ['./buscador-garita.component.scss'],
  providers: [CupoService],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class BuscadorGaritaComponent implements OnInit {

  buscarForm: FormGroup;
  estadoActivo = 1;
  stringCriterio = '1- Ingresar Alfanumérico';
  dataSource = new MatTableDataSource();

  displayedColumns: string[] = [
    "asignacion",
    "terminal",
    "producto",
    "nombreChofer",
    "placaCamion",
    "estado",
    "tiempo",
    "acciones",
  ];

  estados = [
    {
      "id": 4,
      "descipcion": 'RECHAZADO'
    },
    {
      "id": 3,
      "descipcion": 'DESCARGADO'
    },
    {
      "id": 5,
      "descipcion": 'EN DESTINO'
    },
    {
      "id": 1,
      "descipcion": 'EN TRANSITO'
    },
    {
      "id": 2,
      "descipcion": 'EN TRANSITO'
    }
  ];

  colores = [
    {
      "estado": 1,
      "color": 'cupo-transito'
    },
    {
      "estado": 2,
      "color": 'cupo-transito'
    },
    {
      "estado": 3,
      "color": 'carga-publicada'
    },
    {
      "estado": 4,
      "color": 'cupo-rechazar'
    },
    {
      "estado": 5,
      "color": 'primary'
    },
  ];

  color: string;

  cupos: Cupo[] = [];
  cupo: Cupo;

  estadov = "";

  tiempo = "";

  encontrado = false;
  opcion = 'alfanumerico';

  constructor(private fb: FormBuilder,
    private loader: AppLoaderService,
    private cupoService: CupoService,
    private dialog: MatDialog,
    private alertService: AppAlertService,
    private errorService: AppErrorService) { }

  ngOnInit() {
    this.color = (this.colores.find(color => color.estado == 1)).color;
    this.buscarForm = this.fb.group({
      criterio: ['', Validators.required]
    });
  }

  onCheckboxChangeEstadoActive(chck, i) {
    this.estadoActivo = chck.checked ? i : -1;
    this.buscarForm.controls['criterio'].setValue('');
    this.encontrado = false;
    switch (this.estadoActivo) {
      case -1:
        this.stringCriterio = 'Seleccione criterio';
        this.opcion = '';
        break;
      case 1:
        this.stringCriterio = '1- Ingresar Alfanumérico';
        this.opcion = 'alfanumerico';
        break;
      case 2:
        this.stringCriterio = '2- Ingresar Chapa';
        this.opcion = 'placa';
        break;

      default:
        break;
    }
  }

  buscar() {
    this.loader.open();
    this.cupos = [];
    this.dataSource.data = [];

    let filtro = {
      campo: this.opcion,
      cadena: this.buscarForm.controls['criterio'].value
    }
    this.cupoService
      .postBuscarCupo(filtro)
      .subscribe(
        res => {
          this.loader.close();
          if (res.data) {
            this.encontrado = true;
            this.cupos.push(res.data);
            this.cupo = res.data;
            this.color = (this.colores.find(color => color.estado == res.data.estado)).color;
            const estado = this.estados.find(estado => estado.id == res.data.estado);
            this.estadov = estado.descipcion;
            switch (res.data.estado) {
              case 3:
                if (this.displayedColumns.length == 8) {
                  this.displayedColumns.pop();
                }
                break;
              case 4:
                if (this.displayedColumns.length == 8) {
                  this.displayedColumns.pop();
                }
                break;
              case 1:
                if (this.displayedColumns.length == 7) {
                  this.displayedColumns.push("acciones");
                };
                break;
              case 5:
                if (this.displayedColumns.length == 7) {
                  this.displayedColumns.push("acciones");
                };
                break;
              default:
                break;
            }
            let fecha = new Date(res.data.fecha);
            fecha.setDate(fecha.getDate() + 1);
            let hoy = new Date();

            if ((fecha.getFullYear() == hoy.getFullYear()) && (fecha.getMonth() == hoy.getMonth()) && (fecha.getDate() == hoy.getDate())) {
              this.tiempo = 'Si';
            } else {
              this.tiempo = 'No';
            }
            this.dataSource.data = this.cupos;
          } else {
            let titleError = '';
            this.buscarForm.controls['criterio'].setValue('');
            this.encontrado = false;
            this.cupos = [];
            this.dataSource.data = this.cupos;
            switch (this.opcion) {
              case 'alfanumerico':
                titleError = ' ALFANUMÉRICO NO ACTIVO'
                break;
              case 'placa':
                titleError = ' CHAPA NO ENCONTRADA'
                break;

              default:
                break;
            }
            this.openPopNotFound(titleError);
          }
        },
        error => {
          this.encontrado = false;
          this.loader.close();
          this.openPopNotFound('ERROR EN LA API');
        })
  }

  openPopNotFound(title) {
    let dialogRef: MatDialogRef<any> = this.dialog.open(NoFoundComponent, {
      width: '40vw',
      disableClose: false,
      data: { title: title }
    })
    dialogRef.afterClosed()
      .subscribe(result => {
        return;
      })
  }

  estadoCupo(element, action) {
    this.loader.open();
    let data = {
      campo: "alfanumerico",
      cadena: this.cupo.cupo,
      estado: action
    }
    this.cupoService
      .postActualizarEstado(data)
      .subscribe(
        res => {
          if (this.loader !== null) {
            this.loader.close();
          }
          let estado;
          switch (res.data.estado) {
            case 'descargado':
              this.cupo.estado = 3;
              if (this.displayedColumns.length == 8) {
                this.displayedColumns.pop();
              }
              this.color = (this.colores.find(color => color.estado == 3)).color;
              estado = this.estados.find(estado => estado.id == 3);
              this.estadov = estado.descipcion;
              break;
            case 'rechazado':
              this.cupo.estado = 4;
              // if (this.displayedColumns.length == 8) {
              //   this.displayedColumns.pop();
              // }
              this.color = (this.colores.find(color => color.estado == 4)).color;
              estado = this.estados.find(estado => estado.id == 4);
              this.estadov = estado.descipcion;
              break;
            case 'arribado':
              this.cupo.estado = 5;
              if (this.displayedColumns.length == 7) {
                this.displayedColumns.push("acciones");
              };
              this.color = (this.colores.find(color => color.estado == 5)).color;
              estado = this.estados.find(estado => estado.id == 5);
              this.estadov = estado.descipcion;
              break;
            default:
              break;
          }
          this.alertService.confirm({ message: '¡' + this.estadov + '!', tipo: 'exito' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        },
        error => {
          this.buscarForm.controls['criterio'].setValue('');
          this.encontrado = false;
          this.cupos = [];
          this.dataSource.data = this.cupos;
          this.loader.close();
          this.errorService
            .confirm({ message: "Error: ¡No se ha podido confirmar la acción!." })
            .subscribe(res => {
              if (res) {
                return;
              }
            });
        })
  }

}
