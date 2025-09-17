import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { Router, NavigationEnd } from "@angular/router";
import { AppAlertService } from "../../shared/services/app-alert/app-alert.service";
import {
  MatDialogRef,
  MatDialog,
  MatSnackBar,
  MatTableDataSource,
  MatPaginator,
  MatSort,
  PageEvent,
} from "@angular/material";
import { AppConfirmService } from "../../shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "../../shared/services/app-loader/app-loader.service";
import { Subscription, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import { AppErrorService } from "../../shared/services/app-error/app-error.service";
import { AppAtencionService } from "../../shared/services/app-atencion/app-atencion.service";
import {
  CedulasChoferService,
  CedulaChofer,
} from "./services/cedulas-chofer.service";

import { Page } from "app/shared/models/page";
import { VerificarCedulaModalComponent } from "./verificar-cedula-modal/verificar-cedula-modal.component";

@Component({
  selector: "app-control-cedulas-chofer",
  templateUrl: "./control-cedulas-chofer.component.html",
  styleUrls: ["./control-cedulas-chofer.component.scss"],
})
export class ControlCedulasChoferComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public cedulas: CedulaChofer[];
  public getItemSub: Subscription;
  public searchControl: FormControl;
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    "cedula",
    "encontrada",
    "nombre_completo",
    "fecha_consulta",
    "fecha_actualizacion",
    "acciones",
  ];

  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Registros</span>
      </div>
    `,
  };
  pageEvent: PageEvent;
  page = new Page();
  filtro = {
    cedula: "",
  };

  constructor(
    private cedulasChoferService: CedulasChoferService,
    public router: Router,
    private dialog: MatDialog,
    private confirmService: AppConfirmService,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,
    private loader: AppLoaderService,
    private alertService: AppAlertService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.setPage(null);
    this.initializeSearch();
  }

  initializeSearch() {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(500), // Esperar 500ms después de que el usuario deje de escribir
        distinctUntilChanged() // Solo ejecutar si el valor realmente cambió
      )
      .subscribe((searchTerm) => {
        this.filtro.cedula = searchTerm;
        this.setPage(null);
      });
  }

  configurarPaginador() {
    if (this.paginator) {
      this.paginator._intl.itemsPerPageLabel = "Cédulas por Página";
      this.paginator._intl.nextPageLabel = "Siguiente";
      this.paginator._intl.firstPageLabel = "Primero";
      this.paginator._intl.lastPageLabel = "Último";
      this.paginator._intl.previousPageLabel = "Anterior";
    }
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.searchSubject.next(val);
  }

  setPage(event?: PageEvent) {
    let params = {
      page: 1,
      per_page: this.page.size,
      cedula: this.filtro.cedula === undefined ? "" : this.filtro.cedula,
    };

    if (event !== null) {
      params.page = event.pageIndex + 1;
      params.per_page = event.pageSize;
    }

    this.loader.open();
    this.getItemSub = this.cedulasChoferService.getAllCedulas(params).subscribe(
      (data) => {
        this.loader.close();
        this.cedulas = data.data || data;
        this.page.totalElements = data._meta
          ? data._meta.totalCount
          : this.cedulas.length;
        this.dataSource.data = this.cedulas;

        // Configurar el paginador después de cargar los datos
        setTimeout(() => {
          this.configurarPaginador();
        }, 100);
      },
      (err) => {
        this.loader.close();
        this.errorService
          .confirm({ message: "Error al buscar las cédulas de choferes" })
          .subscribe((res) => {
            if (res) {
              return;
            }
          });
      }
    );
  }

  openVerificarCedulaModal() {
    let title = "Verificar Cédula";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      VerificarCedulaModalComponent,
      {
        width: "480px",
        disableClose: true,
        data: { title: title },
      }
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.verificarCedula(res.cedula);
    });
  }

  verificarCedula(cedula: string) {
    this.loader.open();

    this.cedulasChoferService.buscarCedula(cedula).subscribe(
      (data) => {
        this.loader.close();
        if (data && (data.success || data.encontrada)) {
          this.alertService
            .confirm({
              message: `Cédula ${cedula} verificada correctamente`,
              tipo: "exito",
            })
            .subscribe((res) => {
              if (res) {
                this.setPage(null); // Actualizar la lista
              }
            });
        } else {
          this.atencionService.confirm({
            message: `Cédula ${cedula} no encontrada o no válida`,
          });
        }
      },
      (err) => {
        this.loader.close();
        this.errorService
          .confirm({
            message: `Error al verificar la cédula ${cedula}`,
          })
          .subscribe((res) => {
            if (res) {
              return;
            }
          });
      }
    );
  }

  aplicarCedula(row: CedulaChofer) {
    this.confirmService
      .confirm({
        message: `¿Está seguro de aplicar la cédula ${row.cedula}?`,
      })
      .subscribe((res) => {
        if (res) {
          this.loader.open();

          this.cedulasChoferService.aplicarCedula(row.id).subscribe(
            (data) => {
              this.loader.close();
              this.alertService
                .confirm({
                  message: "Cédula aplicada correctamente!",
                  tipo: "exito",
                })
                .subscribe((res) => {
                  if (res) {
                    this.setPage(null); // Actualizar la lista
                  }
                });
            },
            (err) => {
              this.loader.close();
              this.errorService
                .confirm({
                  message: err.error.data.message,
                })
                .subscribe((res) => {
                  if (res) {
                    return;
                  }
                });
            }
          );
        }
      });
  }
}
