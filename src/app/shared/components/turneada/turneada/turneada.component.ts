import { Component, OnInit, AfterViewInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewChecked, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-turneada',
  templateUrl: './turneada.component.html',
  styleUrls: ['./turneada.component.scss']
})
export class TurneadaComponent implements OnInit {
  veConfirmarArribo: boolean = false;
  veControlMensual: boolean = false;
  tabGroup1: any;
  selectedTab = 0;
  constructor(private route: ActivatedRoute,
    public router: Router, ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'])
        this.selectTab(parseInt(params['id']));
    });
    ///this.selectedTab=this.route.snapshot.params["id"]!=undefined? parseInt(this.route.snapshot.params["id"]):0;
    this.veControlMensual = localStorage.getItem('tipo_turneada') == '1' ? true : false;
    this.veConfirmarArribo = localStorage.getItem('tipo_turneada') == '2' ? true : false;
  }
  /* ngAfterViewInit() {
    this.selectedTab = this.route.snapshot.params["id"] != undefined ? parseInt(this.route.snapshot.params["id"]) : 0;
  } */

  selectTab(event) {    
    this.selectedTab = event;
  }
  chanceTab(event) {
    this.selectedTab = event;
  }
  gotoEstadoChoferes() {
    this.router.navigateByUrl('/turneada/turneada/0');
  }
  gotoListaTurneado() {
    this.router.navigateByUrl('/turneada/turneada/1');
  }
  gotoConfirmarArribo() {
    this.router.navigateByUrl('/turneada/turneada/2');
  }
  gotoControMensual() {
    this.router.navigateByUrl('/turneada/turneada/2');
  }

}
