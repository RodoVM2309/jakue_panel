import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_DIALOG_DATA } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from "@shared/helpers/date.adapter";

@Component({
  selector: 'app-add-alfanumerico',
  templateUrl: './add-alfanumerico.component.html',
  styleUrls: ['./add-alfanumerico.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es-ES"
    }
  ]
})
export class AddAlfanumericoComponent implements OnInit {
  public itemForm: FormGroup;
  minFecha = new Date();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddAlfanumericoComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.itemForm = this.fb.group({
      alfanumerico: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
    });
  }

  submit() {
    this.dialogRef.close(this.itemForm.value);
  }

}
