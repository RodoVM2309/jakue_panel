import { Component, OnInit, Inject, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog,  MatSnackBar, MatSidenav, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MediaChange, ObservableMedia } from "@angular/flex-layout";
import { Router } from '@angular/router';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';

import { NomencladoresService } from '../../../shared/services/nomencladores.service';
import { Page } from 'app/shared/models/page';
import { CentrosService } from 'app/shared/services/centros.service';
import { CentroProductoService } from 'app/shared/services/centro-producto.service';
import { AddListaComponent } from '../lista-turneada/add-lista/add-lista.component';
import { ListaChoferesComponent } from '../lista-turneada/lista-choferes/lista-choferes.component';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';

import { CentroProducto } from 'app/shared/models/centro-producto';
import { Producto } from 'app/shared/models/producto';

import { egretAnimations } from "app/shared/animations/egret-animations";
import { MessageService } from 'app/shared/services/message.service';
import { UserService } from 'app/shared/services/user.service';

export class Lista {
  id?: number;
  id_centro: number;
  nombre: string;
}
export class CentroDador {
  id: number;
  cuit: string;
  nombre_persona: string;
}
export class RestCentroDador {
  id: number;
  cuit: string;
  razon_social: string;
}

@Component({
  selector: 'app-configurar-centro',
  templateUrl: './configurar-centro.component.html',
  styleUrls: ['./configurar-centro.component.scss'],
  animations: egretAnimations
})
export class ConfigurarCentroComponent implements OnInit, OnDestroy {
  public itemForm: FormGroup;
  public itemFormNotificaciones: FormGroup;
  public itemFormOtrasConfiguraciones: FormGroup;
  public itemFormStop: FormGroup;
  public getItemSub: Subscription;
  isMobile;
  screenSizeWatcher: Subscription;
  isSidenavOpen: Boolean = true;
  selectToggleFlag = false;
  @ViewChild(MatSidenav) private sideNav: MatSidenav;
  horas: number = 0;
  horasInicial: number = 0;
  km: number = 0;
  id_centro = '';
  newConfiguracion = true;
  kmInicial: number = 0;
  submitted = false;
  incorrect_emails: boolean = false;
  tipoTurneados = [
    { id: 0, descripcion: 'Sin turneado' },
    { id: 1, descripcion: 'Por histórico de viajes' },
    { id: 2, descripcion: 'Por orden de llegada' }
  ];
  tipoAccion = [
    { id: 1, descripcion: 'Pérdida de turno' },
    { id: 2, descripcion: 'Ocupa último lugar' }
  ];
  mostrarTurneado: boolean = false;
  tipoAccionSeleccionado: number = 1;
  isInteligencia: boolean = true;
  isNotificaciones: boolean = false;
  isOtrasConfig: boolean = false;
  isStop: boolean = false;
  isTurneado: boolean = false;
  isProducto: boolean = false;
  isAddProduct: boolean = false;
  isDadorCupo: boolean = false;
  isAddDadorCupo: boolean = false;
  esDador: boolean = localStorage.getItem('esDadorCupo') == '1' ? true : false;
  esClienteFinal: boolean = localStorage.getItem('esClienteFinal') == '1' ? true : false;;
  listas: Lista[];
  centroProducto: CentroProducto[];
  restProductos: Producto[];
  restDadores: RestCentroDador[] = [];
  centroDadores: CentroDador[] = [];
  public page = new Page();
  public pageCount: number;
  displayedColumns: string[] = ['cuit', 'razon_social', 'acciones'];
  dataSource: any;
  constructor(public router: Router, private formBuilder: FormBuilder,
    private loader: AppLoaderService, private alertService: AppAlertService,
    private errorService: AppErrorService, private nomencladoresService: NomencladoresService,
    public centroService: CentrosService, private dialog: MatDialog,
    private media: ObservableMedia, private confirmService: AppConfirmService,
    private centroProductoService: CentroProductoService, private snack: MatSnackBar,
    private messageService: MessageService,  private userService: UserService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.inboxSideNavInit();
    this.getItems();
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
    .subscribe(data => this.id_centro = data.data);
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
    if (this.screenSizeWatcher) {
      this.screenSizeWatcher.unsubscribe()
    }
  }
  stopProp(e) {
    e.stopPropagation()
  }

