import { Component, OnInit } from '@angular/core';
import { AppLoaderService, MessageService } from '@app/shared/services';
import { CupoService } from '../../cupo/cupo.service';
import { HomeService } from '../home.service';

export class Items {
  id: number;
  descripcion: string;
}
@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.scss']

})
export class CargaComponent implements OnInit {
  esDadorCupo: any;
  esClienteFinal: any;
  showTabCuposDisponibles: boolean = false;
  showTabCuposVinculados: boolean = false;
  showTabSolicitudes: boolean = false;
  showTabPanelConsolidado: boolean = false;
  selectedTab = 0;

  public searchDateString: string = "";
  now = new Date();
  cuposDadoresApiV2: any[] = [];
  cuposDetallesApiV2: any[] = [];
  productos: Items[] = [];
  myData: any = {
    micuit: "",
    soyCorredor: false,
    solicitaCupos: false,
    formularioCupera: false,
    lbCorredor: "",
    name: "",
    usaCupera: ""
  };

  constructor(
    private homeService: HomeService,
    private cupoService: CupoService,
    private loader: AppLoaderService,
    private messageService: MessageService,
  ) {
    this.esDadorCupo = localStorage.getItem("esDadorCupo") === '1' ? true : false;
    this.esClienteFinal = localStorage.getItem("esClienteFinal") === '1' ? true : false;

    if (this.esClienteFinal) {
      this.showTabCuposDisponibles = true;
      this.showTabPanelConsolidado = true;
    } else {
      this.selectedTab = 1;
      this.showTabCuposDisponibles = true;

    }
    this.myData.micuit = localStorage.getItem("cuit_cuil");
    this.myData.myname = localStorage.getItem("nameUser");
    this.myData.solicitaCupos =
      localStorage.getItem("esDestinatario") === "1" ? false : true;
    this.myData.formularioCupera =
      localStorage.getItem("formularioCupera") === "2" ? true : false;
    this.myData.usaCupera = localStorage.getItem("usaCupera");
  }

  ngOnInit() {
    if (this.showTabPanelConsolidado) {
      this.searchDateString = this.homeService.formatoFecha(this.now, "amd", "-");
      this.loadData(this.searchDateString, 0, true);
      //this.getItemsProductos();
    }
  }


  selectTab(event) {
    this.selectedTab = event;
  }
  loadData(fecha, opcion, load: boolean) {
    this.cuposDadoresApiV2 = [];
    this.cuposDetallesApiV2 = [];
    this.loader.open("Por favor espere...");
    /* if (load) {
    } */
    //this.llenarArrayDia(fecha);

    switch (this.myData.usaCupera) {
      case "2":
        this.cupoService.getV3CuposAsignados(fecha).subscribe(
          (res) => {
            if (this.loader !== null) {
              this.loader.close();
            }
            this.cuposDadoresApiV2 = res.data.listado;
            this.cuposDetallesApiV2 = res.data.detalles;

            const data = {
              listado: res.data.listado,
              detalles: res.data.detalles,
            };
            switch (opcion) {
              case 1:
                this.messageService.sendMessage("PanelConsolidadoV2", "1", data);
                break;
              default:
                break;
            }
          },
          (error) => {
            this.loader.close();
          }
        );
        break;


      default:
        break;
    }
  }

  getItemsProductos() {
    this.cupoService.getProductosCentro().subscribe((data) => {
      this.productos = data.data;
      this.messageService.sendMessage("productos", '1', this.productos);
    });
  }
  chanceDate(event, opcion): void {
    this.searchDateString = event.fecha;
    this.loadData(this.searchDateString, opcion, true);
  }

}
