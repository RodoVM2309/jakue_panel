/// <reference types="@types/googlemaps" />
import { Component, OnInit, Inject, ViewChild, ElementRef } from "@angular/core";
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { FormBuilder, Validators, FormGroup, FormControl } from "@angular/forms";
import { PersonasService } from "./../../../../shared/services/personas.service";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "../../../../shared/services/app-loader/app-loader.service";
import { AppErrorService } from "../../../../shared/services/app-error/app-error.service";
import { AppAtencionService } from "../../../../shared/services/app-atencion/app-atencion.service";
import { Person } from './../../../../shared/models/person';
import { AddPersonaComponent } from '../../personas/add-persona/add-persona.component';
import { CentrosService } from "app/shared/services/centros.service";
import { UserService } from "app/shared/services/user.service";

export interface Marcador {
  lat: number;
  lng: number;
  draggable: boolean;
  titulo: string;
  desc?: string;
}

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

@Component({
  selector: "app-add-operador-cliente-chat",
  templateUrl: "./add-operador-cliente-chat.component.html",
  styleUrls: ["./add-operador-cliente-chat.component.scss"]
})
export class AddOperadorClienteChatComponent implements OnInit {
  public itemForm: FormGroup;
  showMap: boolean = true;
  pages: any;

  nombre: string;
  apellidos: string;
  telefono: string;

  panelOpenState = false;
  deshabilitarCoord: boolean = true;

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;

  @ViewChild("search")
  public searchElementRef: ElementRef;
  datospersona: Person;
  personasrol: PersonasRol[];
  incorrectcuit: boolean = true;
  isNew: boolean = true;
  idUser: string ='';
	

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddOperadorClienteChatComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private personasService: PersonasService,
    private centrosService: CentrosService,
    private confirmService: AppConfirmService,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,
    private loader: AppLoaderService, private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
      .subscribe(data => this.idUser = data.data);
    this.isNew = (this.data.isNew !== undefined) ? true : false;
    this.buildItemForm(this.data.payload);

    //create search FormControl
    this.searchControl = new FormControl();


  }

  get f() {
    return this.itemForm.controls;
  }



  buildItemForm(item) {
    this.nombre = item.nombre;
    this.apellidos = item.apellidos;
    this.telefono = item.telefono;
    this.incorrectcuit = (item.cuitCentro) ? false : true;
    this.itemForm = this.fb.group({
      id: [item.id || ""],
      nombre: [item.nombre || "", Validators.required],
      apellidos: [item.apellidos || "", Validators.required],
      telefono: [item.telefono || "", Validators.required],
      cuit_cuil: [item.cuitCentro, [Validators.required, Validators.min(20000000000), Validators.max(39999999999)]],
      id_padre: this.idUser,
      id_centro: [item.id_centro]
    });
  }

  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }

  comprobarCUIT() {
    let info_cuit = [];
    let cuitparam = this.itemForm.controls['cuit_cuil'].value.toString();
    this.loader.open();
    this.centrosService.getCentroCuit(this.itemForm.controls['cuit_cuil'].value.toString())
      .subscribe(data => {
        let info_cuit = data.data;
        let codigo = info_cuit['existe'];
        let id_usuario = info_cuit['id_persona'];
        let id_centro = info_cuit['id_centro'];
        if (codigo == 0) {// no existe como persona ni como centro
          this.confirmService.confirm({ message: 'No existe registro con este cuit. Desea ingresarlo como Persona?' })
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
                    }
                    let id_usuario = res.data.id;
                    this.personasService.postRolPersona({
                      id_rol: 3,
                      id_usuario: id_usuario
                    }).subscribe(data => {
                      this.itemForm.controls['id_centro'].setValue(data.data.id);
                      this.personasService.getPersonaById(id_usuario)
                        .subscribe(data => {
                          this.loader.close();
                          this.datospersona = data.data;
                          this.itemForm.controls['cuit_cuil'].setValue(this.datospersona.cuit_cuil);
                          this.incorrectcuit = false;
                        });
                    }, err => {
                      this.loader.close();
                      this.errorService.confirm({ message: 'Hay errores!' });
                      this.incorrectcuit = true;
                      this.loader.close();
                    });
                  });
              } else {
                this.loader.close();
              }
            });
          this.loader.close();
        } else
          if (codigo == 1) {// Existe como persona pero no como centro
            this.confirmService.confirm({ message: 'Ya existe el CUIT/CUIL pero no posee el Rol Centro. Desea ingresarlo como Centro?' })
              .subscribe(res => {
                if (res) {
                  this.personasService.postRolPersona({
                    id_rol: 3,
                    id_usuario: id_usuario
                  })
                    .subscribe(data => {
                      this.itemForm.controls['id_centro'].setValue(data.data.id);
                      this.personasService.getPersonaById(id_usuario)
                        .subscribe(data => {
                          this.datospersona = data.data;
                          this.itemForm.controls['cuit_cuil'].setValue(this.datospersona.cuit_cuil);
                          this.incorrectcuit = false;
                          this.loader.close();
                        });
                    }, err => {
                      this.loader.close();
                      this.errorService.confirm({ message: 'Hay errores!' });
                      this.incorrectcuit = true;
                    });
                } else {
                  this.loader.close();
                }
              });
          } else {// existe como persona y como centro, ver si esta en el centro
            
            let bandera = false;
            if (id_centro.toString() === this.idUser) {
              bandera = true;
              this.loader.close();
              this.itemForm.controls['cuit_cuil'].setErrors(Validators.max, { emitEvent: false });
              this.itemForm.controls['cuit_cuil'].markAsDirty();
              this.atencionService.confirm({ message: '¡Ya existe el centro!' });
              this.incorrectcuit = true;
            }
            if (bandera == false) {
              this.loader.close();
              this.itemForm.controls['id_centro'].setValue(id_centro);
              this.incorrectcuit = false;
            }
          }
      });

  }

}
