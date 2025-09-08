import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CupoService } from "../../../../shared/components/cupo/cupo.service";

export class TipoProducto {
  id: number;
  descripcion: string;
}

@Component({
  selector: 'app-add-productos',
  templateUrl: './add-productos.component.html',
  styleUrls: ['./add-productos.component.scss']
})



export class AddProductosComponent implements OnInit {
  public itemForm: FormGroup;

  public tipoProductos: TipoProducto[];
  id_tipo_producto: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private cupoService: CupoService,
    public dialogRef: MatDialogRef<AddProductosComponent>,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.getTipoProductos();    //
    this.buildItemForm(this.data.payload);
  }

  getTipoProductos() {
    this.cupoService.getTipoProductos().subscribe(data => {    
      this.tipoProductos = data.data;
    });
    
  }

  buildItemForm(item) {    
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      descripcion: [item.descripcion || '', Validators.required],
      id_tipo_producto: [parseInt(item.id_tipo_producto) || '', [Validators.required]]
    });

  }

  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }

}
