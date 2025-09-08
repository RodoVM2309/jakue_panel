import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { CentrosService } from './../../../../shared/services/centros.service';
import {  Subscription, of } from 'rxjs';
import { NomencladoresService } from '../../../services/nomencladores.service';
import { AppAtencionService } from '../../../../shared/services/app-atencion/app-atencion.service';

export class IntermediaroAsig {
  id: number;
  intermediario: string;
  cantidad: number;
}

export class Intermed {
  id: number;
  nombre_intermediario: string;
}

export class Operador {
  id: number;
  nombre_persona: string;
}
let ELEMENT_DATA: IntermediaroAsig[] = [];
@Component({
  selector: 'app-confirmar-pedido',
  templateUrl: './confirmar-pedido.component.html',
  styleUrls: ['./confirmar-pedido.component.scss']
})

export class ConfirmarPedidoComponent implements OnInit {
  cantReducir = 0;
  public itemForm: FormGroup;
  public getItemSub: Subscription;
  intermediarios: Intermed[];
  operadores: Operador[];
  mostrarIntermediario: boolean = false;
  mostrarOperador: boolean = false;
  //addPedidoForm: FormGroup;
  cantTotal = 0;
  cantidadisponible = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmarPedidoComponent>,
    private fb: FormBuilder,
   private centrosService: CentrosService, 
   private atencionService: AppAtencionService) { }


  ngOnInit() {
    
    this.cantTotal = this.data.payload.cantidad;
    this.cantidadisponible = this.data.payload.cantidad;
    this.buildItemForm(this.data.payload);
    this.getItems();
  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id],
      id_cliente: [item.id_cliente],
      id_centro: [item.id_centro],
      solicitud: [item.solicitud],
      id_observador: [item.id_observador],
      selectedIntermediario: new FormControl(''),
      selectedOperador: new FormControl(''),
      ckIntermediario: new FormControl(''),
      ckOperador: new FormControl(''),
      cantidad: new FormControl(1),
      intermediarios: null,
      mentira: new FormControl('')
    });
  }
  submit() {
    this.itemForm.controls['intermediarios'].setValue(ELEMENT_DATA);
    this.dialogRef.close(this.itemForm.value);
  }
  getItems() {
    ELEMENT_DATA=[];
    this.getItemIntermediarios();
    this.getItemOperadores();
  }

  getItemIntermediarios() {
    this.getItemSub = this.centrosService.getIntermediarioByIdCentroSelect()
      .subscribe(data => {
        this.intermediarios = data.data;
      });
  }
  getItemOperadores() {
    this.getItemSub = this.centrosService.getOperadoreByIdCentroSelect()
      .subscribe(data => {
        this.operadores = data.data;
      });
  }
  onChange(event) {
    this.mostrarIntermediario = event.checked;
    if (event.checked) {
      this.mostrarOperador = false;
      this.itemForm.controls['ckOperador'].setValue(false);
      this.itemForm.controls['selectedOperador'].setValue('');
    }
  }

  onChange2(event) {
    this.mostrarOperador = event.checked;
    if (event.checked) {
      this.mostrarIntermediario = false;
      this.itemForm.controls['ckIntermediario'].setValue(false);
    }
  }

  obtenerNombreInter(id) {
    for (let i = 0; i < this.intermediarios.length; i++) {
      if (id === this.intermediarios[i].id) {
        return this.intermediarios[i].nombre_intermediario;
      }
    }
  }
  displayedColumns: string[] = ['intermediario', 'cantidad', 'id'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  addElement() {
    if (this.itemForm.controls['cantidad'].value > 0) {
      if (this.itemForm.controls['cantidad'].value <= this.cantidadisponible) {
        if (!this.existeIntermediario(this.itemForm.controls['selectedIntermediario'].value)) {
          this.cantidadisponible -= this.itemForm.controls['cantidad'].value;
          ELEMENT_DATA.push(
            {
              intermediario: this.obtenerNombreInter(this.itemForm.controls['selectedIntermediario'].value),
              cantidad: this.itemForm.controls['cantidad'].value,
              id: this.itemForm.controls['selectedIntermediario'].value
            }
          );
          this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        } else {
          this.atencionService.confirm({ message: 'El intermediario ya existe!' });
        }
      } else {
        this.atencionService.confirm({ message: 'No puede asignar una cantidad mayor que la cantidad disponible!' });
      }
    } else {
      this.atencionService.confirm({ message: 'La cantidad debe ser mayor  que cero!' });
    }

  }

  existeIntermediario(id) {
    for (let i = 0; i < ELEMENT_DATA.length; i++) {
      if (ELEMENT_DATA[i].id === id) {
        return true;
      }
    }
    return false;
  }

  conocerCantAsignada() {
    let cant = 0;
    for (let i = 0; i < ELEMENT_DATA.length; i++) {
      cant += ELEMENT_DATA[i].cantidad;
    }
    return cant;
  }

  deleteElement(elemt) {
    ELEMENT_DATA.splice(ELEMENT_DATA.indexOf(elemt), 1);
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.cantidadisponible += elemt.cantidad;
  }
}
