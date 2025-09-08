import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import { MatDialogRef, MatDialog, MatSnackBar } from "@angular/material";
import { AppConfirmService } from "../../../shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { Subscription } from "rxjs";
import { OperadorChatService } from "./../../../shared/services/operador-chat.service";
import { OperadorClienteChat } from "./../../../shared/models/operador-chat";
import { AddOperadorClienteChatComponent } from "./add-operador-cliente-chat/add-operador-cliente-chat.component";
import { Page } from "../../../shared/models/page";

@Component({
  selector: "app-whatsapp-clientes",
  templateUrl: "./whatsapp-clientes.component.html",
  styleUrls: ["./whatsapp-clientes.component.scss"]
})
export class WhatsappClientesComponent implements OnInit {
  public operadorChat: OperadorClienteChat[];
  page = new Page();
  public getItemSub: Subscription;
  constructor(
    private operadorChatService: OperadorChatService,
    public router: Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
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
    //this.loader.open('Buscando datos...');
    this.page.pageNumber = pageInfo.offset + 1;
    this.operadorChatService.getAllOperadorChatClientes(this.page.pageNumber).subscribe(pagedData => {
      //this.loader.close();
      this.operadorChat = pagedData.data;
      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;
    });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.operadorChat.filter(function(d) {
      return d.nombre.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.operadorChat = temp;
    if (val === "") {
      this.setPage({ offset: 0 });
    }
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? "Agregar operador" : "Modificar operador";
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddOperadorClienteChatComponent, {
      width: '40vw',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
     
      if (isNew) { 
        this.loader.open();
        this.operadorChatService.postOperadorChatCliente(res).subscribe(
          data => {
            if (this.loader !== null) {
              this.loader.close();
            }
            this.operadorChat.unshift(data);
            this.setPage({ offset: 0 });
            
            this.snack.open("Operador agregado!", "OK", { duration: 4000 });
            return;
          },
          err => {
            this.loader.close();
            this.confirmService
              .confirm({
                message: "Este Operador ya se encuentra ingresado"
              })
              .subscribe(res => {
                if (res) {
                  return;
                }
              });
          }
        );
      } else {
        this.loader.open('Actualizando WhatsApp');
        this.operadorChatService.updateOperadorChatCliente(res).subscribe(
          data => {
            this.loader.close();
            this.operadorChat = data;
            this.setPage({ offset: 0 });            
            this.snack.open("Operador modificado!", "OK", {
              duration: 4000
            });
            return;
          },
          err => {
            this.loader.close();
            this.confirmService
              .confirm({ message: "Este Operador no se puede modificar" })
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
      .confirm({ message: "¿Está seguro de eliminar este Operador?" })
      .subscribe(res => {
        if (res) {
          this.loader.open('Eliminando WhatsApp');
          this.operadorChatService.deleteOperadorChat(row.id).subscribe(
            data => {
              this.loader.close();
              this.operadorChat = data;  
              this.snack.open("Operador eliminado!", "OK", { duration: 4000 });
              this.setPage({ offset: 0 });
              //return;
            },
            err => {
              this.loader.close();
              this.confirmService
                .confirm({
                  message: "Este Operador no se puede eliminar"
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
