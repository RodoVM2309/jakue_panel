import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-no-found',
  templateUrl: './no-found.component.html',
  styleUrls: ['./no-found.component.scss']
})
export class NoFoundComponent implements OnInit {
  title = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<NoFoundComponent>) { }

  ngOnInit() {
    this.title= this.data.title;
  }

  submit() {
    this.dialogRef.close();

  }

}
