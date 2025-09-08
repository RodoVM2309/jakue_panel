import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { PersonasService } from './../../../shared/services/personas.service';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TrabajadoresService } from './../../../shared/services/trabajadores.service';
import { UserService } from './../../../shared/services/user.service';
import { Trabajador } from './../../../shared/models/trabajador';
import { Roles } from './../../../shared/models/roles';
import { PerfilComponent } from '../personas/perfil/perfil.component';
import { EditVencimientoLicenciaComponent } from '../edit-vencimiento-licencia/edit-vencimiento-licencia.component';
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';

@Component({
  selector: 'app-trabajadores',
  templateUrl: './trabajadores.component.html',
  styleUrls: ['./trabajadores.component.scss']
})
export class TrabajadoresComponent implements OnInit {
  public trabajadores: Trabajador[];
  public tempTrabajadores: Trabajador[];
  public roles: Roles[];
  public TempRoles = [];
  public interBool: boolean;
  public destiBool: boolean;
  public correBool: boolean;
  public entreBool: boolean;
  public operaBool: boolean;
  public chofBool: boolean;
  public transBool: boolean;
  public cargBool: boolean;
  public esCentroMuvin: boolean;
  public getItemSub: Subscription;
  public itemForm: FormGroup;
  filtro = {
    nombre: '',
    rol: 0
  };
  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Registros</span>
      </div>
    `
  };
  constructor(private personasService: PersonasService, private trabajadorService: TrabajadoresService,
    public router: Router, private dialog: MatDialog, private userService: UserService,
    private fb: FormBuilder, private errorService: AppErrorService,
    private snack: MatSnackBar, private confirmService: AppConfirmService,
    private loader: AppLoaderService, private alertService: AppAlertService,
  ) { }

  ngOnInit() {
    let idCentro: string = '';
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
      .subscribe(
        data => {
          idCentro = data.data;
          if (idCentro.toString() === '6408') {
            this.esCentroMuvin = true;
          } else {
            this.esCentroMuvin = false;
          }
        });



    this.itemForm = this.fb.group({
      rol: ['0', Validators.required]
    });
    this.getItems(0);
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
  getRoles() {
    this.loader.open();
    this.getItems(this.itemForm.controls['rol'].value);
  }

  getItems(v) {
    if (v == 0) {
      this.getItemSub = this.trabajadorService.getAllTrabajadores()
        .subscribe(data => {
          let trabajador = [];
          let TempRoles = [];
          let rolAgregar;
          this.interBool = false;
          this.destiBool = false;
          this.correBool = false;
          this.entreBool = false;
          this.operaBool = false;
          this.chofBool = false;
          this.transBool = false;
          this.cargBool = false;
          rolAgregar = {
            id: 0,
            nombre: 'Sin Filtro'
          }
          TempRoles.push(rolAgregar);
          if (data.data.clientes.length > 0) {
            this.cargBool = true;
            TempRoles.push(rolAgregar);
            for (let i = 0; i < data.data.clientes.length; i++) {
              let temp = {
                id: data.data.clientes[i].id,
                nombre_persona: data.data.clientes[i].nombre_persona,
                cuit_persona: data.data.clientes[i].cuit_persona,
                nombre_rol: data.data.clientes[i].nombre_rol,
                id_rol: data.data.clientes[i].id_rol,
                id_usuario: data.data.clientes[i].id_usuario

              };
              trabajador.push(temp);
            }
          }
          if (data.data.corredores.length > 0) {
            this.correBool = true;
            TempRoles.push(rolAgregar);
            for (let i = 0; i < data.data.corredores.length; i++) {
              let temp = {
                id: data.data.corredores[i].id,
                nombre_persona: data.data.corredores[i].nombre_persona,
                cuit_persona: data.data.corredores[i].cuit_persona,
                nombre_rol: data.data.corredores[i].nombre_rol,
                id_rol: data.data.corredores[i].id_rol,
                id_usuario: data.data.corredores[i].id_usuario
              };
              trabajador.push(temp);
            }
          }
          if (data.data.destinatarios.length > 0) {
            this.destiBool = true;
            TempRoles.push(rolAgregar);
            for (let i = 0; i < data.data.destinatarios.length; i++) {
              let temp = {
                id: data.data.destinatarios[i].id,
                nombre_persona: data.data.destinatarios[i].nombre_persona,
                cuit_persona: data.data.destinatarios[i].cuit_persona,
                nombre_rol: data.data.destinatarios[i].nombre_rol,
                id_rol: data.data.destinatarios[i].id_rol,
                id_usuario: data.data.destinatarios[i].id_usuario
              };
              trabajador.push(temp);
            }
          }
          if (data.data.entregadores.length > 0) {
            this.entreBool = true;
            TempRoles.push(rolAgregar);
            for (let i = 0; i < data.data.entregadores.length; i++) {
              let temp = {
                id: data.data.entregadores[i].id,
                nombre_persona: data.data.entregadores[i].nombre_persona,
                cuit_persona: data.data.entregadores[i].cuit_persona,
                nombre_rol: data.data.entregadores[i].nombre_rol,
                id_rol: data.data.entregadores[i].id_rol,
                id_usuario: data.data.entregadores[i].id_usuario
              };
              trabajador.push(temp);
            }
          }
          if (data.data.intermediarios.length > 0) {
            this.interBool = true;
            TempRoles.push(rolAgregar);
            for (let i = 0; i < data.data.intermediarios.length; i++) {
              let temp = {
                id: data.data.intermediarios[i].id,
                nombre_persona: data.data.intermediarios[i].nombre_persona,
                cuit_persona: data.data.intermediarios[i].cuit_persona,
                nombre_rol: data.data.intermediarios[i].nombre_rol,
                id_rol: data.data.intermediarios[i].id_rol,
                id_usuario: data.data.intermediarios[i].id_usuario
              };
              trabajador.push(temp);
            }
          }
          if (data.data.operadores.length > 0) {
            this.operaBool = true;
            TempRoles.push(rolAgregar);
            for (let i = 0; i < data.data.operadores.length; i++) {
              let temp = {
                id: data.data.operadores[i].id,
                nombre_persona: data.data.operadores[i].nombre_persona,
                cuit_persona: data.data.operadores[i].cuit_persona,
                nombre_rol: data.data.operadores[i].nombre_rol,
                id_rol: data.data.operadores[i].id_rol,
                id_usuario: data.data.operadores[i].id_usuario
              };
              trabajador.push(temp);
            }
          }
          if (data.data.transportistas.length > 0) {
            this.transBool = true;
            TempRoles.push(rolAgregar);
            for (let i = 0; i < data.data.transportistas.length; i++) {
              let temp = {
                id: data.data.transportistas[i].id,
                nombre_persona: data.data.transportistas[i].nombre_persona,
                cuit_persona: data.data.transportistas[i].cuit_persona,
                nombre_rol: data.data.transportistas[i].nombre_rol,
                id_rol: data.data.transportistas[i].id_rol,
                id_usuario: data.data.transportistas[i].id_usuario
              };
              trabajador.push(temp);
              if (data.data.transportistas[i].listado_choferes.length > 0) {
                this.chofBool = true;
                for (let k = 0; k < data.data.transportistas[i].listado_choferes.length; k++) {
                  let temp = {
                    id: data.data.transportistas[i].listado_choferes[k].id,
                    nombre_persona: data.data.transportistas[i].listado_choferes[k].nombre_persona,
                    cuit_persona: data.data.transportistas[i].listado_choferes[k].cuit_persona,
                    nombre_rol: data.data.transportistas[i].listado_choferes[k].nombre_rol,
                    id_rol: data.data.transportistas[i].listado_choferes[k].id_rol,
                    id_usuario: data.data.transportistas[i].listado_choferes[k].id_usuario,
                    verificado: (data.data.transportistas[i].listado_choferes[k].verificado.toString() == '1' ? 'Si' : 'No'),
                    vencimiento_licencia: data.data.transportistas[i].listado_choferes[k].vencimiento_licencia,
                  };
                  trabajador.push(temp);
                }
              }
            }
          }
          this.trabajadores = this.tempTrabajadores = trabajador;
        });
    }
    if (this.loader !== null) {
      this.loader.close();
    }
  }

  bloqueoDesbloqueo(row) {
    const accion = (row.verificado === 'No') ? 'verificado' : ' no verificado';
    this.confirmService.confirm({ message: 'Ud. está seguro de marcar ' + accion + ' al chofer ' + row.nombre_persona + '?' })
      .subscribe(res => {
        if (res) {
          const chofer_verificado = (row.verificado === 'No') ? 1 : 0;
          row.verificado = (row.verificado === 'No') ? 'Si' : 'No';
          this.loader.open();
          const datos = {
            id: row.id_usuario,
            chofer_verificado: chofer_verificado
          }
          this.personasService.updatePersona(datos)
            .subscribe(data => {
              this.loader.close();
              this.getItems(this.itemForm.controls['rol'].value);
              this.alertService.confirm({ message: 'Chofer actualizado', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            }, err => {
              this.loader.close();
              this.errorService.confirm({ message: 'Error ocurrido al actualizar al chofer' + ' ' + err });
            });
        }
      });
  }
  updateFilter(event, param) {
    let val;
    if (param === 'rol') {
      if (event.value === 0) {
        val = '';
      } else {
        val = event.value;
      }
    } else {
      val = event.target.value.toString().toLowerCase();

    }
    eval('this.filtro.' + param + ' = val');
    this.trabajadores = this.tempTrabajadores;
    let _this = this;
    const temp = this.trabajadores.filter(function (d) {
      return d.nombre_persona.toLowerCase().indexOf(_this.filtro.nombre) !== -1 || !val;
    });
    this.trabajadores = temp;
    _this = this;
    if (this.filtro.rol > 0) {
      const temp1 = this.trabajadores.filter(function (d) {
        const d1 = d.id_rol.toString();
        const d2 = _this.filtro.rol.toString();
        return d1 === d2;
      });
      this.trabajadores = temp1;
    }

    if (this.filtro.nombre === '' && this.filtro.rol === 0) {
      this.getItems(0);
    }
  }

  updateFilter2(event) {
    const val = event.target.value.toLowerCase();
    this.trabajadores = this.tempTrabajadores;
    const temp = this.trabajadores.filter(function (d) {
      return d.cuit_persona.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.trabajadores = temp;
    if (val === '') {
      this.getItems(0);
    }
  }

  openPopUpPerfil(data: any = {}) {
    let title = 'Información del perfil';
    let dialogRef: MatDialogRef<any> = this.dialog.open(PerfilComponent, {
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
        this.personasService.updatePersona(res)
          .subscribe(data => {
            this.getItems(0);
            if (this.loader !== null) {
              this.loader.close();
            };
            this.alertService.confirm({ message: '¡Perfil Modificado!', tipo: 'exito' }).subscribe(res1 => {
              if (res1) {
                return;
              }
            });
            this.getItems(0);
          },
            err => {
              this.loader.close();
              this.errorService.confirm({ message: 'Este Perfil no se puede modificar' }).subscribe(res2 => {
                if (res2) {
                  return;
                }
              });
            });
      });
  }
  actualizarVencimiento(data: any = {}) {
    let title = 'Actualizar vencimiento';
    let dialogRef: MatDialogRef<any> = this.dialog.open(EditVencimientoLicenciaComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: { id: data.id_usuario, vencimiento_licencia: data.vencimiento_licencia } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.personasService.updatePersona(res)
          .subscribe(data => {
            this.getItems(0);
            if (this.loader !== null) {
              this.loader.close();
            };
            this.alertService.confirm({ message: '¡Perfil Modificado!', tipo: 'exito' }).subscribe(res1 => {
              if (res1) {
                return;
              }
            });
            this.getItems(0);
          },
            err => {
              this.loader.close();
              this.errorService.confirm({ message: 'Este Perfil no se puede modificar' }).subscribe(res2 => {
                if (res2) {
                  return;
                }
              });
            });
      });
  }
}
