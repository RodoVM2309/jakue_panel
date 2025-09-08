import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { SelectionModel } from "@angular/cdk/collections";
import { ChoferCentro } from "app/shared/models/chofer";
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
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_DIALOG_DATA,
  MatDialogRef,
  Sort,
} from "@angular/material";
import { SendsmsService } from "app/shared/services/sendsms.service";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { AppAtencionService } from "app/shared/services/app-atencion/app-atencion.service";
import { AppAlertService } from "app/shared/services/app-alert/app-alert.service";

@Component({
  selector: "app-notificar-transportistas",
  templateUrl: "./notificar-transportistas.component.html",
  styleUrls: ["./notificar-transportistas.component.scss"],
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
export class NotificarTransportistasComponent implements OnInit {
  choferes: ChoferCentro[] = [];
  public itemForm: FormGroup;
  pageSize = 10;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<ChoferCentro>();
  selection = new SelectionModel<ChoferCentro>(true, []);
  displayedColumns: string[] = ["nombre_chofer", "patente", "hora_arribo", "select"];
  sortedData: ChoferCentro[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NotificarTransportistasComponent>,
    private fb: FormBuilder,
    private smsService: SendsmsService,
    private loader: AppLoaderService,
    private atencionService: AppAtencionService,
    private alertService: AppAlertService
  ) {}

  ngOnInit() {
    this.choferes = this.data.payload.choferes;
    this.dataSource.data = this.choferes;
    this.dataSource.sort = this.sort;
    this.itemForm = this.fb.group({
      body: ["", [ Validators.maxLength(250)]],
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  submit() {
    this.loader.open();
    let numbers: string[] = [];
    for (let i = 0; i < this.selection.selected.length; i++) {
      let number = this.selection.selected[i].telefono;
      numbers.push(number);
    }
    let data = {
      numbers: numbers,
      message: this.itemForm.controls["body"].value,
    };
    this.smsService.postSMSGroup(data).subscribe(
      (data) => {
        if (this.loader !== null) {
          this.loader.close();
        }
        this.alertService
          .confirm({
            message: "¡Mensajes enviados correctamente!",
            tipo: "exito",
          })
          .subscribe((res) => {
            if (res) {
              this.selection.clear();
              return;
            }
          });
        return;
      },
      (err) => {
        this.loader.close();
        this.atencionService
          .confirm({ message: "No se pudieron enviar los SMS" })
          .subscribe((res) => {
            if (res) {
              return;
            }
          });
      }
    );
  }

  gotoWhatsapp(chofer){
    window.open("https://web.whatsapp.com/send?phone=+549" + chofer.telefono , "_blank");
  }

  sortData(sort: Sort) {
    const data = this.choferes.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nombre_chofer': return compare(a.nombre_chofer, b.nombre_chofer, isAsc);
        case 'patente': return compare(a.patente, b.patente, isAsc);
        case 'hora_arribo': return compare(a.hora_arribo, b.hora_arribo, isAsc);
        default: return 0;
      }
    });
    this.dataSource.data = this.sortedData;
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
