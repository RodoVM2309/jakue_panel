import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { SendMessage } from '../disponibles.component'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { DestinosService } from 'app/shared/services/destinos.service';
import { AppAtencionService } from "app/shared/services/app-atencion/app-atencion.service";
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { SendsmsService } from 'app/shared/services/sendsms.service';
import { AddSmsComponent } from 'app/shared/components/home/asignar-viaje/add-sms/add-sms.component';
import { SelectionModel } from '@angular/cdk/collections';
import { EnviarSmsChoferesComponent } from '../enviar-sms-choferes/enviar-sms-choferes.component';

export class Chofer {
  id: number;
  position: number;
  inicio: string;
  fin: string;
  id_chofer: number;
  id_cupo: number;
  fecha: string;
  id_producto: number;
  id_puerto: number;
  nombreChofer: string;
  nombreProducto: string;
  nombrePuerto: string;
  telefonoChofer: string;
  cuitChofer: string;
  patenteCamion: string;
  patenteAcoplado: string;
  dominio?: string;
  checked?: boolean;
}
@Component({
  selector: 'app-info-ventanilla',
  templateUrl: './info-ventanilla.component.html',
  styleUrls: ['./info-ventanilla.component.scss'],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class InfoVentanillaComponent implements OnInit {
  listChofer: Chofer[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    "cuitChofer",
    "nombreChofer",
    "telefonoChofer",
    'select',
  ];
  listMensajes: SendMessage[];
  nombreProducto: string;
  nombrePuerto: string;
  idCupo: string;
  selection = new SelectionModel<Chofer>(true, []);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InfoVentanillaComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private destinosService: DestinosService,
    private atencionService: AppAtencionService,
    private errorService: AppErrorService,
    private smsService: SendsmsService,
    private dialog: MatDialog,
    private snack: MatSnackBar) { }

  ngOnInit() {
    let data = {
      id_horario: this.data.payload.id_horario,
      inicio: this.data.payload.inicio,
      fin: this.data.payload.fin,
      fecha: this.data.payload.fecha,
      id_puerto: this.data.payload.id_puerto,
      id_producto: this.data.payload.id_producto
    }
    //console.log(data);
    this.getChoferes(data);
  }

  getChoferes(data) {
   
    this.loader.open();
    this.listChofer = [];
    this.destinosService.getChoferesVentanilla(data)
      .subscribe(pagedData => {
        this.loader.close();
        this.listChofer = pagedData.data;
        this.nombreProducto = this.listChofer[0].nombreProducto;
        this.nombrePuerto = this.listChofer[0].nombrePuerto;
        this.idCupo = this.listChofer[0].id_cupo.toString();
        this.dataSource.data = this.listChofer;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'Error, al buscar los choferes con turno' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });

  }
  submit() {

    this.dialogRef.close();

  }
  /* openPopUpsms(row) {
    let title = 'Mensaje SMS al Chofer: ' + row.nombreChofer;
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddSmsComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: row }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        let data = {
          number: row.telefonoChofer,
          message:res.mensaje
        }
        console.log('Mensaje',data);
        this.loader.close();
        this.smsService.postSMS(data)
        .subscribe(pagedData => {
          this.loader.close();
          this.snack.open("¡SMS Enviados!", "OK", { duration: 4000 });

        },
          err => {
            this.loader.close();
            this.errorService.confirm({ message: 'Error, al enviar SMS al chofer' }).subscribe(res => {
              if (res) {
                return;
              }
            });
          });

      });

  } */

  onCheckboxChangeRowAll() {
    this.listChofer.forEach(element => {
      element.checked = true;
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        row.checked = true;
        this.selection.select(row);
      });
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Chofer): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  openPopUpsms() {
    let title = 'Contactar ';
    let dialogRef: MatDialogRef<any> = this.dialog.open(EnviarSmsChoferesComponent, {
      width: '720px',
      disableClose: true,
      data: {
        title: title, payload: {}
      }
    });
   
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        } else {
          this.loader.open();
          let tempArray = [];
          let lista = [];
          this.selection.selected.forEach(element => {
            tempArray.push(element.telefonoChofer)
          });
          if(this.selection.selected.length>0){
            lista.push(this.selection.selected[0]['id_horario']);
          }        
          let data = {
            number:tempArray,
            horarios: lista,
            mensaje: res.body
          }
          this.loader.close();
          this.destinosService.postSmsDestino(data)
            .subscribe(pagedData => {
              this.loader.close();
              this.snack.open("¡WhatsApp enviado!", "OK", { duration: 4000 });

            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Error, al enviar WhatsApp al chofer' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });

  }

}
