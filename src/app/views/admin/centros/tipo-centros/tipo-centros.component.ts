import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-tipo-centros',
  templateUrl: './tipo-centros.component.html',
  styleUrls: ['./tipo-centros.component.scss']
})
export class TipoCentrosComponent implements OnInit {
  public itemForm: FormGroup;
  toppings = new FormControl();
  tipoList: any = [
    { id: 0, descripcion: 'Centro No Cliente' },
    { id: 1, descripcion: 'Centro Muvin' },
    { id: 2, descripcion: 'Dador de Carga' }
  ];
  datos: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TipoCentrosComponent>,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.datos = this.data.payload;
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    let dataform = {
      id: [item.id_usuario],
      tipo: [item.cliente_muvin, Validators.required]
    };
    this.itemForm = this.fb.group(dataform);
  }

  submit() {    
    this.dialogRef.close(this.itemForm.value);
  }
}
