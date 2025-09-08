import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material";
import {
  FormBuilder,
  Validators,
  FormGroup,
} from "@angular/forms";
import { PersonasService } from "./../../../../shared/services/personas.service";
import { AppLoaderService } from "../../../../shared/services/app-loader/app-loader.service";
import { BehaviorSubject, Observable, Subscription, of } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { SubirLogoCentroComponent } from "../../centros/subir-logo-centro/subir-logo-centro.component";

export class Persona {
  id: number;
  id_persona: number;
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

@Component({
  selector: "app-perfil",
  templateUrl: "./perfil.component.html",
  styleUrls: ["./perfil.component.scss"]
})
export class PerfilComponent implements OnInit {
  persona: Persona;
  public itemForm: FormGroup;
  paises: Pais[];
  provincias: Provincia[];
  localidades: Localidad[];
  filteredOptions: Observable<Localidad[]>;
  norazonsocial: boolean = false;
  nonombrapell: boolean = false;
  public getItemSub: Subscription;
  incorrect_emails: boolean = false;
  exists_emails: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PerfilComponent>,
    private fb: FormBuilder,
    private personasService: PersonasService,
    private dialog: MatDialog,
    private loader: AppLoaderService
  ) {}

  ngOnInit() {
    //this.getPais();
    this.getPersona(this.data.payload.id_usuario);
    this.buildItemForm();
  }

  getPersona(id) {
    //this.loader.open();
    this.personasService.getPersonaByPersonaRol(id).subscribe(data => {
      this.persona = data.data;
      this.itemForm.controls["id"].setValue(this.persona.id);
      this.itemForm.controls["nombre"].setValue(this.persona.nombre);
      this.itemForm.controls["apellidos"].setValue(this.persona.apellidos);
      this.itemForm.controls["razon_social"].setValue(
        this.persona.razon_social
      );
      this.itemForm.controls["cuit_cuil"].setValue(this.persona.cuit_cuil);
      this.itemForm.controls["domicilio"].setValue(this.persona.domicilio);
      this.itemForm.controls["telefono"].setValue(this.persona.telefono);
      this.cargarDatosInicialesPaisLocalidad(
        this.persona.pais.id,
        this.persona.provincia.id,
        this.persona.localidad.id
      );
      this.itemForm.controls["username"].setValue(this.persona.username);
      this.itemForm.controls["email"].setValue(this.persona.email);
      this.personasService.getTipoPersona().subscribe(data => {
        const tipospersona = data.data;
        let tipopers = "";
        for (let i = 0; i < tipospersona.length; i++) {
          if (tipospersona[i].id === this.persona.id_tipo_persona) {
            tipopers = tipospersona[i].descripcion;
            break;
          }
        }
        this.itemForm.controls["tipo_persona"].setValue(tipopers);
        if (
          this.persona.id_tipo_persona !== undefined &&
          this.persona.id_tipo_persona === 2
        ) {
          this.nonombrapell = true;
        } else {
          this.norazonsocial = true;
        }
      });
    });
  }

  buildItemForm() {
    this.itemForm = this.fb.group({
      id: [""],
      nombre: ["", Validators.required],
      apellidos: ["", Validators.required],
      tipo_persona: ["", Validators.required],
      razon_social: ["", Validators.required],
      cuit_cuil: ["", Validators.required],
      domicilio: ["", Validators.required],
      telefono: ["", Validators.required],
      pais: ["", Validators.required],
      provincia: ["", Validators.required],
      id_localidad: ["", Validators.required],
      username: ["", Validators.required],
      email: ["", Validators.email]
    });
  }

  submit() {
    this.dialogRef.close(this.itemForm.value);
  }

  getPais() {
    this.loader.open();
    this.personasService.getPais().subscribe(data => {
      this.paises = data.data.paises;
      this.loader.close();
    });
  }

  getProvincias() {
    this.loader.open();
    this.getProvinciasxPais(this.itemForm.controls["pais"].value);
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
    this.getLocalidadesxProvincia(this.itemForm.controls["provincia"].value);
  }

  getLocalidadesxProvincia(v) {
    this.personasService.geLocalidades(v).subscribe(data => {
      this.localidades = data.data;
      this.filteredOptions = this.itemForm.controls[
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
      this.itemForm.controls["pais"].setValue(pais);
      this.personasService.getProvincias(pais).subscribe(data => {
        this.provincias = data.data;
        this.localidades = [];
        this.itemForm.controls["provincia"].setValue(provincia);
        this.personasService.geLocalidades(provincia).subscribe(data => {
          this.localidades = data.data;
          this.itemForm.controls["id_localidad"].setValue(localidad);
          this.filteredOptions = this.itemForm.controls[
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

  displayFn(localidad?: Localidad): string | undefined {
    return localidad ? localidad.descripcion : undefined;
  }

  comprobarEmails() {
    let info_emails = [];
    this.incorrect_emails = false;
    this.exists_emails = false;
    this.itemForm.invalid;
    if (this.itemForm.controls["email"].value.toString() !== "") {
      let emailsparam = this.itemForm.controls["email"].value.toString();
      info_emails = emailsparam.split(";");
      for (let i = 0; i < info_emails.length; i++) {
        if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(info_emails[i])) {
          //this.itemForm.controls['email'].setErrors(Validators.email, { emitEvent: false });
          this.itemForm.controls["email"].markAsDirty();
          this.incorrect_emails = true;
          return;
        } else {
          this.getItemSub = this.personasService
            .getEmailPersona(
              this.itemForm.controls["email"].value.toString()
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
      }
      this.incorrect_emails = false;
      this.exists_emails = false;
    } else {
      this.itemForm.valid;
      this.incorrect_emails = false;
      this.exists_emails = false;
    }
  }
  subir(data) {
    let title = "Subir logo del centro";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      SubirLogoCentroComponent,
      {
        width: "720px",
        disableClose: true,
        data: { title: title, payload: data }
      }
    );
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
    });
  }
}
