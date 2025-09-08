import {
  Component,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MatOption,
  MatSelect,
} from "@angular/material";
import { HomeService } from "@app/shared/components/home/home.service";
import { DestinatarioV3 } from "@app/shared/models/v2-demandados";
import { MessageService } from "@app/shared/services";
import { Subscription } from "rxjs";
import { AddSolicitudesC3Component } from "../../../add-solicitudes-c3/add-solicitudes-c3.component";
import {} from "../../functions";
import { Items, ItemsCuit, ItemsDestinatarios } from "../../models";
import { CupoService } from "../../../../cupo.service";
import { forEach } from "@angular/router/src/utils/collection";
import { Item } from "../../../../../home/mapa/mapa.component";
import { AddCuposDisponiblesComponent } from "@app/shared/components/cupo/add-cupos-disponibles/add-cupos-disponibles.component";

@Component({
  selector: "app-filtros-asignacion-c3",
  templateUrl: "./filtros-asignacion-c3.component.html",
  styleUrls: ["./filtros-asignacion-c3.component.scss"],
})
export class FiltrosAsignacionC3Component implements OnInit {
  @ViewChild("select") select: MatSelect;
  @Input() productos;
  @Input() fecha: string;
  @Input() myData;
  @Input() variables;
  @Output() chanceFiltro = new EventEmitter();
  /*  @Input() solicitudesApi;
  @Input() detallesDisponiblesApi; */
  @Output() cambiarFecha = new EventEmitter();
  filtrarForm: FormGroup;
  disabledCorredor = true;
  disabledCliente = true;
  disabledDestino = true;
  disabledDestSolicitud = true;
  disabledComercial = true;
  disabledContrato = true;
  disabledCuposXModulos = true;
  disabledAcciones = true;
  disabledZona = true;
  disabledCaratula = true;
  chanceData = false;
  cambiofecha = true;

  destinos: ItemsCuit[] = [
    {
      id: 0,
      cuit: "",
      descripcion: "Todos",
    },
  ];

  comerciales: ItemsCuit[] = [
    {
      id: 0,
      cuit: "",
      descripcion: "Todos",
    },
  ];
  clientes: ItemsCuit[] = [
    {
      id: 0,
      cuit: "",
      descripcion: "Todos",
    },
  ];
  contratos: Items[] = [];
  destinatarios: ItemsDestinatarios[] = [
    {
      id: 0,
      cuit: "",
      descripcion: "Todos",
      destinos: [],
    },
  ];

  private subscription: Subscription;
  message: any;
  //allSelected=false;

  constructor(
    private dialog: MatDialog,
    private homeService: HomeService,
    private messageService: MessageService,
    private cupoService: CupoService
  ) {
    this.subscription = this.messageService
      .getMessage()
      .subscribe((message) => {
        this.message = message;
        switch (this.message.text) {
          case "productos":
            this.loadProductos(this.message.data);
            break;
          case "seleccionarProducto":
            this.selectProducto(this.message.data);
            break;
          case "updateTable":
            this.updateTableFiltro();
            break;
          case "enableFiltro":
            this.enabledFiltro();
            break;
          default:
            break;
        }
      });
  }

  ngOnInit() {
    this.filtrarForm = new FormGroup({
      selectedFecha: new FormControl(new Date(this.fecha + " 12:00:00")),
      selectedZonaCupo: new FormControl(this.variables.filtro.idZonasCupo),
      selectedProducto: new FormControl(this.variables.filtro.idProductos),
      selectedComercial: new FormControl(this.variables.filtro.cuitComercial),
      selectedCliente: new FormControl(this.variables.filtro.cuitCliente),
      selectedDestSolic: new FormControl(
        this.variables.filtro.cuitDestinatario
      ),
      selectedDestino: new FormControl(this.variables.filtro.cuitDestino),
      selectedContrato: new FormControl(this.variables.filtro.contrato),
    });
    this.variables.filtro.fecha = this.fecha;
    if (this.productos.length > 0) {
      let produc = [];
      for (let i = 0; i < this.productos.length; i++) {
        produc.push(this.productos[i].id);
      }
      this.variables.filtro.idProductos = produc;
      this.filtrarForm.controls["selectedProducto"].setValue(produc);
    }
  }

