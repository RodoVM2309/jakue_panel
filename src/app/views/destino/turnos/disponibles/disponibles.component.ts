import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from "moment";
import { HomeService } from 'app/shared/components/home/home.service';
import { Product } from 'app/shared/models/product.model';
import { DestinosService } from 'app/shared/services/destinos.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Puerto } from 'app/shared/models/puerto';
import { SituacionPuertoDestino } from 'app/shared/models/situacion-puerto';
import { MatDialogRef, MatDialog, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import { EnviarSmsComponent } from './enviar-sms/enviar-sms.component';
import { InfoVentanillaComponent } from './info-ventanilla/info-ventanilla.component';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';


export class SendMessage {
  horarios: string;
  mensaje: string;
}
@Component({
  selector: 'app-turnos-disponibles',
  templateUrl: './disponibles.component.html',
  styleUrls: ['./disponibles.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es-ES"
    }
  ]
})
export class DisponiblesComponent implements OnInit {
  filtrarForm: FormGroup;
  filtro = {
    id_producto: 0,
    fecha: "",
    id_destino: 0
  };
  data: any;

  //Columna Izq
  turnosDisponiblesDia: number = 0;
  totalTurnos: number = 0;
  totalporciento: number = 0;
  //Columna Derecha
  turnosDisponiblesDiaSiguiente: number = 0;
  totalTurnosSiguiente: number = 0;
  totalporcientoSiguiente: number = 0;

  now = moment(new Date());
  fechaIzqString: string;
  fechaIzq = moment(new Date());
  fechaDer = moment(new Date());
  fechaDerString: string;
  productos: Product[];
  destinos: Puerto[] = [];
  panelIzq: SituacionPuertoDestino[] = [];
  panelDer: SituacionPuertoDestino[] = [];
  listMensajes: SendMessage[] = [];
  constructor(
    private homeService: HomeService,
    private destinosService: DestinosService,
    private errorService: AppErrorService,
    private loader: AppLoaderService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.fechaIzqString = this.now.format("DD/MM/YYYY");
    this.fechaIzq = this.now;
    this.fechaDerString = moment(this.now).add(1, 'days').format("DD/MM/YYYY");
    this.fechaDer = moment(this.now).add(1, 'days');

    this.filtrarForm = new FormGroup({
      selectedProducto: new FormControl(''),
      selectedFecha: new FormControl(new Date()),
      selectedDestino: new FormControl('')
    });
    this.filtro.fecha = this.homeService.formatoFecha(
      this.now,
      "amd",
      "-"
    );
    this.getDestinos();
  }

