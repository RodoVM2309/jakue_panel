import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatTable } from "@angular/material";
import {
  FormBuilder,
  // Validators,
  FormGroup,
  // FormControl
} from "@angular/forms";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
  // DateAdapter,
  // MAT_DATE_FORMATS,
  // MAT_DATE_LOCALE
} from "@angular/material";
import { DemandaCupo } from "app/shared/models/demanda-cupo";
import { CupoService } from "../cupo.service";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { HomeService } from "../../home/home.service";
import { CambiarDemandaComponent } from './cambiar-demanda/cambiar-demanda.component'
// import { DetalleCupoComponent } from '../../home/cupos-vinculados/detalle-cupo/detalle-cupo.component';
// import { Demandas } from "app/shared/models/cuposDisponibles";
import { AddCuposSolicitadosComponent } from "../add-cupos-solicitados/add-cupos-solicitados.component";

export class DetallesSolicitud {
  "id_demanda_cupo": string;
  "id_producto": string;
  "id_demandante": string;
  "id_demandado": string;
  "id_chofer": string;
  "id_cupo": string;
  "id_receptor": string;
  "id_demanda": string;
  "alfanumericoCupo": string;
  "id_destino": string;
  "cartaPorte": string;
  "fechaCupo": string;
  "id_estado_cupo": string;
  "estado_cupo": string;
  "id_estado": string;
  "estado_viaje": string;
  "nombre_producto": string;
  "nombre_destino": string;
  "nombre_demandante": string;
  "nombre_demandado": string;
  "nombre_chofer": string;
}
@Component({
  selector: "app-informacion-demanda",
  templateUrl: "./informacion-demanda.component.html",
  styleUrls: ["./informacion-demanda.component.scss"],
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
export class InformacionDemandaComponent implements OnInit {
  demandasCupo: DemandaCupo[] = [];
  public itemForm: FormGroup;
  pageSize = 10;
  producto = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatTable) table: MatTable<any>;

  usaMTR: boolean = false;
  displayedColumns: string[] = [];
  expandedElement: DemandaCupo;
  totalSize = 5;
  tableWidth = "";
  chanceCount = false;
  detallesSolicitud: any[];//DetalleCupoComponent[];
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InformacionDemandaComponent>,
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    private cupoService: CupoService,
    private homeService: HomeService,
    private dialog: MatDialog,
  ) {
    this.usaMTR = localStorage.getItem("usaMtr") == "1" ? true : false;
    if (this.usaMTR) {
      this.displayedColumns = [
        "first_column",
        "fechaCupo",
        "fechaHasta",
        // "codigoCosecha",
        "numeroContrato",
        "zona",
        "cantidad",
        "asignado",
        "observaciones",
        "caratula_mtr",
        "editar",
        "redirigir"
      ];
    } else {
      this.displayedColumns = [
        "first_column",
        "fechaCupo",
        "fechaHasta",
        // "codigoCosecha",
        "numeroContrato",
        "zona",
        "cantidad",
        "asignado",
        "observaciones",
        // "caratula_mtr",
        "editar",
        // "redirigir"
      ];
    }
  }

  ngOnInit() {
    this.producto = this.data.payload.producto;
    this.demandasCupo = this.data.payload.demandas;
    console.log(this.data.payload);

    this.dataSource.data = this.demandasCupo;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public restarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() - dias);
    return fecha;
  }
  public sumarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

  getTotalCantidad() {
    return this.demandasCupo
      .map(t => t.cantidad)
      .reduce((acc, value) => acc + value, 0);
  }
  getTotalAsignados() {
    return this.demandasCupo
      .map(t => t.asignado)
      .reduce((acc, value) => acc + value, 0);
  }

  submit() {
    if (this.chanceCount)
      this.dialogRef.close(1)
    else
      this.dialogRef.close()
  }

  openPopUpChanceDemanda(row) {
    this.detallesSolicitud = row.asignados;
    let heightPopUp: string = '60vh';
    let title = "MODIFICAR CANTIDAD DE CUPOS";
    let fecha: any;
    row.nombreDemandante = this.data.payload.demandante;
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      CambiarDemandaComponent,
      {
        width: "55vw",
        height: heightPopUp,
        disableClose: true,
        data: {
          title: title,
          payload: { demanda: row }
        }
      }
    );
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.chanceCount = true;
        this.dataSource.data = this.dataSource.data.filter((value, key) => {
          if (value.id_demanda_cupo == row.id_demanda_cupo) {
            value.cantidad = res;
          }
          return true;
        });
        this.changeDetectorRefs.detectChanges();
      }

      return;
    });
  }

  mostrarDetallesCupos(expandid, cupo) {
    this.loading = true;
    this.detallesSolicitud = [];
    if (expandid !== cupo) {
      this.detallesSolicitud = cupo.asignados;
    }
  }

  mostrarDetallesCuposExpandir(expandid, cupo) {
    this.detallesSolicitud = [];
    this.loading = true;
    this.expandedElement = cupo;
    this.detallesSolicitud = cupo.asignados;


    if (this.detallesSolicitud.length > 0) {
      for (let i = 0; i < this.detallesSolicitud.length; i++) {
        this.detallesSolicitud[i].fecha = this.cupoService.formatoFecha(this.detallesSolicitud[i].fecha, "amd", "-");
      }
    }
  }

  addCupoSolicitados(cupo) {
    let title = "";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AddCuposSolicitadosComponent,
      {
        width: "720px",
        disableClose: true,
        data: { title: title, tipo: 0, cupo: cupo, redirigir: true, id_producto: this.data.payload.id_producto }
      }
    );
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      cupo.redirigida = '1';
      return;
    });
  }
}