  loadProductos(data) {
    this.productos = data;
    if (this.productos.length > 0) {
      let produc = [];
      for (let i = 0; i < this.productos.length; i++) {
        produc.push(this.productos[i].id);
      }
      this.variables.filtro.idProductos = produc;

      this.filtrarForm.controls["selectedProducto"].setValue(produc);
    }
  }
  get f() {
    return this.filtrarForm.controls;
  }

  selectProducto(event) {
    let produc = this.productos.find((el) => el.id == event);
    const anotherList: any[] = [produc.id];
    this.variables.filtro.idProductos = anotherList;
    //this.filtrarForm.controls["selectedProducto"].setValue(anotherList);
    /* this.disabledComercial = true;
    this.disabledCliente = true;
    this.disabledDestSolicitud = true;
    this.disabledDestino = true;
    this.disabledContrato = true; */
  }

  updateTableFiltro() {
      this.comerciales = this.variables.comerciales;
      if (this.comerciales.length > 0) {
        this.filtrarForm.controls["selectedComercial"].setValue(
          this.comerciales[0].id
        );
        this.disabledComercial = false;
        let tempClientes = [];
        this.variables.comerciales.forEach((element) => {
          if (element.clientes.length > 0) {
            element.clientes.forEach((element2) => {
              let dest = tempClientes.find((el) => el.cuit == element2.cuit);
              if (dest == null) {
                element2.id = tempClientes.length + 1;
                tempClientes.push(element2);
              }
            });
          }
        });
        this.variables.comerciales[0].clientes = tempClientes;
        this.clientes = this.variables.comerciales[0].clientes;
        this.filtrarForm.controls["selectedCliente"].setValue(
          this.clientes[0].id
        );
        this.disabledCliente = false;
      }
      if (this.variables.contratos.length > 0) {
        this.contratos = this.variables.contratos;
        this.filtrarForm.controls["selectedContrato"].setValue(
          this.contratos[0].id
        );
        this.disabledContrato = false;
      }
    this.filtrarForm.controls["selectedProducto"].setValue(
      this.variables.filtro.idProductos
    );

    if (this.variables.destinatarios.length > 0) {
      this.destinatarios = this.variables.destinatarios;
      this.filtrarForm.controls["selectedDestSolic"].setValue(
        this.destinatarios[0].id
      );
      //incorporar en el destino 0 todos los destinos
      let tempDestino = [];
      this.variables.destinatarios.forEach((element) => {
        if (element.destinos.length > 0) {
          element.destinos.forEach((element2) => {
            let dest = tempDestino.find((el) => el.cuit == element2.cuit);
            if (dest == null) {
              tempDestino.push(element2);
            }
          });
        }
      });
      this.destinatarios[0].destinos = tempDestino;
      this.destinos = this.destinatarios[0].destinos;
      this.filtrarForm.controls["selectedDestino"].setValue(
        this.destinos[0].id
      );
      this.disabledDestSolicitud = false;
      this.disabledDestino = false;
    }

    this.variables.filtro.cuitComercial = "";
    this.variables.filtro.cuitCliente = "";
    this.variables.filtro.cuitDestinatario = "";
    this.variables.filtro.cuitDestino = "";
    this.variables.filtro.contrato = "";
  }
  enabledFiltro() {
    if (this.variables.showDetalleProductoZona) {
      this.disabledComercial = true;
      this.disabledContrato = true;
      this.disabledCliente = true;
      this.disabledDestSolicitud = true;
      this.disabledDestino = true;
    } else {
      this.disabledComercial = false;
      this.disabledContrato = false;
      this.disabledCliente = false;
      this.disabledDestSolicitud = false;
      this.disabledDestino = false;

    }
  }
  aplicarFiltroProducto(event) {
    let anotherList: any[];
    if (event.value == -1) {
      this.productos.forEach(this.productos, (element) => {
        anotherList.push(element.id);
      });
      this.variables.filtro.idProductos = anotherList;
      this.filtrarForm.controls["selectedProducto"].setValue(anotherList);
    } else {
      anotherList = [event.value];
      this.variables.filtro.idProductos = anotherList;
      this.filtrarForm.controls["selectedProducto"].setValue(anotherList);
    }
  }
  aplicarFiltroComercial(event) {
    this.clientes = [];
    const tempComercial = this.variables.comerciales.find(
      (el) => el.id == event.value
    );
    this.variables.filtro.cuitComercial = tempComercial.cuit;
    this.clientes = tempComercial.clientes;
    this.clientes.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
    let itemTodos = this.clientes.find((x) => x.id === 0);
    if (itemTodos) {
      this.clientes.splice(this.clientes.indexOf(itemTodos), 1);
    }
    this.clientes.unshift({
      id: 0,
      cuit: "",
      descripcion: "Todos",
    });
    this.filtrarForm.controls["selectedCliente"].setValue(this.clientes[0].id);
    this.disabledCliente = false;
  }
  aplicarFiltroDestinatario(event) {
    this.destinos = [];
    const tempDestinatario = this.destinatarios.find(
      (el) => el.id == event.value
    );
    this.variables.filtro.cuitDestinatario = tempDestinatario.cuit;
    this.destinos = tempDestinatario.destinos;
    this.destinos.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
    let itemTodos = this.destinos.find((x) => x.id === 0);
    if (itemTodos) {
      this.destinos.splice(this.destinos.indexOf(itemTodos), 1);
    }
    this.destinos.unshift({
      id: 0,
      cuit: "",
      descripcion: "Todos",
    });
    this.filtrarForm.controls["selectedDestino"].setValue(this.destinos[0].id);
    this.disabledDestino = false;
  }
  aplicarFiltroDestino(event) {
    const tempDestino = this.destinos.find((el) => el.id == event.value);
    this.variables.filtro.cuitDestino = tempDestino.cuit;
  }
  aplicarFiltroCliente(event) {
    const tempCliente = this.clientes.find((el) => el.id == event.value);
    this.variables.filtro.cuitCliente = tempCliente.cuit;
  }
  aplicarFiltroContrato(event) {
    const tempContrato = this.contratos.find((el) => el.id == event.value);
    if (tempContrato.descripcion == "Todos") {
      this.variables.filtro.contrato = "";
    } else {
      this.variables.filtro.contrato = tempContrato.descripcion;
    }
  }

