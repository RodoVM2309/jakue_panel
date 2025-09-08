import { Observable } from 'rxjs';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

import { AppAtencionComponent } from './app-atencion.component';

export interface alertData {
  title?: string,
  message?: string,
  tipo?: string,
  icono?:string,
  label_button?: string,
  class?: boolean
}

@Injectable()
export class AppAtencionService {
  constructor(private dialog: MatDialog) { }

  public confirm(data: alertData = {}): Observable<boolean> {
    data.title = data.title || '';
    data.message = data.message || 'Alerta';
    data.label_button = data.label_button || 'OK';
    data.class = data.class || false;
    let dialogRef: MatDialogRef<AppAtencionComponent>;
    dialogRef = this.dialog.open(AppAtencionComponent, {
      width: '710px',
      disableClose: true,
      data: data
    });
    return dialogRef.afterClosed();
  }
}
