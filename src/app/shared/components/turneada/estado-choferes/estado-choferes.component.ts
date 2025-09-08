import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Page } from 'app/shared/models/page';
import { EstadosChoferService } from 'app/shared/services/estados-chofer.service';
import { MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
//import { AddEstadosChoferComponent } from './add-estados-chofer/add-estados-chofer.component';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { CentrosService } from 'app/shared/services/centros.service';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AddEstadoChoferComponent } from './add-estado-chofer/add-estado-chofer.component';
import { AddSancionViajeComponent } from './add-sancion-viaje/add-sancion-viaje.component';

export class EstadoChofer {
  id: number;
  razon_social?: string;
  id_centro?: number;
  id_chofer?: number;
  estado?: number;
  desde?: string;
  hasta?: string;
  estadodesc?: string;
  observaciones?: string;
  estado_chofer?: string;
}

export class Lista {
  id?: number;
  id_centro: number;
  nombre: string;
}

@Component({
  selector: 'app-estado-choferes',
  templateUrl: './estado-choferes.component.html',
  styleUrls: ['./estado-choferes.component.scss']
})
export class EstadoChoferesComponent implements OnInit {
  public listas: Lista[];
  public lista_chofer: any[];
  page = new Page();
  public getItemSub: Subscription;
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };
  filtro = '';
  datosChofer: any;
  nombre_persona = "";
  public id_tipo_turneada = 0;
  public mostrarTurneada: boolean = false;
  filtrarForm: FormGroup;
  id_lista: any;
  modoCentro: boolean = true
  modoLista = [
    { id: 0, descripcion: 'Centro' },
    { id: 1, descripcion: 'Lista de turneadas' }
  ];
  colorToggle = 'tabscarga';
  backgroundColorToggle = 'tabscarga';
  constructor(private estadoschoferService: EstadosChoferService,
    private dialog: MatDialog, private snack: MatSnackBar, private confirmService: AppConfirmService,
    public centroService: CentrosService, private nomencladoresService: NomencladoresService,
    private loader: AppLoaderService, private alertService: AppAlertService, private errorService: AppErrorService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.filtrarForm = new FormGroup({
      selectedLista: new FormControl(this.id_lista)
    });
    this.getItems();
    this.getListaEstadoChoferesCentro();
  }
  onChangeModo(value) {
    this.modoCentro = (value === 0) ? true : false;
    this.lista_chofer = [];
    if (this.modoCentro) {
      this.getListaEstadoChoferesCentro();
    } else {
      this.filtrarForm.controls['selectedLista'].setValue('');
      this.id_lista = null;
    }
  }
  getItems() {
    this.getItemSub = this.nomencladoresService.getConfiguracionCentro()
      .subscribe(data => {
        this.id_tipo_turneada = data.data.id_tipo_turneada;
        this.mostrarTurneada = (this.id_tipo_turneada !== 0) ? true : false;
        if (this.mostrarTurneada) {
          this.getListaCentro();
        }
      });

  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filtro = event.target.value.toLowerCase();
    this.getListaEstadoChoferesCentro();
  }
  getListaCentro() {
    this.getItemSub = this.centroService.getAllListaCentro(this.id_tipo_turneada)
      .subscribe(data => {
        this.listas = data.data;
      });
  }
  getListaEstadoChoferes() {
    this.getItemSub = this.centroService.getListaEstadoChoferes(this.id_lista)
      .subscribe(data => {
        this.lista_chofer = data.data;
        this.actEstadoDesc();
      });
  }

  getListaEstadoChoferesCentro() {
    this.getItemSub = this.centroService.getListaEstadoChoferesCentro(this.filtro)
      .subscribe(data => {
        this.lista_chofer = data.data;
        this.actEstadoDesc();
      });
  }
  
  actEstadoDesc() {
    for (let i = 0; i < this.lista_chofer.length; i++) {
      if (this.lista_chofer[i].estado_chofer  && this.lista_chofer[i].estado_chofer != '0') {
        this.lista_chofer[i].estadodesc = "Inactivo";
      } else {
        switch (this.lista_chofer[i].estado) {
          case '1':
            this.lista_chofer[i].estadodesc = "Inactivo";
            break;
          case '2':
            this.lista_chofer[i].estadodesc = "Sancionado";
            break;
          default:
            this.lista_chofer[i].estadodesc = "Activo";
            break;
        }
      }

    }
  }
  aplicarFiltro(value) {
    this.id_lista = value;
    this.getListaEstadoChoferes();
  }

  accionPremiar(row) {
    this.loader.open();
    let dat = {
      id_lista: this.id_lista,
      id_chofer: row.id_chofer,
      premio: (row.premio === null) ? 1 : parseInt(row.premio) + 1
    }
    this.estadoschoferService.updateListaChoferes(dat)
      .subscribe(data => {
        let dat2 = {
          id_lista: this.id_lista,
          id_chofer: row.id_chofer,
          premio: 1,
          fecha: new Date()
        }
        this.estadoschoferService.postHistoricoPremiosSanciones(dat2)
          .subscribe(data2 => {
            this.getListaEstadoChoferes();
            if (this.loader !== null) {
              this.loader.close();
            };
            this.alertService.confirm({ message: 'El chofer: ' + row.nombre_chofer + ' ha sido premiado!', tipo: 'exito' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          },
            err => {
              this.loader.close();
              this.errorService.confirm({ message: 'El chofer: ' + row.nombre_chofer + ' no se puede premiar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'El chofer: ' + row.nombre_chofer + ' no se puede premiar' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
  }

  accionSancionar(row) {
    this.loader.open();
    let dat = {
      id_lista: this.id_lista,
      id_chofer: row.id_chofer,
      sancion: row.sancion
    }
    /* let dat = {
      id_lista: this.id_lista,
      id_chofer: row.id_chofer,
      sancion: (row.sancion === null) ? 1 : parseInt(row.sancion) + 1
    } */
    this.estadoschoferService.updateListaChoferes(dat)
      .subscribe(data => {
        let dat2 = {
          id_lista: this.id_lista,
          id_chofer: row.id_chofer,
          sancion: 1,
          fecha: new Date()
        }
        this.estadoschoferService.postHistoricoPremiosSanciones(dat2)
          .subscribe(data2 => {
            this.getListaEstadoChoferes();
            if (this.loader !== null) {
              this.loader.close();
            };
            this.alertService.confirm({ message: 'El chofer: ' + row.nombre_chofer + ' ha sido sancionado!', tipo: 'exito' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          },
            err2 => {
              this.loader.close();
              this.errorService.confirm({ message: 'El chofer: ' + row.nombre_chofer + ' no se puede sancionar' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            })
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'El chofer: ' + row.nombre_chofer + ' no se puede sancionar' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
  }
  openPopUpEstados(data: any = {}) {
    let title = 'Estado del Chofer: ' + data.nombre_chofer;
    let isNew = (data.estado === null) ? true : false;
    const dialogRef: MatDialogRef<any> = this.dialog.open(AddEstadoChoferComponent, {
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
        if (this.modoCentro) {
          if (isNew) {
            this.estadoschoferService.postEstadoChofer(res)
              .subscribe(data => {
                this.getListaEstadoChoferesCentro();
                if (this.loader !== null) {
                  this.loader.close();
                };
                this.alertService.confirm({ message: '¡Estado Modificado!', tipo: 'exito' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              },
                err => {
                  this.loader.close();
                  this.errorService.confirm({ message: 'No se puede agregar el modificar.' }).subscribe(res => {
                    if (res) {
                      return;
                    }
                  });
                });
          } else {
            this.estadoschoferService.updateEstadoChofer(res)
              .subscribe(data => {
                this.getListaEstadoChoferesCentro();
                if (this.loader !== null) {
                  this.loader.close();
                };
                this.alertService.confirm({ message: 'Estado Modificado!', tipo: 'exito' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              },
                err => {
                  this.loader.close();
                  this.errorService.confirm({ message: 'Este estado no se puede modificar' }).subscribe(res => {
                    if (res) {
                      return;
                    }
                  });
                });
          }
        } else {
          res.id_lista = this.id_lista;
          this.estadoschoferService.updateListaChoferes(res)
            .subscribe(data => {
              this.getListaEstadoChoferes();
              if (this.loader !== null) {
                this.loader.close();
              };
              this.alertService.confirm({ message: 'Estado Modificado!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Este estado no se puede modificar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }
  openPopUpSancionCantViaje(data: any = {}) {
    let title = 'Sanción al Chofer: ' + data.nombre_chofer;
    const dialogRef: MatDialogRef<any> = this.dialog.open(AddSancionViajeComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        let dat = {
          id_chofer: data.id_chofer,
          sancion: (data.sancion === null) ? res.cantidad : parseInt(data.sancion) + res.cantidad,
          nombre_chofer: data.nombre_chofer
        };
        this.accionSancionar(dat);
      });
  }

}
