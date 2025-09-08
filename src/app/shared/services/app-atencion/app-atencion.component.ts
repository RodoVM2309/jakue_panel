import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Component, Inject } from "@angular/core";

@Component({
  selector: 'app-app-atencion',
  template: `<mat-card class="p-0"  [class.alertWarningCupo]="data.class" >
              <mat-card-title class="mat-bg-warn m-0" style="background:#FFE100; height: 190px; text-align: center;" >
              <img src="assets/images/muvin/icono_i.png" alt="" style="margin-top: 15px; ">
                <div class="card-title-text" style="height: 126px; overflow-y: auto; color: black;">
                    <span fxFlex></span>
                    <strong><p [innerHTML]="data.message"></p></strong>
                    <span fxFlex></span>
                </div>
              </mat-card-title>
              <div mat-dialog-actions>
                    <span fxFlex></span>
                    <button type="button" mat-raised-button color="primary"  (click)="dialogRef.close(true)">{{data.label_button}}</button>
                    <span fxFlex></span>
              </div>
            </mat-card>`,
  styleUrls: ['./app-atencion.component.scss']
})
export class AppAtencionComponent {
  constructor(
    public dialogRef: MatDialogRef<AppAtencionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    console.log(data);

  }
};
