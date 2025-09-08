import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MAT_DIALOG_DATA,
} from "@angular/material";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { VerCartaPorteComponent } from "../ver-carta-porte/ver-carta-porte.component";
import { SelectionModel } from "@angular/cdk/collections";
import * as moment from "moment";
import { CupoService } from "../cupo.service";
import {
  AppAlertService,
  AppErrorService,
  AppLoaderService,
} from "@app/shared/services";
export class Cupo {
  id: string;
  idCupoterminal: string | null;
  id_destino: string | null;
  id_producto: string | null;
  nroContrato: string | null;
  fecha: string | null;
  idCuitDestinatario: string | null;
  idCuitIntermediario: string | null;
  idCuitRemComercial: string | null;
  idCuitCorredorC: string | null;
  idCuitCorredorV: string | null;
  idCuitDestino: string | null;
  idCuitIntermediarioFlete: string | null;
  idCuitMercadoATermino: string | null;
  idCuitRepresentanteEntregador: string | null;
  idCuitTitula: string | null;
  idCuitTransportista: string | null;
  nombreDestinatario: string | null;
  nombreDestino: string | null;
  position: number;
  habilitado: boolean;
  ultima_fecha_asignacion: string | null; //Campo a incluir en la API.
  asignado: string | null; //Campo a incluir en la API.
  caratulaMercadoATermino: string | null; //Campo a incluir en la API.
  ctg: number | null;
}

@Component({
  selector: "app-informacion-cupo-v2",
  templateUrl: "./informacion-cupo-v2.component.html",
  styleUrls: ["./informacion-cupo-v2.component.scss"],
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
      ),
    ]),
  ],
})
export class InformacionCupoV2Component implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cupos: Cupo[];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    "first_column",
    "alfanumericoCupo",
    // "numeroContrato",
    // "cccp",
  ];
  expandedElement: Cupo;
  selection = new SelectionModel<Cupo>(true, []);
  newFecha = '';
  otraFecha = '';
  usaMTR: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef1: MatDialogRef<InformacionCupoV2Component>,
    private dialog1: MatDialog,
    private alertService: AppAlertService,
    private errorService: AppErrorService,
    private loader: AppLoaderService,
    private cupoService: CupoService
  ) {
    this.usaMTR = localStorage.getItem("usaMtr") == "1" ? true : false;
  }

  ngOnInit() {
    this.cupos = [];
    this.newFecha = moment(this.data.payload.fecha).format("DD/MM/YYYY");
    this.otraFecha = moment(this.data.payload.fecha).format("YYYY-MM-DD");
    if (this.usaMTR) {
      this.displayedColumns.push("select");
    }

    ;
    for (let index = 0; index < this.data.payload.cupos.length; index++) {
      let cupo: Cupo = this.data.payload.cupos[index];
      //cupo.position= index+1;
      cupo.habilitado = false;
      /*var currentTime: moment.Moment = moment();
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
      } */
      this.cupos.push(cupo);
    }
    this.loader.open();
    this.cupoService
      .getV3Cupos(this.otraFecha, this.data.payload.idCuitDestinatario, this.data.payload.idDestino)
      .subscribe(
        (res) => {
          if (this.loader !== null) {
            this.loader.close();
          }
          res.data.forEach((element) => {
            let arraySinCupo = this.cupos.filter(
              (item) => element.id_cupo !== item.id
            );
            this.cupos = arraySinCupo;
            let cupo: Cupo = new Cupo();
            cupo.fecha = element.fecha;
            cupo.idCuitDestinatario = element.idCuitDestinatario;
            cupo.nombreDestinatario = element.nombreDestinatario;
            cupo.idCupoterminal = element.idCupoTerminal;
            cupo.id = element.id_cupo;
            cupo.id_destino = element.id_destino;
            cupo.id_producto = element.id_producto;
            cupo.asignado = element.asignado;
            cupo.ultima_fecha_asignacion = element.ultima_fecha_asignacion;
            cupo.asignado = element.asignado;
            cupo.ctg = element.ctg;
            cupo.nroContrato = element.nroContrato ? element.nroContrato : '';
            cupo.caratulaMercadoATermino = element.caratula;
            cupo.habilitado = true;
            var currentTime: moment.Moment = moment();
            //console.log('cupo.ultima_fecha_asignacion:', cupo.ultima_fecha_asignacion);
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
          this.cupos.sort((a, b) =>
            a.idCupoterminal.localeCompare(b.idCupoterminal)
          );
          this.dataSource.data = this.cupos;
        },
        (error) => {
          this.loader.close();
        }
      );

    this.dataSource.data = this.cupos;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  submit() {
    this.dialogRef1.close();
  }

  openPopUpVer(data: any = {}) {
    let title = "CARTA PORTE";
    let dialogRef2: MatDialogRef<any> = this.dialog1.open(
      VerCartaPorteComponent,
      {
        width: "75vw",
        disableClose: true,
        data: { title: title, payload: data },
      }
    );
    dialogRef2.afterClosed().subscribe((res) => {
      if (!res) {
      } else {
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.filter(item => item.habilitado).length;
    return numSelected === numRows;
  }

  countEnabled() {
    return this.dataSource.data.filter(item => item.habilitado).length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    //let rowHabilitar = this.dataSource.data.filter( item => item.habilitado);
    this.selection.select(...this.dataSource.data.filter(item => item.habilitado));
    //console.log('Mi seleccion',this.selection.selected);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Cupo): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row.position + 1
      }`;
  }
  rechazar() {
    this.loader.open("Por favor espere..");
    //console.log(this.selection);

    let cupos = [];
    this.selection.selected.forEach((cupo) => {
      cupos.push(cupo.id);
    });

    let data = {
      cupos: cupos,
    };
    //console.log("Cupos a rechazar", data);
    this.loader.close();
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
              this.dialogRef1.close(1);
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
}
