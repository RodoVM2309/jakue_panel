import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Cabecera } from 'app/shared/models/cabecera';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { CcppService } from 'app/shared/services/ccpp.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-copia-cabecera',
  templateUrl: './copia-cabecera.component.html',
  styleUrls: ['./copia-cabecera.component.scss']
})
export class CopiaCabeceraComponent implements OnInit, OnDestroy {
  copiaCabeceraForm: FormGroup;
  public searchControl: FormControl;
  public getItemSub: Subscription;
  cabecera: Cabecera;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CopiaCabeceraComponent>,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    private ccppService: CcppService,
    private errorService: AppErrorService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.cabecera = this.data.payload;
    this.copiaCabeceraForm = new FormGroup({
      titulo: new FormControl('Copia - ' + this.cabecera.titulo, [Validators.required, Validators.maxLength(70)]),
    })
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  submit() {
    this.cabecera.titulo = this.copiaCabeceraForm.controls['titulo'].value;
    this.loader.open('Agregando nueva cabecera...');
    this.getItemSub = this.ccppService.postCabecera(this.cabecera)
      .subscribe(resp => {
        if (this.loader !== null) {
          this.loader.close();
        }
        this.alertService.confirm({ message: '¡Cabecera agregada correctamente!', tipo: 'exito' }).subscribe(res1 => {
          if (res1) {
            this.dialogRef.close(1);
            return;
          }
        });
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'Errores' })
            .subscribe(res1 => {
              if (res1) {
              }
            });
        })
  }

}
