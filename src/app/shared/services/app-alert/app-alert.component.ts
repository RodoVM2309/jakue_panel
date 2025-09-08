import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-alert',
  template: ` <div fxLayout="row wrap" fxLayoutAlign="center center">
                <div fxFlex="100">
                  <mat-card class="p-0" >
                      <mat-card-title class="mat-bg-warn m-0" fxLayoutAlign="center center" style="background:#A4DA4C; height: 147px;" >      
                        <img src="assets/images/muvin/icono_ok.png" alt="">          
                      </mat-card-title>    
                    <div mat-dialog-actions fxLayout="column wrap" style="align-content: center;align-items: center;text-align: center" >                    
                      <div fxFlex="100">
                            <p>{{ data.message }}</p>                      
                            <button type="button" mat-raised-button color="primary"  (click)="dialogRef.close(true)">OK</button>
                        </div>                        
                    </div>
                  </mat-card>
                  </div>
              </div>`,
    styleUrls: ['./alert.component.css']
})
export class AppAlertComponent {
  constructor(
    public dialogRef: MatDialogRef<AppAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {}
}