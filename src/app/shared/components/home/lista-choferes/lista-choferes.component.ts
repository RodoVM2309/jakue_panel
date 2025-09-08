import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import {
  MatTableDataSource,
  MatDialog,
} from "@angular/material";
import { Subscription } from 'rxjs';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { AppErrorService } from '../../../../shared/services/app-error/app-error.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { AppAlertService } from '../../../../shared/services/app-alert/app-alert.service';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { ListaChoferesObservacionesComponent } from './lista-choferes-observaciones/lista-choferes-observaciones.component';
import { AddCupoComponent } from '../asignar-viaje/add-cupo/add-cupo.component';
import { Cupo } from 'app/shared/models/cupo';


export class ChoferLista {
  id_lista: number;
  orden: number;
  id_chofer: number;
  viajes: number;
  kg: number;
  premio: number;
  sancion: number;
  estado: number;
  desde: string;
  hasta: string;
  observaciones: string;
  id_chofer_equipo: number;
  movil_key: number;
  coco: string;
  nombre_chofer: string;
  telefono: string;
  mostrar: boolean;
  habilitado: boolean;
  ocupado: string;
  observ: string;
  cupo: string;
  id_cupo:'';
  // tslint:disable-next-line:eofline
}
@Component({
  selector: 'app-lista-choferes',
  templateUrl: './lista-choferes.component.html',
  styleUrls: ['./lista-choferes.component.scss']
})
export class ListaChoferesComponent implements OnInit {
  pedido: any;
  idParam: string = "";
  public choferes: ChoferLista[];
  public getItemSub: Subscription;
  public cantidad_pedido: number = 0;
  public countSelected: number = 0;
  isLoading: boolean;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    "nombre",
    "viajes",
    "premio",
    "sancion",
    "telefono",
    "cupo",
    "acciones",
    "observ"
  ];
  public cupos: Cupo[] = []; //
  contadorCupoAsignados: number = 0;
  tieneCupoPedido: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ListaChoferesComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private errorService: AppErrorService,
    private alertService: AppAlertService,
    private confirmService: AppConfirmService,
    private nomecladoresServices: NomencladoresService,
    private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {
    this.isLoading = true;
    this.getItemSub = this.nomecladoresServices
      .getPedido(this.data.payload.id_pedido)
      .subscribe(data => {
        this.pedido = data.data;
        this.cupos=this.pedido.cupos;
        this.cantidad_pedido = data.data.viajes_x_asignar;
        this.countSelected = this.cantidad_pedido;
        this.getchoferes();
      }), err => {
      }

  }
  getItemPedido() {
    this.choferes = [];
    var choferTemp: ChoferLista;
    this.loader.open();
    this.getItemSub = this.nomecladoresServices
      .getChoferesPropuestaTurnear(this.data.payload.id_pedido)
      .subscribe(data => {
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].id_equipo !== null) {
            choferTemp = data.data[i];
            choferTemp.cupo='';
            if (i <= this.cantidad_pedido - 1) {
              choferTemp.mostrar = true;
            }
            else
              choferTemp.mostrar = false;
            choferTemp.habilitado = false;
            this.choferes.push(choferTemp);
          };

          this.isLoading = false;
          this.loader.close();
        }
      }), err => {
        this.loader.close();
      };
  }
  getchoferes() {
    this.choferes = [];
    var choferTemp: ChoferLista;
    this.loader.open();
    this.getItemSub = this.nomecladoresServices
      .getChoferesPropuestaTurnear(this.data.payload.id_pedido)
      .subscribe(data => {
        let count = 0;
        this.countSelected = 0;
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].id_equipo !== null) {
            choferTemp = data.data[i];
            choferTemp.cupo='';
            choferTemp.id_cupo='';
            if (count <= this.cantidad_pedido - 1) {
              if (choferTemp.ocupado == '0') {
                count++;
                choferTemp.mostrar = true;
              }
              else
                choferTemp.mostrar = false;
            }
            else {
              choferTemp.mostrar = false;
              choferTemp.habilitado = true;
            }
            choferTemp.observ = '';
            this.choferes.push(choferTemp);
          };
        };
        this.countSelected = this.countSelect();
        this.dataSource.data = this.choferes;
        this.isLoading = false;
        this.loader.close();

      }), err => {
        this.loader.close();
      };
  }

  deleteList(row) {
    var isSearch = false;
    for (let index = 0; index < this.choferes.length; index++) {
      const element = this.choferes[index];
      if (element.id_chofer === row.id_chofer) {
        this.mostrarProximo();
        this.choferes[index].mostrar = false;
        this.choferes[index].habilitado = true;
      }
    }
    let temp = [];
    this.choferes.forEach(element => {
      if (element.mostrar)
        temp.push(element)
    })
    this.dataSource.data = temp;
    this.countSelected = this.countSelect();
  }

  mostrarProximo() {
    let encontrado = false;
    for (let index = 0; index < this.choferes.length && !encontrado; index++) {
      const element = this.choferes[index];
      if (!element.mostrar && !element.habilitado) {
        this.choferes[index].mostrar = true;
        encontrado = true;
      }
    }
  }

  countSelect(): number {
    let count = 0;
    this.choferes.forEach(element => {
      if (element.mostrar)
        count++;
    });
    return count;

  }
  probar() {
    this.confirmService.confirm({ message: '¡Solo se pudieron asignar  ' + 3 + 'choferes: ' })
      .subscribe(res => {
        if (res) {
          this.dialogRef.close();
          return;
        }
      })
  }
  guardar() {
    let chofer_equipo = [];
    this.choferes.forEach(element => {
      if (element.mostrar)
        chofer_equipo.push({
           id_chofer_equipo: element.id_chofer_equipo,
            observaciones: element.observ,
            id_cupo: element.cupo!==''?  element.id_cupo:null
          })
    });
    let data = {
      id_pedido: this.pedido.id,
      chofer_equipo: chofer_equipo
    };
    this.loader.open();
    this.nomecladoresServices.postPropuestaTurnear(data)
    .subscribe(
      data => {
        this.loader.close();
        if (this.countSelected != data.data) {
          this.confirmService.confirm({ message: '¡Solo se pudieron asignar  ' + data.data + 'choferes: ' })
            .subscribe(res => {
              if (res) {
                this.dialogRef.close();
                return;
              }
            })


        } else {
          this.alertService
            .confirm({ message: "¡Choferes asignados al pedido correctamente!", tipo: "exito" })
            .subscribe(res => {
              if (res) {
                this.dialogRef.close();
                return;
              }
            });
        }

      }), err => {
        this.errorService
          .confirm({
            message: "Error al agregar choferes al pedido"
          })
          .subscribe(res => {
            if (res) {
              if (this.loader)
                this.loader.close();
              return;
            }
          });
      }
  }

  onCheckboxChange(chck, chofer, index) {
    if (chck.checked) {
      if (this.countSelected + 1 <= this.cantidad_pedido) {
        this.countSelected++;
        this.choferes[index].mostrar = chck.checked;
        if (this.countSelected == this.cantidad_pedido) {
          for (let i = 0; i < this.choferes.length; i++) {
            const element = this.choferes[i];
            if (!this.choferes[i].mostrar)
              this.choferes[i].habilitado = true;
          }
        }
      }
    }
    else {
      this.choferes[index].mostrar = chck.checked;
      for (let i = 0; i < this.choferes.length; i++) {
        this.choferes[i].habilitado = false;
      }
    };
    this.countSelected = this.countSelect();
  }

  cancelar() {
    this.dialogRef.close();
  }

  popupObservac(row, id) {
    let title = "Observaciones";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ListaChoferesObservacionesComponent,
      {
        width: "50vw",
        height: "30vh",
        disableClose: true,
        data: {
          title: title,
          payload: row.observ
        }
      }
    );
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.choferes[id].observ = res.observaciones;
      this.changeDetectorRefs.detectChanges();
      return;
    });
  }
  openPopUpSelectCupo(row: ChoferLista) {
    let heightPop: number = 30 + (this.cupos.length * 10);
    let heightPopUp: string = '30vh';
    if (heightPop > 80) heightPopUp = '80vh'
    else heightPopUp = heightPop.toString();
    let title = "SELECCIÓN DE CUPOS";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AddCupoComponent,
      {
        width: "95vw",
        height: heightPopUp,
        disableClose: false,
        data: {
          title: title,
          payload: {
            cupos: this.cupos
          }
        }
      }
    );

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        row.cupo = res.idCupoTerminal;
        row.id_cupo=res.id_cupo;
        let tempArray = [];
        this.cupos.forEach(element => {
          if (element.idCupoTerminal != res.idCupoTerminal)
            tempArray.push(element)
        });
        this.contadorCupoAsignados++;
        this.cupos = tempArray;
        this.changeDetectorRefs.detectChanges();
      }
      return;
    });
  }

  eliminarCupoChofer(row) {
    let cup: Cupo;
    this.pedido.cupos.forEach(element => {
      if (element.alfanumericoCupo === row.cupo)
        cup = element;
    });
    if (cup) {
      this.cupos.push(cup);
      row.cupo = '';
    }
  }

  validateForm(){
    let isValid= false;
    isValid= this.countSelected==0?true:false;
    if (!isValid && this.pedido.cupos.length>0){
      this.choferes.forEach(element => {
        if (element.mostrar && element.cupo==='') {
          isValid= true;
          return isValid;
        }
      });
    }
    return isValid
  }



}
