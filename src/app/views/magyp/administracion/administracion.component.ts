import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.scss']
})
export class AdministracionComponent implements OnInit {
  selectedTab = 0;

  constructor(private route: ActivatedRoute,public router: Router,) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['opcion']) {
        this.buscar(params['opcion'])
      }
    });
  }

  buscar(opcion) {
    switch (opcion) {
      case 'cadenas':
        this.selectedTab = 0;
        break;
      case 'autoridades':
        this.selectedTab = 1;
        break;
      case 'whatsapp':
        this.selectedTab = 2;
        break;

      default:
        break;
    }

  }
  selectTab(event) {
    switch (event) {
      case 0:
        this.router.navigateByUrl('magyp/administracion/cadenas');
        break;
      case 1:
        this.router.navigateByUrl('magyp/administracion/autoridades');
        break;
      case 2:
        this.router.navigateByUrl('magyp/administracion/whatsapp');
        break;
      default:
        break;
    }
  }

}
