import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PersonasService } from './../../../../shared/services/personas.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { FormControl } from '@angular/forms';
import { Roles } from './../../../../shared/models/roles';
import { UserService } from './../../../../shared/services/user.service';

export class PersonaRol {
  id: number;
  id_rol: number;
  id_usuario: number;
};

@Component({
  selector: 'app-roles-persona',
  templateUrl: './roles-persona.component.html',
  styleUrls: ['./roles-persona.component.scss']
})
export class RolesPersonaComponent implements OnInit {
  public itemForm: FormGroup;
  toppings = new FormControl();
  rolesList: Roles[];
  rolesxpersonaList: PersonaRol[];
  persona: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RolesPersonaComponent>,
    private fb: FormBuilder,
    private personasService: PersonasService,
    private loader: AppLoaderService,
    private userService: UserService) { }

  ngOnInit() {
    this.persona = this.data.payload;
    this.getAllRoles();
    this.getAllRolesxPersona(this.data.payload.cuit_cuil);
    this.buildItemForm(this.data.payload);
  }

  submit() {
    let idusuario = this.itemForm.value.id;
    let vroles = this.itemForm.value.roles;
    let rolesfinal = [];
    
    if (this.rolesxpersonaList.length === 0) {
      for (let j = 0; j < vroles.length; j++) {
        rolesfinal.push({
          id_rol: vroles[j],
          id_usuario: idusuario,
          operacion: 'post'
        });
      }
    } else {
      //insertar los nuevos
      for (let j = 0; j < vroles.length; j++) {
        let encontrado = false;
        for (let i = 0; i < this.rolesxpersonaList.length; i++) {
          if (this.rolesxpersonaList[i].id_rol.toString() === vroles[j].toString()) {
            encontrado = true;
            break;
          }
        }
        if (!encontrado) {
          rolesfinal.push({
            id_rol: vroles[j],
            id_usuario: idusuario,
            operacion: 'post'
          });
        }
      }
      //eliminar los viejos
      for (let i = 0; i < this.rolesxpersonaList.length; i++) {
        let encontrado = false;
        for (let j = 0; j < vroles.length; j++) {
          if (this.rolesxpersonaList[i].id_rol.toString() === vroles[j].toString()) {
            encontrado = true;
            break;
          }
        }
        if (!encontrado) {
          rolesfinal.push({
            id: this.rolesxpersonaList[i].id,
            operacion: 'delete'
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
  }

  getAllRoles() {
    this.loader.open();
    this.userService.getAllRolesSelect()
      .subscribe(data => {
        if (this.persona.id_tipo_persona === 2) {
          this.rolesList = [];
          for (let i = 0; i < data.data.length; i++) {
            let element=data.data[i];
            if (element.id !== 2 && element.id !== 10) {
              let rol = new Roles(); 
              rol.id=element.id;
              rol.description= element.descripcion;           
              this.rolesList.push(rol);
            }
          }
        } else {
          this.rolesList = [];
          for (let i = 0; i < data.data.length; i++) {
            let element=data.data[i];
            if ( element.id !== 10) {
              let rol = new Roles(); 
              rol.id=element.id;
              rol.description= element.descripcion;   
              this.rolesList.push(rol);
            }
          }
        }
        this.loader.close();
      });
  }

  getAllRolesxPersona(id) {
    this.personasService.getAllRolesxPersona(id)
      .subscribe(data => {
        this.rolesxpersonaList = data.data.roles;
        if (this.rolesxpersonaList.length > 0) {
          let valroles = [];
          for (let i = 0; i < this.rolesxpersonaList.length; i++) {
            valroles.push(parseInt( this.rolesxpersonaList[i].id_rol.toString()));
          }
          this.itemForm.controls['roles'].setValue(valroles);
        }
      });
  }
}
