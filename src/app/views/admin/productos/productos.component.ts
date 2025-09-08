import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { Page } from '../../../shared/models/page';
import { ProductosService } from './../../../shared/services/productos.service';
import { Product } from './../../../shared/models/product.model';
import { AddProductosComponent } from './add-productos/add-productos.component';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit, OnDestroy {
  public productos: Product[];
  page = new Page();
  public getItemSub: Subscription;
  constructor(private productosService: ProductosService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private loader: AppLoaderService, private alertService: AppAlertService) {
      this.page.pageNumber = 0;
      this.page.size = 10;
     }

  ngOnInit() {
      this.setPage({ offset: 0 });
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

   setPage(pageInfo){
      this.page.pageNumber = pageInfo.offset + 1;
      this.productosService.getAllProductos(this.page.pageNumber).subscribe(pagedData => {
        this.productos = pagedData.data;

        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;

      });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.productos.filter(function (d) {
      return d.descripcion.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.productos = temp;
    if (val === '') {
      this.setPage({ offset: 0 });
    }
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agregar Producto' : 'Modificar Producto';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddProductosComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {
          this.productosService.postProducto(res)
            .subscribe(data => {
              this.productos.unshift(data);
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Producto agregado!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Este Producto ya se encuentra ingresado' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        } else {
          this.productosService.updateProducto(res)
            .subscribe(data => {
              this.productos = data;
              this.setPage({ offset: 0 });
              if (this.loader !== null) {
                this.loader.close();
              }
              this.snack.open('Producto modificado!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Este Producto no se puede modificar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar el Producto?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.productosService.deleteProducto(row.id)
            .subscribe(data => {
              this.loader.close();
              this.productos = data;
              this.setPage({ offset: 0 });
              this.snack.open('Producto eliminado!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Este Producto no se puede eliminar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }
}
