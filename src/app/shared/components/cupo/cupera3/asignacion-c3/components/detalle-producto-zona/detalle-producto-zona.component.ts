import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MessageService } from '@app/shared/services';
import { Subscription } from 'rxjs';
import { ListadoAsignacionProducto, ListadoAsignacionZona } from '../../models/listado-asignacion';
import { DiaSemana } from '@app/shared/components/cupo/cuponera/cuponera.component';
@Component({
  selector: 'app-detalle-producto-zona',
  templateUrl: './detalle-producto-zona.component.html',
  styleUrls: ['./detalle-producto-zona.component.scss']
})
export class DetalleProductoZonaComponent implements OnInit {
  @Input() variables;
  @Input() dias: DiaSemana[] = [];
  dataSourceProductosZonas = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() selectedRowProducto = new EventEmitter<ListadoAsignacionProducto>();
  @Output() cambiarFecha = new EventEmitter();
  displayedColumns: string[] = [
    "producto",
    "dia1",
    "dia2",
    "dia3",
    "dia4",
    "dia5",
    "disponibles",
    "solicitados",
  ];
  listadoAsignacionProductoZona: ListadoAsignacionProducto[];

  y = 346;
  oldY = 0;
  grabber = false;
  private subscription: Subscription;
  message: any;

  constructor(
    private messageService: MessageService,
  ) {
    this.subscription = this.messageService
      .getMessage()
      .subscribe((message) => {
        this.message = message;
        switch (this.message.text) {
          case "CambioDetallesZonasProducto":
            this.getData(this.message.data);
            break;

          default:
            break;
        }
      });
  }

  ngOnInit() {
    this.dataSourceProductosZonas.data = [];
    this.getData(this.variables.listadoAsignacionProducto);
  }

  selectedRow(item){
    this.variables.selectedProductoRow= item;
    this.selectedRowProducto.emit(item);
  }

  getData(data){
    this.listadoAsignacionProductoZona = data;
    this.dataSourceProductosZonas.data = data;
  }


}
