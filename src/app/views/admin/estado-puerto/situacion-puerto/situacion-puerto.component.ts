import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DestinosService } from './../../../../shared/services/destinos.service';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { FormControl } from '@angular/forms';
import { UserService } from './../../../../shared/services/user.service';


export class SituacionPuerto {
  id: number;
  descripcion: string;
};

@Component({
  selector: 'app-situacion-puerto',
  templateUrl: './situacion-puerto.component.html',
  styleUrls: ['./situacion-puerto.component.scss']
})
export class SituacionPuertoComponent implements OnInit {
  public itemForm: FormGroup;
  toppings = new FormControl();
  situacionList: SituacionPuerto[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<SituacionPuertoComponent>,
  private fb: FormBuilder,
  private destinosService: DestinosService,
  private confirmService: AppConfirmService,
  private snack: MatSnackBar,
  private loader: AppLoaderService,
  private userService: UserService) { }

  ngOnInit() {
    this.getTipoSituacion();
    this.buildItemForm(this.data.payload);
  }

  submit() {
    this.dialogRef.close(this.itemForm.value);
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      id_situacion_puerto : [item.id_situacion_puerto || '', Validators.required],
      horas_atraso: [item.horas_atraso || '']
    });
  }

  getTipoSituacion() {
    this.loader.open();
    this.destinosService.getTipoSituacion()
      .subscribe(data => {
          this.situacionList = data.data;
        this.loader.close();
      });
  }

}
