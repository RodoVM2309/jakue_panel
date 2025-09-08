import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from 'app/shared/services/user.service';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { AppAtencionService } from '../../../../shared/services/app-atencion/app-atencion.service';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppErrorService } from '../../../../shared/services/app-error/app-error.service';
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

export class Intermediario {
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
  selector: 'app-vincular-intermediario',
  templateUrl: './vincular-intermediario.component.html',
  styleUrls: ['./vincular-intermediario.component.scss']
})
export class VincularIntermediarioComponent implements OnInit {
  public itemForm: FormGroup;
  intermediariosList: Intermediario[];
  datospersona: Person;
  personasrol: PersonasRol[];
  incorrectcuit: boolean = true;
  idCentro = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VincularIntermediarioComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private personasService: PersonasService,
    private confirmService: AppConfirmService,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,
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
      id_intermediario: [''],
      cuit_cuil: ['', Validators.required],
    });
  }

  submit() {
    this.dialogRef.close(this.itemForm.value);
  }

  comprobarCUIT() {
    let info_cuit = [];
    console.log('input', this.itemForm.controls['cuit_cuil'].value);
    let cuitparam = this.itemForm.controls['cuit_cuil'].value.toString();
    if (this.itemForm.invalid === false) {
      this.personasService.getIntermediarioCuit(this.itemForm.controls['cuit_cuil'].value.toString())
        .subscribe(data => {

          info_cuit = data.data;
          let codigo = info_cuit['codigo'];
          let id_usuario = info_cuit['id_usuario'];

          if (codigo === 0) {// no existe como persona
            this.confirmService.confirm({ message: 'No existe registro con este RUC. ¿Desea ingresarlo como Transportadora?' })
              .subscribe(res => {
                if (res) {
                  let dialogRefPersona: MatDialogRef<any> = this.dialog.open(AddPersonaComponent, {
                    width: '720px',
                    disableClose: true,
                    data: { title: 'Agregar Persona', payload: { cuit_cuil: cuitparam }, isNew: true }
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
                            this.itemForm.controls['id_intermediario'].setValue(data.data.id);
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
            if (codigo === 1) {// Existe como persona pero no como dador
              this.confirmService.confirm({ message: 'Ya existe el RUC pero no posee el rol Intermediario. ¿Desea ingresarlo como Transportadora?' })
                .subscribe(res => {
                  if (res) {
                    this.personasService.postRolPersona({
                      id_rol: 3,
                      id_usuario: id_usuario
                    })
                      .subscribe(data => {
                        this.itemForm.controls['id_intermediario'].setValue(data.data.id);
                        this.personasService.getPersonaById(id_usuario)
                          .subscribe(data => {
                            this.datospersona = data.data;
                            this.itemForm.controls['cuit_cuil'].setValue(this.datospersona.cuit_cuil);
                            this.incorrectcuit = false;
                            this.loader.close();
                          });
                      }, err => {
                        this.loader.close();
                        this.errorService.confirm({ message: 'Hay errores!' }).subscribe(res => {
                          if (res) {
                            return;
                          }
                        });
                        this.incorrectcuit = true;
                      });
                  } else {
                    this.loader.close();
                  }

                });
            } else {// existe como persona y como dador, ver si esta en el centro

              let bandera = false;
              if (info_cuit['centros'].length > 0) {
                for (let index = 0; index < info_cuit['centros'].length; index++) {
                  if (info_cuit['centros'][index].id_centro.toString() === this.idCentro) {
                    bandera = true;
                    this.loader.close();
                    this.itemForm.controls['cuit_cuil'].setErrors(Validators.max, { emitEvent: false });
                    this.itemForm.controls['cuit_cuil'].markAsDirty();
                    this.atencionService.confirm({ message: 'Ya existe el RUC como intermediario.' }).subscribe(res => {
                      if (res) {
                        return;
                      }
                    });
                    this.incorrectcuit = true;
                  }
                }
              }
              if (bandera === false) {
                this.itemForm.controls['id_intermediario'].setValue(info_cuit['id']);
                this.personasService.getPersonaById(id_usuario)
                  .subscribe(data => {
                    this.loader.close();
                    this.datospersona = data.data;
                    this.itemForm.controls['cuit_cuil'].setValue(this.datospersona.cuit_cuil);
                    this.incorrectcuit = false;
                  });
              }
            }
        });
    } else {
      this.incorrectcuit = true;
    }
  }
}
