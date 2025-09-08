import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transportadoras-tab',
  templateUrl: './transportadoras-tab.component.html',
  styleUrls: ['./transportadoras-tab.component.scss']
})
export class TransportadorasTabComponent implements OnInit {
  selectedTab = 0;
  constructor() { }

  ngOnInit() {
  }

  selectTab(event) {
    this.selectedTab = event;
  }

}
