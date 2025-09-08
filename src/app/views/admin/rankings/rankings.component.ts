import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { Page } from '../../../shared/models/page';
import { CentrosService } from 'app/shared/services/centros.service';
import { ListadoChoferesComponent } from './listado-choferes/listado-choferes.component';
import { ListadoRechazadosComponent } from './listado-rechazados/listado-rechazados.component';
import { ListadoDesviadosComponent } from './listado-desviados/listado-desviados.component';
import { ProductosViajesComponent } from './productos-viajes/productos-viajes.component';

export class ProveedoresCentro {
  id?: number;
  ranking: number;
  razon_social: string;
  tipo: string;
  total_viajes: number;
  viajes_completados: number;
}

export class CargadoresRechazo {
  id_cliente: number;
  razon_social: string;
  total_viajes: number;
  viajes_rechazados: number;
  ranking: number;
}

export class CargadoresDesvio {
  id_cliente: number;
  razon_social: string;
  total_viajes: number;
  viajes_desviados: number;
  ranking: number;
}

export class TiempoLugar {
  id_viaje: number;
  lugar_carga: string;
  tiempo: string;
}

export class TiempoDestino {
  id_viaje: number;
  destino: string;
  tiempo: string;
}

export class FlotaIntermediario {
  id_intermediario: number;
  id_transporte: number;
  id_chofer: number;
  razon_social: string;
}

export class ViajesProveedores {
  id: number;
  tipo: string;
  razon_social: string;
  cantidad_viajes: number;
  porciento_viajes: number;
  flota_premium: number;
  flota_propia: number;

}
export class OptionFiltro {
  tipo: string;
}

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.scss']
})

export class RankingsComponent implements OnInit {
  public proveedoresCentro: ProveedoresCentro[];
  public cargadoresRechazo: CargadoresRechazo[];
  public cargadoresDesvio: CargadoresDesvio[];
  public tiempoLugar: TiempoLugar[];
  public tiempoDestino: TiempoDestino[];
  public flotaIntermediario: FlotaIntermediario[];
  public viajesProveedores: ViajesProveedores[];
  page = new Page();
  public getItemSub: Subscription;
  public filtro: OptionFiltro = { tipo: '' };
  public cumplimiento = true;
  public rechazos = false;
  public desvios = false;
  public tiempocarga = false;
  public tiempodescarga = false;
  public tiempoflotaintermediario = false;
  public intermediariotransportista = false;
  filtros_ranking = [
    { value: '', descripcion: 'Todos' },
    { value: 'transportista', descripcion: 'Empresa de transporte' },
    { value: 'intermediario', descripcion: 'Intermediarios' }
  ];
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };

  constructor(private centrosService: CentrosService, 
    public router: Router, private dialog: MatDialog,) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    
    if (this.cumplimiento) {
      this.centrosService.getProveedoresCentro(this.page.pageNumber, this.filtro).subscribe(pageData => {
        this.proveedoresCentro = pageData.data;
        this.page.totalElements = pageData._meta.totalCount;
        this.page.pageNumber = pageData._meta.currentPage - 1;
        this.page.size = pageData._meta.perPage;
      });
    }
    if (this.rechazos) {
      this.centrosService.getCargadoresRechazo(this.page.pageNumber, this.filtro).subscribe(pageData => {
        this.cargadoresRechazo = pageData.data;
        this.page.totalElements = pageData._meta.totalCount;
        this.page.pageNumber = pageData._meta.currentPage - 1;
        this.page.size = pageData._meta.perPage;
      });
    }
    if (this.desvios) {
      this.centrosService.getCargadoresDesvio(this.page.pageNumber, this.filtro).subscribe(pageData => {
        this.cargadoresDesvio = pageData.data;
        this.page.totalElements = pageData._meta.totalCount;
        this.page.pageNumber = pageData._meta.currentPage - 1;
        this.page.size = pageData._meta.perPage;
      });
    }
    if (this.tiempocarga) {
      this.centrosService.getTiempoLugaresCarga(this.page.pageNumber, this.filtro).subscribe(pageData => {
        this.tiempoLugar = pageData.data;
        this.page.totalElements = pageData._meta.totalCount;
        this.page.pageNumber = pageData._meta.currentPage - 1;
        this.page.size = pageData._meta.perPage;
      });
    }
    if (this.tiempodescarga) {
      this.centrosService.getTiempoLugaresDescarga(this.page.pageNumber, this.filtro).subscribe(pageData => {
        this.tiempoDestino = pageData.data;
        this.page.totalElements = pageData._meta.totalCount;
        this.page.pageNumber = pageData._meta.currentPage - 1;
        this.page.size = pageData._meta.perPage;
      });
    }
    if (this.tiempoflotaintermediario) {
      this.centrosService.getFlotaIntermediario(this.page.pageNumber, this.filtro).subscribe(pageData => {
        this.flotaIntermediario = pageData.data;
        this.page.totalElements = pageData._meta.totalCount;
        this.page.pageNumber = pageData._meta.currentPage - 1;
        this.page.size = pageData._meta.perPage;
      });
    }
    if (this.intermediariotransportista) {
      this.centrosService.getViajesProveedores(this.page.pageNumber, this.filtro).subscribe(pageData => {
        this.viajesProveedores = pageData.data;
        this.page.totalElements = pageData._meta.totalCount;
        this.page.pageNumber = pageData._meta.currentPage - 1;
        this.page.size = pageData._meta.perPage;
      });
    }

  }

  mostrarRankings(opt) {
    this.resetValue();
    eval('this.' + opt + ' = true;');
    this.setPage({ offset: 0 });
  }

  resetValue() {
    this.cumplimiento = false;
    this.rechazos = false;
    this.desvios = false;
    this.tiempocarga = false;
    this.tiempodescarga = false;
    this.tiempoflotaintermediario = false;
    this.intermediariotransportista = false;
    this.filtro.tipo = '';
  }

 

  openPopUpRechazados(data, title, tipo) {
    const dialogRef: MatDialogRef<any> = this.dialog.open(ListadoRechazadosComponent, {
      width: '450px',
      disableClose: true,
      data: { title: title, payload: { id: data.id_cliente, tipo: tipo } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }

  openPopUpDesviados(data, title, tipo) {
    const dialogRef: MatDialogRef<any> = this.dialog.open(ListadoDesviadosComponent, {
      width: '450px',
      disableClose: true,
      data: { title: title, payload: { id: data.id_cliente, tipo: tipo } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }

  openPopViajesProveedores(data) {
    const dialogRef: MatDialogRef<any> = this.dialog.open(ProductosViajesComponent, {
      width: '600px',
      disableClose: true,
      data: { title: 'Productos-Viajes', payload: data }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }

  changeOptionFiltro(event) {
    this.filtro.tipo = event.value;
    this.setPage({ offset: 0 });
  }

}