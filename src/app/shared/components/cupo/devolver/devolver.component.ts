import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatRadioChange } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material";
import { Cupo } from 'app/shared/models/cupo';
import { CupoService } from '../cupo.service';
import { CupoDemandado } from '../asignacion/asignacion.component';
import { AppAlertService } from "../../../../shared/services/app-alert/app-alert.service";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { AddSmsComponent } from '../../home/asignar-viaje/add-sms/add-sms.component';
import { SendsmsService } from '../../../services/sendsms.service';
import { AppAtencionService } from '../../../../shared/services/app-atencion/app-atencion.service';
@Component({
  selector: 'app-devolver',
  templateUrl: './devolver.component.html',
  styleUrls: ['./devolver.component.scss']
})
export class DevolverComponent implements OnInit {
  cupos: Cupo[] = [];
  cupoSeleccionados: Cupo[] = [];
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    "dadorCuit",
    "alfanumericoCupo",
    "nombreDestino",
    "selectedCupo",
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  id_producto: number;
  countCuposDisponibles: number = 0;
  countCuposSeleccionados: number = 0;
  nombreDador: string = '';
  numberDador: string = '';
  producto: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DevolverComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private cupoService: CupoService,
    private alertService: AppAlertService,
    private errorService: AppErrorService,
    private smsService: SendsmsService,
    private atencionService: AppAtencionService,
    private snack: MatSnackBar, ) { }

  ngOnInit() {
    //this.getCupoInformacion(this.data.payload.fecha, this.data.payload.solicitudCupos, this.data.payload.simple);
    let tempCupos = this.data.payload.solicitudCupos.cupos;
    tempCupos.forEach(cup => {
      if (!cup.asignado )
        this.cupos.push(cup);
    });
    this.dataSource.data = this.cupos;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.countCuposDisponibles = this.cupos.length;
  }
  getCupoInformacion(fecha, arraySolicitud: any, simple: boolean) {

    if (arraySolicitud.length > 0) {
      this.cupos = [];
      arraySolicitud.forEach(element => {
        this.nombreDador = element.nombre_dador;
        this.numberDador = element.nombre_dador;
        if (element.pendientes1 > 0) {
          this.id_producto = 1;
          this.producto = 'SOJA'
        };
        if (element.pendientes2 > 0) {
          this.id_producto = 2;
          this.producto = 'MAIZ'
        };
        if (element.pendientes3 > 0) {
          this.id_producto = 3;
          this.producto = 'TRIGO'
        };
        if (element.pendientes4 > 0) {
          this.id_producto = this.data.payload.filtro.id_producto;
          this.producto = this.data.payload.filtro.producto;
        };
        if (element.pendientes5 > 0) {
          this.id_producto = 5;
          this.producto = 'GIRASOL'
        };
        if (simple) {
          this.cupoService.getInfoCuposDevolver(fecha, this.id_producto, element.id_dador)
            .subscribe(
              res => {
                let tempCupos = res.data;
                tempCupos.forEach(cup => {
                  if (cup.asignado != "1")
                    this.cupos.push(cup);
                });
                this.dataSource.data = this.cupos;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.countCuposDisponibles = this.cupos.length;


              },
              error => {
              });
        } else {
          this.cupoService.getInfoCupos(fecha, this.id_producto, element.id_dador, element.id_destino)
            .subscribe(
              res => {
                let tempCupos = res.data;
                tempCupos.forEach(cup => {
                  if (cup.asignado != "1")
                    this.cupos.push(cup);
                });
                this.dataSource.data = this.cupos;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.countCuposDisponibles = this.cupos.length;


              },
              error => {
              });
        }
      })
    } else {
      this.dataSource.data = this.cupos;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    };
  }
  onCheckboxChange(chck, cupo, index) {
    if (chck.checked) {
      this.cupoSeleccionados.push(cupo);
      this.cupos[index].asignado = chck.checked;
      this.countCuposSeleccionados = this.cupoSeleccionados.length;
      this.countCuposDisponibles--;
    }
    else {
      this.cupos[index].asignado = chck.checked;
      let tempArray = [];
      this.cupoSeleccionados.forEach(element => {
        if (element.id != cupo.id) {
          tempArray.push(element)
        }
      })
      this.cupoSeleccionados = tempArray;
      this.countCuposSeleccionados = this.cupoSeleccionados.length;
      this.countCuposDisponibles++;
    }
  }
  devolverCupos() {
    if (this.cupoSeleccionados.length > 0) {
      let cupos = [];
      this.cupoSeleccionados.forEach(element => {
        cupos.push(element.id)
      });
      this.cupoService.devolverCupos(cupos)
        .subscribe(
          res => {
            this.alertService
              .confirm({
                message: "Cupos devueltos correctamente!",
                tipo: "exito"
              })
              .subscribe(res1 => {
                if (res1) {
                  this.dialogRef.close(1);
                  return;
                }
              });
          },
          err => {
            this.errorService.confirm({
              message: "Cupos no devueltos"
            })
          });
    }
  }
  openPopUpsms() {
    let title = 'Mensaje WhatsApp al Dador: ' + this.nombreDador;
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddSmsComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: '' }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        var newString = res.mensaje.replace('', "%20");
        window.open("https://web.whatsapp.com/send?phone=+549" + this.numberDador + "&text=" + newString, "_blank");
      });

  }
  submit() {
    this.dialogRef.close();
  }

}
