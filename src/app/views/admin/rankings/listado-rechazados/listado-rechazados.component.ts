import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Page } from '../../../../shared/models/page';
import { CentrosService } from 'app/shared/services/centros.service';

export class ProductosRechazos {
  id_cliente: number;
  id_producto: number;
  nombre_producto: string;
  total_viajes: number;
  viajes_rechazados: number;
}

export class MotivosRechazos {
  id_cliente: number;
  motivo_rechazo: string;
  viajes_rechazados: number;
}

export class LugarCargaRechazos {
  id_cliente: number;
  id_origen: number;
  lugar_carga: string;
  total_viajes: number;
  viajes_rechazados: number;
  ranking: number;
}

export class DestinoCargaRechazos {
  id_cliente: number;
  id_zona_destino: number;
  destino: string;
  total_viajes: number;
  viajes_rechazados: number;
  ranking: number;
}

@Component({
  selector: 'app-listado-rechazados',
  templateUrl: './listado-rechazados.component.html',
  styleUrls: ['./listado-rechazados.component.scss']
})
export class ListadoRechazadosComponent implements OnInit {
  public productosRechazos: ProductosRechazos[];
  public motivosRechazos: MotivosRechazos[];
  public lugaresRechazos: LugarCargaRechazos[];
  public destinosRechazos: DestinoCargaRechazos[];
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
    public dialogRef: MatDialogRef<ListadoRechazadosComponent>,
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
      this.centrosService.getProductosRechazo(this.page.pageNumber, this.filtro).subscribe(pageData => {
        this.productosRechazos = pageData.data;
        this.page.totalElements = pageData._meta.totalCount;
        this.page.pageNumber = pageData._meta.currentPage - 1;
        this.page.size = pageData._meta.perPage;
      });
    }
    if (this.motivos) {
      this.centrosService.getMotivoRechazo(this.page.pageNumber, this.filtro).subscribe(pageData => {
        this.motivosRechazos = pageData.data;
        this.page.totalElements = pageData._meta.totalCount;
        this.page.pageNumber = pageData._meta.currentPage - 1;
        this.page.size = pageData._meta.perPage;
      });
    }
    if (this.lugares) {
      this.centrosService.getLugarCargaRechazo(this.page.pageNumber, this.filtro).subscribe(pageData => {
        this.lugaresRechazos = pageData.data;
        this.page.totalElements = pageData._meta.totalCount;
        this.page.pageNumber = pageData._meta.currentPage - 1;
        this.page.size = pageData._meta.perPage;
      });
    }
    if (this.destinos) {
      this.centrosService.getDestinoCargaRechazo(this.page.pageNumber, this.filtro).subscribe(pageData => {
        this.destinosRechazos = pageData.data;
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
