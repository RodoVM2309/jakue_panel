import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  PipeTransform,
  ElementRef,
} from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar,
  MatRadioChange,
} from "@angular/material";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from "@angular/forms";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
} from "@angular/material";
import { Cupo, CupoV3 } from "app/shared/models/cupo";
import { CupoService } from "../cupo.service";
import { AppAlertService } from "../../../../shared/services/app-alert/app-alert.service";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { AppAtencionService } from "../../../services/app-atencion/app-atencion.service";
import { MostrarObservComponent } from "./mostrar-observ/mostrar-observ.component";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { AplicarCabeceraComponent } from "../aplicar-cabecera/aplicar-cabecera.component";
import { forEach } from "@angular/router/src/utils/collection";
import { Cabecera } from "app/shared/models/cabecera";
import { Subscription } from "rxjs";
import { CcppService } from "app/shared/services/ccpp.service";
import { AddCabeceraComponent } from "app/views/ccpp/cabecera/add-cabecera/add-cabecera.component";
import { VerCcppComponent } from "app/views/ccpp/consulta/ver-ccpp/ver-ccpp.component";
// Para modificar intermediarios de CCPP
import { ModificarCargaCupoComponent } from "../modificar-carga-cupo/modificar-carga-cupo.component";
import { HomeService } from "../../home/home.service";
import { AddPersonaComponent } from "../../../../views/admin/personas/add-persona/add-persona.component";
import { PersonasService } from "app/shared/services/personas.service";

export class Items {
  id: number;
  descripcion: string;
}

export class CuposDemandados {
  "id_demanda_cupo": number;
  "codigoCosecha": string;
  "asignado": number;
  "fechaDesde": string;
  "fechaHasta": string;
  "id_demandante": number;
  "id_demandado": number;
  "observaciones": string;
  "id_producto": string;
  "cantidad": number;
  "contrato": number;
  "comprador": string;
  "zona": string;
  "id_gestiona": number;
  "nombreDemandante": string;
  "nombreDemandado": string;
  "nombreProducto": string;
  "cuitDemandate": string;
  "cuitDemandante": string;
  "caratula_mtr": string;
  "asignar": number;
  "asignados": any[];
}
export class Receptor {
  id: number;
  nombreDemandante: string;
  cuitDemandante: string;
}

export class CentroBuscado {
  id: number;
  razon_social: string;
  asignado: boolean;
  bloqueado: boolean;
  cuit: string;
}

@Component({
  selector: "app-asignar-solicitud",
  templateUrl: "./asignar-solicitud.component.html",
  styleUrls: ["./asignar-solicitud.component.scss"],
  providers: [HomeService],
})
export class AsignarSolicitudComponent implements OnInit {
  cupos: CupoV3[] = [];
  cupoSeleccionados: CupoV3[] = [];
  centrosBuscados: CentroBuscado[];
  demandas: CuposDemandados[] = [];
  demandaSeleccionados: CuposDemandados[] = [];
  searchForm: FormGroup;
  itemForm: FormGroup;
  cabeceraForm: FormGroup;
  cupoDisponibleForm: FormGroup;
  pageSize = 10;
  cuitReceptor = "";
  producto: string = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  dataSourceAction = new MatTableDataSource();
  dataSourceDemanda = new MatTableDataSource();
  dataSourceDemandaAction = new MatTableDataSource();
  dataSourceCentro = new MatTableDataSource();
  displayedColumns: string[] = [];
  displayedColumnsAction: string[] = [
    "selectedCupo",
    "detalleCupo",
    "editarCupo",
  ];
  displayedColumnsDemanda: string[] = [];
  displayedColumnsDemandaAction: string[] = [
    "total",
    "asignar",
    "observaciones",
  ];
  displayedColumnsCentro: string[] = ["razon_social", "asignado"];
  id_producto: number;
  hayDemanda: boolean;
  hay_seleccionados: boolean = false;
  receptor: Receptor = {
    id: 0,
    nombreDemandante: "",
    cuitDemandante: "",
  };
  cuit = "";
  countCuposDisponibles: number = 0;
  countCuposSeleccionados: number = 0;
  countCuposDemandados: number = 0;
  countCuposDemandadosLibres: number = 0;
  noHayCliente = false;
  otrosproductos = [];
  selectedSearchCentro: CentroBuscado;
  showTableSearch: boolean;
  maxCuposDemandandos: number = 0;

  cabeceras: Cabecera[] = [];
  public getItemSub: Subscription;
  isAplicarSelected: boolean = false;
  aplicarCabecera = [];

  chanceValue: boolean = false;
  datos: any;

