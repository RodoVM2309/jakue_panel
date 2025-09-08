import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { Page } from '../../../../shared/models/page';
import { AppErrorService } from '../../../../shared/services/app-error/app-error.service';
import { AppAtencionService } from '../../../../shared/services/app-atencion/app-atencion.service';


import { CombustibleService } from './../../../../shared/services/combustible.service';
import { RetiroCombustible } from '../../../models/retiro-combustible';
import { EditOrdenComponent} from './edit-orden/edit-orden.component';
import { AddSmsComponent } from '../../home/asignar-viaje/add-sms/add-sms.component';
export interface MostrarFiltro {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-ordenes-retiro',
  templateUrl: './ordenes-retiro.component.html',
  styleUrls: ['./ordenes-retiro.component.scss']
})
export class OrdenesRetiroComponent implements OnInit, OnDestroy {
  public getItemSub: Subscription;
  public ordenesRetiro: RetiroCombustible[];
  page = new Page();
  filtro = {
    patente: '',
    cuit: '',
    transportista: '',
    nombre: '',
    estado:0
  };
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };
  selectedFilter:any;
  mostrarFiltro: MostrarFiltro[] = [
    { value: -1, viewValue: "Todas" },
    { value: 0, viewValue: "Pendientes" },
    { value: 1, viewValue: "Aprobadas" },
    { value: 2, viewValue: "Rechazadas" },
  ];
  constructor(private combustibleService: CombustibleService, public router: Router, private dialog: MatDialog,
    private snack: MatSnackBar, private confirmService: AppConfirmService,   
    private errorService: AppErrorService, private atencionService: AppAtencionService,
    private loader: AppLoaderService, private alertService: AppAlertService) {
      this.page.pageNumber = 0;
    this.page.size = 10;
     }

  ngOnInit() {
    this.setPage({ offset: 0 });
    this.selectedFilter=0;
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset + 1;
      if (this.filtro === undefined) {
        this.filtro = {
          patente: '',
          cuit: '',
          transportista: '',
          nombre: '',
          estado:0 
        };
      };
    this.combustibleService.getAllRetiroCombustible(this.page.pageNumber, this.filtro)
    .subscribe(pagedData => {
      this.ordenesRetiro = pagedData.data;   
      this.page.totalElements = pagedData._meta.totalCount;
      this.page.pageNumber = pagedData._meta.currentPage;
      this.page.size = pagedData._meta.perPage;
    });
  }
  updateFilter(event, param) {
    const val = event.target.value.toLowerCase();

    switch (param) {
      case 'patente':
        this.filtro.patente=val;
        break;
        case 'cuit':
        this.filtro.cuit=val;
        break;
        case 'transportista':
        this.filtro.transportista=val;
        break;
        case 'nombre':
        this.filtro.nombre=val;
        break;
      default:
        break;
    }
    // this.filtro = event.target.value.toLowerCase();
    this.setPage({ offset: 0 });
    /* const temp = this.corredores.filter(function (d) {
      return d.nombre_corredor.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.corredores = temp;
    if (val === '') {
      this.setPage({ offset: 0 });
    } */
  }
  chanceFiltro(){
    this.filtro.estado=this.selectedFilter;
    this.setPage({ offset: 0 });
    
  }
  isCustomizerOpen: boolean = false;
  limpiarFiltros(){
    this.filtro = {
      patente: '',
      cuit: '',
      transportista: '',
      nombre: '',
      estado:-1 
    };
    this.setPage({ offset: 0 });
  }
  aprobarCombustible(row:RetiroCombustible,state: number) {
    let msg1 = '';
    let msg2 = '';
    switch (state) {
      case 1:
        msg1='aprobar';
        msg2='aprobado';
        row.estado = 1;
        break;
        case 2:
          msg1='rechazar';
          msg2='rechazado';
          row.estado = 2;
        break;
    
      default:
          msg1='aprobar';
          msg2='aprobado';
        break;
    }    
    this.confirmService.confirm({ message: '¿Está seguro de ' +msg1+' la orden de combustible del chofer '+row.nombreChofer+' ?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();          
          this.combustibleService.updateRetiroCombustible(row)
            .subscribe(data => {            
              this.setPage({ offset: 0 });
              this.loader.close();
              this.snack.open('Combustible ' +msg2+'!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Este Combustible no se puede ' +msg1+'' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }
  
  deleteCombustible(row:RetiroCombustible) {
    this.confirmService.confirm({ message: '¿Está seguro de eliminar la orden de combustible del chofer '+row.nombreChofer+' ?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.combustibleService.deleteRetiroCombustible(row)
            .subscribe(data => {            
              this.setPage({ offset: 0 });
              this.loader.close();
              this.snack.open('Combustible eliminado!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Este Combustible no se puede eliminar' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }
  openPopUp(data: any = {}) {
    let title =  "Editar Cantidad de Litros " ;
    let dialogRef: MatDialogRef<any> = this.dialog.open(EditOrdenComponent, {
      width: '40vw',
      height: '35vh',
      disableClose: true,
      data: { title: title, payload: data }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.loader.open();     
      this.combustibleService.updateRetiroCombustible(res)
        .subscribe(
          data => {
            this.setPage({ offset: 0 });
              this.loader.close();
              this.snack.open('Cantidad de Combustible modificada satisfactoriamente!', 'OK', { duration: 4000 });
          },
          err => {
            this.loader.close();
            this.alertService
              .confirm({ message: "Error no se puede modificar" })
              .subscribe(res => {
                if (res) {
                  return;
                }
              });
          }
        );
      
    });
  }

  openPopUpwhatsapp(data: any = {}, isNew?) {
    let data2 = {
      mensaje: '',
      celular: data.telefonoChofer
    }
    let title = 'Mensaje Whatsapp al Chofer';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddSmsComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data2, isNew: isNew }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        var newString = res.mensaje.replace('', "%20");
        window.open("https://web.whatsapp.com/send?phone=+549" + res.celular + "&text=" + newString, "_blank");
      });
  }

}
