import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSidenav, MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { AppLoaderService } from '../../../services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { AppErrorService } from '../../../services/app-error/app-error.service';
import { Prepedido } from '../../../models/prepedido';
import { HomeService } from '../home.service';
import { Page } from 'app/shared/models/page';
import { AddPedidoComponent } from 'app/shared/components/home/add-pedido/add-pedido.component';
import { AddPedidoRetornoComponent } from 'app/shared/components/home/add-pedido-retorno/add-pedido-retorno.component';
import { AddPedidoCortoComponent } from 'app/shared/components/home/add-pedido-corto/add-pedido-corto.component';
import { MessageService } from 'app/shared/services/message.service';


@Component({
  selector: 'app-prepedido',
  templateUrl: './prepedido.component.html',
  styleUrls: ['./prepedido.component.scss']
})
export class PrepedidoComponent implements OnInit,OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public listPrepedidos: Prepedido[];
  public getItemSub: Subscription;

  displayedColumns: string[] = ['fecha_desde','fecha_hasta','remitente', 'tipo_pedido','producto','cant_camiones','lugar_carga','zona_destino','acciones'];
  dataSource=   new MatTableDataSource();
  pageEvent: PageEvent;
  page = new Page();
  subscription: Subscription;
  message: any;
  constructor(
    private homeService: HomeService,
    private errorService: AppErrorService,
    private loader: AppLoaderService,
    public router: Router, private dialog: MatDialog,
    private messageService: MessageService,
  ) {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.message = message;
      switch (this.message.text) {
        case 'AddPrePedido':
          this.setPage(null);
          break;

        default:
          break;
      }
    });
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Arribos por Página";
    this.paginator._intl.nextPageLabel = "Siguiente";
    this.paginator._intl.firstPageLabel = "Primero";
    this.paginator._intl.lastPageLabel = "Último Arribo";
    this.paginator._intl.previousPageLabel = "Anterior";
    this.setPage(null);
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  setPage(event?: PageEvent) {
    let params = {
      page: 1,
      per_page: this.page.size
    };
    if (event !== null) {
      params.page = event.pageIndex + 1;
      params.per_page = event.pageSize;
    };
    this.homeService.getPrepedido(params)
    .subscribe(pagedData => {
      this.loader.close();
      this.listPrepedidos=[];
      if (pagedData.data.length>0) {
        pagedData.data.forEach(element => {
          let temp = new Prepedido();
          temp = element;
          temp.id_tipo_pedido=element.tipo_pedido;
          temp.data_fecha_desde=element.fecha_desde;
          temp.data_fecha_hasta=element.fecha_hasta;
          temp.fecha_desde=element.fecha_desde == "0000-00-00 00:00:00"?'---':this.homeService.formatoFecha(element.fecha_desde, "dma", "-");
          temp.fecha_hasta=element.fecha_hasta == "0000-00-00 00:00:00"?'---':this.homeService.formatoFecha(element.fecha_hasta, "dma", "-");
          switch (element.tipo_pedido) {
            case 1:
              temp.tipo_pedido='Flete largo'
              break;
            case 2:
              temp.tipo_pedido='Flete Retorno'
              break;
            case 3:
              temp.tipo_pedido='Flete Corto'
              break;
            default:
              break;
          }
          this.listPrepedidos.push(temp);
        });
        this.dataSource.data= this.listPrepedidos;
      }



    },
    err => {
      this.loader.close();
      this.errorService.confirm({ message: 'Error, al buscar los choferes' }).subscribe(res => {
        if (res) {
          return;
        }
      });
    });
  }

  openPopUpSeleccionarPedido(data: any = {}) {
    switch (data.id_tipo_pedido) {
      case 1:
        this.gotoAddPedido(data);
        break;
      case 2:
        this.gotoAddPedidoRetorno(data);
        break;
      case 3:
        this.gotoAddPedidoCorto(data);
        break;
      default:
        this.gotoAddPedido(data);
        break;
    }
  }
  gotoAddPedido(data: any = {}) {
    let title = 'Agregar Pedido';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPedidoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data,esPrePedido:true }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        this.setPage(null);
      })
  }

  gotoAddPedidoRetorno(data: any = {}) {
    let title = 'Agregar Pedido Retorno';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPedidoRetornoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data,esPrePedido:true }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        this.setPage(null);
      })
  }
  gotoAddPedidoCorto(data: any = {}) {
    let title = 'Agregar Pedido Corto';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPedidoCortoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title , payload: data,esPrePedido:true }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        this.setPage(null);
      })
  }


}
