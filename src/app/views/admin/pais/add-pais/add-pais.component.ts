import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-add-pais',
  templateUrl: './add-pais.component.html',
  styleUrls: ['./add-pais.component.scss']
})
export class AddPaisComponent implements OnInit {
  public itemForm: FormGroup;
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddPaisComponent>,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      descripcion: new FormControl(item.descripcion || '', [
        Validators.minLength(4),
        Validators.maxLength(20),
        Validators.required,
        Validators.pattern('[a-z]*')
      ])
    });
  }

  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }

}
