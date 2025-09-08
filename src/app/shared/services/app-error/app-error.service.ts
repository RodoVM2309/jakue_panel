import { Observable } from 'rxjs';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

import { AppErrorComponent } from './app-error.component';

interface alertData {
  title?: string,
  message?: string,
  tipo?: string,
  textBoton?: string,
}

@Injectable()
export class AppErrorService {
  constructor(private dialog: MatDialog) { }

  public confirm(data: alertData = {}): Observable<boolean> {
    data.title = data.title || '';
    data.message = data.message || 'Error!';
    data.textBoton = data.textBoton || 'OK';
    let dialogRef: MatDialogRef<AppErrorComponent>;
    dialogRef = this.dialog.open(AppErrorComponent, {
      width: '380px',
      disableClose: true,
      data: {title: data.title, message: data.message, textBoton: data.textBoton }
    });
    return dialogRef.afterClosed();
  }
}
