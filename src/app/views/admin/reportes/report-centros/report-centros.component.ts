import { Component, OnInit, ViewChild  } from '@angular/core';
import { MatProgressBar, MatButton} from '@angular/material';
import { egretAnimations } from '../../../../shared/animations/egret-animations';
import { CentrosService } from '../../../../shared/services/centros.service';
import { BaseChartDirective } from 'ng2-charts';
import { Page } from '../../../../shared/models/page';
import { Centro } from '../../../../shared/models/centro';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-report-centros',
  templateUrl: './report-centros.component.html',
  styleUrls: ['./report-centros.component.scss'],
  animations: egretAnimations
})
export class ReportCentrosComponent implements OnInit {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  @ViewChild(BaseChartDirective)

  public getItemSub: Subscription;
  public centros: Centro[];
  page = new Page();
  totalCentros: number =0;
  totalChoferes: number =0;
  totalApp: number =0;
  choferes_ocupados: number =0;
  choferes_sin_transportista: number =0;
  dataSource: Object;
  chartConfig: Object;
  totalPage: 0;
  temp = [];

  constructor(    
    private centrosService: CentrosService, 
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  
   }

  ngOnInit() {
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    this.centrosService.getAllCentros(this.page.pageNumber,'','').subscribe(pagedData => {
      this.centros = this.temp = pagedData.data;
      for (let i = 0; i < this.centros.length; i++) {
        this.centros[i].cliente_muvin = (this.centros[i].cliente_muvin.toString() === '0') ? 'NO' : 'SI';
        this.centros[i].condiciones = (this.centros[i].condiciones_viaje.toString() === '0') ? 'NO' : 'SI';
        this.centros[i].visualiza_flota_intermediario = (this.centros[i].visualiza_flota_intermediario.toString() === '0') ? 'NO' : 'SI';
        this.centros[i].km = (this.centros[i].km.toString() === '0') ? 'NO' : 'SI';
      }
      this.page.totalElements = pagedData._meta.totalCount;
      this.totalCentros = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;
    });
    this.centrosService.getCentroTotalizador().subscribe(data => {
      this.totalChoferes = data.data[0].total_choferes;
      this.totalApp = data.data[0].choferes_app_instalada;
      this.choferes_ocupados = data.data[0].choferes_ocupados;
      this.choferes_sin_transportista = data.data[0].choferes_sin_transportista;

    });
  }
  stopProp(e) {
    e.stopPropagation()
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    var columns = Object.keys(this.temp[0]);
    columns.splice(columns.length - 1);

    if (!columns.length)
      return;

    const rows = this.temp.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        let column = columns[i];
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.centros = rows;
  }

}
