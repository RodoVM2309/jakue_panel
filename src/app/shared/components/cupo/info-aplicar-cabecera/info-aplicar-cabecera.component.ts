import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { animate, state, style, transition, trigger } from "@angular/animations";
import { Cupo } from 'app/shared/models/cupo';
import { CupoService } from '../cupo.service';
import { HomeService } from '../../home/home.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ModificarCargaCupoComponent } from '../modificar-carga-cupo/modificar-carga-cupo.component';
import { AplicarCabeceraComponent } from '../aplicar-cabecera/aplicar-cabecera.component';

export class Cabeceras {
  id: number;
  descripcion: string;
}

@Component({
  selector: 'app-info-aplicar-cabecera',
  templateUrl: './info-aplicar-cabecera.component.html',
  styleUrls: ['./info-aplicar-cabecera.component.scss'],
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
export class InfoAplicarCabeceraComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  aplicarForm: FormGroup;
  cupos: Cupo[] = [];
  displayedColumns: string[] = [
    "first_column",
    "dadorCuit",
    "alfanumericoCupo",
    "nombreDestino",
    "codigoCosecha",
    "numeroContrato",
    "selectedCabecera",
    "acciones"
  ];
  expandedElement: Cupo;
  chanceValue: boolean = false;
  datos: any;
  cabeceras: Cabeceras[] = [
    {
      id: 1,
      descripcion: 'Primera Cabecera'
    },
    {
      id: 2,
      descripcion: 'Segunda Cabecera '
    },
  ];
  cupoDisponibleForm: FormGroup;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InfoAplicarCabeceraComponent>,
    private dialog: MatDialog,
    private cupoService: CupoService,
    public homeService: HomeService,
    private errorService: AppErrorService,
    private alertService: AppAlertService,
    private loader: AppLoaderService
  ) { }

  ngOnInit() {
    this.cupos = this.data.payload.cuposSeleccionados;
    this.cupoDisponibleForm = new FormGroup({});
    for (let index = 0; index < this.cupos.length; index++) {
      this.cupos[index].id_cabecera = 0;
      this.cupos[index].aplicar = false;
      this.cupoDisponibleForm.addControl('id_cabecera_' + index.toString(), new FormControl(0));
    }
    this.dataSource.data = this.cupos;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.chanceValue = false;
  }

  submit() {
    this.dialogRef.close(this.chanceValue);
  }

  getCupoInformacion(id, fecha, id_producto, id_dador, id_destino) {
    this.loader.open();
    this.cupoService
      .getInfoCupos(fecha, id_producto, id_dador, id_destino)
      .subscribe(
        res => {
          this.loader.close();
          this.cupos = res.data;
          this.dataSource.data = this.cupos;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error => {
          this.loader.close();
        }
      );

  }

  openModificar(cupo) {
    let title = "MODIFICAR DATOS DEL CUPO";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ModificarCargaCupoComponent,
      {
        width: "720px",
        disableClose: true,
        data: { title: title, payload: cupo }
      }
    );

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.loader.open();
      let fechaCupoIni = this.cupoService.formatoFecha(cupo.fechaCupo, "amd", "-");
      let fechaCupoRes = this.cupoService.formatoFecha(res.fechaCupo, "amd", "-");
      if (fechaCupoIni != fechaCupoRes || cupo.id_producto != res.id_producto) {
        this.homeService
          .putCupo({
            id: cupo.id_cupo,
            fecha: fechaCupoRes,
            id_producto: res.id_producto
          })
          .subscribe(
            data => {
              this.chanceValue = true;
              if (cupo.numeroContrato != res.numeroContrato) {
                this.cupoService
                  .putCupoCliente({
                    id_cupo_cliente: cupo.id_cupo_cliente,
                    numeroContrato: res.numeroContrato
                  })
                  .subscribe(
                    data2 => {
                      this.loader.close();
                      this.dataSource.data = this.dataSource.data.filter((value, key) => {
                        if (value.id_cupo == cupo.id_cupo) {
                          value.fechaCupo = cupo.fechaCupo;
                          value.id_producto = cupo.id_producto;
                        }
                        this.dataSource.data = this.cupos;
                        return true;
                      });
                      this.getCupoInformacion(
                        this.datos.id,
                        this.datos.fecha,
                        this.datos.id_producto,
                        this.datos.id_dador,
                        this.datos.id_destino
                      );
                      this.alertService
                        .confirm({
                          message: "¡Cupo modificado correctamente!",
                          tipo: "exito"
                        })
                        .subscribe(res => {
                          if (res) {
                            return;
                          }
                        });
                    },
                    error => {
                      this.loader.close();
                      this.getCupoInformacion(
                        this.datos.id,
                        this.datos.fecha,
                        this.datos.id_producto,
                        this.datos.id_dador,
                        this.datos.id_destino
                      );
                      this.errorService.confirm({
                        message: "Error! No se puede modificar el contrato al cupo seleccionado"
                      });
                      return;
                    }
                  );
              }
            },
            error => {
              this.loader.close();
              this.errorService.confirm({
                message: "Error! No se puede modificar el cupo seleccionado"
              });
              return;
            })
      } else {
        if (cupo.numeroContrato != res.numeroContrato) {
          this.cupoService
            .putCupoCliente({
              id_cupo_cliente: cupo.id_cupo_cliente,
              numeroContrato: res.numeroContrato
            })
            .subscribe(
              data2 => {
                this.chanceValue = true;
                this.loader.close();
                this.getCupoInformacion(
                  this.datos.id,
                  this.datos.fecha,
                  this.datos.id_producto,
                  this.datos.id_dador,
                  this.datos.id_destino
                );
                this.alertService
                  .confirm({
                    message: "¡Cupo modificado correctamente!",
                    tipo: "exito"
                  })
                  .subscribe(res => {
                    if (res) {
                      return;
                    }
                  });
              },
              error => {
                this.loader.close();
                console.log('Error:', error.error.data.message);
                this.errorService.confirm({
                  message: "Error! No se puede modificar el Contrato/Fijación al cupo seleccionado"
                });
                return;
              }
            )
        } else {
          this.loader.close();
          this.getCupoInformacion(
            this.datos.id,
            this.datos.fecha,
            this.datos.id_producto,
            this.datos.id_dador,
            this.datos.id_destino
          );

        }
        //
      };

    });
  }

  cerrar() {
    this.dialogRef.close();
  }
  onCheckboxChangeAplicar($event, cupo, index) {
    this.cupos[index].aplicar = $event.checked;
  }
  onSelectionChangeCabecera($event,index) {
    this.cupos[index].id_cabecera = $event;
  }


  openPopUpAplicarCabecera() {
    let cuposSelected = [];
    this.cupos.forEach(element => {
      if (element.aplicar) {
        cuposSelected.push(element)
      }
    });
    let dialogRef: MatDialogRef<any> = this.dialog.open(AplicarCabeceraComponent, {
      width: "95vw",
      height: '93vh',
      disableClose: true,
      data: {
        payload: {
          fecha: this.data.payload.fecha,
          selectedCupos: cuposSelected,
          producto: this.data.payload.filtro.producto
        }
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      // this.getDataCuposDisponibles(this.fechaBuscada);
      return;
    });
  }

}
