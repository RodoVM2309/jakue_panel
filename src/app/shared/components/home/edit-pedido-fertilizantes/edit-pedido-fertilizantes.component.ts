import { Component, OnInit, ViewChild, Inject, OnDestroy, ElementRef, ViewChildren, QueryList } from '@angular/core';
import {
  MatTableDataSource,
  MatDialogRef, MatDialog,
  MatProgressBar,
  MatButton,
  MatSelect,
  MatSnackBar,
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_DIALOG_DATA
} from '@angular/material';
import { MatOption } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';

import { AppDateAdapter, APP_DATE_FORMATS } from 'app/shared/helpers/date.adapter';
import { Router, ActivatedRoute } from '@angular/router';

import { Validators, FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { delay, distinct } from 'rxjs/operators';
import * as XLSX from "xlsx";
import { egretAnimations } from "../../../animations/egret-animations";
import { DatePipe } from '@angular/common';

//Servicios
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { FertilizantesService } from 'app/shared/services/fertilizantes.service';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { AppAtencionService } from 'app/shared/services/app-atencion/app-atencion.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { OrigenesService } from 'app/shared/services/origenes.service';
import { MessageService } from 'app/shared/services/message.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';


//Modelos
import { Persona, Origenes } from '@app/shared/models/fertilizantes.model';
import { Origen } from '../../../models/origen';

//Componentes propios
import { AddOrigenComponent } from '../add-origen/add-origen.component';
import { GlobalService } from 'app/shared/models/global.service';
import { ListaChoferComponent } from '../add-pedido-fertilizantes/lista-chofer/lista-chofer.component';

@Component({
  selector: 'app-edit-pedido-fertilizantes',
  templateUrl: './edit-pedido-fertilizantes.component.html',
  styleUrls: ['./edit-pedido-fertilizantes.component.scss'],
  animations: egretAnimations,
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'es-ES'
    },
    DatePipe
  ]
})
export class EditPedidoFertilizantesComponent implements OnInit, OnDestroy {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;

  @ViewChildren("btn_asingarChofer") btn_asingarChofer: QueryList<ElementRef>;
  @ViewChildren("nombre_chofer") nombre_chofer: QueryList<ElementRef>;
  @ViewChildren("patente") patente: QueryList<ElementRef>;

  subcriptionInfoChofer: Subscription;
  arrayBuffer: any;
  file: File;
  btn_asignar_chofer = false;
  formData = {}
  addPedidoForm: FormGroup;
  origenes: Origenes[] = [];
  filteredOptions: Observable<Origen[]>;
  personasRolFetilizantes: Persona[] = [];
  posicionProductos = new Array();
  tiposDespacho = new Array();
  filtroTipo = new Array();
  nombreBtnChofer = new Array();
  mostrarDatosChofer = new Array();
  cantidadTn = new Array();
  prod_proterra: number = 117;
  now = new Date();
  tomorrow = new Date(this.now);
  showUrl = "";
  error_carga = new Array();
  contrataProveedor = "";

  solicitante_a: number;
  eliminar_reservas = [];

  pedido: any;
  editable: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public dialogLocaRef: MatDialogRef<EditPedidoFertilizantesComponent>,
    private errorService: AppErrorService,
    private messageService: MessageService,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    private atencionService: AppAtencionService,
    private fertilizantesService: FertilizantesService,
    private nomencladoresService: NomencladoresService,
    private origenesService: OrigenesService,
    private globalService: GlobalService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    console.log(this.data.payload);
    this.pedido = this.data.payload[0];
    this.editable = this.data.editable;

    this.buildItemForm();
    this.cargaInicial();

    this.addPedidoForm.get("contrata").valueChanges.subscribe(contrata => {
      let datos_chofer = (<FormArray>(<FormArray>this.addPedidoForm.get('camiones')));
      if (contrata) {
        this.btn_asignar_chofer = true;
        datos_chofer['controls'].forEach((element, index) => {
          this.mostrarDatosChofer[index] = false;
          element['controls']['id_chofer'].setValue('');
        });

        this.pedido.reservas.forEach(reserva => {
          reserva.id_chofer = null;
        });

        this.nombre_chofer.forEach((item, index) => {
          item.nativeElement.textContent = '';
          this.nombreBtnChofer[index] = "ASIGNAR CHOFER";
        });
        this.patente.forEach((item) => {
          item.nativeElement.textContent = '';
        });

      } else {
        this.btn_asignar_chofer = false;
      }
    });

