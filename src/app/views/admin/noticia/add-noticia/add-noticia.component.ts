import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-add-noticia',
  templateUrl: './add-noticia.component.html',
  styleUrls: ['./add-noticia.component.scss']
})
export class AddNoticiaComponent implements OnInit {
  public itemForm: FormGroup;
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddNoticiaComponent>,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      titulo: [item.titulo || '', Validators.required],
      bajada: [item.bajada || '', Validators.required],
      contenido: [item.contenido || ''],
      fecha: [item.fecha || '', Validators.required],
      fuente: [item.fuente || ''],
      link_noticia_original: [item.link_noticia_original || ''],
    });
  }

  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }

}