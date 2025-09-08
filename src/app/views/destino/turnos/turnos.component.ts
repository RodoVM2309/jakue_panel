import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss']
})
export class TurnosComponent implements OnInit {
  selectedTab = 0;  
  constructor() { }

  ngOnInit() {
    //this.selectTab(0);
  }

  selectTab(event) {
    this.selectedTab = event;
  }

}
