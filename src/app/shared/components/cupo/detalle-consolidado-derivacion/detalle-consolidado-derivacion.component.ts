import { Component, OnInit, Inject, ViewChild, ViewEncapsulation } from "@angular/core";
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
import { SelectionModel } from "@angular/cdk/collections";
import { MotivoRechazoComponent } from "../recuperar/motivo-rechazo/motivo-rechazo.component";

export class DetallesCupos {
  alfanumericoCupo: string;
  position: number;
  id_cupo: number;
  recuperable: boolean;
  razonSocial: string;
  idCuitChoferAsignado: string;
  choferAsignado: string;
  fechaArribado: Date;
  transportadora: string;
}

@Component({
  selector: 'app-detalle-consolidado-derivacion',
  templateUrl: './detalle-consolidado-derivacion.component.html',
  styleUrls: ['./detalle-consolidado-derivacion.component.scss'],
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
export class DetalleConsolidadoDerivacionComponent implements OnInit {

  cupos: DetallesCupos[] = [];
  public itemForm: FormGroup;
  pageSize = 10;
  producto: string = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<DetallesCupos>();
  selection = new SelectionModel<DetallesCupos>(true, []);

  displayedColumns: string[] = [
    "alfanumericoCupo",
    "razonSocialTransportadora",
    "horaArribo",
    "select"
  ];
  expandedElement: Cupo;
  totalSize = 5;
  tableWidth: string = "";
  heightDefault: string = '50vh';
  mostrarRecuperar: boolean = false;
  countRecuperable = 0;
  cupera = 2;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DetalleConsolidadoDerivacionComponent>,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private cupoService: CupoService,
    public homeService: HomeService,
    private errorService: AppErrorService,
    private alertService: AppAlertService,
    private loader: AppLoaderService
  ) { }

  ngOnInit() {
    this.mostrarRecuperar = this.data.payload.recupera;
    this.cupera = this.data.cupera;
    for (let index = 0; index < this.data.payload.cupos.length; index++) {
      const element = this.data.payload.cupos[index];
      let temp = new DetallesCupos();
      temp
      temp.alfanumericoCupo = element.idCupoTerminal;
      temp.idCuitChoferAsignado = element.idCuitChoferAsignado;
      temp.choferAsignado = element.choferAsignado;
      temp.fechaArribado = element.fechaArribado;
      temp.id_cupo = element.id;
      temp.position = index;
      temp.recuperable = element.recuperable;
      temp.transportadora = element.derivacion.transportadora;
      if (element.razonSocialPersona != null) {
        temp.razonSocial = element.razonSocialPersona;
      } else if (element.razonSocialEmpresa != null) {
        temp.razonSocial = element.razonSocialEmpresa;
      } /*else if( element.razonSocialEmpresa == null && element.razonSocialPersona ){

      }*/
      this.countRecuperable = temp.recuperable ? this.countRecuperable + 1 : this.countRecuperable;
      this.cupos.push(temp);
    }
    this.heightDefault = (this.data.payload.height - 5).toString() + 'vh';
    this.dataSource.data = this.cupos;
  }

  recuperarCupos() {
    let dialogRef: MatDialogRef<any> = this.dialog.open(MotivoRechazoComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
      let cupos = [];
      let id_motivo_recuperar = res.id_motivo_recuperar;
      let motivo_recuperar = res.motivo_recuperar;
      this.selection.selected.forEach((element) => {
        cupos.push(element.id_cupo);
      });
      this.cupoService.recuperarCupos(cupos, id_motivo_recuperar, motivo_recuperar).subscribe(
        (res) => {
          this.alertService
            .confirm({
              message: "Cupos recuperados correctamente!",
              tipo: "exito",
            })
            .subscribe((res1) => {
              if (res1) {
                this.dialogRef.close(true);
                return;
              }
            });
        },
        (err) => {
          this.errorService.confirm({
            message: "Cupos no recuperados, ha ocurrido un error.",
          });
        }
      );
      return;
    });
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    //const numRows = this.countRecuperable;
    return numSelected === this.countRecuperable;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => {
        if (row.recuperable) {
          this.selection.select(row);
        }
      });
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: DetallesCupos): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row.position + 1
      }`;
  }

  submit() {
    this.dialogRef.close();
  }
}
