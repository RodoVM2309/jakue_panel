import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AmazingTimePickerService } from 'amazing-time-picker';

import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

//Modelos
import { Configuracion_destino, Filtro, HorarioPuerto } from 'app/shared/models/horario-puerto';
import { Puerto } from 'app/shared/models/puerto';

//Servicios
import { ProductosService } from 'app/shared/services/productos.service';
import { DestinosService } from 'app/shared/services/destinos.service';
import { HorarioPuertoService } from 'app/shared/services/horario-puerto.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { AppAtencionService } from 'app/shared/services/app-atencion/app-atencion.service';
import { CustomValidator } from 'app/shared/validation/customValidator';


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
  id_producto: string;
  descripcion: string;

}


@Component({
  selector: 'app-admin-bandas-horarias',
  templateUrl: './admin-bandas-horarias.component.html',
  styleUrls: ['./admin-bandas-horarias.component.scss']
})
export class AdminBandasHorariasComponent implements OnInit, OnDestroy {

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
  total_productos_puerto: number[] = [];
  cant_turno: number = 0;
  selectedPuerto: Puerto;
  selectedProducto: string;
  horarioPuerto: HorarioPuerto[] = [];
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

  id_destino:number;
  id_producto:number;
  constructor(private productosServices: ProductosService,
    private horarioPuertoService: HorarioPuertoService,
    private destinosService: DestinosService,
    private atp: AmazingTimePickerService,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,

  ) { }

  ngOnInit() {
    this.crearFormulario();
    this.currentWeek();
    this.subcriptionFiltro = this.horarioPuertoService.filtros$.subscribe(res => {
      this.aplicarFilto(res);
    });
  }

  ngOnDestroy(): void {
    this.subcriptionFiltro.unsubscribe();
  }

