import { HttpClient, HttpEventType } from "@angular/common/http";
import { Observable } from 'rxjs';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

import { AppAlertComponent } from './app-alert.component';

interface alertData {
  title?: string,
  message?: string,
  tipo?: string,
  icono?: string,
  class?: string,
}

@Injectable()
export class AppAlertService {

  constructor(private dialog: MatDialog) { }

  public confirm(data:alertData = {}): Observable<boolean> {
    data.title = data.title || 'Alerta';
    data.message = data.message || 'Alerta';
    let dialogRef: MatDialogRef<AppAlertComponent>;
    dialogRef = this.dialog.open(AppAlertComponent, {
      width: '380px',
      disableClose: true,
      data: {title: data.title, message: data.message}
    });
    return dialogRef.afterClosed();
  }
}
