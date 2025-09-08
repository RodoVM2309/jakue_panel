import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from 'app/shared/services/user.service';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { AddPersonaComponent } from '../../personas/add-persona/add-persona.component';
import { Person } from './../../../../shared/models/person';
import { PersonasService } from './../../../../shared/services/personas.service';

export class PersonasRol {
  id: number;
  id_rol: number;
  id_usuario: number;
  nombre_persona: string;
  direccion_persona: string;
  localidad_persona: string;
  nombre_rol: string;
  cuit_persona: string;
};

export class Empresa {
  id: number;
  id_rol: number;
  id_usuario: number;
  nombre_persona: string;
  direccion_persona: string;
  localidad_persona: string;
  nombre_rol: string;
  cuit_persona: string;
};

@Component({
  selector: 'app-vincular-empresa',
  templateUrl: './vincular-empresa.component.html',
  styleUrls: ['./vincular-empresa.component.scss']
})
export class VincularEmpresaComponent implements OnInit {
  public itemForm: FormGroup;
  empresasList: Empresa[];
  datospersona: Person;
  personasrol: PersonasRol[];
  incorrectcuit: boolean = true;
  idCentro = '';


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VincularEmpresaComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private personasService: PersonasService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    private userService: UserService) { }

  ngOnInit() {
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
      .subscribe(data => this.idCentro = data.data);
    this.buildItemForm();
  }

  buildItemForm() {
    this.itemForm = this.fb.group({
      id_interno: [''],
      id: [''],
      es_dador_cupo: [0],
      es_cliente_final: [0],
      cliente_muvin: [1],
      cuit_cuil: ['', [Validators.required, Validators.maxLength(11)]],
    });
  }

  submit() {
    this.dialogRef.close(this.itemForm.value);
  }

  comprobarCUIT() {
    let info_cuit = [];
    let id_usuario;
    let cuitparam = this.itemForm.controls['cuit_cuil'].value.toString();
    if (this.itemForm.invalid === false) {
      //this.loader.open();
      this.personasService.getEmpresaCuit(this.itemForm.controls['cuit_cuil'].value.toString())
        .subscribe(data => {

          info_cuit = data.data;
          let codigo = info_cuit['codigo'];
          let id_pr = info_cuit['id'];
          id_usuario = info_cuit['id_usuario'];

          if (codigo == 0) {// no existe como persona
            this.confirmService.confirm({ message: 'No existe registro con este RUC. ¿Desea ingresarlo como empresa?' })
              .subscribe(res => {
                if (res) {
                  let dialogRefPersona: MatDialogRef<any> = this.dialog.open(AddPersonaComponent, {
                    width: '720px',
                    disableClose: true,
                    data: { title: 'Agregar persona', payload: { cuit_cuil: cuitparam }, isNew: true, es_cliente_final: 1, dador_cupo: 0 }
                  });
                  dialogRefPersona.afterClosed()
                    .subscribe(res => {
                      if (!res) {
                        this.loader.close();
                        return;
                      } else {
                        data = res;
                        let id_usuario;
                        if (data.success) {
                          id_usuario = data.data.id;
                          this.personasService.postRolPersona({
                            id_rol: 3,
                            id_usuario: id_usuario
                          }).subscribe(data => {
                            this.itemForm.controls['id_interno'].setValue(data.data.id);
                            this.itemForm.controls['id'].setValue(id_usuario);
                            this.itemForm.controls['es_dador_cupo'].setValue(1);
                            this.itemForm.controls['es_cliente_final'].setValue(1);
                            this.itemForm.controls['cliente_muvin'].setValue(1);
                            this.personasService.getPersonaById(id_usuario)
                              .subscribe(data => {
                                this.loader.close();
                                this.datospersona = data.data;
                                this.itemForm.controls['cuit_cuil'].setValue(this.datospersona.cuit_cuil);
                                this.incorrectcuit = false;
                              });
                          }, err => {
                            this.loader.close();
                            this.alertService.confirm({ message: 'Hay errores!' });
                            this.incorrectcuit = true;
                          });
                        }
                        else
                          this.alertService.confirm({ message: 'Hay errores!' });
                      }
                    });
                } else {
                  this.loader.close();
                }
              });
          } else
            if (codigo == 1) {// Existe como persona pero no como dador
              this.confirmService.confirm({ message: 'Ya existe el RUC pero no posee el rol empresa. ¿Desea ingresarlo como empresa?' })
                .subscribe(res => {
                  if (res) {
                    this.personasService.postRolPersona({
                      id_rol: 3,
                      id_usuario: id_usuario
                    })
                      .subscribe(data => {
                        this.itemForm.controls['id_interno'].setValue(data.data.id);
                        this.personasService.getPersonaById(id_usuario)
                          .subscribe(data => {
                            this.datospersona = data.data;
                            this.itemForm.controls['cuit_cuil'].setValue(this.datospersona.cuit_cuil);
                            this.itemForm.controls['id'].setValue(id_usuario);
                            this.itemForm.controls['es_dador_cupo'].setValue(0);
                            this.itemForm.controls['es_cliente_final'].setValue(1);
                            this.itemForm.controls['cliente_muvin'].setValue(1);
                            this.incorrectcuit = false;
                            this.loader.close();
                          });
                      }, err => {
                        this.loader.close();
                        this.alertService.confirm({ message: 'Hay errores!' + err });
                        this.incorrectcuit = true;
                      });
                  } else {
                    this.loader.close();
                  }


                });
            } else {// existe como persona y como dador, ver si esta en el centro

              let bandera = false;
              /* if (info_cuit['centros'].length > 0) {
                for (let index = 0; index < info_cuit['centros'].length; index++) {
                  if (info_cuit['centros'][index].id_centro.toString() === this.idCentro) {
                    bandera = true;
                    this.loader.close();
                    this.itemForm.controls['cuit_cuil'].setErrors(Validators.max, { emitEvent: false });
                    this.itemForm.controls['cuit_cuil'].markAsDirty();
                    this.alertService.confirm({ message: 'Ya existe la empresa!' });
                    this.incorrectcuit = true;
                  }

                }

              } */
              if (bandera == false) {
                this.itemForm.controls['id_interno'].setValue(id_pr);
                this.personasService.getPersonaById(id_usuario)
                  .subscribe(data => {
                    this.loader.close();
                    this.datospersona = data.data;
                    this.itemForm.controls['cuit_cuil'].setValue(this.datospersona.cuit_cuil);
                    this.itemForm.controls['id'].setValue(id_usuario);
                    this.itemForm.controls['es_dador_cupo'].setValue(1);
                    this.itemForm.controls['es_cliente_final'].setValue(1);
                    this.itemForm.controls['cliente_muvin'].setValue(1);
                    this.incorrectcuit = false;
                  });
              }
              this.loader.close();
            }
        });
    } else {
      this.incorrectcuit = true;
    }
  }


}
