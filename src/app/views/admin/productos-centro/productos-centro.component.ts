import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar, MatSidenav, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { MessageService } from 'app/shared/services/message.service';
import { TranslateService } from '@ngx-translate/core';

import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { CentroProducto } from 'app/shared/models/centro-producto';
import { Producto } from 'app/shared/models/producto';
import { CentroProductoService } from 'app/shared/services/centro-producto.service';

@Component({
  selector: 'app-productos-centro',
  templateUrl: './productos-centro.component.html',
  styleUrls: ['./productos-centro.component.scss']
})
export class ProductosCentroComponent implements OnInit {
  centroProducto: Producto[] = [];
  centroProductoCloned: Producto[] = [];
  restProductos: CentroProducto[] = [];
  restProductosCloned: CentroProducto[] = [];
  public getItemSub: Subscription;
  constructor(
    private loader: AppLoaderService, private alertService: AppAlertService,
    private errorService: AppErrorService, private nomencladoresService: NomencladoresService,
    private centroProductoService: CentroProductoService,
    private confirmService: AppConfirmService,
    private snack: MatSnackBar,
  ) { }

  ngOnInit() {
    this.refreshProducto();
    this.refreshProductoNoVinculado();
  }

  refreshProducto() {
    this.restProductos = [];
    this.centroProducto = [];

    this.getItemSub = this.centroProductoService.getCentroProducto()
      .subscribe(data => {

        this.restProductos = data.data;
        this.restProductosCloned = [...this.restProductos];

        this.nomencladoresService.getAllProductosSelect2()
          .subscribe(item => {

            item.data.forEach(element => {
              let disponible: boolean = true;
              this.restProductos.forEach(centProd => {
                if (centProd.id == element.id) {
                  disponible = false;
                }
              })
              if (disponible) {
                this.centroProducto.push(element)
              }
            })
            this.centroProductoCloned = [...this.centroProducto];
          });
      });
  }

  refreshProductoNoVinculado(){
   this.centroProductoService.getCentroProductoNoVinculado().subscribe(
    result=>{
     this.centroProducto = result['data'];
    }
   )
  }
  incluirProductoCentro(producto) {
    this.confirmService.confirm({ message: '¿Está seguro de incluir el producto ' + producto.descripcion + ' del centro ?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.getItemSub = this.centroProductoService.postCentroProducto(producto)
            .subscribe(data => {
              this.loader.close();
              this.alertService.confirm({ message: '¡Producto incluido en los productos del centro correctamente!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  this.refreshProducto();
                  this.refreshProductoNoVinculado();
                }
              });
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Error, al guardar el incluir el producto al centro' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }

  excluirProductoCentro(row: CentroProducto) {
    this.confirmService.confirm({ message: '¿Está seguro de excluir el producto ' + row.descripcion + ' del centro ?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.centroProductoService.deleteCentroProducto(row)
            .subscribe(data => {
              this.loader.close();
              this.alertService.confirm({ message: '¡Producto excluido del centro!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  this.refreshProducto();
                  this.refreshProductoNoVinculado();
                }
              });
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Error, al excluir el producto del centro' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }

  filterDisponibles(ev: any) {
    let search = ev.target.value;
    if (search == null) {
      search = '';
    }
    search = search.toLowerCase();
    this.centroProducto = search.length > 0
      ? this.centroProductoCloned.filter((elem: Producto) =>
        elem.descripcion.toLowerCase().indexOf(search) > -1)
      : this.centroProductoCloned;
  }

  filteDelCentro(ev: any) {
    let search = ev.target.value;
    if (search == null) {
      search = '';
    }
    search = search.toLowerCase();
    this.restProductos = search.length > 0
      ? this.restProductosCloned.filter((elem: CentroProducto) =>
        elem.descripcion.toLowerCase().indexOf(search) > -1)
      : this.restProductosCloned;
  }

}
