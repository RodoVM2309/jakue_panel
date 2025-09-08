import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar, MatSidenav, MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { AppLoaderService } from '../../../services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppErrorService } from '../../../services/app-error/app-error.service';

import { CentrosService } from './../../../services/centros.service';
import { Page } from '../../../models/page';
import { AddListaComponent } from './add-lista/add-lista.component';
import { DuplicarListaComponent } from './duplicar-lista/duplicar-lista.component';
import { ListaChoferesComponent } from './lista-choferes/lista-choferes.component';

export class Lista {
  id?: number;
  id_centro: number;
  nombre: string;
  id_tipo_turneada?: number
}
@Component({
  selector: 'app-lista-turneado',
  templateUrl: './lista-turneado.component.html',
  styleUrls: ['./lista-turneado.component.scss']
})
export class ListaTurneadoComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  page = new Page();
  public getItemSub: Subscription;
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };
  displayedColumns: string[] = ['id', 'nombre', 'acciones'];
  dataSource = new MatTableDataSource();
  pageEvent: PageEvent;
  listas: Lista[];
  constructor(
    private loader: AppLoaderService,
    public centroService: CentrosService,
    private dialog: MatDialog,
    private errorService: AppErrorService,
  ) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Listas por Página";
    this.paginator._intl.nextPageLabel = "Siguiente";
    this.paginator._intl.firstPageLabel = "Primero";
    this.paginator._intl.lastPageLabel = "Última Lista";
    this.paginator._intl.previousPageLabel = "Anterior";
    this.getListaCentro();
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
  getListaCentro() {
    this.loader.open();
    let id_tipo_turneada = localStorage.getItem('tipo_turneada');
    this.getItemSub = this.centroService.getAllListaCentro(id_tipo_turneada)
      .subscribe(data => {
        this.listas = data.data;
        this.dataSource.data = this.listas;
        this.loader.close();
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'Error al solicitar la lista de turneada, intentelo nuevamente' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
  }
  openPopUp(data: any = {}, isNew?) {

    let title = isNew ? "Agregar Lista" : "Modificar Lista";
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddListaComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.getListaCentro();
    });
  }
  openPopUp2(data: any = {}) {
    let title = "Lista de choferes";
    let dialogRef: MatDialogRef<any> = this.dialog.open(ListaChoferesComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: data }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
    });
  }
  openPopUp3(data: any = {}, isNew?) {

    let title = isNew ? "Duplicar Lista" : "Duplicar Lista";
    let dialogRef: MatDialogRef<any> = this.dialog.open(DuplicarListaComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.getListaCentro();
    });
  }

  setPage(event) {
  }



}
