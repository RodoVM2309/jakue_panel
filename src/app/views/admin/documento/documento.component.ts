import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import { MatDialogRef, MatDialog, MatSnackBar } from "@angular/material";
import { AppConfirmService } from "../../../shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { Subscription } from "rxjs";
import { AppAlertService } from "../../../shared/services/app-alert/app-alert.service";
import { DocumentoService } from "./../../../shared/services/documento.service";
import { Documento } from "./../../../shared/models/documento";
import { AddDocumentoComponent } from "./add-documento/add-documento.component";
import { Page } from "../../../shared/models/page";
import { PagedData } from "../../../shared/models/paged-data";
import { SubirFicherosComponent } from "./subir-ficheros/subir-ficheros.component";
import { environment } from "environments/environment";

@Component({
  selector: "app-documento",
  templateUrl: "./documento.component.html",
  styleUrls: ["./documento.component.scss"]
})
export class DocumentoComponent implements OnInit {
  public documento: Documento[];
  page = new Page();
  ruta: any;
  public getItemSub: Subscription;


  constructor(
    private documentoService: DocumentoService,
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
    this.documentoService
      .getAllDocumento(this.page.pageNumber)
      .subscribe(pagedData => {
        this.documento = pagedData.data;
        this.ruta = environment.apiURL + "documento/pdf-down?id=";
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
      });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.documento.filter(function (d) {
      return d.descripcion.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.documento = temp;
    if (val === "") {
      this.setPage({ offset: 0 });
    }
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? "Agregar Documento" : "Modificar Documento";
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddDocumentoComponent, {
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
        this.documentoService.postDocumento(res).subscribe(
          data => {
            this.documento.unshift(data);
            this.setPage({ offset: 0 });
            if (this.loader !== null) {
              this.loader.close();
            }
            this.snack.open("Documento agregado!", "OK", { duration: 4000 });
            return;
          },
          err => {
            this.loader.close();
            this.alertService
              .confirm({ message: "Este Documento ya se encuentra ingresado" })
              .subscribe(res => {
                if (res) {
                  return;
                }
              });
          }
        );
      } else {
        this.documentoService.updateDocumento(res).subscribe(
          data => {
            this.documento = data;
            this.setPage({ offset: 0 });
            if (this.loader !== null) {
              this.loader.close();
            }
            this.snack.open("Documento modificada!", "OK", { duration: 4000 });
            return;
          },
          err => {
            this.loader.close();
            this.alertService
              .confirm({ message: "Este Documento no se puede modificar" })
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
      .confirm({ message: "¿Está seguro de eliminar este Documento?" })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.documentoService.deleteDocumento(row.id).subscribe(
            data => {
              this.loader.close();
              this.documento = data;
              this.setPage({ offset: 0 });
              this.snack.open("Documento eliminado!", "OK", { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService
                .confirm({ message: "Esta Documento no se puede eliminar" })
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
    let title = "Subir PDF de la Documentación";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      SubirFicherosComponent,
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
      this.documentoService.updateDocumento(res).subscribe(
        data => {
          this.documento = data;
          this.setPage({ offset: 0 });
          if (this.loader !== null) {
            this.loader.close();
          }
          this.snack.open("Documentación modificada!", "OK", {
            duration: 4000
          });
          return;
        },
        err => {
          this.loader.close();
          this.alertService
            .confirm({ message: "Esta Documentación no se puede modificar" })
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
