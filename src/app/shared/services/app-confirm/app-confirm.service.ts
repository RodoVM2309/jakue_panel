import { Observable } from 'rxjs';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

import { AppComfirmComponent } from './app-confirm.component';

interface confirmData {
  title?: string,
  message?: string
}

@Injectable()
export class AppConfirmService {

  constructor(private dialog: MatDialog) { }

  public confirm(data: confirmData = {}): Observable<boolean> {
    data.title = data.title || '';
    data.message = data.message || 'Ud. está seguro?';
    let dialogRef: MatDialogRef<AppComfirmComponent>;
    dialogRef = this.dialog.open(AppComfirmComponent, {
      width: '750px',
      disableClose: true,
      data: {title: data.title, message: data.message}
    });
    return dialogRef.afterClosed();
  }
}
