import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AmazingTimePickerService } from 'amazing-time-picker';

import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

//Modelos
import { Filtro, HorarioFertilizantes } from 'app/shared/models/horario-fertilizantes';
import { Puerto } from 'app/shared/models/puerto';

//Servicios
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { AppAtencionService } from 'app/shared/services/app-atencion/app-atencion.service';

import { ProductosService } from 'app/shared/services/productos.service';

import { FertilizantesService } from 'app/shared/services/fertilizantes.service';
import { HorarioFertilizantesService } from 'app/shared/services/horario-fertilizantes.service';


export class EstadoPuerto {
  valor: string;
  descripcion: string;
}

export class Destino {
  id: number;
  descripcion: string;
}
export class AtencionPuerto {
  id: number;
  descripcion: string;
}
export class Banda {
  valor: string;
  descripcion: string;
}
export class Productos {
  id: string;
  descripcion: string;
}


@Component({
  selector: 'app-admin-bandas',
  templateUrl: './admin-bandas.component.html',
  styleUrls: ['./admin-bandas.component.scss']
})
export class AdminBandasComponent implements OnInit, OnDestroy {

  subcriptionFiltro: Subscription;
  @Output() cantidad_turno: EventEmitter<number> = new EventEmitter();

  configPuertoForm: FormGroup;
  semana: string;
  desactivarBtn = false;
  flat_estado = false;
  solucion_muvin = true;
  grillaSelecionada: number[] = [];
  totalSeleccionada: number = 0;
  total_turnos_producto: number[] = [];
  total_productos_origen: number[] = [];
  cant_turno: number = 0;
  selectedPuerto: Puerto;
  selectedProducto: string;
  horarioPuerto: HorarioFertilizantes[] = [];
  ourDate = new Date();
  actual = this.ourDate.getDate();
  mes = this.ourDate.getMonth();
  anterior = this.ourDate.getDate() - 7;
  siguiente = this.ourDate.getDate() + 7;
  productos: Productos[] = [];
  destinos: Destino[] = [];
  estadosPuertos: AtencionPuerto[] = [
    {
      id: 0,
      descripcion: 'Normal'
    },
    {
      id: 1,
      descripcion: 'Con Demora'
    },
    {
      id: 2,
      descripcion: 'Sin Operación'
    }
  ];

  semanas: EstadoPuerto[] = [
    {
      valor: 'anterior',
      descripcion: 'Semana Anterior'   /*  del '+ this.anterior+'/'+this.mes */
    },
    {
      valor: 'actual',
      descripcion: 'Semana Actual'   /*  + this.actual+'/'+this.mes */
    },
    {
      valor: 'posterior',
      descripcion: 'Semana Siguiente '/* + this.siguiente+'/'+this.mes */
    }
  ];
  acciones: AtencionPuerto[] = [
    {
      id: 0,
      descripcion: 'Aplicar Turnos por Banda '
    },
    {
      id: 1,
      descripcion: 'Suspender turnos disponibles'
    },

  ];
  bandas: Banda[] = [
    {
      valor: '0.5',
      descripcion: '0.5 h'
    },
    {
      valor: '1',
      descripcion: '1 h'
    },


  ];

  selected = '1';
  selectedTab = 0;


  constructor(
    private horarioFertilizantesService: HorarioFertilizantesService,
    private fertilizantesService: FertilizantesService,
    private atp: AmazingTimePickerService,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,

  ) { }

  ngOnInit() {
    this.crearFormulario();
    this.currentWeek();
    this.subcriptionFiltro = this.horarioFertilizantesService.filtros$.subscribe(res => {
     // console.log("Emitiendo valor",res);
    this.aplicarFilto(res);
    });
  }
  ngOnDestroy(): void {
    this.subcriptionFiltro.unsubscribe();
  }

  selectTab(event) {
    this.selectedTab = event;
  }


