import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
  MatSnackBar
} from "@angular/material";
import { FormBuilder, Validators, FormGroup, FormControl } from "@angular/forms";
import { AppConfirmService } from "app/shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { AppAlertService } from "app/shared/services/app-alert/app-alert.service";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { AppAtencionService } from "app/shared/services/app-atencion/app-atencion.service";


@Component({
  selector: 'app-edit-orden',
  templateUrl: './edit-orden.component.html',
  styleUrls: ['./edit-orden.component.scss']
})
export class EditOrdenComponent implements OnInit {
  public itemForm: FormGroup;
  maxValue=0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditOrdenComponent>,
    private fb: FormBuilder,
    private confirmService: AppConfirmService,
    private snack: MatSnackBar,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
  ) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload);
    this.maxValue=this.data.payload.cantidad;
  }
  buildItemForm(item) {   
    this.itemForm = this.fb.group({
      id: [item.id || ""],
      cantidad: [item.cantidad || "", Validators.required],
      
    });
  }

  submit() {
    this.data.payload.cantidad= this.itemForm.controls["cantidad"].value;
    //let datafrm = this.itemForm.value;
    this.dialogRef.close(this.data.payload);
  }

}
