import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { DiaSemana } from "@app/shared/components/cupo/cuponera/cuponera.component";
import { MessageService } from "@app/shared/services";
import { Subscription } from "rxjs";
import { ListadoAsignacionZona } from "../../models";
import { forEach } from "@angular/router/src/utils/collection";
import { SelectionModel } from "@angular/cdk/collections";
import { InformacionCupoV2Component } from "@app/shared/components/cupo/informacion-cupo-v2/informacion-cupo-v2.component";

@Component({
  selector: "app-detalle-zona",
  templateUrl: "./detalle-zona.component.html",
  styleUrls: ["./detalle-zona.component.scss"],
})
export class DetalleZonaComponent implements OnInit {
  @Input() variables;
  @Input() productos;
  @Input() dias: DiaSemana[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSourceZonas = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @Input()  set listadoAsignacionZona(data) {
    //this.getData(data)
  };
  @Output() cambiarFecha = new EventEmitter();
  displayedColumns: string[] = [
    "selection",
    "zona",
    "dia1",
    "dia2",
    "dia3",
    "dia4",
    "dia5",
    "disponibles",
    "solicitados",
  ];
  listAsignacionZona: ListadoAsignacionZona[];
  height= '24vh';
  height1 = 130;
  height2 = 100;
  y = 346;
  oldY = 0;
  grabber = false;
  private subscription: Subscription;
  message: any;
  selection: SelectionModel<ListadoAsignacionZona> =
    new SelectionModel<ListadoAsignacionZona>(false, []);
  selectedRow: ListadoAsignacionZona;
  constructor(
    private dialog: MatDialog,
    private messageService: MessageService,) {
    this.subscription = this.messageService
      .getMessage()
      .subscribe((message) => {
        this.message = message;
        switch (this.message.text) {
          case "CambioDetallesZonas":
            this.getData(this.message.data);
            break;

          default:
            break;
        }
      });
  }

  ngOnInit() {
    this.dataSourceZonas.data = [];
    this.getData(this.variables.listadoAsignacionZona);
  }

  getData(data) {
    this.dataSourceZonas.data = [];
    data.forEach((element) => {
      element.selected = false;
      element.selectable = true;
    });
    this.listAsignacionZona = data;
    if (this.listAsignacionZona.length > 0) {
      this.listAsignacionZona[0].selected = true;
      this.selectedRow = this.listAsignacionZona[0];
      this.variables.selectedItemAsignacion=this.listAsignacionZona[0];
      this.dataSourceZonas.data = data;

    }

  }

  selectRow($event: any, row: ListadoAsignacionZona) {
    this.selectedRow = row;
    this.variables.selectedItemAsignacion=row;
    this.messageService.sendMessage("initOptionCupera3", "", {});
    $event.preventDefault();
    if (row.selectable && !row.selected) {
      this.dataSourceZonas.data.forEach(
        (row: ListadoAsignacionZona) => (row.selected = false)
      );
      row.selected = true;
      this.selection.select(row);
    }
  }

  getMoreInformation(): string {
    return "Address : Home \n  Tel : Number";
  }

  dataFromService = "VER DETALLE DE CUPOS";

  openPopUpInfoCupo(cupos, nombreDestinatario, idCuitDestinatario, idDestino) {
    let total = cupos.length;
    let heightPop: number = 40 + total * 10;
    let heightPopUp: string = "40vh";
    if (heightPop > 80) heightPopUp = "80vh";
    else heightPopUp = heightPop.toString();
    let title = "INFORMACIÓN DE CUPOS";
    let producto = this.productos.find(value => value.id == this.variables.filtro.idProductos[0]);
    /*let newFecha = this.homeService.formatoFecha(
      this.filtrarForm.controls["selectedFecha"].value,
      "dma",
      "/"
    );*/

    //let newFecha = moment(cupo.cupos[0].fecha).format("DD/MM/YYYY");
    //let newFecha = cupo.cupos[0].fecha;
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      InformacionCupoV2Component,
      {
        width: "55vw",
        height: heightPopUp,
        disableClose: false,
        panelClass: "no-padding-dialog",
        data: {
          title: title,
          payload: {
            cupos: cupos,
            nombre_destinatario: nombreDestinatario,
            idCuitDestinatario: idCuitDestinatario,
            idDestino: idDestino,
            fecha: cupos[0].fecha,
            id_producto: this.variables.filtro.idProductos[0],
            producto: producto.descripcion,
          },
        },
      }
    );
  }

}
