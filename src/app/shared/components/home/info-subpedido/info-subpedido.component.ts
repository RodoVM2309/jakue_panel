import { Component, OnInit, Inject, AfterViewInit, OnDestroy} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { AppConfirmService } from "../../../services/app-confirm/app-confirm.service";
import { AppLoaderService } from "../../../services/app-loader/app-loader.service";
import { AppAlertService } from "../../../../shared/services/app-alert/app-alert.service";
import {  Subscription, } from "rxjs";
import { AppErrorService } from "../../../../shared/services/app-error/app-error.service";
import { AppAtencionService } from "../../../../shared/services/app-atencion/app-atencion.service";
import { VariarSubpedidoComponent } from "../../../../shared/components/home/info-subpedido/variar-subpedido/variar-subpedido.component";
import { AsignarIntermediariosComponent } from "../asignar-intermediarios/asignar-intermediarios.component";
import { HomeService } from "../home.service";
import {
  MatTableDataSource,
  MatDialogRef,
  MatDialog,
  MatSnackBar,
  MAT_DIALOG_DATA
} from "@angular/material";
import { NomencladoresService } from "../../../services/nomencladores.service";
import { Router, ActivatedRoute } from "@angular/router";

export class infoSubpedido {
  id: number;
  fecha_desde: string;
  fecha_hasta: string;
  id_origen: number;
  id_zona_destino: number;
  id_cliente: number;
  id_centro: number;
  cantidad: number;
  reduccion: number;
  id_producto: number;
  bloqueado: number;
  oculto: number;
  id_operador: number;
  id_observador: number;
  solicitud: number;
  id_generador: number;
  id_pedido_padre: number;
  tipo: number;
  _fecha_desde: string;
  _fecha_hasta: string;
  nombre_cliente: string;
  nombre_centro: string;
  nombre_observador: string;
  nombre_generador: string;
  viajes_asignados: number;
  estados: {
    Pendiente: number;
    A_Km_de_origen: string;
    Cargado: number;
    A_km_de_destino: number;
    En_destino: number;
    Conforme: number;
    Rechazado: number;
    Esperando: number;
    Descargado: number;
  };
  zonaDestino: {
    id: number;
    descripcion: string;
  };
  producto: {
    id: number;
    descripcion: string;
    cupo_obligatorio: number;
  };
  origen: {
    id: number;
    id_localidad: number;
    descripcion: string;
    direccion: string;
    nombre_contacto: string;
    telefono: string;
    email: string;
    bloqueado: number;
    id_persona_rol: number;
    longitud: number;
    latitud: number;
    id_zona_destino: number;
    domicilio: null;
    id_tipo_destino: number;
    id_situacion_puerto: number;
    horas_atraso: number;
  };
  viajes_bloqueados: number;
  desvios: number;
  tipo_pedido: string;
}

