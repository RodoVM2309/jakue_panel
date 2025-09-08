import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar, MatSidenav, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialogRef } from '@angular/material';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { AppAtencionService } from 'app/shared/services/app-atencion/app-atencion.service';
import { Subscription } from 'rxjs';
import { egretAnimations } from "../../../shared/animations/egret-animations";
import { DestinosService } from 'app/shared/services/destinos.service';
import { Page } from 'app/shared/models/page';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { ProductosService } from '../../../shared/services/productos.service';
import { Puerto } from 'app/shared/models/puerto';
import { HorarioPuerto, Ventanilla } from 'app/shared/models/horario-puerto';
import { FormGroup, FormControl } from '@angular/forms';
import { HomeService } from 'app/shared/components/home/home.service';

export class DestinoTurno {
  destino: string;
  cam_ventana: number;
  turnos: any;
}
@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  animations: egretAnimations
})
export class PanelComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  configPuertoForm: FormGroup;
  public destinos: Puerto[] = [];
  public getItemSub: Subscription;
  page = new Page();
  displayedColumns: string[] = [];
  staticColumns = ['button', 'checkbox'];
  dynamicColumns = [];
  dataSource = new MatTableDataSource();
  cantPuertos = 0;
  cantCamiones = 0;
  puertosNormal = 0;
  productos = [];
  horarioPuerto: HorarioPuerto[] = [];
  selectedPuerto: Puerto;
  now = new Date();
  filtro = {
    fecha: this.now
  };
  destinoTurno: DestinoTurno[] = [];
  turnos:any;

  constructor(
    private destinosService: DestinosService,
    private errorService: AppErrorService,
    private loader: AppLoaderService,
    private homeService: HomeService
  ) { }

  ngOnInit() {
    this.configPuertoForm = new FormGroup({
      selectedFecha: new FormControl(this.filtro.fecha)
    });
    this.setPage(null);

  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }
  }
  aplicarSelectFecha(fecha) {
    this.filtro.fecha = fecha.value;
  }
  setPage(event?: PageEvent) {
    let params = {
      page: 1,
      per_page: this.page.size
    };
    if (event !== null) {
      params.page = event.pageIndex + 1;
      params.per_page = event.pageSize;
    }
    this.destinos = [];
    this.loader.open();
    this.destinosService.getDestinoPersona()
      .subscribe(pagedData => {
        this.destinos = [];
        if (pagedData.data) {
          pagedData.data.forEach(element => {
            let puerto = new Puerto();
            puerto.id = element.id;
            puerto.descripcion = element.descripcion;
            puerto.nombreSituacionPuerto = element.nombreSituacionPuerto ? element.nombreSituacionPuerto : '';
            if (puerto.nombreSituacionPuerto == 'Operando normal') {
              this.puertosNormal++;
            }
            this.destinos.push(puerto);
          });
          this.cantPuertos = this.destinos.length;          
        };
        this.loader.close();      
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'Error, al buscar los puertos del destino' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
    this.destinosService.getDestinoTurno(this.homeService.formatoFecha(this.filtro.fecha, "amd", "-")  )
      .subscribe(pagedData => {
        this.destinoTurno = [];
        this.turnos=[];
        if (pagedData.data) {
          pagedData.data.forEach(element => {
            let puerto = new DestinoTurno();            
            puerto.destino = element.destino;
            puerto.cam_ventana = element.cam_ventana ? element.cam_ventana : 0;
            puerto.turnos= element.turnos;
            this.destinoTurno.push(puerto);
          });
          for (let index = 0; index < this.destinoTurno.length; index++) {
            const element = this.destinoTurno[index];
            this.dynamicColumns.push(
              { columnDef: 'col'+index,    header: element, cell: element}
            )            
          }         
          let miobject= new Object();         
           for (let index = 0; index < this.dynamicColumns.length; index++) {
            const element = this.dynamicColumns[index];
            const misturnos= this.dynamicColumns[index].cell.turnos.toString();  
            eval('miobject.'+this.dynamicColumns[index].columnDef+'=0');
          }  
          
          this.turnos.push({col0: 1,col1:10,col2:20,col3:30,col4:40,col5:50,col6:60,col7:70});
          for (let index = 0; index < this.turnos.length; index++) {
            let item=this.turnos[index];
            for (let ind = 0; ind < this.dynamicColumns.length; ind++) {
              const element = this.dynamicColumns[ind].columnDef;
              item[element]= this.destinoTurno[ind].turnos;
            }
        }
          this.turnos.push(miobject);
          for (let index = 0; index < this.dynamicColumns.length; index++) {
            const element = this.dynamicColumns[index].columnDef;            
            this.turnos[0].element=index;            
          }
        }
        this.displayedColumns = [...this.dynamicColumns.map(x => x.columnDef)];
        this.dataSource.data = this.turnos;
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'Error, al buscar los puertos del destino' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
  }

}
