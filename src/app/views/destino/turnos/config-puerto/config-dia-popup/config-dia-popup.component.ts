
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  Inject,
  ChangeDetectorRef
} from "@angular/core";
import {
  MatTableDataSource,
  MatDialogRef,
  MatDialog,
  MatProgressBar,
  MatButton,
  MatSelect,
  MatSnackBar,
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_DIALOG_DATA,
  MatCheckbox,
  MatCheckboxChange,
  MatRadioChange
} from "@angular/material";
import {
  Validators, FormGroup, FormControl,
  ValidatorFn,
  AbstractControl,
  FormBuilder
} from '@angular/forms';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { Puerto } from 'app/shared/models/puerto';
import { HorarioPuerto, Ventanilla } from 'app/shared/models/horario-puerto';
import { ProductosService } from 'app/shared/services/productos.service';
import { DestinosService } from 'app/shared/services/destinos.service';
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { element } from 'protractor';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { min } from "date-fns";

@Component({
  selector: 'app-config-dia-popup',
  templateUrl: './config-dia-popup.component.html',
  styleUrls: ['./config-dia-popup.component.scss']
})
export class ConfigDiaPopupComponent implements OnInit {
  public itemForm: FormGroup;
  puerto: Puerto;
  horario: HorarioPuerto;
  dia: number;
  productos = [];
  descripcion = '';
  ventanillas: Ventanilla[] = [];
  tamanoVentanilla: number=3600;
  isNew: boolean = false;
  esTodoDia: boolean = false;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ["inicio", "fin", "acciones"];
  arrayHoraInicio: any;
  arrayHoraFin: any;
  horaInicial: string = '';
  horaFinal: string = '';
  public selectedTimeInicio = '00:00';
  public selectedTimeFin = '00:00';
  chanceHorario = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfigDiaPopupComponent>,
    private productosServices: ProductosService,
    private formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    private destinosService: DestinosService,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private errorService: AppErrorService,
    private atp: AmazingTimePickerService, ) { }

  ngOnInit() {
    this.puerto = this.data.payload.selectedPuerto;
    this.dia = parseInt(this.data.payload.dia) - 1;
    this.horario = this.data.payload.horarios ? this.data.payload.horarios : [];
    this.ventanillas = this.horario[this.dia].ventanillas ? this.horario[this.dia].ventanillas : [];
    if (this.ventanillas.length == 0)
      this.isNew = true;
    this.getItemsProductos();    
    const dd = [];
    for (let i = 0; i < this.horario[this.dia].productos.length; i++) {
      dd.push(this.horario[this.dia].productos[i].id);
    }
    this.selectedTimeInicio = this.horario[this.dia].hora_inicio !== "--:--" ? this.horario[this.dia].hora_inicio : "00:00";
    this.selectedTimeFin = this.horario[this.dia].hora_fin !== "--:--" ? this.horario[this.dia].hora_fin : "00:00";    
    let hora= this.horario[this.dia].tam_ventana!=='00:00'? (this.horas(this.horario[this.dia].tam_ventana)):1;
    let minu= this.horario[this.dia].tam_ventana!=='00:00'? (this.minutos(this.horario[this.dia].tam_ventana)):'00';
    this.itemForm = new FormGroup({
      id: new FormControl(this.puerto.id),
      descripcion: new FormControl(this.puerto.descripcion),
      cam_ventana: new FormControl(this.horario[this.dia].cam_ventana,[Validators.min(0)]),      
      hora:new FormControl(hora, [Validators.required,Validators.min(0),Validators.max(24)]),
      min:new FormControl(minu, [Validators.required,Validators.min(0),Validators.max(60)]),
      hora_inicio: new FormControl(this.selectedTimeInicio),
      hora_fin: new FormControl(this.selectedTimeFin),
      producto_ids: new FormControl(dd, [Validators.required]),
      todosproductos: new FormControl(""),
      todoDia: new FormControl(""),
      
    });
    this.itemForm.controls['producto_ids'].setValue(dd);  
    this.dataSource.data = this.ventanillas;
    this.changeDetectorRefs.detectChanges();
  }

  openInicio(event) {
    const amazingTimePicker = this.atp.open({
      time: this.selectedTimeInicio,
      theme: 'dark',
      arrowStyle: {
        background: 'red',
        color: 'white'
      }
    });
    amazingTimePicker.afterClose().subscribe(time => {
      if (time!==this.selectedTimeInicio){
        this.itemForm.controls['todoDia'].setValue(false);
        this.chanceHorario=true;
      }
      this.selectedTimeInicio = time;
    });
  }

  openFin(event) {
    const amazingTimePicker = this.atp.open({
      time: this.selectedTimeFin,
      theme: 'dark',
      arrowStyle: {
        background: 'red',
        color: 'white'
      }
    });
    amazingTimePicker.afterClose().subscribe(time => {
      if (time!==this.selectedTimeFin) {
        this.chanceHorario=true;
        this.itemForm.controls['todoDia'].setValue(false);
      }
      if (time>this.selectedTimeInicio) {
        this.selectedTimeFin = time;
      }     
      else {
         this.selectedTimeFin = this.selectedTimeInicio;
      }
     
    });
  }


  submit() {
    this.loader.open();
    let venta = [];
    let prod = [];
    this.tamanoVentanilla= this.tiempo(parseInt(this.itemForm.controls['hora'].value),parseInt(this.itemForm.controls['min'].value),0);
    if (this.chanceHorario) {
      this.generarVentanillas();
      this.ventanillas.forEach(element => {
        let temp = {
          inicio: element.inicio,
          fin: element.fin
        }
        venta.push(temp)
      });
    } else {
      venta= this.ventanillas;
    };
    let data = {
      dias: [
        {
          dia: this.data.payload.dia,
          //hora_inicio: this.itemForm.controls['hora_inicio'].value,
          hora_inicio: this.selectedTimeInicio,
          cam_ventana: this.itemForm.controls['cam_ventana'].value,
          tam_ventana: this.tamanoVentanilla,
          //hora_fin: this.itemForm.controls['hora_fin'].value,
          hora_fin: this.selectedTimeFin,
          producto_ids: this.itemForm.controls['producto_ids'].value,
          ventanillas: venta
        }
      ]
    }
    if (this.isNew) {
      this.destinosService.postHorarioPuertoDestino(this.puerto.id, data)
        .subscribe(data => {
          this.loader.close();
          this.snack.open('Horario del Puerto insertado!', 'OK', { duration: 4000 })
          this.dialogRef.close(1);
        },
          err => {
            this.loader.close();
            this.errorService.confirm({ message: 'No se puede modificar la operatoria del día debido a que existen turnos activos' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          })
    } else {
      this.destinosService.updateHorarioPuertoDestino(this.puerto.id, data)
        .subscribe(data => {
          this.loader.close();
          this.snack.open('Horario del Puerto Actualizado!', 'OK', { duration: 4000 })
          this.dialogRef.close(1);
        },
          err => {
            this.loader.close();
            this.errorService.confirm({ message: 'No se puede modificar la operatoria del día debido a que existen turnos activos' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          })
    }
  }
  get f() {
    return this.itemForm.controls;
  }

  getItemsProductos() {
    this.productos = [];
    this.productosServices.getProductosPlanta().subscribe(data => {
      data.data.forEach(element => {
        this.productos.push(element);
      });
    });
  }
  onChangeTodoDia(event) {
    this.chanceHorario=true;
    if (event.checked) {
      this.itemForm.controls['hora_inicio'].setValue('00:00');
      this.selectedTimeInicio='00:00';
      this.itemForm.controls['hora_fin'].setValue('00:00');
      this.selectedTimeFin='00:00';
      this.f.hora_inicio.disabled;
      this.f.hora_fin.disabled;
      this.esTodoDia = true;
    } else {
      this.f.hora_inicio.enabled;
      this.f.hora_fin.enabled;
      this.esTodoDia = false;
    }
  }
  onChangeTodosProductos(event) {
    if (event.checked) {
      const dd = [];
      for (let i = 0; i < this.productos.length; i++) {
        dd.push(this.productos[i].id);
      }
      this.f.producto_ids.setValue(dd);
    } else {
      this.f.producto_ids.reset();
    }
  }
  eliminarVentanilla(cupo) {
    let tempCupo = [];
    this.ventanillas.forEach(element => {
      if (element.id !== cupo.id) tempCupo.push(element);
    });
    this.ventanillas = tempCupo;
    this.dataSource.data = this.ventanillas;
  }
  onChangeAcoplado() {
    if (this.f.producto_ids.value.length !== this.productos.length) {
      if (this.f.todosproductos.value) {
        this.f.todosproductos.setValue(false);
      }
    } else {
      if (!this.f.todosproductos.value) {
        this.f.todosproductos.setValue(true);
      }
    }
  }

  generarVentanillas() {
    let horainicial = 0;
    let horafin = 0;
    let valorhora = 0;
    let tempVent: Ventanilla;
    this.ventanillas = [];
    let final = 86340;
    let index: number = 0;
    if (!this.esTodoDia) {
      this.horaInicial = this.selectedTimeInicio;
      this.arrayHoraInicio =  this.horaInicial.split(':');
      this.horaFinal = this.selectedTimeFin;
      this.arrayHoraFin = this.horaFinal.split(':');
      horainicial = this.tiempo(parseInt(this.arrayHoraInicio[0]), parseInt(this.arrayHoraInicio[1]), 0);
      final = this.tiempo(parseInt(this.arrayHoraFin[0]), parseInt(this.arrayHoraFin[1]), 0);
    }
    while (horainicial < final) {
      valorhora = horainicial + this.tamanoVentanilla;
      let tempVent = new Ventanilla();
      let hor = this.horasString(horainicial);
      let mi = this.minutosString(horainicial);
      tempVent.inicio = hor + ':' + mi;
      let horf = this.horasString(valorhora);
      let mif = this.minutosString(valorhora);
      tempVent.fin = horf + ':' + mif;
      tempVent.id = index;
      this.ventanillas.push(tempVent);
      index++;
      horainicial = valorhora;
    };
  }
  validateHoraMinutos(value, tipo) {
    let valor=parseInt(value);
    if (tipo === "hora") {
      if (valor<0) 
      this.itemForm.controls["hora"].setValue(0);
      if (valor>24) 
      this.itemForm.controls["hora"].setValue(24);
    } else {
       if (valor<0) 
        this.itemForm.controls["min"].setValue(0);
        if (valor>60) 
        this.itemForm.controls["min"].setValue(60);
    }
  }
  validateCamiones(value) {
    let valor=parseInt(value);
    if (valor<0) 
      this.itemForm.controls["cam_ventana"].setValue(0);
     
  }

  cambiarhora() {
    let horainicial = 0;
    let final = 0;
    if (!this.esTodoDia) {
      horainicial = this.tiempo(this.f.hora_inicio.value, this.f.min_inicio.value, 0);
      final = this.tiempo(this.f.hora_fin.value, this.f.min_fin.value, 0);
      this.horaInicial = this.horasString(horainicial) + ':' + this.minutosString(horainicial);
      this.horaFinal = this.horasString(final) + ':' + this.minutosString(final);
    } else {
      this.horaInicial = '00:00';
      this.horaFinal = '00:00';
    }
  }

  horas(time) {
    return Math.floor(time / 3600);
  }
  minutos(time) {
    return Math.floor((time % 3600) / 60);
  }
  segundos(time) {
    return time % 60;
  }
  tiempo(hours?, minut?, sec?) {
    return hours * 3600 + minut * 60 + sec
  }
  horasString(hora) {
    let ho = this.horas(hora).toString();
    let hor = ho.length < 2 ? '0' + ho : ho;
    return hor;
  }
  minutosString(minutos) {
    let minu = this.minutos(minutos).toString();
    let hor = minu.length < 2 ? '0' + minu : minu;
    return hor;
  }

}
