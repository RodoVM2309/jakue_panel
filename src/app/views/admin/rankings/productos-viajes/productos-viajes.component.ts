import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { MatProgressBar, MatButton, MatSelect, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { Subscription, from } from 'rxjs';
import { InfoPersonaComponent } from './../../personas/info-persona/info-persona.component';
import { Page } from '../../../../shared/models/page';
import { CentrosService } from 'app/shared/services/centros.service';

export class ProductosViajes {
  id_producto: number;
  nombre_producto: string;
  total_viajes: number;
}

@Component({
  selector: 'app-productos-viajes',
  templateUrl: './productos-viajes.component.html',
  styleUrls: ['./productos-viajes.component.scss']
})
export class ProductosViajesComponent implements OnInit {
  public productosViajes: ProductosViajes[];
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
    public dialogRef: MatDialogRef<ProductosViajesComponent>, 
    private dialog: MatDialog,
    private centrosService: CentrosService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.filtro = this.data.payload;
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro === undefined) {
      this.filtro = '';
    }
    if (this.filtro.tipo === 'transportista') {
      this.filtro.id_transporte = this.filtro.id;
      this.centrosService.getViajesProductos(this.page.pageNumber, this.filtro).subscribe(pageData => {
        this.productosViajes = pageData.data;
        this.page.totalElements = pageData._meta.totalCount;
        this.page.pageNumber = pageData._meta.currentPage - 1;
        this.page.size = pageData._meta.perPage;
      });
    } else {
      this.filtro.id_intermediario = this.filtro.id;
      this.centrosService.getViajesProductos2(this.page.pageNumber, this.filtro).subscribe(pageData => {
        this.productosViajes = pageData.data;
        this.page.totalElements = pageData._meta.totalCount;
        this.page.pageNumber = pageData._meta.currentPage - 1;
        this.page.size = pageData._meta.perPage;
      });
    }
  }

}
