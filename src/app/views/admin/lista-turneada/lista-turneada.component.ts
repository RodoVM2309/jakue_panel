import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CentrosService } from 'app/shared/services/centros.service';
import { Router } from '@angular/router';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddListaComponent } from './add-lista/add-lista.component';
import { ListaChoferesComponent } from './lista-choferes/lista-choferes.component';

export class Lista {
  id?: number;
  id_centro: number;
  nombre: string;
}

@Component({
  selector: 'app-lista-turneada',
  templateUrl: './lista-turneada.component.html',
  styleUrls: ['./lista-turneada.component.scss']
})
export class ListaTurneadaComponent implements OnInit {
  public listas: Lista[];
  public id_tipo_turneada = 0;
  public getItemSub: Subscription;
  public mostrarTurneada: boolean = false;
  constructor(public router: Router, 
     private nomencladoresService: NomencladoresService,
    public centroService: CentrosService, private dialog: MatDialog) { }

  ngOnInit() {
    this.getItems();
  }

  getItems(){
    this.getItemSub = this.nomencladoresService.getConfiguracionCentro()
      .subscribe(data => {
        this.id_tipo_turneada = data.data.id_tipo_turneada;
        this.mostrarTurneada = (this.id_tipo_turneada !== 0) ? true : false;
        if(this.mostrarTurneada){
          this.getListaCentro();
        }
      });
  }

  getListaCentro() {
    this.getItemSub = this.centroService.getAllListaCentro(this.id_tipo_turneada)
      .subscribe(data => {
        this.listas = data.data;        
      });
  }

  openPopUp(data: any = {}, isNew?) {
    data.id_tipo_turneada = this.id_tipo_turneada;
    let title = isNew ? "Agregar Lista" : "Modificar Lista";
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddListaComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.getListaCentro();      
    });
  }

  openPopUp2(data: any = {}) {
    let title = "Lista de choferes";
    let dialogRef: MatDialogRef<any> = this.dialog.open(ListaChoferesComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: data}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }     
    });
  }  

}
