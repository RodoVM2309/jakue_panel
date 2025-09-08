import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {  Subscription } from 'rxjs';

import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { NomencladoresService } from '../../../services/nomencladores.service';

@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.scss']
})
export class WhatsappComponent implements OnInit {
  mensaje = '';
  public getItemSub: Subscription;
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WhatsappComponent>,
    private fb: FormBuilder, ) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload);
  }
  buildItemForm(item) {
    let id = (item.id !== null) ? item.id : '';
    let telefono= (item.telefono !==null) ?item.telefono: '';
    let mensaje = (this.mensaje !== null) ? this.mensaje : '';

    this.itemForm = this.fb.group({
      id: [id,{disabled: true}],
      telefono:[telefono],
      mensaje: [mensaje, Validators.required]
    })
  }
  submit() {
    this.dialogRef.close(this.itemForm.value)
  }

}
