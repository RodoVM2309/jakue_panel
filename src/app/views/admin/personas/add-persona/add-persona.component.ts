import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { MatChipInputEvent } from '@angular/material/chips';
import { existPersonaCuit } from 'app/shared/directives/cuit-validator';
import { Observable, Subscription } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { UniqueTelefonoPersonaValidator } from "../../../../shared/directives/unique-telefono-persona.directive";
import { AppAlertService } from "../../../../shared/services/app-alert/app-alert.service";
import { AppAtencionService } from "../../../../shared/services/app-atencion/app-atencion.service";
import { AppErrorService } from "../../../../shared/services/app-error/app-error.service";
import { AppLoaderService } from "../../../../shared/services/app-loader/app-loader.service";
import { PersonasService } from "./../../../../shared/services/personas.service";

export class TipoPersona {
  id: number;
  descripcion: string;
}

export class Pais {
  id: number;
  descripcion: string;
}

export class Provincia {
  id: number;
  descripcion: string;
}

export class Localidad {
  id: number;
  descripcion: string;
}

export interface Mail {
  name: string;
}

@Component({
  selector: "app-add-persona",
  templateUrl: "./add-persona.component.html",
  styleUrls: ["./add-persona.component.scss"]
})
export class AddPersonaComponent implements OnInit {
  public itemFormPersona: FormGroup;
  tipospersona: TipoPersona[];
  paises: Pais[];
  provincias: Provincia[];
  localidades: Localidad[];
  norazonsocial: boolean = true;
  nonombrapell: boolean = true;
  incorrect_emails: boolean = false;
  exists_emails: boolean = false;
  filteredOptions: Observable<Localidad[]>;
  app_chofer_instalada = 0;
  isNuevo: boolean = false;
  public getItemSub: Subscription;

  mailusuario = '';
  mailusuario_edit = '';
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  mailarray: Mail[] = [];

