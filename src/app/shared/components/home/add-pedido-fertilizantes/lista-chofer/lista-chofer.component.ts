import { Component, OnInit, Inject} from '@angular/core';
import {
  MatTableDataSource,
  MatDialogRef,
  MatDialog,
   MAT_DIALOG_DATA
} from '@angular/material';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { egretAnimations } from "../../../../animations/egret-animations";
import { Subscription } from 'rxjs';
import { MatSnackBar } from "@angular/material/snack-bar";

//Modelos
import { Page } from '../../../../models/page';
import { ChoferZona } from '../../../../models/chofer-zona';

//Sevicios
import { CentrosService } from '../../../../services/centros.service';
import { AddPedidoFertilizantesComponent } from '../add-pedido-fertilizantes.component';
import { FertilizantesService } from 'app/shared/services/fertilizantes.service';

@Component({
  selector: 'app-lista-chofer',
  templateUrl: './lista-chofer.component.html',
  styleUrls: ['./lista-chofer.component.scss'],
  animations: egretAnimations
})
export class ListaChoferComponent implements OnInit {

  subcriptionInfoChofer: Subscription;

  page = new Page();
  selected: string;
  public choferes: ChoferZona[];
  filtro = {
    patente: '',
    cuit: '',
    transportista: '',
    nombre: ''
  };
  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Registros</span>
      </div>
    `
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ListaChoferComponent>,
    public dialogLocaRef: MatDialogRef<AddPedidoFertilizantesComponent>,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private centrosService:CentrosService,
    private fertilizantesService: FertilizantesService,

  ) {
    this.page.pageNumber = 0;
    this.page.size       = 10;
    this.selected        = 'nombre';

   }

  ngOnInit() {
    this.setPage({ offset: 0 });
  }



  setPage(pageInfo) {
   this.loader.open();
    this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro === undefined) {
      this.filtro = {
        patente: '',
        cuit: '',
        transportista: '',
        nombre: ''
      };
    }
    this.centrosService.getChoferesCentro(this.page.pageNumber, this.filtro).subscribe(pagedData => {
      this.loader.close();
      this.choferes = pagedData.data;
      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber    = pagedData._meta.currentPage;
      this.page.size          = pagedData._meta.perPage;
    });
  }

  updateFilter(event, param) {

    const val = event.target.value.toLowerCase();
    if(val.length === 0) return ;
    if(val.length >= 3) {
      switch (param) {
        case 'patente':
          this.filtro.patente = val;
          break;
        case 'cuit':
          this.filtro.cuit = val;
          break;
        case 'transportista':
          this.filtro.transportista = val;
          break;
        case 'nombre':
          this.filtro.nombre = val;
          break;
        default:
          break;
      }
      this.setPage({ offset: 0 });
    }
  }


  resetBusqueda(){
    this.selected  = 'nombre';
    this.filtro = {
      patente: '',
      cuit: '',
      transportista: '',
      nombre: ''
    };
    this.setPage({ offset: 0 });
  }

  obtenerChofer(row: any){
   row.index = this.data.payload.index;
    this.fertilizantesService.infoChofer$.emit(row);
    this.dialogLocaRef.close(row);
    this.snack.open('Chofer '+row.nombre_persona+' Asignado !!', '', {
      duration: 4000,
    });
  }

  gotoHome() {
    this.dialogLocaRef.close();
  }



}
