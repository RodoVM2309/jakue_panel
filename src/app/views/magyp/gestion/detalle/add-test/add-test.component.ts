import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Test, MagypCadena, MagypAutoridad } from 'app/shared/models/magyp-cadena';
import { CuitValidator2, } from 'app/shared/directives/cuit-validator2';
import { PersonasService } from 'app/shared/services/personas.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MagypService } from 'app/shared/services/magyp.service';
import { forEach } from '@angular/router/src/utils/collection';

export class Provincia {
  id: number;
  descripcion: string;
}

export class Localidad {
  id: number;
  descripcion: string;
}
@Component({
  selector: 'app-add-test',
  templateUrl: './add-test.component.html',
  styleUrls: ['./add-test.component.scss']
})
export class AddTestComponent implements OnInit {
  testForm: FormGroup;
  local_data: any;
  action: string;
  isNew: boolean = false;
  provincias: Provincia[];
  localidades: Localidad[];
  cadenas: MagypCadena[] = [];
  autoridades: MagypAutoridad[] = [];
  resultados = [
    {
      id: 0,
      descripcion: 'NO'
    },
    {
      id: 1,
      descripcion: 'Sí > negativo'
    },
    {
      id: 2,
      descripcion: 'Sí > positivo'
    },
  ];
  seguimientos = [
    {
      id: 0,
      descripcion: 'No'
    },
    {
      id: 1,
      descripcion: 'Sí'
    },
  ]
  encontradoTrans = false;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Test,
    public dialogRef: MatDialogRef<AddTestComponent>,
    private fb: FormBuilder,
    private personasService: PersonasService,
    private loader: AppLoaderService,
    private magypService: MagypService,
    private snack: MatSnackBar,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    this.isNew = this.action == 'Add' ? true : false;
    this.encontradoTrans = this.action == 'Edit' ? true : false;
  }

  ngOnInit() {
    this.buildItemForm();
    this.getCadenas();
    this.getAutoridades();
    this.getProvinciasxPais(1);
  }

  get f() { return this.testForm.controls; }

  buildItemForm() {
    this.testForm = this.fb.group(
      {
        id: [this.isNew ? '' : this.local_data.transportista.id],
        cuit: [this.isNew ? '' : this.local_data.transportista.cuit, [Validators.required,
        Validators.maxLength(11),
        Validators.minLength(11),
        Validators.pattern("[0-9]*"),
        ]],
        nombre: [this.isNew ? '' : this.local_data.transportista.nombre_completo, Validators.required],
        patente: [this.isNew ? '' : this.local_data.transportista.patente, [Validators.required]],
        telefono: [this.isNew ? '' : this.local_data.transportista.telefono, [
          Validators.required,
          Validators.min(1000000000),
          Validators.max(9999999999)
        ]],
        id_cadena: [this.isNew ? '' : this.local_data.transportista.id_cadena, Validators.required],
        observaciones: [this.isNew ? '' : this.local_data.transportista.observaciones],
        id_resultado: ['', Validators.required],
        fecha: ['', Validators.required],
        provincia: ['', Validators.required],
        id_localidad: ['', Validators.required],
        id_autoridad: ['', Validators.required],
        id_seguimiento: ['', Validators.required],
      }
    );

  }

  getCadenas() {
    this.magypService.getCadenas()
      .subscribe(
        res => {
          this.cadenas = res.data;
        },
        error => {
        }
      );
  }
  getAutoridades() {
    this.autoridades = [];
    this.autoridades.push({ id: 0, descripcion: 'SIN IDENTIFICAR' })
    this.magypService.getAllAutoridades()
      .subscribe(
        res => {
          res.data.forEach(element => {
            this.autoridades.push(element);
          });
        },
        error => {
        }
      );
  }

  getProvinciasxPais(v) {
    this.personasService.getProvincias(v).subscribe(data => {
      this.provincias = data.data;
      this.localidades = [];
    });
  }

  getLocalidades() {
    this.getLocalidadesxProvincia(
      this.testForm.controls["provincia"].value
    );
  }

  getLocalidadesxProvincia(v) {
    this.loader.open();
    this.personasService.geLocalidades(v).subscribe(data => {
      this.localidades = data.data;
      this.loader.close();
    });
  }

  buscarTransportistaCuit() {
    this.magypService.getBuscarCuit(this.testForm.controls["cuit"].value)
      .subscribe(data => {
        console.log(data);
        let user: any;
        if (data) {
          user = data;
          this.testForm.controls["id"].setValue(user.data.id);
          this.testForm.controls["nombre"].setValue(user.data.nombre_completo);
          this.testForm.controls["patente"].setValue(user.data.patente);
          this.testForm.controls["telefono"].setValue(user.data.telefono);
          this.testForm.controls["id_cadena"].setValue(user.data.id_cadena);
          this.testForm.controls["observaciones"].setValue(user.data.observaciones);
          this.encontradoTrans = true;
        }
      });
  }

  submit() {
    let datos = {};
    this.loader.open('Espere por favor...', 'Agregando..');
    if (this.encontradoTrans) {
      datos = {
        id_transportista: this.testForm.controls["id"].value,
        resultado: this.testForm.controls["id_resultado"].value,
        id_localidad: this.testForm.controls["id_localidad"].value,
        id_autoridad_salud: this.testForm.controls["id_autoridad"].value,
        seguimiento: this.testForm.controls["id_seguimiento"].value
      }
    } else {
      datos = {
        cuit: this.testForm.controls["cuit"].value,
        nombre_completo: this.testForm.controls["nombre"].value,
        patente: this.testForm.controls["patente"].value,
        telefono: this.testForm.controls["telefono"].value.toString(),
        id_cadena: this.testForm.controls["id_cadena"].value,
        observaciones: this.testForm.controls["observaciones"].value,
        resultado: this.testForm.controls["id_resultado"].value,
        id_localidad: this.testForm.controls["id_localidad"].value,
        id_autoridad_salud: this.testForm.controls["id_autoridad"].value,
        seguimiento: this.testForm.controls["id_seguimiento"].value
      }
    }
    this.magypService.postTest(datos).subscribe(resp => {
      this.loader.close();
      this.dialogRef.close(resp);
      this.snack.open('Test agregado!', 'OK', { duration: 4000 });

    },
      error => {
        this.loader.close();
        this.snack.open('¡No se puede agregar el Test!', 'Error', { duration: 4000 });
      });
  }


}
