import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient,HttpEventType, HttpEvent } from '@angular/common/http';
import { GlobalService } from '../../../../shared/models/global.service';import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { MessageService } from 'app/shared/services/message.service';
import { FileUploadService } from 'app/shared/services/file-upload.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { UserService } from 'app/shared/services/user.service';

;

@Component({
  selector: 'app-subir-logo-centro',
  templateUrl: './subir-logo-centro.component.html',
  styleUrls: ['./subir-logo-centro.component.scss']
})
export class SubirLogoCentroComponent implements OnInit {
  public itemForm: FormGroup;
  public uploader: FileUploader = new FileUploader({url: this.globalService.apiHost +'centro/imagen-up' });
  public hasBaseDropZoneOver: boolean = false;
  selectedFile: File = null;
  msg: string;
  color_msg: string;
  porciento: number = 0;
  btn_disabled: boolean;
  mostrar_img: boolean = false;
  imagenTemp: any;
  error_val: boolean;
  urlImagenTemp:any;
  bufferValue = 75;
  myId: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SubirLogoCentroComponent>,
    private globalService: GlobalService,
    private messageRxjs: MessageService,
    private alertService: AppAlertService,
    private fileUploadService: FileUploadService,
    private userService: UserService
    ) { 
      this.btn_disabled = true;
    }

  ngOnInit() {
    this.msg       = "Seleccione la imagen del logo";   
    this.color_msg = "primary";  
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
    .subscribe(data => this.myId = data.data); 
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    let extension = event.target.files[0].type.split("/");
     if(extension[1] === 'png' || extension[1] === 'jpeg' ||  extension[1] === 'jpg'){
       this.btn_disabled = false; 
       this.error_val    = false;
       this.msg          = " Imagen lista para subir presione el botón subir";
       this.mostrar_img = true;
      let reader = new FileReader();
      let urlImagenTemp = reader.readAsDataURL(this.selectedFile);
      reader.onloadend = () => this.imagenTemp = reader.result ;
    }else {
        this.msg          = "Extensión no valida solo:  png / jpg";
        this.btn_disabled = true;
        this.error_val    = true;
        this.mostrar_img = false;
     }
  }

  cancelar() {
    this.dialogRef.close();
  }

  onUpload() {    

    this.fileUploadService.imagenUp(
      'foto',
      'centro/imagen-up?id='+this.myId,
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
          localStorage.setItem('imagen', this.imagenTemp);
          this.messageRxjs.sendMessage('CambioImagen');
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
