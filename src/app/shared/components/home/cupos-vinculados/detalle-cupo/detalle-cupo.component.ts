import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Cupo } from '../../../../models/cupo';
import { HomeService } from "../../home.service";
import { AppLoaderService } from '../../../../../shared/services/app-loader/app-loader.service';


@Component({
  selector: 'app-detalle-cupo',
  templateUrl: './detalle-cupo.component.html',
  styleUrls: ['./detalle-cupo.component.scss']
})
export class DetalleCupoComponent implements OnInit {
  cupo: Cupo;
  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DetalleCupoComponent>,
    private fb: FormBuilder,
    private homeService: HomeService,
    private loader: AppLoaderService) { }

  ngOnInit() {
    this.buildItemForm();
    this.getCupoInfo(this.data.payload.id);
  }
  buildItemForm() {
    this.itemForm = this.fb.group({
      id: [''],
      alfanumericoCupo: [''],
      cartaPorte: [''],
      fechaCupoFormateada: [''],
      codigoCosecha: [''],
      choferCuit: [''],
      nombreChofer: [''],
      nombreEstadoCupo: [''],
      nombreProducto: [''],
      nombreDestino: [''],
      destinoCodigoPlantaOncca: [''],
      destinatarioCuit: [''],
      corredorCuit: [''],
      nombreCorredor: [''],
      entregadorCuit: [''],
      nombreEntregador: [''],
      receptorCuit: [''],
      dadorCuit: [''],
      nombreDador: [''],
      observaciones: [''],
    });
  }
  getCupoInfo(id) {
    this.loader.open();
    this.homeService.getInfoCupo(id)
      .subscribe(data => {
        this.loader.close();
        this.cupo = data.data;
        this.itemForm.controls['alfanumericoCupo'].setValue(this.cupo.idCupoTerminal);
        this.itemForm.controls['cartaPorte'].setValue(this.cupo.cartaPorte);
        this.itemForm.controls['fechaCupoFormateada'].setValue(this.cupo.fechaCupoFormateada);
        this.itemForm.controls['codigoCosecha'].setValue(this.cupo.codigoCosecha);
        this.itemForm.controls['choferCuit'].setValue(this.cupo.choferCuit);
        this.itemForm.controls['nombreChofer'].setValue(this.cupo.nombreChofer);
        this.itemForm.controls['nombreEstadoCupo'].setValue(this.cupo.nombreEstadoCupo);
        this.itemForm.controls['nombreProducto'].setValue(this.cupo.nombreProducto);
        this.itemForm.controls['nombreDestino'].setValue(this.cupo.nombreDestino);
        this.itemForm.controls['destinoCodigoPlantaOncca'].setValue(this.cupo.destinoCodigoPlantaOncca);
        this.itemForm.controls['destinatarioCuit'].setValue(this.cupo.destinatarioCuit);
        this.itemForm.controls['corredorCuit'].setValue(this.cupo.corredorCuit);
        this.itemForm.controls['nombreCorredor'].setValue(this.cupo.nombreCorredor);
        this.itemForm.controls['entregadorCuit'].setValue(this.cupo.entregadorCuit);
        this.itemForm.controls['nombreEntregador'].setValue(this.cupo.nombreEntregador);
        this.itemForm.controls['receptorCuit'].setValue(this.cupo.receptorCuit);
        this.itemForm.controls['dadorCuit'].setValue(this.cupo.dadorCuit);
        this.itemForm.controls['nombreDador'].setValue(this.cupo.nombreDador);
        this.itemForm.controls['observaciones'].setValue(this.cupo.observaciones);
      });

    this.loader.close();

  }



  submit() {
    this.dialogRef.close();
  }

}
