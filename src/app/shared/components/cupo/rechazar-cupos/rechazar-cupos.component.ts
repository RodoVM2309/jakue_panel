import {
  Component,
  OnInit,
  Inject,
  ViewChild,
} from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
} from "@angular/material";
import {
  AppAlertService,
  AppErrorService,
  AppAtencionService,
  AppLoaderService
} from "@shared/services";
import { CupoService } from "../cupo.service";
import { CuposAsignar } from "@shared/models/cuposDisponibles";
import * as moment from "moment";

@Component({
  selector: "app-rechazar-cupos",
  templateUrl: "./rechazar-cupos.component.html",
  styleUrls: ["./rechazar-cupos.component.scss"],
})
export class RechazarCuposComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  dataSourceAction = new MatTableDataSource();

  displayedColumns: string[] = [
    "idCuitDestinatario",
    "nombreDestino",
    "alfanumericoCupo",
  ];

  displayedColumnsAction: string[] = [
    "selectedCupo",
    // "detalleCupo"
  ];

  countCuposDisponibles: number = 0;
  countCuposSeleccionados: number = 0;
  id_producto: number;
  producto: string = "";
  cupos: CuposAsignar[] = [];
  cupoSeleccionados: CuposAsignar[] = [];
  hay_seleccionados: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RechazarCuposComponent>,
    private dialog: MatDialog,
    private alertService: AppAlertService,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,
    private loader: AppLoaderService,
    private cupoService: CupoService
  ) { }

  ngOnInit() {
    this.id_producto = this.data.payload.id_producto;
    this.producto = this.data.payload.filtro.producto;
    this.cupos = [];

    this.data.payload.cupos.forEach((cupo: CuposAsignar) => {
      cupo.habilitado = true;
      cupo.asignados = false;

      var currentTime: moment.Moment = moment();
      console.log('cupo.ultima_fecha_asignacion:', cupo.ultima_fecha_asignacion);
      let fechaHoraUltimaActualizacion = cupo.ultima_fecha_asignacion
        ? moment(cupo.ultima_fecha_asignacion)
        : currentTime;
      let duration = moment.duration(
        currentTime.diff(fechaHoraUltimaActualizacion)
      );
      let hours = duration.asHours();
      if (
        cupo.asignado == "0" ||
        cupo.caratulaMercadoATermino.length == 0 ||
        hours > 3 || cupo.ctg !== null
      ) {
        cupo.habilitado = false;
      }
      this.cupos.push(cupo);
    });

    console.log(this.cupos);

    const result = this.cupos.filter(word => word.habilitado);
    this.countCuposDisponibles = result.length;

    this.dataSource.data = this.cupos;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSourceAction.data = this.cupos;
    this.dataSourceAction.paginator = this.paginator;
    this.dataSourceAction.sort = this.sort;
  }

  seleccionarTodos() {
    this.cupos.forEach((element) => {
      if (!element.asignados && element.habilitado) {
        element.asignados = true;
        this.cupoSeleccionados.push(element);
      }
    });
    this.countCuposDisponibles = 0;
    this.countCuposSeleccionados = this.cupoSeleccionados.length;
    this.hay_seleccionados = this.countCuposSeleccionados > 0 ? true : false;
  }

  quitarTodos() {
    this.cupos.forEach((element) => {
      element.asignados = false;
    });
    this.cupoSeleccionados = [];
    const result = this.cupos.filter(word => word.habilitado);
    this.countCuposDisponibles = result.length;
    this.countCuposSeleccionados = 0;
    this.hay_seleccionados = this.countCuposSeleccionados > 0 ? true : false;
  }

  onCheckboxChange($event, cupo, index) {
    if ($event.checked) {
      this.cupoSeleccionados.push(cupo);
      this.cupos[index].asignados = $event.checked;
      this.countCuposSeleccionados = this.cupoSeleccionados.length;
      if (this.countCuposDisponibles > 0) {
        this.countCuposDisponibles--;
      }
    } else {
      this.cupos[index].asignados = $event.checked;
      let tempArray = [];
      this.cupoSeleccionados.forEach((element) => {
        if (element.id != cupo.id) {
          tempArray.push(element);
        }
      });
      /* for (let index = 0; index < this.cupos.length; index++) {
        this.cupos[index].habilitado = false;
      } */
      this.cupoSeleccionados = tempArray;
      this.countCuposSeleccionados = this.cupoSeleccionados.length;
      this.countCuposDisponibles++;
    }
    this.hay_seleccionados = this.countCuposSeleccionados > 0 ? true : false;
  }

  rechazar() {
    this.loader.open("Por favor espere..");
    console.log(this.cupoSeleccionados);

    let cupos = [];
    this.cupoSeleccionados.forEach((cupo) => {
      cupos.push(cupo.id);
    });

    let data = {
      cupos: cupos,
    };

    this.cupoService.postRechazarCupos(data).subscribe(
      (res) => {
        this.loader.close();
        this.alertService
          .confirm({
            message: "¡Cupos rechazados correctamente!",
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
            this.errorService.confirm({
              message: err.message,
            });
            break;
          case 422:
            this.errorService.confirm({
              message: err.message,
            });
            break;

          default:
            this.errorService.confirm({ message: err, textBoton: 'ENTENDIDO' }).subscribe((res) => {
              if (res) {
                return;
              }
            });
            break;
        }
      }
    );
  }

  cerrar() {
    this.dialogRef.close();
  }
}
