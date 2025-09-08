import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss']
})
export class GestionComponent implements OnInit {

  selectedTab = 0;

  constructor() { }

  ngOnInit() {
  }

  selectTab(event) {
    this.selectedTab = event;
   // console.log(event);

  }

}
