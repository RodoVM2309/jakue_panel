import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-nueva-cabecera',
  templateUrl: './nueva-cabecera.component.html',
  styleUrls: ['./nueva-cabecera.component.scss']
})
export class NuevaCabeceraComponent implements OnInit {
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<NuevaCabeceraComponent>,
  private fb: FormBuilder,
  private dialog: MatDialog){ }

  ngOnInit() {
    this.itemForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(70)]]
    });
  }

  submit() {
    this.dialogRef.close(this.itemForm.value);
  }

}
