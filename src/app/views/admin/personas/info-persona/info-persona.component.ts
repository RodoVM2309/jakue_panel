import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { PersonasService } from './../../../../shared/services/personas.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';

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
};

@Component({
  selector: 'app-info-persona',
  templateUrl: './info-persona.component.html',
  styleUrls: ['./info-persona.component.scss']
})
export class InfoPersonaComponent implements OnInit {
  persona: Persona;
  public itemForm: FormGroup;
  norazonsocial: boolean = false;
  nonombrapell: boolean = false;
  mostrar: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InfoPersonaComponent>,
    private fb: FormBuilder,
    private personasService: PersonasService,
    private loader: AppLoaderService,
    private errorService: AppErrorService,) { }

  ngOnInit() {
    this.getPersona(this.data.payload.id);
    this.buildItemForm();
  }

  getPersona(id) {
    this.loader.open();
    this.personasService.getPersonaByPersonaRol(id)
      .subscribe(data => {
        this.persona = data.data;
        this.itemForm.controls['id'].setValue(id);
        this.itemForm.controls['nombre'].setValue(this.persona.nombre);
        this.itemForm.controls['apellidos'].setValue(this.persona.apellidos);
        this.itemForm.controls['razon_social'].setValue(this.persona.razon_social);
        this.itemForm.controls['cuit_cuil'].setValue(this.persona.cuit_cuil);
        this.itemForm.controls['domicilio'].setValue(this.persona.domicilio);
        this.itemForm.controls['telefono'].setValue(this.persona.telefono);
        this.itemForm.controls['pais'].setValue(this.persona.pais.descripcion);
        this.itemForm.controls['provincia'].setValue(this.persona.provincia.descripcion);
        this.itemForm.controls['localidad'].setValue(this.persona.localidad.descripcion);
        this.itemForm.controls['username'].setValue(this.persona.username);
        this.itemForm.controls['email'].setValue(this.persona.email);
        this.mostrar = true;
        this.persona.id_tipo_persona == 2 ? this.norazonsocial = true : this.norazonsocial = false;
        this.persona.id_tipo_persona == 1 ? this.nonombrapell = true : this.nonombrapell = false;
        this.personasService.getTipoPersona()
          .subscribe(data => {
            const tipospersona = data.data;
            let tipopers = '';
            for (let i = 0; i < tipospersona.length; i++) {
              if (tipospersona[i].id === this.persona.id_tipo_persona) {
                tipopers = tipospersona[i].descripcion;
                break;
              }
            }

            this.itemForm.controls['tipo_persona'].setValue(tipopers);
            this.loader.close();
          });
      },
      err => {
        if (this.loader !== null) {
          this.loader.close();
        }
        this.errorService
          .confirm({ message: "No se puede encontrar el perfil" })
          .subscribe(res => {
            if (res) {
              return;
            }
          });
      });
  }

  buildItemForm() {
    this.itemForm = this.fb.group({
      id: [''],
      nombre: [''],
      apellidos: [''],
      tipo_persona: [''],
      razon_social: [''],
      cuit_cuil: [''],
      domicilio: [''],
      telefono: [''],
      pais: [''],
      provincia: [''],
      localidad: [''],
      username: [''],
      email: ['']
    });
  }

  submit() {
    this.dialogRef.close();
  }
}
