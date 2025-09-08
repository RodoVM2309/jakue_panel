import { Component, OnInit } from '@angular/core';
import { egretAnimations } from "../../../animations/egret-animations";
import { TranslateService } from '@ngx-translate/core';
import { NomencladoresService } from '../../../services/nomencladores.service';
import { Subscription } from 'rxjs';
import { Pedido } from '../../../models/pedido';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AddPedidoComponent } from '../add-pedido/add-pedido.component';
import { AddPedidoRetornoComponent } from '../add-pedido-retorno/add-pedido-retorno.component';
import { AddPedidoDadorRetornoComponent } from '../add-pedido-dador-retorno/add-pedido-dador-retorno.component';
import { AddPedidoDadorComponent } from '../add-pedido-dador/add-pedido-dador.component';
import { AddPedidoDadorCortoComponent } from '../add-pedido-dador-corto/add-pedido-dador-corto.component';
import { AddPedidoCortoComponent } from '../add-pedido-corto/add-pedido-corto.component';
import { SeleccionarPedidoComponent } from '../seleccionar-pedido/seleccionar-pedido.component'

@Component({
  selector: 'app-header-views',
  templateUrl: './header-views.component.html',
  styleUrls: ['./header-views.component.scss'],
  animations: egretAnimations
})

export class HeaderViewsComponent implements OnInit {

  // Chart grid options
  doughnutChartColors1: any[] = [{
    backgroundColor: ['green', '#F89F5B']
  }];
  

  doughnutChartColors2: any[] = [{
    backgroundColor: ['#ff6600', '#F89F5B', 'rgb(210, 212, 41)', '#D32D26','rgba(0, 0, 0, 0.87)']
  }];
  

  doughnutChartColors3: any[] = [{
    backgroundColor: ['green', '#D32D26', 'rgba(0, 0, 0, 0.87)']
  }];
  doughnutLabels1 = ['Libres', 'Asignados'];
  doughnutLabels2 = ['Por asignar', 'Asignados','En curso', 'Desviados', 'Rechazados'];
  doughnutLabels3 = ['En tiempo', 'Atrasados', 'Cancelados'];
  doughnutLabels4 = ['En tiempo', 'Atrasados', 'Cancelados'];
  doughnutLabels5 = ['Libres', 'Sin Ubicación'];
  total1: number = 68;
  data1: number = 36;
  data2: number = 26;
  totalpa: number = 72;
  total2: number = 72;
  data21: number = 36;
  data22: number = 16;
  
  total3: number = 72;
  data31: number = 36;
  data32: number = 16;
  doughnutChartData1: number[] = [this.total1, this.data1, this.data2];
  doughnutChartData2: number[] = [1, 1, 1, 1,1];
  doughnutChartData3: number[] = [this.total3, this.data31, this.data32];
  doughnutChartData4: number[] = [this.total3, this.data31, this.data32];
  doughnutChartData5: number[] = [this.total1, this.data1];
  
  sharedChartOptions: any = {
    responsive: true,
    // maintainAspectRatio: false,
    legend: {
      display: false,
      position: 'right'
    }
  };
  barChartLegend = true;
  doughnutChartType = 'doughnut';
  
  doughnutOptions: any = Object.assign({
    elements: {
      arc: {
        borderWidth: 0
      }
    }
  }, this.sharedChartOptions);

  pedido2: Pedido;
  public getItemSub: Subscription;
  cantidadPedidos = 0;
  cantidadChoferesOcupados = 0;
  cantidadChoferes = 0;
  cantidadViajesActivos = 0;
  cantidadViajesPendiente = 0;
  cantidadPorAsignar = 0;
  cantidadAsignados = 0;
  cantidadPedidosEntiempo = 0;
  cantidadPedidosatrasados = 0;
  cantidad_choferes_en_pos_00= 0;
  totalviajes = 0;
  viajesdesvios = 0;
  viajesrechazos = 0;
  pedidosCancelados = 0;
  totalviajesintermediarios = 0;
  viajesintermediariosasignados = 0;
  viajesintermediariosporasignar = 0;
  showCentro = false;
  showDador = false;
  rolAdminMuvin = false;
  escliente = false;
  esOperador = false;

  interval: any;
  show = false;

  constructor(private nomecladoresServices: NomencladoresService,
    private translate: TranslateService, private dialog: MatDialog) { }

