import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { FileUploadService } from 'app/shared/services/file-upload.service';

@Component({
  selector: 'app-subir-pdf-concurso',
  templateUrl: './subir-pdf-concurso.component.html',
  styleUrls: ['./subir-pdf-concurso.component.scss']
})
export class SubirPdfConcursoComponent implements OnInit {
  public itemForm: FormGroup;
  public uploader: FileUploader = new FileUploader({ url: 'http://localhost/api_muvin/backend/web/concurso/pdf-up' });
  public hasBaseDropZoneOver: boolean = false;
  selectedFile: File = null;
  selectedFile1: File = null;
  datos;
  porciento: number = 0;
  bufferValue = 75;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SubirPdfConcursoComponent>,
    private alertService: AppAlertService,
    private fileUploadService: FileUploadService) { }

  ngOnInit() {
    this.datos = this.data.payload;
  }
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }
  onFileSelected1(event) {
    this.selectedFile1 = <File>event.target.files[0];
  }
  onUpload() {
    this.fileUploadService.imagenUp(
      'fichero',
      'concurso/pdf-up?id='+this.datos.id,
      this.selectedFile
    ).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          break;
        case HttpEventType.ResponseHeader:
          break;
        case HttpEventType.UploadProgress:
          this.porciento = Math.round(event.loaded / event.total * 100);
          break;
        case HttpEventType.Response:
          this.alertService
            .confirm({
              message: "¡Las Bases del Concurso subido correctamente!",
              tipo: "exito"
            })
            .subscribe(res => {
              if (res) {
                this.dialogRef.close();
                return;
              }
            });
          setTimeout(() => {
            this.porciento = 0;
          }, 1500);

      }
    })  
  }
  onUpload1() {
    this.fileUploadService.imagenUp(
      'foto',
      'concurso/imagen-up?id='+this.datos.id,
      this.selectedFile1
    ).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          break;
        case HttpEventType.ResponseHeader:
          break;
        case HttpEventType.UploadProgress:
          this.porciento = Math.round(event.loaded / event.total * 100);
          break;
        case HttpEventType.Response:
          this.alertService
            .confirm({
              message: "¡Imagen del concurso subida correctamente!",
              tipo: "exito"
            })
            .subscribe(res => {
              if (res) {
                this.dialogRef.close();
                return;
              }
            });
          setTimeout(() => {
            this.porciento = 0;
          }, 1500);

      }
    })  
  }
  
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

}
