import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../../../shared/models/global.service';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { AppErrorService } from '../../../../shared/services/app-error/app-error.service';

@Component({
  selector: 'app-subir-manual',
  templateUrl: './subir-manual.component.html',
  styleUrls: ['./subir-manual.component.scss']
})
export class SubirManualComponent implements OnInit {
  public itemForm: FormGroup;
  public uploader: FileUploader = new FileUploader({ url: 'http://localhost/api_muvin/backend/web/manual/pdf-up' });
  public hasBaseDropZoneOver: boolean = false;
  selectedFile: File = null;
  datos;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SubirManualComponent>,
    private globalService: GlobalService,
    private http: HttpClient,
    private alertService: AppAlertService,
    private errorService: AppErrorService) { }

  ngOnInit() {
    this.datos = this.data.payload;
  }
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }
  onUpload() {
    const fd = new FormData();
    fd.append('fichero', this.selectedFile, this.selectedFile.name);

    this.http.post(this.globalService.apiHost + 'manuales/pdf-up?id=' + this.datos.id, fd)
      .subscribe(res => {
        this.alertService.confirm({ message: '¡Manual subido correctamente!' }).subscribe(res => {
          if (res) {
            this.dialogRef.close(false);
          }
        });
      },
      err => {
        this.errorService.confirm({ message: err.error.data.message });
      });

  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

}
