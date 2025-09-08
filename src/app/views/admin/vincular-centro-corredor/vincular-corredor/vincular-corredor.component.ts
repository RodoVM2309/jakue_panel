import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CentrosService } from './../../../../shared/services/centros.service';
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

export class Corredor {
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
  selector: 'app-vincular-corredor',
  templateUrl: './vincular-corredor.component.html',
  styleUrls: ['./vincular-corredor.component.scss']
})
export class VincularCorredorComponent implements OnInit {
  public itemForm: FormGroup;
  corredoresList: Corredor[];
  datospersona: Person;
  personasrol: PersonasRol[];
  incorrectcuit: boolean = true;
  idCentro = '';


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VincularCorredorComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private personasService: PersonasService,
    private centrosService: CentrosService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService, 
    private alertService:AppAlertService,
    private userService: UserService) { }

  ngOnInit() {
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
      .subscribe(data => this.idCentro = data.data);
    this.getCorredoresSinCentro();
    this.buildItemForm();
  }

  buildItemForm() {
    this.itemForm = this.fb.group({
      id_corredor: [''],
      cuit_cuil: ['', [Validators.required, Validators.min(20000000000), Validators.max(39999999999)]],
    });
  }

  submit() {
    this.dialogRef.close(this.itemForm.value);
  }

  getCorredoresSinCentro() {
    this.centrosService.getCorredoresSinCentro()
      .subscribe(data => {
        this.corredoresList = data.data;
      });
  }
  comprobarCUIT() {
    let info_cuit = [];
    let cuitparam = this.itemForm.controls['cuit_cuil'].value.toString();
    if (this.itemForm.invalid === false) {
      //this.loader.open();
      this.personasService.getCorredorCuit(this.itemForm.controls['cuit_cuil'].value.toString())
        .subscribe(data => {

          info_cuit = data.data;
          let codigo = info_cuit['codigo'];
          let id_usuario = info_cuit['id_usuario'];

          if (codigo == 0) {// no existe como persona
            this.confirmService.confirm({ message: 'No existe registro con este cuit. Desea ingresarlo como corredor?' })
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
                              id_rol: 9,
                              id_usuario: id_usuario
                            }).subscribe(data => {
                              this.itemForm.controls['id_cliente'].setValue(data.data.id);
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
              this.confirmService.confirm({ message: 'Ya existe el cuit pero no posee el rol Corredor. Desea ingresarlo como Corredor?' })
                .subscribe(res => {
                  if (res) {
                    this.personasService.postRolPersona({
                      id_rol: 9,
                      id_usuario: id_usuario
                    })
                      .subscribe(data => {
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
                    this.alertService.confirm({ message: 'Ya existe el corredor!'});
                    this.incorrectcuit = true;
                  }
                }
              }
              if (bandera == false) {
                this.itemForm.controls['id_corredor'].setValue(info_cuit['id']);
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


