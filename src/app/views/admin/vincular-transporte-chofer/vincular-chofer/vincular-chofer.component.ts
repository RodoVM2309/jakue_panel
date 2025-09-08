import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "../../../../shared/services/app-loader/app-loader.service";
import { PersonasService } from "./../../../../shared/services/personas.service";
import { Person } from "./../../../../shared/models/person";
import { AddPersonaComponent } from "../../personas/add-persona/add-persona.component";
import { AppAlertService } from "../../../../shared/services/app-alert/app-alert.service";
import { UserService } from "app/shared/services/user.service";

export class PersonasRol {
  id: number;
  id_rol: number;
  id_usuario: number;
  nombre_persona: string;
  direccion_persona: string;
  localidad_persona: string;
  nombre_rol: string;
  cuit_persona: string;
}

export class Chofer {
  id: number;
  id_rol: number;
  id_usuario: number;
  nombre_persona: string;
  direccion_persona: string;
  localidad_persona: string;
  nombre_rol: string;
  cuit_persona: string;
  longitud: number;
  latitud: number;
  id_equipo: number;
  id_chofer_equipo: number;
  estado: string;
  patente: string;
  distancia: number;
}

@Component({
  selector: "app-vincular-chofer",
  templateUrl: "./vincular-chofer.component.html",
  styleUrls: ["./vincular-chofer.component.scss"]
})
export class VincularChoferComponent implements OnInit {
  public itemForm: FormGroup;
  choferesList: Chofer[];
  datospersona: Person;
  personasrol: PersonasRol[];
  incorrectcuit: boolean = true;
  idTransporte: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VincularChoferComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private personasService: PersonasService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.buildItemForm();
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
    .subscribe(data => this.idTransporte = data.data);
  }

  buildItemForm() {
    this.itemForm = this.fb.group({
      id_chofer: [""],
      cuit_cuil: [
        "",
        [
          Validators.required,
          Validators.min(20000000000),
          Validators.max(39999999999)
        ]
      ],
      alias: [""]
    });
  }

  submit() {
    this.dialogRef.close(this.itemForm.value);
  }

  
  comprobarCUIT() {
    let info_cuit = [];
    let cuitparam = this.itemForm.controls["cuit_cuil"].value.toString();
    if (this.itemForm.invalid === false) {
      //this.loader.open();
      this.personasService
        .getChoferCuit(this.itemForm.controls["cuit_cuil"].value.toString())
        .subscribe(data => {
          info_cuit = data.data;
          let codigo = info_cuit["codigo"];
          let id_usuario = info_cuit["id_usuario"];

          if (codigo == 0) {
            // no existe como persona
            this.confirmService
              .confirm({
                message:
                  "No existe registro con este CUIT/CUIL. Desea ingresarlo como Chofer?"
              })
              .subscribe(res => {
                if (res) {
                  let dialogRefPersona: MatDialogRef<any> = this.dialog.open(
                    AddPersonaComponent,
                    {
                      width: "720px",
                      disableClose: true,
                      data: {
                        title: "Agregar persona",
                        payload: { cuit_cuil: cuitparam },
                        isNew: true
                      }
                    }
                  );
                  dialogRefPersona.afterClosed().subscribe(
                    res => {
                      if (!res) {
                        this.loader.close();
                        return;
                      }
                      let id_usuario;
                      if (res.success) {
                        id_usuario = res.data.id;
                        this.personasService
                          .postRolPersona({
                            id_rol: 2,
                            id_usuario: id_usuario
                          })
                          .subscribe(
                            data => {
                              this.itemForm.controls["id_chofer"].setValue(
                                data.data.id
                              );
                              this.personasService
                                .getPersonaById(id_usuario)
                                .subscribe(data => {
                                  this.loader.close();
                                  this.datospersona = data.data;
                                  this.itemForm.controls["cuit_cuil"].setValue(
                                    this.datospersona.cuit_cuil
                                  );
                                  this.incorrectcuit = false;
                                });
                            },
                            err => {
                              this.loader.close();
                              this.alertService.confirm({
                                message: "Hay errores!"
                              });
                              this.incorrectcuit = true;
                            }
                          );
                      } else
                        this.alertService.confirm({
                          message: "No se pudo agregar la Persona"
                        });
                    },
                    err => {
                      this.loader.close();
                      this.alertService.confirm({
                        message: "No se pudo agregar la Persona" + err
                      });
                    }
                  );
                } else {
                  this.loader.close();
                }
              });
          } else if (codigo === 1) {
            // Existe como persona pero no como chofer
            this.confirmService
              .confirm({
                message:
                  "Ya existe el CUIT/CUIL pero no posee el Rol Chofer. Desea ingresarlo como Chofer?"
              })
              .subscribe(res => {
                if (res) {
                  this.personasService
                    .postRolPersona({
                      id_rol: 2,
                      id_usuario: id_usuario
                    })
                    .subscribe(
                      data => {
                        this.itemForm.controls["id_chofer"].setValue(
                          data.data.id
                        );
                        this.personasService
                          .getPersonaById(id_usuario)
                          .subscribe(data => {
                            this.datospersona = data.data;
                            this.itemForm.controls["cuit_cuil"].setValue(
                              this.datospersona.cuit_cuil
                            );
                            this.incorrectcuit = false;
                            this.loader.close();
                          });
                      },
                      err => {
                        this.loader.close();
                        this.alertService.confirm({
                          message:
                            "No se pudo agregar esta Persona como Chofer!"
                        });
                        this.incorrectcuit = true;
                      }
                    );
                } else {
                  this.loader.close();
                }
              });
          } else {
            // existe como persona y como dador, ver si esta en el centro
            let bandera = false;
            if (info_cuit["transportistas"].length > 0) {
              for (
                let index = 0;
                index < info_cuit["transportistas"].length;
                index++
              ) {
                if (
                  info_cuit["transportistas"][
                    index
                  ].id_transporte.toString() === this.idTransporte
                ) {
                  bandera = true;
                  this.loader.close();
                  this.itemForm.controls["cuit_cuil"].setErrors(
                    Validators.max,
                    { emitEvent: false }
                  );
                  this.itemForm.controls["cuit_cuil"].markAsDirty();
                  //this.alertService.confirm({ message: 'Ya existe el Dador!' });
                  this.alertService.confirm({
                    message: "¡Ya existe el CUIT/CUIL como chofer!"
                  });
                  this.incorrectcuit = true;
                }
              }
            }
            if (bandera === false) {
              this.itemForm.controls["id_chofer"].setValue(info_cuit["id"]);
              this.personasService
                .getPersonaById(id_usuario)
                .subscribe(data => {
                  this.loader.close();
                  this.datospersona = data.data;
                  this.itemForm.controls["cuit_cuil"].setValue(
                    this.datospersona.cuit_cuil
                  );
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
