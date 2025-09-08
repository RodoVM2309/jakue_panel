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
import { AppErrorService } from "../../../../shared/services/app-error/app-error.service";
import { CamionAcopladoComponent } from './camion-acoplado/camion-acoplado.component';
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

export class CentroInter {
  id_centro: number;
  id_intermediario: number;
  bloqueado: number;
  nombre_intermediario: string;
  nombre_centro: string;
}
export class Transporte {
  id: number;
  id_rol: number;
  id_usuario: number;
  nombre_persona: string;
  direccion_persona: string;
  localidad_persona: string;
  nombre_rol: string;
}

@Component({
  selector: "app-vincular-transporte",
  templateUrl: "./vincular-transporte.component.html",
  styleUrls: ["./vincular-transporte.component.scss"]
})
export class VincularTransporteComponent implements OnInit {
  public itemForm: FormGroup;
  transportesList: Transporte[];
  datospersona: Person;
  personasrol: PersonasRol[];
  incorrectcuit: boolean = true;
  intermediarios: CentroInter[];
  mostrar: boolean = true;
  idinter: any;
  intermediarioasignado = 0;
  selectedUnipersonal: boolean = false;
  camion: any;
  acoplado: any;
  isNew: boolean = true;
  showUnipersonal: boolean = true;
  idCentro: string = '';
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VincularTransporteComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private personasService: PersonasService,
    private confirmService: AppConfirmService,
    private errorService: AppErrorService,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    private userService: UserService
  ) { }

  ngOnInit() {
    if (this.data.payload.id_transporte) {
      this.idinter = this.data.payload.id_intermediario;
      this.mostrar = false;
      this.getPersonaById(this.data.payload.id_transporte);
    }
    this.getAllIntermediarios();
    this.buildItemForm(this.data.payload);
    this.isNew = this.data.isNew;
    this.showUnipersonal = true;
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
    .subscribe(data => this.idCentro = data.data);
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id_centro: [item.id_centro || ""],
      id_transporte: [item.id_transporte || ""],
      id_intermediario: [item.id_intermediario || ""],
      cuit_cuil: [
        item.cuit_cuil || "",
        [
          Validators.required,
          Validators.min(20000000000),
          Validators.max(39999999999)
        ]
      ],
      unipersonal: [this.selectedUnipersonal || ""]
    });
  }

  submit() {
    let res= {
      id_centro:this.itemForm.controls["id_centro"].value,
      id_transporte:this.itemForm.controls["id_transporte"].value,
      id_intermediario:this.itemForm.controls["id_intermediario"].value,
      cuit_cuil:this.itemForm.controls["cuit_cuil"].value,
      unipersonal:this.selectedUnipersonal?1:0,
      camion:this.camion,
      acoplado:this.acoplado,
    }  
    this.dialogRef.close(res);
  }

  getAllIntermediarios() {
    this.loader.open();
    this.personasService.getIntermediarioByCentro().subscribe(data => {
      this.loader.close();
      this.intermediarios = data.data;
      let internull = {
        id_centro: 0,
        id_intermediario: 0,
        bloqueado: 0,
        nombre_intermediario: "Sin intermediario",
        nombre_centro: ""
      };
      this.intermediarios.push(internull);
      this.itemForm.controls["id_intermediario"].setValue(0);
      this.intermediarioasignado = 0;
    });
  }

  getPersonaById(id) {
    //this.loader.open();
    this.personasService.getPersonaById(id).subscribe(data => {
      //this.loader.close();
      this.datospersona = data.data;
      this.itemForm.controls["cuit_cuil"].setValue(data.data.cuit_cuil);
      this.incorrectcuit = false;
    });
  }

  comprobarCUIT() {
    let info_cuit = [];
    let cuitparam = this.itemForm.controls["cuit_cuil"].value.toString();
    if (this.itemForm.invalid === false) {
      //this.loader.open();
      this.personasService
        .getTransportistaCuit(
          this.itemForm.controls["cuit_cuil"].value.toString()
        )
        .subscribe(data => {
          info_cuit = data.data;
          let codigo = info_cuit["codigo"];
          let id_usuario = info_cuit["id_usuario"];

          if (codigo == 0) {
            this.confirmService
              .confirm({
                message:
                  "No existe registro con este CUIT. ¿Desea ingresarlo como Transportista?"
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
                  dialogRefPersona.afterClosed().subscribe(res => {
                    if (!res) {
                      this.loader.close();
                      return;
                    }
                    data = res.data;
                    let id_usuario;
                    id_usuario = data.id;
                    this.personasService
                      .postRolPersona({
                        id_rol: 4,
                        id_usuario: id_usuario
                      })
                      .subscribe(
                        data => {
                          this.itemForm.controls[
                            "id_transporte"
                          ].setValue(data.data.id);
                          this.personasService
                            .getPersonaById(id_usuario)
                            .subscribe(data => {
                              this.loader.close();
                              this.datospersona = data.data;
                              this.itemForm.controls[
                                "cuit_cuil"
                              ].setValue(this.datospersona.cuit_cuil);
                              this.incorrectcuit = false;
                              this.showUnipersonal = false;
                            });
                        },
                        err => {
                          this.loader.close();
                          this.errorService
                            .confirm({ message: "Error: Se presentaron error al crear el usuario como transportista!" })
                            .subscribe(res => {
                              if (res) {
                                return;
                              }
                            });
                          this.incorrectcuit = true;
                        }
                      );
                  });
                } else {
                  this.loader.close();
                  return;
                }
              });
          } else if (codigo == 1) {
            // Existe como persona pero no como transportista
            this.confirmService
              .confirm({
                message:
                  "Ya existe el Cuit pero no posee el rol transportista. Desea ingresarlo como transportista?"
              })
              .subscribe(res => {
                if (res) {
                  this.personasService
                    .postRolPersona({
                      id_rol: 4,
                      id_usuario: id_usuario
                    })
                    .subscribe(
                      data => {
                        this.itemForm.controls["id_transporte"].setValue(
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
                            this.showUnipersonal = false;
                            this.loader.close();
                          });
                      },
                      err => {
                        this.loader.close();
                        this.errorService
                          .confirm({ message: "Error: Se presentaron error al crear el usuario como transportista " })
                          .subscribe(res => {
                            if (res) {
                              return;
                            }
                          });
                        this.incorrectcuit = true;
                      }
                    );
                } else {
                  this.loader.close();
                }
              });
          } else {
           
            let bandera = false;
            if (info_cuit["centros"].length > 0) {
              for (
                let index = 0;
                index < info_cuit["centros"].length;
                index++
              ) {
                if (
                  info_cuit["centros"][index].id_centro.toString() ===
                  this.idCentro
                ) {
                  bandera = true;
                  this.loader.close();
                  this.itemForm.controls["cuit_cuil"].setErrors(
                    Validators.max,
                    { emitEvent: false }
                  );
                  this.itemForm.controls["cuit_cuil"].markAsDirty();
                  this.alertService.confirm({
                    message: "Ya existe el transportista!"
                  });
                  this.incorrectcuit = true;
                }
              }
            }
            if (bandera == false) {
              this.itemForm.controls["id_transporte"].setValue(info_cuit["id"]);
              this.personasService
                .getPersonaById(id_usuario)
                .subscribe(data => {
                  this.loader.close();
                  this.datospersona = data.data;
                  this.itemForm.controls["cuit_cuil"].setValue(
                    this.datospersona.cuit_cuil
                  );
                  this.incorrectcuit = false;
                  this.showUnipersonal = false;
                });
            }
          }
        });
    } else {
      this.incorrectcuit = true;
    }
  }


  openPopUpCamionAcoplado(event) {
    let info_cuit = [];
    this.selectedUnipersonal = event.checked;
    if (this.selectedUnipersonal) {
      this.personasService
        .getChoferCuit(
          this.itemForm.controls["cuit_cuil"].value.toString()
        )
        .subscribe(data => {
          info_cuit = data.data;
          let codigo = info_cuit["codigo"];
          if (codigo == 1) {
            let id_usuario = info_cuit["id_usuario"];
            const title = 'Agregar Camión y acoplado';
            const dialogRef: MatDialogRef<any> = this.dialog.open(CamionAcopladoComponent, {
              width: '720px',
              disableClose: false,
              data: { title: title, payload: {}, isNew: true }
            });

            dialogRef.afterClosed()
              .subscribe(res => {
                if (!res) {
                  this.selectedUnipersonal = !this.selectedUnipersonal;
                  this.itemForm.controls["unipersonal"].setValue(this.selectedUnipersonal);
                  return;
                }
                this.selectedUnipersonal = this.selectedUnipersonal;
                this.camion = res.camion;
                this.acoplado = res.acoplado;
              });
            ///
          } else {
          }
        })
    }

  }
}
