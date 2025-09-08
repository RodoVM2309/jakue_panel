import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PersonasService } from 'app/shared/services/personas.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-add-zona-choferes-libres',
  templateUrl: './add-zona-choferes-libres.component.html',
  styleUrls: ['./add-zona-choferes-libres.component.scss']
})
export class AddZonaChoferesLibresComponent implements OnInit {
  public itemForm: FormGroup;
 public provincias: any= [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddZonaChoferesLibresComponent>,
    private fb: FormBuilder, private personasService: PersonasService,
    private loader: AppLoaderService) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload);
    this.getProvincias();
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      descripcion: [item.descripcion || '', Validators.required],
      id_provincia: [item.id_provincia || '', Validators.required],
    });
  }

  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }

  getProvincias() {
    this.loader.open();
    let idpais = 1;
    this.getProvinciasxPais(idpais);
  }

  getProvinciasxPais(v) {
    this.personasService.getProvincias(v)
      .subscribe(data => {
        this.provincias = data.data;        
        if (this.loader !== null) {
          this.loader.close();
        }
      });
  }

}