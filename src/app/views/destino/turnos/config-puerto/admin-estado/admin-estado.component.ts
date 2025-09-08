import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort, MatTableDataSource, PageEvent, MatDialog, MatSnackBar, MatTable } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { Puerto } from 'app/shared/models/puerto';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { DestinosService } from 'app/shared/services/destinos.service';
import { SituacionPuertoService } from '../../../../../shared/services/situacion-puerto.service';
import { AddEditEstadoComponent } from './add-edit-estado/add-edit-estado.component';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-admin-estado',
  templateUrl: './admin-estado.component.html',
  styleUrls: ['./admin-estado.component.scss'],
  providers: [DestinosService, SituacionPuertoService],
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
export class AdminEstadoComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = [
    "first_column",
    "descripcion",
    "color",
    "acciones"
  ];
  public itemForm: FormGroup;
  listEstados: any[] = [];
  puerto: Puerto;
  pageEvent: PageEvent = new PageEvent();
  estadoActivo = 0;
  initialActivo = 0;
  isInMobile = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private changeDetectorRefs: ChangeDetectorRef,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AdminEstadoComponent>,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private destinosService: DestinosService,
    private situacionPuertoService: SituacionPuertoService,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 10;
    this.isInMobile = ((window.screen).width > 991) ? false : true;
  }

  ngOnInit() {
    this.puerto = this.data.payload.puerto;
    this.setPage(this.pageEvent);

  }

  setPage(event?: PageEvent) {
    event.pageIndex++;
    this.situacionPuertoService.getListEstadosPuerto(this.puerto.id)
      .subscribe(pagedData => {
        this.listEstados = [];
        if (pagedData.data) {
          this.listEstados = pagedData.data;
          for (let index = 0; index < this.listEstados.length; index++) {
            const element = this.listEstados[index];
            element.color = '#' + element.color;
            if (element.activo == 1) {
              this.estadoActivo = index;
              this.initialActivo = index;
            }
          }
          this.dataSource.data = this.listEstados;
          this.pageEvent.length = pagedData._meta.totalCount;
          this.pageEvent.pageIndex = pagedData._meta.currentPage;
          this.pageEvent.pageSize = pagedData._meta.perPage;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.changeDetectorRefs.detectChanges();
        }
      })


  }
  onCheckboxChangeEstadoActive(chck, i) {
    this.estadoActivo = chck.checked ? i : -1;
  }

  openPopAdminEstado(action, obj) {
    obj.action = action;
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddEditEstadoComponent, {
      width: '50vw',
      disableClose: false,
      data: obj
    })
    dialogRef.afterClosed()
      .subscribe(result => {
        if (!result) {
          return;
        }
        if (result.event === 'Add') {
          this.addRowData(result.data);
        } else if (result.event === 'Update') {
          this.updateRowData(result.data);
        } else if (result.event === 'Delete') {
          this.deleteRowData(result.data);
        }
        this.setPage();
      })

  }

  submit() {
    let data = {
      id: this.puerto.id,
      id_situacion_puerto: this.listEstados[this.estadoActivo].id,
    }
    this.loader.open('Espere por favor...', 'Actualizando..');
    this.destinosService.updateDestino(data).subscribe(response => {
      this.loader.close();
      this.setPage(this.pageEvent);
      this.snack.open('Situación del puerto actualizando!', 'OK', { duration: 4000 });
      this.table.renderRows();
      this.dialogRef.close(response);
    },
      error => {
        this.loader.close();
        this.snack.open('¡No se puede actualizar la situación del puerto!', 'Error', { duration: 4000 });
      });

  }
  cancelar() {
    this.dialogRef.close();
  }
  initPageEvent() {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 10;
  }

  addRowData(row_obj) {
    let colorSubstring = row_obj.color.substring(1, 7);
    let data = {
      descripcion: row_obj.descripcion,
      color: colorSubstring,
      id_puerto: this.puerto.id
    }
    this.loader.open('Espere por favor...', 'Agregando..');
    this.situacionPuertoService.postSituacionPuerto(data).subscribe(user => {
      this.loader.close();
      this.setPage(this.pageEvent);
      this.snack.open('Estado del puerto agregado!', 'OK', { duration: 4000 });
      this.table.renderRows();
    },
      error => {
        this.loader.close();
        this.snack.open('¡No se puede agregar el estado!', 'Error', { duration: 4000 });
      });
  }

  updateRowData(row_obj) {
    let colorSubstring = row_obj.color.substring(1, 7);
    let data = {
      id: row_obj.id,
      descripcion: row_obj.descripcion,
      color: colorSubstring,
      id_puerto: this.puerto.id
    }
    this.loader.open('Espere por favor...', 'Actualizando...');
    this.situacionPuertoService.updateSituacionPuerto(data).subscribe(user => {
      this.loader.close();
      this.dataSource.data = this.dataSource.data.filter((value, key) => {
        if (value.id === row_obj.id) {
          value.descripcion = row_obj.descripcion;
          value.color = row_obj.color;
        }
        return true;
      });
      this.snack.open('Estado de puerto actualizado!', 'OK', { duration: 4000 });
      this.table.renderRows();
    },
      error => {
        this.loader.close();
        this.snack.open('¡No se puede actualizar el estado del puerto!', 'Error', { duration: 4000 });
      })


  }

  deleteRowData(row_obj) {
    this.loader.open('Espere por favor...', 'Eliminando...');
    this.situacionPuertoService.deleteSituacionPuerto(row_obj.id).subscribe(user => {
      this.loader.close();
      this.dataSource.data = this.dataSource.data.filter((value, key) => {
        return value.id !== row_obj.id;
      });
      this.snack.open('Estado de puerto eliminado!', 'OK', { duration: 4000 });
      this.table.renderRows();
    },
      error => {
        this.loader.close();
        this.snack.open('¡No se puede eliminar el Estado de puerto!', 'Error', { duration: 4000 });
      })

  }


}
