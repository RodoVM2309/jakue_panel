import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Test, MagypCadena } from 'app/shared/models/magyp-cadena';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MagypService } from 'app/shared/services/magyp.service';

@Component({
  selector: 'app-info-test',
  templateUrl: './info-test.component.html',
  styleUrls: ['./info-test.component.scss']
})
export class InfoTestComponent implements OnInit {
  local_data: any;
  testForm: FormGroup;
  encontradoTrans = true;
  cadenas: MagypCadena[] = [];
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Test,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InfoTestComponent>,
    private magypService: MagypService,
  ) {
    this.local_data = { ...data };
  }
  get f() { return this.testForm.controls; }
  ngOnInit() {
    this.getCadenas();
    this.testForm = this.fb.group(
      {
        id: [ this.local_data.transportista.id],
        cuit: [ this.local_data.transportista.cuit,],
        nombre: [ this.local_data.transportista.nombre_completo],
        patente: [ this.local_data.transportista.patente,],
        telefono: [ this.local_data.transportista.telefono, ],
        id_cadena: [ this.local_data.transportista.id_cadena],
        observaciones: [ this.local_data.transportista.observaciones]
      }
    );

  }
  getCadenas() {
    this.magypService.getCadenas()
      .subscribe(
        res => {
          this.cadenas = res.data;
        },
        error => {
        }
      );
  }

}
