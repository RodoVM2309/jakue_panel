import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import { MatDialogRef, MatDialog, MatSnackBar } from "@angular/material";
import { AppConfirmService } from "../../../shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { Subscription } from "rxjs";
import { AppAlertService } from "../../../shared/services/app-alert/app-alert.service";
import { PersonasService } from "./../../../shared/services/personas.service";
import { Person } from "./../../../shared/models/person";
import { AddPersonaComponent } from "./add-persona/add-persona.component";
import { RolesPersonaComponent } from "./roles-persona/roles-persona.component";
import { Page } from "../../../shared/models/page";
import { AppErrorService } from "../../../shared/services/app-error/app-error.service";
import { DesactivarRolComponent } from "./desactivar-rol/desactivar-rol.component";

@Component({
  selector: "app-personas",
  templateUrl: "./personas.component.html",
  styleUrls: ["./personas.component.scss"]
})
export class PersonasComponent implements OnInit, OnDestroy {
  public personas: Person[];
  page = new Page();
  public getItemSub: Subscription;
  public filtro;
  public filtro_cuit;
  constructor(
    private personasService: PersonasService,
    public router: Router,
    private dialog: MatDialog,
    private confirmService: AppConfirmService,
    private errorService: AppErrorService,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    //this.getItems();
    this.setPage({ offset: 0 });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filtro = event.target.value.toLowerCase();
    this.setPage({ offset: 0 });
  }
  updateFilter1(event) {
    const val = event.target.value.toLowerCase();
    this.filtro_cuit = event.target.value.toLowerCase();
    this.setPage({ offset: 0 });
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro == undefined) {
      this.filtro = "";
    }
    if (this.filtro_cuit == undefined) {
      this.filtro_cuit = "";
    }
    this.personasService
      .getAllPersonas(this.page.pageNumber, this.filtro, this.filtro_cuit)
      .subscribe(pagedData => {
        this.personas = pagedData.data;

        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
      });
  }
  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? "Agregar Persona" : "Modificar Persona";
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPersonaComponent, {
      width: "720px",
      height: '90vh',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.personas.unshift(data);
      this.setPage({ offset: 0 });

    });
  }
  openPopUpAsignarRol(data) {
    let dialogRef: MatDialogRef<any> = this.dialog.open(RolesPersonaComponent, {
      width: "420px",
      disableClose: true,
      data: { title: "Asignar Roles a: " + data.razon_social, payload: data }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      for (let i = 0; i < res.length; i++) {
        if (res[i].operacion === "post") {
          this.personasService.postRolPersona(res[i]).subscribe(data => {
            if (data.data.id_rol === 2) {
              this.personasService
                .getPersonaById(data.data.id_usuario)
                .subscribe(data => {
                  let message =
                    "Hola! Te invitamos a Jakue, la comunidad logistica de la Agroindustria. Descargala y accede a los beneficios! http://bit.ly/2PpG6jM";
                  let numbers = parseInt(data.data.telefono);
                  let contenido = { message: message, number: numbers };
                  return;

                });
            }
            return;
          });
        } else {
          this.personasService.deleteRolPersona(res[i].id).subscribe(data => {
            return;
          });
        }
      }

    });
  }
  openPopUpDesactivarRol(data) {
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      DesactivarRolComponent,
      {
        width: "640px",
        height: "380px",
        disableClose: true,
        data: { title: data.razon_social, payload: data }
      }
    );

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      for (let i = 0; i < res.length; i++) {

        this.personasService.putRolPersona(res[i]).subscribe(
          data => {
          },
          err => {
            this.loader.close();
            this.errorService
              .confirm({
                message: "No se pudieron desactivar/activar los roles"
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

  deleteItem(row) {
    this.confirmService
      .confirm({
        message: "Está seguro de eliminar la persona: " + row.nombre + "?"
      })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.personasService.deletePersona(row.id).subscribe(
            data => {
              this.loader.close();
              this.personas = data;
              this.setPage({ offset: 0 });
              this.alertService
                .confirm({ message: "Persona Eliminada!", tipo: "exito" })
                .subscribe(res => {
                  if (res) {
                    return;
                  }
                });
            },
            err => {
              this.loader.close();
              this.errorService
                .confirm({ message: "Esta Persona no se puede eliminar" })
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
