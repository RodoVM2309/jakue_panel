import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import { MatDialogRef, MatDialog, MatSnackBar } from "@angular/material";
import { AppConfirmService } from "../../../shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { Subscription } from "rxjs";
import { AppAlertService } from "../../../shared/services/app-alert/app-alert.service";
import { ParametroChatService } from "./../../../shared/services/parametro-chat.service";
import { ParametroChat } from "./../../../shared/models/parametro-chat";
import { AddParametroChatComponent } from "./add-parametro-chat/add-parametro-chat.component";
import { SubirImagenParametroComponent } from "./subir-imagen-parametro/subir-imagen-parametro.component";
import { Page } from "../../../shared/models/page";

@Component({
  selector: "app-parametro-chat",
  templateUrl: "./parametro-chat.component.html",
  styleUrls: ["./parametro-chat.component.scss"]
})
export class ParametroChatComponent implements OnInit {
  public parametroChat: ParametroChat[];
  page = new Page();
  public getItemSub: Subscription;
  constructor(
    private parametroChatService: ParametroChatService,
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
    this.parametroChatService.getAllParametroChat(this.page.pageNumber).subscribe(pagedData => {
      this.parametroChat = pagedData.data;

      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;
    });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.parametroChat.filter(function(d) {
      return d.descripcion.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.parametroChat = temp;
    if (val === "") {
      this.setPage({ offset: 0 });
    }
  }
  subirPopUp(data) {
    let title = 'Subir Imagen del parámetro';
    let dialogRef: MatDialogRef<any> = this.dialog.open(SubirImagenParametroComponent, {
      width: '50vw',
      height: '50vh',
      disableClose: true,
      data: { title: title, payload: data }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        } else {         
          this.setPage({ offset: 0 });
        }
      });
  }
  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? "Agregar parámetro" : "Modificar parámetro";
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddParametroChatComponent, {
      width: '40vw',
      height: '25vh',
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
        this.parametroChatService.postParametroChat(res).subscribe(
          data => {
            this.parametroChat.unshift(data);
            this.setPage({ offset: 0 });
            if (this.loader !== null) {
              this.loader.close();
            }
            this.snack.open("Parámetro agregada!", "OK", { duration: 4000 });
            return;
          },
          err => {
            this.loader.close();
            this.alertService
              .confirm({
                message: "Esta Parámetro ya se encuentra ingresada"
              })
              .subscribe(res => {
                if (res) {
                  return;
                }
              });
          }
        );
      } else {
        this.parametroChatService.updateParametroChat(res).subscribe(
          data => {
            this.parametroChat = data;
            this.setPage({ offset: 0 });
            if (this.loader !== null) {
              this.loader.close();
            }
            this.snack.open("Parámetro modificada!", "OK", {
              duration: 4000
            });
            return;
          },
          err => {
            this.loader.close();
            this.alertService
              .confirm({ message: "Esta Parámetro no se puede modificar" })
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
      .confirm({ message: "¿Está seguro de eliminar esta Parámetro?" })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.parametroChatService.deleteParametroChat(row.id).subscribe(
            data => {
              this.loader.close();
              this.parametroChat = data;
              this.setPage({ offset: 0 });             
              this.snack.open("Parámetro eliminada!", "OK", { duration: 4000 });
              return;
            },
            err => {
              this.loader.close();
              this.alertService
                .confirm({
                  message: "Esta Parámetro no se puede eliminar"
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
