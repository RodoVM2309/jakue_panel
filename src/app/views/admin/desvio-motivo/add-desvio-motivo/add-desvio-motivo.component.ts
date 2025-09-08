import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-add-desvio-motivo',
  templateUrl: './add-desvio-motivo.component.html',
  styleUrls: ['./add-desvio-motivo.component.scss']
})
export class AddDesvioMotivoComponent implements OnInit {
  public itemForm: FormGroup;
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddDesvioMotivoComponent>,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      descripcion: [item.descripcion || '', Validators.required]
    });
  }

  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }

}