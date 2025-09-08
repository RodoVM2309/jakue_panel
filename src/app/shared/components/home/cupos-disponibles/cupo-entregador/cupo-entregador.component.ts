import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { CentrosService } from 'app/shared/services/centros.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Entregador } from 'app/views/admin/entregador/entregador.component';
import { VincularEntregadorComponent } from 'app/views/admin/vincular-centro-entregador/vincular-entregador/vincular-entregador.component';

@Component({
  selector: 'app-cupo-entregador',
  templateUrl: './cupo-entregador.component.html',
  styleUrls: ['./cupo-entregador.component.scss']
})
export class CupoEntregadorComponent implements OnInit {
  entregadorList: Entregador[] = [];
  listBlankEntregador=false;
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CupoEntregadorComponent>,
    private snack: MatSnackBar,
    private fb: FormBuilder,
    private dialog: MatDialog,private centrosService: CentrosService,private loader: AppLoaderService,
    private nomencladoresService: NomencladoresService, ) { }

  ngOnInit() {
    this.getEntregador();
    this.buildItemForm();
  }

  submit() {
    this.dialogRef.close(this.itemForm.value);
  }

  buildItemForm() {
    let dataform = {
      id_entregador: ['', Validators.required]
    };
    this.itemForm = this.fb.group(dataform);
  }

  getEntregador() {
    this.loader.open('Buscando Entregadores del Centro');
    this.nomencladoresService.getCentroEntregadorSelect()
      .subscribe(data => {
        this.loader.close();
        this.entregadorList = data.data;
        if (this.entregadorList.length === 0) {
          this.listBlankEntregador=true;

        }
      })
  }

  openPopAgregarEntregador() {
    let title = 'Agregar entregador';
    let dialogRef: MatDialogRef<any> = this.dialog.open(VincularEntregadorComponent, {
      width: '450px',
      disableClose: true,
      data: { title: title }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.centrosService.postCentroEntregador(res)
          .subscribe(data => {
            this.getEntregador();
            this.listBlankEntregador=false;
            if (this.loader !== null) {
              this.loader.close();
            }
            this.snack.open('entregador agregado al centro!', 'OK', { duration: 4000 });
            return;
          });
      });
  }

}
