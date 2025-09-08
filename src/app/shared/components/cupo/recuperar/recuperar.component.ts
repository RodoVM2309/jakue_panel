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
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { AppAlertService } from "../../../../shared/services/app-alert/app-alert.service";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { AddSmsComponent } from '../../home/asignar-viaje/add-sms/add-sms.component';
import { SendsmsService } from '../../../services/sendsms.service';
import { AppAtencionService } from '../../../../shared/services/app-atencion/app-atencion.service';
import { MotivoRechazoComponent } from './motivo-rechazo/motivo-rechazo.component';
@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.scss']
})
export class RecuperarComponent implements OnInit {
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
  nombreReceptor: string = '';
  numberReceptor: string = '';
  producto: string = '';
  mycuit: string = "";
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RecuperarComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private cupoService: CupoService,
    private alertService: AppAlertService,
    private errorService: AppErrorService,
    private loader: AppLoaderService,
    private smsService: SendsmsService,
    private atencionService: AppAtencionService,
    private snack: MatSnackBar,) { }

  ngOnInit() {
    //this.getCupoInformacion(this.data.payload.fecha, this.data.payload.solicitudCupos);
    this.mycuit = localStorage.getItem("cuit_cuil");
    let tempCupos = this.data.payload.solicitudCupos.cupos;
    this.producto = this.data.payload.producto;
    this.nombreReceptor = this.data.payload.nombreReceptor;
    tempCupos.forEach(cup => {
      cup.seleccionado = false;
      if (cup.id_pedido == null && cup.estadoViaje == null &&
        (cup.idCupoEstado == '1' || cup.idCupoEstado == null) && cup.cupoAsignadoUltimo) {
        if (cup.cupoAsignadoUltimo.dadorCuit == this.mycuit ||
          (cup.cupoAsignadoUltimo.receptorCuit == this.mycuit && cup.cupoAsignadoUltimo.vinculado == '1')) {
          this.cupos.push(cup);
        }
      }
    });
    this.dataSource.data = this.cupos;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.countCuposDisponibles = this.cupos.length;

  }
  getCupoInformacion(fecha, arraySolicitud: any) {

    if (arraySolicitud.length > 0) {
      this.cupos = [];
      arraySolicitud.forEach(element => {
        this.nombreReceptor = element.nombre_receptor;
        this.numberReceptor = element.nombre_receptor;
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
          this.id_producto = 4;
          this.producto = 'OTROS'
        };
        if (element.pendientes5 > 0) {
          this.id_producto = 5;
          this.producto = 'GIRASOL'
        };

        this.cupoService.getInfoCuposRecuperar(fecha, this.id_producto, element.id_receptor)
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
      this.cupos[index].seleccionado = chck.checked;
      this.countCuposSeleccionados = this.cupoSeleccionados.length;
      this.countCuposDisponibles--;
    }
    else {
      this.cupos[index].seleccionado = chck.checked;
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

  recuperarCupos() {
    let dialogRef: MatDialogRef<any> = this.dialog.open(MotivoRechazoComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
      if (this.cupoSeleccionados.length > 0) {
        let cupos = [];
        let id_motivo_recuperar = res.id_motivo_recuperar;
        let motivo_recuperar = res.motivo_recuperar;
        this.cupoSeleccionados.forEach(element => {
          cupos.push(element.id)
        });
        this.loader.open();
        this.cupoService.recuperarCupos(cupos, id_motivo_recuperar, motivo_recuperar)
          .subscribe(
            res => {
              this.loader.close();
              this.alertService
                .confirm({
                  message: "¡Cupos recuperados correctamente!",
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
              this.loader.close();
              this.errorService.confirm({
                message: "Cupos no recuperados, ha ocurrido un error."
              })
            });
      }
      return;
    });

  }
  openPopUpsms() {
    let title = 'Mensaje WhatsApp al Receptor: ' + this.nombreReceptor;
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddSmsComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: '' }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        var newString = res.mensaje.replace('', "%20");
        window.open("https://web.whatsapp.com/send?phone=+549" + this.numberReceptor + "&text=" + newString, "_blank");
      });

  }
  submit() {
    this.dialogRef.close();
  }

}
