import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog,  MatSnackBar, MatSidenav, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialogRef } from '@angular/material';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { AppAtencionService } from 'app/shared/services/app-atencion/app-atencion.service';
import { Subscription } from 'rxjs';
import { egretAnimations } from "app/shared/animations/egret-animations";
import { DestinosService } from 'app/shared/services/destinos.service';
import { ConfigPuertoPopupComponent } from './config-puerto-popup/config-puerto-popup.component';
import { ConfigDiaPopupComponent } from './config-dia-popup/config-dia-popup.component';
import { Page } from 'app/shared/models/page';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { ProductosService } from 'app/shared/services/productos.service';
import { Puerto} from 'app/shared/models/puerto';
import { HorarioPuerto} from 'app/shared/models/horario-puerto';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { ChanceTimeComponent } from './chance-time/chance-time.component';
import { AdminEstadoComponent } from './admin-estado/admin-estado.component';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-config-puerto',
  templateUrl: './config-puerto.component.html',
  styleUrls: ['./config-puerto.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ConfigPuertoComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public destinos: Puerto[]= [];
  public getItemSub: Subscription;
  page = new Page();
  displayedColumns: string[] = ['diaSemana', 'horaInicio','horaFin','tamVentana','camVentana','listProductos',  'acciones'];
  dataSource= new MatTableDataSource();
  cantPuertos= 0;
  cantCamiones= 0;
  puertosNormal= 0;
  productos = [];
  list_productos = [];
  horarioPuerto: HorarioPuerto[]=[];
  selectedPuerto:Puerto;
  dia_data=[false,false,false,false,false,false,false]
  public selectedTime = '00:00';
  expandedElement: HorarioPuerto | null;

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private destinosService: DestinosService,
    private errorService: AppErrorService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private productosServices:ProductosService,
    private atp: AmazingTimePickerService,
  ) { }

  ngOnInit() {
    this.selectedPuerto= new Puerto();
    this.selectedPuerto.hora_corte="00:00";
    this.setPage();

  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }
  }

  setPage() {

    this.destinos=[];
    this.loader.open();
    this.destinosService.getDestinoPersona()
    .subscribe(pagedData => {
      this.destinos=[];
      this.loader.close();
      if(pagedData.data){
        pagedData.data.forEach(element => {
          let puerto= new Puerto();
          puerto.id= element.id;
          puerto.descripcion=element.descripcion;
          puerto.direccion=element.direccion ? element.direccion:'';
          puerto.domicilio=element.domicilio ? element.domicilio: '';
          puerto.hora_corte=element.hora_corte ? element.hora_corte.substring(0,5): '00:00';
          puerto.tiempo_para_demorado= element.tiempo_para_demorado ? element.tiempo_para_demorado.substring(0,5): '02:00';
          puerto.nombreZonaDestino=element.nombreZonaDestino ? element.nombreZonaDestino:'';
          puerto.nombreTipoDestino=element.nombreTipoDestino ?element.nombreTipoDestino: '';
          puerto.nombreSituacionPuerto=element.nombreSituacionPuerto ?element.nombreSituacionPuerto: '';
          puerto.colorSituacionPuerto=element.colorSituacionPuerto ?element.colorSituacionPuerto: '';
          if (puerto.nombreSituacionPuerto=='Operando normal') {
            this.puertosNormal++;
          }
          puerto.selected = false;
          this.destinos.push(puerto);
        });
        if (this.destinos.length>0) {
          this.seleccionarPuerto(0,this.destinos[0]);
        }
        this.cantPuertos= this.destinos.length;
      };
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
  expanded(expandedElement,item){   
   this.expandedElement = item;
  }

  open() {
    const amazingTimePicker = this.atp.open({
        time:  this.selectedPuerto.hora_corte,
        theme: 'dark',
        arrowStyle: {
            background: 'red',
            color: 'white'
        }
    });
    amazingTimePicker.afterClose().subscribe(time => {
      this.selectedPuerto.hora_corte = time;
      this.destinosService.updatePuertoDestino(this.selectedPuerto)
          .subscribe(data => {
            //this.destinos[index] = data.data;
            this.snack.open('Puerto Actualizado!', 'OK', { duration: 4000 })
          },
          err => {
            this.errorService.confirm({ message: 'Error, al actualizar el puerto del destino' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          })

    });
}

  openPopUp(index,data: any = {}) {
    let title =  'Actualizando el puerto';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ConfigPuertoPopupComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data}
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {

          return;
        }
        res.tam_ventana=this.tiempo(parseInt(res.hora),parseInt(res.min),0);
        this.destinosService.updatePuertoDestino(res)
          .subscribe(data => {
            this.snack.open('Puerto Actualizado!', 'OK', { duration: 4000 })
          },
          err => {
            this.errorService.confirm({ message: 'Error, al actualizar el puerto del destino' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          })
      })
  }
  openPopUpTime(index,data: string) {
    let title =  '';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ChanceTimeComponent, {
      width: '520px',
      disableClose: true,
      data: { title: title, payload: data}
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          return;
        }
        this.destinosService.updatePuertoDestinoHoraDemorado(index,res)
          .subscribe(data => {
            this.selectedPuerto.tiempo_para_demorado= res;
            this.snack.open('Puerto Actualizado!', 'OK', { duration: 4000 })
          },
          err => {
            this.errorService.confirm({ message: 'Error, al actualizar el puerto del destino' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          })
      })
  }

  seleccionarPuerto(i,row) {
    for (let index = 0; index < this.destinos.length; index++) {
      this.destinos[index].selected=false;
    };
    this.destinos[i].selected=true;
    this.selectedPuerto=row;
    this.getHorarioPuerto(this.selectedPuerto.id);
  }

  getItemsProductos() {
    this.productos = [];
    this.productosServices.getProductosPlanta().subscribe(data => {
      data.data.forEach(element => {
        this.productos.push(element);
      });
    });
  }

  getHorarioPuerto(id) {
    this.horarioPuerto=[];
    let tempHorario= [];
    this.destinosService.getHorarioPuertoDestino(id).subscribe(data => {
      data.data.horarios.forEach(element => {
        tempHorario.push(element);
      });
      for (let index = 1; index <= 7; index++) {
        var enc= false;
        var dia:HorarioPuerto;
          if (tempHorario.length>0) {
            dia= tempHorario.find(item => item.dia==index);
            if (dia) {
               enc = true;
          }
        }
        if (enc) {
          let horaBlanco= new HorarioPuerto();
          horaBlanco.dia=index;
          horaBlanco.dia_semana= this.diaSemana(index);
          horaBlanco.hora_inicio=dia.hora_inicio;
          horaBlanco.hora_fin=dia.hora_fin;
          horaBlanco.tam_ventana= dia.tam_ventana;
          horaBlanco.tam_ventanaHora=this.horasString( dia.tam_ventana)+':'+this.minutosString( dia.tam_ventana);
          horaBlanco.cam_ventana= dia.cam_ventana?dia.cam_ventana:0;
          horaBlanco.productos=dia.productos;
          horaBlanco.list_productos='';
          for (let index = 0; index < horaBlanco.productos.length; index++) {
            const element = horaBlanco.productos[index].descripcion;
            if (index===horaBlanco.productos.length-1) {
              horaBlanco.list_productos= horaBlanco.list_productos+element;
            } else {
              horaBlanco.list_productos= horaBlanco.list_productos+element +', ';
            }
          }
          horaBlanco.list_productosShort= horaBlanco.list_productos.length>50 ? horaBlanco.list_productos.substr(0,50)+'...':horaBlanco.list_productos;
          horaBlanco.ventanillas= dia.ventanillas;
          this.horarioPuerto.push(horaBlanco);
          this.dataSource.data= this.horarioPuerto;
          this.dia_data[index-1]=true;
        } else {
          let horaBlanco= new HorarioPuerto();
          horaBlanco.dia=index;
          horaBlanco.dia_semana= this.diaSemana(index);
          horaBlanco.hora_inicio='--:--';
          horaBlanco.hora_fin='--:--';
          horaBlanco.tam_ventana= '00:00';
          horaBlanco.cam_ventana= 0;
          horaBlanco.productos=[];
          horaBlanco.list_productos='';
          horaBlanco.list_productosShort='';
          horaBlanco.ventanillas= [];
          this.horarioPuerto.push(horaBlanco);
          this.dataSource.data= this.horarioPuerto;
        }
      }
    });
  }

  diaSemana(dia) {
    let etiqueta: string='';
    switch (dia) {
      case 1:
        etiqueta='Lunes';
        break;
      case 2:
        etiqueta='Martes';
        break;
      case 3:
        etiqueta='Miércoles';
        break;
      case 4:
        etiqueta='Jueves';
        break;
      case 5:
        etiqueta='Viernes';
        break;
      case 6:
        etiqueta='Sábado';
        break;
      case 7:
        etiqueta='Domingo';
        break;
      default:
        etiqueta='';
        break;
    }
    return etiqueta;
  }

  openPopConfigDia(row:HorarioPuerto){
    let data= {
      selectedPuerto: this.selectedPuerto,
      dia: row.dia,
      horarios:this.horarioPuerto
    }
    let title =  'Actualizando el horario del puerto '+this.selectedPuerto.descripcion+' del '+row.dia_semana;
    let dialogRef: MatDialogRef<any> = this.dialog.open(ConfigDiaPopupComponent, {
      width: '60vw',
      height:'90vh',
      disableClose: false,
      data: { title: title, payload: data}
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          return;
        }
        this.setPage();
      })

  }

  deleteItem(row) {
    this.confirmService.confirm({message: `Delete ${row.name}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.destinosService.deletePuertoDestino(row)
            .subscribe(data => {
              this.destinos = data;
              this.loader.close();
              this.snack.open('Member deleted!', 'OK', { duration: 4000 })
            })
        }
      })
  }
  openPopAdminEstado(){
    let data= {
      puerto: this.selectedPuerto
    }
    let title =  'ADMINISTRAR ESTADOS:  '+this.selectedPuerto.descripcion;
    let dialogRef: MatDialogRef<any> = this.dialog.open(AdminEstadoComponent, {
      width: '50vw',
      disableClose: false,
      data: { title: title, payload: data}
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          return;
        }
        this.destinos = this.destinos.filter((value, key) => {
          if (value.id === res.data.id) {
            value.nombreSituacionPuerto = res.data.nombreSituacionPuerto;
            value.colorSituacionPuerto = res.data.colorSituacionPuerto;
          }
          return true;
        });
       // this.setPage();
      })

  }




  horas(time){
    return Math.floor( time / 3600 );
  }
  minutos(time){
    return  Math.floor( (time % 3600) / 60 );
  }
  segundos(time){
    return time % 60;
  }
  tiempo(hours?,minut?,sec?){
    return hours*3600+minut*60+sec
  }
  horasString(hora) {
    let ho = this.horas(hora).toString();
    //let hor = ho.length < 2 ? '0' + ho : ho;
    //return hor;
    return ho;
  }
  minutosString(minutos) {
    let minu = this.minutos(minutos).toString();
    let hor = minu.length < 2 ? '0' + minu : minu;
    return hor;
  }
}