    this.subcriptionInfoChofer = this.fertilizantesService.infoChofer$.subscribe(infoChofer => {
      this.asignarChofer(infoChofer);
    });
  }

  buildItemForm() {
    this.addPedidoForm = this.fb.group({
      id: [''],
      m: ['F'],
      id_cliente: [{ value: '', disabled: !this.editable }, Validators.required], // Son los centros con rol 15 -> FERTILIZANTES, rev1 hardcode
      solicitante: [{ value: '', disabled: !this.editable }, Validators.required],
      id_origen: [{ value: '', disabled: !this.editable }, Validators.required],  // Son los origenes del rol 15
      id_destino: ['', Validators.required],  // Son los destinos del centro logueado
      contrata: [{ value: false, disabled: !this.editable }],
      observaciones: [{ value: '', disabled: !this.editable }],
      eliminar_reservas: [this.eliminar_reservas],
      camiones: this.fb.array([])
    });

    this.addPedidoForm.controls['solicitante'].setValue(this.pedido.solicitante);
    this.addPedidoForm.controls['contrata'].setValue((parseInt(this.pedido.contrata) == 1) ? true : false);
    this.addPedidoForm.controls['observaciones'].setValue(this.pedido.observaciones);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
  }

  addCamionFormGroup(): FormGroup {
    return this.fb.group({
      id: [null],
      fecha_pedido: [this.tomorrow, [Validators.required]],
      id_chofer: [''],
      stoc: ['', Validators.maxLength(25)],
      cupo: [false],
      eliminar_productos: [[]],
      productos: this.fb.array([
        this.addProductoFormGroup(45)
      ])
    });
  }

  addProductoFormGroup(total): FormGroup {
    return this.fb.group({
      id: [null],
      id_tipo_despacho: ['', [Validators.required]],
      contrato: ['', [Validators.maxLength(12)]], // minLengthArray(12)
      id_producto: ['', [Validators.required]],
      composicion: [{ value: '', disabled: true },],
      cantidad: ['', [Validators.required, Validators.min(1), Validators.max(total)]],
    });
  }

  cargaInicial() {
    this.loader.open();
    this.fertilizantesService.getSolicitante().subscribe(resp => {
      this.personasRolFetilizantes = resp;
      this.contrataProveedor = resp[0].razon_social;
      localStorage.setItem('id_proveedor', resp[0].id);
      this.addPedidoForm.controls['id_cliente'].setValue(parseInt(this.pedido.id_solicitar));
      this.addPedidoForm.controls['id'].setValue(parseInt(this.pedido.id));
      this.addPedidoForm.controls['eliminar_reservas'].setValue(this.eliminar_reservas);

      // Para los origenes
      this.origenes = [];
      this.solicitante_a = parseInt(localStorage.getItem('id_proveedor'));

      this.fertilizantesService.getOrigenes(this.solicitante_a).subscribe(resp => {
        this.origenes = resp.data;
        this.addPedidoForm.controls['id_origen'].setValue(parseInt(this.pedido.id_origen));
      });

      // Para los destinos
      this.nomencladoresService.getAllOrigenesSelect()
        .subscribe(data => {
          this.filteredOptions = data.data;
          this.addPedidoForm.controls['id_destino'].setValue(parseInt(this.pedido.id_destino));
        });

      // para los camiones
      let camionesForm = this.addPedidoForm.get('camiones') as FormArray;
      let reservas = this.pedido.reservas;

      this.fertilizantesService.getTipoDespacho().subscribe(tipodesp => {
        this.fertilizantesService.getProductos().subscribe(product => {

          const recorreReservas = new Promise<void>((resolve, reject) => {
            reservas.forEach((reserva, index, array) => {

              let productos = [];

              console.log(reserva);


              const recorreProductos = new Promise<void>((resolve, reject) => {
                reserva.productos.forEach((prod, index1, array1) => {
                  let producto = this.fb.group({
                    id: [parseInt(prod.id)],
                    id_tipo_despacho: [{ value: parseInt(prod.id_tipo_despacho), disabled: (reserva.cupo != null) ? true : false }, [Validators.required]],
                    contrato: [{ value: prod.contrato, disabled: (reserva.cupo != null) ? true : false }, (this.prod_proterra === prod.id_producto) ? [Validators.required, Validators.maxLength(12)] : [Validators.maxLength(12)]],
                    id_producto: [{ value: parseInt(prod.id_producto), disabled: (reserva.cupo != null) ? true : false }, [Validators.required]],
                    composicion: [{
                      value: (this.prod_proterra === prod.id_producto) ? prod.composicion : '',
                      disabled: (this.prod_proterra === prod.id_producto || reserva.cupo != null) ? true : false,
                    }, [(this.prod_proterra === prod.id_producto) ? Validators.required : Validators.max(60)]],
                    cantidad: [{ value: prod.cantidad, disabled: (reserva.cupo != null) ? true : false }, [Validators.required, Validators.min(0), Validators.max(45)]],
                  });

                  productos.push(producto);
                  if (index1 === array1.length - 1) resolve();
                });
              });

              recorreProductos.then(() => {
                let camion = this.fb.group({
                  id: [parseInt(reserva.id_reserva_real)],
                  fecha_pedido: [{ value: new Date(reserva.fecha_pedido + "T03:00:00.000Z"), disabled: (reserva.cupo != null) ? true : false }, [Validators.required]],
                  id_chofer: [parseInt(reserva.id_chofer)],
                  stoc: [{ value: reserva.stoc, disabled: (reserva.cupo != null) ? true : false }, [Validators.maxLength(25)]],
                  cupo: [(reserva.cupo != null) ? true : false],
                  eliminar_productos: [[]],
                  productos: this.fb.array(productos)
                });

                camionesForm.push(camion);
                this.mostrarDatosChofer.push(false);

                this.tiposDespacho.push(tipodesp.data);
                this.posicionProductos.push(product.data);
              });

              if (index === array.length - 1) resolve();
            });
          });

          recorreReservas.then(() => {
            setTimeout(() => this.initChoferes(), 1000);
          });

        });
      });
    });
  }

  initChoferes() {
    this.loader.close();

    let index = 0;
    this.nombre_chofer.forEach((item, i) => {
      item.nativeElement.textContent = '';
      this.nombreBtnChofer[i] = "ASIGNAR CHOFER";
    });

    this.pedido.reservas.forEach(reserva => {
      if (reserva.id_chofer != null) {
        this.mostrarDatosChofer[index] = true;
        this.nombre_chofer.forEach((item, i) => {
          if (i === index) {
            item.nativeElement.textContent = reserva.chofer.toUpperCase();
            this.nombreBtnChofer[index] = "CAMBIAR CHOFER";
          }
        });
      }
      index++;
    });

    this.patente.forEach((item) => {
      item.nativeElement.textContent = '';
    });

    let index2 = 0;
    this.patente.forEach((item) => {
      item.nativeElement.textContent = '';
    });

    this.pedido.reservas.forEach(reserva => {
      if (reserva.id_chofer != null) {
        this.patente.forEach((item, i) => {
          if (i === index2) {
            item.nativeElement.textContent = reserva.patente_camion + ' / ' + reserva.patente_acoplado;
          }
        });
      }
      index2++;
    });
  }

  ngOnDestroy(): void {
    this.subcriptionInfoChofer.unsubscribe();
  }

  get camionesArray() {
    return <FormArray>this.addPedidoForm.get('camiones');
  }

  itemProductos(index: number) {
    return (<FormArray>(<FormArray>this.addPedidoForm.controls.camiones)
      .controls[index].get('productos')).controls;
  }
  getTipoDespacho(index) {
    this.fertilizantesService.getTipoDespacho().subscribe(resp => {
      this.tiposDespacho[index] = resp.data;
    });
  }


  getProductos() {
    this.fertilizantesService.getProductos().subscribe(resp => {
      this.posicionProductos[0] = resp.data;
    });
  }

  onChangeSolicitar_a(ev: MatSelectChange) {
    this.contrataProveedor = (ev.source.selected as MatOption).viewValue;
  }

  observarCambios(index: number, j: number, item: FormGroup) {
    if (item.controls.id_producto.value === this.prod_proterra) {
      // Ajusto los valores y validaciones para contrato
      (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
        .at(index).get('productos')).at(j)).controls['contrato'].setValidators(Validators.required);
      (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
        .at(index).get('productos')).at(j)).controls['contrato'].updateValueAndValidity();

      // Ajusto los valores y validaciones para el imput de composicion
      (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
        .at(index).get('productos')).at(j)).get('composicion').enable();

      (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
        .at(index).get('productos')).at(j)).controls['composicion'].setValidators(Validators.required);

      (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
        .at(index).get('productos')).at(j)).controls['composicion'].updateValueAndValidity();
    } else {
      // Ajusto los valores y validaciones para el imput de composicion
      (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
        .at(index).get('productos')).at(j)).controls['composicion'].setValue('');

      (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
        .at(index).get('productos')).at(j)).controls['composicion'].setValidators();

      (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
        .at(index).get('productos')).at(j)).get('composicion').disable();

      (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
        .at(index).get('productos')).at(j)).controls['composicion'].updateValueAndValidity();

      // Ajusto los valores y validaciones para contrato
      (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
        .at(index).get('productos')).at(j)).controls['contrato'].setValidators(Validators.maxLength(12));

      (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
        .at(index).get('productos')).at(j)).controls['contrato'].updateValueAndValidity();

    }
  }

  openPopAgregarOrigen() {
    let title = "Agregar Destino";
    let ubicacion_map = 'Localice el Destino en el mapa';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddOrigenComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, ubicacion_map, payload: {}, isNew: true }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.loader.open();
      res.telefono = res.telefono.toString();
      this.origenesService.postOrigen(res).subscribe(
        data => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.getDestino();
          this.alertService
            .confirm({ message: "¡Destino agregado correctamente!", tipo: "exito" })
            .subscribe(res => {
              if (res) {
                return;
              }
            });
        },
        err => {
          this.loader.close();
          this.atencionService.confirm({ message: err.data.message[0].errors })
            .subscribe(res => {
              if (res) {
                return;
              }
            });
        }
      );
    });
  }

  getDestino() {
    this.nomencladoresService.getAllOrigenesSelect()
      .subscribe(data => {
        this.filteredOptions = data.data;
      });
  }


  duplicarCamion(index: number, item: FormGroup) {
    this.nombreBtnChofer[this.posicionProductos.length] = "ASIGNAR CHOFER";
    this.mostrarDatosChofer[this.posicionProductos.length] = false;
    this.fertilizantesService.getTipoDespacho().subscribe(resp => {
      this.filtroTipo.push(this.filtroTipo[index]);
      let ultima = (<FormArray>(<FormArray>this.addPedidoForm.controls.camiones).controls[index].get('productos')).controls;
      if (ultima.length == 1) {
        this.tiposDespacho[this.posicionProductos.length] = resp.data;
      } else {
        this.tiposDespacho[this.posicionProductos.length] = resp.data.filter(filtro => filtro.forma === this.filtroTipo[this.filtroTipo.length - 1]);
      }

      let camiones = this.addPedidoForm.get('camiones') as FormArray;
      let camion = this.fb.group({
        id: [null],
        fecha_pedido: [item.controls.fecha_pedido.value, [Validators.required]],
        id_chofer: [''],
        stoc: [item.controls.stoc.value, [Validators.maxLength(25)]],
        cupo: [false],
        productos: this.fb.array(item.controls.productos['controls'].map(item => {
          return this.fb.group({
            id_tipo_despacho: [item.value.id_tipo_despacho, [Validators.required]],
            contrato: [item.value.contrato, [Validators.maxLength(12)]], //minLengthArray(12)
            id_producto: [item.value.id_producto, [Validators.required]],
            composicion: [{
              value: item.value.composicion,
              disabled: (item.value.id_producto === this.prod_proterra) ? false : true
            }],
            cantidad: [item.value.cantidad, [Validators.required, Validators.min(0), Validators.max(45)]],
          });
        }))
      });
      let productoArr = (<FormArray>(<FormArray>this.addPedidoForm.controls.camiones).controls[index]
        .get('productos')).controls;

      /* cantidad */
      let total = 0;
      productoArr.forEach(element => {
        total += element['controls']['cantidad'].value;
      });
      this.cantidadTn[this.posicionProductos.length] = total;

      /*Lleno el formulario clonado*/
      camiones.push(camion);
      this.posicionProductos[this.posicionProductos.length] = [...this.posicionProductos[index]];
    });
  }

  agregarNewCamion(index: number) {
    this.nombreBtnChofer[this.posicionProductos.length] = "ASIGNAR CHOFER";
    this.mostrarDatosChofer[this.posicionProductos.length] = false;
    this.fertilizantesService.getTipoDespacho().subscribe(resp => {
      this.tiposDespacho[this.posicionProductos.length] = resp.data;
      let camiones = this.addPedidoForm.get('camiones') as FormArray;
      let camion = this.addCamionFormGroup();
      camiones.push(camion);
      this.posicionProductos[this.posicionProductos.length] = [...this.posicionProductos[index]];
      this.cantidadTn[this.posicionProductos.length] = 0;
    });
  }

  eliminarCamion(index: number, item) {
    const id_reserva = item.controls.id.value;
    if (id_reserva != null) {
      this.eliminar_reservas.push(id_reserva);
    }

    this.camionesArray.removeAt(index);
    this.filtroTipo.splice(index, 1);
    this.tiposDespacho.splice(index, 1);
    this.posicionProductos.splice(index, 1);
    this.cantidadTn.splice(index, 1);
  }

  obtenerProductos(index: number, j: number, item: FormGroup) {
    /* let id = item['controls']['id_tipo_despacho']['value'];
    this.fertilizantesService.getProductos().subscribe(resp => {
      this.posicionProductos[index].splice(j, 1, [...resp.data]);
    }); */
    // Ajusto los valores y validaciones para el imput de composicion
    (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
      .at(index).get('productos')).at(j)).controls['composicion'].setValue('');

    (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
      .at(index).get('productos')).at(j)).controls['composicion'].setValidators();

    (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
      .at(index).get('productos')).at(j)).get('composicion').disable();

    (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
      .at(index).get('productos')).at(j)).controls['composicion'].updateValueAndValidity();

    // Ajusto los valores y validaciones para contrato
    (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
      .at(index).get('productos')).at(j)).controls['contrato'].setValidators(Validators.maxLength(12));

    (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
      .at(index).get('productos')).at(j)).controls['contrato'].updateValueAndValidity();
  }

  agregarProducto(index: number, j: number) {
    this.fertilizantesService.getTipoDespacho().subscribe(resp => {
      if (this.filtroTipo[index]) {
        this.tiposDespacho[index] = resp.data.filter(filtro => filtro.forma === this.filtroTipo[index]);
      } else {
        this.tiposDespacho[index] = resp.data;
      }
    });

    /* cantidad */
    let productoArr = (<FormArray>(<FormArray>this.addPedidoForm.controls.camiones).controls[index].get('productos')).controls;
    let total = 0;
    productoArr.forEach(element => {
      total += element['controls']['cantidad'].value;
    });
    this.cantidadTn[index] = total;

    /* armo el formulario de productos */
    let producto = this.addProductoFormGroup(45 - total);
    (<FormArray>(<FormArray>this.addPedidoForm.get('camiones')).at(index).get('productos')).push(producto);
  }

  eliminarProducto(index: number, j: number, item: FormGroup) {
    // Busco el producto a eliminar y lo agrego al array de productos a eliminar de este camion
    const producto = (<FormArray>(<FormArray>this.addPedidoForm.get('camiones')).at(index).get('productos')).at(j);
    const id_producto = producto['controls'].id.value;
    if (id_producto != null) {
      (<FormArray>(<FormArray>this.addPedidoForm.get('camiones')).at(index).get('eliminar_productos')).value.push(id_producto);
    }

    // Elimino la propiedad de form builder de producto
    (<FormArray>(<FormArray>this.addPedidoForm.get('camiones')).at(index).get('productos')).removeAt(j);

    // Elimino la posicion en el array de productos
    this.posicionProductos[index].splice(j, 1);

    /* cantidad */
    let productoArr = (<FormArray>(<FormArray>this.addPedidoForm.controls.camiones).controls[index].get('productos')).controls;

    let total = 0;
    let tipo_selected;

    productoArr.forEach(element => {
      tipo_selected = element['controls']['id_tipo_despacho'].value;
      total += element['controls']['cantidad'].value;
    });

    this.cantidadTn[index] = total;

    if (productoArr.length == 1) {
      this.filtroTipo.splice(index, 1);

      this.fertilizantesService.getTipoDespacho().subscribe(resp => {
        this.tiposDespacho[index] = [...resp.data];

        let filterTipo = this.tiposDespacho[index].filter(filtro => filtro.id === tipo_selected);
        this.filtroTipo[index] = filterTipo[0]['forma'];
      });
    }
  }

  onChange(index, event) {
    let filterTipo = this.tiposDespacho[index].filter(filtro => filtro.id === event);
    this.filtroTipo[index] = filterTipo[0]['forma'];
  }

  onChangeCantidad(index: number, j: number) {
    let productoArr = (<FormArray>(<FormArray>this.addPedidoForm.controls.camiones).controls[index].get('productos')).controls;

    /* cantidad */
    let total = 0;
    productoArr.forEach(element => {
      total += element['controls']['cantidad'].value;
    });
    this.cantidadTn[index] = total;
  }

  gotoHome() {
    this.dialogLocaRef.close();
  }

  openPopListadoChofer(index: number) {
    let title = 'ASIGNAR CHOFER';

    let dialogRef: MatDialogRef<any> = this.dialog.open(ListaChoferComponent, {
      width: '90%',
      height: '90%',
      disableClose: true,
      data: { title: title, payload: { index: index }, isNew: true }
    });
  }

  asignarChofer(info: any) {
    this.nombre_chofer.forEach((item, index) => {
      if (index === info.index) {
        (<FormArray>(<FormArray>this.addPedidoForm.get('camiones')).at(index)).controls['id_chofer'].setValue(parseInt(info.id));
        item.nativeElement.textContent = info.nombre_persona.toUpperCase();
        this.nombreBtnChofer[info.index] = "CAMBIAR CHOFER";
      }
    });
    this.mostrarDatosChofer[info.index] = true;
    this.patente.forEach((item, index) => {
      if (index === info.index) {
        let patente = (info.patente) ? info.patente.toUpperCase() : 'XXXXXX';
        let acoplado = (info.patente_acoplado) ? info.patente_acoplado.toUpperCase() : 'XXXXXX';
        item.nativeElement.textContent = patente + ' / ' + acoplado;
      }
    });
  }


  eventHandler(event) {
    //console.log("KEY", event);
  }



  importarXcl(event) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();

    fileReader.onload = async (e) => {
      this.loader.open();
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      this.camionesArray.removeAt(0);
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: 'binary', cellDates: true, dateNF: 'dd/mm/yyyy;@' });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      let info = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      let camiones = new Array();

      //Recorro la  info para detactar la cantidad de camiones
      info.forEach((element) => {
        if (camiones[element['carga'] - 1] === undefined) {
          let productos = new Array();
          productos.push(element);
          camiones[element['carga'] - 1] = productos;
        } else {
          let prod = camiones[element['carga'] - 1];
          prod.push(element);
          camiones.splice(element['carga'] - 1, 1, prod);
        }
      });

      /* Armo los camiones  */
      for (const camion_imp of camiones) {
        // index = a.findIndex(x => _.isEqual(x, find)); // Otra forma de utilizar
        // let index = a.findIndex(x => x.LastName === "Skeet"); // Otra forma de utilizar comparando un campo individual
        // console.log(camion_imp);
        let index = camiones.findIndex(x => x === camion_imp);
        this.nombreBtnChofer[index + 1] = "ASIGNAR CHOFER";
        this.mostrarDatosChofer[index + 1] = false;

        const tipos = await this.fertilizantesService.getTipoDespacho().toPromise();
        this.tiposDespacho[index] = tipos['data'];

        let camionesForm = this.addPedidoForm.get('camiones') as FormArray;

        let id_chofer = '';

        if (camion_imp[0].cuit_chofer) {
          const datoschofer = await this.fertilizantesService.getDatosChofer(camion_imp[0].cuit_chofer).toPromise();
          if (datoschofer) {
            id_chofer = datoschofer.id;
          }
        }

        let cant = 0;

        let filterForma;

        let indexForma;
        let prodEliminado = 0;

        let productos: any[] = await Promise.all(camion_imp.map(async (item): Promise<any> => {
          /* Muestro la info de cada fila por camion */

          let j = camion_imp.findIndex(x => x === item);

          let tipo_despacho = item.tipo_despacho.replace('_', ' ');

          if (filterForma === undefined) {

            cant += item.cantidad;

            indexForma = this.tiposDespacho[index].findIndex(tipo => tipo.descripcion === tipo_despacho);

            filterForma = this.tiposDespacho[index][index].forma;

            let data = {
              "tipo_despacho": item.tipo_despacho,
              "producto": item.producto
            };

            const infoproducto = await this.fertilizantesService.getValidarDatosImportados(data).toPromise();

            if (infoproducto) {
              let getprod = await this.fertilizantesService.getProductos().toPromise();

              if (this.posicionProductos[index]) {
                let arraytemp = this.posicionProductos[index];
                arraytemp[j] = getprod['data'];
                this.posicionProductos.splice(index, 1, [...arraytemp]);
              }

              return this.fb.group({
                id_tipo_despacho: [parseInt(infoproducto.id_tipo_despacho), [Validators.required]],
                contrato: [item.contrato, (this.prod_proterra === infoproducto.id_producto) ? [Validators.required, Validators.maxLength(12)] : [Validators.maxLength(12)]],
                id_producto: [parseInt(infoproducto.id_producto), [Validators.required]],
                composicion: [{
                  value: (this.prod_proterra === infoproducto.id_producto) ? item.composicion : '',
                  disabled: (this.prod_proterra === infoproducto.id_producto) ? false : true,
                }, [(this.prod_proterra === infoproducto.id_producto) ? Validators.required : Validators.max(60)]],
                cantidad: [item.cantidad, [Validators.required, Validators.min(0), Validators.max(45), Validators.pattern('^[0-9]+')]],
              });

            } else {
              if (this.error_carga[index]) {
                let errores = this.error_carga[index];
                errores.push({
                  'tipo_despacho': item.tipo_despacho,
                  'producto': item.producto,
                  'camion': index + 1
                });
                this.error_carga.splice(index, 1, [...errores]);
              } else {
                let temp = new Array();
                temp.push({
                  'tipo_despacho': item.tipo_despacho,
                  'producto': item.producto,
                  'camion': index + 1
                });
                this.error_carga[index] = temp;
              }
              return null;
            }
          } else {

            indexForma = this.tiposDespacho[index].findIndex(tipo => tipo.descripcion === tipo_despacho);

            let tempForma = this.tiposDespacho[index][indexForma].forma;

            if (filterForma == tempForma) {
              cant += item.cantidad;

              let data = {
                "tipo_despacho": item.tipo_despacho,
                "producto": item.producto
              };

              const infoproducto = await this.fertilizantesService.getValidarDatosImportados(data).toPromise();

              if (infoproducto) {
                let getprod = await this.fertilizantesService.getProductos().toPromise();
                // Elimino la posicion del producto eliminado
                let indexProducto = j - prodEliminado;

                if (this.posicionProductos[index]) {
                  let arraytemp = this.posicionProductos[index];
                  arraytemp[indexProducto] = getprod['data'];

                  this.posicionProductos.splice(index, 1, [...arraytemp]);
                }

                return this.fb.group({
                  id_tipo_despacho: [parseInt(infoproducto.id_tipo_despacho), [Validators.required]],
                  contrato: [item.contrato, (this.prod_proterra === infoproducto.id_producto) ? [Validators.required, Validators.maxLength(12)] : [Validators.maxLength(12)]],
                  id_producto: [parseInt(infoproducto.id_producto), [Validators.required]],
                  composicion: [{
                    value: (this.prod_proterra === infoproducto.id_producto) ? item.composicion : '',
                    disabled: (this.prod_proterra === infoproducto.id_producto) ? false : true,
                  }, [(this.prod_proterra === infoproducto.id_producto) ? Validators.required : Validators.max(60)]],
                  cantidad: [item.cantidad, [Validators.required, Validators.min(0), Validators.max(45), Validators.pattern('^[0-9]+')]],
                });

              } else {
                if (this.error_carga[index]) {
                  let errores = this.error_carga[index];
                  errores.push({
                    'tipo_despacho': item.tipo_despacho,
                    'producto': item.producto,
                    'camion': index + 1
                  });
                  this.error_carga.splice(index, 1, [...errores]);
                } else {
                  let temp = new Array();
                  temp.push({
                    'tipo_despacho': item.tipo_despacho,
                    'producto': item.producto,
                    'camion': index + 1
                  });
                  this.error_carga[index] = temp;
                }
                return null;
              }
            } else {
              prodEliminado += 1;
              if (this.error_carga[index]) {
                let errores = this.error_carga[index];
                errores.push({
                  'tipo_despacho': item.tipo_despacho,
                  'producto': item.producto,
                  'camion': index + 1
                });
                this.error_carga.splice(index, 1, [...errores]);
              } else {
                let temp = new Array();
                temp.push({
                  'tipo_despacho': item.tipo_despacho,
                  'producto': item.producto,
                  'camion': index + 1
                });
                this.error_carga[index] = temp;
              }
            }
          }
        }));

        let tempTiposDespacho = this.tiposDespacho[index].filter(filtro => filtro.forma === filterForma);

        this.tiposDespacho.splice(index, 1, tempTiposDespacho);

        this.filtroTipo[index] = filterForma;
        this.cantidadTn[index] = cant;

        let filtered_prod = productos.filter(function (item) {
          return item != null;
        });

        if (filtered_prod.length == 0) {
          filtered_prod.push(this.addProductoFormGroup(45));
        }

        let st_oc = (camion_imp[0].stoc) ? camion_imp[0].stoc : '';
        let camion = this.fb.group({
          fecha_pedido: [camion_imp[0].fecha, [Validators.required]],
          id_chofer: [id_chofer],
          stoc: [st_oc, [Validators.maxLength(25)]],
          productos: this.fb.array(filtered_prod)
        });

        // /*Lleno el formulario clonado*/
        camionesForm.push(camion);
        this.posicionProductos[this.posicionProductos.length] = new Array();

        let nombre_persona = '';
        let patente = '';
        let patente_acoplado = '';

        if (camion_imp[0].cuit_chofer) {
          const datoschofer = await this.fertilizantesService.getDatosChofer(camion_imp[0].cuit_chofer).toPromise();
          //console.log(datoschofer);
          if (datoschofer) {
            nombre_persona = datoschofer.nombre_persona;
            patente = (datoschofer.patente) ? datoschofer.patente.toUpperCase() : 'XXXXXX';
            patente_acoplado = (datoschofer.acoplado_pantente) ? datoschofer.acoplado_pantente.toUpperCase() : 'XXXXXX';

            this.nombre_chofer.forEach((item, i) => {
              if (i === index) {
                item.nativeElement.textContent = nombre_persona.toUpperCase();
                this.nombreBtnChofer[index] = "CAMBIAR CHOFER";
              }
            });
            this.mostrarDatosChofer[index] = true;
            this.patente.forEach((item, i) => {
              if (i === index) {
                item.nativeElement.textContent = patente + ' / ' + patente_acoplado;
              }
            });
          }
        }

        filterForma = undefined;
      }

      this.cantidadTn.forEach((element) => {
        //console.log(element);
        if (element > 45) {
          this.addPedidoForm.setErrors({ 'invalid': true });
        }
      });

      this.loader.close();

      let resp = ' Debe Revisar las siguientes reservas: <br>';


      if (this.error_carga.length > 0) {
        this.error_carga.forEach((camion, index) => {
          //resp += ` Cantidad de errores  <strong> ${this.error_carga[index].length} </strong> <br>`;
          camion.forEach(element => {
            resp += ` Reserva ` + element['camion'] + ` -> ` + element['producto'] + ` -> ` + element['tipo_despacho'] + `<br>`;
          });
        });

        this.atencionService.confirm({ message: resp })
          .subscribe(res => {
            if (res) {
              return;
            }
          });
      }

      if (this.posicionProductos.length > 0) {
        this.posicionProductos.pop();
      }

    }

    fileReader.readAsArrayBuffer(this.file);

  }



  descargarArchivo() {
    //console.log("Ruta", this.showUrl);
    window.open(this.showUrl, "_blank");
  }



  submit() {
    this.cantidadTn.forEach((element) => {
      if (element > 45) {
        this.addPedidoForm.setErrors({ 'invalid': true });
      }
    });

    if (this.addPedidoForm.invalid) {
      return Object.values(this.addPedidoForm.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      })
    } else {
      this.loader.open();
      this.fertilizantesService.updatePedidoFertilizantes(this.addPedidoForm.getRawValue()).subscribe(resp => {
        this.loader.close();
        this.alertService
          .confirm({
            message: "¡Pedido agregado correctamente!",
            tipo: "exito"
          });
        localStorage.removeItem('id_proveedor');
        this.dialogLocaRef.close();
      }, err => {
        this.loader.close();
        this.errorService.confirm({ message: err.error }).subscribe(res => {
          if (res) {
            return;
          }
        });
      });
    }
  }
}
