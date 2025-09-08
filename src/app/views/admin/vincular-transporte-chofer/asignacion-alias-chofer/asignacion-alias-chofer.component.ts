import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-asignacion-alias-chofer',
  templateUrl: './asignacion-alias-chofer.component.html',
  styleUrls: ['./asignacion-alias-chofer.component.scss']
})
export class AsignacionAliasChoferComponent implements OnInit {
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AsignacionAliasChoferComponent>,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id_transporte: [item.id_transporte || ''],
      id_chofer: [item.id_chofer || ''],
      alias: [item.alias || '',]
    });
  }

  submit() {
    this.dialogRef.close(this.itemForm.value);
  }

}
