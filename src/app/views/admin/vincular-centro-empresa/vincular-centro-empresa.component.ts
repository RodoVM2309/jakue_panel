import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { GlobalService } from 'app/shared/models/global.service';
import { Page } from 'app/shared/models/page';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { AppAtencionService } from 'app/shared/services/app-atencion/app-atencion.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CentrosService } from 'app/shared/services/centros.service';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { PersonasService } from 'app/shared/services/personas.service';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import * as XLSX from "xlsx";
import { InfoPersonaComponent } from '../personas/info-persona/info-persona.component';
import { VincularEmpresaComponent } from './vincular-empresa/vincular-empresa.component';

export class Empresa {
  cuit: string;
  razon_social: string;
  domicilio: string;
  telefono: string;
  mail: string;
}

export class Error {
  error: string;
  cuit: string;
}

@Component({
  selector: 'app-vincular-centro-empresa',
  templateUrl: './vincular-centro-empresa.component.html',
  styleUrls: ['./vincular-centro-empresa.component.scss']
})
export class VincularCentroEmpresaComponent implements OnInit {

  public lista_empresa: any[];
  public getItemSub: Subscription;
  page = new Page();
  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Empresas</span>
      </div>
    `
  };
  filtro = {
    nombre_interno: '',
  };
  buscarForm: FormGroup;
  @ViewChild('buscar') buscar: ElementRef;
  @ViewChild('imgFileInput') InputVar: ElementRef;

  descargado = true;
  showUrl = "";
  file: File;
  arrayBuffer: any;
  empresas: Empresa[];
  error_carga = new Array();

  constructor(
    private dialog: MatDialog,
    private centrosService: CentrosService,
    private personasService: PersonasService,
    private errorService: AppErrorService,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private alertService: AppAlertService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private atencionService: AppAtencionService,
    private loader: AppLoaderService,
    private nomencladoresService: NomencladoresService,
  ) {
    this.page.size = 10;
  }


  ngOnInit() {
    this.showUrl = this.globalService.apiHost + "upload/carga-empresas.xlsx";
    this.setPage({ offset: 0 });
    this.buscarForm = this.fb.group({
      nombre_interno: [''],
    });
    fromEvent(this.buscar.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      let valor = text.toLowerCase();
      if (valor.length == 0) {
        this.filtro.nombre_interno = '';
        this.setPage({ offset: 0 });
      }
    });
  }

  setPage(pageInfo) {
    if (pageInfo.offset == undefined) {
      pageInfo.offset = 0;
    }
    this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro === undefined) {
      this.filtro = {
        nombre_interno: '',
      };
    };
    this.loader.open('Por favor espere..', 'Cargando empresas...');
    this.getItemSub = this.centrosService.getCentroEmpresa(this.page.pageNumber, this.page.size = 10, this.filtro)
      .subscribe(pagedData => {
        this.loader.close();
        this.lista_empresa = pagedData.data;
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage;
        this.page.size = pagedData._meta.perPage;
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'Error, al buscar las cabeceras' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
  }

  openPopUp(data: any = {}, isNew) {
    let title = 'Empresa';
    let dialogRef: MatDialogRef<any> = this.dialog.open(VincularEmpresaComponent, {
      width: '420px',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.centrosService.postCentroInterno(res)
          .subscribe(data => {
            this.lista_empresa.unshift(data);
            this.setPage({ offset: 0 });
            if (this.loader !== null) {
              this.loader.close();
            }
            this.snack.open('Empresa agregada al centro!', 'OK', { duration: 4000 });
            return;
          });
        //this.loader.close();
        //this.setPage(this.page);

      });
  }
  buscarEmpresa() {
    this.filtro.nombre_interno = this.buscarForm.controls['nombre_interno'].value;
    this.setPage({ offset: 0 });
    /*  if (titulo.length === 0) {
       this.setPage({ offset: 0 });
     } else {
       this.loader.open('Buscando empresas');
       this.ccppService.getCentroEmpresa(titulo)
       .subscribe(pagedData => {
         this.loader.close();
         this.lista_empresa = pagedData.data;
         this.page.totalElements = pagedData._meta.totalCount;
         this.page.pageNumber = pagedData._meta.currentPage;
         this.page.size = pagedData._meta.perPage;
       },
         err => {
           this.loader.close();
           this.errorService.confirm({ message: 'Error, al buscar las cabeceras' }).subscribe(res => {
             if (res) {
               return;
             }
           });
         });
     } */
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro que desea eliminar del centro la empresa: ' + row.nombre_interno + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open('Por favor espere..', 'Eliminando empresa...');
          this.centrosService.deleteCentroInterno(row.id_interno)
            .subscribe(data => {
              this.loader.close();
              this.setPage({ offset: 0 });
              this.alertService.confirm({ message: 'Empresa eliminada!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'No se pudo eliminar la Empresa' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }
  openPopUpInfoPersona(data: any = {}) {
    let title = 'Información del Perfil - Cliente';
    let dialogRef: MatDialogRef<any> = this.dialog.open(InfoPersonaComponent, {
      width: '720px',
      height: '73vh',
      disableClose: true,
      data: { title: title, payload: { id: data.id_usuario } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }

  descargarArchivo() {
    this.descargado = false;
    window.open(this.showUrl, "_blank");
  }

  incomingfile(event) {
    this.file = undefined;
    this.file = event.target.files[0];
    // if (this.file) {
    //   this.notify();
    // }
    this.upload();
  }

  upload() {
    this.empresas = [];
    let fileReader = new FileReader();

    this.error_carga = [];

    fileReader.onload = async (e) => {
      this.loader.open('Por favor espere..', 'Cargando el excel...');
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i < data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      let emp = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      // Recorro las empresas cargadas
      for (const element of emp) {
        console.log(element);

        // sacando espacios en blanco
        let cuit = element['RUC'].toString();
        cuit = cuit.replace(/ /g, "");

        let telefono = element['TELEFONO'].toString();

        // Validando telefono
        /* if (telefono.length != 10) {
          const error: Error = {
            error: "El telefono es incorrecto.",
            cuit: cuit
          }
          this.error_carga.push(error);
          continue;
        } */

        // validando mail
        let email = element['MAIL'].toString();
        if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email)) {
          const error: Error = {
            error: "El email es incorrecto.",
            cuit: cuit
          }
          this.error_carga.push(error);
          continue;
        }

        // validando cuit e insertando
        let validarcuit = true;
        //let validarcuit = this.validar_cuit(cuit);

        if (validarcuit) {
          let tipo_persona;
          let firstDigito = '';

          /*  firstDigito = cuit.substring(0, 1);
           if (firstDigito !== '3') {
             tipo_persona = 1;
           } else {
             tipo_persona = 2;
           } */

          // Compruebo si es una empresa dentro de Muvin
          let empresa = await this.personasService.getEmpresaCuit(cuit).toPromise();
          // console.log(empresa);

          let id_usuario;
          ///id_tipo_persona: tipo_persona.toString(),
          // Si codigo es 0 es porque no existe como persona, y cargo la persona en el sistema
          if (empresa.data['codigo'] == 0) {
            let perso = {
              nombre: '-',
              apellidos: '-',
              id_tipo_persona: 1,
              razon_social: element['RAZON SOCIAL'],
              cuit_cuil: cuit,
              domicilio: element['DOMICILIO'],
              telefono: telefono,
              id_localidad: '1',
              username: cuit,
              email: element['MAIL'],
              password: 'Jakue2022*',
              app_chofer_instalada: '0',
              es_cliente_final: '1',
              es_dador_cupo: '0',
              cliente_muvin: '1'
            };

            //  Valido que la empresa cumpla con las condiciones
            const validator = this.validar(perso);

            if (validator) {
              let persona = await this.personasService.postPersona(perso).toPromise().catch(error => {
                const err: Error = {
                  error: error,
                  cuit: cuit
                }
                this.error_carga.push(err);
              });

              if (persona == undefined) {
                continue;
              }


              id_usuario = persona.data.id;

              // Le pongo rol de centro muvin a la nueva persona
              let persrol = await this.personasService.postRolPersona({
                id_rol: 3,
                id_usuario: id_usuario
              }).toPromise();

              // Agregando el mail como mail de notificaciones
              let postulacion = {
                id_centro: persrol.data.id,
                email_postulacion: element['MAIL']
              };

              let post = await this.nomencladoresService.putConfiguracionCentroMail(postulacion).toPromise();
              console.log(post);

              // agregando como empresa interna
              const res = {
                id_interno: persrol.data.id
              }

              let asoc = await this.centrosService.postCentroInterno(res).toPromise().catch(error => {
                const err: Error = {
                  error: 'Ya está asociada a la empresa.',
                  cuit: cuit
                }
                this.error_carga.push(err);
              });

              if (asoc == undefined) {
                continue;
              }

              this.lista_empresa.push(asoc);
            }
          }

          // Si codigo es 1 es porque existe como persona pero no como dador de cupo
          if (empresa.data['codigo'] == 1) {
            id_usuario = empresa.data['id_usuario'];

            // Actualizo los datos del usuario
            let perso = {
              id: id_usuario,
              es_cliente_final: '1',
              es_dador_cupo: '0',
              cliente_muvin: '1'
            };
            await this.personasService.updatePersonaAdmin(perso).toPromise();

            // Le pongo rol de centro muvin a la nueva persona
            let persrol = await this.personasService.postRolPersona({
              id_rol: 3,
              id_usuario: id_usuario
            }).toPromise();

            // Agregando el mail como mail de notificaciones
            let postulacion = {
              id_centro: persrol.data.id,
              email_postulacion: element['MAIL']
            };

            await this.nomencladoresService.putConfiguracionCentro(postulacion).toPromise();

            // agregando como empresa interna
            const res = {
              id_interno: persrol.data.id
            }
            let asoc = await this.centrosService.postCentroInterno(res).toPromise().catch(error => {
              const err: Error = {
                error: 'Ya está asociada a la empresa.',
                cuit: cuit
              }
              this.error_carga.push(err);
            });

            if (asoc == undefined) {
              continue;
            }

            this.lista_empresa.push(asoc);
          }

          // Si codigo es 2 es porque existe como persona y como dador de cupo
          if (empresa.data['codigo'] == 2) {

            // Agregando el mail como mail de notificaciones
            let postulacion = {
              id_centro: empresa.data['id'],
              email_postulacion: element['MAIL']
            };

            await this.nomencladoresService.putConfiguracionCentro(postulacion).toPromise();

            // agregando como empresa interna
            const res = {
              id_interno: empresa.data['id']
            }
            let asoc = await this.centrosService.postCentroInterno(res).toPromise().catch(error => {
              const err: Error = {
                error: 'Ya está asociada a la empresa.',
                cuit: cuit
              }
              this.error_carga.push(err);
            });

            if (asoc == undefined) {
              continue;
            }

            this.lista_empresa.push(asoc);
          }

        } else {
          const error: Error = {
            error: "El cuit es incorrecto.",
            cuit: cuit
          }
          this.error_carga.push(error);
        }
      }

      this.loader.close();

      this.setPage({ offset: 0 });

      let resp = 'Empresas con problemas: <br>';

      if (this.error_carga.length > 0) {
        this.error_carga.forEach((element, index) => {
          resp += ` La empresa con cuit ` + element['cuit'] + `: ` + element['error'] + `<br>`;
        });

        this.atencionService.confirm({ message: resp })
          .subscribe(res => {
            if (res) {
              return;
            }
          });
      }

      if (this.error_carga.length == 0) {
        this.notify();
      }
    };

    fileReader.readAsArrayBuffer(this.file);
  }

  validar_cuit(cuit) {
    // const cuitNumber = cuit.toString();
    // // let firstDigito = '';

    // if (cuitNumber !== undefined && (isNaN(cuitNumber))) {
    //   return false;
    // }

    // if (cuitNumber.length != 11) {
    //   return false;
    // }

    // // validacion que sea solo empresa
    // // firstDigito = cuitNumber.substring(0, 1);
    // // if (firstDigito !== '3') {
    // //   return false;
    // // }

    // const multiplicador = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 1];
    // let suma_prod = 0;
    // let valint;
    // for (let i = 0; i < 11; i++) {
    //   valint = cuitNumber.substring(i, i + 1);
    //   suma_prod += multiplicador[i] * parseInt(valint);
    // }
    // if (suma_prod % 11 !== 0) {
    //   return false;
    // }

    return true;
  }

  validar(persona) {
    let flat = false;

    if (persona.razon_social === undefined || persona.razon_social == '') {
      const error: Error = {
        error: "La razon social es requerida.",
        cuit: persona.cuit_cuil
      }
      this.error_carga.push(error);
      flat = true;
    }

    if (persona.domicilio === undefined || persona.domicilio == '') {
      const error: Error = {
        error: "El domicilio es requerido.",
        cuit: persona.cuit_cuil
      }
      this.error_carga.push(error);
      flat = true;
    }

    if (persona.telefono === undefined || persona.telefono == '') {
      const error: Error = {
        error: "El telefono es requerido.",
        cuit: persona.cuit_cuil
      }
      this.error_carga.push(error);
      flat = true;
    }

    if (persona.email === undefined || persona.email == '') {
      const error: Error = {
        error: "El email es requerido.",
        cuit: persona.cuit_cuil
      }
      this.error_carga.push(error);
      flat = true;
    }

    if (flat) {
      return false;
    } else {
      return true;
    }
  }

  notify() {
    this.alertService
      .confirm({
        message: "¡Importación con éxito!",
        tipo: "exito"
      })
      .subscribe(res => {
        if (res) {
          return;
        }
      });
  }

  reset() {
    this.InputVar.nativeElement.value = "";
  }

}
