import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PersonasService } from './../../../../shared/services/personas.service';
import { PlayasIntermediasService } from './../../../../shared/services/playas-intermedias.service';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { Person } from './../../../../shared/models/person';
import { AddPersonaComponent } from '../../personas/add-persona/add-persona.component';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';


export class ZonasDestino {
  id: number;
  descripcion: string;
};

export class Pais {
  id: number;
  descripcion: string;
};

export class Provincia {
  id: number;
  descripcion: string;
};

export class Localidad {
  id: number;
  descripcion: string;
};

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

export interface Marcador {
  lat: number;
  lng: number;
  draggable: boolean;
  titulo: string;
  desc?: string;
};

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
  selector: 'app-add-playa-intermedia',
  templateUrl: './add-playa-intermedia.component.html',
  styleUrls: ['./add-playa-intermedia.component.scss']
})
export class AddPlayaIntermediaComponent implements OnInit {
  persona: Persona;
  public itemForm: FormGroup;
  zonasdestino: ZonasDestino[];
  paises: Pais[];
  provincias: Provincia[];
  localidades: Localidad[];
  personasrol: PersonasRol[];
  datospersona: Person;
  showMap: boolean = true;
  pages: any;
  incorrectcuit: boolean = true;
  lat: number = -32.96104572191259;
  lng: number = -61.15374192669714;
  zoom: number = 7;
  marcadores: Marcador[] = [];
  marcadorSel: any = null;
  draggable: string = '1';
  panelOpenState = false;
  deshabilitarCoord: boolean = true;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddPlayaIntermediaComponent>,
  private fb: FormBuilder,
  private dialog: MatDialog,
  private personasService: PersonasService,
  private playasIntermediasService: PlayasIntermediasService,
  private confirmService: AppConfirmService,
  private snack: MatSnackBar,
  private loader: AppLoaderService,
  private alertService: AppAlertService) { }

  ngOnInit() {
    this.getPais();
    this.getZonasDestino();
    if (this.data.payload.id_persona_rol !== undefined) {
      this.personasService.getPersonaByPersonaRol(this.data.payload.id_usuario)
        .subscribe(data => {
          if (this.data.payload.id_pais !== undefined) {
            this.cargarDatosInicialesPaisLocalidad(this.data.payload.id_pais, this.data.payload.id_provincia, this.data.payload.id_localidad);
          }
          this.persona = data.data;
          this.buildItemForm(this.data.payload, this.persona.cuit_cuil);
        });
    } else {
      this.buildItemForm(this.data.payload, '');
    }
  }

  buildItemForm(item, cuit_destino) {

    console.log(item);
    let pais = (item.id_pais !== undefined) ? item.id_pais : '';
    let provincia = (item.id_provincia !== undefined) ? item.id_provincia : '';
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      id_persona_rol: [item.id_persona_rol || ''],
      id_zona_destino: [item.id_zona_destino || '', Validators.required],
      descripcion: [item.descripcion || '', Validators.required],
      id_localidad: [item.id_localidad, Validators.required],
      domicilio: [item.domicilio],
      telefono: [item.telefono || ''],
      email: [item.email || '', Validators.email],
      longitud: [item.longitud || '', Validators.required],
      latitud: [item.latitud || '', Validators.required],
      cuit_cuil: [cuit_destino || '', [Validators.required, Validators.min(20000000000), Validators.max(39999999999)]],
      pais: [pais],
      provincia: [provincia],
      solucion_muvin: [item.solucion_muvin ]
    });
    if (item.longitud !== '' && item.latitud !== '') {
      const nuevoMarcador: Marcador = {
        lat: item.latitud,
        lng: item.longitud,
        titulo: '',
        draggable: true
      };
      if (this.marcadores.length > 0) {
        this.marcadores[0] = nuevoMarcador;
      } else {
        this.marcadores.push(nuevoMarcador);
      }
    }
  }

  submit() {
    let datafrm = this.itemForm.value;
    datafrm.solucion_muvin = (this.itemForm.controls['solucion_muvin'].value == true) ? 1 : 0;
    datafrm.cuit_cuil = datafrm.cuit_cuil.toString();
    this.dialogRef.close(datafrm);
  }


  getZonasDestino() {
    this.playasIntermediasService.getZonasPlayaIntermediaSelect()
      .subscribe(data => {
        this.zonasdestino = data.data;
      });
  }

  getAllPersonaRol() {
    this.playasIntermediasService.getAllPersonaRol()
      .subscribe(data => {
        this.personasrol = data.data;
      });
  }

  getPais() {
    //this.loader.open();
    this.personasService.getPais()
      .subscribe(data => {
        this.paises = data.data.paises;
        //this.loader.close();
      });
  }

  getProvincias() {
    this.loader.open();
    this.getProvinciasxPais(this.itemForm.controls['pais'].value);
  }

  getProvinciasxPais(v) {
    this.personasService.getProvincias(v)
      .subscribe(data => {
        this.provincias = data.data;
        this.localidades = [];
        if (this.loader !== null) {
          this.loader.close();
        }
      });
  }

  getLocalidades() {
    this.loader.open();
    this.getLocalidadesxProvincia(this.itemForm.controls['provincia'].value);
  }

  getLocalidadesxProvincia(v) {
    this.personasService.geLocalidades(v)
      .subscribe(data => {
        this.localidades = data.data;
        if (this.loader !== null) {
          this.loader.close();
        }
      });
  }
  comprobarCUIT() {
    let info_cuit = [];
    let cuitparam = this.itemForm.controls['cuit_cuil'].value.toString();
    if (this.itemForm.controls['cuit_cuil'].status === 'VALID') {
      //this.loader.open();
      this.personasService.getDestinoCuit(this.itemForm.controls['cuit_cuil'].value.toString())
        .subscribe(data => {

          info_cuit = data.data;
          let codigo = info_cuit['codigo'];
          let id_usuario = info_cuit['id_usuario'];
          let id_persona_rol = info_cuit['id'];
          this.itemForm.controls['id_persona_rol'].setValue(info_cuit['id']);
          // if (codigo == 0) {// no existe como persona
          //   this.confirmService.confirm({ message: 'No existe registro de Playa Intermedia con este CUIT. ¿Desea primero ingresarlo como persona?' })
          //     .subscribe(res => {
          //       if (res) {
          //         let dialogRefPersona: MatDialogRef<any> = this.dialog.open(AddPersonaComponent, {
          //           width: '720px',
          //           disableClose: true,
          //           data: { title: 'Agregar persona', payload: { cuit_cuil: cuitparam }, isNew: true }
          //         });
          //         dialogRefPersona.afterClosed()
          //           .subscribe(res => {
          //             if (!res) {
          //               this.loader.close();
          //               return;
          //             }

          //             let id_usuario;
          //             if (res.success) {
          //               id_usuario = res.data.id;
          //               this.personasService.postRolPersona({
          //                 id_rol: 7,
          //                 id_usuario: id_usuario
          //               }).subscribe(data => {
          //                 this.itemForm.controls['id_persona_rol'].setValue(data.data.id);
          //                 this.personasService.getPersonaById(id_usuario)
          //                   .subscribe(data => {
          //                     this.datospersona = data.data;
          //                     this.cargarDatosInicialesPaisLocalidad(data.data.pais.id, data.data.provincia.id, data.data.id_localidad);
          //                     this.itemForm.controls['domicilio'].setValue(this.datospersona.domicilio);
          //                     this.itemForm.controls['telefono'].setValue(this.datospersona.telefono);
          //                     this.itemForm.controls['email'].setValue(this.datospersona.email);
          //                     this.incorrectcuit = false;
          //                     this.loader.close();
          //                   });
          //               }, err => {
          //                 this.loader.close();
          //                 this.alertService.confirm({ message: 'Hay errores!' });
          //                 this.incorrectcuit = true;
          //               });
          //             }
          //             else
          //               this.alertService.confirm({ message: 'Hay errores!' });

          //           });
          //       } else {
          //         this.loader.close();
          //       }
          //     });
          // } else
            // if (codigo == 1) {// Existe como persona pero no como dador
            //   this.confirmService.confirm({ message: 'Ya existe el CUIT/CUIL pero no posee el Rol Playa Intermedia. Desea ingresarlo como Playa Intermedia?' })
            //     .subscribe(res => {
            //       if (res) {
            //         this.personasService.postRolPersona({
            //           id_rol: 7,
            //           id_usuario: id_usuario
            //         })
            //           .subscribe(data => {
            //             this.itemForm.controls['id_persona_rol'].setValue(data.data.id);
            //             this.personasService.getPersonaById(id_usuario)
            //               .subscribe(data => {
            //                 this.datospersona = data.data;
            //                 this.cargarDatosInicialesPaisLocalidad(data.data.pais.id, data.data.provincia.id, data.data.id_localidad);
            //                 this.itemForm.controls['domicilio'].setValue(this.datospersona.domicilio);
            //                 this.itemForm.controls['telefono'].setValue(this.datospersona.telefono);
            //                 this.itemForm.controls['email'].setValue(this.datospersona.email);
            //                 this.incorrectcuit = false;
            //                 this.loader.close();
            //               });
            //           }, err => {
            //             this.loader.close();
            //             this.alertService.confirm({ message: 'Hay errores!' });
            //             this.incorrectcuit = true;
            //           });
            //       } else {
            //         this.loader.close();
            //       }

            //     });
            // } else {// existe como persona y como dador, ver si esta en el centro

            //   let bandera = false;

            //   this.loader.close();
            //   this.itemForm.controls['id_persona_rol'].setValue(id_persona_rol);
            //   this.personasService.getPersonaById(id_usuario)
            //     .subscribe(data => {
            //       this.datospersona = data.data;
            //       this.cargarDatosInicialesPaisLocalidad(data.data.pais.id, data.data.provincia.id, data.data.id_localidad);
            //       this.itemForm.controls['domicilio'].setValue(this.datospersona.domicilio);
            //       this.itemForm.controls['telefono'].setValue(this.datospersona.telefono);
            //       this.itemForm.controls['email'].setValue(this.datospersona.email);
            //     });
            //   //}
            // }
        });


    } else {
      this.incorrectcuit = true;
    }
  }


  cargarDatosInicialesPaisLocalidad(pais, provincia, localidad) {
    this.loader.open();
    this.personasService.getPais()
      .subscribe(data => {
        this.paises = data.data.paises;
        this.itemForm.controls['pais'].setValue(pais);
        this.personasService.getProvincias(pais)
          .subscribe(data => {
            this.provincias = data.data;
            this.localidades = [];
            this.itemForm.controls['provincia'].setValue(provincia);
            this.personasService.geLocalidades(provincia)
              .subscribe(data => {
                this.localidades = data.data;
                this.itemForm.controls['id_localidad'].setValue(localidad);
                if (this.loader !== null) {
                  this.loader.close();
                  //this.snack.open('Carga con éxito!', 'OK', { duration: 4000 });
                }
              });
          });
      });
  }

  closeMap() {
    this.showMap = false;
  }

  openMap() {
    this.showMap = true;
  }

  clickMapa(evento) {
    const nuevoMarcador: Marcador = {
      lat: evento.coords.lat,
      lng: evento.coords.lng,
      titulo: '',
      draggable: true
    };
    this.itemForm.controls['latitud'].setValue(evento.coords.lat);
    this.itemForm.controls['longitud'].setValue(evento.coords.lng);
    if (this.marcadores.length > 0) {
      this.marcadores[0] = nuevoMarcador;
    } else {
      this.marcadores.push(nuevoMarcador);
    }
  }

  clickMarcador(marcador: Marcador, i: number) {
    this.marcadorSel = marcador;
    if (this.marcadorSel.draggable) {
      this.draggable = '1';
    } else {
      this.draggable = '0';
    }
  }

  borrarMarcador(idx: number) {
    //eliminar 1 marcador de la posicion "idx"
    this.marcadores.splice(idx, 1);
  }

  cambiarDraggable() {
    if (this.draggable === '1') {
      this.marcadorSel.draggable = true;
    } else {
      this.marcadorSel.draggable = false;
    }
  }

  dragEndMarcador(marcador: Marcador, evento) {
    let lat = evento.coords.lat;
    let lng = evento.coords.lng;
    marcador.lat = lat;
    marcador.lng = lng;
    this.marcadores[0] = marcador;
    this.itemForm.controls['latitud'].setValue(evento.coords.lat);
    this.itemForm.controls['longitud'].setValue(evento.coords.lng);

  }


}
