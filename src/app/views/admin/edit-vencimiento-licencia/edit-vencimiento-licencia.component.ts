import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { FormBuilder,  FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';

@Component({
  selector: 'app-edit-vencimiento-licencia',
  templateUrl: './edit-vencimiento-licencia.component.html',
  styleUrls: ['./edit-vencimiento-licencia.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'es-ES'
    }
  ]
})
export class EditVencimientoLicenciaComponent implements OnInit {
  public itemForm: FormGroup;
  public getItemSub: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<EditVencimientoLicenciaComponent>,
  private fb: FormBuilder) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload);
    this.getItems();
  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      vencimiento_licencia: [item.vencimiento_licencia || '']
    });
  }

  getItems() {
  }
  submit() {
    this.dialogRef.close(this.itemForm.value);
  }

}
