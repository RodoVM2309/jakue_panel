import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  MatDialogRef, MAT_DIALOG_DATA, DateAdapter,
  MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatPaginator
}
  from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '@helpers/date.adapter';
import { FormGroup, FormControl } from '@angular/forms';
import { Viaje } from '../../../models/viaje';
import { Siniestro } from '../../../models/siniestro';
import { HomeService } from '../../../components/home/home.service';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-siniestro',
  templateUrl: './siniestro.component.html',
  styleUrls: ['./siniestro.component.scss'],
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
export class SiniestroComponent implements OnInit {
  viajePedido: Viaje;
  siniestros: Siniestro[];
  currentSiniestro: Siniestro;
  siniestroForm: FormGroup;
  totalSize: number = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay denuncias de siniestros en el viaje</span>        
      </div>
    `
  };

  public getItemSub: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public homeService: HomeService,
    public dialogRef: MatDialogRef<SiniestroComponent>) { }

  ngOnInit() {
    this.viajePedido = this.data.payload;
    this.getSiniestroByViaje(this.viajePedido.id);   
    this.totalSize = 0;
    this.siniestroForm = new FormGroup({
      fecha: new FormControl(''),
      hora: new FormControl(''),
      poliza: new FormControl(''),
      tipo1: new FormControl( ' '),
      tipo2: new FormControl( ' '),
      tipo3: new FormControl( ' '),
      tipo4: new FormControl( ' '),
      tipo5: new FormControl( ' '),
      tipo6: new FormControl(' '),
      tipo7: new FormControl(' '),
      tipo_mercaderia: new FormControl(''),
      monto_reclamado: new FormControl(''),
      descripcion: new FormControl(''),
      observaciones: new FormControl(''),
      contacto: new FormControl(''),
    });
    this.paginator._intl.itemsPerPageLabel = 'Denuncias de siniestros por Página';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último Cupo';
    this.paginator._intl.previousPageLabel = 'Anterior';
  }
  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => this.loadSiniestroPage())
      )
      .subscribe();
  }
  get f() { return this.siniestroForm.controls; }

  getSiniestroByViaje(idViaje) {
    this.getItemSub = this.homeService.getSiniestroByViaje(idViaje)
      .subscribe(data => {
        this.siniestros = data.data;
        if (this.siniestros)
          this.currentSiniestro = data.data[0];
        this.siniestroForm.setValue({
          fecha: this.homeService.formatoFecha(this.currentSiniestro.fecha,"amd", "-"),
          hora: this.homeService.formatoHora(this.currentSiniestro.fecha) ,
          poliza: this.currentSiniestro.poliza,
          tipo1: this.currentSiniestro.tipo_siniestro == 1 ? '   X   ' : ' ',
          tipo2: this.currentSiniestro.tipo_siniestro == 2 ? '   X' : ' ',
          tipo3: this.currentSiniestro.tipo_siniestro == 3 ? '   X' : ' ',
          tipo4: this.currentSiniestro.tipo_siniestro == 4 ? '   X' : ' ',
          tipo5: this.currentSiniestro.tipo_siniestro == 5 ? '   X' : ' ',
          tipo6: this.currentSiniestro.tipo_siniestro == 6 ? '   X' : ' ',
          tipo7: this.currentSiniestro.tipo_siniestro == 7 ? '   X' : ' ',
          tipo_mercaderia: this.currentSiniestro.tipo_mercaderia,
          monto_reclamado: this.currentSiniestro.monto_reclamado!==undefined?this.currentSiniestro.monto_reclamado:' ',
          descripcion: this.currentSiniestro.descripcion,
          observaciones: this.currentSiniestro.observaciones,
          contacto: this.currentSiniestro.contacto
        })
        this.totalSize = this.siniestros.length;
      })
  }
  loadSiniestroPage() {    
    this.currentSiniestro = this.siniestros[this.paginator.pageIndex];
    this.siniestroForm.setValue({
      fecha: this.homeService.formatoFecha(this.currentSiniestro.fecha,"amd", "-"),
      hora: this.homeService.formatoHora(this.currentSiniestro.fecha) ,
      poliza: this.currentSiniestro.poliza,
      tipo1: this.currentSiniestro.tipo_siniestro == 1 ? '   X   ' : ' ',
      tipo2: this.currentSiniestro.tipo_siniestro == 2 ? '   X' : ' ',
      tipo3: this.currentSiniestro.tipo_siniestro == 3 ? '   X' : ' ',
      tipo4: this.currentSiniestro.tipo_siniestro == 4 ? '   X' : ' ',
      tipo5: this.currentSiniestro.tipo_siniestro == 5 ? '   X' : ' ',
      tipo6: this.currentSiniestro.tipo_siniestro == 6 ? '   X' : ' ',
      tipo7: this.currentSiniestro.tipo_siniestro == 7 ? '   X' : ' ',
      tipo_mercaderia: this.currentSiniestro.tipo_mercaderia,
      monto_reclamado: this.currentSiniestro.monto_reclamado!==undefined?this.currentSiniestro.monto_reclamado:' ',
      descripcion: this.currentSiniestro.descripcion,
      observaciones: this.currentSiniestro.observaciones,
      contacto: this.currentSiniestro.contacto
    })  
  }

  submit() {
    this.dialogRef.close();
  }

}
