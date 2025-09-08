import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HomeService } from '../home.service';
import { PedidoDifundido } from '../../../models/pedidoDifundido';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { AppErrorService } from '../../../../shared/services/app-error/app-error.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-difusiones',
  templateUrl: './difusiones.component.html',
  styleUrls: ['./difusiones.component.scss'],
  providers: [HomeService]
})
export class DifusionesComponent implements OnInit {
  public getItemSub: Subscription;
  difusiones: any;
  pedidosPostulados: PedidoDifundido[] = [];
  postulados: PedidoDifundido[] = [];
  pedidosPublicos: PedidoDifundido[] = [];
  publicos: PedidoDifundido[] = [];
  rol: string;
  idCentro: string;
  idPedido: number;
  isPostular: boolean;
  addPostulacion: FormGroup;
  indexNavPublicos: number = 0;
  indexPublicos: number = 0;
  indexNavPostulados: number = 0;
  indexPostulados: number = 0;

  selec: Array<number>;

  constructor(private homeService: HomeService, private loader: AppLoaderService,
    private alertService: AppAlertService, private errorService: AppErrorService,
    public router: Router) {
    this.selec = [];
  }

  ngOnInit() {
    this.rol = localStorage.getItem('rol');
    this.getItems();
    this.addPostulacion = new FormGroup({
      quantity: new FormControl(0, [Validators.required])
    })
  }

  getItems() {
    this.loader.open('Cargando los datos...');
    this.getItemSub = this.homeService.getPedidoPublicos(this.rol, 1)
      .subscribe(data => {
        this.loader.close();
        this.difusiones = data.data;
        this.pedidosPostulados = [];
        this.pedidosPublicos = [];
        for (let index = 0; index < this.difusiones.length; index++) {
          this.difusiones[index].pedidos.forEach(pedidos => {
            let tempDifusion = new PedidoDifundido();
            tempDifusion.cantidad = parseInt(pedidos.cantidad);
            tempDifusion.cantidad_choferes_postulados = parseInt(pedidos.cantidad_choferes_postulados);
            tempDifusion.carga_peligrosa = parseInt(pedidos.carga_peligrosa);
            tempDifusion.centro = pedidos.centro;
            tempDifusion.condiciones_pago = pedidos.condiciones_pago;
            tempDifusion.cupos_obligatorio_producto = parseInt(pedidos.cupos_obligatorio_producto);
            tempDifusion.da_efectivo = pedidos.da_efectivo;
            tempDifusion.da_gasoil = pedidos.da_gasoil;
            tempDifusion.fecha_desde = pedidos.fecha_desde;
            tempDifusion.fecha_hasta = pedidos.fecha_hasta;
            tempDifusion.id = parseInt(pedidos.id);
            tempDifusion.id_centro = parseInt(pedidos.id_centro);
            tempDifusion.id_cliente = parseInt(pedidos.id_cliente);
            tempDifusion.id_generador = parseInt(pedidos.id_generador);
            tempDifusion.id_medio_pago = parseInt(pedidos.id_medio_pago);
            tempDifusion.id_origen = parseInt(pedidos.id_origen);
            tempDifusion.id_pedido = parseInt(pedidos.id_pedido);
            tempDifusion.id_producto = parseInt(pedidos.id_producto);
            tempDifusion.id_zona_destino = parseInt(pedidos.id_zona_destino);
            tempDifusion.latitud = parseInt(pedidos.latitud);
            tempDifusion.km = (pedidos.km === null || pedidos.km === undefined) ? 0 : parseInt(pedidos.km);
            tempDifusion.kilometros = (pedidos.kilometros === null || pedidos.kilometros === undefined) ? 0 : parseInt(pedidos.kilometros);
            tempDifusion.localidad_carga = pedidos.localidad_carga;
            tempDifusion.medio_pago = pedidos.medio_pago;
            tempDifusion.nombre_dador = pedidos.nombre_dador;
            tempDifusion.nombre_generador = pedidos.nombre_generador;
            tempDifusion.nombre_lugar_carga = pedidos.nombre_lugar_carga;
            tempDifusion.nombre_producto = pedidos.nombre_producto;
            tempDifusion.observaciones = pedidos.observaciones;
            tempDifusion.longitud = parseInt(pedidos.longitud);
            tempDifusion.postulado = parseInt(pedidos.postulado);
            tempDifusion.precio_viaje = (pedidos.precio_viaje === null || pedidos.precio_viaje === undefined) ? 0 : parseInt(pedidos.precio_viaje);
            tempDifusion.precio_viaje2 = (pedidos.precio_viaje2 === null || pedidos.precio_viaje2 === undefined) ? 0 : parseInt(pedidos.precio_viaje2);
            tempDifusion.reduccion = parseInt(pedidos.reduccion);
            tempDifusion.telefono_contacto = pedidos.telefono_contacto;
            tempDifusion.zona_destino = pedidos.zona_destino;
            tempDifusion.zona_destino_pedido = pedidos.zona_destino_pedido;
            tempDifusion.tipo = parseInt(pedidos.tipo);
            tempDifusion.tipo_precio = parseInt(pedidos.tipo_precio);
            tempDifusion.showDetalles = false;
            console.log('Postulado', tempDifusion.postulado);
            if (tempDifusion.postulado === 1) {
              this.pedidosPostulados.push(tempDifusion);
            } else {
              this.selec.push(0);
              this.pedidosPublicos.push(tempDifusion);
            }
            this.actualizarDifusiones('init');
            this.actualizarPostulaciones('init');
          });
        }
      }, err => {
        this.loader.close();
        this.errorService.confirm({ message: err.message }).subscribe(res => {
          if (res) {
            this.router.navigateByUrl('/panel-pedido/pedido');
            return;
          }
        });
      });

  }

