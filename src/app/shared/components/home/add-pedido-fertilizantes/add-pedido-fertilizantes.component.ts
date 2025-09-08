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
import { distinct } from 'rxjs/operators';
import * as XLSX from "xlsx";
import { egretAnimations } from "../../../animations/egret-animations";
import * as moment from 'moment';
//Servicios
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { FertilizantesService } from 'app/shared/services/fertilizantes.service';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { AppAtencionService } from 'app/shared/services/app-atencion/app-atencion.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { OrigenesService } from 'app/shared/services/origenes.service';
import { MessageService } from 'app/shared/services/message.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';

//import { AppAtencionService } from 'app/shared/services/app-atencion';
import { PersonasService } from "app/shared/services/personas.service";
import { ReservasService } from "app/shared/services/reservas.service";

//Modelos
import { Persona, Origenes } from '@app/shared/models/fertilizantes.model';
import { Origen } from '../../../models/origen';

//Componentes propios
import { AddOrigenComponent } from '../add-origen/add-origen.component';
import { GlobalService } from 'app/shared/models/global.service';
import { ListaChoferComponent } from './lista-chofer/lista-chofer.component';
import { I } from '@angular/cdk/keycodes';
import { C } from '@angular/core/src/render3';
import { AddPedidoMasivoComponent } from '../add-pedido-masivo/add-pedido-masivo.component';

const prod_proterra: number = 2;
const prod_mezcla: number = 4;


@Component({
  selector: 'app-add-pedido-fertilizantes',
  templateUrl: './add-pedido-fertilizantes.component.html',
  styleUrls: ['./add-pedido-fertilizantes.component.scss'],
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
    }
  ]
})
export class AddPedidoFertilizantesComponent implements OnInit, OnDestroy {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;

  @ViewChildren("btn_asingarChofer") btn_asingarChofer: QueryList<ElementRef>;
  @ViewChildren("nombre_chofer") nombre_chofer: QueryList<ElementRef>;
  @ViewChildren("patente") patente: QueryList<ElementRef>;

  subcriptionInfoChofer: Subscription;
  arrayBuffer: any;
  file: File;
  //btn_asignar_chofer: boolean = false;
  btn_asignar_chofer: boolean[] = new Array().fill(false);
  formData = {}
  addPedidoForm: FormGroup;
  origenes: Origenes[] = [];
  filteredOptions: Observable<Origen[]>;
  personasRolFetilizantes: Persona[] = [];
  posicionProductos = new Array();
  productosMezcla = new Array();
  tiposDespacho = new Array();
  filtroTipo = new Array();
  nombreBtnChofer = new Array();
  mostrarDatosChofer = new Array();
  cantidadTn = new Array();
  now = new Date();
  tomorrow = new Date(this.now);
  showUrl = "";
  error_carga = new Array();
  contrataProveedor = "";
  destinos = new Array();

