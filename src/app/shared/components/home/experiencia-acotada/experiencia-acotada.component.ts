import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';

@Component({
  selector: 'app-experiencia-acotada',
  templateUrl: './experiencia-acotada.component.html',
  styleUrls: ['./experiencia-acotada.component.scss']
})
export class ExperienciaAcotadaComponent implements OnInit {
  public itemForm: FormGroup;
  public dadores: any = [];
  public getItemSub: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ExperienciaAcotadaComponent>,
    private nomencladoresService: NomencladoresService,
    private fb: FormBuilder) { }

  ngOnInit() {
    //this.cargarDadores();
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    this.dadores = item;
    this.itemForm = this.fb.group({
      dador: ['', Validators.required]
    });
  }

  submit() {
    let datafrm = this.itemForm.value;
    localStorage.setItem('limitado_dador','1');
    localStorage.setItem('select_dador_cuit', datafrm.dador.cuit);
    localStorage.setItem('select_dador_id', datafrm.dador.id);
    localStorage.setItem('select_dador_nombre_persona', datafrm.dador.nombre_persona);
    localStorage.setItem('dador_seleccionado', datafrm.dador.cuit);
    this.dialogRef.close(datafrm.dador);
  }

  cargarDadores() {
    this.getItemSub = this.nomencladoresService.getAllDadoresByReceptor()
      .subscribe(data => {
        this.dadores = data.data;
      });
  }


}
