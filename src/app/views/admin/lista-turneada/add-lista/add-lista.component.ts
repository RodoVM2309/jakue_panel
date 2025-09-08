import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { AppAtencionService } from 'app/shared/services/app-atencion/app-atencion.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { CentrosService } from 'app/shared/services/centros.service';

@Component({
  selector: 'app-add-lista',
  templateUrl: './add-lista.component.html',
  styleUrls: ['./add-lista.component.scss']
})
export class AddListaComponent implements OnInit {
  public itemFormLista: FormGroup;
  public isNueva: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddListaComponent>,
    private fb: FormBuilder,
    private errorService: AppErrorService,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    private centrosService: CentrosService
  ) { }

  ngOnInit() {
    this.isNueva = this.data.isNew;
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    let id = item.id !== undefined ? item.id : "";
    let nombre = item.nombre !== undefined ? item.nombre : "";
    let id_tipo_turneada = item.id_tipo_turneada;
    let dataform = {
      id: [id],
      nombre: [nombre, Validators.required],
      id_tipo_turneada: [id_tipo_turneada]
    };
    this.itemFormLista = this.fb.group(dataform);
  }

  submit() {
    this.loader.open();
    let datafrm = this.itemFormLista.value;
    if (this.isNueva) {
      let dataPost = {
        nombre: datafrm.nombre,
        id_tipo_turneada: datafrm.id_tipo_turneada
      }
      this.centrosService.postListaCentro(dataPost).subscribe(
        data => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.alertService
            .confirm({ message: "Lista Agregada!", tipo: "exito" })
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
            .confirm({ message: "Esta Lista no se puede agregar" })
            .subscribe(res => {
              if (res) {
              }
            });
        }
      );
    } else {
      let dataUpdate = {
        id: datafrm.id,
        nombre: datafrm.nombre
      }
      this.centrosService.updateListaCentro(dataUpdate).subscribe(
        data => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.alertService
            .confirm({ message: "Lista Modificada!", tipo: "exito" })
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
            .confirm({ message: "Esta Lista no se puede modificar" })
            .subscribe(res => {
              if (res) {
              }
            });
        }
      );
    }
  }

}