  updateSidenav() {
    let self = this;
    setTimeout(() => {
      self.isSidenavOpen = !self.isMobile;
      self.sideNav.mode = self.isMobile ? 'over' : 'side';
    })
  }
  inboxSideNavInit() {
    this.isMobile = this.media.isActive('xs') || this.media.isActive('sm');
    this.updateSidenav();
    this.screenSizeWatcher = this.media.subscribe((change: MediaChange) => {
      this.isMobile = (change.mqAlias == 'xs') || (change.mqAlias == 'sm');
      this.updateSidenav();
    });
  }
  getItems() {
    this.itemForm = this.formBuilder.group({
      'horas': [null, [Validators.required, Validators.min(0), Validators.max(48)]],
      'condiciones_viaje': [null, Validators.required],
      'km': [null, [Validators.required, Validators.min(10), Validators.max(200)]]
    });
    this.itemFormNotificaciones = this.formBuilder.group({
      'email': [null]
    });
    this.itemFormOtrasConfiguraciones = this.formBuilder.group({
      'id_tipo_turneada': [0],
      'tipoAccionSeleccionado': [1],

    });
    this.itemFormStop = this.formBuilder.group({
      'api_key': ['', [Validators.required]]
    });

    this.getItemSub = this.nomencladoresService.getConfiguracionCentro()
      .subscribe(data => {
        this.horasInicial = data.data.horas;
        this.kmInicial = data.data.km;
        this.itemForm.setValue({
          horas: data.data.horas,
          km: data.data.km,
          condiciones_viaje: data.data.condiciones_viaje
        });
        this.itemFormNotificaciones.setValue({
          email: data.data.email_postulacion
        });
        this.itemFormStop.setValue({
          api_key: data.data.api_key_externa
        })
        this.itemFormOtrasConfiguraciones.setValue({
          id_tipo_turneada: data.data.id_tipo_turneada,
          tipoAccionSeleccionado: data.data.id_tipo_turneada == 2 ? data.data.accion_rechazo_viaje : 0
        });
        this.mostrarTurneado = (data.data.id_tipo_turneada !== 0) ? true : false;
        this.newConfiguracion = false;
        if (this.mostrarTurneado) {
          this.getListaCentro(data.data.id_tipo_turneada);
        }
      });
  }


  onChangeTipoTurneada(valor) {
    if (valor == 2)
      this.itemFormOtrasConfiguraciones.controls["tipoAccionSeleccionado"].setValue(1);
    else
      this.itemFormOtrasConfiguraciones.controls["tipoAccionSeleccionado"].setValue(0);
  }

