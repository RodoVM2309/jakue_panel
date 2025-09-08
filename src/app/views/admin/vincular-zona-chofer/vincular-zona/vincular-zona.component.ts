import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CentrosService } from './../../../../shared/services/centros.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';

export class Zona {
  id: number;
  descripcion: string;
  id_centro: number;
  nombre_centro: string;
}

@Component({
  selector: 'app-vincular-zona',
  templateUrl: './vincular-zona.component.html',
  styleUrls: ['./vincular-zona.component.scss']
})
export class VincularZonaComponent implements OnInit {
  public itemForm: FormGroup;
  zonas: Zona[];
  zonaasignada = 0;
  idchofer: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VincularZonaComponent>,
    private fb: FormBuilder,
    private centrosService: CentrosService,
    private loader: AppLoaderService,
    private snack: MatSnackBar) { }

  ngOnInit() {
    this.idchofer = this.data.payload.id;
    this.getZonasCentro();
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id_chofer: [item.id || ''],
      id_zona: [item.id_zona || '', Validators.required],
      id: [item.id_zona || '']
    });
  }

  submit() {
    if (this.zonaasignada !== this.itemForm.controls['id_zona'].value) {
      this.dialogRef.close(this.itemForm.value);
    } else {
      this.dialogRef.close();
    }
  }

  getZonasCentro() {
    this.loader.open();
    this.centrosService.getZonasCentro()
      .subscribe(data => {
        this.zonas = data.data;
        this.loader.close();
      });
  }

}
