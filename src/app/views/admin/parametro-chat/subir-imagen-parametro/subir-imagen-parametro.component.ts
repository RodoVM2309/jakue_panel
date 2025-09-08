import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import {  FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
//import { HttpClient } from 'selenium-webdriver/http';
import { GlobalService } from '../../../../shared/models/global.service';
import { AppAlertService } from "../../../../shared/services/app-alert/app-alert.service";
import { HttpClient,HttpEventType, HttpEvent } from '@angular/common/http';
import { FileUploadService } from 'app/shared/services/file-upload.service';

@Component({
  selector: 'app-subir-imagen-parametro',
  templateUrl: './subir-imagen-parametro.component.html',
  styleUrls: ['./subir-imagen-parametro.component.scss']
})
export class SubirImagenParametroComponent implements OnInit {
  public itemForm: FormGroup;
  public uploader: FileUploader = new FileUploader({
    url: this.globalService.apiHost + "origen/imagen-up"
  });
  public hasBaseDropZoneOver: boolean = false;
  selectedFile: File = null;
  datos;
  msg: string;
  color_msg: string;
  btn_disabled: boolean;
  btn_borrar_disabled: boolean = false;
  mostrar_img: boolean = false;
  imagenTemp: any;
  error_val: boolean;
  porciento: number = 0;
  bufferValue = 75;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SubirImagenParametroComponent>,
    private globalService: GlobalService,
    private http: HttpClient,
    private alertService: AppAlertService,
    private fileUploadService: FileUploadService
  ) {
    this.btn_disabled = true;
  }

  ngOnInit() {
    this.datos = this.data.payload;
    if (this.datos.imagen == 1) {
      this.mostrar_img = true;
      this.btn_borrar_disabled = true;
      this.msg = "Subir la imagen";
      this.imagenTemp =
        this.globalService.apiHost + "parametros-chat/imagen-down?id=" + this.datos.id;
    } else {
      this.msg = "Subir la imagen";
      this.color_msg = "primary";
    }
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    let extension = event.target.files[0].type.split("/");
    if (
      extension[1] === "png" ||
      extension[1] === "jpeg" ||
      extension[1] === "jpg"
    ) {
      this.btn_disabled = false;
      this.error_val = false;
      this.msg = " Imagen lista para subir presione el botón subir";
      this.mostrar_img = true;
      this.btn_borrar_disabled = true;
      let reader = new FileReader();
      let urlImagenTemp = reader.readAsDataURL(this.selectedFile);
      reader.onloadend = () => (this.imagenTemp = reader.result);
    } else {
      this.msg = "Extensión no valida solo:  png / jpg";
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
    if (this.mostrar_img) {
      this.http
        .put(this.globalService.apiHost + "parametros-chat/" + this.datos.id, {
          id: this.datos.id,
          imagen: 0
        })
        .subscribe(event => {});
      this.mostrar_img = false;
      this.btn_disabled = true;
      this.btn_borrar_disabled = false;
      this.error_val = true;
      this.msg = " Debe subir una imagen";
    } else {
      this.mostrar_img = true;
      this.btn_borrar_disabled = true;
    }
    //this.msg = " Debe subir una imagen";
  }

  onUpload() {
    this.fileUploadService.imagenUp(
      'fichero',
      'parametros-chat/imagen-up?id='+this.datos.id,
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
}
