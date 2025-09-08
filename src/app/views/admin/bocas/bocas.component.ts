import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

import { MatDialogRef, MatDialog, MatSnackBar } from "@angular/material";
import { AppConfirmService } from "../../../shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { Subscription } from "rxjs";
import { AppAlertService } from "../../../shared/services/app-alert/app-alert.service";
import { BocaService } from "./../../../shared/services/boca.service";
import { Boca } from "./../../../shared/models/boca";
import { AddBocasComponent } from "./add-bocas/add-bocas.component";
import { Page } from "../../../shared/models/page";

@Component({
  selector: "app-bocas",
  templateUrl: "./bocas.component.html",
  styleUrls: ["./bocas.component.scss"]
})
export class BocasComponent implements OnInit {
  public boca: Boca[];
  page = new Page();
  public getItemSub: Subscription;
  constructor(
    private bocaService: BocaService,
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
    this.bocaService.getAllBoca(this.page.pageNumber).subscribe(pagedData => {
      this.boca = pagedData.data;

      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;
    });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.boca.filter(function(d) {
      return d.razon_social.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.boca = temp;
    if (val === "") {
      this.setPage({ offset: 0 });
    }
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? "Agregar estación" : "Modificar estación";
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddBocasComponent, {
      width: "820px",
      height: "90vh",
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
        this.bocaService.postBoca(res).subscribe(
          data => {
            this.boca.unshift(data);
            this.setPage({ offset: 0 });
            if (this.loader !== null) {
              this.loader.close();
            }
            this.snack.open("Estación agregada!", "OK", { duration: 4000 });
            return;
          },
          err => {
            this.loader.close();
            this.alertService
              .confirm({
                message: "Esta Estación ya se encuentra ingresada"
              })
              .subscribe(res => {
                if (res) {
                  return;
                }
              });
          }
        );
      } else {
        this.bocaService.updateBoca(res).subscribe(
          data => {
            this.boca = data;
            this.setPage({ offset: 0 });
            if (this.loader !== null) {
              this.loader.close();
            }
            this.snack.open("Estación modificada!", "OK", {
              duration: 4000
            });
            return;
          },
          err => {
            this.loader.close();
            this.alertService
              .confirm({ message: "Esta Estación no se puede modificar" })
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
      .confirm({ message: "¿Está seguro de eliminar esta Estación?" })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.bocaService.deleteBoca(row.id).subscribe(
            data => {
              this.loader.close();
              this.boca = data;
              this.setPage({ offset: 0 });              
              this.snack.open("Estación eliminada!", "OK", { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService
                .confirm({
                  message: "Esta Estación no se puede eliminar"
                })
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
}
