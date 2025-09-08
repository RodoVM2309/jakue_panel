import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { NomencladoresService } from '../../../../shared/services/nomencladores.service';
import { CamionService } from '../../../../shared/services/camion.service';
import { MarcaCamion } from './../../../../shared/models/marca-camion';
import { TipoCamion } from './../../../../shared/models/tipo-camion';
import { UniquePatenteCamionValidator } from '../../../../shared/directives/unique-patente-camion.directive';
import { CustomValidator } from '../../../../shared/validation/customValidator';

export class Peligrosa {
  carga_peligrosa: number;
  desc_carga_peligrosa: string;
}
@Component({
  selector: 'app-add-camion',
  templateUrl: './add-camion.component.html',
  styleUrls: ['./add-camion.component.scss']
})
export class AddCamionComponent implements OnInit {
  public itemForm: FormGroup;
  cargaPeligrosa: Peligrosa[] = [];
  ini: Peligrosa;
  marcaCamiones: MarcaCamion[];
  tipoCamion: TipoCamion[];
  isNew;
  public getItemSub: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddCamionComponent>,
    private fb: FormBuilder,
    private nomencladoresService: NomencladoresService,
    private camionService: CamionService) { }

  ngOnInit() {
    this.getItems();
    this.isNew = (this.data.isNew);
    this.buildItemForm(this.data.payload);
    this.initSelect();
  }
  initSelect() {
    this.ini = {
      carga_peligrosa: 0,
      desc_carga_peligrosa: 'NO'
    }
    this.cargaPeligrosa.push(this.ini);
    this.ini = {
      carga_peligrosa: 1,
      desc_carga_peligrosa: 'SI'
    }
    this.cargaPeligrosa.push(this.ini);
  }
  getItems() {
    this.getItemSub = this.nomencladoresService.getAllMarcaCamionesSelect()
      .subscribe(data => {
        this.marcaCamiones = data.data.marcaCamion;
      });
    this.getItemSub = this.nomencladoresService.getAllTipoCamionesSelect()
      .subscribe(data => {
        this.tipoCamion = data.data.tipoCamion;
      });
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      id_marca_camion: [item.id_marca_camion || '', Validators.required],
      id_tipo_camion: [item.id_tipo_camion || '', Validators.required],
      anno: [item.anno || '', [Validators.required, CustomValidator.yearValidator]],
      patente: [item.patente || '', [Validators.required, Validators.pattern('^([a-zA-Z]{3}[0-9]{3}|[a-zA-Z]{2}[0-9]{3}[a-zA-Z]{2})$')],(this.isNew ? UniquePatenteCamionValidator(this.camionService) : null)],
      carga_peligrosa: [item.carga_peligrosa || '', Validators.required],
    });
//4545
  }

  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }

}