  crearFormulario() {
    this.selectedPuerto = new Puerto();
    this.selectedPuerto.hora_corte = "00:00";
    this.configPuertoForm = new FormGroup({
      id_origen: new FormControl(0, [Validators.required]),
      estado: new FormControl(0, [Validators.required]),
      corte: new FormControl(this.selectedPuerto.hora_corte, [Validators.required]),
      amp_cupo_antes: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(48), Validators.pattern('^[0-9]+')]),
      amp_cupo_despues: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(48), Validators.pattern('^[0-9]+')]),
      banda: new FormControl('', [Validators.required]),
      tolerancia: new FormControl('0', [Validators.required, Validators.min(0), Validators.max(48)]),
      id_tipo_despacho: new FormControl(),
      semana: new FormControl('actual', [Validators.required]),
      turno_banda: new FormControl('0', [Validators.required, Validators.min(1), Validators.max(999)]),
      acciones: new FormControl(0),
      flat_estado: new FormControl(this.flat_estado),
      m: new FormControl("F"),
    });
    this.getDestinos();
  }

  getDestinos() {
    this.fertilizantesService.getFetilizantesOrigen(this.solucion_muvin)
      .subscribe(pagedData => {
       if (pagedData.data) {
          pagedData.data.forEach(element => {
            let puerto = new Puerto();
            puerto.id = element.id;
            puerto.descripcion = element.descripcion;
            this.destinos.push(puerto);
          });
          this.getConfigInicial();
        }
      });

  }

  getConfigInicial() {

      this.horarioFertilizantesService.getBandaHorarias().subscribe(resp => {

      if( resp.success ){

        this.total_productos_origen = resp.data.total_productos_origen;
        this.total_turnos_producto  = resp.data.total_turnos_producto;
        let id_origen               = resp.data.configuracion_origen.id_origen;
        let id                      = resp.data.configuracion_origen.id_tipo_despacho;
        let estado                  = resp.data.configuracion_origen.estado;
        let corte                   = resp.data.configuracion_origen.corte;
        let amp_cupo_antes          = resp.data.configuracion_origen.amp_cupo_antes;
        let amp_cupo_despues        = resp.data.configuracion_origen.amp_cupo_despues;
        let banda                   = resp.data.configuracion_origen.banda;
        let tolerancia              = resp.data.configuracion_origen.tolerancia;

        this.configPuertoForm.controls['id_origen'].setValue(parseInt(id_origen));
        this.configPuertoForm.controls['estado'].setValue(parseInt(estado));
        this.configPuertoForm.controls['corte'].setValue(corte);
        this.configPuertoForm.controls['amp_cupo_antes'].setValue(amp_cupo_antes);
        this.configPuertoForm.controls['amp_cupo_despues'].setValue(amp_cupo_despues);
        this.configPuertoForm.controls['banda'].setValue(banda);
        this.configPuertoForm.controls['tolerancia'].setValue(tolerancia);
        this.getProductos(id_origen, id);
      }

    }, err => {
     this.errorService.confirm({ message: err.error.data.message }).subscribe(res => {
        if (res) {

          return;
        }
      });
    });
  }

  getProductos(id_origen, id) {
    this.productos = [];
    this.fertilizantesService.getTipoDespachoOrigen(id_origen).subscribe(productos => {
    if (productos.data.length == 0) {
        id = 0;
        let prod = {
          id: id.toString(),
          descripcion: "Tipo de Despacho sin configurar"
        };
        this.productos.push(prod);
      } else {
        this.productos = [];
        productos.data.forEach(element => {
          let producto         = new Productos();
          producto.id          = element.id;
          producto.descripcion = element.descripcion;
          this.productos.push(producto);
          if (id == element.id) {
            this.selectedProducto = element.descripcion;
          }
        });
      }
     this.configPuertoForm.controls['id_tipo_despacho'].setValue(id.toString());
    });
  }


  aplicarFilto(data) {
    let id_producto = data.id_tipo_despacho;
    let id_origen   = data.id_origen;
    let sem         = data.sem;

    this.horarioFertilizantesService.getBandaHorariasFiltro(id_producto, id_origen, sem).subscribe(resp => {

      this.total_turnos_producto  = resp.data.total_turnos_producto;
      this.total_productos_origen = resp.data.total_productos_origen;
      let id_origen               = resp.data.configuracion_origen.id_origen;
      let id_producto             = resp.data.configuracion_origen.id_tipo_despacho;
      let estado                  = resp.data.configuracion_origen.estado;
      let corte                   = resp.data.configuracion_origen.corte;
      let amp_cupo_antes          = resp.data.configuracion_origen.amp_cupo_antes;
      let amp_cupo_despues        = resp.data.configuracion_origen.amp_cupo_despues;
      let banda                   = resp.data.configuracion_origen.banda;
      let tolerancia              = resp.data.configuracion_origen.tolerancia;

      this.configPuertoForm.controls['id_origen'].setValue(parseInt(id_origen));
      this.configPuertoForm.controls['estado'].setValue(parseInt(estado));
      this.configPuertoForm.controls['corte'].setValue(corte);
      this.configPuertoForm.controls['amp_cupo_antes'].setValue(amp_cupo_antes);
      this.configPuertoForm.controls['amp_cupo_despues'].setValue(amp_cupo_despues);
      this.configPuertoForm.controls['banda'].setValue(banda);
      this.configPuertoForm.controls['tolerancia'].setValue(tolerancia);
      this.getProductos(id_origen, id_producto);
    });
  }

  onChange(ev: MatSelectChange) {
  this.selectedProducto = (ev.source.selected as MatOption).viewValue;
    let configBanda: Filtro = {
      "id_origen"       : this.configPuertoForm.get('id_origen').value,
      "id_tipo_despacho": this.configPuertoForm.get('id_tipo_despacho').value,
      "sem"             : this.configPuertoForm.get('semana').value
    };
    this.horarioFertilizantesService.filtros$.emit(configBanda);
    this.aplicarFilto(configBanda);
  }
  currentWeek() {
    let semana = this.configPuertoForm.get('semana').value;
    switch (semana) {
      case 'anterior':
        this.configPuertoForm.controls['amp_cupo_antes'].disable();
        this.configPuertoForm.controls['amp_cupo_despues'].disable();
        this.configPuertoForm.controls['banda'].disable();
        this.configPuertoForm.controls['tolerancia'].disable();
        this.configPuertoForm.controls['corte'].disable();
        this.configPuertoForm.controls['turno_banda'].disable();
        this.configPuertoForm.controls['acciones'].disable();
        this.desactivarBtn = true;
        break;
      case 'actual':
        this.configPuertoForm.controls['corte'].disable();
        this.configPuertoForm.controls['amp_cupo_antes'].disable();
        this.configPuertoForm.controls['amp_cupo_despues'].disable();
        this.configPuertoForm.controls['banda'].disable();
        this.configPuertoForm.controls['tolerancia'].disable();
        this.configPuertoForm.controls['turno_banda'].enable();
        this.configPuertoForm.controls['acciones'].enable();
        this.desactivarBtn = false;
        break;
      case 'posterior':
        this.configPuertoForm.enable();
        this.desactivarBtn = false;
        break;

      default:
        this.configPuertoForm.disable();
        this.desactivarBtn = true;
        break;
    }

  }

  modificarConfig(flat_estado) {

    this.configPuertoForm.controls['flat_estado'].setValue(flat_estado);
    let amp_cupo_antes = this.configPuertoForm.get('amp_cupo_antes').value;
    let amp_cupo_despues = this.configPuertoForm.get('amp_cupo_despues').value;
    let tolerancia = this.configPuertoForm.get('tolerancia').value;

    if (Number(amp_cupo_antes) < 0 || amp_cupo_antes == null) {
      this.configPuertoForm.controls['amp_cupo_antes'].setValue(0);
    } else if (amp_cupo_antes > 48) {
      this.configPuertoForm.controls['amp_cupo_antes'].setValue(48);
    }
    if (Number(amp_cupo_despues) < 0 || amp_cupo_despues == null) {
      this.configPuertoForm.controls['amp_cupo_despues'].setValue(0);
    } else if (amp_cupo_despues > 48) {
      this.configPuertoForm.controls['amp_cupo_despues'].setValue(48);
    }
    if (Number(tolerancia) < 0 || tolerancia == null) {
      this.configPuertoForm.controls['tolerancia'].setValue(0);
    } else if (amp_cupo_despues > 48) {
      this.configPuertoForm.controls['tolerancia'].setValue(48);
    }

    let datafrm = this.configPuertoForm.getRawValue();

   this.horarioFertilizantesService.postConfig(datafrm).subscribe(resp => {
      if (resp) {
        let configBanda: Filtro = {
          "id_origen"       : this.configPuertoForm.get('id_origen').value,
          "id_tipo_despacho": this.configPuertoForm.get('id_tipo_despacho').value,
          "sem"             : this.configPuertoForm.get('semana').value
        };
        this.snack.open('Configuración Actualizada!', 'OK', { duration: 4000 });
        this.horarioFertilizantesService.filtros$.emit(configBanda);
        this.aplicarFilto(configBanda);
      }
    }, err => {
     this.atencionService.confirm({ message: err.error.data.message }).subscribe(res => {
        if (res) {
          let configBanda: Filtro = {
            "id_origen"       : this.configPuertoForm.get('id_origen').value,
            "id_tipo_despacho": this.configPuertoForm.get('id_tipo_despacho').value,
            "sem"             : this.configPuertoForm.get('semana').value
          };
          this.horarioFertilizantesService.filtros$.emit(configBanda);
          this.aplicarFilto(configBanda);
          return;
        }
      });
    });
  }

  lista_pos(event) {
    this.totalSeleccionada = event.cantidad_seleccionado;
    this.grillaSelecionada = event.grid_seleccionada;
  }
  obtenerProductos() {
    let id_origen = this.configPuertoForm.get('id_origen').value;
    this.productos = [];
    let id = 0;
    this.fertilizantesService.getTipoDespachoOrigen(id_origen).subscribe(productos => {
      if (productos.data.length == 0) {
        let prod = {
          id: id.toString(),
          descripcion: "Tipo de Despacho sin configurar"
        };
        this.productos.push(prod);
      } else {
        this.selectedProducto = productos.data[0].descripcion;
        id = productos.data[0].id;
        productos.data.forEach(element => {
          let producto = new Productos();
          producto.id = element.id_producto;
          producto.descripcion = element.descripcion;
          this.productos.push(producto);
        });
      }
     //this.configPuertoForm.controls['producto'].setValue(id.toString());
      this.CambiarSemana();
    });


  }

  CambiarSemana() {
    let configBanda: Filtro = {
      "id_origen"       : this.configPuertoForm.get('id_origen').value,
      "id_tipo_despacho": this.configPuertoForm.get('id_tipo_despacho').value,
      "sem"             : this.configPuertoForm.get('semana').value
    };
    this.horarioFertilizantesService.filtros$.emit(configBanda);
    //this.aplicarFilto(configBanda);
    this.currentWeek();
  }

  anteriorsemana() {
    let semana = this.configPuertoForm.get('semana').value;

    if (semana === 'posterior') {
      this.configPuertoForm.controls['semana'].setValue('actual');
      let configBanda: Filtro = {
        "id_origen"       : this.configPuertoForm.get('id_origen').value,
        "id_tipo_despacho": this.configPuertoForm.get('id_tipo_despacho').value,
        "sem"             : 'actual'
      };
      this.horarioFertilizantesService.filtros$.emit(configBanda);
      this.aplicarFilto(configBanda);
      this.currentWeek();
    } else {
      this.configPuertoForm.controls['semana'].setValue('anterior');
      let configBanda: Filtro = {
        "id_origen"       : this.configPuertoForm.get('id_origen').value,
        "id_tipo_despacho": this.configPuertoForm.get('id_tipo_despacho').value,
        "sem"             : 'anterior'
      };
      this.horarioFertilizantesService.filtros$.emit(configBanda);
      this.aplicarFilto(configBanda);
      this.currentWeek();
    }
  }
  posteriorsemana() {
    let semana = this.configPuertoForm.get('semana').value;

    if (semana === 'anterior') {
      this.configPuertoForm.controls['semana'].setValue('actual');
      let configBanda: Filtro = {
        "id_origen"       : this.configPuertoForm.get('id_origen').value,
        "id_tipo_despacho": this.configPuertoForm.get('id_tipo_despacho').value,
        "sem"             : 'actual'
      };
      this.horarioFertilizantesService.filtros$.emit(configBanda);
      this.aplicarFilto(configBanda);
      this.currentWeek();
    } else {
      this.configPuertoForm.controls['semana'].setValue('posterior');
      let configBanda: Filtro = {
        "id_origen"       : this.configPuertoForm.get('id_origen').value,
        "id_tipo_despacho": this.configPuertoForm.get('id_tipo_despacho').value,
        "sem"             : 'posterior'
      };
      this.horarioFertilizantesService.filtros$.emit(configBanda);
      this.aplicarFilto(configBanda);
      this.currentWeek();
    }
  }


  desactivarInput() {
    let acciones = this.configPuertoForm.get('acciones').value;
    if (acciones == 1) {
      this.configPuertoForm.controls['turno_banda'].setValue(0);
      this.configPuertoForm.controls['turno_banda'].disable();
    } else {
      this.configPuertoForm.controls['turno_banda'].enable();
    }

  }

  submit() {
    this.loader.open();
    let configBanda = {
      "id_origen"       : this.configPuertoForm.get('id_origen').value,
      "id_tipo_despacho": this.configPuertoForm.get('id_tipo_despacho').value,
      "semana"          : this.configPuertoForm.get('semana').value,
      "turno_banda"     : this.configPuertoForm.get('turno_banda').value,
      "banda"           : this.configPuertoForm.get('banda').value,
      "corte"           : this.configPuertoForm.get('corte').value,
      "amp_cupo_antes"  : this.configPuertoForm.get('amp_cupo_antes').value,
      "amp_cupo_despues": this.configPuertoForm.get('amp_cupo_despues').value,
      "acciones"        : this.configPuertoForm.get('acciones').value,
      "grid"            : this.grillaSelecionada,
      "m"               : "F"
    };

    this.horarioFertilizantesService.postGrillaDestino(configBanda).subscribe(resp => {
        let filtro: Filtro = {
          "id_origen"       : this.configPuertoForm.get('id_origen').value,
          "id_tipo_despacho": this.configPuertoForm.get('id_tipo_despacho').value,
          "sem"             : this.configPuertoForm.get('semana').value
        };
      this.horarioFertilizantesService.filtros$.emit(filtro);
      this.aplicarFilto(filtro);
      this.loader.close();
    }, err => {
       this.errorService.confirm({ message: err.error.data.message }).subscribe(res => {
        if (res) {
          return;
        }
      });
    });
  }
  open() {
    const amazingTimePicker = this.atp.open({
      time: this.selectedPuerto.hora_corte,
      theme: 'dark',
      arrowStyle: {
        background: 'red',
        color: 'white'
      }
    });
    amazingTimePicker.afterClose().subscribe(time => {
      this.selectedPuerto.hora_corte = time;
      this.configPuertoForm.controls['corte'].setValue(time);
      let datafrm = this.configPuertoForm.value;
      this.horarioFertilizantesService.postConfig(datafrm).subscribe(resp => {
        if (resp) {
          let configBanda: Filtro = {
            "id_origen"       : this.configPuertoForm.get('id_origen').value,
            "id_tipo_despacho": this.configPuertoForm.get('id_tipo_despacho').value,
            "sem"             : this.configPuertoForm.get('semana').value
          };
          this.horarioFertilizantesService.filtros$.emit(configBanda);
          this.aplicarFilto(configBanda);
          this.snack.open('Configuración Actualizada!', 'OK', { duration: 4000 });
        }
      }, err => {
        this.atencionService.confirm({ message: err.error.data.message }).subscribe(res => {
          if (res) {
            let configBanda: Filtro = {
              "id_origen"       : this.configPuertoForm.get('id_origen').value,
              "id_tipo_despacho": this.configPuertoForm.get('id_tipo_despacho').value,
              "sem"             : this.configPuertoForm.get('semana').value
            };
            this.horarioFertilizantesService.filtros$.emit(configBanda);
            this.aplicarFilto(configBanda);
            return;
          }
        });
      });

    });
  }

}
