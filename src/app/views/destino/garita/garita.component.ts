import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-garita',
  templateUrl: './garita.component.html',
  styleUrls: ['./garita.component.scss']
})
export class GaritaComponent implements OnInit {
  selectedTab = 0;
  constructor() { }

  ngOnInit() {
    //this.selectTab(0);
  }

  selectTab(event) {
    this.selectedTab = event;
  }

}
