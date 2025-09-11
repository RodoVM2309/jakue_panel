import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-verificar-cedula-modal',
  templateUrl: './verificar-cedula-modal.component.html',
  styleUrls: ['./verificar-cedula-modal.component.scss']
})
export class VerificarCedulaModalComponent implements OnInit {
  public itemForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VerificarCedulaModalComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildItemForm();
  }

  buildItemForm() {
    this.itemForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d{1,8}(-\d)?$|^\d{1}\.\d{3}\.\d{3}(-\d)?$/)]]
    });
  }

  submit() {
    if (this.itemForm.valid) {
      this.dialogRef.close(this.itemForm.value);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
