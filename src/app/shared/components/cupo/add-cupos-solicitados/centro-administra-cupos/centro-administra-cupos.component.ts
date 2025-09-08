import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CentrosService } from '../../../../services/centros.service';
import { AppConfirmService } from '../../../../services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../services/app-loader/app-loader.service';
import { PersonasService } from './../../../../services/personas.service';
import { Person } from './../../../../models/person';
import { AddPersonaComponent } from './../../../../../views/admin/personas/add-persona/add-persona.component';
import { AppAlertService } from '../../../../services/app-alert/app-alert.service';

import { AppErrorService } from '../../../../services/app-error/app-error.service';
import { AppAtencionService } from '../../../../services/app-atencion/app-atencion.service';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-centro-administra-cupos',
  templateUrl: './centro-administra-cupos.component.html',
  styleUrls: ['./centro-administra-cupos.component.scss']
})
export class CentroAdministraCuposComponent implements OnInit {
  public itemForm: FormGroup;
  datospersona: Person;
  incorrectcuit: boolean = true;
  idCentro: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CentroAdministraCuposComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private personasService: PersonasService,
    private centrosService: CentrosService,
    private errorService: AppErrorService, private atencionService: AppAtencionService,
    private confirmService: AppConfirmService,
    private snack: MatSnackBar,
    private loader: AppLoaderService, private alertService: AppAlertService,
    private userService: UserService) { }

  ngOnInit() {
    
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
    .subscribe(data => this.idCentro = data.data);
    this.buildItemForm();
  }

  buildItemForm() {
    this.itemForm = this.fb.group({
      id_centro: [''],
      cuit_cuil: ['', [Validators.required, Validators.min(20000000000), Validators.max(39999999999)]],
    });
  }

  submit() {
    this.dialogRef.close(this.itemForm.value);
  }


  comprobarCUIT() {
    let info_cuit = [];
    let cuitparam = this.itemForm.controls['cuit_cuil'].value.toString();
    if (this.itemForm.invalid === false) {
      this.loader.open();
      this.centrosService.getCentroCuit(this.itemForm.controls['cuit_cuil'].value.toString())
        .subscribe(data => {
          let info_cuit = data.data;
          let codigo = info_cuit['existe'];
          let id_usuario = info_cuit['id_persona'];
          let id_centro = info_cuit['id_centro'];
          if (codigo == 0) {// no existe como persona ni como centro
            this.confirmService.confirm({ message: 'No existe registro con este cuit. Desea ingresarlo como Centro?' })
              .subscribe(res => {
                if (res) {
                  let dialogRefPersona: MatDialogRef<any> = this.dialog.open(AddPersonaComponent, {
                    width: '720px',
                    disableClose: true,
                    data: { title: 'Agregar persona', payload: { cuit_cuil: cuitparam }, isNew: true }
                  });
                  dialogRefPersona.afterClosed()
                    .subscribe(res => {
                      if (!res) {
                        this.loader.close();
                        return;
                      }
                      this.personasService.postPersona(res)
                        .subscribe(data => {
                          let id_usuario;
                          if (data.success) {
                            id_usuario = data.data.id;
                            this.personasService.postRolPersona({
                              id_rol: 3,
                              id_usuario: id_usuario
                            }).subscribe(data => {
                              this.itemForm.controls['id_centro'].setValue(data.data.id);
                              this.personasService.getPersonaById(id_usuario)
                                .subscribe(data => {
                                  this.loader.close();
                                  this.datospersona = data.data;
                                  this.itemForm.controls['cuit_cuil'].setValue(this.datospersona.cuit_cuil);
                                  this.incorrectcuit = false;
                                });
                            }, err => {
                              this.loader.close();
                              this.errorService.confirm({ message: 'Hay errores!' });
                              this.incorrectcuit = true;
                            });
                          }
                          else
                            this.errorService.confirm({ message: 'Hay errores!' });
                        },
                          err => {
                            this.loader.close();
                            this.errorService.confirm({ message: 'Ha ocurrido un error' });
                          });
                    });
                } else {
                  this.loader.close();
                }
              });
          } else
            if (codigo == 1) {// Existe como persona pero no como centro
              this.confirmService.confirm({ message: 'Ya existe el CUIT/CUIL pero no posee el Rol Centro. Desea ingresarlo como Centro?' })
                .subscribe(res => {
                  if (res) {
                    this.personasService.postRolPersona({
                      id_rol: 3,
                      id_usuario: id_usuario
                    })
                      .subscribe(data => {
                        this.itemForm.controls['id_centro'].setValue(data.data.id);
                        this.personasService.getPersonaById(id_usuario)
                          .subscribe(data => {
                            this.datospersona = data.data;
                            this.itemForm.controls['cuit_cuil'].setValue(this.datospersona.cuit_cuil);
                            this.incorrectcuit = false;
                            this.loader.close();
                          });
                      }, err => {
                        this.loader.close();
                        this.errorService.confirm({ message: 'Hay errores!' });
                        this.incorrectcuit = true;
                      });
                  } else {
                    this.loader.close();
                  }
                });
            } else {// existe como persona y como centro, ver si esta en el centro
              
              let bandera = false;
              if (id_centro.toString() === this.idCentro) {
                bandera = true;
                this.loader.close();
                this.itemForm.controls['cuit_cuil'].setErrors(Validators.max, { emitEvent: false });
                this.itemForm.controls['cuit_cuil'].markAsDirty();
                this.atencionService.confirm({ message: '¡Ya existe el dador!' });
                this.incorrectcuit = true;
              }
              if (bandera == false) {
                this.loader.close();
                this.itemForm.controls['id_centro'].setValue(id_centro);
                this.incorrectcuit = false;
                /* this.personasService.getPersonaById(id_usuario)
                  .subscribe(data => {
                    this.loader.close();
                    this.datospersona = data.data;
                    this.itemForm.controls['cuit_cuil'].setValue(this.datospersona.cuit_cuil);
                    this.incorrectcuit = false;
                  }); */
              }
            }
        });

    } else {
      this.incorrectcuit = true;
    }
  }

}
