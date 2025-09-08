import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import {
  MatDialogRef,
  MatDialog,
  MatProgressBar,
  MatButton,
  MAT_DIALOG_DATA
} from "@angular/material";
import { FormGroup, Validators, FormBuilder, FormControl } from "@angular/forms";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { PersonasService } from "app/shared/services/personas.service";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { AppAlertService } from "app/shared/services/app-alert/app-alert.service";
import { SubirLogoCentroComponent } from "app/views/admin/centros/subir-logo-centro/subir-logo-centro.component";
import { CustomValidators } from 'ng2-validation';

export class Persona {
  id: number;
  username: string;
  email: string;
  id_tipo_persona: number;
  nombre: string;
  id_localidad: number;
  apellidos: string;
  razon_social: string;
  cuit_cuil: number;
  domicilio: string;
  telefono: number;
  clave: string;
  localidad: {
    id: number;
    id_provincia: number;
    descripcion: string;
    codigopostal: number;
  };
  provincia: {
    id: number;
    descripcion: string;
    id_pais: number;
    pais: {
      id: number;
      descripcion: string;
    };
  };
  pais: {
    id: number;
    descripcion: string;
  };
}

@Component({
  selector: "app-perfil",
  templateUrl: "./perfil.component.html",
  styleUrls: ["./perfil.component.scss"]
})
export class PerfilComponent implements OnInit {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  updatePerfil: FormGroup;
  persona: Persona;
  rol: string;
  public chancePasswordForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogLocaRef: MatDialogRef<PerfilComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private personasService: PersonasService,
    private errorService: AppErrorService,
    private dialog: MatDialog,
    private alertService: AppAlertService,
  ) { }

  ngOnInit() {
    this.rol = localStorage.getItem("rol");
    this.buildItemForm();
    this.persona = new Persona();
    this.persona.razon_social = '';
    this.persona.username = '';
    this.getPersona();
    const password = new FormControl('', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}")]);
    const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
    this.chancePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: password,
      confirmPassword: confirmPassword,
    });
  }

  subir() {
    let title = "Subir logo del centro";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      SubirLogoCentroComponent,
      {
        width: "720px",
        disableClose: true,
        data: { title: title }
      }
    );
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
    });
  }
  /* get f() {
    return this.chancePasswordForm.controls;
  } */

  getPersona() {
    this.loader.open();
    this.personasService.getMyPersonaRolPerfil().subscribe(data => {
      this.persona = data.data;
      this.updatePerfil.controls["id"].setValue(this.persona.id);
      this.updatePerfil.controls["nombre"].setValue(this.persona.nombre);
      this.updatePerfil.controls["apellidos"].setValue(this.persona.apellidos);
      this.updatePerfil.controls["razon_social"].setValue(
        this.persona.razon_social
      );
      this.updatePerfil.controls["username"].setValue(this.persona.username);
      this.updatePerfil.controls["email"].setValue(this.persona.email);
      this.loader.close();
    });
  }

  buildItemForm() {
    this.updatePerfil = this.fb.group({
      id: [""],
      nombre: ["", Validators.required],
      apellidos: ["", Validators.required],
      razon_social: ["", Validators.required],
      username: ["", Validators.required],
     // password: ["", [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}")]],
      email: [""],
      clave: [""]
    },
      err => {
        if (this.loader !== null) {
          this.loader.close();
        }
        this.errorService
          .confirm({ message: "Error al buscar mi perfil" })
          .subscribe(res => {
            if (res) {
              return;
            }
          });
      });
  }

  postPerfil() {
    this.loader.open();
    if (this.rol == '1') {
      this.personasService.updatePersonaAdmin(this.updatePerfil.value).subscribe(
        data => {
          this.persona = data.data;
          if (this.loader !== null) {
            this.loader.close();
          }
          this.alertService
            .confirm({ message: "¡Perfil actualizado!", tipo: "exito" })
            .subscribe(res => {
              if (res) {
                return;
              }
            });
        },
        err => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.errorService
            .confirm({ message: "No se puede actualizar este perfil" })
            .subscribe(res => {
              if (res) {
                return;
              }
            });
        }
      );

    } else {
      this.personasService.updatePersona(this.updatePerfil.value).subscribe(
        data => {
          this.persona = data.data;
          if (this.loader !== null) {
            this.loader.close();
          }
          this.alertService
            .confirm({ message: "¡Perfil actualizado!", tipo: "exito" })
            .subscribe(res => {
              if (res) {
                return;
              }
            });
        },
        err => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.errorService
            .confirm({ message: "No se puede actualizar este perfil" })
            .subscribe(res => {
              if (res) {
                return;
              }
            });
        }
      );

    }

  }
  submitChancePassWord() {
    this.personasService.chancePassword(this.chancePasswordForm.controls['oldPassword'].value, this.chancePasswordForm.controls['newPassword'].value, this.chancePasswordForm.controls['confirmPassword'].value)
      .subscribe(data => {
        this.loader.close();
        if (data) {
          this.alertService
            .confirm({ message: "¡Contraseña cambiada!", tipo: "exito" })
            .subscribe(res => {
              if (res) {
                return;
              }
            });
        } else {
          this.errorService
            .confirm({ message: "No se puede cambiar la contraseña" })
            .subscribe(res => {
              if (res) {
                return;
              }
            });
        }
      }, error => {
        this.errorService
          .confirm({ message: "No se puede cambiar la contraseña" })
          .subscribe(res => {
            if (res) {
              return;
            }
          });
      });


  }

  cancelar() {
    this.dialogLocaRef.close();
  }
}
