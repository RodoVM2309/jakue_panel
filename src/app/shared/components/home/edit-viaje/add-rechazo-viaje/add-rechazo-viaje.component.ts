import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CentrosService } from 'app/shared/services/centros.service';
import { MotivoRechazoViaje } from 'app/shared/models/motivo-rechazo-viaje';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-add-rechazo-viaje',
  templateUrl: './add-rechazo-viaje.component.html',
  styleUrls: ['./add-rechazo-viaje.component.scss']
})
export class AddRechazoViajeComponent implements OnInit {
  public itemForm: FormGroup;
  public motivoRechazoViaje: MotivoRechazoViaje[];
  public getItemSub: Subscription;
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddRechazoViajeComponent>,
    private fb: FormBuilder, private centrosServices: CentrosService,
    private loader: AppLoaderService) { 
      
    }

  ngOnInit() {
    this.buildItemForm(this.data.payload);
    this.motivoRechazoViaje=[];
    this.getItems();
    
  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id_viaje: [item.id || ''],
      id_motivo: ['']
    });
  }
  
  

  getItems(){
    this.loader.open('Buscando motivos de rechazo');
    this.getItemSub = this.centrosServices.getMotivosRechazosViaje()
      .subscribe(data => {   
        this.loader.close();
        this.motivoRechazoViaje= data.data;        
      }, err => {
        if (this.loader !== null) {
          this.loader.close();
        }
       

      }  );
  }

  submit() {
    this.dialogRef.close(this.itemForm.value);
  }

}
