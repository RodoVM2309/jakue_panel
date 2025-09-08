import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../shared/services/app-atencion/app-atencion.service';
import { Page } from '../../../shared/models/page';
import { Busqueda } from '../../../shared/models/busqueda';

import { CentrosService } from './../../../shared/services/centros.service';
import { AddBusquedaFlotaComponent } from './add-busqueda-flota/add-busqueda-flota.component';
import { AddPedidoComponent } from '../../../shared/components/home/add-pedido/add-pedido.component';
import { AddPedidoRetornoComponent } from '../../../shared/components/home/add-pedido-retorno/add-pedido-retorno.component';
import { AddPedidoCortoComponent } from '../../../shared/components/home/add-pedido-corto/add-pedido-corto.component';
import { SeleccionarPedidoComponent } from '../../../shared/components/home/seleccionar-pedido/seleccionar-pedido.component';
import { isUndefined } from "util";

export interface MostrarPostulados {
  value: number;
  viewValue: string;
}

import { ChoferZona } from '../../../shared/models/chofer-zona';
@Component({
  selector: 'app-busqueda-flota',
  templateUrl: './busqueda-flota.component.html',
  styleUrls: ['./busqueda-flota.component.scss']
})
export class BusquedaFlotaComponent implements OnInit {
  page = new Page();
  filtro = {
    patente: '',
    cuit: '',
    transportista: '',
    nombre: ''
  };
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Búsquedas</span>        
      </div>
    `
  };
  ///// Eliminar
  public choferes: ChoferZona[];
  public busquedaList: Busqueda[];
  public busquedaListAll: Busqueda[];
  public busqueda: Busqueda;
  selectedFilterInteresados:any;
  mostrarInteresados: MostrarPostulados[] = [
    { value: -1, viewValue: "Todos" },
    { value: 0, viewValue: "Si" },
    { value: 1, viewValue: "No" }
  ];

  constructor(private centrosService: CentrosService, 
    public router: Router, 
    private dialog: MatDialog,
    private errorService: AppErrorService, 
    private loader: AppLoaderService, 
    private alertService: AppAlertService) {
  }

  ngOnInit() {
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro === undefined) {
      this.filtro = {
        patente: '',
        cuit: '',
        transportista: '',
        nombre: ''
      };
    };
    this.centrosService.getAllBusquedaCentro(this.page.pageNumber, this.filtro).subscribe(pagedData => {
      this.busquedaList = pagedData.data;
      this.busquedaListAll = this.busquedaList;
      for (let i = 0; i < this.busquedaList.length; i++) {
        this.busquedaList[i].da_gasoil_txt = (this.busquedaList[i].da_gasoil === 0) ? 'No' : 'Si';
        this.busquedaList[i].da_efectivo_txt = (this.busquedaList[i].da_efectivo === 0) ? 'No' : 'Si';
        this.busquedaList[i].carga_peligrosa_txt = (this.busquedaList[i].carga_peligrosa === 0) ? 'No' : 'Si';
      }
      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage;
      this.page.size = pagedData._meta.perPage;
    });
  }
  openPopUpBusquedaFlota(data: any = {}) {
    let title = 'Crear ';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddBusquedaFlotaComponent, {
      width: '720px',
      height: '640px',
      disableClose: true,
      data: { title: title, payload: data }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        if (res.id != undefined) {
          this.centrosService.putBusqueda(res)
            .subscribe(data => {
              if (data.success) {
                if (this.loader !== null) {
                  this.loader.close();
                }
                this.setPage({ offset: 0 });
                this.alertService.confirm({ message: 'Búsqueda actualizada!', tipo: 'exito' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              } else {
                this.errorService.confirm({ message: 'Error:' + data.data + '!' });
              }
            }, err => {
              this.errorService.confirm({ message: 'Error:' + err + '!' });
              return;
            });
        } else {
          this.centrosService.postBusqueda(res)
            .subscribe(data => {
              this.busqueda= data.data;
              if (data.success) {
                if (this.loader !== null) {
                  this.loader.close();
                }
                this.alertService.confirm({ message: '¡Búsqueda adicionada correctamente!', tipo: 'exito' }).subscribe(res => {
                  if (res) {
                    this.router.navigateByUrl('/centro/gestionarBusqueda/' + data.data.id);
                  }
                });
              } else {
                this.errorService.confirm({ message: 'Error:' + data.data + '!' });
              }
            }, err => {
              this.errorService.confirm({ message: 'Error:' + err });
              return;
            });
        }

      });
  }

  openPopUpSeleccionarPedido(data: any = {}) {
    let title = 'Seleccionar ';
    let tipoPedido = 0;
    this.busqueda=data;
    let dialogRef: MatDialogRef<any> = this.dialog.open(SeleccionarPedidoComponent, {
      width: '540px',
      height:'380px',
      disableClose: true,
      data: { title: title, payload: data, tipoPedido: tipoPedido }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        if (res.tipoPedido != undefined) {
          switch (res.tipoPedido) {
            case 1:
              this.gotoAddPedido(res.payload);
              break;
            case 2:
              this.gotoAddPedidoRetorno(res.payload);
              break;
            case 3:
              this.gotoAddPedidoCorto(res.payload);
              break;
            default:
              this.gotoAddPedido(res.payload);
              break;
          }
        }

      });
  }

  gotoAddPedido(data: any = {}) {
    let title = 'Agregar Pedido';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPedidoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        this.setPage({ offset: 0 });
      })
  }

  gotoAddPedidoRetorno(data: any = {}) {
    let title = 'Agregar Pedido Retorno';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPedidoRetornoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        this.setPage({ offset: 0 });
      })
  }
  gotoAddPedidoCorto(data: any = {}) {
    let title = 'Agregar Pedido Corto';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPedidoCortoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title , payload: data }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        this.setPage({ offset: 0 });
      })
  }

  updateFilter(event, param) {
    const val = event.target.value.toLowerCase();

    switch (param) {
      case 'patente':
        this.filtro.patente = val;
        break;
      case 'cuit':
        this.filtro.cuit = val;
        break;
      case 'transportista':
        this.filtro.transportista = val;
        break;
      case 'nombre':
        this.filtro.nombre = val;
        break;
      default:
        break;
    }
    this.setPage({ offset: 0 });
  }

  chanceSelectInteresados() {
    const arraytemp = [];
    let arrayvalue= this.busquedaListAll;
    if (!isUndefined(arrayvalue)) {
      for (let i = 0; i < arrayvalue.length; i++) {
        switch (this.selectedFilterInteresados) {
          case 0:
          if (arrayvalue[i].finalizada=== 1)
            arraytemp.push(arrayvalue[i])
          break;
          case 1:
          if (arrayvalue[i].finalizada=== 0)
            arraytemp.push(arrayvalue[i])
          break;         
          default:          
            arraytemp.push(arrayvalue[i])
          break;
        }        
      }
      arrayvalue = arraytemp;
      this.busquedaList = arrayvalue;
      this.page.totalElements= this.busquedaList.length;
      return arrayvalue;
    }
    
  }
  goToGestionar(row) {
    this.router.navigateByUrl('/centro/gestionarBusqueda/' + row.id);
  }
  
  goToFinalizar(row) {
    this.loader.open();
    row.finalizada = 1;
    this.centrosService.putBusqueda(row)
      .subscribe(data => {
        if (data.success) {
          this.loader.close();
          this.setPage({ offset: 0 });         
        } else {
          this.loader.close();
          this.errorService.confirm({ message: 'Error!:' + data.data });
        }
      });

  }



}
