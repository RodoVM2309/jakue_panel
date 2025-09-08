import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CentrosService } from 'app/shared/services/centros.service';
import { Page } from 'app/shared/models/page';
import { MatDialogRef, MatDialog } from '@angular/material';
import { AddMotivoComponent } from './add-motivo/add-motivo.component';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';


export class Motivo {
  id?: number;
  id_centro?: number;
  descripcion: string;
  afecta_lugar: number;
  afecta?: string;
}

@Component({
  selector: 'app-gestionar-motivos',
  templateUrl: './gestionar-motivos.component.html',
  styleUrls: ['./gestionar-motivos.component.scss']
})

export class GestionarMotivosComponent implements OnInit {
  public motivos: Motivo[];
  public getItemSub: Subscription;
  public page = new Page();
  public pageCount: number;
  tipo_turneada: number = 0;
  constructor(private centrosService: CentrosService,
    private nomencladoresService: NomencladoresService,
     private dialog: MatDialog) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.getItems();
    this.setPage({ offset: 0 });
  }
  getItems() {    
    this.getItemSub = this.nomencladoresService.getConfiguracionCentro()
      .subscribe(data => {
        this.tipo_turneada=data.data.id_tipo_turneada;       
      });
  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    this.getItemSub = this.centrosService.getAllMotivosRechazos(this.page.pageNumber)
      .subscribe(data => {
        this.motivos = data.data;
        for (let i = 0; i < this.motivos.length; i++) {
          this.motivos[i].afecta = (this.motivos[i].afecta_lugar === 1) ? 'SI' : 'NO';
        }
        this.page.totalElements = data._meta.totalCount;
        this.page.pageNumber = data._meta.currentPage - 1;
        this.pageCount = data._meta.pageCount;
        this.page.size = data._meta.perPage;
      });
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? "Agregar Motivo de Rechazo" : "Modificar Persona";
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddMotivoComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew,tipoTurneada:this.tipo_turneada }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.setPage({ offset: 0 });      
    });
  }

}
