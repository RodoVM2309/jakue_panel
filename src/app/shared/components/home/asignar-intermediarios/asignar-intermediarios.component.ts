import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { CentrosService } from './../../../../shared/services/centros.service';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { Intermediario } from 'app/views/admin/vincular-centro-intermediario/vincular-intermediario/vincular-intermediario.component';
import { NomencladoresService } from '../../../services/nomencladores.service';
import { AppErrorService } from '../../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../../shared/services/app-atencion/app-atencion.service';
import { TransportistaPostulado } from "./../../../models/centro";
import { getIndexBy } from '../../../helpers/utils';

export class IntermediaroAsig {
  id: number;
  intermediario: string;
  cantidad: number;
  isPostulado: boolean;
}

export class Intermed {
  id: number;
  nombre_intermediario: string;
}
export class IntermediarioCantidadPostulados {
  index: number;
  id: number;
  id_rol: number;
  id_usuario: number;
  activo: number;
  nombre_persona: string;
  direccion_persona: string;
  localidad_persona: string;
  telefono: string;
  nombre_rol: string;
  cuit_persona: string;
  kmetros?: string;
  horas: string;
  cantidad: number = 0;
  cantidadAdministrada: number;

}

let ELEMENT_DATA: IntermediaroAsig[] = [];

@Component({
  selector: 'app-asignar-intermediarios',
  templateUrl: './asignar-intermediarios.component.html',
  styleUrls: ['./asignar-intermediarios.component.scss']
})

export class AsignarIntermediariosComponent implements OnInit {

