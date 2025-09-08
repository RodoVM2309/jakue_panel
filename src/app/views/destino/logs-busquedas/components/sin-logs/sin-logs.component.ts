import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sin-logs',
  templateUrl: './sin-logs.component.html',
  styleUrls: ['./sin-logs.component.scss']
})
export class SinLogsComponent implements OnInit {

  @Input() showTable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
