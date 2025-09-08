import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mostrar-observ',
  templateUrl: './mostrar-observ.component.html',
  styleUrls: ['./mostrar-observ.component.scss']
})
export class MostrarObservComponent implements OnInit {
  itemForm: FormGroup;
  datalog: any;
  public getItemSub: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MostrarObservComponent>) { }

  ngOnInit() {
    this.itemForm = new FormGroup({
      observ: new FormControl(this.data.payload.observ),
    });    
  }

}
