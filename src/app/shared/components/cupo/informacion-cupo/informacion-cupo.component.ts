import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from "@angular/forms";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material";
import { Cupo } from "app/shared/models/cupo";
import { CupoService } from "../cupo.service";
import { ModificarCargaCupoComponent } from "../modificar-carga-cupo/modificar-carga-cupo.component";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { HomeService } from "../../home/home.service";
import { AppErrorService } from "../../../services/app-error/app-error.service";
import { AppAlertService } from '../../../services/app-alert/app-alert.service';
import { AppLoaderService } from '../../../services/app-loader/app-loader.service';
import { CupoAsignadoApi } from "app/shared/models/cuposDisponibles";

@Component({
  selector: "app-informacion-cupo",
  templateUrl: "./informacion-cupo.component.html",
  styleUrls: ["./informacion-cupo.component.scss"],
  providers: [HomeService],
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
export class InformacionCupoComponent implements OnInit {
  //cupos: Cupo[] = [];
  cupos: CupoAsignadoApi[] = [];
  public itemForm: FormGroup;
  pageSize = 10;
  producto: string = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    "first_column",
    "dadorCuit",
    "alfanumericoCupo",
    "nombreDestino",
    "codigoCosecha",
    "numeroContrato",
    "acciones"
  ];
  expandedElement: Cupo;
  totalSize = 5;
  tableWidth: string = "";
  datos: any;
  chanceValue: boolean = false;
  nombre_destinatario = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InformacionCupoComponent>,
    private dialog: MatDialog,
    private cupoService: CupoService,
    public homeService: HomeService,
    private errorService: AppErrorService,
    private alertService: AppAlertService,
    private loader: AppLoaderService
  ) { }

  ngOnInit() {
    this.datos = this.data.payload;

    this.nombre_destinatario = this.datos.nombreDestinatario;
    this.cupos = this.datos.cupos;
    //console.log(this.cupos);
    this.dataSource.data = this.cupos;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.chanceValue = false;
    /* this.getCupoInformacion(
      this.data.payload.id,
      this.data.payload.fecha,
      this.data.payload.id_producto,
      this.data.payload.id_dador,
      this.data.payload.id_destino
    ); */
    this.producto = this.data.payload.producto;
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

  submit() {
    this.dialogRef.close(this.chanceValue);
  }

  openModificar(cupo, permiteEditar) {
    let title = "MODIFICAR DATOS DEL CUPO";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ModificarCargaCupoComponent,
      {
        width: "900px",
        disableClose: true,
        data: { title: title, payload: cupo, permiteEditar }
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
            id_cupo: cupo.id_cupo,
            fechaCupo: fechaCupoRes,
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
                        if (value.id == cupo.id_cupo) {
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
                      this.errorService.confirm({
                        message: "Error! No se puede modificar el Contrato/Fijación al cupo seleccionado"
                      });
                      return;
                    }
                  );

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
                //console.log('Error:', error.error.data.message);
                this.errorService.confirm({
                  message: "Error! No se puede modificar el contrato al cupo seleccionado"
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
}