  irPostularme(pedido) {
    this.isPostular = true;
    this.f.quantity.setValue(0);
    this.idPedido = pedido;

  }

  cancelar() {
    this.isPostular = false;
  }
  postularme(i, pedido) {
    this.loader.open('Postulando...');
    this.idPedido = pedido;
    //let cantidad = this.f.quantity.value;
    const cantidad = this.selec[i];
    this.isPostular = false;
    if (this.rol === '4') {
      this.getItemSub = this.homeService.postPostularPedidoPublicoTransportista(pedido.id, cantidad)
        .subscribe(data => {
          this.selec = [];
          this.loader.close();
          this.getItems();
          this.alertService.confirm({ message: '¡Postulado correctamente!', tipo: 'exito' })
            .subscribe(res => {
              if (res) {
                return;
              }
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'No se pudo postular al Pedido , intentelo nuevamente' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        },
          err => {
            this.loader.close();
            this.errorService.confirm({ message: 'No se pudo postular al Pedido , intentelo nuevamente' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          });
    } else {
      this.getItemSub = this.homeService.postPostularPedidoPublicoIntermediario(pedido.id, cantidad)
        .subscribe(data => {
          this.selec = [];
          this.loader.close();
          this.getItems();
          //this.f.quantity.setValue(0);
          this.alertService.confirm({ message: '¡Postulado correctamente!', tipo: 'exito' })
            .subscribe(res => {
              if (res) {
                return;
              }
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'No se pudo postular al Pedido , intentelo nuevamente' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        },
          err => {
            this.loader.close();
            this.errorService.confirm({ message: 'No se pudo postular al Pedido , intentelo nuevamente' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          });
    }

  }

  cancelarPostulacion(i, pedido) {
    this.idPedido = pedido;
    this.isPostular = false;
    this.loader.open('Cancelando postulación...');
    if (this.rol === '4') {
      this.getItemSub = this.homeService.cancelarPostuladoPedidoPublicoTransportista(pedido.id)
        .subscribe(data => {
          this.selec = [];
          this.loader.close();
          this.getItems();
          this.alertService.confirm({ message: '¡Cancelada la postulación correctamente!', tipo: 'exito' })
            .subscribe(res => {
              if (res) {
                return;
              }
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'No se pudo cancelar la postulación del Pedido , intentelo nuevamente' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        },
          err => {
            this.loader.close();
            this.errorService.confirm({ message: 'No se pudo cancelar la postulación , intentelo nuevamente' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          });
    } else {
      this.getItemSub = this.homeService.cancelarPostuladoPedidoPublicoIntermediario(pedido.id)
        .subscribe(data => {
          this.selec = [];
          this.loader.close();
          this.getItems();
          this.alertService.confirm({ message: '¡Cancelada la postulación correctamente!', tipo: 'exito' })
            .subscribe(res => {
              if (res) {
                return;
              }
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'No se pudo cancelar la postulación del Pedido , intentelo nuevamente' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        },
          err => {
            this.loader.close();
            this.errorService.confirm({ message: 'No se pudo cancelar la postulación del Pedido , intentelo nuevamente' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          });
    }
  }
  showDetalle(pedido) {
    pedido.showDetalles = true;
  }
  hideDetalle(pedido) {
    pedido.showDetalles = false;
  }

  get f() { return this.addPostulacion.controls; }

  validarCant(val, cantidad, index) {
    let value = parseInt(val);
    let cant = parseInt(cantidad);
    if (value < 0) {
      this.selec[index] = 0;
    }
    if (value > cant) {
      this.selec[index] = cant;
    }
  }

  actualizarDifusiones(accion) {
    var desde: number = 0;
    var hasta: number = 0;
    switch (accion) {
      case 'init':
        hasta = this.pedidosPublicos.length > 3 ? 3 : this.pedidosPublicos.length;
        this.publicos = [];
        for (let index = 0; index < hasta; index++) {
          const element = this.pedidosPublicos[index];
          this.publicos.push(element);
        }
        this.indexPublicos = 0;
        break;
      case 'next':
        this.indexNavPublicos++;
        var desde: number = this.indexNavPublicos * 3;
        var hasta: number = 0;
        hasta = this.pedidosPublicos.length - desde > 3 ? desde + 3 : this.pedidosPublicos.length;
        this.publicos = [];
        for (let index = desde; index < hasta; index++) {
          const element = this.pedidosPublicos[index];
          this.publicos.push(element);
        }
        this.indexPublicos = desde;
        break;
      case 'previos':
        this.indexNavPublicos--;
        var desde: number = this.indexNavPublicos * 3;
        var hasta: number = 0;
        hasta = this.pedidosPublicos.length - desde > 3 ? desde + 3 : this.pedidosPublicos.length;
        this.publicos = [];
        for (let index = desde; index < hasta; index++) {
          const element = this.pedidosPublicos[index];
          this.publicos.push(element);
        }
        this.indexPublicos = desde;

        break;
      case 'middle':
        desde = this.pedidosPublicos.length > 3 ? Math.floor(this.pedidosPublicos.length / 2) - 1 : 0;
        hasta = this.pedidosPublicos.length - desde > 3 ? desde + 3 : this.pedidosPublicos.length - desde;
        this.publicos = [];
        for (let index = desde; index < hasta; index++) {
          const element = this.pedidosPublicos[index];
          this.publicos.push(element);
        }
        this.indexPublicos = hasta;
        break;
      case 'last':
        hasta = this.pedidosPublicos.length > 3 ? this.pedidosPublicos.length - 3 : this.pedidosPublicos.length;
        this.publicos = [];
        for (let index = hasta; index < this.pedidosPublicos.length; index++) {
          const element = this.pedidosPublicos[index];
          this.publicos.push(element);
        }
        this.indexPublicos = hasta;
        break;
      default:
        break;
    }

  }
  actualizarPostulaciones(accion) {
    var desde: number = 0;
    var hasta: number = 1;
    switch (accion) {
      case 'init':
        hasta = 1;
        this.postulados = [];
        if (this.pedidosPostulados.length > 0 ) {
          for (let index = 0; index < hasta; index++) {
            const element = this.pedidosPostulados[index];
            this.postulados.push(element);
          }
        }
        this.indexPostulados = 0;
        break;
      case 'next':
        this.indexPostulados++;
        if (this.indexPostulados <= this.pedidosPostulados.length) {
          this.postulados = [];
          this.postulados.push(this.pedidosPostulados[this.indexPostulados]);
        } else {
          this.indexPostulados--;
        }
        break;
      case 'previos':
        this.indexPostulados--;
        if (this.indexPostulados >= 0) {
          this.postulados = [];
          this.postulados.push(this.pedidosPostulados[this.indexPostulados]);
        } else {
          this.indexPostulados++;
        }
        break;
      case 'middle':
        desde = this.pedidosPostulados.length > 3 ? Math.floor(this.pedidosPostulados.length / 2) - 1 : 0;
        hasta = this.pedidosPostulados.length - desde > 3 ? desde + 3 : this.pedidosPostulados.length - desde;
        this.postulados = [];
        for (let index = desde; index < hasta; index++) {
          const element = this.pedidosPostulados[index];
          this.postulados.push(element);
        }
        this.indexPostulados = hasta;
        break;
      case 'last':
        hasta = this.pedidosPostulados.length > 3 ? this.pedidosPostulados.length - 3 : this.pedidosPostulados.length;
        this.postulados = [];
        for (let index = hasta; index < this.pedidosPostulados.length; index++) {
          const element = this.pedidosPostulados[index];
          this.postulados.push(element);
        }
        this.indexPostulados = hasta;
        break;
      default:
        break;
    }

  }

}
