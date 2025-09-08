import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Component, Inject } from "@angular/core";

@Component({
  selector: "app-app-error",
  template: `<mat-card class="p-0">
    <mat-card-title
      class="mat-bg-warn m-0"
      style="background:#FF351D; height: 190px;"
    >
      <div fxLayout="row wrap">
        <div fxFlex="100" fxLayoutAlign="center center">
          <img
            src="assets/images/muvin/icono_x.png"
            alt=""
            style="margin-top: 15px;"
          />
        </div>
      </div>
      <div fxLayout="row wrap">
        <div fxFlex="100" fxLayoutAlign="center center">
          <div class="card-title-text" fxLayoutAlign="center center">
            <span fxFlex></span>
            <span style="color: #fff;" fxLayoutAlign="center center"
              >{{ data.title }} {{ data.message }}</span
            >
            <span fxFlex></span>
          </div>
        </div>
      </div>
    </mat-card-title>
    <div mat-dialog-actions>
      <span fxFlex></span>
      <button
        type="button"
        mat-raised-button
        color="primary"
        (click)="dialogRef.close(true)"
      >
        {{ data.textBoton }}
      </button>
      <span fxFlex></span>
    </div>
  </mat-card>`,
  styleUrls: ["./error.component.css"],
})
export class AppErrorComponent {
  constructor(
    public dialogRef: MatDialogRef<AppErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
