import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

import { MatTable, MatTableDataSource, PageEvent, MatSnackBar } from '@angular/material';
import { MatDialogRef, MatDialog } from '@angular/material';

import { MagypService } from 'app/shared/services/magyp.service';
import { Test } from 'app/shared/models/magyp-cadena';
import { AddTestComponent} from './add-test/add-test.component';
import { InfoTestComponent } from './info-test/info-test.component';
import { EnviarSmsTransComponent } from './enviar-sms-trans/enviar-sms-trans.component';
import { SendsmsService } from 'app/shared/services/sendsms.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  buscarForm: FormGroup;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    "transportista",
    "patente",
    "cuit",
    "cadena",
    "fecha",
    "test",
    "localidad",
    "autoridad",
    "seguimiento",
    "app",
    "acciones",
  ];
  test: Test[] = [];
  pageEvent: PageEvent = new PageEvent();


  constructor(private fb: FormBuilder,
    private loader: AppLoaderService,
    private magypService: MagypService,
    private dialog: MatDialog,
    private smsService: SendsmsService,
    private snack: MatSnackBar,
    private alertService: AppAlertService
    ) {
      this.pageEvent.pageIndex = 0;
      this.pageEvent.pageSize = 10;
     }

  ngOnInit() {
    this.buscarForm = this.fb.group({
      cuit: ['', Validators.required]
    });
    this.dataSource.data = this.test;
    this.setPage(this.pageEvent);
  }

  setPage(event?: PageEvent) {
    this.loader.close();
    this.loader.open('Espere por favor...', 'Buscando..');
    let filtro =  this.buscarForm.controls['cuit'].value;
    this.magypService
      .getBuscarTestCuit(filtro)
      .subscribe(
        res => {
          this.loader.close();
            this.test = res.data;
            this.test.forEach(element => {
              element.seguimientoString = element.seguimiento === 0 ? 'No' : 'Sí';
              element.appString = element.app === 0 ? 'No' : 'Sí';
              switch (element.resultado) {
                case 0:
                  element.resultadoString = 'No'
                  break;
                case 1:
                  element.resultadoString = 'Sí > Negativo'
                  break;
                case 2:
                  element.resultadoString = 'Sí > Positivo'
                  break;

                default:
                  break;
              }
            });
            this.dataSource.data = this.test;
        },
        error => {
          this.loader.close();
         // this.openPopNotFound('ERROR EN LA API');
        })
  }

  openPopAddTest(action,obj){
    obj.action = action;
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddTestComponent, {
      width: '90vw',
     // height: '95vh',
      disableClose: false,
      data:  obj
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          return;
        }
        this.buscarForm.controls['cuit'].setValue('');
        this.pageEvent.pageIndex = 0;
        this.setPage(this.pageEvent);
      })

  }

  openPopUpInfoTest(row) {
    let heightPop: number = 30 + (row.turnos * 10);
    let heightPopUp: string = '30vh';
    if (heightPop > 80) heightPopUp = '65vh'
    else heightPopUp = heightPop.toString();
    let title = 'Detalles de los Choferes ';
    let dialogRef: MatDialogRef<any> = this.dialog.open(InfoTestComponent, {
      width: '50vw',
      height: heightPopUp,
      disableClose: true,
      data: row
    });
    dialogRef.afterClosed()
      .subscribe(res => {
          return;
      });
  }

  openPopUpSms(row) {
    let title = 'Contactar ';
    let dialogRef: MatDialogRef<any> = this.dialog.open(EnviarSmsTransComponent, {
      width: '720px',
      disableClose: true,
      data: row
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        //this.loader.open();
        let data = {
          number: row.transportista.telefono,
          message:res.body
        }
        this.smsService.postSMS(data)
        .subscribe(pagedData => {
          this.loader.close();
          this.snack.open("¡SMS Enviado!", "OK", { duration: 4000 });

        },
          err => {
            this.loader.close();
            this.alertService.confirm({ message: 'Error: No se pudo enviar el Mensaje ' });

          });
      });

  }

  limpiarFiltro(){
    if (this.buscarForm.controls['cuit'].value === ""){
      this.setPage(this.pageEvent);
    }
  }

}
