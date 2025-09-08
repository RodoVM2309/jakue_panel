import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { NomencladoresService } from '../../../../shared/services/nomencladores.service';
import { AcopladosService } from '../../../../shared/services/acoplados.service';
import { MarcaAcoplado } from './../../../../shared/models/marca-acoplado';
import { TipoAcoplado } from './../../../../shared/models/tipo-acoplado';
import { UniquePatenteAcopladoValidator } from '../../../../shared/directives/unique-patente-acoplado.directive';
import { CustomValidator } from '../../../../shared/validation/customValidator';

export class Peligrosa {
  carga_peligrosa: number;
  desc_carga_peligrosa: string;
}

@Component({
  selector: 'app-add-acoplado',
  templateUrl: './add-acoplado.component.html',
  styleUrls: ['./add-acoplado.component.scss']
})
export class AddAcopladoComponent implements OnInit {
  public itemForm: FormGroup;
  cargaPeligrosa: Peligrosa[] = [];
  ini: Peligrosa;
  marcaAcoplados: MarcaAcoplado[];
  tipoAcoplados: TipoAcoplado[];
  isNew;
  public getItemSub: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddAcopladoComponent>,
    private fb: FormBuilder,
    private nomencladoresService: NomencladoresService,
    private acopladoService: AcopladosService) { }

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
    };
    this.cargaPeligrosa.push(this.ini);
    this.ini = {
      carga_peligrosa: 1,
      desc_carga_peligrosa: 'SI'
    };
    this.cargaPeligrosa.push(this.ini);
  }
  getItems() {
    this.getItemSub = this.nomencladoresService.getAllMarcaAcopladosSelect()
      .subscribe(data => {
        this.marcaAcoplados = data.data.marcaAcoplado;
      });
    this.getItemSub = this.nomencladoresService.getAllTipoAcopladosSelect()
      .subscribe(data => {
        this.tipoAcoplados = data.data.tipoAcoplado;
      });
  }


  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
     // id_transporte: [id_transporte],
      id_marca_acoplado: [item.id_marca_acoplado || '', Validators.required],
      id_tipo_acoplado: [item.id_tipo_acoplado || '', Validators.required],
      anno: [item.anno || '', [Validators.required, CustomValidator.yearValidator]],
      patente: [item.patente || '', [Validators.required, Validators.pattern('^([a-zA-Z]{3}[0-9]{3}|[a-zA-Z]{2}[0-9]{3}[a-zA-Z]{2})$')], (this.isNew ? UniquePatenteAcopladoValidator(this.acopladoService) : null)],
      carga_peligrosa: [item.carga_peligrosa || '', Validators.required],
    });

  }

  submit() {
    const datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }


}
