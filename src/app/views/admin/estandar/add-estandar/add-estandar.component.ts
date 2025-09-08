import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef,  MAT_DIALOG_DATA} from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-estandar',
  templateUrl: './add-estandar.component.html',
  styleUrls: ['./add-estandar.component.scss']
})
export class AddEstandarComponent implements OnInit {
  public itemForm: FormGroup;
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEstandarComponent>,
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