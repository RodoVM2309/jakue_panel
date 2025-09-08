import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss']
})
export class GestionComponent implements OnInit {
  selectedTab = 0;

  constructor(private route: ActivatedRoute,public router: Router, ) { }

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
      case 'detalle':
        this.selectedTab = 1;
        break;
      case 'seguimiento':
        this.selectedTab = 2;
        break;
      case 'contacto':
        this.selectedTab = 3;
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
      case 1:
        this.router.navigateByUrl('magyp/gestion/detalle');
        break;
      case 2:
        this.router.navigateByUrl('magyp/gestion/seguimiento');
        break;
      case 3:
        this.router.navigateByUrl('magyp/gestion/contacto');
        break;
      default:
        break;
    }
  }

}
