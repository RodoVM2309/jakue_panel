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
import { MagypCadena } from 'app/shared/models/magyp-cadena';
import { AddEditarComponent } from './add-editar/add-editar.component';

@Component({
  selector: 'app-cadenas',
  templateUrl: './cadenas.component.html',
  styleUrls: ['./cadenas.component.scss'],
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
export class CadenasComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  cadenasForm: FormGroup;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    "descripcion",
    "acciones",
  ];
  pageEvent: PageEvent = new PageEvent();
  cadenas: MagypCadena[] = [];

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
    this.magypService.getCadenas()
    .subscribe(
      res => {
        this.loader.close();
        this.cadenas = res.data;
        this.dataSource.data = this.cadenas;
      },
      error => {
        this.loader.close();
      }
    );
  }

  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(AddEditarComponent, {
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
    this.magypService.add(row_obj).subscribe(user => {
      this.loader.close();
      this.setPage(this.pageEvent);
      this.snack.open('Cadena agregada!', 'OK', { duration: 4000 });
      this.table.renderRows();
    },
      error => {
        this.loader.close();
        this.snack.open('¡No se puede agregar la cadena!', 'Error', { duration: 4000 });
      });
  }

  updateRowData(row_obj) {
    this.loader.open('Espere por favor...', 'Actualizando...');
    this.magypService.update(row_obj).subscribe(user => {
      this.loader.close();
      this.dataSource.data = this.dataSource.data.filter((value, key) => {
        if (value.id === row_obj.id) {
          value.descripcion = row_obj.descripcion;
        }
        return true;
      });
      this.snack.open('Cadena actualizada!', 'OK', { duration: 4000 });
      this.table.renderRows();
    },
      error => {
        this.loader.close();
        this.snack.open('¡No se puede actualizar la cadena!', 'Error', { duration: 4000 });
      })


  }

  deleteRowData(row_obj) {
    this.loader.open('Espere por favor...', 'Eliminando...');
    this.magypService.delete(row_obj.id).subscribe(user => {
      this.loader.close();
      this.dataSource.data = this.dataSource.data.filter((value, key) => {
        return value.id !== row_obj.id;
      });
      this.snack.open('Cadena eliminada!', 'OK', { duration: 4000 });
      this.table.renderRows();
    },
      error => {
        this.loader.close();
        this.snack.open('¡No se puede eliminar la cadena!', 'Error', { duration: 4000 });
      })

  }



}
