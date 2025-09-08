import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDialogRef, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { AdminService } from './../../../shared/services/admin.service';
import { InfoPersonaComponent } from './../personas/info-persona/info-persona.component';
import { Page } from '../../../shared/models/page';

export class Corredor {
  id: number;
  id_usuario: number;
  nombre_persona: string;
  localidad_persona: string;
  cuit_persona: string;
}

@Component({
  selector: 'app-corredor',
  templateUrl: './corredor.component.html',
  styleUrls: ['./corredor.component.scss']
})
export class CorredorComponent implements OnInit {
  public corredores: Corredor[];
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

   setPage(pageInfo){
      this.page.pageNumber = pageInfo.offset + 1;
      this.adminService.getAllCorredor(this.page.pageNumber).subscribe(pagedData => {
        this.corredores = pagedData.data;
        
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage - 1;
        this.page.size = pagedData._meta.perPage;
        
      });
  }
  openPopUpInfoPersona(data: any = {}) {
    let title = 'Información del perfil - Corredor';
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