  ngOnInit() {
    let rol: string = localStorage.getItem('rol');
    let cliente: string = localStorage.getItem('clienteMuvin');

    if (rol === '1') {
      this.showCentro = true;
      this.rolAdminMuvin = true;
    }
    if (rol === '5') {
      this.showDador = true;
    }
    if (rol === '3' || rol === '11') {
      if (cliente === '0') {
        this.escliente = true;
      }
    }
    if (rol === '11') {
      this.esOperador = true;
    }
    this.getItems();
    //this.getAds();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  getItems() {
    if (this.rolAdminMuvin) {
      this.getItemSub = this.nomecladoresServices.getDatosMuvin()
        .subscribe(data => {
          this.pedido2 = data.data;
          this.cantidadPedidos = parseInt(data.data.cantidad_pedidos_activos, 10);
          this.cantidadChoferes = this.total1 = data.data.cantidad_choferes;
          this.cantidadChoferesOcupados = this.data1 = data.data.cantidad_choferes_ocupados;
          this.cantidad_choferes_en_pos_00 =  data.data.cantidad_choferes_en_pos_00;
          this.cantidadViajesActivos = parseInt(data.data.viajes_activo, 10);
          this.cantidadViajesPendiente = data.data.viajes_pendientes;
          this.cantidadPorAsignar = data.data.cantidad_viajes - data.data.viajes_asignados;
          this.cantidadAsignados = parseInt(data.data.viajes_asignados, 10);
          this.doughnutChartData1 = [(this.cantidadChoferes - this.cantidadChoferesOcupados), this.cantidadChoferesOcupados];   
          this.doughnutChartData5 = [(this.cantidadChoferes - this.cantidadChoferesOcupados), this.cantidad_choferes_en_pos_00];  
          this.cantidadPedidosEntiempo = parseInt(data.data.pedidos_en_tiempo, 10);
          this.cantidadPedidosatrasados = parseInt(data.data.pedidos_atrasados, 10);
          this.pedidosCancelados = parseInt(data.data.cantidad_pedidos_bloqueados, 10);
          this.doughnutChartData3 = [this.cantidadPedidosEntiempo, this.cantidadPedidosatrasados, this.pedidosCancelados];
          this.totalviajes = parseInt(data.data.viajes_activo, 10);
          this.viajesdesvios = parseInt(data.data.viajes_desviados, 10);
          this.viajesrechazos = parseInt(data.data.viajes_rechazados, 10);
          this.doughnutChartData2 = [this.cantidadPorAsignar, this.totalviajes, this.viajesdesvios, this.viajesrechazos];
          this.doughnutChartData1 = [(this.cantidadChoferes - this.cantidadChoferesOcupados), this.cantidadChoferesOcupados];            
          this.doughnutChartData2 = [this.cantidadPorAsignar, this.cantidadAsignados, this.viajesdesvios, this.totalviajes,this.viajesdesvios,this.viajesrechazos];            
            this.doughnutChartData3 = [this.cantidadChoferes-this.cantidadChoferesOcupados, this.cantidadChoferesOcupados];
            this.doughnutChartData4 = [this.viajesintermediariosporasignar,this.viajesintermediariosasignados];
            this.doughnutChartData5 = [(this.cantidadChoferes - this.cantidad_choferes_en_pos_00), this.cantidad_choferes_en_pos_00];              
        });
    } else {
      if (this.showDador) {
        this.getItemSub = this.nomecladoresServices.getDatosDador()
          .subscribe(data => {
            this.pedido2 = data.data;
            this.cantidadPedidos = parseInt(data.data.cantidad_pedidos_activos, 10);
            this.cantidadChoferes = this.total1 = data.data.cantidad_choferes;
            this.cantidadChoferesOcupados = this.data1 = data.data.cantidad_choferes_ocupados;
            this.cantidadViajesActivos = parseInt(data.data.viajes_activo, 10);
            this.cantidadViajesPendiente = data.data.viajes_pendientes;
            this.cantidadPorAsignar = data.data.cantidad_viajes - data.data.viajes_asignados;
            this.cantidadAsignados = parseInt(data.data.viajes_asignados, 10);
            /* this.doughnutChartData1 = [(this.cantidadChoferes - this.cantidadChoferesOcupados), this.cantidadChoferesOcupados]; */
            this.cantidadPedidosEntiempo = parseInt(data.data.pedidos_en_tiempo, 10);
            this.cantidadPedidosatrasados = parseInt(data.data.pedidos_atrasados, 10);
            this.pedidosCancelados = parseInt(data.data.cantidad_pedidos_bloqueados, 10);
            this.doughnutChartData3 = [this.cantidadPedidosEntiempo, this.cantidadPedidosatrasados, this.pedidosCancelados];
            this.totalviajes = parseInt(data.data.viajes_activo, 10);
            this.viajesdesvios = parseInt(data.data.viajes_desviados, 10);
            this.viajesrechazos = parseInt(data.data.viajes_rechazados, 10);
            this.doughnutChartData2 = [this.cantidadPorAsignar, this.totalviajes, this.viajesdesvios, this.viajesrechazos];
          });
      } else {
        this.getItemSub = this.nomecladoresServices.getDatosCentro()
          .subscribe(data => {
            this.pedido2 = data.data;
            this.cantidadPedidos = parseInt(data.data.cantidad_pedidos_activos, 10);
            this.cantidadChoferes = this.total1 = data.data.cantidad_choferes;
            this.cantidadChoferesOcupados = this.data1 = data.data.cantidad_choferes_ocupados;
            this.cantidad_choferes_en_pos_00 =  data.data.cantidad_choferes_en_pos_00;
            this.cantidadViajesActivos = parseInt(data.data.viajes_activo, 10);
            this.cantidadViajesPendiente = data.data.viajes_pendientes;
            this.cantidadPorAsignar = data.data.cantidad_viajes - data.data.viajes_asignados;
            this.cantidadPedidosEntiempo = parseInt(data.data.pedidos_en_tiempo, 10);
            this.cantidadPedidosatrasados = parseInt(data.data.pedidos_atrasados, 10);
            this.pedidosCancelados = parseInt(data.data.cantidad_pedidos_bloqueados, 10);            
            this.totalviajes = parseInt(data.data.viajes_activo, 10);
            this.viajesdesvios = parseInt(data.data.viajes_desviados, 10);
            this.viajesrechazos = parseInt(data.data.viajes_rechazados, 10);
            this.cantidadAsignados = parseInt(data.data.viajes_asignados, 10);            
            this.viajesintermediariosasignados = parseInt(data.data.viajes_asignados_intermediarios, 10);
            if (parseInt(data.data.total_viajes_intermediarios, 10) > 0) {
              this.viajesintermediariosporasignar = parseInt(data.data.total_viajes_intermediarios, 10) - parseInt(data.data.viajes_asignados_intermediarios, 10);              
            };
            this.doughnutChartData1 = [this.cantidadPedidosEntiempo, this.cantidadPedidosatrasados,this.pedidosCancelados];            
            this.doughnutChartData2 = [this.cantidadPorAsignar, this.cantidadAsignados, this.viajesdesvios, this.totalviajes,this.viajesdesvios,this.viajesrechazos];            
            this.doughnutChartData3 = [this.cantidadChoferes-this.cantidadChoferesOcupados, this.cantidadChoferesOcupados];
            this.doughnutChartData4 = [this.viajesintermediariosporasignar,this.viajesintermediariosasignados];
            this.doughnutChartData5 = [(this.cantidadChoferes - this.cantidad_choferes_en_pos_00), this.cantidad_choferes_en_pos_00];              
          });
      }
    }
  }

