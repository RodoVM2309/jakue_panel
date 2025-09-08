import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder,  FormGroup } from '@angular/forms';
import { PromocionesService } from '../../../../shared/services/promociones.service';

export class ChoferLibre {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  id_tipo_camion: number;
  fecha: string;
  tipo_camion: string;
}

@Component({
  selector: 'ganadores-add-promociones',
  templateUrl: './ganadores-promociones.component.html',
  styleUrls: ['./ganadores-promociones.component.scss']
})
export class GanadoresPromocionesComponent implements OnInit {
  public itemForm: FormGroup;
  public ganadores: ChoferLibre[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private promocionesService: PromocionesService,
    public dialogRef: MatDialogRef<GanadoresPromocionesComponent>,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.getGanadores(this.data.payload.id);
  }
  getGanadores(id) {
    this.promocionesService.getAllGanadoresPromociones(id)
      .subscribe(data => {
        this.ganadores = data.data;
      });
  }
  

  

}
