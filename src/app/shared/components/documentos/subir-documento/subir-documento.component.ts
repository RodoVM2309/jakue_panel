import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { FormGroup } from "@angular/forms";
import { FileUploader } from "ng2-file-upload";
import { HttpClient, HttpEventType, HttpHeaders, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { GlobalService } from "../../../../shared/models/global.service";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { splitClasses } from "@angular/compiler";
import { AppAlertService } from "../../../../shared/services/app-alert/app-alert.service";

@Component({
  selector: 'app-subir-documento',
  templateUrl: './subir-documento.component.html',
  styleUrls: ['./subir-documento.component.scss']
})
export class SubirDocumentoComponent implements OnInit {
  public itemForm: FormGroup;
  public uploader: FileUploader = new FileUploader({
    url: this.globalService.apiHost + "origen/imagen-up"
  });
  public hasBaseDropZoneOver: boolean = false;
  selectedFile: File = null;
  datos;
  tipoDocumento;
  msg: string;
  color_msg: string;
  porciento: number = 0;
  btn_disabled: boolean;
  btn_borrar_disabled: boolean = false;
  mostrar_img: boolean = false;
  imagenTemp: any;
  error_val: boolean;
  columnaSubir: string = '';
  valorColumna: number = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SubirDocumentoComponent>,
    private globalService: GlobalService,
    private http: HttpClient,
    private snack: MatSnackBar,
    private errorService: AppErrorService,
    private alertService: AppAlertService
  ) { }

  ngOnInit() {
    this.datos = this.data.payload;
    this.tipoDocumento = this.data.tipoDocumento;

    switch (this.tipoDocumento) {
      case 1:
        this.data.title = 'Subir Recibo de Pago';
        this.columnaSubir = 'recibo_sueldo';
        this.valorColumna = this.datos.recibo_sueldo;
        break;
      case 2:
        this.data.title = 'Subir Formulario 931';
        this.columnaSubir = 'form_931';
        this.valorColumna = this.datos.form_931;
        break;
      case 3:
        this.data.title = 'Subir Constancia de pago del Formulario 931 ';
        this.columnaSubir = 'pago_931';
        this.valorColumna = this.datos.pago_931;
        break;
      case 4:
        this.data.title = 'Subir ART';
        this.columnaSubir = 'art';
        this.valorColumna = this.datos.art;
        break;
      case 5:
        this.data.title = 'Subir Licencia de Conducir';
        this.columnaSubir = 'licencia_conduccion';
        this.valorColumna = this.datos.licencia_conduccion;
        break;
      case 6:
        this.data.title = 'Subir DNI ';
        this.columnaSubir = 'dni';
        this.valorColumna = this.datos.dni;
        break;
      case 7:
        this.data.title = 'Subir Examen psicofísico ';
        this.columnaSubir = 'examen_psicofisico';
        this.valorColumna = this.datos.examen_psicofisico;
        break;
      case 8:
        this.data.title = 'Subir Curso de actualización y perfeccionamiento de cargas generales ';
        this.columnaSubir = 'curso_actualizacion';
        this.valorColumna = this.datos.curso_actualizacion;
        break;
      case 9:
        this.data.title = 'Subir Seguro de Carga';
        this.columnaSubir = 'seguro_carga';
        this.valorColumna = this.datos.seguro_carga;
        break;
      case 10:
        this.data.title = 'Subir Seguro de accidentes personales ';
        this.columnaSubir = 'seguro_accidentes';
        this.valorColumna = this.datos.seguro_accidentes;
        break;
      case 11:
        this.data.title = 'Subir Comprobante de Pago de Monotributo ';
        this.columnaSubir = 'comprobante_pago_monotributo';
        this.valorColumna = this.datos.comprobante_pago_monotributo;
        break;
      case 12:
        this.data.title = 'Subir Acoplado ';
        this.columnaSubir = 'acoplado';
        this.valorColumna = this.datos.acoplado;
        break;
      case 13:
        this.data.title = 'Subir Registro Único De Transporte Automotor ';
        this.columnaSubir = 'inscripcion_ruta';
        this.valorColumna = this.datos.inscripcion_ruta;
        break;
      case 14:
        this.data.title = 'Subir Revisión Técnica Obligatoria ';
        this.columnaSubir = 'rto';
        this.valorColumna = this.datos.rto;
        break;

      default:
        this.data.title = 'Subir documento';
        this.columnaSubir = '';
        break;
    }
    if (this.valorColumna == 1) {
      this.mostrar_img = true;
      this.btn_borrar_disabled = true;
      this.msg = "Subir el documento";
      this.imagenTemp =
        this.globalService.apiHost + "documentacion-chofer/file-down?id=" + this.datos.id_chofer + '&atributo=' + this.columnaSubir;
    } else {
      this.msg = "Click a buscar documento a subir";
      this.color_msg = "primary";
    }
  }
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    let extencion = event.target.files[0].type.split("/");
    if (
      extencion[1] === "png" ||
      extencion[1] === "jpeg" ||
      extencion[1] === "jpg"
    ) {
      this.btn_disabled = false;
      this.error_val = false;
      this.msg = "Documento listo para subir presione el botón subir";
      this.mostrar_img = true;
      this.btn_borrar_disabled = true;
      //Vista Previa
      let reader = new FileReader();
      let urlImagenTemp = reader.readAsDataURL(this.selectedFile);
      reader.onloadend = () => (this.imagenTemp = reader.result);
    } else {
      this.msg = "Extensión no valida solo: jpg";
      this.btn_disabled = true;
      this.error_val = true;
      this.mostrar_img = false;
      this.btn_borrar_disabled = false;
    }
  }

  cancelar() {
    this.dialogRef.close();
  }

  limpiarimagenTemp() {
    const options = {
      params: new HttpParams()
        .set('id',  this.datos.id_usuario)
        .set(this.columnaSubir, '0')    
    };
    if (this.mostrar_img) {
      this.http
        .put(this.globalService.apiHost + "documentacion-chofer/" + this.datos.id_usuario + '&atributo=' + this.columnaSubir,options )
        .subscribe(event => { });
      this.mostrar_img = false;
      this.btn_disabled = true;
      this.btn_borrar_disabled = false;
      this.error_val = true;
      this.msg = " Debe subir un documento";
    } else {
      this.mostrar_img = true;
      this.btn_borrar_disabled = true;
    }
    //this.msg = " Debe subir una imagen";
  }

  onUpload() {
    if (this.data.id_chofer == null) {
      const fd = new FormData();
      fd.append("file", this.selectedFile, this.selectedFile.name);
      this.http.post(
        this.globalService.apiHost + "documentacion-chofer/file-up?id=" + this.datos.id_usuario + '&atributo=' + this.columnaSubir,
        fd,
        {
          reportProgress: true,
          observe: "events"
        }
      )
        .subscribe(
          event => {
            if (event.type === HttpEventType.UploadProgress) {
              this.porciento = Math.round((event.loaded / event.total) * 100);
            } else if (event.type === HttpEventType.Response) {
              if (event.status === 200) {
                this.alertService
                  .confirm({
                    message: "¡Documento subido correctamente!",
                    tipo: "exito"
                  })
                  .subscribe(res => {
                    if (res) {
                      this.dialogRef.close();
                      return;
                    }
                  });
                this.msg = "Documento subido correctamente";
                setTimeout(() => {
                }, 1000);
                this.dialogRef.close();
              }
            }
            
          },
          err => {
            this.errorService
              .confirm({ message: err.error.data.message })
              .subscribe(event => {
                if (event) {
                  return;
                }
              });
          }
        );
    }
  }
}