  aplicarFiltroZona(event) {
    this.variables.chanceFiltroZona = true;
  }

  buscar() {
    if (this.variables.inicioComponente) {
      this.variables.showDetalleProductoZona = true;
      this.variables.inicioComponente = false;
    }
    this.filtrarForm.get("selectedFecha").valueChanges.subscribe((x) => {
      let newFecha = this.homeService.formatoFecha(x, "amd", "-");
      this.variables.filtro.fecha = newFecha;
      this.cambiarFecha.emit({ fecha: newFecha });
    });
    this.variables.filtro.idZonasCupo =
      this.filtrarForm.controls["selectedZonaCupo"].value;
    this.variables.filtro.idProductos =
      this.filtrarForm.controls["selectedProducto"].value;
    this.chanceFiltro.emit();
  }

  addCupoSolicitados() {
    let dialogRef3: MatDialogRef<any> = this.dialog.open(
      AddSolicitudesC3Component,
      {
        width: "70vw",
        height: "95vh",
        disableClose: true,
        data: {
          productos: this.productos,
          cupera: 3,
          filtros: this.variables.filtro,
          fechaSelected: this.filtrarForm.controls["selectedFecha"].value,
        },
      }
    );
    dialogRef3.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      //this.buscar();
      return;
    });
  }
  isOptionDisabled(opt: any): boolean {
    return (
      this.filtrarForm.controls["selectedZonaCupo"].value.length >= 3 &&
      !this.filtrarForm.controls["selectedZonaCupo"].value.find(
        (el) => el == opt
      )
    );
  }

  /* optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }
  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  } */
  trackByFn(index, item) {
    return item.id; // unique id corresponding to the item
  }
  valor(event) {
    let itemProd = this.productos.find((item) => item.id == event);
    return itemProd.descripcion;
  }

  addCupoDisponibles() {
    let title = "Agregar Cupos Disponibles";
    let fecha = this.filtrarForm.controls["selectedFecha"].value;
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AddCuposDisponiblesComponent,
      {
        width: "95vw",
        height: "97vh",
        disableClose: true,
        data: {
          title: title,
          cupera: 2,
          filtros: this.variables.filtro,
          destinatario: "",
          fechaSelected: fecha,
          productos: this.productos,
        },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.cambiarFecha.emit({ fecha: this.variables.filtro.fecha });
      return;
    });
  }
}
