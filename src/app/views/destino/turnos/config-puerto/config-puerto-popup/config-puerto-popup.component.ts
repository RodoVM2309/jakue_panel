import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { AmazingTimePickerService } from 'amazing-time-picker';

@Component({
  selector: 'app-config-puerto-popup',
  templateUrl: './config-puerto-popup.component.html',
  styleUrls: ['./config-puerto-popup.component.scss']
})
export class ConfigPuertoPopupComponent implements OnInit {
  public itemForm: FormGroup;
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ConfigPuertoPopupComponent>,
  private fb: FormBuilder,
  private dialog: MatDialog,
  private confirmService: AppConfirmService,
  private snack: MatSnackBar,
  private loader: AppLoaderService,
  private alertService: AppAlertService,
  private atp: AmazingTimePickerService,
  ) { }

  ngOnInit() {    
    this.buildItemForm(this.data.payload);
  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id],
      descripcion: [item.descripcion],
      domicilio: [item.domicilio],
      nombreZonaDestino:[item.nombreZonaDestino],
      nombreTipoDestino: [item.nombreTipoDestino],
      nombreSituacionPuerto: [item.nombreSituacionPuerto],      
      cam_ventana: [item.cam_ventana],      
      hora: [parseInt(item.hora), Validators.required],
      min: [parseInt(item.min),Validators.required],
    });    
  }
    
  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }

  open() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
    });
  }
  
  

}