  solicitante_a: number;
  cantMezclas: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public dialogLocaRef: MatDialogRef<AddPedidoFertilizantesComponent>,
    private errorService: AppErrorService,
    private messageService: MessageService,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    private atencionService: AppAtencionService,
    private fertilizantesService: FertilizantesService,
    private nomencladoresService: NomencladoresService,
    private origenesService: OrigenesService,
    private globalService: GlobalService,
    public personasService: PersonasService,
    public reservasService: ReservasService,

  ) {
    this.posicionProductos[0] = new Array();
    this.productosMezcla[0] = new Array();
    this.tiposDespacho[0] = new Array();
    this.cantidadTn[0] = 0;
    this.nombreBtnChofer[0] = "ASIGNAR CHOFER";
    this.mostrarDatosChofer[0] = false;
    this.showUrl = this.globalService.apiHost + "upload/pedido-fertilizantes.xlsx";
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
  }

  ngOnInit() {
    this.getPersonaRolFertilizantes();
    this.getProductos();
    this.getTipoDespacho(0);
    this.buildItemForm();
    this.getDestino();   

    this.subcriptionInfoChofer = this.fertilizantesService.infoChofer$.subscribe(infoChofer => {
      this.asignarChofer(infoChofer);
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

  itemMezcla(index: number, j: number) {
    return (<FormArray>(<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.controls.camiones)
      .controls[index].get('productos')).at(j)).get('mezcla')) as FormArray;
  }

  getTipoDespacho(index) {
    this.fertilizantesService.getTipoDespacho().subscribe(resp => {
      this.tiposDespacho[index] = resp.data;
    });
  }

  getPersonaRolFertilizantes() {
    this.fertilizantesService.getSolicitante().subscribe(resp => {
      this.personasRolFetilizantes = resp;
      this.contrataProveedor = resp[0].razon_social;
      localStorage.setItem('id_proveedor', resp[0].id);
    });
  }

  getProductos() {
    this.fertilizantesService.getProductos().subscribe(resp => {
      this.posicionProductos[0] = resp.data;
      //let filtro = resp.data.filter((arr) => arr.id_producto_compuesto != 4 || arr.id_producto_compuesto != this.prod_proterra);
      let filtro = resp.data.filter((arr) => arr.id_producto_compuesto != prod_mezcla);
      filtro = filtro.filter(arr => arr.id_producto_compuesto != prod_proterra);
      this.productosMezcla[0] = filtro;
    });
  }

  getFetilizantesOrigen() {
    this.origenes = [];
    this.solicitante_a = parseInt(localStorage.getItem('id_proveedor'));

    this.fertilizantesService.getOrigenes(this.solicitante_a).subscribe(resp => {
      this.origenes = resp.data;
    });
  }

  onChangeSolicitar_a(ev: MatSelectChange) {
    this.contrataProveedor = (ev.source.selected as MatOption).viewValue;
    this.getFetilizantesOrigen();
  }


  buildItemForm() {
    this.addPedidoForm = this.fb.group({
      m: ['F'],
      id_cliente: ['', Validators.required], // Son los centros con rol 15 -> FERTILIZANTES, rev1 hardcode
      camiones: this.fb.array([
        this.addCamionFormGroup()
      ])
    })
  }

  addCamionFormGroup(): FormGroup {
    return this.fb.group({
      solicitante: ['', Validators.required],
      id_origen: ['', Validators.required],  // Son los origenes del rol 15
      id_destino: ['', Validators.required],  // Son los destinos del centro logueado
      contrata: [false],
      observaciones: [''],
      fecha_pedido: [this.tomorrow, [Validators.required]],
      id_chofer: [''],
      stoc: ['', Validators.maxLength(25)],
      productos: this.fb.array([
        this.addProductoFormGroup(45)
      ])
    });
  }
  addProductoFormGroup(total): FormGroup {
    return this.fb.group({
      id_tipo_despacho: ['', [Validators.required]],
      id_producto_compuesto: ['', [Validators.required]],
      contrato: ['', [Validators.maxLength(12)]], // minLengthArray(12)
      id_producto: ['', [Validators.required]],
      composicion: [{ value: '', disabled: true },],
      cantidad: ['', [Validators.required, Validators.min(1), Validators.max(total)]],
      mezcla: this.fb.array([
        this.addProductoMezclaFormGroup(45)
      ])
    });
  }
  addProductoMezclaFormGroup(total): FormGroup {
    return this.fb.group({
      id_producto: [''],
      cantidad: ['', [Validators.min(1), Validators.max(total)]],
    });
  }

  observarCambios(index: number, j: number, item: FormGroup, productoSelect) {
    this.itemMezcla(index, j).reset();

    // LÃ³gica para cuando es mezcla el producto
    const producto = this.posicionProductos[0].find(element => element.id === productoSelect);

    // Agrego el tipo de compuesto
    (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
      .at(index).get('productos')).at(j)).controls['id_producto_compuesto'].setValue(producto.id_producto_compuesto);

    // Logica para cuando es mezcla
    if (producto.id_producto_compuesto == 4) {
      let productoArr = (<FormArray>(<FormArray>this.addPedidoForm.controls.camiones).controls[index].get('productos')).controls;
      this.validarCantidadMezcla(index, j, productoArr[index]);

    }

    if (item.controls.id_producto_compuesto.value === prod_proterra) {
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

  mostrarProductosMezcla(index: number, j: number, q: number, item: FormGroup, productoSelect) {
    const producto = this.productosMezcla[0].find(element => element.id === productoSelect);
    console.log('Index-' + index);
    console.log('J-' + j);
    console.log('Q-' + q);
    console.log('Item-' + item);
    console.log('ProductoSelect-' + productoSelect);
    console.log('---------------------------');    
  }

  getDestino() {
    this.nomencladoresService.getAllOrigenesSelect()
      .subscribe(data => {
        this.filteredOptions = data.data;
      });
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
            .confirm({ message: "Â¡Destino agregado correctamente!", tipo: "exito" })
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


  duplicarCamion(index: number, item: FormGroup) {
    this.nombreBtnChofer[this.posicionProductos.length] = "ASIGNAR CHOFER";
    this.mostrarDatosChofer[this.posicionProductos.length] = false;

    this.fertilizantesService.getTipoDespacho().subscribe(resp => {
      console.log('Filtro Tipo-' + this.filtroTipo[index]);
      this.filtroTipo.push(this.filtroTipo[index]);
      let ultima = (<FormArray>(<FormArray>this.addPedidoForm.controls.camiones).controls[index].get('productos')).controls;
      if (ultima.length == 1) {
        this.tiposDespacho[this.posicionProductos.length] = resp.data;
      } else {
        this.tiposDespacho[this.posicionProductos.length] = resp.data.filter(filtro => filtro.forma === this.filtroTipo[this.filtroTipo.length - 1]);
      }

      let camiones = this.addPedidoForm.get('camiones') as FormArray;
      let camion = this.fb.group({
        solicitante: [item.controls.solicitante.value, Validators.required],
        id_origen: [item.controls.id_origen.value, Validators.required],
        id_destino: [item.controls.id_destino.value, Validators.required],
        contrata: [item.controls.contrata.value],
        observaciones: [item.controls.observaciones.value],
        fecha_pedido: [item.controls.fecha_pedido.value, [Validators.required]],
        id_chofer: [item.controls.id_chofer.value],
        stoc: [item.controls.stoc.value, Validators.maxLength(25)],
        productos: this.fb.array(item.controls.productos['controls'].map(item => {
          return this.fb.group({
            id_tipo_despacho: [item.value.id_tipo_despacho, [Validators.required]],
            id_producto_compuesto: [item.value.id_producto_compuesto, [Validators.required]],
            contrato: [item.value.contrato, [Validators.maxLength(12)]],
            id_producto: [item.value.id_producto, [Validators.required]],
            composicion: [{
              value: item.value.composicion,
              disabled: (item.value.id_producto_compuesto === prod_proterra) ? false : true
            },],
            cantidad: [item.value.cantidad, [Validators.required, Validators.min(1), Validators.max(45)]],
            mezcla: this.fb.array([
              this.addProductoMezclaFormGroup(45)
            ])
          });
        }))
      });
      let productoArr = (<FormArray>(<FormArray>this.addPedidoForm.controls.camiones).controls[index]
        .get('productos')).controls;
      let total = 0;
      productoArr.forEach(element => {
        total += element['controls']['cantidad'].value;
      });
      this.cantidadTn[this.posicionProductos.length] = total;
      //camiones.controls.splice(index + 1, 0, camion);      
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
  agregarProductoMezcla(i, j) {
    let productos = this.itemMezcla(i, j);
    let p = this.addProductoMezclaFormGroup(45);
    productos.push(p);
  }

  eliminarCamion(index: number) {
    this.camionesArray.removeAt(index);
    this.filtroTipo.splice(index, 1);
    this.tiposDespacho.splice(index, 1);
    this.posicionProductos.splice(index, 1);
    this.cantidadTn.splice(index, 1);
  }

  eliminarProductoMezcla(i, j, q, productoSelect) {
    (<FormArray>(<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.controls.camiones)
      .controls[i].get('productos')).at(j)).get('mezcla')).removeAt(q);
    if (productoSelect.value['cantidad'] !== "") {
      this.cantMezclas -= productoSelect.value['cantidad'];
      if (this.cantidadTn[i] != this.cantMezclas)
        this.addPedidoForm.setErrors({ 'invalid': true });
    }
  }

  validarCantidadMezcla(i: number, j: number, producto) {
    if (producto['controls']['id_producto_compuesto'].value = prod_mezcla) {
      if (this.cantidadTn[i] != this.cantMezclas)
        this.addPedidoForm.setErrors({ 'invalid': true });
    }
  }

  obtenerProductos(index: number, j: number, item: FormGroup) {
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
    let indexMezcla = (<FormArray>(<FormArray>(<FormArray>this.addPedidoForm.get('camiones'))
      .at(index).get('productos')).at(j)).controls['id_producto_compuesto'].value;
    /* cantidad */
    let total = 0;
    //let indexMezcla = -1
    productoArr.forEach((element, index) => {
      total += element['controls']['cantidad'].value;
    });
    this.cantidadTn[index] = total;
    if (indexMezcla === prod_mezcla) {
      this.validarCantidadMezcla(index, j, productoArr[index]);
    }

  }

  onChangeCantidadMezcla(index: number, j: number) {
    let productoArr: FormArray = this.itemMezcla(index, j);
    this.cantMezclas = 0;
    productoArr.controls.forEach(element => {
      this.cantMezclas += element['controls']['cantidad'].value;
    });
    if (this.cantidadTn[index] != this.cantMezclas) this.addPedidoForm.setErrors({ 'invalid': true });
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
        (<FormArray>(<FormArray>this.addPedidoForm.get('camiones')).at(index)).controls['id_chofer'].setValue(info.id);
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
                contrato: [item.contrato, (prod_proterra === infoproducto.id_producto_compuesto) ? [Validators.required, Validators.maxLength(12)] : [Validators.maxLength(12)]],
                id_producto: [parseInt(infoproducto.id_producto), [Validators.required]],
                composicion: [{
                  value: (prod_proterra === infoproducto.id_producto_compuesto) ? item.composicion : '',
                  disabled: (prod_proterra === infoproducto.id_producto_compuesto) ? false : true,
                }, [(prod_proterra === infoproducto.id_producto_compuesto) ? Validators.required : Validators.max(60)]],
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
                  contrato: [item.contrato, (prod_proterra === infoproducto.id_producto_compuesto) ? [Validators.required, Validators.maxLength(12)] : [Validators.maxLength(12)]],
                  id_producto: [parseInt(infoproducto.id_producto), [Validators.required]],
                  composicion: [{
                    value: (prod_proterra === infoproducto.id_producto_compuesto) ? item.composicion : '',
                    disabled: (prod_proterra === infoproducto.id_producto_compuesto) ? false : true,
                  }, [(prod_proterra === infoproducto.id_producto_compuesto) ? Validators.required : Validators.max(60)]],
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
      this.fertilizantesService.postPedidoFertilizantes(this.addPedidoForm.value).subscribe(resp => {
        this.loader.close();
        this.alertService
          .confirm({
            message: "Â¡Pedido agregado correctamente!",
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

  async importarPedidoMasivo(event) {
    console.log("EVENT = ",event);
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    console.log(this.file);
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
      console.log("Info == ", info);
      /*var keys = Object.keys(info[0]);
      console.log(keys);
      //let keys = info[0];
      [
        "Solicitante",
        "proveedor (profertil x defecto)",
        "origen",
        "destino",
        "email notificación",
        "sucursal/cliente",
        "carga/reserva",
        "fecha",
        "tipo_despacho",
        "contrato",
        "producto",
        "cantidad TN"
    ]*/
      /*
      camiones: Array(1)
  0:
  fecha_pedido: Wed Nov 03 2021 04:36:50 GMT-0400 (hora de Venezuela) {}
  id_chofer: ""
  productos: [{…}]
  stoc: ""
  [[Prototype]]: Object
  length: 1
  [[Prototype]]: Array(0)
  contrata: false
  id_cliente: 43185
  id_destino: 3252
  id_origen: 2238
  m: "F"
  observaciones: "dfhsdh"
  solicitante: "gfgdf dh dh"
      */
      ////////////////////////////////////

      console.log("personasRolFetilizantes = ", this.personasRolFetilizantes);

      /////////////////////////////////
      let listPedidos = [];
      let indicePedido = 1;
      let booleanPedido = true;
      console.log("PEDIDO NUMERO " + indicePedido);
      for (let item of info) {
        console.log(typeof item["carga/reserva"], typeof indicePedido, item["carga/reserva"], indicePedido, item["carga/reserva"] - indicePedido);
        if (item["carga/reserva"] - indicePedido == 1) {
          indicePedido++;
        }
        if (item["carga/reserva"] - indicePedido != 1 && item["carga/reserva"] - indicePedido != 0) {
          booleanPedido = false;
        }
      }
      ////////////////////////////////////



      console.log("origenes = ", this.origenes);

      if (booleanPedido) {
        let arrayPedidos = [];
        indicePedido = 0;
        let indexPedido = 1;
        booleanPedido = false;
        let messageErrorXlsx = null;
        let count = 1;
        let listErrors = [];
        let arrayPedidoToSend = [];
        let newArrayToSend = [];
        let boolError = false;
        let old = 0;
        let current = 0;
        let countTN = 0;
        for (let item of info) {

          boolError = false;

          console.log("######################################");
          console.log("COUNT = ", count);
          console.log("######################################");




          /*if( indicePedido == item["carga/reserva"] ){

          }*/
          old = current;
          if (indicePedido != item["carga/reserva"]) {

            countTN = 0;
            booleanPedido = false;
            indicePedido++;
            indexPedido++;

            old = current;
            current++;

            arrayPedidos.push(
              {
                "masivo" : true,
                "m": "F", // Definir
                "contrata": false, // Definir
                //"id_destino": "3243", // Definir
                "camiones": [{
                  "productos": []
                }]
              }
            );
            console.log("PUSH VACIO = ",indicePedido, arrayPedidos);
          }

          if (!booleanPedido) {
            if (item["Solicitante"] && typeof item["Solicitante"] == "string") {
              arrayPedidos[indicePedido - 1]["solicitante"] = item["Solicitante"];
              //pedido["solicitante"] = item["Solicitante"];
            } else {
              listErrors.push({ "error": `Error en el campo Solicitante, en la linea ${count + 1}`, "pedido": indicePedido });

              //messageErrorXlsx = `Error en el campo Solicitante, en la linea ${count + 1}`;
              //break;
              //pedido["solicitante"] = "";
            }
            //Proveedor
            if (item["proveedor (profertil x defecto)"] && item["proveedor (profertil x defecto)"] == "PROFERTIL") {
             /* */
              arrayPedidos[indicePedido - 1]["id_cliente"] = this.getPersonasRolFetilizantesId();
              
              /*let a = await this.reservasService.getClientes().toPromise();
              console.log(" ******** CLIENTES ********* = ",a);*/
              //pedido["id_cliente"] = this.getPersonasRolFetilizantesId();
            } else {

              listErrors.push({ "error": `Error en el campo Proveedor, en la linea ${count + 1}`, "pedido": indicePedido });

              //messageErrorXlsx = `Error en el campo Proveedor, en la linea ${count + 1}`;
              //break;
            }
            // Cliente
            if( item["sucursal/cliente"] && typeof item["sucursal/cliente"] == "number" ) {
              //alert( typeof item["sucursal/cliente"] )
              let boolCliente = true;
              let resp = [];
              resp = await this.reservasService.getDataCuit(item["sucursal/cliente"]).toPromise();
              console.log("CUIT GET DATA = ",resp[0]["id"]);
              if( resp.length > 0 ){
                arrayPedidos[indicePedido - 1]["id_centro"] = resp[0]["id"];
              } else {
                listErrors.push({ "error": `Error en el campo sucursal/cliente, en la linea ${count + 1}`, "pedido": indicePedido });
              }
            } else {
              arrayPedidos[indicePedido - 1]["id_centro"] = null;
            }
            // Cliente
            // Origin
            if (item["origen"] && typeof item["origen"] == "string") {
              let origins = await this.fertilizantesService.getOrigenes(arrayPedidos[indicePedido - 1]["id_cliente"]).toPromise();
              for (let i = 0; i < origins.data.length; i++) {
                if (origins.data[i].descripcion == `PROFERTIL - ${item["origen"].toUpperCase()}`) {
                  arrayPedidos[indicePedido - 1]["id_origen"] = origins.data[i].id;
                  //pedido["id_origen"] = origins.data[i].id;
                }
              }
            } else {
              listErrors.push({ "error": `Error en el campo Origin, en la linea ${count + 1}`, "pedido": indicePedido });

              //messageErrorXlsx = `Error en el campo Origin, en la linea ${count + 1}`;
              //break;
            }
            //Destino
            if (item["destino"] && typeof item["destino"] == "string") {
              for (let i = 0; i < this.destinos.length; i++) {
                console.log("DESTINO = ", item["destino"], this.destinos[i].descripcion);
                if (item["destino"] == this.destinos[i].descripcion) {
                  arrayPedidos[indicePedido - 1]["id_destino"] = this.destinos[i].id;
                  //pedido["id_destino"] =  this.destinos[i].id;
                }
                console.log("Destino ==== ",arrayPedidos[ indicePedido - 1 ]["id_destino"] );
              }
              if(  arrayPedidos[indicePedido - 1]["id_destino"] == null ||  arrayPedidos[indicePedido - 1]["id_destino"]  == undefined ||  arrayPedidos[indicePedido - 1]["id_destino"] == "" ){
                //console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                listErrors.push({ "error": `Error en el campo Destino, en la linea ${count + 1}`, "pedido": indicePedido });
              }
            } else {

              listErrors.push({ "error": `Error en el campo Destino, en la linea ${count + 1}`, "pedido": indicePedido });
              //messageErrorXlsx = `Error en el campo Destino, en la linea ${count + 1}`;
              //break;
            }
            //Email
            if (item["email notificación"] || typeof item["email notificación"] == "string") {
              arrayPedidos[indicePedido - 1]["email"] = item["email notificación"];
            } else {
              arrayPedidos[indicePedido - 1]["email"] = "";
            }
            //Fecha
            if (item["fecha"] || typeof item["fecha"] == "string") {
              let fechaPedido = moment(item["fecha"]);
              let fechaActual = moment(new Date());
              if (fechaPedido > fechaActual) {
                arrayPedidos[indicePedido - 1]["camiones"][0]["fecha_pedido"] = new Date(item["fecha"]);
              } else {

                listErrors.push({ "error": `El campo de fecha debe ser mayor al dia actual, en la linea ${count + 1}`, "pedido": indicePedido });
                //messageErrorXlsx = `El campo de fecha debe ser mayor al dia actual, en la linea ${count + 1}`;
                //break;
                //arrayPedidos[ indicePedido - 1 ]["fecha_pedido"] = null;
              }
            }
            //Chofer
            console.log("chofer = ", item["cuit_chofer (opcional)"]);
            if (item["cuit_chofer (opcional)"] && typeof item["cuit_chofer (opcional)"] == "number") {
              let cuit_chofer = await this.fertilizantesService.getDatosChofer(item["cuit_chofer (opcional)"]).toPromise();
              console.log("chf = ", cuit_chofer);
              if (cuit_chofer) {
                arrayPedidos[indicePedido - 1]["camiones"][0]["id_chofer"] = cuit_chofer.id;
                //pedido["camiones"][0]["id_chofer"] = cuit_chofer.id;
              } else {

                listErrors.push({ "error": `Error en el campo chofer, en la linea ${count + 1}`, "pedido": indicePedido });
                //messageErrorXlsx = `Error en el campo chofer, en la linea ${count + 1}`;
                //break;
                //pedido["camiones"][0]["id_chofer"] = null;
              }
            } else {
              arrayPedidos[indicePedido - 1]["camiones"][0]["id_chofer"] = null;
              //pedido["camiones"][0]["id_chofer"] = null;
            }
            //Stoc
            if (item["stoc"] && typeof item["stoc"] == "number") {
              arrayPedidos[indicePedido - 1]["camiones"][0]["stoc"] = item["stoc"];
            } else {
              arrayPedidos[indicePedido - 1]["camiones"][0]["stoc"] = null;
            }
            booleanPedido = true;

          }
          //Tipo despacho
          let id_tipo_despacho = null;
          if (typeof item["tipo_despacho"] == "string") {
            console.log(this.tiposDespacho);
            let bool = false;
            let a = null;
            for (let i = 0; i < this.tiposDespacho[0].length; i++) {
              console.log("Tipo Despacho = ", this.tiposDespacho[0][i].descripcion, item["tipo_despacho"]);
              if (this.tiposDespacho[0][i].descripcion == item["tipo_despacho"]) {
                bool = true;
                id_tipo_despacho = this.tiposDespacho[0][i].id;
                //pedido["camiones"][0]["productos"][0]["id_tipo_despacho"] = this.tiposDespacho[i].id;
              }
            }
            if (!bool) {

              listErrors.push({ "error": `El tipo despacho no corresponde al listado, en la linea ${count + 1}`, "pedido": indicePedido });
              //alert(this.tiposDespacho[i].descripcion + " - " + item["tipo_despacho"]);
              //messageErrorXlsx = `El tipo despacho no corresponde al listado, en la linea ${count + 1}`;
              //break;
            }
          } else {

            listErrors.push({ "error": `El tipo despacho esta vacio, en la linea ${count + 1}`, "pedido": indicePedido });
            //messageErrorXlsx = `El tipo despacho esta vacio, en la linea ${count + 1}`;
            //break;
          }
          // Contrato
          let contrato = null;
          if (typeof item["contrato"] == "string") {
            contrato = item["contrato"];
            // pedido["camiones"][0]["productos"][0]["contrato"] = item["contrato"];
          } else {
            //alert(typeof item["contrato"])
            contrato = ''; // Se pone siempre en vacio en caso de no tener.
            // pedido["camiones"][0]["productos"][0]["contrato"] = null;
          }
          //Producto diferente a Mezcla
          let id_producto = null;
          if (item["producto"] && typeof item["producto"] == "string" && item["producto"] != "MEZCLA") {
            //console.log("Productos = ",this.posicionProductos);
            let bool = false;
            for (let i = 0; i < this.posicionProductos[0].length; i++) {
              //console.log("Productos = ", this.posicionProductos[0][i].descripcion, item["producto"]);
              if (this.posicionProductos[0][i].descripcion == item["producto"]) {
                bool = true;
                id_producto = this.posicionProductos[0][i].id;
                //  pedido["camiones"][0]["productos"][0]["id_producto"] = this.posicionProductos[0][i].id;
              }
            }
            if (!bool) {

              listErrors.push({ "error": `Producto no valido, en la linea ${count + 1}`, "pedido": indicePedido });
              //messageErrorXlsx = `Producto no valido, en la linea ${count + 1}`;
              //break;
            }
          }
          // Prodcuto igual mezcla
          if (item["producto"] && typeof item["producto"] == "string" && item["producto"] == "MEZCLA") {
            //console.log("Productos = ",this.posicionProductos);
            let bool = false;
            for (let i = 0; i < this.posicionProductos[0].length; i++) {
              if (this.posicionProductos[0][i].descripcion == item["Prod Mezcla"]) {
                bool = true;
                id_producto = this.posicionProductos[0][i].id;
                // pedido["camiones"][0]["productos"][0]["id_producto"] = this.posicionProductos[0][i].id;
              }
            }
            if (!bool) {

              listErrors.push({ "error": `Producto de mezcla no valido, en la linea ${count + 1}`, "pedido": indicePedido });
              //messageErrorXlsx = `Producto no valido, en la linea ${count + 1}`;
              //break;
            }
          }
          // Cantidad
          let cantidad = null;
          if (item["cantidad TN"] && typeof item["cantidad TN"] == "number" && item["cantidad TN"] > 0) {
            cantidad = item["cantidad TN"];
            countTN +=  item["cantidad TN"];
            if( countTN > 45 ){
              listErrors.push({ "error": `Cantidad total del pedido es mayor a 45 toneladas, revisar la linea ${count + 1}`, "pedido": indicePedido });
            } 
            // pedido["camiones"][0]["productos"][0]["cantidad"] = item["cantidad TN"];
          } else {

            listErrors.push({ "error": `Cantidad invalida, en la linea ${count + 1}`, "pedido": indicePedido });
            //messageErrorXlsx = `Cantidad invalida, en la linea ${count + 1}`;
            //break;
          }
          // Composicion
          let composicion = null;
          if (item["producto"] == "Proterra") {
            composicion = item["composicion"];
            // pedido["camiones"][0]["productos"][0]["composicion"] = item["composicion"];
          } else {
            composicion = null;
          }
          // Observaciones
          let observaciones = null;
          if (item["Observaciones"]) {
            arrayPedidos[indicePedido - 1]["observaciones"] = item["Observaciones"];
            //pedido["Observaciones"] = item["Observaciones"];
          } else {
            arrayPedidos[indicePedido - 1]["observaciones"] = null;
          }

          arrayPedidos[indicePedido - 1]["camiones"][0]["productos"].push({
            composicion: composicion,
            cantidad: cantidad,
            contrato: contrato,
            id_producto: id_producto,
            id_tipo_despacho: id_tipo_despacho
          });

          //////////////////////////
          if (old != current) {
            let boolError = true;
            /*if( indicePedido == 0 ){
              boolError = false;
            }*/
            for (let i = 0; i < listErrors.length; i++) {
              console.log("listError pedido numero ", indicePedido, listErrors);
              //console.log("NUMERO PEDIDO = ",indicePedido);
              if (listErrors[i].pedido == indicePedido) {
                //alert(listErrors[i].error);
                //arrayPedidoToSend.
                //alert(listErrors[i].error )
                boolError = false;
              }
            }

            if (boolError == true) {
              //console.log("PEDIDO A ENVIAR = ",indicePedido,count, arrayPedidos );
              // alert("entro " + indicePedido)
              //console.log("Array agregado = ",arrayPedidos);


              //arrayPedidoToSend.push(arrayPedidos[indicePedido - 1]);
              /*console.log("PEDIDO A ENVIAR = ", arrayPedidos[indicePedido - 1]);
              this.fertilizantesService.postPedidoFertilizantes(arrayPedidos[indicePedido - 1]).subscribe(resp => {
                console.log("RESPUESTA PEDIDO = ", resp);
              }, error => {
                console.log("Error pedido ", error);
              });*/






              ///////////////////////////////////////////////////////////////////////
              newArrayToSend.push(arrayPedidos[indicePedido - 1]);
              /*console.log("PEDIDO A ENVIAR = ",arrayPedidos[indicePedido - 1]);

              let resp = await  this.fertilizantesService.postPedidoFertilizantes(arrayPedidos[indicePedido - 1]).toPromise();
              if(!resp.success){
                listErrors.push({ "error": `Error en la linea ${count + 1}, ${resp.data[0].message}`, "pedido": indicePedido });
              }
              console.log("********************************");
              console.log("RESP SEND PEDIDO = ",  resp);
              console.log("********************************");*/
              
              //listErrors.push({ "error": `Cantidad invalida, en la linea ${count + 1}`, "pedido": indicePedido });

              //console.log(count, indicePedido, arrayPedidos[indicePedido - 1], listErrors);
              //console.log("Array agregado = ", arrayPedidoToSend);
              //////////////////////////////////////////////////////////////




            }
          }

          ////////////////////////
          console.log("listError = ",listErrors);

          count++;
        }

        console.log("NEW TO SEND = ",newArrayToSend);
        for( let i = 0 ; i < newArrayToSend.length ; i++ ){

          let resp = await  this.fertilizantesService.postPedidoFertilizantes(newArrayToSend[i]).toPromise();
              if(!resp.success){
                listErrors.push({ "error": `Error en la linea ${count + 1}, ${resp.data[0].message}`, "pedido": indicePedido });
              }
              console.log("********************************");
              console.log("JSON TO SEND = ",newArrayToSend[i]);
              console.log("RESP SEND PEDIDO = ",  resp);
              console.log("********************************");
              
              //listErrors.push({ "error": `Cantidad invalida, en la linea ${count + 1}`, "pedido": indicePedido });

              //console.log(count, indicePedido, arrayPedidos[indicePedido - 1], listErrors);
              //console.log("Array agregado = ", arrayPedidoToSend);
        }

        this.loader.close();
        console.log(arrayPedidos);
        console.log("listError Final = ", listErrors);
        console.log("Pedidos finales = ", arrayPedidoToSend);
        if (listErrors.length > 0) {
          //alert(messageErrorXlsx);
          let msg = "";
          for (let i = 0; i < listErrors.length; i++) {
            msg += `${listErrors[i].error}.\n\n`;
          }

          this.atencionService.confirm({
            message: msg
          });
          /*this.alertService
            .confirm({
              message: msg,
              tipo: "exito"
            });*/
        } else {
          this.alertService.confirm({
            message: "Registro de pedidos exitoso"
          });
        }

      } else {
        alert("Los indices de carga son incorrectos");
      }


    }

    /*let a = await this.personasService.validarExistCuit(30714250058).toPromise();
    if(a){
      alert("Valido");
    } else {
      alert("No valido");
    }*/

    fileReader.readAsArrayBuffer(this.file);
    event.srcElement.value = null;
  }

  getPersonasRolFetilizantesId() {
    console.log("this.personasRolFetilizantes = ", this.personasRolFetilizantes);
    for (let i = 0; i < this.personasRolFetilizantes.length; i++) {
      if (this.personasRolFetilizantes[i]["razon_social"] == "PROFERTIL S.A.") {
        return this.personasRolFetilizantes[i]["id"];
      }
    }
  }

  onCheckboxChange($event, index: number) {
    let datos_chofer = (<FormArray>(<FormArray>this.addPedidoForm.controls.camiones)
      .controls[index]);
    if ($event.checked) {
      this.btn_asignar_chofer[index] = true;
      this.mostrarDatosChofer[index] = false;
      datos_chofer['controls']['id_chofer'].setValue('');

      this.nombre_chofer.forEach((item, i) => {
        if (index == i) {
          item.nativeElement.textContent = '';
          this.nombreBtnChofer[index] = "ASIGNAR CHOFER";
        }
      });
      this.patente.forEach((item, i) => {
        if (index == i) {
          item.nativeElement.textContent = '';
        }
      });
    } else {
      this.btn_asignar_chofer[index] = false;
    }
  }

  openModalPedidoMasivo(){
    let title = 'PEDIDOS MASIVOS';
    let dialogRef: MatDialogRef<any> = this.dialog.open( AddPedidoMasivoComponent, {
      width: '50%',
      height: '30%',
      //disableClose: true,
      data: { title: title }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if(res != undefined || res != null){
          document.getElementById("fileExcel").click();
        }
        
      });
  }


}
