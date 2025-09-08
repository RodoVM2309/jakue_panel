import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { FormGroup } from "@angular/forms";
import { FileUploader } from "ng2-file-upload";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { GlobalService } from "../../../../shared/models/global.service";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { splitClasses } from "@angular/compiler";
import { AppAlertService } from "../../../../shared/services/app-alert/app-alert.service";

@Component({
  selector: 'app-mostrar-documento',
  templateUrl: './mostrar-documento.component.html',
  styleUrls: ['./mostrar-documento.component.scss']
})
export class MostrarDocumentoComponent implements OnInit {
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
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MostrarDocumentoComponent>,
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
        this.data.title = 'Recibo de Pago';
        this.columnaSubir = 'recibo_sueldo';
        break;
      case 2:
        this.data.title = ' Formulario 931';
        this.columnaSubir = 'form_931';
        break;
      case 3:
        this.data.title = ' Constancia de pago del Formulario 931 ';
        this.columnaSubir = 'pago_931';
        break;
      case 4:
        this.data.title = ' ART';
        this.columnaSubir = 'art';
        break;
      case 5:
        this.data.title = ' Licencia de Conducir';
        this.columnaSubir = 'licencia_conduccion';
        break;
      case 6:
        this.data.title = ' DNI ';
        this.columnaSubir = 'dni';
        break;
      case 7:
        this.data.title = ' Examen psicofísico ';
        this.columnaSubir = 'examen_psicofisico';
        break;
      case 8:
        this.data.title = ' Curso de actualización y perfeccionamiento de cargas generales ';
        this.columnaSubir = 'curso_actualizacion';
        break;
      case 9:
        this.data.title = ' Seguro de Carga';
        this.columnaSubir = 'seguro_carga';
        break;
      case 10:
        this.data.title = ' Seguro de accidentes personales ';
        this.columnaSubir = 'seguro_accidentes';
        break;
      case 11:
        this.data.title = ' Comprobante de Pago de Monotributo ';
        this.columnaSubir = 'comprobante_pago_monotributo';
        break;
      case 12:
        this.data.title = ' Acoplado ';
        this.columnaSubir = 'acoplado';
        break;
      case 13:
        this.data.title = ' Registro Único De Transporte Automotor ';
        this.columnaSubir = 'inscripcion_ruta';
        break;
      case 14:
        this.data.title = ' Revisión Técnica Obligatoria ';
        this.columnaSubir = 'rto';
        break;

      default:
        this.data.title = ' documento';
        this.columnaSubir = '';
        break;
    }
   
      this.mostrar_img = true;
      this.btn_borrar_disabled = true;
      this.msg = "Subir el documento";
      this.imagenTemp =
        this.globalService.apiHost + "documentacion-chofer/file-down?id=" + this.datos.id_chofer + '&atributo=' + this.columnaSubir;
  
  }
  cancelar() {
    this.dialogRef.close();
  }

}