  openPopUp(data: any = {}, isNew?) {
    data.id_tipo_turneada = this.itemFormOtrasConfiguraciones.controls["id_tipo_turneada"].value;
    let title = isNew ? "Agregar Lista" : "Modificar Lista";
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddListaComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.getListaCentro(this.itemFormOtrasConfiguraciones.controls["id_tipo_turneada"].value);
    });
  }

  openPopUp2(data: any = {}) {
    let title = "Lista de choferes";
    let dialogRef: MatDialogRef<any> = this.dialog.open(ListaChoferesComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: data }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
    });
  }

  getListaCentro(id_tipo_turneada) {
    this.getItemSub = this.centroService.getAllListaCentro(id_tipo_turneada)
      .subscribe(data => {
        this.listas = data.data;
      });
  }
  getCentroProducto() {
    this.getItemSub = this.centroProductoService.getCentroProducto()
      .subscribe(data => {
        this.centroProducto = data.data;
      });
  }
  getAllProductos() {
    this.restProductos = [];
    this.getItemSub = this.nomencladoresService.getAllProductosSelect2()
      .subscribe(data => {
        data.data.forEach(element => {
          let existe: boolean = false;
          this.centroProducto.forEach(centProd => {
            if (centProd.id == element.id) {
              existe = true;
            }
          })
          if (!existe) {
            this.restProductos.push(element)
          }
        })

      });
  }

  get f() { return this.itemForm.controls; }

  submit() {
    let datos = {
      id_centro: this.id_centro,
      horas: this.f.horas.value,
      km: this.f.km.value,
      condiciones_viaje: (this.f.condiciones_viaje.value ? 1 : 0)
    };
    this.loader.open();
    if (this.newConfiguracion) {
      this.getItemSub = this.nomencladoresService.postConfiguracionCentro(datos)
        .subscribe(data => {
          this.loader.close();
          this.alertService.confirm({ message: '¡Configuración del Centro guardada correctamente!', tipo: 'exito' }).subscribe(res => {
            if (res) {
              this.router.navigateByUrl('/panel-pedido/pedido');
            }
          });
        });
    } else {
      this.getItemSub = this.nomencladoresService.putConfiguracionCentro(datos)
        .subscribe(data => {
          this.loader.close();
          this.alertService.confirm({ message: '¡Configuración del Centro guardada correctamente!', tipo: 'exito' }).subscribe(res => {
            if (res) {
              this.router.navigateByUrl('/panel-pedido/pedido');
            }
          });
        },
          err => {
            this.loader.close();
            this.errorService.confirm({ message: 'La configuración del centro no se pudo guardar, intentelo nuevamente' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          });
    }

    this.loader.close();
  }

  closeForm() {
    this.router.navigateByUrl('/panel-pedido/pedido');
  }

  comprobarEmails() {
    let info_emails = [];
    this.incorrect_emails = false;
    this.itemFormNotificaciones.invalid;
    if (this.itemFormNotificaciones.controls["email"].value.toString() !== "") {
      let emailsparam = this.itemFormNotificaciones.controls["email"].value.toString();
      info_emails = emailsparam.split(";");
      for (let i = 0; i < info_emails.length; i++) {
        if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(info_emails[i])) {
          this.itemFormNotificaciones.controls["email"].markAsDirty();
          this.incorrect_emails = true;
          return;
        }
      }
      this.incorrect_emails = false;
    } else {
      this.itemFormNotificaciones.valid;
      this.incorrect_emails = false;
    }
  }

  submitNotificaciones() {
    let datos = {
      id_centro: this.id_centro,
      email_postulacion: this.itemFormNotificaciones.controls["email"].value
    };
    this.loader.open();
    this.getItemSub = this.nomencladoresService.putConfiguracionCentro(datos)
      .subscribe(data => {
        this.loader.close();
        this.alertService.confirm({ message: '¡Configuración del Centro guardada correctamente!', tipo: 'exito' }).subscribe(res => {
          if (res) {
            this.router.navigateByUrl('/panel-pedido/pedido');
          }
        });
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'La configuración del centro no se pudo guardar, intentelo nuevamente' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
  }

  submitOtrasConfiguraciones() {
    let datos = {
      id_centro: this.id_centro,
      id_tipo_turneada: this.itemFormOtrasConfiguraciones.controls["id_tipo_turneada"].value,
      accion_rechazo_viaje: this.itemFormOtrasConfiguraciones.controls["id_tipo_turneada"].value == 2 ? this.itemFormOtrasConfiguraciones.controls["tipoAccionSeleccionado"].value : 0,
    };
    this.loader.open();
    this.getItemSub = this.nomencladoresService.putConfiguracionCentro(datos)
      .subscribe(data => {
        this.loader.close();
        this.alertService.confirm({ message: '¡Configuración del Centro guardada correctamente!', tipo: 'exito' }).subscribe(res => {
          if (res) {
            localStorage.setItem('tipo_turneada', this.itemFormOtrasConfiguraciones.controls["id_tipo_turneada"].value);
            if (this.itemFormOtrasConfiguraciones.controls["id_tipo_turneada"].value == 0) {
              this.messageService.sendMessage('QuitarTurneada');
              this.mostrarTurneado = false;
            }
            else {
              this.messageService.sendMessage('AddTurneada');
              if (this.itemFormOtrasConfiguraciones.controls["id_tipo_turneada"].value == 2)
                this.messageService.sendMessage('AddTurneadaConfirmarArribo');
              else
                this.messageService.sendMessage('QuitarTurneadaConfirmarArribo');
              this.mostrarTurneado = true;
            }

          }
        });
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'La configuración del centro no se pudo guardar, intentelo nuevamente' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
  }
  submitStop() {
    let datos = {
      id_centro: this.id_centro,
      api_key_externa: this.itemFormStop.controls["api_key"].value
    };
    this.loader.open();
    this.getItemSub = this.nomencladoresService.putConfiguracionCentro(datos)
      .subscribe(data => {
        this.loader.close();
        this.alertService.confirm({ message: '¡Configuración del Centro guardada correctamente!', tipo: 'exito' }).subscribe(res => {
          if (res) {
            this.router.navigateByUrl('/panel-pedido/pedido');
          }
        });
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'La configuración del centro no se pudo guardar, intentelo nuevamente' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
  }

  activeInteligencia() {
    this.isInteligencia = true;
    this.isNotificaciones = false;
    this.isOtrasConfig = false;
    this.isStop = false;
    this.isTurneado = false;
    this.isProducto = false;
    this.isDadorCupo = false;
  }
  activeNotificacion() {
    this.isInteligencia = false;
    this.isNotificaciones = true;
    this.isOtrasConfig = false;
    this.isStop = false;
    this.isTurneado = false;
    this.isProducto = false;
    this.isDadorCupo = false;
  }
  activeOtrasConfig() {
    this.isInteligencia = false;
    this.isNotificaciones = false;
    this.isOtrasConfig = true;
    this.isStop = false;
    this.isTurneado = false;
    this.isProducto = false;
    this.isDadorCupo = false;
  }
  activeStop() {
    this.isInteligencia = false;
    this.isNotificaciones = false;
    this.isOtrasConfig = false;
    this.isStop = true;
    this.isTurneado = false;
    this.isProducto = false;
    this.isDadorCupo = false;
  }
  activeTurneado() {
    this.isInteligencia = false;
    this.isNotificaciones = false;
    this.isOtrasConfig = false;
    this.isStop = false;
    this.isTurneado = true;
    this.isProducto = false;
    this.isDadorCupo = false;
  }
  activeProductos() {
    this.refreshProducto();
    this.isInteligencia = false;
    this.isNotificaciones = false;
    this.isOtrasConfig = false;
    this.isStop = false;
    this.isTurneado = false;
    this.isProducto = true;
    this.isAddProduct = true;
    this.isDadorCupo = false;
  }
  activeDadorCupo() {
    this.refreshDadores();
    this.isInteligencia = false;
    this.isNotificaciones = false;
    this.isOtrasConfig = false;
    this.isStop = false;
    this.isTurneado = false;
    this.isProducto = false;
    this.isAddProduct = false;
    this.isDadorCupo = true;
    this.isAddDadorCupo = true;
  }

  addProducto() {
    this.isAddProduct = true;
    this.getAllProductos();
  }

  getRowHeight(row) {
    return row.height;
  }

  refreshProducto() {
    this.getItemSub = this.centroProductoService.getCentroProducto()
      .subscribe(data => {
        this.centroProducto = data.data;
        this.restProductos = [];
        this.nomencladoresService.getAllProductosSelect2()
          .subscribe(data2 => {
            data2.data.forEach(element => {
              let existe: boolean = false;
              this.centroProducto.forEach(centProd => {
                if (centProd.id == element.id) {
                  existe = true;
                }
              })
              if (!existe) {
                this.restProductos.push(element)
              }
            })

          });
      });
  }
  refreshDadores() {
    this.loader.open();
    this.getItemSub = this.centroService.getDadoresCentro()
      .subscribe(data => {
        this.centroDadores = data.data;
        this.restDadores = [];
        this.centroService.getAllDadores()
          .subscribe(data2 => {
            data2.data.forEach(element => {
              let existe: boolean = false;
              this.centroDadores.forEach(centProd => {
                if (centProd.id == element.id) {
                  existe = true;
                }
              })
              if (!existe) {
                this.restDadores.push(element)
              }
            });
            this.dataSource = new MatTableDataSource(this.restDadores);
            this.loader.close();

          },
          err => {
            this.loader.close();
            this.errorService.confirm({ message: 'Error, al buscar los dadores' }).subscribe(res => {
              if (res) {
                return;
              }
            })
          });
      },
      err => {
        this.loader.close();
        this.errorService.confirm({ message: 'Error, al buscar los dadores' }).subscribe(res => {
          if (res) {
            return;
          }
        })
      });
  }

  excluirProductoCentro(producto) {
    this.confirmService.confirm({ message: '¿Está seguro de excluir el producto ' + producto.descripcion + ' del centro ?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.getItemSub = this.centroProductoService.postCentroProducto(producto)
            .subscribe(data => {
              this.loader.close();
              this.alertService.confirm({ message: '¡Producto excluido del centro correctamente!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  this.refreshProducto();
                }
              });
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Error, al guardar el excluir el producto del centro' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });

  }

  incluirProductoCentro(row: CentroProducto) {
    this.confirmService.confirm({ message: '¿Está seguro de incluir el producto ' + row.descripcion + ' al centro ?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.centroProductoService.deleteCentroProducto(row)
            .subscribe(data => {
              this.loader.close();
              this.refreshProducto();
              this.snack.open('Producto incluido al centro!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Este producto no se puede incluir al centro' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }



}
