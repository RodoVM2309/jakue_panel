import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import { MatDialogRef, MatDialog, MatSnackBar } from "@angular/material";
import { AppConfirmService } from "../../../shared/services/app-confirm/app-confirm.service";
import { AppAlertService } from "../../../shared/services/app-alert/app-alert.service";
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { CentrosService } from "../../../shared/services/centros.service";
import { Subscription } from "rxjs";
import { Page } from "../../../shared/models/page";

import { EditListaNegraComponent } from "./edit-lista-negra/edit-lista-negra.component";
import { AgregarChoferRucComponent } from "./agregar-chofer-ruc/agregar-chofer-ruc.component";
import { AddListaNegraComponent } from "../vincular-zona-chofer/add-lista-negra/add-lista-negra.component";
import { AppErrorService } from "@app/shared/services";

@Component({
  selector: "app-lista-negra",
  templateUrl: "./lista-negra.component.html",
  styleUrls: ["./lista-negra.component.scss"],
})
export class ListaNegraComponent implements OnInit, OnDestroy {
  page = new Page();
  public filtro;
  public filtroActivo: boolean = false;
  blackList: any;
  public getItemSub: Subscription;
  constructor(
    public router: Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private alertService: AppAlertService,
    private errorService: AppErrorService,
    private loader: AppLoaderService,
    private centro: CentrosService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    // this.getItems();
    this.setPage({ offset: 0 });
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro === undefined) {
      this.filtro = "";
    }
    
    // Crear objeto de filtros
    const filtros = {
      busqueda: this.filtro
    };
    
    // Agregar filtro activo solo si está habilitado
    if (this.filtroActivo) {
      filtros['activo'] = 1;
    }
    
    this.centro
      .getListNegra(this.page.pageNumber, filtros)
      .subscribe((pagedData) => {
        this.blackList = pagedData.data;
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
      });
  }

  // Método para determinar el estado del chofer
  getEstadoChofer(row: any): string {
    if (!row.fecha_hasta) {
      return 'activo'; // Si fecha_hasta es null, es activo
    }
    
    const fechaHasta = new Date(row.fecha_hasta);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
    fechaHasta.setHours(0, 0, 0, 0);
    
    return fechaHasta > hoy ? 'activo' : 'inactivo';
  }

  // Método para habilitar chofer (establecer fecha_hasta como ayer)
  habilitarChofer(row: any) {
    this.confirmService
      .confirm({
        message: `¿Está seguro de habilitar al chofer: ${row.nombre_chofer}?`,
      })
      .subscribe((res) => {
        if (res) {
          this.loader.open();
          
          // Crear fecha de ayer
          const ayer = new Date();
          ayer.setDate(ayer.getDate() - 1);
          const fechaAyer = ayer.toISOString().split('T')[0]; // Formato YYYY-MM-DD
          
          const updateData = {
            id: row.id,
            id_chofer: row.id_chofer,
            id_motivo: row.id_motivo,
            explicacion: row.explicacion,
            fecha_hasta: fechaAyer
          };
          
          this.centro.updateChoferListaNegra(updateData).subscribe(
            (data) => {
              this.loader.close();
              this.setPage({ offset: 0 });
              this.snack.open("Chofer habilitado exitosamente!", "OK", {
                duration: 4000,
              });
            },
            (err) => {
              this.loader.close();
              this.alertService.confirm({
                message: "Error al habilitar el chofer",
              });
            }
          );
        }
      });
  }

  openPopUp(data: any = {}) {
    const title = "Modificar Motivos de Chofer en Lista Negra";
    const dialogRef: MatDialogRef<any> = this.dialog.open(
      EditListaNegraComponent,
      {
        width: "720px",
        disableClose: true,
        data: { title: title, payload: data },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.loader.open();
      this.centro.updateChoferListaNegra(res).subscribe(
        (data1) => {
          this.loader.close();
          this.setPage({ offset: 0 });
          this.snack.open(
            "Motivo del chofer en lista negra actualizado!",
            "OK",
            { duration: 4000 }
          );
          return;
        },
        (err) => {
          this.loader.close();
          this.alertService.confirm({
            message: "Error al modificar el motivo",
          });
        }
      );
    });
  }
  deleteItem(row) {
    this.confirmService
      .confirm({
        message: `Está seguro de eliminar el chofer: ${row.nombre_chofer} de la lista negra?`,
      })
      .subscribe((res) => {
        if (res) {
          this.loader.open();
          this.centro.deleteListaNegra(row.id_chofer).subscribe(
            (data) => {
              this.loader.close();
              this.setPage({ offset: 0 });
              this.snack.open("Chofer eliminado de la lista negra!", "OK", {
                duration: 4000,
              });
              return;
            },
            (err) => {
              this.loader.close();
              this.alertService.confirm({
                message: "Error al eliminar el chofer de la lista negra",
              });
            }
          );
        }
      });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filtro = event.target.value.toLowerCase();
    this.setPage({ offset: 0 });
  }

  updateFiltroActivo(event) {
    this.filtroActivo = event.checked;
    this.setPage({ offset: 0 });
  }

  openPopUpAgregarChofer() {
    const title = "Agregar Chofer a Lista Negra";
    const dialogRef: MatDialogRef<any> = this.dialog.open(
      AgregarChoferRucComponent,
      {
        width: "600px",
        disableClose: true,
        data: { title: title }
      }
    );

    dialogRef.afterClosed().subscribe((choferData) => {
      if (!choferData) {
        // Si el usuario cancela
        return;
      }

      // Si se encontró un chofer, abrir el modal de agregar a lista negra
      const addTitle = "Agregar a la lista Negra";
      const addDialogRef: MatDialogRef<any> = this.dialog.open(
        AddListaNegraComponent,
        {
          width: "640px",
          disableClose: true,
          data: { 
            title: addTitle, 
            payload: choferData 
          }
        }
      );

      addDialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          // Si el usuario cancela
          return;
        }

        this.loader.open();
        this.centro.postChoferListaNegra(res).subscribe(
          (data) => {
            this.loader.close();
            if (data.success) {
              this.setPage({ offset: 0 });
              this.snack.open("¡Chofer agregado a la lista negra con éxito!", "OK", {
                duration: 4000,
              });
            } else {
              this.errorService.confirm({
                message: "Error: " + data.data + "!",
              });
            }
          },
          (err) => {
            this.loader.close();
            this.errorService.confirm({
              message: "Error al agregar el chofer a la lista negra: " + err,
            });
          }
        );
      });
    });
  }
}
