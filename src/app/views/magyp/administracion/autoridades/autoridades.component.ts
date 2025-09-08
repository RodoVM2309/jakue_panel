import { Component, OnInit, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { MatTableDataSource, MatDialogRef, MatDialog, MatSnackBar, PageEvent, MatTable } from '@angular/material';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MagypService } from '../../../../shared/services/magyp.service';
import { FormGroup } from '@angular/forms';
import { MagypAutoridad } from 'app/shared/models/magyp-cadena';
import { AddEditarAutoridadComponent } from './add-editar-autoridad/add-editar-autoridad.component';


@Component({
  selector: 'app-autoridades',
  templateUrl: './autoridades.component.html',
  styleUrls: ['./autoridades.component.scss'],
  providers: [MagypService],
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
export class AutoridadesComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  autoridadesForm: FormGroup;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    "descripcion",
    "acciones",
  ];
  pageEvent: PageEvent = new PageEvent();
  autoridades: MagypAutoridad[] = [];
  constructor(
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private magypService: MagypService
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 10;
  }

  ngOnInit() {
    this.setPage(this.pageEvent);
  }

  setPage(event?: PageEvent) {
    event.pageIndex++;
    this.loader.open();
    this.magypService.getAllAutoridades()
    .subscribe(
      res => {
        this.loader.close();
        this.autoridades = res.data;
        this.dataSource.data = this.autoridades;
      },
      error => {
        this.loader.close();
      }
    );
  }

  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(AddEditarAutoridadComponent, {
      width: '60vw',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Add') {
        this.addRowData(result.data);
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj) {
    this.loader.open('Espere por favor...', 'Agregando..');
    this.magypService.addAutoridad(row_obj).subscribe(user => {
      this.loader.close();
      this.setPage(this.pageEvent);
      this.snack.open('Autoridad agregada!', 'OK', { duration: 4000 });
      this.table.renderRows();
    },
      error => {
        this.loader.close();
        this.snack.open('¡No se puede agregar la Autoridad!', 'Error', { duration: 4000 });
      });
  }

  updateRowData(row_obj) {
    this.loader.open('Espere por favor...', 'Actualizando...');
    this.magypService.updateAutoridad(row_obj).subscribe(user => {
      this.loader.close();
      this.dataSource.data = this.dataSource.data.filter((value, key) => {
        if (value.id === row_obj.id) {
          value.descripcion = row_obj.descripcion;
        }
        return true;
      });
      this.snack.open('Autoridad actualizada!', 'OK', { duration: 4000 });
      this.table.renderRows();
    },
      error => {
        this.loader.close();
        this.snack.open('¡No se puede actualizar la Autoridad!', 'Error', { duration: 4000 });
      })


  }

  deleteRowData(row_obj) {
    this.loader.open('Espere por favor...', 'Eliminando...');
    this.magypService.deleteAutoridad(row_obj.id).subscribe(user => {
      this.loader.close();
      this.dataSource.data = this.dataSource.data.filter((value, key) => {
        return value.id !== row_obj.id;
      });
      this.snack.open('Autoridad eliminada!', 'OK', { duration: 4000 });
      this.table.renderRows();
    },
      error => {
        this.loader.close();
        this.snack.open('¡No se puede eliminar la Autoridad!', 'Error', { duration: 4000 });
      })

  }

}
