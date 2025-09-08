import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comercial',
  templateUrl: './comercial.component.html',
  styleUrls: ['./comercial.component.scss']
})
export class ComercialComponent implements OnInit {

  selectedTab = 0;

  constructor() { }

  ngOnInit() {
  }

  selectTab(event) {
    this.selectedTab = event;
  }

}
