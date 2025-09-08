import { Component, OnInit } from '@angular/core';
import { MatSnackBar,  MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';

import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { CentrosService } from 'app/shared/services/centros.service';

export class CentroDador {
  id: number;
  cuit: string;
  nombre_persona: string;
}
export class RestCentroDador {
  id: number;
  cuit: string;
  razon_social: string;
}
@Component({
  selector: 'app-configurar-dadores',
  templateUrl: './configurar-dadores.component.html',
  styleUrls: ['./configurar-dadores.component.scss']
})
export class ConfigurarDadoresComponent implements OnInit {
  public getItemSub: Subscription;
  restDadores: RestCentroDador[] = [];
  centroDadores: CentroDador[] = [];
  displayedColumns: string[] = ['cuit','espacio', 'razon_social',  'acciones'];
  dataSource: any;


  constructor(
    private loader: AppLoaderService, private alertService: AppAlertService,
    private errorService: AppErrorService,
    private confirmService: AppConfirmService,
    private snack: MatSnackBar,
    public centroService: CentrosService,
  ) { }

  ngOnInit() {
    this.refreshDadores();
  }
  refreshDadores() {
    this.loader.open();
    this.getItemSub = this.centroService.getDadoresCentro()
      .subscribe(data => {
        this.centroDadores = data.data;
        this.restDadores = [];
        this.centroService.getAllDadores()
          .subscribe(data2 => {
            data2.data.forEach(element => {
              let existe: boolean = false;
              this.centroDadores.forEach(centProd => {
                if (centProd.id == element.id) {
                  existe = true;
                }
              })
              if (!existe) {
                this.restDadores.push(element)
              }
            });
            this.dataSource = new MatTableDataSource(this.restDadores);
            this.loader.close();

          },
          err => {
            this.loader.close();
            this.errorService.confirm({ message: 'Error, al buscar los dadores' }).subscribe(res => {
              if (res) {
                return;
              }
            })
          });
      },
      err => {
        this.loader.close();
        this.errorService.confirm({ message: 'Error, al buscar los dadores' }).subscribe(res => {
          if (res) {
            return;
          }
        })
      });
  }
  incluirDadorCentro(row: RestCentroDador) {
    this.confirmService.confirm({ message: '¿Está seguro de incluir el dador ' + row.razon_social + ' al centro ?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.centroService.postDadoresCentro(row.cuit)
            .subscribe(data => {
              this.loader.close();
              this.refreshDadores();
              this.snack.open('Dador incluido al centro!', 'OK', { duration: 4000 });
              return;
            },
              err => {
                this.loader.close();
                this.alertService.confirm({ message: 'Este dador no se puede incluir al centro' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });
  }

  excluirDadorCentro(row: CentroDador) {
    this.confirmService.confirm({ message: '¿Está seguro de excluir el dador ' + row.nombre_persona + ' del centro ?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.getItemSub = this.centroService.deleteDadoresCentro(row.id)
            .subscribe(data => {
              this.loader.close();
              this.alertService.confirm({ message: 'Dador excluido del centro correctamente!', tipo: 'exito' }).subscribe(res => {
                if (res) {
                  this.refreshDadores();
                }
              });
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'Error, al excluir el dador del centro' }).subscribe(res => {
                  if (res) {
                    return;
                  }
                });
              });
        }
      });

  }

}
