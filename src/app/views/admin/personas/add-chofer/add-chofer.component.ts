import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {
  AppAlertService,
  AppAtencionService,
  AppErrorService,
  AppLoaderService,
  CentrosService,
  PersonasService
} from "@app/shared/services";

export class DataPost {
  choferes: any[];
}

@Component({
  selector: "app-add-chofer",
  templateUrl: "./add-chofer.component.html",
  styleUrls: ["./add-chofer.component.scss"],
})
export class AddChoferComponent implements OnInit {
  itemFormPersona: FormGroup;
  postData: DataPost;
  listError: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddChoferComponent>,
    private fb: FormBuilder,
    private personasService: PersonasService,
    private alertService: AppAlertService,
    private errorService: AppErrorService,
    private loader: AppLoaderService,
    private atencionService: AppAtencionService,
    private centrosService: CentrosService
  ) { }

  ngOnInit() {
    this.postData = new DataPost();
    let data = {
      cuit_cuil: this.data.payload.cuit_cuil,
    };
    this.itemFormPersona = this.buildItemFormPersona(data);
  }

  buildItemFormPersona(item: any): FormGroup {
    return this.fb.group({
      id: [item.id],
      nombre: ["", [Validators.required, Validators.maxLength(35)]],
      apellidos: ["", [Validators.required, Validators.maxLength(35)]],
      cuit_cuil: [item.cuit_cuil, Validators.required],
      telefono: ["", [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern("^[0-9]{12}$")]],
      chapa_camion: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(8),
          Validators.pattern("([A-Z0-9]{6,8})$"),
        ],
      ],
      chapa_acoplado: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(8),
          Validators.pattern("([A-Z0-9]{6,8})$"),
        ],
      ],
    });
  }
  get f() {
    return this.itemFormPersona.controls;
  }
  submit() {
    this.loader.open();

    let datafrm = this.itemFormPersona.value;
    datafrm.cuit_cuil = datafrm.cuit_cuil.toString();

    let listChoferes = [];
    this.postData.choferes = [];
    const chofer = {
      persona: {
        nombre: datafrm.nombre,
        apellidos: datafrm.apellidos,
        cuit_cuil: datafrm.cuit_cuil,
        telefono: datafrm.telefono,
        email: datafrm.cuit_cuil + "@gmail.com",
        domicilio: "Paraguay",
        id_tipo_persona: "2",
        razon_social: datafrm.nombre + " " + datafrm.apellidos,
        /*id_localidad: element.id_localidad,
         */
      },
      camion: {
        patente: datafrm.chapa_camion,
        id_marca_camion: 14,
        id_tipo_camion: 1,
        carga_peligrosa: 0,
        anno: "2022",
      },
      acoplado: {
        patente: datafrm.chapa_acoplado,
        id_marca_acoplado: 24,
        id_tipo_acoplado: 0,
        carga_peligrosa: 0,
        anno: "2022",
      },
      cuit_transportista: datafrm.cuit_cuil,
    };
    listChoferes.push(chofer);
    this.postData.choferes = listChoferes;
    this.centrosService.postCargaMasiva(this.postData).subscribe(
      (data) => {
        if (this.loader !== null) {
          this.loader.close();
        }
        if (data.data.errors.length > 0) {
          let msg = "";
          data.data.errors.forEach((element) => {
            msg += element.message + "\n";
          });
          //this.listError = data.data.errors;
          this.errorService.confirm({
            title: "¡Se presentó algún problemas al crear la persona.! ",
            message: msg,
          });
        }
        if (data.data.count_success > 0) {
          this.alertService
            .confirm({ message: "¡Persona Agregada!", tipo: "exito" })
            .subscribe((res) => {
              if (res) {
                this.dialogRef.close(chofer);
              }
            });
        }
      },
      (err) => {
        if (this.loader !== null) {
          this.loader.close();
        }
        this.errorService.confirm({
          message: "¡Se presentó algún problemas al crear la persona.! ",
        });
      }
    );
  }

  cancelar() {
    console.log("cancelar", this.itemFormPersona.controls);
    this.dialogRef.close(false);
  }
}
