import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef,  MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { FileUploadService } from 'app/shared/services/file-upload.service';

@Component({
  selector: 'app-subir-imagenes',
  templateUrl: './subir-imagenes.component.html',
  styleUrls: ['./subir-imagenes.component.scss']
})
export class SubirImagenesComponent implements OnInit {
  public itemForm: FormGroup;
  public uploader: FileUploader = new FileUploader({ url: 'http://localhost/api_muvin/backend/web/promocion/imagen-up' });
  public hasBaseDropZoneOver: boolean = false;
  selectedFile: File = null;
  datos;
  porciento: number = 0;
  bufferValue = 75;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SubirImagenesComponent>,
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
      'promocion/imagen-up?id='+this.datos.id,
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
              message: "Foto de la promoción subida correctamente!",
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
