import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';

import { NomencladoresService } from '../../../../services/nomencladores.service';
import { MotivoCaladaRechazada } from '../../../../models/motivoCaladaRechazada';


@Component({
  selector: 'app-add-rechazo-calada',
  templateUrl: './add-rechazo-calada.component.html',
  styleUrls: ['./add-rechazo-calada.component.scss']
})
export class AddRechazoCaladaComponent implements OnInit {
  public itemForm: FormGroup;
  public motivoCaladaRechazada: MotivoCaladaRechazada[];
  public getItemSub: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddRechazoCaladaComponent>,
    private fb: FormBuilder, private nomecladoresServices: NomencladoresService) { }


  ngOnInit() {
    this.getItems();
    this.buildItemForm(this.data.payload);
  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id_viaje: [item.id_viaje || ''],
      id_motivo: ['']
    });
  }

  getItems() {
    this.getMotivoCaladaRechazada();
  }

  getMotivoCaladaRechazada() {
    this.getItemSub = this.nomecladoresServices.getAllMotivoCaladaRechazada()
      .subscribe(data => {
        this.motivoCaladaRechazada = data.data;
      });
  }

  submit() {
    this.dialogRef.close(this.itemForm.value);
  }


}
