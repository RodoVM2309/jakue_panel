import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CamionService} from '../../../../shared/services/camion.service';
import { AcopladosService} from '../../../../shared/services/acoplados.service';
import { Camion } from './../../../../shared/models/camion';
import { Acoplado } from './../../../../shared/models/acoplado';
@Component({
  selector: 'app-add-equipo',
  templateUrl: './add-equipo.component.html',
  styleUrls: ['./add-equipo.component.scss']
})
export class AddEquipoComponent implements OnInit {
  public itemForm: FormGroup;
  camiones:Camion[];
  acoplados: Acoplado[];
  public getItemSub: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddEquipoComponent>,
  private fb: FormBuilder,
  private camionService:CamionService, private acopladoService:AcopladosService) { }

  ngOnInit() {
    this.getItems();
    this.buildItemForm(this.data.payload);
    }
  getItems(){
    this.getItemSub = this.camionService.getCamionSinEquipo()
    .subscribe(data => {
      this.camiones = data.data;      
    });
    this.getItemSub = this.acopladoService.getAcopladoSinEquipo()
    .subscribe(data => {
      this.acoplados = data.data;      
    });
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      id_camion: [item.id_camion || '', Validators.required],
      id_acoplado: [item.id_acoplado || '']
    });
    
    }

  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }


}
