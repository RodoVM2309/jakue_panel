import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
//import { MatSort, MatSortable, MatTableDataSource, MatTable} from '@angular/material';
//import {CdkTableModule} from '@angular/cdk/table';
//import {DataSource} from '@angular/cdk/collections';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';

import {UserService } from './../../../../shared/services/user.service';
import {User } from './../../../../shared/models/user';
import {AddUserComponent} from '../add-user/add-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  public users: any[];
  public getItemSub: Subscription;
  //dataSource = new MatTableDataSource<User>();

  displayedColumns: string[] = [ 'id', 'userName', 'firstName','lastName', 'email', 'phone' ]

  constructor(private userService: UserService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar,private confirmService: AppConfirmService,
    private loader: AppLoaderService) { }

  ngOnInit() {
    this.getItems();
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }
  }
  getItems() {
    this.getItemSub = this.userService.getAllUsers()
      .subscribe(data => {
        this.users = data;
      })
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Adicionar nuevo usuario' : 'Actualizar usuario';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddUserComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {
          this.userService.postRol(res)
            .subscribe(data => {
              this.users = data;
              this.loader.close();
              this.snack.open('Persona Agregada!', 'OK', { duration: 4000 })
            })
        } else {
          this.userService.update(res)
            .subscribe(data => {
              this.users = data;
              this.loader.close();
              this.snack.open('Persona Actualizada!', 'OK', { duration: 4000 })
            })
        }
      })
  }
  deleteItem(row) {
    this.confirmService.confirm({message: `Ud. está seguro de eliminar el usuario ${row.firstName} ${row.lastName}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.userService.delete(row.id)
            .subscribe(data => {
              this.users = data;
              this.loader.close();
              this.snack.open('Persona Eliminada!', 'OK', { duration: 4000 })
            })
        }
      })
  }

}
