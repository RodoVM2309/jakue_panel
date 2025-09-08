import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router} from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import {  MatDialog,DateAdapter, MAT_DATE_FORMATS,
  MAT_DATE_LOCALE, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { NomencladoresService } from './../../../shared/services/nomencladores.service';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';
import { Page } from '../../../shared/models/page';
import { ExelService } from '../../../shared/services/exel.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { egretAnimations } from '../../../shared/animations/egret-animations';

export class BajadaMasiva {
  id: number;
  razon_social: string;
  cuit_cuil: string;  
  fecha: string;
  tipo: string;
}

@Component({
  selector: 'app-nuevos-proveedores',
  templateUrl: './nuevos-proveedores.component.html',
  styleUrls: ['./nuevos-proveedores.component.scss'],
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
export class NuevosProveedoresComponent implements OnInit {
  public choferes: BajadaMasiva[];
  public bajadaMasiva: BajadaMasiva[];
  page = new Page();
  
  bajadaForm: FormGroup;
  public getItemSub: Subscription;
  idchoferlibre: any;
  minDate: any;
  maxDate: any;
  fecha_desde: any;
  fecha_hasta: any;
  tipo : number;
  checkedPedidos = false;
  tipos = [
    {
      id: 1,
      descripcion: 'Pedidos'
    },
    {
      id: 2,
      descripcion: 'Viajes'
    }
  ]
  constructor(private nomencladoresService: NomencladoresService,
    public router: Router,  private snack: MatSnackBar,
    private excelService: ExelService) {
      this.page.pageNumber = 0;
      this.page.size = 10;
     }

  ngOnInit() {
    this.bajadaForm = new FormGroup({
      desdeDate: new FormControl(new Date(), [Validators.required]),
      hastaDate: new FormControl(new Date(), [Validators.required])
    });
    this.fecha_desde = this.f.desdeDate.value.toISOString();
    this.fecha_hasta = this.f.desdeDate.value.toISOString();
     this.cargarTodos()
  }
  get f() { return this.bajadaForm.controls; }
  
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>, cmp: string) {
    if (cmp === 'desde') {
      this.minDate = event.value;
    } else {
      this.maxDate = event.value;
    }
  }

  cargarTodos(){
    this.nomencladoresService.getDatosNuevosProveedores(this.fecha_desde, this.fecha_hasta)
    .subscribe(pagedData => {
        this.bajadaMasiva = pagedData.data;
    });
  }
  Ejecutarfiltro(){
    this.fecha_desde = this.f.desdeDate.value.toISOString();
    this.fecha_hasta = this.f.hastaDate.value.toISOString();
    
    this.cargarTodos();
  }
 
  exportAsXLSX(): void {
    let array_exp = [];
    if(this.bajadaMasiva.length >0){
      for (let i = 0; i < this.bajadaMasiva.length; i++) {
        let exportar = {       
          Id: this.bajadaMasiva[i].id,
          Razon_Social: this.bajadaMasiva[i].razon_social,
          CUIT: this.bajadaMasiva[i].cuit_cuil,
          Tipo_Proveedor: this.bajadaMasiva[i].tipo
        };
        array_exp.push(exportar);
      }
      this.excelService.exportAsExcelFile(array_exp, 'Listado Nuevos proveedores');
    }   
  }
  

}
