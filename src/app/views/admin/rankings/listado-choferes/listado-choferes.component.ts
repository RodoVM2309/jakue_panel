import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription, } from 'rxjs';
import { InfoPersonaComponent } from './../../personas/info-persona/info-persona.component';
import { Page } from '../../../../shared/models/page';
import { CentrosService } from 'app/shared/services/centros.service';

export class ChoferTransportista {
  patente: string;
  id_chofer: number;
  id_persona: number;
  nombre_chofer: string;
  id_equipo: number;
  tipo_camion: string;
  total_viajes: number;
  viajes_completados: number;
  ranking: number;
}

@Component({
  selector: 'app-listado-choferes',
  templateUrl: './listado-choferes.component.html',
  styleUrls: ['./listado-choferes.component.scss']
})
export class ListadoChoferesComponent implements OnInit {
  public choferes: ChoferTransportista[];
  page = new Page();
  public getItemSub: Subscription;
  public filtro;
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ListadoChoferesComponent>,
    private dialog: MatDialog,
    private centrosService: CentrosService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.filtro = this.data.payload;
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro === undefined) {
      this.filtro = '';
    }
    this.centrosService.getChoferByTransportista(this.page.pageNumber, this.filtro).subscribe(pageData => {
      this.choferes = pageData.data;
      this.page.totalElements = pageData._meta.totalCount;
      this.page.pageNumber = pageData._meta.currentPage - 1;
      this.page.size = pageData._meta.perPage;
    });
  }

  openPopUpInfoPersona(data: any = {}) {
    let title = 'Información de la Persona';
    let dialogRef: MatDialogRef<any> = this.dialog.open(InfoPersonaComponent, {
      width: '720px',
      height: '73vh',
      disableClose: true,
      data: { title: title, payload: { id: data.id_chofer } }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        return;
      });
  }

}
