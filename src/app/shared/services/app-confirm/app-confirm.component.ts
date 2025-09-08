import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-confirm',
  template: `<mat-card class="p-0">
  <mat-card-title class="mat-bg-warn m-0" style="background:#FFE100; height: 190px;  color: black;" >
  <div fxLayout="row wrap">
        <div fxFlex="100" fxLayoutAlign="center start">
          <img src="assets/images/muvin/icono_i.png" alt=""  style="margin-top: 15px; ">
        </div>
        <div
          fxFlex="100"
          fxLayoutAlign="center start"
          class="card-title-text"
          style="height: 50px; "
        >
          <p>{{ data.title }}</p>
        </div>
        <div fxFlex="100" fxLayoutAlign="center start" >
          <p [innerHTML]="data.message"></p>
        </div>
      </div>
 </mat-card-title>
<div mat-dialog-actions class="pr-1 pl-1">
    <button  type="button" color="warn" mat-raised-button  (click)="dialogRef.close(false)">CANCELAR</button>
    &nbsp;
  <span fxFlex></span>
  <button  type="button"  mat-raised-button color="primary" (click)="dialogRef.close(true)">CONFIRMAR</button>


</div>
</mat-card>`,
})
export class AppComfirmComponent {
  constructor(
    public dialogRef: MatDialogRef<AppComfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}

