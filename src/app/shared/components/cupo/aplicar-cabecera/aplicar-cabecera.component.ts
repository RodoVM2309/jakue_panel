import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Cupo } from 'app/shared/models/cupo';
import { MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatTableDataSource, MatSort, PageEvent, MatDialog } from '@angular/material';
import { Cabecera } from 'app/shared/models/cabecera';
import { Subscription } from 'rxjs';
import { CcppService } from 'app/shared/services/ccpp.service';
import { Page } from 'app/shared/models/page';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { CupoAsignadoApi } from 'app/shared/models/cuposDisponibles';
import { AddCabeceraComponent } from 'app/views/ccpp/cabecera/add-cabecera/add-cabecera.component';


export class Items {
  id: number;
  titulo: string;
  selected: boolean;
  habilitado: boolean;
}

@Component({
  selector: 'app-aplicar-cabecera',
  templateUrl: './aplicar-cabecera.component.html',
  styleUrls: ['./aplicar-cabecera.component.scss']
})
export class AplicarCabeceraComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  aplicarForm: FormGroup;
  cupos: any[] = [];
  cabeceras: Items[] = [];
  displayedColumns: string[] = [
    "titulo",
    "detalle",
    "seleccionar"
  ];
  public getItemSub: Subscription;
  pageEvent: PageEvent = new PageEvent();
  page = new Page();
  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Cabeceras</span>
      </div>
    `
  };
  isSelected: boolean = false;
  idCabeceraSelected: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AplicarCabeceraComponent>,
    private dialog: MatDialog,
    private ccppService: CcppService,
    private loader: AppLoaderService,
    private errorService: AppErrorService,
    private alertService: AppAlertService,
    private changeDetectorRefs: ChangeDetectorRef,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 10;
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {

    this.page.size = 10;
    this.cupos = this.data.payload.selectedCupos;
    this.setPage(this.pageEvent);
  }

  onCheckboxChange($event, row) {
    row.selected = $event.checked;
    if ($event.checked) {
      this.isSelected = true;
      for (let index = 0; index < this.cabeceras.length; index++) {
        if (this.cabeceras[index].selected) {
          this.cabeceras[index].habilitado = false;
        } else {
          this.cabeceras[index].habilitado = true;
          this.idCabeceraSelected= this.cabeceras[index].id;
        }
      }
    } else {
      this.isSelected = false;
      this.cabeceras.forEach(element => {
        element.habilitado = false;
      });
    }
  }

  buscarCabeceras() {
    this.cabeceras = [];
    // this.loader.open('Buscando cabeceras');
    this.getItemSub = this.ccppService.getAllCabecerasNotPagination()
      .subscribe(pagedData => {
        pagedData.data.forEach(element => {
          let temp = new Items();
          temp.id = element.id;
          temp.titulo = element.titulo;
          temp.selected = false;
          temp.habilitado = false;
          this.cabeceras.push(temp);
        });
        this.dataSource.data = this.cabeceras;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
        err => {

        });
  }
  setPage(event?: PageEvent) {
    this.page.pageNumber = event.pageIndex+1;
    this.loader.open('Buscando cabeceras');
    this.getItemSub = this.ccppService.getAllCabeceras(this.page.pageNumber, this.page.size)
      .subscribe(pagedData => {
        this.loader.close();
        this.cabeceras = [];
        pagedData.data.forEach(element => {
          let temp = new Items();
          temp.id = element.id;
          temp.titulo = element.titulo;
          temp.selected = false;
          temp.habilitado = false;
          this.cabeceras.push(temp);
        });
        this.dataSource.data = this.cabeceras;
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
        this.paginator._intl.itemsPerPageLabel = 'Cabeceras por Página:';
        this.paginator._intl.nextPageLabel = 'Siguiente';
        this.paginator._intl.firstPageLabel = 'Primera';
        this.paginator._intl.lastPageLabel = 'Última';
        this.paginator._intl.previousPageLabel = 'Anterior';
        this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
          const start = page * pageSize + 1;
          const end = (page + 1) * pageSize;
          return `${start} - ${end} de ${length}`;
        };
        this.changeDetectorRefs.detectChanges();
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'Error, al buscar las cabeceras' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
  }



  verDetalle(cupo) {

  }

  submit() {
      let cup: number[]= [];
      this.cupos.forEach(element => {
        cup.push(parseInt(element.id))
      });
     let data = {
       "cupos": cup,
       "id_cabecera": this.idCabeceraSelected
     };
     this.dialogRef.close(data);
     /*this.loader.open('Agregando nueva cabecera...');
     this.getItemSub = this.ccppService.postAplicarCabecera(data)
        .subscribe(resp => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.alertService.confirm({ message: '¡Cabecera aplicada correctamente!', tipo: 'exito' }).subscribe(res1 => {
            if (res1) {
              this.dialogRef.close();
              return;
            }
          });
        },
          err => {
            this.loader.close();
            this.errorService.confirm({ message: 'No se pudo aplicar la cabecera' })
              .subscribe(res1 => {
                if (res1) {
                }
              });
          }) */

  }

  openPopUpNuevaCabecera(data: any = {}, isNew) {
    let title = 'Cabecera';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddCabeceraComponent, {
      width: '75vw',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        } else {
          this.setPage(this.pageEvent);
        }
      });
  }
}
