import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { CentrosService } from 'app/shared/services/centros.service';

@Component({
  selector: 'app-add-motivo',
  templateUrl: './add-motivo.component.html',
  styleUrls: ['./add-motivo.component.scss']
})
export class AddMotivoComponent implements OnInit {
  public itemFormMotivo: FormGroup;
  public isNuevo: boolean = false;
  public data2 = [
    { id: 0, descripcion: 'NO' },
    { id: 1, descripcion: 'SI' }
  ];
  tipo_turneada: number = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddMotivoComponent>,
    private fb: FormBuilder,
    private errorService: AppErrorService,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    private centrosService: CentrosService
  ) { }

  ngOnInit() {
    this.isNuevo = this.data.isNew;
    this.buildItemForm(this.data.payload);
    this.tipo_turneada= this.data.tipoTurneada;
  }

  buildItemForm(item) {
    let id = item.id !== undefined ? item.id : "";
    let descripcion = item.descripcion !== undefined ? item.descripcion : "";
    let afecta_lugar = item.afecta_lugar !== undefined ? item.afecta_lugar : 0;
    let dataform = {
      id: [id],
      descripcion: [descripcion, Validators.required],
      afecta_lugar: [afecta_lugar]
    };
    this.itemFormMotivo = this.fb.group(dataform);
  }

  submit() {
    let datafrm = this.itemFormMotivo.value;
    if (this.isNuevo) {
      let dataPost = {
        descripcion: datafrm.descripcion,
        afecta_lugar: datafrm.afecta_lugar
      }
      this.centrosService.postMotivoRechazo(dataPost).subscribe(
        data => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.alertService
            .confirm({ message: "Motivo Agregado!", tipo: "exito" })
            .subscribe(res => {
              if (res) {
                this.dialogRef.close(data);
              }
            });
        },
        err => {
        }
      );
    } else {
      let dataUpdate = {
        id: datafrm.id,
        descripcion: datafrm.descripcion,
        afecta_lugar: datafrm.afecta_lugar
      }
      this.centrosService.updateMotivoRechazo(dataUpdate).subscribe(
        data => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.alertService
            .confirm({ message: "Motivo Modificado!", tipo: "exito" })
            .subscribe(res => {
              if (res) {
                this.dialogRef.close(data);
              }
            });
        },
        err => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.errorService
            .confirm({ message: "Este Motivo no se puede modificar" })
            .subscribe(res => {
              if (res) {
              }
            });
        }
      );
    }
  }
}