  esInicio = true;
  rigthChancePersona = false;
  id_tipo_persona: AbstractControl;
  phRuc = ''
  es_cliente_final = ''

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddPersonaComponent>,
    private fb: FormBuilder,
    private personasService: PersonasService,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,
    private loader: AppLoaderService,
    private alertService: AppAlertService,

  ) { }

  ngOnInit() {
    this.getTipoPersona();
    this.getPais();
    this.isNuevo = this.data.isNew;
    this.es_cliente_final = this.data.es_cliente_final ? this.data.es_cliente_final : '';
    console.log('this.data.es_cliente_final', this.es_cliente_final);
    if (
      this.data.payload.app_chofer_instalada !== undefined &&
      this.data.payload.app_chofer_instalada == 1
    ) {
      this.app_chofer_instalada = 1;
    }
    if (this.data.payload.localidad !== undefined) {
      this.cargarDatosInicialesPaisLocalidad(
        this.data.payload.id_pais,
        this.data.payload.localidad.id_provincia,
        this.data.payload.id_localidad
      );
    }
    this.buildItemForm(this.data.payload);
    console.log(this.itemFormPersona)
  }

  buildItemForm(item) {
    let id = item.id !== undefined ? item.id : "";
    let nombre = item.nombre !== undefined ? item.nombre : "";
    let apellidos = item.apellidos !== undefined ? item.apellidos : "";
    let cuit_cuil = item.cuit_cuil !== undefined ? item.cuit_cuil : "";
    let id_tipo_person = 0;
    /*   if (this.isNuevo) {
        if (cuit_cuil !== "") {
          let sub = cuit_cuil.substring(0, 1);
          id_tipo_person = cuit_cuil.substring(0, 1) === "2" ? 1 : 2;
          this.rigthChancePersona = false;
        } else {
          this.rigthChancePersona = false;
        }
      } else {
      } */
    id_tipo_person = item.id_tipo_persona !== undefined ? item.id_tipo_persona : "";
    let razon_social = item.razon_social !== undefined ? item.razon_social : "";
    let domicilio = item.domicilio !== undefined ? item.domicilio : "";
    let telefono = item.telefono !== undefined ? item.telefono : "";
    let pais = item.id_pais !== undefined ? item.id_pais : "";
    let provincia =
      item.localidad !== undefined ? item.localidad.id_provincia : "";
    let id_localidad = item.id_localidad !== undefined ? item.id_localidad : "";
    let username = "-";
    let password = "";;
    let email = "";
    if (item.email !== undefined) {
      let info_emails = [];
      info_emails = item.email.split(";");
      info_emails.forEach((mail, i) => {
        this.mailarray.push({ name: mail.trim() });
        this.mailusuario += mail.trim() + ';';
      });
      this.mailusuario_edit += this.mailusuario.slice(0, -1);;

    }
    if (item.id_tipo_persona !== undefined) {
      if (item.id_tipo_persona === 2) {
        this.nonombrapell = true;
      } else {
        this.nonombrapell = false;
      }
    } else {
      this.norazonsocial = true;
    }

    this.id_tipo_persona = new FormControl(id_tipo_person, Validators.required);

    this.itemFormPersona = this.fb.group(
      {
        id: [id],
        nombre: [nombre, Validators.required],
        apellidos: [apellidos, Validators.required],
        id_tipo_persona: this.id_tipo_persona,
        razon_social: [razon_social, Validators.required],
        cuit_cuil: [cuit_cuil,
          [Validators.required,
          ], this.isNuevo
            ? existPersonaCuit(this.personasService)
            : null
        ],
        domicilio: [domicilio, Validators.required],
        telefono: [
          telefono,
          [
            Validators.required,
            Validators.maxLength(15),
          ],
          this.isNuevo
            ? UniqueTelefonoPersonaValidator(this.personasService)
            : null
        ],
        pais: [pais, Validators.required],
        provincia: [provincia, Validators.required],
        id_localidad: [id_localidad, Validators.required],
        username: [username, Validators.required],
        password: [password, [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}")]],
        email: [email],
        es_cliente_final: [this.es_cliente_final],
      }
    );
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Agregando mail
    if ((value || '').trim()) {

      //  comprobando si puedo agregar el maail al arreglo
      this.incorrect_emails = false;
      this.exists_emails = false;
      this.itemFormPersona.invalid;
      if (this.itemFormPersona.controls["email"].value.toString() !== "") {
        let emailsparam = this.itemFormPersona.controls["email"].value.toString();
        if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(emailsparam)) {
          this.itemFormPersona.controls["email"].markAsDirty();
          this.incorrect_emails = true;
          return;
        } else {
          this.getItemSub = this.personasService
            .getEmailPersona(
              this.itemFormPersona.controls["email"].value.toString()
            )
            .subscribe(data => {
              // console.log(data);
              if (data.data) {
                this.exists_emails = true;
              } else {
                this.incorrect_emails = false;
                this.exists_emails = false;
                this.mailarray.push({ name: value.trim() });
                this.mailusuario = '';
                this.mailarray.forEach((mail, i) => {
                  this.mailusuario += mail.name + ';';
                });
              }
              return;
            });
        }
        this.incorrect_emails = false;
        this.exists_emails = false;
      } else {
        this.itemFormPersona.valid;
        this.incorrect_emails = false;
        this.exists_emails = false;
      }
    }

    // Reset todos los mail
    if (input) {
      input.value = '';
    }
  }

  remove(correo: Mail): void {
    const index = this.mailarray.indexOf(correo);

    if (index >= 0) {
      this.mailarray.splice(index, 1);
      this.mailusuario = '';
      this.mailarray.forEach((mail, i) => {
        this.mailusuario += mail.name + ';';
      });
      this.itemFormPersona.controls["email"].setValue(
        this.mailusuario
      );
    }
  }

  submit() {
    this.loader.open();
    this.itemFormPersona.controls["username"].setValue(
      this.itemFormPersona.controls["cuit_cuil"].value
    );

    if (this.itemFormPersona.controls["id_tipo_persona"].value === 1) {
      this.itemFormPersona.controls["razon_social"].setValue(
        this.itemFormPersona.controls["apellidos"].value +
        " " +
        this.itemFormPersona.controls["nombre"].value
      );
    }

    let datafrm = this.itemFormPersona.value;
    datafrm.cuit_cuil = datafrm.cuit_cuil.toString();

    if (this.itemFormPersona.controls["password"].value === "") {
      datafrm = {
        id: datafrm.id,
        nombre: datafrm.nombre,
        apellidos: datafrm.apellidos,
        id_tipo_persona: datafrm.id_tipo_persona,
        razon_social: datafrm.razon_social,
        cuit_cuil: datafrm.cuit_cuil,
        domicilio: datafrm.domicilio,
        telefono: datafrm.telefono,
        pais: datafrm.pais,
        provincia: datafrm.provincia,
        id_localidad: datafrm.id_localidad,
        username: datafrm.username,
        email: this.mailusuario_edit,
        es_cliente_final: datafrm.this.es_cliente_final,
        cliente_muvin: 1
      };
    }

    let datafrm1 = {
      id: datafrm.id,
      nombre: datafrm.nombre,
      apellidos: datafrm.apellidos,
      id_tipo_persona: datafrm.id_tipo_persona,
      razon_social: datafrm.razon_social,
      cuit_cuil: datafrm.cuit_cuil,
      domicilio: datafrm.domicilio,
      telefono: datafrm.telefono,
      pais: datafrm.pais,
      provincia: datafrm.provincia,
      id_localidad: datafrm.id_localidad,
      username: datafrm.username,
      email: this.mailusuario,
      password: datafrm.password,
      app_chofer_instalada: this.app_chofer_instalada,
      es_cliente_final: this.es_cliente_final,
      cliente_muvin: 1
    };


    if (this.isNuevo) {
      console.log('Dato a enviar', datafrm1);
      this.personasService.postPersona(datafrm1).subscribe(
        data => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.alertService
            .confirm({ message: "¡Persona Agregada!", tipo: "exito" })
            .subscribe(res => {
              if (res) {
                this.dialogRef.close(data);
              }
            });
        },
        err => {
          this.personasService.getPersonaByCuit(datafrm1.cuit_cuil).subscribe(
            data2 => {
              if (this.loader !== null) {
                this.loader.close();
              }
              if (data2.data.length > 0) {
                this.alertService
                  .confirm({ message: "¡Persona Agregada!", tipo: "exito" })
                  .subscribe(res => {
                    if (res) {
                      this.dialogRef.close({ success: true, data: data2.data[0] });
                    }
                  });
              } else {
                this.atencionService
                  .confirm({
                    message: "Se presentó algún problemas al crear la persona."
                  })
                  .subscribe(res => {
                    if (res) {
                    }
                  });
              }
            }
          );

        }
      );
    } else {
      this.personasService.updateUsuario(datafrm1).subscribe(
        data => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.alertService
            .confirm({ message: "¡Persona Modificada!", tipo: "exito" })
            .subscribe(res => {
              if (res) {
                this.dialogRef.close(datafrm1);
              }
            });
        },
        err => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.errorService
            .confirm({ message: "Esta Persona no se puede modificar" })
            .subscribe(res => {
              if (res) {
                //this.alertService.confirm({ message: err });
              }
            });
        }
      );
    }

  }

  getTipoPersona() {
    this.personasService.getTipoPersona().subscribe(data => {
      this.tipospersona = data.data;
    });
  }

  getPais() {
    //this.loader.open();
    this.personasService.getPais().subscribe(data => {
      this.paises = data.data.paises;
      //this.loader.close();
    });
  }

  getProvincias() {
    this.mostrarRazonSocial();
    this.loader.open();
    this.getProvinciasxPais(this.itemFormPersona.controls["pais"].value);
  }

  getProvinciasxPais(v) {
    this.personasService.getProvincias(v).subscribe(data => {
      this.provincias = data.data;
      this.localidades = [];
      if (this.loader !== null) {
        this.loader.close();
      }
    });
  }

  getLocalidades() {
    this.loader.open();
    this.getLocalidadesxProvincia(
      this.itemFormPersona.controls["provincia"].value
    );
  }

  getLocalidadesxProvincia(v) {
    this.personasService.geLocalidades(v).subscribe(data => {
      this.localidades = data.data;
      this.filteredOptions = this.itemFormPersona.controls[
        "id_localidad"
      ].valueChanges.pipe(
        startWith<string | Localidad>(""),
        map(value => (typeof value === "string" ? value : value.descripcion)),
        map(descripcion =>
          descripcion ? this._filter(descripcion) : this.localidades.slice()
        )
      );
      if (this.loader !== null) {
        this.loader.close();
      }
    });
  }

  displayFn(localidad?: Localidad): string | undefined {
    return localidad ? localidad.descripcion : undefined;
  }

  chanceTipoPersona(valor) {
    if (this.isNuevo) {
      this.esInicio = false;
      // this.itemFormPersona.controls["cuit_cuil"].setValue('');
      if (valor.value === 1) {
        this.norazonsocial = true;
        this.nonombrapell = false;
        this.itemFormPersona.controls["razon_social"].setValue(' ');
      } else {
        this.norazonsocial = false;
        this.nonombrapell = true;
        this.itemFormPersona.controls["nombre"].setValue(' ');
        this.itemFormPersona.controls["apellidos"].setValue(' ');
      }

    }
  }

  esValidoCuit(valor) {
    console.log(valor);
    if (valor.value.length == 11) {
      this.mostrarRazonSocial();
    }
  }

  mostrarRazonSocial() {
    if (this.itemFormPersona.controls["id_tipo_persona"].value === 1) {
      this.itemFormPersona.controls["razon_social"].setValue(
        this.itemFormPersona.controls["apellidos"].value +
        " " +
        this.itemFormPersona.controls["nombre"].value
      );
      this.norazonsocial = true;
      this.nonombrapell = false;
    } else {
      this.norazonsocial = false;
      this.nonombrapell = true;
      this.itemFormPersona.controls["nombre"].setValue("-");
      this.itemFormPersona.controls["apellidos"].setValue("-");
    }
  }

  validarCUIT(): boolean {
    // const multiplicador = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 1];
    // const cadenaCUIT = this.itemFormPersona.controls[
    //   "cuit_cuil"
    // ].value.toString();
    // let suma_prod = 0;
    // let valint;
    // for (let i = 0; i < 11; i++) {
    //   valint = cadenaCUIT.substring(i, i + 1);
    //   suma_prod += multiplicador[i] * parseInt(valint);
    // }
    // if (suma_prod % 11 !== 0) {
    //   return false;
    // }
    /*  if (
      this.itemFormPersona.controls["id_tipo_persona"].value === 1 &&
      cadenaCUIT.substring(0, 1) !== "2"
    ) {
      return false;
    }
    if (
      this.itemFormPersona.controls["id_tipo_persona"].value === 2 &&
      cadenaCUIT.substring(0, 1) !== "3"
    ) {
      return false;
    } */
    return true;
  }
  validarCUIT1(): boolean {
    const multiplicador = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 1];
    const cadenaCUIT = this.itemFormPersona.controls[
      "cuit_cuil"
    ].value.toString();
    /* let suma_prod = 0;
    let valint;
    for (let i = 0; i < 11; i++) {
      valint = cadenaCUIT.substring(i, i + 1);
      suma_prod += multiplicador[i] * parseInt(valint);
    }
    if (suma_prod % 11 !== 0) {
      return false;
    } */
    if (
      this.itemFormPersona.controls["id_tipo_persona"].value === 1 &&
      cadenaCUIT.substring(0, 1) !== "2"
    ) {
      return false;
    }
    if (
      this.itemFormPersona.controls["id_tipo_persona"].value === 2 &&
      cadenaCUIT.substring(0, 1) !== "3"
    ) {
      return false;
    }
    return true;
  }

  private _filter(descripcion: string): Localidad[] {
    const filterValue = descripcion.toLowerCase();
    return this.localidades.filter(
      option => option.descripcion.toLowerCase().indexOf(filterValue) >= 0
    );
  }

  cargarDatosInicialesPaisLocalidad(pais, provincia, localidad) {

    this.loader.open();
    this.personasService.getPais().subscribe(data => {
      this.paises = data.data.paises;
      this.itemFormPersona.controls["pais"].setValue(pais);
      this.personasService.getProvincias(pais).subscribe(data => {
        this.provincias = data.data;
        this.localidades = [];
        this.itemFormPersona.controls["provincia"].setValue(provincia);
        this.personasService.geLocalidades(provincia).subscribe(data => {
          this.localidades = data.data;
          this.itemFormPersona.controls["id_localidad"].setValue(localidad);
          this.filteredOptions = this.itemFormPersona.controls[
            "id_localidad"
          ].valueChanges.pipe(
            startWith<string | Localidad>(""),
            map(value =>
              typeof value === "string" ? value : value.descripcion
            ),
            map(descripcion =>
              descripcion ? this._filter(descripcion) : this.localidades.slice()
            )
          );
          if (this.loader !== null) {
            this.loader.close();
          }
        });
      });
    });
  }

  comprobarEmails() {
    let info_emails = [];
    this.incorrect_emails = false;
    this.exists_emails = false;
    this.itemFormPersona.invalid;
    if (this.itemFormPersona.controls["email"].value.toString() !== "") {
      let emailsparam = this.itemFormPersona.controls["email"].value.toString();
      if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(emailsparam)) {
        //this.itemFormPersona.controls['email'].setErrors(Validators.email, { emitEvent: false });
        this.itemFormPersona.controls["email"].markAsDirty();
        this.incorrect_emails = true;
        return;
      } else {
        this.getItemSub = this.personasService
          .getEmailPersona(
            this.itemFormPersona.controls["email"].value.toString()
          )
          .subscribe(data => {
            if (data.data.length > 0) {
              this.exists_emails = true;
            } else {
              this.incorrect_emails = false;
              this.exists_emails = false;
            }
            return;
          });
      }
      /* for (let i = 0; i < info_emails.length; i++) {

      } */
      this.incorrect_emails = false;
      this.exists_emails = false;
    } else {
      this.itemFormPersona.valid;
      this.incorrect_emails = false;
      this.exists_emails = false;
    }
  }
}