  getAds() {
    this.interval = setInterval(() => {
      this.getItems();
    }, 60000);
  }

  openPopUpSeleccionarPedido(data: any = {}) {
    let title = 'Seleccionar ';
    let tipoPedido = 0;
    //this.busqueda=data;
    let dialogRef: MatDialogRef<any> = this.dialog.open(SeleccionarPedidoComponent, {
      width: '540px',
      height: '450px',
      disableClose: false,
      data: { title: title, payload: data, tipoPedido: tipoPedido }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        // this.loader.open();
        if (res.tipoPedido != undefined) {
          switch (res.tipoPedido) {
            case 1:
              this.gotoAddPedido();
              break;
            case 2:
              this.gotoAddPedidoRetorno();
              break;
            case 3:
              this.gotoAddPedidoCorto();
              break;
            default:
              this.gotoAddPedido();
              break;
          }
        }

      });
  }
  gotoAddPedido() {
    let title = 'Agregar Pedido';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPedidoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title }
    });
  }

  gotoAddPedidoRetorno() {
    let title = 'Agregar Pedido Retorno';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPedidoRetornoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title }
    });
  }
  gotoAddPedidoCorto() {
    let title = 'Agregar Pedido Corto';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPedidoCortoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title }
    });
  }
  gotoAddPedidoDador() {
    let title = 'Agregar Pedido';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPedidoDadorComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title }
    });
  }

  gotoAddPedidoRetornoDador() {
    let title = 'Agregar Pedido Retorno';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPedidoDadorRetornoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title }
    });
  }
  gotoAddPedidoRetornoDadorCorto() {
    let title = 'Agregar Pedido Corto';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddPedidoDadorCortoComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title }
    });
  }

  desplejarPanel() {
    this.show = true;
  }
  recogerPanel() {
    this.show = false;
  }
  /*
  * Doughnut Chart Event Handler
  */
 public doughnutChartClicked(e: any): void {
}
public doughnutChartHovered(e: any): void {
}
}
