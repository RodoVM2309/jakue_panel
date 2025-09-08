import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Page } from '../../../../shared/models/page';
import { CentrosService } from 'app/shared/services/centros.service';

export class ProductosDesvios {
  id_cliente: number;
  id_producto: number;
  nombre_producto: string;
  total_viajes: number;
  viajes_desviados: number;
}

export class MotivosDesvios {
  id_cliente: number;
  motivo_desvio: string;
  viajes_desviados: number;
}

export class LugarCargaDesvios {
  id_cliente: number;
  id_origen: number;
  lugar_carga: string;
  total_viajes: number;
  viajes_desviados: number;
  ranking: number;
}

export class DestinoCargaDesvios {
  id_cliente: number;
  id_zona_destino: number;
  destino: string;
  total_viajes: number;
  viajes_desviados: number;
  ranking: number;
}

@Component({
  selector: 'app-listado-desviados',
  templateUrl: './listado-desviados.component.html',
  styleUrls: ['./listado-desviados.component.scss']
})
export class ListadoDesviadosComponent implements OnInit {
  public productosDesvios: ProductosDesvios[];
  public motivosDesvios: MotivosDesvios[];
  public lugaresDesvios: LugarCargaDesvios[];
  public destinosDesvios: DestinoCargaDesvios[];
  public productos: false;
  public motivos: false;
  public lugares: false;
  public destinos: false;

  page = new Page();
  public getItemSub: Subscription;
  public filtro;
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ListadoDesviadosComponent>, 
    private centrosService: CentrosService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.filtro = this.data.payload;
    this.resetValue();
    eval('this.' + this.filtro.tipo + ' = true;');
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro === undefined) {
      this.filtro = '';
    }
    if (this.productos) {
      this.centrosService.getProductosDesvio(this.page.pageNumber, this.filtro).subscribe(pageData => {
        this.productosDesvios = pageData.data;
        this.page.totalElements = pageData._meta.totalCount;
        this.page.pageNumber = pageData._meta.currentPage - 1;
        this.page.size = pageData._meta.perPage;
      });
    }
    if (this.motivos) {
      this.centrosService.getMotivoDesvio(this.page.pageNumber, this.filtro).subscribe(pageData => {
        this.motivosDesvios = pageData.data;
        this.page.totalElements = pageData._meta.totalCount;
        this.page.pageNumber = pageData._meta.currentPage - 1;
        this.page.size = pageData._meta.perPage;
      });
    }
    if (this.lugares) {
      this.centrosService.getLugarCargaDesvio(this.page.pageNumber, this.filtro).subscribe(pageData => {
        this.lugaresDesvios = pageData.data;
        this.page.totalElements = pageData._meta.totalCount;
        this.page.pageNumber = pageData._meta.currentPage - 1;
        this.page.size = pageData._meta.perPage;
      });
    }
    if (this.destinos) {
      this.centrosService.getDestinoCargaDesvio(this.page.pageNumber, this.filtro).subscribe(pageData => {
        this.destinosDesvios = pageData.data;
        this.page.totalElements = pageData._meta.totalCount;
        this.page.pageNumber = pageData._meta.currentPage - 1;
        this.page.size = pageData._meta.perPage;
      });
    }

  }

  resetValue() {
    this.productos = false;
    this.motivos = false;
    this.lugares = false;
    this.destinos = false;
  }

}

