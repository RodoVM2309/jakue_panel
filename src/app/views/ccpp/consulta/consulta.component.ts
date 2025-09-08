import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Page } from 'app/shared/models/page';
import { CcppService } from '../../../shared/services/ccpp.service';
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VerCcppComponent } from './ver-ccpp/ver-ccpp.component';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {
  public criteriosBusqueda = [
    { "id": 'alfanumerico', "descripcion": "N de cupo" },
    { "id": 'ccpp', "descripcion": "CCPP" },
    { "id": 'ctg', "descripcion": "CTG" }
  ]
  public lista_consulta: any[];
  public getItemSub: Subscription;
  page = new Page();
  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Cabeceras</span>
      </div>
    `
  };
  filtro = {
    criterio: 'alfanumerico',
    valorbusqueda: ''
  };

  buscarForm: FormGroup;

  constructor(private ccppService: CcppService,
    private errorService: AppErrorService,
    private loader: AppLoaderService,
    private dialog: MatDialog,
    private confirmService: AppConfirmService,
    private alertService: AppAlertService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.setPage({ offset: 0 });
    this.buscarForm = this.fb.group({
      criterio: ['alfanumerico'],
      valorbusqueda: [''],
    });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
    if (this.filtro === undefined) {
      this.filtro = {
        criterio: '',
        valorbusqueda: ''
      };
    }
    this.loader.open('Buscando consultas');
    this.getItemSub = this.ccppService.getConsultas(this.page.pageNumber)
      .subscribe(pagedData => {
        this.loader.close();
        this.lista_consulta = pagedData.data;
        this.page.totalElements = pagedData._meta.totalCount;
        this.page.pageNumber = pagedData._meta.currentPage;
        this.page.size = pagedData._meta.perPage;
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'Error, al buscar las consultas' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
  }

  buscarConsulta() {
    let criterio = this.buscarForm.controls['criterio'].value;
    let valorbusqueda = this.buscarForm.controls['valorbusqueda'].value;
    let objBusq = { campo: criterio, valor: valorbusqueda };
    if (valorbusqueda.length === 0) {
      this.setPage({ offset: 0 });
    } else {
      this.loader.open('Buscando...');
      this.ccppService.searchConsultas(objBusq)
        .subscribe(pagedData => {
          this.loader.close();
          this.lista_consulta = pagedData.data;
          this.page.totalElements = pagedData._meta.totalCount;
          this.page.pageNumber = pagedData._meta.currentPage;
          this.page.size = pagedData._meta.perPage;
        },
          err => {
            this.loader.close();
            this.errorService.confirm({ message: 'Error, al buscar consultas' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          });
    }
  }

  aplicarFiltroProducto($event) {
    console.log($event)
    this.buscarForm.controls['valorbusqueda'].setValue('');
  }

  openPopUpVer(row: any = {}) {
    this.ccppService
      .getCartaPorte(row.id)
      .subscribe(data => {
        console.log(data);
        let title = 'Ver Carta Porte';
        let dialogRef: MatDialogRef<any> = this.dialog.open(VerCcppComponent, {
          width: '75vw',
          height: '90vh',
          disableClose: true,
          data: {  cartaPorte: data.data,cabecera:null}
        });
        dialogRef.afterClosed()
          .subscribe(res => {
            if (!res) {
              return;
            } else {
            }
          });


      });


  }


}
