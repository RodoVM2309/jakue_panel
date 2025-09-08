import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder,  FormGroup, FormControl } from '@angular/forms';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource
} from "@angular/material";
import { Cupo } from 'app/shared/models/cupo';
import { Pedido } from 'app/shared/models/pedido';
import { CupoService } from '../../cupo/cupo.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HomeService } from '../home.service';
import { AppConfirmService } from "app/shared/services/app-confirm/app-confirm.service";
import { AppAlertService } from "app/shared/services/app-alert/app-alert.service";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { NomencladoresService } from 'app/shared/services/nomencladores.service';

@Component({
  selector: 'app-cupo-pedido',
  templateUrl: './cupo-pedido.component.html',
  styleUrls: ['./cupo-pedido.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CupoPedidoComponent implements OnInit {
  cupos: Cupo[] = [];
  pedido: Pedido;
  public itemForm: FormGroup;
  pageSize = 10;
  producto: string = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    "alfanumericoCupo",
    "destino",
    "dador",
    "cosecha",
    "contrato",
    "producto",
    "fecha",
    "acciones"
  ];
  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Cupos Disponibles</span>
      </div>
    `
  };
  expandedElement: Cupo;
  totalSize = 5;
  tableWidth: string = '';
  liberadoCupo: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CupoPedidoComponent>,
    private fb: FormBuilder,
    private cupoService: CupoService,
    private errorService: AppErrorService,
    private homeService: HomeService,
    private confirmService: AppConfirmService,
    private alertService: AppAlertService,
    private nomecladoresServices: NomencladoresService,
    private loader: AppLoaderService) { }

  ngOnInit() {
    this.pedido = this.data.payload;
    this.cargarCupos();
  }

  cargarCupos() {
    this.cupos = [];
    this.cupoService.getCuposByPedido(this.pedido.id)
      .subscribe(
        res => {
          this.cupos = res.data;

          this.dataSource.data = this.cupos;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error => {
        });
    this.dataSource.data = this.cupos;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  liberarCupo(row: Cupo) {
    this.confirmService
      .confirm({
        message:
          "¿Está seguro de liberar el cupo: " +
          row.idCupoTerminal +
          " del Dador:" +
          row.nombreDador +
          "  y destino:" +
          row.nombreDestino +
          "?"
      })
      .subscribe(res => {
        if (res) {
          this.loader.open();

          this.homeService.liberarCupo(row.id).subscribe(
            data => {
              this.loader.close();
              this.liberadoCupo = true;
              this.alertService
                .confirm({
                  message: "Cupo liberado correctamente!",
                  tipo: "exito"
                })
                .subscribe(res1 => {
                  if (res1) {
                    this.cargarCupos();
                    this.getItemPedido();
                    return;
                  }
                });
            },
            err => {
              this.loader.close();
              this.errorService.confirm({
                message: "Este cupo no se pudo liberar"
              });
            }
          );
        }
      });
  }

  getItemPedido() {
    this.nomecladoresServices
      .getPedido(this.data.payload.id)
      .subscribe(data => {
        this.pedido = data.data[0];

      }), err => {
      }

  }
  submit() {
    this.dialogRef.close(this.liberadoCupo);
  }

}
