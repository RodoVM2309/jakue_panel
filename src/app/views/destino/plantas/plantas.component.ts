import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plantas',
  templateUrl: './plantas.component.html',
  styleUrls: ['./plantas.component.scss']
})
export class PlantasComponent implements OnInit {
  selectedTab = 0;
  
  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
   // this.selectTab(0)
  }
  selectTab(event) {    
      this.selectedTab = event;   
  }

}
