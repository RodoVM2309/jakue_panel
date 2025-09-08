import { Component, OnInit,Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl,Validators } from '@angular/forms';
import { AppLoaderService, FertilizantesService, ReservasService } from "@app/shared/services";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';

@Component({
  selector: 'app-derivar-reserva',
  templateUrl: './derivar-reserva.component.html',
  styleUrls: ['./derivar-reserva.component.scss']
})
export class DerivarReservaComponent implements OnInit {

  public proveedor:number = null;
  public terminal:number = null;
  public listProveedor:any[] = [];
  public listTerminales:any[] = [];
  public listReservas:number[] = [];

  constructor(
    public reservasService: ReservasService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public alertService: AppAlertService,
    public errorService: AppErrorService,
    public loaderService: AppLoaderService
  ) { 
    this.listReservas = this.data.payload.reservas;
    console.log( "Reservas = ", this.data.payload.reservas);
  }

  ngOnInit() {
    console.log(this.data);
    this.loaderService.open();
    this.listReservas = this.data.payload.reservas;
    this.reservasService.listaProveedores().subscribe(resp => {
      this.loaderService.close();
      console.log("listaProveedores = ",resp);
      this.listProveedor = resp.data;
    });
  }

  getTerminales(){
    this.listTerminales = [];
    this.loaderService.open();
    this.reservasService.listaTerminales(this.proveedor).subscribe(resp => {
      this.loaderService.close();
      this.listTerminales = resp.data;
      console.log(resp);
    });
  }

  derivarReserva(){
    let reserva = {
      "reservas": this.listReservas,
      "id_proveedor": this.proveedor,
      "id_origen": this.terminal
    }
    this.loaderService.open();
    this.reservasService.derivarReserva(reserva).subscribe(resp => {
      console.log(resp);
      this.loaderService.close();
      if( resp.success ){
        this.dialogRef.close();
        this.alertService
          .confirm({
            message: resp.data.message,
            tipo: "exito"
          });
      } else {
        this.errorService
          .confirm({
            message: resp.data.message
          });
      }
      

    });
  }

}
