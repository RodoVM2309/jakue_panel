import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";
import { MatInput, MatDatepicker, } from '@angular/material';
import { SatDatepicker } from 'saturn-datepicker';
import { AppDateAdapter, APP_DATE_FORMATS }from "@shared/helpers/date.adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule } from 'saturn-datepicker';
//import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
// hay que instalar @angular/material-moment-adapter para angular 6.

@Component({
  selector: 'app-muvin-datepicker',
  templateUrl: './muvin-datepicker.component.html',
  styleUrls: ['./muvin-datepicker.component.scss'],
  providers: [
    /*  {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
         {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}, */
  ]
})
export class MuvinDatepickerComponent implements OnInit {
  @ViewChild('picker') dateInput: SatDatepicker<any>;
  @Output() emitRange: EventEmitter<any> = new EventEmitter<any>();
  delay;

  constructor() { }

  ngOnInit() {
    this.dateInput._selectRange({ begin: new Date(), end: new Date() })
  }

  emitDates() {
    const start = this.dateInput.beginDate;
    const end = this.dateInput.endDate;
    const daterange = { 'start': start, 'end': end };

    this.emitRange.emit(daterange);

  }

}