  crearFormulario() {
    this.selectedPuerto = new Puerto();
    this.selectedPuerto.hora_corte = "00:00";
    this.configPuertoForm = new FormGroup({
      id_destino: new FormControl(0, [Validators.required]),
      estado: new FormControl(0, [Validators.required]),
      corte: new FormControl(this.selectedPuerto.hora_corte, [Validators.required]),
      amp_cupo_antes: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(48), Validators.pattern('^[0-9]+')]),
      amp_cupo_despues: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(48), Validators.pattern('^[0-9]+')]),
      banda: new FormControl('', [Validators.required]),
      tolerancia_horas_antes: new FormControl('0', [Validators.required, Validators.min(0), Validators.max(48), CustomValidator.isNumberCheck]),
      tolerancia_horas_despues: new FormControl('0', [Validators.required, Validators.min(0), Validators.max(48), CustomValidator.isNumberCheck]),
      tolerancia: new FormControl('0', [Validators.required, Validators.min(0), Validators.max(48)]),
      producto: new FormControl(),
      semana: new FormControl('actual', [Validators.required]),
      turno_banda: new FormControl('0', [Validators.required, Validators.min(1), Validators.max(999)]),
      acciones: new FormControl(0),
      flat_estado: new FormControl(this.flat_estado),
    });
    this.getDestinos();
  }

  getDestinos() {
    this.destinosService.getDestinoPersona(this.solucion_muvin)
      .subscribe(pagedData => {
        if (pagedData.data) {
          pagedData.data.forEach(element => {
            let puerto = new Puerto();
            puerto.id = element.id;
            puerto.descripcion = element.descripcion;
            this.destinos.push(puerto);
          });
          this.configPuertoForm.controls['id_destino'].setValue(this.destinos[0].id);
          this.getProductoss(this.destinos[0].id);
          this.getConfigInicial();
          this.id_destino = this.destinos[0].id;
          this.id_producto = Number(this.productos[0].id_producto);
        }
      });
  }

  getConfigInicial() {
    this.horarioPuertoService.getBandaHorariasFiltro(this.destinos[0].id,this.productos[0].id_producto,'actual').subscribe(resp => {
      this.total_productos_puerto = resp.data.total_productos_puerto;
      this.total_turnos_producto = resp.data.total_turnos_producto;
      let id_destino = this.destinos[0].id;
      let id_producto = resp.data.configuracion_destino.id_producto;
      let estado = resp.data.configuracion_destino.estado;
      let corte = resp.data.configuracion_destino.corte;
      let amp_cupo_antes = resp.data.configuracion_destino.amp_cupo_antes;
      let amp_cupo_despues = resp.data.configuracion_destino.amp_cupo_despues;
      let banda = resp.data.configuracion_destino.banda;
      let tolerancia_horas_antes = resp.data.configuracion_destino.tolerancia_horas_antes;
      let tolerancia_horas_despues = resp.data.configuracion_destino.tolerancia_horas_despues;
      let tolerancia = resp.data.configuracion_destino.tolerancia;

      this.configPuertoForm.controls['id_destino'].setValue(id_destino);
      this.configPuertoForm.controls['estado'].setValue(parseInt(estado));
      this.configPuertoForm.controls['corte'].setValue(corte);
      this.configPuertoForm.controls['amp_cupo_antes'].setValue(amp_cupo_antes);
      this.configPuertoForm.controls['amp_cupo_despues'].setValue(amp_cupo_despues);
      this.configPuertoForm.controls['banda'].setValue(banda);
      this.configPuertoForm.controls['tolerancia_horas_antes'].setValue(tolerancia_horas_antes);
      this.configPuertoForm.controls['tolerancia_horas_despues'].setValue(tolerancia_horas_despues);
      this.configPuertoForm.controls['tolerancia'].setValue(tolerancia);
      //this.getProductoss(id_destino, id_producto);


    }, err => {

      this.errorService.confirm({ message: err.error.data.message }).subscribe(res => {
        if (res) {
          return;
        }
      });
    });
  }

  getProductoss(id_destino){
    this.productos = [];
    let id_producto:number
;    this.productosServices.getProductosPuerto(id_destino).subscribe(productos => {
        

      if (productos.data.length == 0) {
        id_producto = 0;
        let prod = {
          id_producto: id_producto.toString(),
          descripcion: "Productos sin configurar"
        };
        this.productos.push(prod);
      } else {
        productos.data.forEach(element => {
          let producto = new Productos();
          producto.id_producto = element.id_producto;
          producto.descripcion = element.descripcion;
          this.productos.push(producto);
        });
        this.selectedProducto = productos.data[0].descripcion;
      }

      this.configPuertoForm.controls['producto'].setValue(productos.data[0].id_producto);
      let configBanda: Filtro = {
        "id_destino": this.configPuertoForm.get('id_destino').value,
        "id_producto": this.configPuertoForm.get('producto').value,
        "sem": this.configPuertoForm.get('semana').value
      };
      this.horarioPuertoService.filtros$.emit(configBanda);
    });
  }

  getProductos(id_destino, id_producto) {
    this.productos = [];
    this.productosServices.getProductosPuerto(id_destino).subscribe(productos => {


      if (productos.data.length == 0) {
        id_producto = 0;
        let prod = {
          id_producto: id_producto.toString(),
          descripcion: "Productos sin configurar"
        };
        this.productos.push(prod);
      } else {
        productos.data.forEach(element => {
          let producto = new Productos();
          producto.id_producto = element.id_producto;
          producto.descripcion = element.descripcion;
          this.productos.push(producto);
          if (id_producto == element.id_producto) {
            this.selectedProducto = element.descripcion;
          }
        });
      }


    });
  }

  aplicarFilto(data) {
    let id_producto = data.id_producto;
    let id_destino = data.id_destino;
    let sem = data.sem;
    this.horarioPuertoService.getBandaHorariasFiltro(id_producto, id_destino, sem).subscribe(resp => {

      this.total_turnos_producto = resp.data.total_turnos_producto;
      this.total_productos_puerto = resp.data.total_productos_puerto;
      let id_destino = resp.data.configuracion_destino.id_destino;
      let id_producto = resp.data.configuracion_destino.id_producto;
      let estado = resp.data.configuracion_destino.estado;
      let corte = resp.data.configuracion_destino.corte;
      let amp_cupo_antes = resp.data.configuracion_destino.amp_cupo_antes;
      let amp_cupo_despues = resp.data.configuracion_destino.amp_cupo_despues;
      let banda = resp.data.configuracion_destino.banda;
      let tolerancia = resp.data.configuracion_destino.tolerancia;
      let tolerancia_horas_antes = resp.data.configuracion_destino.tolerancia_horas_antes;
      let tolerancia_horas_despues = resp.data.configuracion_destino.tolerancia_horas_despues;

      this.configPuertoForm.controls['id_destino'].setValue(parseInt(id_destino));
      this.configPuertoForm.controls['estado'].setValue(parseInt(estado));
      this.configPuertoForm.controls['corte'].setValue(corte);
      this.configPuertoForm.controls['amp_cupo_antes'].setValue(amp_cupo_antes);
      this.configPuertoForm.controls['amp_cupo_despues'].setValue(amp_cupo_despues);
      this.configPuertoForm.controls['banda'].setValue(banda);
      this.configPuertoForm.controls['tolerancia_horas_antes'].setValue(tolerancia_horas_antes);
      this.configPuertoForm.controls['tolerancia_horas_despues'].setValue(tolerancia_horas_despues);
      this.configPuertoForm.controls['tolerancia'].setValue(tolerancia);
      this.getProductos(id_destino, id_producto);
    });
  }

  onChange(ev: MatSelectChange) {
    this.selectedProducto = (ev.source.selected as MatOption).viewValue;  //use .value if you want to get the key of Option
    let configBanda: Filtro = {
      "id_destino": this.configPuertoForm.get('id_destino').value,
      "id_producto": this.configPuertoForm.get('producto').value,
      "sem": this.configPuertoForm.get('semana').value
    };
    this.horarioPuertoService.filtros$.emit(configBanda);
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
        this.configPuertoForm.controls['tolerancia_horas_antes'].disable();
        this.configPuertoForm.controls['tolerancia_horas_despues'].disable();
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
        this.configPuertoForm.controls['tolerancia_horas_antes'].disable();
        this.configPuertoForm.controls['tolerancia_horas_despues'].disable();
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
    let tolerancia_horas_antes = this.configPuertoForm.get('tolerancia_horas_antes').value;
    let tolerancia_horas_despues = this.configPuertoForm.get('tolerancia_horas_despues').value;

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
    if (Number(tolerancia_horas_antes) < 0 || tolerancia_horas_antes == null) {
      this.configPuertoForm.controls['tolerancia_horas_antes'].setValue(0);
    } else if (tolerancia_horas_antes > 48) {
      this.configPuertoForm.controls['tolerancia_horas_antes'].setValue(48);
    }
    if (Number(tolerancia_horas_despues) < 0 || tolerancia_horas_despues == null) {
      this.configPuertoForm.controls['tolerancia_horas_despues'].setValue(0);
    } else if (tolerancia_horas_despues > 48) {
      this.configPuertoForm.controls['tolerancia_horas_despues'].setValue(48);
    }

    let datafrm = this.configPuertoForm.getRawValue();
    //console.log(datafrm);
    this.horarioPuertoService.postConfig(datafrm).subscribe(resp => {
      //console.log(resp);
      if (resp) {
        let configBanda: Filtro = {
          "id_destino": this.configPuertoForm.get('id_destino').value,
          "id_producto": this.configPuertoForm.get('producto').value,
          "sem": this.configPuertoForm.get('semana').value
        };
        this.snack.open('Configuración Actualizada!', 'OK', { duration: 4000 });
        this.horarioPuertoService.filtros$.emit(configBanda);
       // this.aplicarFilto(configBanda);
      }
    }, err => {

      this.atencionService.confirm({ message: err.error.data.message }).subscribe(res => {
        if (res) {
          let configBanda: Filtro = {
            "id_destino": this.configPuertoForm.get('id_destino').value,
            "id_producto": this.configPuertoForm.get('producto').value,
            "sem": this.configPuertoForm.get('semana').value
          };
          this.horarioPuertoService.filtros$.emit(configBanda);
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
    let id_destino = this.configPuertoForm.get('id_destino').value;
    this.productos = [];
    let id_producto = 0;
    this.productosServices.getProductosPuerto(id_destino).subscribe(productos => {

      if (productos.data.length == 0) {
        let prod = {
          id_producto: id_producto.toString(),
          descripcion: "Productos sin configurar"
        };
        this.productos.push(prod);
      } else {
        this.selectedProducto = productos.data[0].descripcion;
        id_producto = productos.data[0].id_producto;
        productos.data.forEach(element => {
          let producto = new Productos();
          producto.id_producto = element.id_producto;
          producto.descripcion = element.descripcion;
          this.productos.push(producto);
        });
      }

      this.configPuertoForm.controls['producto'].setValue(id_producto.toString());
      this.CambiarSemana();
    });


  }

  CambiarSemana() {
    let configBanda: Filtro = {
      "id_destino": this.configPuertoForm.get('id_destino').value,
      "id_producto": this.configPuertoForm.get('producto').value,
      "sem": this.configPuertoForm.get('semana').value
    };
    this.horarioPuertoService.filtros$.emit(configBanda);
    //this.aplicarFilto(configBanda);
    this.currentWeek();
  }

  anteriorsemana() {
    let semana = this.configPuertoForm.get('semana').value;

    if (semana === 'posterior') {
      this.configPuertoForm.controls['semana'].setValue('actual');
      let configBanda: Filtro = {
        "id_destino": this.configPuertoForm.get('id_destino').value,
        "id_producto": this.configPuertoForm.get('producto').value,
        "sem": 'actual'
      };
      this.horarioPuertoService.filtros$.emit(configBanda);
      this.aplicarFilto(configBanda);
      this.currentWeek();
    } else {
      this.configPuertoForm.controls['semana'].setValue('anterior');
      let configBanda: Filtro = {
        "id_destino": this.configPuertoForm.get('id_destino').value,
        "id_producto": this.configPuertoForm.get('producto').value,
        "sem": 'anterior'
      };
      this.horarioPuertoService.filtros$.emit(configBanda);
      this.aplicarFilto(configBanda);
      this.currentWeek();
    }
  }

  posteriorsemana() {
    let semana = this.configPuertoForm.get('semana').value;

    if (semana === 'anterior') {
      this.configPuertoForm.controls['semana'].setValue('actual');
      let configBanda: Filtro = {
        "id_destino": this.configPuertoForm.get('id_destino').value,
        "id_producto": this.configPuertoForm.get('producto').value,
        "sem": 'actual'
      };
      this.horarioPuertoService.filtros$.emit(configBanda);
      this.aplicarFilto(configBanda);
      this.currentWeek();
    } else {
      this.configPuertoForm.controls['semana'].setValue('posterior');
      let configBanda: Filtro = {
        "id_destino": this.configPuertoForm.get('id_destino').value,
        "id_producto": this.configPuertoForm.get('producto').value,
        "sem": 'posterior'
      };
      this.horarioPuertoService.filtros$.emit(configBanda);
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
    // let datafrm = this.configPuertoForm.value;
    let configBanda = {
      "id_destino": this.configPuertoForm.get('id_destino').value,
      "id_producto": this.configPuertoForm.get('producto').value,
      "semana": this.configPuertoForm.get('semana').value,
      "turno_banda": this.configPuertoForm.get('turno_banda').value,
      "banda": this.configPuertoForm.get('banda').value,
      "corte": this.configPuertoForm.get('corte').value,
      "amp_cupo_antes": this.configPuertoForm.get('amp_cupo_antes').value,
      "amp_cupo_despues": this.configPuertoForm.get('amp_cupo_despues').value,
      "tolerancia_horas_antes": this.configPuertoForm.get('tolerancia_horas_antes').value,
      "tolerancia_horas_despues": this.configPuertoForm.get('tolerancia_horas_despues').value,
      "acciones": this.configPuertoForm.get('acciones').value,
      "grid": this.grillaSelecionada
    };

    this.horarioPuertoService.postGrillaDestino(configBanda).subscribe(resp => {
      let filtro: Filtro = {
        "id_destino": this.configPuertoForm.get('id_destino').value,
        "id_producto": this.configPuertoForm.get('producto').value,
        "sem": this.configPuertoForm.get('semana').value
      };
      this.horarioPuertoService.filtros$.emit(filtro);
      this.aplicarFilto(filtro);
      this.configPuertoForm.controls['turno_banda'].setValue(0);
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
      this.horarioPuertoService.postConfig(datafrm).subscribe(resp => {
        if (resp) {
          let configBanda: Filtro = {
            "id_destino": this.configPuertoForm.get('id_destino').value,
            "id_producto": this.configPuertoForm.get('producto').value,
            "sem": this.configPuertoForm.get('semana').value
          };
          this.horarioPuertoService.filtros$.emit(configBanda);
          this.aplicarFilto(configBanda);
          this.snack.open('Configuración Actualizada!', 'OK', { duration: 4000 });
        }
      }, err => {
        this.atencionService.confirm({ message: err.error.data.message }).subscribe(res => {
          if (res) {
            let configBanda: Filtro = {
              "id_destino": this.configPuertoForm.get('id_destino').value,
              "id_producto": this.configPuertoForm.get('producto').value,
              "sem": this.configPuertoForm.get('semana').value
            };
            this.horarioPuertoService.filtros$.emit(configBanda);
            this.aplicarFilto(configBanda);
            return;
          }
        });
      });

    });
  }
}
