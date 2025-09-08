import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,

} from "@angular/material";
import { CamionService } from 'app/shared/services/camion.service';
import { MarcaCamion } from 'app/shared/models/marca-camion';
import { TipoCamion } from 'app/shared/models/tipo-camion';
import { AcopladosService } from 'app/shared/services/acoplados.service';
import { MarcaAcoplado } from 'app/shared/models/marca-acoplado';
import { TipoAcoplado } from 'app/shared/models/tipo-acoplado';

import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { Subscription } from 'rxjs';
import { UniquePatenteCamionValidator } from 'app/shared/directives/unique-patente-camion.directive';
import { UniquePatenteAcopladoValidator } from 'app/shared/directives/unique-patente-acoplado.directive';
import { CustomValidator } from 'app/shared/validation/customValidator';
import { UserService } from 'app/shared/services/user.service';

export class Peligrosa {
  carga_peligrosa: number;
  desc_carga_peligrosa: string;
}
@Component({
  selector: 'app-camion-acoplado',
  templateUrl: './camion-acoplado.component.html',
  styleUrls: ['./camion-acoplado.component.scss']
})
export class CamionAcopladoComponent implements OnInit {
  camionFormGroup: FormGroup;
  acopladoFormGroup: FormGroup;
  cargaPeligrosa: Peligrosa[] = [];
  ini: Peligrosa;
  marcaCamiones: MarcaCamion[];
  tipoCamion: TipoCamion[];
  marcaAcoplados: MarcaAcoplado[];
  tipoAcoplados: TipoAcoplado[];
  isNew;
  noTieneAcoplado: boolean = false;
  patente_acoplado: any;
  patente: any;
  id_transporte: string = '';

  public getItemSub: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CamionAcopladoComponent>,
    private fb: FormBuilder,
    private nomencladoresService: NomencladoresService,
    private camionService: CamionService,
    private acopladoService: AcopladosService,
    private userService: UserService) { }

  ngOnInit() {
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
      .subscribe(data => this.id_transporte = data.data);
    this.getItems();
    this.isNew = true;
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
    this.getItemSub = this.nomencladoresService.getAllMarcaAcopladosSelect()
      .subscribe(data => {
        this.marcaAcoplados = data.data.marcaAcoplado;
      });
    this.getItemSub = this.nomencladoresService.getAllTipoAcopladosSelect()
      .subscribe(data => {
        this.tipoAcoplados = data.data.tipoAcoplado;
      });
  }
  validarPatente(patente) {
  }

  buildItemForm(item) {
    
    this.camionFormGroup = this.fb.group({
      id: [item.id || ''],
      id_transporte: [this.id_transporte],
      id_marca_camion: [item.id_marca_camion || '', Validators.required],
      id_tipo_camion: [item.id_tipo_camion || '', Validators.required],
      anno: [item.anno || '', [Validators.required, CustomValidator.yearValidator]],
      patente: [item.patente || '', Validators.required, (this.isNew ? UniquePatenteCamionValidator(this.camionService) : null)],
      carga_peligrosa: [item.carga_peligrosa || '', Validators.required],
    });
    this.acopladoFormGroup = this.fb.group({
      id: [item.id || ''],
      ckOperador: [this.noTieneAcoplado],
      id_transporte: [this.id_transporte],
      id_marca_acoplado: [item.id_marca_acoplado || '', (this.isNew && this.noTieneAcoplado ? Validators.required : null)],
      id_tipo_acoplado: [item.id_tipo_acoplado || '', (this.isNew && this.noTieneAcoplado ? Validators.required : null)],
      anno: [item.anno || '', (this.isNew && this.noTieneAcoplado ? [Validators.required, CustomValidator.yearValidator] : null)],
      patente: [item.patente || '', Validators.required, (this.isNew && this.noTieneAcoplado ? UniquePatenteAcopladoValidator(this.acopladoService) : null)],
      carga_peligrosa: [item.carga_peligrosa || '', (this.isNew && this.noTieneAcoplado ? Validators.required : null)],
    });

  }
  onChangeTieneAcoplado(event) {
    this.noTieneAcoplado = event.checked;    
    if (!this.noTieneAcoplado && this.isNew) {
      this.acopladoFormGroup = this.fb.group({
        id: [''],
        ckOperador: [this.noTieneAcoplado],
        id_transporte: [this.id_transporte],
        id_marca_acoplado: ['', Validators.required],
        id_tipo_acoplado: ['', Validators.required],
        anno: ['', [Validators.required, CustomValidator.yearValidator]],
        patente: ['', Validators.required, UniquePatenteAcopladoValidator(this.acopladoService)],
        carga_peligrosa: ['', Validators.required],
      });
    } else {
      this.acopladoFormGroup = this.fb.group({
        id: [''],
        ckOperador: [this.noTieneAcoplado],
        id_transporte: [this.id_transporte],
        id_marca_acoplado: [''],
        id_tipo_acoplado: [''],
        anno: [''],
        patente: [''],
        carga_peligrosa: [''],
      });

    }
  }
  submit() {
    var datafrm: any;
    var cam= {
      id_transporte: this.camionFormGroup.controls['id_transporte'].value,
      id_marca_camion: this.camionFormGroup.controls['id_marca_camion'].value,
      id_tipo_camion: this.camionFormGroup.controls['id_tipo_camion'].value,
      anno: this.camionFormGroup.controls['anno'].value.toString(),
      patente: this.camionFormGroup.controls['patente'].value,
      carga_peligrosa: this.camionFormGroup.controls['carga_peligrosa'].value,
    };

    if (!this.noTieneAcoplado && this.isNew) {
      datafrm = {
        camion: cam,
        acoplado: {
          id_marca_acoplado: this.acopladoFormGroup.controls['id_marca_acoplado'].value,
          id_tipo_acoplado: this.acopladoFormGroup.controls['id_tipo_acoplado'].value,
          anno: this.acopladoFormGroup.controls['anno'].value.toString(),
          patente: this.acopladoFormGroup.controls['patente'].value,
          carga_peligrosa: this.acopladoFormGroup.controls['carga_peligrosa'].value,
        }
      }
    } else {
      datafrm = {
        camion: cam
      }
    }
    this.dialogRef.close(datafrm);

  }

}
