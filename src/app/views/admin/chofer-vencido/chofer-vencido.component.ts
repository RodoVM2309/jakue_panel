import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialogRef, MatDialog } from '@angular/material';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { PersonasService } from './../../../shared/services/personas.service';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TrabajadoresService } from './../../../shared/services/trabajadores.service';
import { Chofer } from './../../../shared/models/chofer';
import { Roles } from './../../../shared/models/roles';
import { EditVencimientoLicenciaComponent } from '../edit-vencimiento-licencia/edit-vencimiento-licencia.component';
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-chofer-vencido',
  templateUrl: './chofer-vencido.component.html',
  styleUrls: ['./chofer-vencido.component.scss']
})
export class ChoferVencidoComponent implements OnInit {
  public trabajadores: Chofer[];
  public tempTrabajadores: Chofer[];
  public roles: Roles[];
  public TempRoles=[];
  public interBool:boolean;
  public destiBool:boolean;
  public correBool:boolean;
  public entreBool:boolean;
  public operaBool:boolean;
  public chofBool:boolean;
  public transBool:boolean;
  public cargBool:boolean;
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
  constructor(private personasService: PersonasService, 
    private trabajadorService: TrabajadoresService,
    public router: Router, private dialog: MatDialog,
    private fb: FormBuilder, private errorService: AppErrorService, 
    private loader: AppLoaderService, private alertService: AppAlertService,
    private userService: UserService,) { }

  ngOnInit() {
    let idCentro: string = '';
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
    .subscribe(data => idCentro = data.data);
    if(idCentro === '6408'){
      this.esCentroMuvin = true;
    }else{
      this.esCentroMuvin = false;
    }
    
   /*  this.getAllRoles(); */
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
      this.getItemSub = this.trabajadorService.getAllChoferesVencidos()
        .subscribe(data => {
          this.trabajadores = data.data;          
        });
    }
    if (this.loader !== null) {
      this.loader.close();
    }
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

    
  actualizarVencimiento(data: any = {}) {
    let title = 'Actualizar vencimiento';
    let dialogRef: MatDialogRef<any> = this.dialog.open(EditVencimientoLicenciaComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: { id: data.id_usuario,vencimiento_licencia: data.vencimiento_licencia } }
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
