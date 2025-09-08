import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';

import { UserService } from './../../../shared/services/user.service';
import { Roles } from './../../../shared/models/roles';
import { AddRolComponent } from './add-rol/add-rol.component';

import { Page } from '../../../shared/models/page';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit, OnDestroy {
  public roles: Roles[];
  page = new Page();
  public getItemSub: Subscription;
  constructor(private userService: UserService,
    public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private alertService: AppAlertService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    //this.getItems();
    this.setPage({ offset: 0 });
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    this.userService.getAllRoles(this.page.pageNumber).subscribe(pagedData => {
      this.roles = pagedData.data;

      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;

    });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.roles.filter(function (d) {
      return d.description.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.roles = temp;
    if (val === '') {
      this.setPage({ offset: 0 });
    }
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar nuevo Rol' : 'Modificar Rol';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddRolComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {
          this.userService.postRol(res)
            .subscribe(data => {
              this.roles.unshift(data);
              this.setPage({ offset: 0 });
              this.loader.close();
              this.snack.open('Rol agregado!', 'OK', { duration: 4000 })
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Este Rol ya se encuentra ingresado' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        } else {
          this.userService.updateRol(res)
            .subscribe(data => {
              this.roles = data;
              this.setPage({ offset: 0 });
              this.loader.close();
              this.snack.open('Rol modificado!', 'OK', { duration: 4000 })
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Este Rol no se puede modificar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      })
  }
  deleteItem(row) {
    this.confirmService.confirm({ message: `Está seguro de eliminar el Rol: ${row.name}?` })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.userService.deleteRol(row.id)
            .subscribe(data => {
              this.loader.close();
              this.roles = data;
              this.setPage({ offset: 0 });              
              this.snack.open('Rol eliminado!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Este Rol no se puede eliminar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      })
  }

}
