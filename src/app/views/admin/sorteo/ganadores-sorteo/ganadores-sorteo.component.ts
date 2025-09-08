import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { GanadoresSorteo } from './../../../../shared/models/promocion.model';
import { Page } from '../../../../shared/models/page';
import { PromocionesService } from './../../../../shared/services/promociones.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { AddGanadoresSorteoComponent } from './add-ganadores-sorteo/add-ganadores-sorteo.component';

@Component({
  selector: 'app-ganadores-sorteo',
  templateUrl: './ganadores-sorteo.component.html',
  styleUrls: ['./ganadores-sorteo.component.scss']
})
export class GanadoresSorteoComponent implements OnInit {
  public itemForm: FormGroup;
  public documento: GanadoresSorteo[];
  page = new Page();
  id_sorteo = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private documentoService: PromocionesService,
    private loader: AppLoaderService,
    private dialog: MatDialog,
    private snack: MatSnackBar, private alertService: AppAlertService,
    public dialogRef: MatDialogRef<GanadoresSorteoComponent>,
    ) { }

  ngOnInit() {
    this.id_sorteo = this.data.payload.id;
    this.setPage({ offset: 0 });

  }
  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Sorteo' : 'Modificar Sorteo';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddGanadoresSorteoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew, id_sorteo: this.id_sorteo }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {
          this.documentoService.postGanadoresSorteo(res)
            .subscribe(data => {
              this.documento.unshift(data);
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Ganador del Sorteo agregado!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Este Ganador del Sorteo ya se encuentra ingresado' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        } else {
          this.documentoService.updateGanadoresSorteo(res)
            .subscribe(data => {
              this.documento = data;
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Ganador del Sorteo modificada!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Este Ganador del Sorteo no se puede modificar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }



  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    this.documentoService.getAllGanadoresSorteo(this.page.pageNumber, this.id_sorteo).subscribe(pagedData => {
      this.documento = pagedData.data;

      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;

    });
  }

}