let ELEMENT_DATA: infoSubpedido[] = [];
@Component({
  selector: "app-info-subpedido",
  templateUrl: "./info-subpedido.component.html",
  styleUrls: ["./info-subpedido.component.scss"]
})
export class InfoSubpedidoComponent implements OnInit,AfterViewInit, OnDestroy {
  public itemForm: FormGroup;
  public getItemSub: Subscription;
  public pedido;
  public viajes_x_asignar = 0;
  public cant = [];
  public cantfalt = [];
  public propioData: any;
  public quantity: any;
  dataSource = new MatTableDataSource();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InfoSubpedidoComponent>,
    private dialog: MatDialog,
    private atencionService: AppAtencionService,
    private errorService: AppErrorService,
    private nomecladoresServices: NomencladoresService,
    public router: Router,
    private loader: AppLoaderService,
    private homeService: HomeService,
    private alertService: AppAlertService
  ) {}

  ngOnInit() {
    this.pedido = this.data.payload;
    this.inicializar();
  }
  ngOnDestroy(){
    ELEMENT_DATA = [];
  }
  ngAfterViewInit() {
    ELEMENT_DATA = [];
  }

  inicializar() {
    ELEMENT_DATA = [];
    this.viajes_x_asignar = this.pedido.viajes_x_asignar;
    this.propioData = {
      nombre_centro: "Propio",
      cantidad: this.pedido.viajes_mios,
      viajes_asignados: this.pedido.viajes_mios - this.pedido.viajes_x_asignar
    };
    this.getDescendencia();
  }
  asignar() { 
    let title = "Modificar Subpedidos";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AsignarIntermediariosComponent,
      {
        width: "60vw",
        height:"90vh",
        disableClose: true,
        data: {
          title: title,
          payload: this.pedido,
          xAsignar: this.viajes_x_asignar,
          pedidoPadre: this.pedido.id,
          cantidadPadre: this.pedido.cantidad,
          esconder: true
        }
      }
    );
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.loader.open();
      let datos;
      if (res.selectedIntermediario.length > 0) {
        let datadesglose = {
          id_pedido: this.pedido.id,
          intermediarios: res.selectedIntermediario
        };
        //
        this.nomecladoresServices
          .desglosarPedido(datadesglose)
          .subscribe(data => {
            if (data.success) {
              this.loader.close();
              this.alertService
                .confirm({ message: "¡Subpedidos confirmados!", tipo: "exito" })
                .subscribe(res => {
                  if (res) {
                    this.loader.open();
                    this.homeService.getPedido(this.pedido.id).subscribe(
                      data => {
                        this.loader.close();
                        this.pedido = data.data[0];
                        this.inicializar();
                      },
                      err => {
                        this.loader.close();
                        this.alertService.confirm({ message: "Error! " + err });
                      }
                    );
                    this.loader.close();

                    //this.inicializar();
                  }
                });
            } else {
              this.loader.close();
              this.errorService.confirm({ message: "Error!:" + data.data });
            }
          });
        this.inicializar();
      } 
      else {
        this.loader.close();
        return;
      }
      //}
    });
  }
  getDescendencia() {
    ELEMENT_DATA = [];
    this.homeService.getDescendencia(this.pedido.id).subscribe(data => {
      /* for (let index = 0; index < data.data.length; index++) {
        const element = data.data[index];
        if (element.viajes_asignados > 0) 
            this.pedido.push(element);
      } */
      ELEMENT_DATA.push(this.propioData);
      for (let i = 0; i < data.data.length; i++) {
        if (data.data[i].cantidad > 0) {
          ELEMENT_DATA.push(data.data[i]);
          this.cant.push(data.data[i].cantidad);
          this.cantfalt.push(
            data.data[i].cantidad - data.data[i].viajes_asignados
          );
        }
      }
      this.dataSource.data = ELEMENT_DATA;
    });
  }

  submit() {
    ELEMENT_DATA = [];
    this.dialogRef.close();
  }

  displayedColumns: string[] = [
    "nombre_centro",
    "cantidad",
    "viajes_asignados",
    "cuantos_faltan",
    "acciones"
  ];
  

  modificarcant(ele: any, xasignar: any) {

    let title = "Modificar Subpedidos";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      VariarSubpedidoComponent,
      {
        width: "950px",
        disableClose: true,
        data: {
          title: title,
          payload: ele,
          xAsignar: xasignar,
          pedidoPadre: this.pedido.id,
          cantidadPadre: this.pedido.cantidad
        }
      }
    );
    dialogRef.afterClosed().subscribe(res => {
      this.loader.open();
      this.homeService.getPedido(this.pedido.id).subscribe(
        data => {
          this.loader.close();
          this.pedido = data.data[0];
          this.inicializar();
        },
        err => {
          this.loader.close();
          this.alertService.confirm({ message: "Error! " + err });
        }
      );
      this.loader.close();
    });
  }
  goAsignarViaje() {
    this.dialogRef.close();
    if (this.pedido.tipo_pedido === "Cereal") {
      this.router.navigateByUrl("/home/asignarViaje/" + this.pedido.id);
    } else {
      this.router.navigateByUrl("/home/asignarViajeRetorno/" + this.pedido.id);
    }
  }
  disminuirElement(elem) {}
}
