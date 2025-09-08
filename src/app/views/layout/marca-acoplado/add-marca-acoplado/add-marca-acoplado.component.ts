import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';


@Component({
  selector: 'app-add-marca-acoplado',
  templateUrl: './add-marca-acoplado.component.html',
  styleUrls: ['./add-marca-acoplado.component.scss']
})
export class AddMarcaAcopladoComponent implements OnInit {
  public itemForm: FormGroup;
  basicForm: FormGroup;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddMarcaAcopladoComponent>,
  private fb: FormBuilder) { }

  
  ngOnInit() {
    this.buildItemForm(this.data.payload);
  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      descripcion: new FormControl(item.descripcion || '', [
        Validators.maxLength(10),
        Validators.required
      ])
    });
  }
  submit() {
    this.dialogRef.close(this.itemForm.value);
  }

}
