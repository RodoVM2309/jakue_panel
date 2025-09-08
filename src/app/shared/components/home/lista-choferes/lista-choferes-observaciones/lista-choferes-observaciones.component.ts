import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup,  FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-lista-choferes-observaciones',
  templateUrl: './lista-choferes-observaciones.component.html',
  styleUrls: ['./lista-choferes-observaciones.component.scss']
})
export class ListaChoferesObservacionesComponent implements OnInit {
  public itemForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ListaChoferesObservacionesComponent>,
  private fb: FormBuilder) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload);   
  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      observaciones: [item || '', Validators.required],      
    });
  }

  submit() {    
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }

}
