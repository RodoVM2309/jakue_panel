import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { PersonasService } from './../../../../shared/services/personas.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { Roles } from './../../../../shared/models/roles';
import { PersonaRol } from './../../../../shared/models/persona-rol';
import { UserService } from './../../../../shared/services/user.service';

export class PersonRol {
  activo: number;
  cuit_persona: string;
  direccion_persona: string;
  horas: number;
  id: number;
  id_rol: number;
  id_usuario: number;
  kmetros: number;
  localidad_persona: string;
  nombre_persona: string;
  nombre_rol: string;
  chanceOption: boolean;
  val_ini_activo: number;
  val_fin_activo: number;
}
@Component({
  selector: 'app-desactivar-rol',
  templateUrl: './desactivar-rol.component.html',
  styleUrls: ['./desactivar-rol.component.scss']
})
export class DesactivarRolComponent implements OnInit {
  public itemForm: FormGroup;
  toppings = new FormControl();
  rolesList: Roles[];
  rolesxpersonaList: PersonaRol[];
  persona: any;
  valRoles: PersonRol[];
  chanceValue = false;
  rbValue = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DesactivarRolComponent>,
    private fb: FormBuilder,
    private personasService: PersonasService,
    private loader: AppLoaderService,
    private userService: UserService) { }

  ngOnInit() {
    this.persona = this.data.payload;
    this.getAllRolesxPersona(this.data.payload.cuit_cuil);
    this.buildItemForm(this.data.payload);
  }

  submit() {
    let idusuario = this.itemForm.value.id;
    let vroles = this.itemForm.value.roles;
    let rolesfinal = [];
    if (this.valRoles.length > 0) {
      for (let j = 0; j < this.valRoles.length; j++) {
        if (this.valRoles[j].chanceOption && this.valRoles[j].val_ini_activo!=this.valRoles[j].val_fin_activo) {
          rolesfinal.push({
            id: this.valRoles[j].id,
            id_rol: this.valRoles[j].id_rol,
            id_usuario: idusuario,
            activo: this.valRoles[j].val_fin_activo
          });
        }        
      }    
    }
    this.dialogRef.close(rolesfinal);
  }

  buildItemForm(item) {
    let dataform = {
      id: [item.id || ''],
      roles: [item.roles || '', Validators.required]
    };
    this.itemForm = this.fb.group(dataform);
    //this.addCheckboxes();
  }

  getAllRoles() {
    this.loader.open();
    this.userService.getAllRolesSelect()
      .subscribe(data => {
        if (this.persona.id_tipo_persona === 2) {
          this.rolesList = [];
          for (let i = 0; i < data.data.length; i++) {
            if (data.data[i].id !== 2) {
              this.rolesList.push(data.data[i]);
            }
          }
        } else {
          this.rolesList = data.data;
        }
        this.loader.close();
      });
  }

  getAllRolesxPersona(id) {
    this.personasService.getAllRolesxPersona(id)
      .subscribe(data => {
        this.rolesxpersonaList = data.data.roles;
        if (this.rolesxpersonaList.length > 0) {
          this.valRoles = [];
          for (let i = 0; i < this.rolesxpersonaList.length; i++) {
            let valRol= new PersonRol();
            valRol.activo= this.rolesxpersonaList[i].activo;
            valRol.id_usuario = this.rolesxpersonaList[i].id_usuario;
            valRol.id_rol = this.rolesxpersonaList[i].id_rol;
            valRol.id = this.rolesxpersonaList[i].id;
            valRol.chanceOption = false;
            valRol.val_ini_activo = this.rolesxpersonaList[i].activo;
            valRol.val_fin_activo = this.rolesxpersonaList[i].activo;
            this.valRoles.push(valRol);
          }
          // this.itemForm.controls['roles'].setValue(valroles);
        }
        // this.addCheckboxes();
      });
  }
  onChange(index,rol, event) {
    this.valRoles[index].chanceOption= true;
    this.valRoles[index].val_fin_activo = event.checked ? 1 : 0;
    this.chanceValue = true;        
  }  

}
