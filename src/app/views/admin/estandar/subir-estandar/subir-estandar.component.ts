import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef,  MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import {   FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient,HttpEventType } from '@angular/common/http';
import { GlobalService } from '../../../../shared/models/global.service';

@Component({
  selector: 'app-subir-estandar',
  templateUrl: './subir-estandar.component.html',
  styleUrls: ['./subir-estandar.component.scss']
})
export class SubirEstandarComponent implements OnInit {
  public itemForm: FormGroup;
  public uploader: FileUploader = new FileUploader({url: this.globalService.apiHost +'documento/pdf-up' });
  public hasBaseDropZoneOver: boolean = false;
  selectedFile: File = null;
  datos;
  mostrar_img: boolean = false;
  msg: string;
  color_msg: string;
  porciento: number = 0;
  btn_disabled: boolean;
  error_val: boolean;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SubirEstandarComponent>,
    private globalService: GlobalService,
    private http: HttpClient) { }

  ngOnInit() {
    this.datos        = this.data.payload;
    this.btn_disabled = true;
    this.datos        = this.data.payload;
    this.msg          = "Subir PDF de la Documentación";
    this.datos        = this.data.payload;
    this.color_msg    = "primary";
  }
 
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    let extencion = event.target.files[0].type.split("/");
     if(extencion[1] === 'pdf'){
        this.btn_disabled = false; 
        this.error_val    = false;
        this.msg          = " Archivo listo para subir presione el botón subir";
        this.mostrar_img = true;
      }else {
          this.msg          = " Extensión no valida solo:  PDF";
          this.btn_disabled = true;
          this.error_val    = true;
          this.mostrar_img  = false;
      }
  }

  cancelar() {
    this.dialogRef.close();
  }

  onUpload() {
    const fd = new FormData();
    fd.append('fichero', this.selectedFile, this.selectedFile.name);
    this.http.post(this.globalService.apiHost + 'estandar/pdf-up?id=' + this.datos.id, fd,{
      reportProgress : true,
      observe:'events'
    })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.porciento = Math.round(event.loaded/event.total*100);
        }else if (event.type === HttpEventType.Response) {
          if(event.status === 200){
            this.msg ="Documento subido exitosamente";
            setTimeout(()=> {this.dialogRef.close()},1000);
          }
        }
      },
      err => {
      });
  } 
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  
}
