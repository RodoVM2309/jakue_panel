import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { GlobalService } from '../../../../shared/models/global.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { FileUploadService } from 'app/shared/services/file-upload.service';

@Component({
  selector: 'app-subir-imagen-noticia',
  templateUrl: './subir-imagen-noticia.component.html',
  styleUrls: ['./subir-imagen-noticia.component.scss']
})
export class SubirImagenNoticiaComponent implements OnInit {
  public itemForm: FormGroup;
  public uploader: FileUploader = new FileUploader({ url: 'http://localhost/api_muvin/backend/web/noticias/imagen-up' });
  public hasBaseDropZoneOver: boolean = false;
  selectedFile: File = null;
  datos;
  porciento: number = 0;
  bufferValue = 75;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SubirImagenNoticiaComponent>,
    private globalService: GlobalService,
    private http: HttpClient,
    private snack: MatSnackBar,
    private fb: FormBuilder,
    private alertService: AppAlertService,
    private fileUploadService: FileUploadService) { }

  ngOnInit() {
    this.datos = this.data.payload;
  }
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }
  onUpload() {
    this.fileUploadService.imagenUp(
      'foto',
      'noticias/imagen-up?id='+this.datos.id,
      this.selectedFile
    ).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          //console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          //console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.porciento = Math.round(event.loaded / event.total * 100);
          //console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          //console.log('User successfully created!', event.body);
          this.alertService
            .confirm({
              message: "¡Imagen subida correctamente!",
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