  aplicarFiltro(valor, cmp) {
    this.data = [];
    switch (valor) {
      case "fecha":
        this.filtro.fecha = this.homeService.formatoFecha(
          cmp.value,
          "amd",
          "-"
        );
        this.fechaIzq = moment(cmp.value);
        this.fechaIzqString = this.fechaIzq.format("DD/MM/YYYY");
        this.fechaDer = moment(cmp.value).add(1, 'days');
        this.fechaDerString = this.fechaDer.format("DD/MM/YYYY");
        this.getItemsProductos();
        break;
      case "id_producto":
        this.filtro.id_producto = cmp.value;
        this.loadDataIzq();
        this.loadDataDer();
        break;
      case "id_destino":
        this.filtro.id_destino = cmp.value;
        this.getItemsProductos();
        break;
    }
  }
  getItemsProductos() {
    this.productos = [];
    this.destinosService.getTurnoPuerto(this.filtro).subscribe(data => {
      data.data.forEach(element => {
        //console.log(element);
        let tempProducto = new Product();
        tempProducto.id = element.producto_id;
        tempProducto.descripcion = element.nombreProducto;
        this.productos.push(tempProducto);
      });
     // //console.log(this.productos);
      if (this.productos.length > 0) {
        this.filtrarForm.controls['selectedProducto'].setValue(this.productos[0].id);
        this.filtro.id_producto = parseInt(this.productos[0].id);
        this.loadDataIzq();
        this.loadDataDer();
      } else {
        this.errorService.confirm({ message: ' no existe productos para el puerto del destino' }).subscribe(res => {
          if (res) {
            return;
          }
        });
      }
    });

  }
  getDestinos() {
    this.loader.open();
    this.destinosService.getDestinoPersona()
      .subscribe(pagedData => {
        this.destinos = [];
        this.loader.close();
        if (pagedData.data) {
          pagedData.data.forEach(element => {
            let puerto = new Puerto();
            puerto.id = element.id;
            puerto.descripcion = element.descripcion;
            this.destinos.push(puerto);
          });
          if (this.destinos.length > 0) {
            this.filtrarForm.controls['selectedDestino'].setValue(this.destinos[0].id);
            this.filtro.id_destino = this.destinos[0].id;
            this.getItemsProductos();
          } else {
            this.errorService.confirm({ message: ' no existe puertos para del destino' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          }
        }
      },
        err => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.errorService.confirm({ message: 'Error, al buscar los puertos del destino' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
  }

  loadDataIzq() {
    this.panelIzq = [];
    let filtroIzq = this.filtro;
    filtroIzq.fecha = moment(this.fechaIzq).format("YYYY-MM-DD");
    if (this.filtro.id_destino != 0 && this.filtro.id_producto != 0) {
      this.destinosService.getSituacionPuerto(filtroIzq)
        .subscribe(pagedData => {
            this.totalTurnos          = pagedData.data.total;
            this.turnosDisponiblesDia = pagedData.data.ocupados;
            this.totalporciento       = this.totalTurnos == 0 ? 0 : Math.round(( this.turnosDisponiblesDia / this.totalTurnos) * 100);
          pagedData.data.turnos.forEach(element => {
           let temp = new SituacionPuertoDestino();
            temp.id_horario = element.id;
            temp.inicio     = element.inicio.substring(0, 5);
            temp.fin        = element.fin.substring(0, 5);
            temp.ocupados   = element.ocupados;
            temp.cantidad   = element.cantidad;
            temp.porciento  = element.ocupados == 0 ? 0 : Math.round((element.ocupados / element.cantidad) * 100);
            //console.table({ temp});
            temp.checked = false;
            this.panelIzq.push(temp);
          });
        },
          err => {
            this.errorService.confirm({ message: 'Error, al buscar la situación del puerto' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          });
    }
  }
  loadDataDer() {
    this.panelDer = [];
    let filtroDer = this.filtro;
    filtroDer.fecha = moment(this.fechaDer).format("YYYY-MM-DD");
    if (this.filtro.id_destino != 0 && this.filtro.id_producto != 0) {
      this.destinosService.getSituacionPuerto(filtroDer)
        .subscribe(pagedData => {
          //console.log(pagedData);
          this.turnosDisponiblesDiaSiguiente = pagedData.data.ocupados;
          this.totalTurnosSiguiente          = pagedData.data.total;
          this.totalporcientoSiguiente       = this.totalTurnosSiguiente == 0 ? 0 : Math.round(( this.turnosDisponiblesDiaSiguiente / this.totalTurnosSiguiente) * 100);
          pagedData.data.turnos.forEach(element => {
            let temp = new SituacionPuertoDestino();
            temp.id_horario = element.id;
            temp.inicio     = element.inicio.substring(0, 5);
            temp.fin        = element.fin.substring(0, 5);
            temp.ocupados   = element.ocupados;
            temp.cantidad   = element.cantidad;
            temp.porciento  = element.ocupados == 0 ? 0 : Math.round((element.ocupados / element.cantidad) * 100);
            temp.checked = false;
            this.panelDer.push(temp);
          });
        },
          err => {
            this.errorService.confirm({ message: 'Error, al buscar la situación del puerto' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          });
    }
  }


  fechaPrevia() {
    this.fechaDerString = this.fechaIzqString;
    this.fechaDer = this.fechaIzq;
    let tempFecha = moment(this.fechaIzq).add(-1, 'days');
    this.fechaIzqString = tempFecha.format("DD/MM/YYYY");
    this.fechaIzq = tempFecha;
    this.panelDer = [];
    this.panelDer = this.panelIzq;
    this.panelIzq = [];
    this.turnosDisponiblesDia          = 0;
    this.totalTurnos                   = 0;
    this.totalporciento                = 0;
    this.turnosDisponiblesDiaSiguiente = 0;
    this.totalTurnosSiguiente          = 0;
    this.totalporcientoSiguiente       = 0;
    this.loadDataIzq();
    this.loadDataDer();
  }
  fechaNext() {
    this.fechaIzq = this.fechaDer;
    this.fechaIzqString = this.fechaDerString;
    let tempFecha = moment(this.fechaDer).add(1, 'days');
    this.fechaDerString = tempFecha.format("DD/MM/YYYY");
    this.fechaDer = tempFecha;
    this.panelIzq = [];
    this.panelIzq = this.panelDer;
    this.panelDer = [];
    this.turnosDisponiblesDia          = 0;
    this.totalTurnos                   = 0;
    this.totalporciento                = 0;
    this.turnosDisponiblesDiaSiguiente = 0;
    this.totalTurnosSiguiente          = 0;
    this.totalporcientoSiguiente       = 0;
    this.loadDataIzq();
    this.loadDataDer();
  }
  onCheckboxSendMessage(chck, item, index) {

    //console.log(item);
    let temp = new SendMessage();
    temp.horarios = item.id_horario;
     if (chck.checked) {
      this.listMensajes.push(temp);
    } else {
      this.listMensajes.splice(this.listMensajes.indexOf(temp), 1);
    }
  }

  openPopUpsms() {
    let title = 'Contactar ';
    let dialogRef: MatDialogRef<any> = this.dialog.open(EnviarSmsComponent, {
      width: '700px',
      disableClose: true,
      data: {
        title: title, payload: {
         listMensajes: this.listMensajes
        }
      }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {

          return;
        } else {
          this.listMensajes = [];
        }
      });

  }
  openPopUpInfoVentanilla(row, caso: boolean) {
    let heightPop: number = 30 + (row.turnos * 10);
    let heightPopUp: string = '30vh';
    if (heightPop > 80) heightPopUp = '80vh'
    else heightPopUp = heightPop.toString();
    let title = 'CHOFERES CON TURNOS ';
    let dialogRef: MatDialogRef<any> = this.dialog.open(InfoVentanillaComponent, {
      width: '80vw',
      height: heightPopUp,
      disableClose: true,
      data: {
        title: title, payload: {
          id_puerto: parseInt(this.filtrarForm.controls['selectedDestino'].value),
          id_producto: parseInt(this.filtrarForm.controls['selectedProducto'].value),
          fecha: caso ? moment(this.fechaIzq).format("YYYY-MM-DD") : moment(this.fechaDer).format("YYYY-MM-DD"),
          id_horario:row.id_horario,
          inicio:row.inicio,
          fin:row.fin,
        }
      }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        } else {
          this.listMensajes = [];
        }
      });
  }


}
