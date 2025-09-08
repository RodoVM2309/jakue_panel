import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

import { AdminService } from './../../../shared/services/admin.service';
import { InfoPersonaComponent } from './../personas/info-persona/info-persona.component';
import { Page } from '../../../shared/models/page';

export class Entregador {
  id: number;
  id_entregador: number;
  id_usuario: number;
  nombre_persona: string;
  nombre_entregador: string;
  localidad_persona: string;
  cuit_persona: string;
  bloqueado: number;
  id_centro: number;
  nombre_centro: string;  
}

@Component({
  selector: 'app-entregador',
  templateUrl: './entregador.component.html',
  styleUrls: ['./entregador.component.scss']
})
export class EntregadorComponent implements OnInit {
  public entregadores: Entregador[];
  page = new Page();
  public getItemSub: Subscription;
  constructor(private adminService: AdminService,
    public router: Router, private dialog: MatDialog) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    //this.getItems();
    this.setPage({ offset: 0 });
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    this.adminService.getAllEntregador(this.page.pageNumber).subscribe(pagedData => {
      this.entregadores = pagedData.data;

      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;

    });
  }
  openPopUpInfoPersona(data: any = {}) {
    let title = 'Información del perfil - Entregador';
    let dialogRef: MatDialogRef<any> = this.dialog.open(InfoPersonaComponent, {
      width: '720px',
      height: '73vh',
      disableClose: true,
      data: { title: title, payload: { id: data.id_usuario } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }
}
