import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { MessageService } from 'app/shared/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { Whatsapp } from '../../../shared/models/centro';
import { Page } from '../../../shared/models/page';
import { CentrosService } from './../../../shared/services/centros.service';
import { MatDialogRef, MatDialog, MatSnackBar, MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { AddUsuarioWhatsappComponent } from './add-usuario-whatsapp/add-usuario-whatsapp.component';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';


@Component({
  selector: 'app-usuario-whatsapp',
  templateUrl: './usuario-whatsapp.component.html',
  styleUrls: ['./usuario-whatsapp.component.scss']
})
export class UsuarioWhatsappComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public itemForm: FormGroup;
  usuarioWhatsapp: string = '0';
  public whatsapp: Whatsapp[];
  page = new Page();
  usuarioWhatsapp1: boolean = false;
  usuarioWhatsapp0: boolean = false;
  chanceValue: boolean = false;
  public getItemSub: Subscription;
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };
  tipoAccionInicial: number = 0;
  displayedColumns: string[] = ['razon_social', 'cuit_cliente', 'telefono', 'acciones'];
  dataSource = new MatTableDataSource();
  
  constructor(private formBuilder: FormBuilder, 
    private centrosService: CentrosService,
    private loader: AppLoaderService, 
    private alertService: AppAlertService,
    private errorService: AppErrorService, 
    private dialog: MatDialog, 
    private snack: MatSnackBar,
    private confirmService: AppConfirmService, ) {
    this.page.pageNumber = 0;
    this.page.size = 5;
  }

  ngOnInit() {
    
    this.paginator._intl.itemsPerPageLabel = "Usuarios por Página";
    this.paginator._intl.nextPageLabel = "Siguiente";
    this.paginator._intl.firstPageLabel = "Primero";
    this.paginator._intl.lastPageLabel = "Último Usuario";
    this.paginator._intl.previousPageLabel = "Anterior";
    this.setPage({ offset: 0 });
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
   
    this.centrosService.getUsuariosWhatsapp(this.page.pageNumber).subscribe(pagedData => {
      this.whatsapp = pagedData.data;
      this.dataSource.data= this.whatsapp;
      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage - 1;
      this.page.size = pagedData._meta.perPage;

    });
  }
  openPopUpUsuarioWhatsapp() {
    let title = 'Agregar Usuario Whatsapp';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddUsuarioWhatsappComponent, {
      width: '50vw',
      height: '40vh',
      disableClose: true,
      data: { title: title }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.centrosService.postUsuariosWhatsapp(res)
          .subscribe(data => {
            this.whatsapp.unshift(data);
            this.setPage({ offset: 0 });
            if (this.loader !== null) {
              this.loader.close();
            }
            this.snack.open('Usuario Whatsapp agregado al centro!', 'OK', { duration: 4000 });
            return;
          });
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({ message: '¿Está seguro que desea eliminar del cliente: ' + row.razon_social + '?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.centrosService.deleteUsuariosWhatsapp( row.id)
            .subscribe(data => {
              this.loader.close();
              this.setPage({ offset: 0 });              
              this.alertService.confirm({ message: '¡Cliente eliminado!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            },
            err => {
              this.loader.close();
              this.errorService.confirm({ message: 'No se pudo eliminar el cliente' }).subscribe(res => {
                if (res) {
                  return;
                }
              });
            });
        }
      });
  }
  
  

}
