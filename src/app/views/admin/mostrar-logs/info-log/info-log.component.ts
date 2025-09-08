import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { CentrosService } from 'app/shared/services/centros.service';


@Component({
  selector: 'app-info-log',
  templateUrl: './info-log.component.html',
  styleUrls: ['./info-log.component.scss']
})
export class InfoLogComponent implements OnInit {
  itemForm: FormGroup;
  id: any;
  datalog: any;
  public getItemSub: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InfoLogComponent>, public centroService: CentrosService) { }

  ngOnInit() {
    this.id = this.data.payload.id;
    this.itemForm = new FormGroup({
      json_entrada: new FormControl(''),
      json_salida: new FormControl('')
    });
    this.getItemSub = this.centroService.getMostrarLogsId(this.id)
      .subscribe(data => {
        this.datalog = data.data;
        this.itemForm.controls['json_entrada'].setValue(this.datalog.json_entrada);
        this.itemForm.controls['json_salida'].setValue(this.datalog.json_salida);
      });
  }

}
