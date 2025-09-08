import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

import { MatDialogRef, MatDialog, MatSnackBar } from "@angular/material";
import { AppConfirmService } from "../../../shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { Subscription } from "rxjs";
import { AppAlertService } from "../../../shared/services/app-alert/app-alert.service";
import { EstandarService } from "./../../../shared/services/estandar.service";
import { Documento } from "./../../../shared/models/documento";
import { AddEstandarComponent } from "./add-estandar/add-estandar.component";
import { Page } from "../../../shared/models/page";
import { SubirEstandarComponent } from "./subir-estandar/subir-estandar.component";
import { environment } from "environments/environment.prod";
@Component({
  selector: "app-estandar",
  templateUrl: "./estandar.component.html",
  styleUrls: ["./estandar.component.scss"]
})
export class EstandarComponent implements OnInit {
  public estandar: Documento[];
  page = new Page();
  ruta: any;
  public getItemSub: Subscription;
  constructor(
    private estandarService: EstandarService,
    public router: Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private alertService: AppAlertService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    //this.getItems();
    this.setPage({ offset: 0 });
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    this.estandarService
      .getAllEstandar(this.page.pageNumber)
      .subscribe(pagedData => {
        this.estandar = pagedData.data;
        this.ruta = environment.apiURL + "estandar/pdf-down?id=";
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
      });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.estandar.filter(function(d) {
      return d.descripcion.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.estandar = temp;
    if (val === "") {
      this.setPage({ offset: 0 });
    }
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? "Agregar Estándar" : "Modificar Estándar";
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddEstandarComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.loader.open();
      if (isNew) {
        this.estandarService.postEstandar(res).subscribe(
          data => {
            this.estandar.unshift(data);
            this.setPage({ offset: 0 });
            if (this.loader !== null) {
              this.loader.close();
            }
            this.snack.open("Estandár agregado!", "OK", { duration: 4000 });
            return;
          },
          err => {
            this.loader.close();
            this.alertService
              .confirm({ message: "Este Estandár ya se encuentra ingresado" })
              .subscribe(res => {
                if (res) {
                  return;
                }
              });
          }
        );
      } else {
        this.estandarService.updateEstandar(res).subscribe(
          data => {
            this.estandar = data;
            this.setPage({ offset: 0 });
            if (this.loader !== null) {
              this.loader.close();
            }
            this.snack.open("Estándar modificado!", "OK", { duration: 4000 });
            return;
          },
          err => {
            this.loader.close();
            this.alertService
              .confirm({ message: "Este Estándar no se puede modificar" })
              .subscribe(res => {
                if (res) {
                  return;
                }
              });
          }
        );
      }
    });
  }

  deleteItem(row) {
    this.confirmService
      .confirm({ message: "¿Está seguro de eliminar este Estándar?" })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.estandarService.deleteEstandar(row.id).subscribe(
            data => {
              this.loader.close();
              this.estandar = data;
              this.setPage({ offset: 0 });              
              this.snack.open("Estándar eliminado!", "OK", { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService
                .confirm({ message: "Este Estándar no se puede eliminar" })
                .subscribe(res => {
                  if (res) {
                    return;
                  }
                });
            }
          );
        }
      });
  }
  subir(data) {
    let title = "Subir Estándar de Comercialización";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      SubirEstandarComponent,
      {
        width: "720px",
        disableClose: true,
        data: { title: title, payload: data }
      }
    );
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.estandarService.updateEstandar(res).subscribe(
        data => {
          this.estandar = data;
          this.setPage({ offset: 0 });
          if (this.loader !== null) {
            this.loader.close();
          }
          this.snack.open("Estándar modificada!", "OK", { duration: 4000 });
          return;
        },
        err => {
          this.loader.close();
          this.alertService
            .confirm({ message: "Este Estándar no se puede modificar" })
            .subscribe(res => {
              if (res) {
                return;
              }
            });
        }
      );
    });
  }
}
