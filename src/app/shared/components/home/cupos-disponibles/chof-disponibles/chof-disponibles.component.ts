import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { CupoDisponible } from '@app/shared/models';
import { AppAlertService, AppErrorService, AppLoaderService, NomencladoresService } from '@app/shared/services';

export interface TableColumn<T> {
  label: string;
  property: string;
  type: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button';
  visible?: boolean;
  cssClasses?: string[];
  evaluate?: Function;
}

@Component({
  selector: 'app-chof-disponibles',
  templateUrl: './chof-disponibles.component.html',
  styleUrls: ['./chof-disponibles.component.scss']
})
export class ChofDisponiblesComponent implements OnInit {

  today = new Date();

  id_origen;

  cuposDisponibles: CupoDisponible[] = [];

  choferes = [];

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ChofDisponiblesComponent>,
    private nomencladoresService: NomencladoresService,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    private errorService: AppErrorService,
  ) {
    this.cuposDisponibles = this.data.cupos;
    this.choferes = this.data.choferes;
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  columns: TableColumn<any>[] = [
    {
      label: "Nombre",
      property: "nombre",
      type: "text",
      visible: true,
      evaluate: (row: any) => {
        return row.nombre_persona;
      },
    },
    {
      label: "Chapa",
      property: "chapa",
      type: "text",
      visible: true,
      evaluate: (row: any) => {
        return row.patente;
      },
    },
    {
      label: "Acciones",
      property: "actions",
      type: "button",
      visible: true,
    }
  ];

  dataSource = new MatTableDataSource<any>(this.data.choferes);

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.getItemsOrigen();
    console.log(this.data);
  }

  cancelado() { }

  getItemsOrigen() {
    this.nomencladoresService
      .getAllOrigenesSelect()
      .subscribe(data => {
        this.id_origen = data.data[0].id;
      });
  }

  asignar(chofer) {
    this.loader.open();

    const data = {
      choferCuit: chofer.cuit_persona,
      id_cliente: localStorage.getItem("cuit_cuil"),
      id_origen: this.id_origen,
      id_cupo: this.cuposDisponibles[0].id
    };

    this.nomencladoresService.postPedidoRapido(data).subscribe(
      data => {
        if (this.loader !== null) {
          this.loader.close();
        }
        this.cuposDisponibles.splice(0, 1);
        this.data.cuposDisponibles--;

        console.log(chofer.id);

        let index = this.choferes.findIndex(item => item.id === chofer.id);
        console.log(index);

        this.choferes.splice(index, 1);

        console.log(this.choferes);

        this.dataSource.data = this.choferes;
        this.dataSource.sort = this.sort;

        this.alertService
          .confirm({
            message: "¡Chofer asignado correctamente!",
            tipo: "exito"
          })
          .subscribe(res => {
            if (res) {
              return;
            }
          });
      },
      err => {
        if (this.loader !== null) {
          this.loader.close();
        }
        this.errorService.confirm({ message: "¡No se pudo asignar correctamente!" }).subscribe((res) => {
          if (res) {
            return;
          }
        });
      }
    );
  }

}
