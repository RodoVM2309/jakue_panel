import {
  Component,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-caratulas',
  templateUrl: './caratulas.component.html',
  styleUrls: ['./caratulas.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})
export class CaratulasComponent implements OnInit {

  selectedTab = 0;
  constructor(
    private route: ActivatedRoute,public router: Router,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['opcion']) {
        this.buscar(params['opcion'])
      } else {
        this.selectedTab = 0;
      }
    });
  }
  buscar(opcion) {
    switch (opcion) {
      case 'dashboard':
        this.selectedTab = 0;
        break;

      default:
        this.selectedTab = 0;
        break;
    }

  }
  selectTab(event) {
    switch (event) {
      case 0:
        this.router.navigateByUrl('magyp/gestion/dashboard');
        break;

      default:
        break;
    }
  }

}
