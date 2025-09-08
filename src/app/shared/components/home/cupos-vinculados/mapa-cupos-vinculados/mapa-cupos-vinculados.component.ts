import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA} from '@angular/material';
import { CupoVinculado } from '../../../../models/cupoViculado';
import { Viaje } from '../../../../models/viaje';
import { HomeService } from '../../../../components/home/home.service';


@Component({
  selector: 'app-mapa-cupos-vinculados',
  templateUrl: './mapa-cupos-vinculados.component.html',
  styleUrls: ['./mapa-cupos-vinculados.component.scss']
})
export class MapaCuposVinculadosComponent implements OnInit {
  cupo: CupoVinculado;
  viajesPedido:Viaje[];
  zoom = 8;
  mapCenter = {
    lat: -33.954506,
    lng: -59.681654
  }
  previous;
  public iconUrlRed = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png";
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public homeService:HomeService,
  public dialogRef: MatDialogRef<MapaCuposVinculadosComponent>) { }

  ngOnInit() {
    this.cupo= this.data.payload;
    this.actualizarPosicionChoferes_pedido(this.cupo.id_pedido);
  }
  closeForm(){
    this.dialogRef.close();
  }
  actualizarPosicionChoferes_pedido(id_pedido:number) {
    this.viajesPedido=[];
    this.homeService.getAllViajesPedido(id_pedido)
          .subscribe(data => {
            this.viajesPedido = data.data;           
          },
            err => {
            });

  }
  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

}