  cantReducir = 0;
  public itemForm: FormGroup;
  public getItemSub: Subscription;
  intermediarios: Intermed[];
  intermediariosPostulados: IntermediarioCantidadPostulados[];
  intermediariosPostuladosDelete: IntermediarioCantidadPostulados[];
  mostrarIntermediario: boolean = false;
  addPedidoForm: FormGroup;
  cantTotal = 0;
  cantidadisponible = 0;
  chek = true;
  comprobador: any = [];
  displayedColumns: string[] = ['intermediario', 'cantidad', 'id'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay intermediarios postulados</span>        
      </div>
    `
  };
  selec: Array<number>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AsignarIntermediariosComponent>,
    private fb: FormBuilder, private nomencladoresService: NomencladoresService,
    private centrosService: CentrosService, private atencionService: AppAtencionService) {
    this.intermediariosPostulados = [];
    this.intermediariosPostuladosDelete = [];
    this.selec = [];
  }


  ngOnInit() {
    this.addPedidoForm = new FormGroup({
      selectedIntermediario: new FormControl(''),
      ckIntermediario: new FormControl('')
    });
    this.cantTotal = this.data.payload.cantidad;
    this.cantidadisponible = this.data.xAsignar;
    if (this.data.esconder) {
      this.mostrarIntermediario = true;
      this.chek = false;
    }
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
      ckIntermediario: new FormControl(''),
      cantidad: new FormControl(1),
      intermediarios: null
    });
  }

  submit() {
    this.itemForm.controls["selectedIntermediario"].setValue(ELEMENT_DATA);
    this.dialogRef.close(this.itemForm.value);
  }

  getItems() {
    ELEMENT_DATA = [];
    this.getItemIntermediarios();
  }

  getItemIntermediarios() {
    this.getItemSub = this.centrosService.getIntermediarioByIdCentroSelect()
      .subscribe(data => {
        this.intermediarios = data.data;
      });
    this.getItemSub = this.centrosService.getIntermediarioPostuladoByPedido(this.data.payload.id)
      .subscribe(data => {
        this.intermediariosPostulados = [];
        let intermedTemp = new IntermediarioCantidadPostulados();
        this.buildItemForm(this.data.payload);
        for (let index = 0; index < data.data.length; index++) {
          const element = data.data[index];
          intermedTemp = element;
          intermedTemp.index = index;
          intermedTemp.cantidad = data.data[index].cantidad_choferes != undefined ? data.data[index].cantidad_choferes : 1;
          intermedTemp.cantidadAdministrada = intermedTemp.cantidad;
          this.intermediariosPostulados.push(intermedTemp);
          this.selec.push(intermedTemp.cantidad);
          this.itemForm.addControl('quantity' + index, new FormControl(0))
        }

      });
  }

  onChange(event) {
    this.mostrarIntermediario = event.checked;
  }

  obtenerNombreInter(id) {
    for (let i = 0; i < this.intermediarios.length; i++) {
      if (id === this.intermediarios[i].id) {
        return this.intermediarios[i].nombre_intermediario;
      }
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  cancelar() {
    ELEMENT_DATA = [];
    this.dialogRef.close(false);
  }

  addElement() {
    this.comprobador = ELEMENT_DATA;
    if (this.itemForm.controls['cantidad'].value > 0) {
      if (this.itemForm.controls['cantidad'].value <= this.cantidadisponible) {
        if (!this.existeIntermediario(this.itemForm.controls['selectedIntermediario'].value)) {
          this.cantidadisponible -= this.itemForm.controls['cantidad'].value;
          ELEMENT_DATA.push(
            {
              intermediario: this.obtenerNombreInter(this.itemForm.controls['selectedIntermediario'].value),
              cantidad: this.itemForm.controls['cantidad'].value,
              id: this.itemForm.controls['selectedIntermediario'].value,
              isPostulado: false
            }
          );
          this.itemForm.controls['cantidad'].setValue(0);
          this.itemForm.controls['selectedIntermediario'].setValue(0);
          this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        } else {
          this.atencionService.confirm({ message: 'El intermediario ya existe, agregue otro!' });
        }
      } else {
        ELEMENT_DATA.length = 0;
        this.atencionService.confirm({ message: 'No puede asignar una cantidad mayor que la cantidad disponible!' });
      }
    } else {
      this.atencionService.confirm({ message: 'La cantidad debe ser mayor  que cero!' });
    }

  }
  addElement2(row) {
    this.comprobador = ELEMENT_DATA;
    if (row.cantidadAdministrada > 0 && this.cantidadisponible > 0) {
      if (row.cantidadAdministrada <= this.cantidadisponible) {
        if (!this.existeIntermediario(row.id)) {
          this.cantidadisponible -= row.cantidadAdministrada;
          ELEMENT_DATA.push(
            {
              intermediario: row.nombre_persona,
              cantidad: row.cantidadAdministrada,
              id: row.id,
              isPostulado: true
            }
          );
          const ind = this.intermediariosPostulados.indexOf(row);
          this.intermediariosPostulados.splice(ind, 1);
          this.intermediariosPostuladosDelete.push(row);
          this.intermediariosPostulados = [...this.intermediariosPostulados];
          this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        } else {
          this.atencionService.confirm({ message: 'El intermediario ya existe!' });
        }
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);

      } else {
        if (!this.existeIntermediario(row.id)) {
          ELEMENT_DATA.push(
            {
              intermediario: row.nombre_persona,
              cantidad: this.cantidadisponible,
              id: row.id,
              isPostulado: true
            }
          );
          this.cantidadisponible = 0;
          const ind = this.intermediariosPostulados.indexOf(row);
          this.intermediariosPostulados.splice(ind, 1);
          this.intermediariosPostulados = [...this.intermediariosPostulados];
          this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        } else {
          this.atencionService.confirm({ message: 'El intermediario ya existe!' });
        }
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
      }
    } else {
      this.atencionService.confirm({ message: 'La cantidad debe ser mayor  que cero!' });
    }

  }
  changeCantidadAdministrada(e: any, cantidad, index) {
    let valor = parseInt(e);
    if (valor < 0) {
      this.selec[index] = 0;
      this.intermediariosPostulados[index].cantidadAdministrada = 0;
    }
    if (valor > cantidad) {
      this.selec[index] = cantidad;
      this.intermediariosPostulados[index].cantidadAdministrada = cantidad
    }

    else {
      this.selec[index] = valor;
      this.intermediariosPostulados[index].cantidadAdministrada = valor;
    }

    /* for (let index = 0; index <  this.intermediariosPostulados.length; index++) {
      const element =  this.intermediariosPostulados[index];
      if (element.id == row.id) {
           
          };
    }; */

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
    if (elemt.isPostulado) {
      const element = this.intermediariosPostuladosDelete.find(chof => chof.id === elemt.id);
      const ind = this.intermediariosPostuladosDelete.indexOf(element);
      this.intermediariosPostuladosDelete.splice(ind, 1);
      this.intermediariosPostulados.push(element);
      this.intermediariosPostulados = [...this.intermediariosPostulados];
    }
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.cantidadisponible += elemt.cantidad;
  }
}
