import { Component, OnInit, OnDestroy, Input, Output, EventEmitter,OnChanges,SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Page } from 'app/shared/models/page';
import { CcppService } from 'app/shared/services/ccpp.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { Inconsistencia } from 'app/shared/models/inconsistencia';
import { VerInconsistenciaComponent } from './ver-inconsistencia/ver-inconsistencia.component';
import { NotificarInconsistenciaComponent } from './notificar-inconsistencia/notificar-inconsistencia.component';

@Component({
  selector: 'app-inconsistencia',
  templateUrl: './inconsistencia.component.html',
  styleUrls: ['./inconsistencia.component.scss']
})
export class InconsistenciaComponent implements OnInit, OnDestroy {
  @Input() data;
  @Input() page;
  @Output() cambiarPage = new EventEmitter();

  public lista_inconsistencias: Inconsistencia[];
  public getItemSub: Subscription;
  //page = new Page();
  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Inconsistencias</span>
      </div>
    `
  };

  propChanges: any;


  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  /* ngOnChanges(changes: SimpleChanges) {
    this.propChanges = changes;
    this.lista_inconsistencias = changes.data.currentValue.data;
    console.log('Cambio el valor de entrada');
  } */

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.cambiarPage.emit({ page: this.page});
  }

  openPopUpVer(data: any = {}) {
    let title = 'Ver Cabecera';
    let dialogRef: MatDialogRef<any> = this.dialog.open(VerInconsistenciaComponent, {
      width: '90vw',
      height: '90vh',
      maxWidth: '90vw',
      disableClose: true,
      data: { title: title, payload: data }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        } else {
        }
      });
  }

  openPopUpNotificar(data: any = {}) {
    let title = 'Notificar';
    let dialogRef: MatDialogRef<any> = this.dialog.open(NotificarInconsistenciaComponent, {
      width: '60vw',
      height: '75vh',
      disableClose: true,
      data: { title: title, payload: data }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        } else {
        }
      });
  }


}