  usaMTR: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AsignarSolicitudComponent>,
    private fb: FormBuilder,
    private cupoService: CupoService,
    private dialog: MatDialog,
    private alertService: AppAlertService,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,
    private loader: AppLoaderService,
    private ccppService: CcppService,
    public homeService: HomeService,
    private personasService: PersonasService
  ) {
    this.usaMTR = localStorage.getItem("usaMtr") == "1" ? true : false;

    if (this.usaMTR) {
      this.displayedColumns = [
        "idCuitDestinatario",
        "nombreDestino",
        "alfanumericoCupo",
        "caratulaMercadoATermino",
      ];
      this.displayedColumnsDemanda = [
        "nombreDemandante",
        "zona",
        "contrato",
        "codigoCosecha",
        "comprador",
        "caratula_mtr",
      ];
    } else {
      this.displayedColumns = [
        "idCuitDestinatario",
        "nombreDestino",
        "alfanumericoCupo",
      ];
      this.displayedColumnsDemanda = [
        "nombreDemandante",
        "zona",
        "contrato",
        "codigoCosecha",
        "comprador",
      ];
    }
  }

  ngOnInit() {
    this.showTableSearch = false;
    this.selectedSearchCentro = {
      id: 0,
      razon_social: "",
      asignado: false,
      bloqueado: false,
      cuit: "",
    };
    this.id_producto = this.data.payload.id_producto;
    this.hayDemanda =
      this.data.payload.solicitudDemanda.length > 0 ? true : false;
    this.searchForm = new FormGroup({
      cuit: new FormControl(""),
    });
    this.itemForm = new FormGroup({
      quantity: new FormControl("", [Validators.required]),
    });
    this.cabeceraForm = new FormGroup({
      idCabecera: new FormControl(0),
    });
    this.getCupoInformacion(
      this.data.payload.fecha,
      this.data.payload.solicitudCupos,
      this.data.payload.solicitudDemanda
    );
    this.buscarCabeceras();
  }

  getCupoInformacion(fecha, arraySolicitud: any, arrayDemanda) {
    this.id_producto = this.data.payload.filtro.id_producto;
    this.producto = this.data.payload.filtro.producto;
    if (arraySolicitud.length > 0) {
      this.cupos = [];
      this.data.payload.cuposSolicitados.forEach((cup) => {
        cup.habilitado = false;
        cup.id_cabecera = "";
        cup.aplicar = false;
        if (cup.asignado === "1") {
          cup.asignado = false;
          this.cupos.push(cup);
        }
      });
      this.cupoDisponibleForm = new FormGroup({});
      for (let index = 0; index < this.cupos.length; index++) {
        this.cupoDisponibleForm.addControl(
          "id_cabecera_" + index.toString(),
          new FormControl(0)
        );
      }
      this.dataSource.data = this.cupos;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSourceAction.data = this.cupos;
      this.dataSourceAction.paginator = this.paginator;
      this.dataSourceAction.sort = this.sort;

      this.countCuposDisponibles = this.cupos.length;
    } else {
      this.dataSource.data = this.cupos;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSourceAction.data = this.cupos;
      this.dataSourceAction.paginator = this.paginator;
      this.dataSourceAction.sort = this.sort;
    }
    arrayDemanda.forEach((element) => {
      this.cuitReceptor = element.cuit;
      this.receptor.id = element.id_demandante;
      this.receptor.nombreDemandante = element.nombre_demandante;
    });
    if (this.data.payload.demandasSolicitadas.length > 0) {
      this.demandas = [];
      this.data.payload.demandasSolicitadas.forEach((element) => {
        this.maxCuposDemandandos = this.maxCuposDemandandos + element.cantidad;
        let tempCupDem = new CuposDemandados();
        tempCupDem = element;
        tempCupDem.asignar = 0;
        this.demandas.push(tempCupDem);
      });
      for (let index = 0; index < this.demandas.length; index++) {
        this.itemForm.addControl(
          "quantity" + index.toString(),
          new FormControl(0, [
            Validators.required,
            Validators.max(this.demandas[index].cantidad),
            Validators.min(0),
          ])
        );
      }
      this.dataSourceDemanda.data = this.demandas;
      this.dataSourceDemanda.paginator = this.paginator;
      this.dataSourceDemanda.sort = this.sort;

      this.dataSourceDemandaAction.data = this.demandas;
      this.dataSourceDemandaAction.paginator = this.paginator;
      this.dataSourceDemandaAction.sort = this.sort;
    }
  }

  getItemsProductos() {
    this.otrosproductos = [];
    this.cupoService.getProductos().subscribe((data) => {
      data.data.forEach((element) => {
        this.otrosproductos.push(element);
      });
    });
  }

  get f() {
    return this.itemForm.controls;
  }

  selectionChangeCabecera(event) {
    if (event.value != undefined) {
      this.cupos.forEach((element) => {
        if (element.asignado) {
          element.id_cabecera = event.value;
        }
      });
    }
  }

  autoAsignarCupo() {
    this.loader.open("Por favor espere..");
    let cupos = [];
    let demanda = [];
    if (this.cupoSeleccionados.length > 0) {
      this.cupoSeleccionados.forEach((element) => {
        cupos.push(element.id);
      });
    }
    let dataAplicarCabecera = [];
    let dataCuposAplicarCabecera = [];
    cupos.forEach((element) => {
      if (this.cabeceraForm.controls["idCabecera"].value) {
        if (this.cabeceraForm.controls["idCabecera"].value !== 0) {
          dataAplicarCabecera.push({
            cupos: [element],
            id_cabecera: this.cabeceraForm.controls["idCabecera"].value,
          });
        } else {
          if (element.aplicar) {
            dataCuposAplicarCabecera.push(element);
          }
        }
      }
    });
    if (dataCuposAplicarCabecera.length > 0) {
      dataAplicarCabecera.push({
        cupos: dataCuposAplicarCabecera,
        id_cabecera: this.cabeceraForm.controls["idCabecera"].value,
      });
    }

    let data = {};
    if (dataAplicarCabecera.length > 0) {
      data = {
        receptorCuit: 0,
        cupos: [
          {
            id_demanda: 0,
            cupos: cupos,
          },
        ],
        cabeceras: dataAplicarCabecera,
        canal: "WEB",
      };
    } else {
      data = {
        receptorCuit: 0,
        cupos: [
          {
            id_demanda: 0,
            cupos: cupos,
          },
        ],
        canal: "WEB",
      };
    }

    this.cupoService.postAsignarCuposV3(data).subscribe(
      (res) => {
        this.loader.close();
        this.alertService
          .confirm({
            message: "Cupos autoasignados correctamente!",
            tipo: "exito",
          })
          .subscribe((res1) => {
            if (res1) {
              this.dialogRef.close(1);
              return;
            }
          });
      },
      (err) => {
        this.loader.close();
        switch (err.status) {
          case 402:
            this.atencionService.confirm({
              message: err.message,
            });
            break;
          case 422:
            this.atencionService.confirm({
              message: err.message,
            });
            break;

          default:
            this.errorService.confirm({ message: err }).subscribe((res) => {
              if (res) {
                return;
              }
            });
            break;
        }
      }
    );
  }

  asignarCupo() {
    this.loader.open("Por favor espere..");

    let cupos = [];
    let demanda = [];

    let caratulasCupos = [];
    let caratulasDemandas = [];


    if (this.cupoSeleccionados.length > 0) {
      this.cupoSeleccionados.forEach((element) => {
        caratulasCupos.push(element.caratulaMercadoATermino);
        cupos.push(element.id);
      });
    }
    let dataAplicarCabecera = [];
    let dataCuposAplicarCabecera = [];

    cupos.forEach((element) => {
      if (this.cabeceraForm.controls["idCabecera"].value) {
        if (this.cabeceraForm.controls["idCabecera"].value !== 0) {
          dataAplicarCabecera.push({
            cupos: [element],
            id_cabecera: this.cabeceraForm.controls["idCabecera"].value,
          });
        } else {
          if (element.aplicar) {
            dataCuposAplicarCabecera.push(element);
          }
        }
      }
    });

    if (dataCuposAplicarCabecera.length > 0) {
      dataAplicarCabecera.push({
        cupos: dataCuposAplicarCabecera,
        id_cabecera: this.cabeceraForm.controls["idCabecera"].value,
      });
    }

    let data = {};

    if (this.demandaSeleccionados.length > 0) {
      this.demandaSeleccionados.forEach((element) => {
        if (element.asignar > 0) {
          if (element.caratula_mtr) {
            caratulasDemandas.push(element.caratula_mtr);
          }
          let tempcupos = cupos.splice(0, element.asignar);
          let temp = {
            id_demanda: element.id_demanda_cupo,
            cupos: tempcupos,
          };
          demanda.push(temp);
        }
      });
      if (dataAplicarCabecera.length > 0) {
        data = {
          receptorCuit: this.cuitReceptor,
          cupos: demanda,
          cabeceras: dataAplicarCabecera,
          canal: "WEB",
        };
      } else {
        data = {
          receptorCuit: this.cuitReceptor,
          cupos: demanda,
          canal: "WEB",
        };
      }
    } else {
      if (dataAplicarCabecera.length > 0) {
        data = {
          receptorCuit: this.selectedSearchCentro.cuit,
          cupos: [
            {
              id_demanda: 0,
              cupos: cupos,
            },
          ],
          cabeceras: dataAplicarCabecera,
          canal: "WEB",
        };
      } else {
        data = {
          receptorCuit: this.selectedSearchCentro.cuit,
          cupos: [
            {
              id_demanda: 0,
              cupos: cupos,
            },
          ],
          canal: "WEB",
        };
      }
    }

    let verificador: boolean = true;
    let validado: boolean = true;
    let cartCupo = caratulasCupos[0];
    let cartDemanda = caratulasDemandas ? caratulasDemandas.length > 0 ? caratulasDemandas[0] : "" : "";

    const isSameCupo = (currentValue) => currentValue == cartCupo;
    const isSameDemanda = (currentValue) => currentValue == cartDemanda;

    if (
      caratulasCupos.every(isSameCupo) &&
      caratulasDemandas.every(isSameDemanda)
    ) {
      if (cartCupo !== cartDemanda) {
        verificador = false;
        if (cartCupo.length > 0 && cartDemanda.length === 0) {
          verificador = true;
        } else if (cartCupo.length === 0 && cartDemanda.length > 0) {
          verificador = false;
        }
      } else {
        verificador = true;
      }
    } else {
      verificador = false;
    }

    if (this.usaMTR == false) {
      verificador = true;
    }
    if (verificador) {
      this.cupoService.postAsignarCuposV3(data).subscribe(
        (res) => {
          this.loader.close();
          this.alertService
            .confirm({
              message: "Cupos Asignados correctamente!",
              tipo: "exito",
            })
            .subscribe((res1) => {
              if (res1) {
                this.dialogRef.close(1);
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
      let dialogRef: MatDialogRef<AppCaratulasDiferentesComponent>;
      dialogRef = this.dialog.open(AppCaratulasDiferentesComponent, {
        width: "60vw",
        disableClose: true,
        data: {},
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.loader.open("Por favor espere..");
          let continuar = {
            proceso: res,
          };
          const returnedData = Object.assign(data, continuar);
          this.cupoService.postAsignarCuposV3(returnedData).subscribe(
            (res) => {
              this.loader.close();
              this.alertService
                .confirm({
                  message: "¡Cupos Asignados Correctamente!",
                  tipo: "exito",
                })
                .subscribe((res1) => {
                  if (res1) {
                    this.dialogRef.close(1);
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
          return;
        }
      });
    }
  }

  onCheckboxChange($event, cupo, index) {
    if ($event.checked) {
      if (this.hayDemanda) {
        if (this.cupoSeleccionados.length > this.maxCuposDemandandos) {
          this.cupos[index].asignado = false;
          this.errorService.confirm({
            message: "No puede seleccionar más cupos que la demanda",
          });
          $event.source.toggle();
          return false;
        } else {
          this.cupoSeleccionados.push(cupo);
          this.cupos[index].asignado = $event.checked;
          if (this.cupoSeleccionados.length == this.maxCuposDemandandos) {
            for (let index = 0; index < this.cupos.length; index++) {
              if (this.cupos[index].asignado) {
                this.cupos[index].habilitado = false;
              } else {
                this.cupos[index].habilitado = true;
              }
            }
          }
        }
      } else {
        this.cupoSeleccionados.push(cupo);
        this.cupos[index].asignado = $event.checked;
      }
      this.countCuposSeleccionados = this.cupoSeleccionados.length;
      this.countCuposDemandadosLibres = this.countCuposSeleccionados;
      this.countCuposDisponibles--;
    } else {
      this.cupos[index].asignado = $event.checked;
      let tempArray = [];
      this.cupoSeleccionados.forEach((element) => {
        if (element.id != cupo.id) {
          tempArray.push(element);
        }
      });
      for (let index = 0; index < this.cupos.length; index++) {
        this.cupos[index].habilitado = false;
      }
      this.cupoSeleccionados = tempArray;
      this.countCuposSeleccionados = this.cupoSeleccionados.length;
      this.countCuposDemandadosLibres = this.countCuposSeleccionados;
      this.countCuposDisponibles++;
      if (this.countCuposSeleccionados < this.countCuposDemandados) {
        let rest = false;
        for (let index = 0; index < this.demandaSeleccionados.length; index++) {
          let element = this.demandaSeleccionados[index];
          let valor = parseInt(
            this.itemForm.controls["quantity" + index].value
          );
          if (!rest && valor > 0) {
            this.itemForm.controls["quantity" + index].setValue(valor - 1);
            this.countCuposDemandados--;
            element.asignar--;
            rest = true;
            continue;
          }
        }
      }
    }
  }
  ChangeCantidadDemanda(e: any, cupo: CuposDemandados, index) {
    let tempArray = [];
    let cantidadAsignar = 0;
    if (this.demandaSeleccionados.length > 0) {
      this.demandaSeleccionados.forEach((element) => {
        if (element.id_demanda_cupo !== cupo.id_demanda_cupo) {
          tempArray.push(element);
          cantidadAsignar = cantidadAsignar + element.asignar;
        }
      });
    }
    let cant = parseInt(e);
    this.demandaSeleccionados = tempArray;
    if (cantidadAsignar + cant <= this.countCuposSeleccionados) {
      cupo.asignar = cant;
      this.demandaSeleccionados.push(cupo);
      if (this.cuitReceptor == "") {
        this.receptor.id = cupo.id_demandante;
        this.receptor.nombreDemandante = cupo.nombreDemandante;
        this.cuitReceptor = cupo.cuitDemandate;
        for (let index = 0; index < this.demandas.length; index++) {
          const element = this.demandas[index];
          if (element.cuitDemandate !== this.cuitReceptor) {
            this.itemForm.controls["quantity" + index].disable();
          }
        }
      }
      if (cant == 0) {
        let countDifCero = 0;
        for (let index = 0; index < this.demandas.length; index++) {
          if (this.itemForm.controls["quantity" + index].value !== 0) {
            countDifCero++;
          }
        }
        if (countDifCero == 0) {
          this.receptor.id = 0;
          this.receptor.nombreDemandante = "";
          this.cuitReceptor = "";
          for (let index = 0; index < this.demandas.length; index++) {
            this.itemForm.controls["quantity" + index].enable();
          }
        }
      }
      this.countCuposDemandados = cantidadAsignar + cant;
    } else {
      this.atencionService.confirm({
        title: "Atención!",
        message:
          "No puede asignar esa cantidad. Sobrepasa los cupos seleccionados ",
      });
      this.itemForm.controls["quantity" + index].setValue(
        this.countCuposSeleccionados - cantidadAsignar
      );
      cupo.asignar = this.countCuposSeleccionados - cantidadAsignar;
      this.demandaSeleccionados.push(cupo);
    }
  }

  BuscarDemandaCUIT(event) {
    const val = this.searchForm.controls["cuit"].value;
    if (this.validarCUIT(val)) {
      let miCuit = localStorage.getItem("cuit_cuil");
      this.demandas = [];
      if (miCuit != val) {
        this.cupoService
          .getBuscarDemandas(this.data.payload.fecha, this.id_producto, val, "")
          .subscribe(
            (res) => {

              if (res.data.length > 0) {
                let tempCupos = res.data;
                tempCupos.forEach((cup) => {
                  this.maxCuposDemandandos =
                    this.maxCuposDemandandos + cup.cantidad;
                  cup.asignar = 0;
                  cup.zona = cup.nombreZonaSolicitud;
                  this.demandas.push(cup);
                });
                for (let index = 0; index < this.demandas.length; index++) {
                  this.itemForm.addControl(
                    "quantity" + index.toString(),
                    new FormControl(0, [
                      Validators.required,
                      Validators.max(this.demandas[index].cantidad),
                      Validators.min(0),
                    ])
                  );
                  this.itemForm.controls[
                    "quantity" + index.toString()
                  ].setValue(0);
                }
                this.dataSourceDemanda.data = this.demandas;
                this.dataSourceDemanda.paginator = this.paginator;
                this.dataSourceDemanda.sort = this.sort;

                this.dataSourceDemandaAction.data = this.demandas;
                this.dataSourceDemandaAction.paginator = this.paginator;
                this.dataSourceDemandaAction.sort = this.sort;

                this.hayDemanda = true;
                this.noHayCliente = false;
              } else {
                this.selectedSearchCentro = {
                  id: 0,
                  razon_social: "",
                  asignado: false,
                  bloqueado: false,
                  cuit: "",
                };
                this.cupoService
                  .getBuscarParaAsignarDemandante(val, "")
                  .subscribe(
                    (res) => {
                      this.centrosBuscados = [];
                      if (res.data.length > 0) {
                        if (res.data.length == 1) {
                          this.selectedSearchCentro.id = res.data[0].id;
                          this.selectedSearchCentro.cuit =
                            res.data[0].cuit_cuil;
                          this.selectedSearchCentro.razon_social =
                            res.data[0].razon_social;
                        }
                        this.noHayCliente = true;
                        this.showTableSearch = false;
                      } else {
                        this.noHayCliente = false;
                        this.showTableSearch = false;
                      }
                    },
                    (error) => { }
                  );
              }
            },
            (error) => { }
          );
      }
    } else {
      this.cupoService
        .getBuscarDemandas(this.data.payload.fecha, this.id_producto, "", val)
        .subscribe(
          (res) => {

            this.demandas = [];
            if (res.data.length > 0) {
              let tempCupos = res.data;
              tempCupos.forEach((cup) => {
                this.maxCuposDemandandos =
                  this.maxCuposDemandandos + cup.cantidad;
                cup.asignar = 0;
                cup.zona = cup.nombreZonaSolicitud;
                this.demandas.push(cup);
              });
              for (let index = 0; index < this.demandas.length; index++) {
                this.itemForm.addControl(
                  "quantity" + index.toString(),
                  new FormControl(0, [
                    Validators.required,
                    Validators.max(this.demandas[index].cantidad),
                    Validators.min(0),
                  ])
                );
                this.itemForm.controls["quantity" + index.toString()].setValue(
                  0
                );
              }
              this.dataSourceDemanda.data = this.demandas;
              this.dataSourceDemanda.paginator = this.paginator;
              this.dataSourceDemanda.sort = this.sort;

              this.dataSourceDemandaAction.data = this.demandas;
              this.dataSourceDemandaAction.paginator = this.paginator;
              this.dataSourceDemandaAction.sort = this.sort;

              this.hayDemanda = true;
              this.noHayCliente = false;
            } else {
              this.selectedSearchCentro = {
                id: 0,
                razon_social: "",
                asignado: false,
                bloqueado: false,
                cuit: "",
              };
              this.cupoService
                .getBuscarParaAsignarDemandante("", val)
                .subscribe(
                  (res) => {
                    let miRazonSocial = localStorage.getItem("nameUser");
                    this.centrosBuscados = [];
                    if (res.data.length > 0) {
                      if (res.data.length == 1) {
                        this.selectedSearchCentro.id = res.data[0].id;
                        this.selectedSearchCentro.cuit = res.data[0].cuit_cuil;
                        this.selectedSearchCentro.razon_social =
                          res.data[0].razon_social;
                        this.showTableSearch = false;
                        this.noHayCliente = true;
                      } else {
                        this.showTableSearch = true;
                        res.data.forEach((element) => {
                          this.showTableSearch = true;
                          var tempCentro = new CentroBuscado();
                          tempCentro.id = element.id;
                          tempCentro.razon_social = element.razon_social;
                          tempCentro.cuit = element.cuit_cuil;
                          tempCentro.asignado = false;
                          tempCentro.bloqueado = false;
                          if (miRazonSocial != element.razon_social) {
                            this.centrosBuscados.push(tempCentro);
                          }
                        });
                        this.dataSourceCentro.data = this.centrosBuscados;
                        this.noHayCliente = true;
                      }
                    } else {
                      this.noHayCliente = false;
                    }
                  },
                  (error) => { }
                );
            }
          },
          (error) => { }
        );
    }
  }

  BuscarDemandanteCUIT(event) {
    this.selectedSearchCentro = {
      id: 0,
      razon_social: "",
      asignado: false,
      bloqueado: false,
      cuit: "",
    };
    this.showTableSearch = false;
    const val = this.searchForm.controls["cuit"].value;
    if (this.validarCUIT(val)) {
      this.cupoService.getBuscarParaAsignarDemandante(val, "").subscribe(
        (res) => {
          this.centrosBuscados = [];
          if (res.data.length > 0) {
            if (res.data.length == 1) {
              this.selectedSearchCentro.id = res.data[0].id;
              this.selectedSearchCentro.cuit = res.data[0].cuit_cuil;
              this.selectedSearchCentro.razon_social = res.data[0].razon_social;
            } else {
              this.showTableSearch = true;
              res.data.forEach((element) => {
                var tempCentro = new CentroBuscado();
                tempCentro.id = element.id;
                tempCentro.cuit = element.cuit_cuil;
                tempCentro.razon_social = element.razon_social;
                tempCentro.asignado = false;
                tempCentro.bloqueado = false;
                this.centrosBuscados.push(tempCentro);
              });
              this.dataSourceCentro.data = this.centrosBuscados;
            }
            this.noHayCliente = true;
          } else {
            this.noHayCliente = false;
          }
        },
        (error) => { }
      );
    } else {
      this.cupoService.getBuscarParaAsignarDemandante("", val).subscribe(
        (res) => {
          this.centrosBuscados = [];
          if (res.data.length > 0) {
            if (res.data.length == 1) {
              this.selectedSearchCentro.id = res.data[0].id;
              this.selectedSearchCentro.cuit = res.data[0].cuit_cuil;
              this.selectedSearchCentro.razon_social = res.data[0].razon_social;
            } else {
              res.data.forEach((element) => {
                this.showTableSearch = true;
                var tempCentro = new CentroBuscado();
                tempCentro.id = element.id;
                tempCentro.cuit = element.cuit_cuil;
                tempCentro.razon_social = element.razon_social;
                tempCentro.asignado = false;
                tempCentro.bloqueado = false;
                this.centrosBuscados.push(tempCentro);
              });
              this.dataSourceCentro.data = this.centrosBuscados;
              this.noHayCliente = true;
            }
          } else {
            this.noHayCliente = false;
          }
        },
        (error) => { }
      );
    }
  }

  onCheckboxChangeCliente(chck, cliente) {
    if (chck.checked) {
      this.selectedSearchCentro = cliente;
      for (let index = 0; index < this.centrosBuscados.length; index++) {
        const element = this.centrosBuscados[index];
        if (element.id !== cliente.id)
          this.centrosBuscados[index].bloqueado = true;
        this.noHayCliente = true;
      }
    } else {
      for (let index = 0; index < this.centrosBuscados.length; index++) {
        const element = this.centrosBuscados[index];
        this.centrosBuscados[index].bloqueado = false;
      }
      this.selectedSearchCentro = {
        id: 0,
        razon_social: "",
        asignado: false,
        bloqueado: false,
        cuit: "",
      };
    }
    this.dataSourceCentro.data = this.centrosBuscados;
  }

  validarCUIT(cuit): boolean {
    // let numero: number = 0;
    // let isvalidCuit: boolean = false;
    // if (cuit.length === 11) {
    //   numero = parseInt(cuit);
    //   if (numero > 20000000000 && numero < 39999999999) {
    //     isvalidCuit = true;
    //     return true;
    //   }
    // } else {
    //   return false;
    // }
    return true;
  }

  cerrar() {
    this.dialogRef.close();
  }

  openPopUpObserv(cupo) {
    let title = "Información de la Solicitud";
    const dialogRef: MatDialogRef<any> = this.dialog.open(
      MostrarObservComponent,
      {
        width: "520px",
        disableClose: true,
        data: { title: title, payload: { observ: cupo.observaciones } },
      }
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
    });
  }

  openPopUpAplicarCabecera() {
    let cuposSelected = [];
    this.cupos.forEach((element) => {
      if (element.aplicar) {
        cuposSelected.push(element);
      }
    });
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AplicarCabeceraComponent,
      {
        width: "95vw",
        height: "93vh",
        disableClose: true,
        data: {
          payload: {
            fecha: this.data.payload.fecha,
            selectedCupos: cuposSelected,
            producto: this.data.payload.filtro.producto,
          },
        },
      }
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
    });
  }

  openPopUpEditCabecera(id_cabecera) {
    let rowCabecera: Cabecera;
    this.cabeceras.forEach((element) => {
      if (element.id === id_cabecera) {
        rowCabecera = element;
      }
    });
    let title = "Cabecera";
    //
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddCabeceraComponent, {
      width: "75vw",
      disableClose: true,
      data: {
        title: title,
        payload: {},
        isNew: true,
        id_cabecera: rowCabecera,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      return;
    });
  }

  buscarCabeceras() {
    // this.loader.open('Buscando cabeceras');
    this.getItemSub = this.ccppService.selectCabeceras().subscribe(
      (pagedData) => {
        this.loader.close();
        this.cabeceras = pagedData.data;
      },
      (err) => { }
    );
  }

  openPopUpNuevaCabecera(data: any = {}, isNew) {
    let title = "Cabecera";
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddCabeceraComponent, {
      width: "75vw",
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      } else {
        this.buscarCabeceras();
      }
    });
  }

  openPopUpVer(cupo: any = {}, id_cabecera: number = 0) {
    let rowCabecera: Cabecera = null;
    if (id_cabecera == 0) {
      if (this.cabeceraForm.controls["idCabecera"].value != 0) {
        id_cabecera = this.cabeceraForm.controls["idCabecera"].value;
      }
    }
    if (id_cabecera !== 0) {
      this.cabeceras.forEach((element) => {
        if (element.id === id_cabecera) {
          rowCabecera = element;
        }
      });
    }
    this.ccppService.getCartaPorte(cupo.id).subscribe((data) => {
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
  }

  // Modificar intermediarios de CCPP
  getEditCupoInformacion(id, fecha, id_producto, id_dador, id_destino) {
    this.loader.open();
    this.cupoService
      .getInfoCupos(fecha, id_producto, id_dador, id_destino)
      .subscribe(
        (res) => {
          this.loader.close();
          this.cupos = res.data;
          this.dataSource.data = this.cupos;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.dataSourceAction.data = this.cupos;
          this.dataSourceAction.paginator = this.paginator;
          this.dataSourceAction.sort = this.sort;
        },
        (error) => {
          this.loader.close();
        }
      );
  }

  submit() {
    this.dialogRef.close(this.chanceValue);
  }

  openModificar(cupo, id_cabecera, permiteEditar) {
    let rowCabecera: Cabecera = null;
    if (id_cabecera == 0) {
      if (this.cabeceraForm.controls["idCabecera"].value != 0) {
        id_cabecera = this.cabeceraForm.controls["idCabecera"].value;
      }
    }
    if (id_cabecera !== 0) {
      this.cabeceras.forEach((element) => {
        if (element.id === id_cabecera) {
          rowCabecera = element;
        }
      });
    }

    let title = "EDITAR CCPP";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ModificarCargaCupoComponent,
      {
        width: "900px",
        disableClose: true,
        data: {
          title: title,
          payload: cupo,
          editarCcpp: true,
          permiteEditar,
          cabecera: rowCabecera,
        },
      }
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
    });
  }

  seleccionarTodos() {
    if (this.hayDemanda) {
      if (this.cupos.length > this.maxCuposDemandandos) {
        this.errorService.confirm({
          message: "No puede seleccionar más cupos que la demanda",
        });
        return false;
      }
    }

    this.cupos.forEach((element) => {
      if (!element.asignado) {
        element.asignado = true;
        this.cupoSeleccionados.push(element);
      }
    });
    this.countCuposDisponibles = 0;
    this.countCuposSeleccionados = this.countCuposDemandadosLibres =
      this.cupos.length;
    this.hay_seleccionados = true;
  }

  quitarTodos() {
    this.cupos.forEach((element) => {
      element.asignado = false;
    });
    this.demandas.forEach((element) => {
      element.asignar = 0;
    });
    this.dataSourceDemandaAction.data = this.demandas;
    this.dataSourceDemandaAction.paginator = this.paginator;
    this.dataSourceDemandaAction.sort = this.sort;
    this.cupoSeleccionados = [];
    this.countCuposDisponibles = this.cupos.length;
    this.countCuposDemandados = 0;
    this.countCuposSeleccionados = this.countCuposDemandadosLibres = 0;
    for (let index = 0; index < this.demandaSeleccionados.length; index++) {
      this.itemForm.controls["quantity" + index].setValue(0);
    }
    this.hay_seleccionados = false;
  }

  addPersona() {
    let dialogRefPersona: MatDialogRef<any> = this.dialog.open(
      AddPersonaComponent,
      {
        width: "720px",
        disableClose: true,
        data: {
          title: "Agregar persona",
          payload: {},
          isNew: true,
        },
      }
    );

    dialogRefPersona.afterClosed().subscribe(async (res) => {
      if (!res) {
        // If user press cancel
        return;
      }
      let id_usuario = res.data.id;

      // Actualizo los datos del usuario
      let perso = {
        id: id_usuario,
        es_cliente_final: "1",
        es_dador_cupo: "0",
        cliente_muvin: "1",
      };
      await this.personasService.updatePersonaAdmin(perso).toPromise();

      // Le pongo rol de centro muvin a la nueva persona
      await this.personasService
        .postRolPersona({
          id_rol: 3,
          id_usuario: id_usuario,
        })
        .toPromise();
    });
  }
}

@Component({
  selector: "app-cartulas-diferentes",
  template: `<mat-card
    class="p-0"
  >
    <mat-card-title
      class="mat-bg-warn m-0"
      style="background:#FFE100;text-align: center;"
    >
      <div class="card-title-text" style="padding: 0">
        <div fxFlex="100" fxLayoutAlign="center start">
          <div fxFlex="10"></div>
          <div fxFlex="80">
            <img
              src="assets/images/muvin/icono_i.png"
              alt=""
              style="margin-top: 15px; "
            />
          </div>
          <div fxFlex="10" style="color: black;">
            <button
              mat-icon-button
              matTooltip="Cerrar"
              color="m-0"
              class="m-0"
              (click)="dialogRef.close(false)"
            >
              <mat-icon>cancel</mat-icon>
            </button>
          </div>
        </div>
      </div>
      <div #myerr class="card-title-text" style="height: 40px; color: black;">
        <span fxFlex></span>
        <strong> <p>Atención</p> </strong>
        <span fxFlex></span>
      </div>
      <div
        class="card-title-text"
        style="color: black; padding: 0;margin-top:20px;"
        fxLayoutAlign="center start"
      >
        <p>
          Está intentando asignar cupo/s a solicitudes con diferentes carátulas
          o sin carátulas.
        </p>
      </div>
      <div
        class="card-title-text"
        style="color: black; padding: 0;"
        fxLayoutAlign="center start"
      >
        <strong> <p>Se asignaran, según la siguiente lógica:</p> </strong>
      </div>
      <div class="card-title-text" style="color: black; padding: 0;">
        <div fxFlex="100" fxLayoutAlign="start start">
          <strong style="margin-left: 20px;">
            <p>
              1- "Carátula según solicitud": Hay carátulas distintas entre la
              asignación de cupos y la solicitud.
            </p>
          </strong>
        </div>
      </div>
      <div class="card-title-text" style="color: black; padding: 0;">
        <div fxFlex="100" fxLayoutAlign="start start">
          <strong style="margin-left: 50px;">
            <p>Predomina la de la solicitud.</p>
          </strong>
        </div>
      </div>
      <div class="card-title-text" style="color: black; padding: 0;">
        <div fxFlex="100" fxLayoutAlign="start start">
          <strong style="margin-left: 50px;">
            <p>Si la solicitud no tiene carátula, predomina la del cupo.</p>
          </strong>
        </div>
      </div>
      <div class="card-title-text" style="color: black; padding: 0;">
        <div fxFlex="100" fxLayoutAlign="start start">
          <strong style="margin-left: 20px;">
            <p>
              2- "Ambas carátulas": Hay carátulas distintas entre la asignación
              del cupo y la solicitud.
            </p>
          </strong>
        </div>
      </div>
      <div class="card-title-text" style="color: black; padding: 0;">
        <div fxFlex="100" fxLayoutAlign="start start">
          <strong style="margin-left: 50px;">
            <p>Permanece en ambas carátulas.</p>
          </strong>
        </div>
      </div>
    </mat-card-title>
    <div mat-dialog-actions>
      <button
        type="button"
        #button
        mat-raised-button
        style="margin-left: 40px; border-radius: 15px;"
        color="primary"
        (click)="dialogRef.close('1')"
      >
        Carátula según solicitud
      </button>
      &nbsp;
      <span fxFlex></span>
      <button
        type="button"
        mat-raised-button
        style="margin-right: 40px;  border-radius: 15px;background-color: #121312;color: #fff; "
        (click)="dialogRef.close('2')"
      >
        Ambas carátulas
      </button>
    </div>
  </mat-card>`,
  styleUrls: ["./asignar-solicitud.component.scss"],
})
export class AppCaratulasDiferentesComponent implements OnInit {
  @ViewChild('button') button;

  constructor(
    public dialogRef: MatDialogRef<AppCaratulasDiferentesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit(): void {
    setTimeout(() => {
      this.button.focus();
    }, 100)


  }
}
