import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';

import { NomencladoresService } from '../../../services/nomencladores.service';
import { HomeService } from '../home.service';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-extender-fecha',
  templateUrl: './extender-fecha.component.html',
  styleUrls: ['./extender-fecha.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'es-AR'
    }
  ]
})
export class ExtenderFechaComponent implements OnInit {
  cantReducir = 0;

  minDate: any;
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private homeService: HomeService,
   private nomecladoresService: NomencladoresService,
    public dialogRef: MatDialogRef<ExtenderFechaComponent>,
    private fb: FormBuilder, ) { }


  ngOnInit() {

    if(this.data.payload.fecha_hasta !== null){
      this.minDate = new Date (this.data.payload.fecha_hasta + ' 8:00:00');
    };
    this.itemForm = this.fb.group({
      id: [this.data.payload.id],
      fecha_hasta: [this.minDate, Validators.required],

    })

  }
  buildItemForm(item) {
    const fecha_hasta =(item.fecha_hasta !== null) ?  this.homeService.formatoFecha(item.fecha_hasta,"amd", "-") : '';


  }
  submit() {
    this.nomecladoresService.postFechaPedido(this.itemForm.value)
      .subscribe(data => {

      })
    this.dialogRef.close(this.itemForm.value)
  }

}
