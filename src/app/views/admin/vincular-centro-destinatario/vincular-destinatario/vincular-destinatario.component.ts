import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { PersonasService } from './../../../../shared/services/personas.service';
import { Person } from './../../../../shared/models/person';
import { AddPersonaComponent } from '../../personas/add-persona/add-persona.component';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { UserService } from 'app/shared/services/user.service';

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

export class Destinatario {
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
  selector: 'app-vincular-destinatario',
  templateUrl: './vincular-destinatario.component.html',
  styleUrls: ['./vincular-destinatario.component.scss']
})
export class VincularDestinatarioComponent implements OnInit {
  public itemForm: FormGroup;
  destinatariosList: Destinatario[];
  datospersona: Person;
  personasrol: PersonasRol[];
  incorrectcuit: boolean = true;
  idCentro = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VincularDestinatarioComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private personasService: PersonasService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private alertService:AppAlertService,
    private userService: UserService) { }

  ngOnInit() {
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
      .subscribe(data => this.idCentro = data.data);
    this.buildItemForm();
  }

  buildItemForm() {
    this.itemForm = this.fb.group({
      id_destinatario: [''],
      cuit_cuil: ['', [Validators.required]],
    });
  }

  submit() {
    this.dialogRef.close(this.itemForm.value);
  }

  comprobarCUIT() {
    let info_cuit = [];
    let cuitparam = this.itemForm.controls['cuit_cuil'].value.toString();
    if (this.itemForm.invalid === false) {
      this.personasService.getDestinatarioCuit(this.itemForm.controls['cuit_cuil'].value.toString())
        .subscribe(data => {
          info_cuit = data.data;
          let codigo = info_cuit['codigo'];
          let id_usuario = info_cuit['id_usuario'];
          if (codigo == 0) {// no existe como persona
            this.confirmService.confirm({ message: 'No existe registro con este RUC. Desea ingresarlo como destinatario?' })
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
                      }else{
                        data = res;
                        let id_usuario;
                          if (data.success) {
                            id_usuario = data.data.id;
                            this.personasService.postRolPersona({
                              id_rol: 6,
                              id_usuario: id_usuario
                            }).subscribe(data => {
                              this.itemForm.controls['id_destinatario'].setValue(data.data.id);
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
              this.confirmService.confirm({ message: 'Ya existe el RUC pero no posee el rol destinatario. Desea ingresarlo como destinatario?' })
                .subscribe(res => {
                  if (res) {
                    this.personasService.postRolPersona({
                      id_rol: 6,
                      id_usuario: id_usuario
                    })
                      .subscribe(data => {
                        this.itemForm.controls['id_destinatario'].setValue(data.data.id);
                        this.personasService.getPersonaById(id_usuario)
                          .subscribe(data => {
                            this.datospersona = data.data;
                            this.itemForm.controls['cuit_cuil'].setValue(this.datospersona.cuit_cuil);
                            this.incorrectcuit = false;
                            this.loader.close();
                          });
                      }, err => {
                        this.loader.close();
                        this.alertService.confirm({ message: 'Hay errores!' });
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
                    this.alertService.confirm({ message: 'Ha seleccionado un Destino fuera de la Zona del Destino actual' });
                    this.alertService.confirm({ message: 'Ya existe el RUC como destinatario!' });
                    this.incorrectcuit = true;
                  }
                }
              }
              if (bandera == false) {
                this.itemForm.controls['id_destinatario'].setValue(info_cuit['id']);
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
