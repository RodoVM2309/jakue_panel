import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CcppService } from 'app/shared/services/ccpp.service';
import { Inconsistencia } from 'app/shared/models/inconsistencia';
import { Page } from 'app/shared/models/page';

@Component({
  selector: 'app-ccpp',
  templateUrl: './ccpp.component.html',
  styleUrls: ['./ccpp.component.scss']
})
export class CcppComponent implements OnInit {
  selectedTab = 0;
  labelInconsistentes = 'Inconsistencias';
  public lista_inconsistencias: Inconsistencia[];
  public lista_auditoria: any[];
  pageInconsistencia = new Page();
  pageAuditoria = new Page();
  filtroBuscar: string ='';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private ccppService: CcppService,) {
      this.pageInconsistencia.pageNumber = 0;
      this.pageInconsistencia.size = 10;
      this.pageAuditoria.pageNumber = 0;
      this.pageAuditoria.size = 10;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['opcion']) {
        this.buscar(params['opcion'])
      } else {
        this.selectedTab = 0;
      }
    });

    this.setPageInconsistencia();
    this.setPageAuditoria();
  }
  buscar(opcion) {
    switch (opcion) {
      case 'cabecera':
        this.selectedTab = 0;
        break;
      case 'inconsistencia':
        this.selectedTab = 1;
        break;
      case 'auditoria':
        this.filtroBuscar="";
        //this.setPageAuditoria();
        this.selectedTab = 2;
        break;
      case 'consulta':
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
        this.router.navigateByUrl('ccpp/cabecera');
        break;
      case 1:
        this.router.navigateByUrl('ccpp/inconsistencia');
        break;
      case 2:
        this.router.navigateByUrl('ccpp/auditoria');
        break;
      case 3:
        this.router.navigateByUrl('ccpp/consulta');
        break;
      default:
        break;
    }
  }

  setPageInconsistencia() {
    this.pageInconsistencia.pageNumber += 1;
    this.ccppService.getInconsistencias(this.pageInconsistencia.pageNumber,this.pageInconsistencia.size)
      .subscribe(pagedData => {
        console.log(pagedData.data);
        this.lista_inconsistencias= pagedData.data;
        this.pageInconsistencia.totalElements = pagedData._meta.totalCount;
        this.pageInconsistencia.pageNumber = pagedData._meta.currentPage;
        this.pageInconsistencia.size = pagedData._meta.perPage;
      },
        err => {

        });
  }

  setPageAuditoria() {
    console.log('Page auditoria:',this.pageInconsistencia.pageNumber);
    this.pageAuditoria.pageNumber += 1;
    this.ccppService.getAuditorias(this.pageAuditoria.pageNumber,this.pageAuditoria.size)
      .subscribe(pagedData => {
        this.lista_auditoria= pagedData.data;
        this.pageAuditoria.totalElements = pagedData._meta.totalCount;
        this.pageAuditoria.pageNumber = pagedData._meta.currentPage;
        this.pageAuditoria.size = pagedData._meta.perPage;
      },
        err => {

        });
  }
  setPageBuscarAuditoria(cupo) {
    this.pageAuditoria.pageNumber += 1;
    this.ccppService.searchAuditoria(cupo,this.pageAuditoria.pageNumber)
      .subscribe(pagedData => {
        this.lista_auditoria= pagedData.data;
        this.pageAuditoria.totalElements = pagedData._meta.totalCount;
        this.pageAuditoria.pageNumber = pagedData._meta.currentPage;
        this.pageAuditoria.size = pagedData._meta.perPage;
      },
        err => {

        });
  }



  chancePage(event): void {
    this.pageInconsistencia= event.page;
    this.setPageInconsistencia();
  }
  chancePageAuditoria(event): void {
    this.pageAuditoria= event.page;
    this.setPageAuditoria();
  }

  buscarCupos(event) {
    let cupo = event.cupo;
    this.filtroBuscar= cupo;
    this.pageAuditoria= event.page;
    if (cupo === '') {
      this.setPageAuditoria();
    } else {
      this.setPageBuscarAuditoria(cupo)
    }
  }

}
