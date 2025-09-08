import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ExelService } from "app/shared/services/exel.service";
import {
  debounceTime,
  map,
  filter,
  tap,
  switchMap,
  finalize,
  distinctUntilChanged,
} from "rxjs/operators";
/* import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from "@helpers/date.adapter"; */
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";

import { PersonasService } from "app/shared/services/personas.service";
import { PersonRazonSocial } from "app/shared/models/personRazonSocial";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { CaratulasDataSource } from "../../services/caratulas.datasource";
import { CaratulasService } from "../../services/caratulas.service";
import { Caratula, FiltroCaratula, ReporteMtr } from "../../model/caratulas";
import * as _moment from "moment";
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from "moment";
import { fromEvent } from "rxjs";
import { forEach } from "@angular/router/src/utils/collection";
import { AppAlertService } from "@app/shared/services";
import { MatPaginator, PageEvent } from "@angular/material";
import { Page } from "@app/shared/models";

const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: "MM/YYYY",
  },
  display: {
    dateInput: "MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

export interface select {
  value: number;
  viewValue: string;
}
@Component({
  selector: "app-dashboard-mtr",
  templateUrl: "./dashboard-mtr.component.html",
  styleUrls: ["./dashboard-mtr.component.scss"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", visibility: "hidden" })
      ),
      state("expanded", style({ height: "*", visibility: "visible" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DashboardMtrComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("vendedor") vendedor: ElementRef;
  @ViewChild("corredorVendedor") corredorVendedor: ElementRef;
  @ViewChild("corredorComprador") corredorComprador: ElementRef;
  @ViewChild("comprador") comprador: ElementRef;
  caratulasForm: FormGroup;

  filteredOptionsCaratulas: string[] = [];
  filteredOptionsVendedor: PersonRazonSocial[] = [];
  filteredOptionsCorredorVendedor: PersonRazonSocial[] = [];
  filteredOptionsCorredorComprador: PersonRazonSocial[] = [];
  filteredOptionsComprador: PersonRazonSocial[] = [];
  filteredOptionsCupo: PersonRazonSocial[] = [];
  filteredOptionsCartaPorte: PersonRazonSocial[] = [];

  isLoading = false;

  dataSource: CaratulasDataSource;

  displayedColumns = [
    "caratula",
    "mesEntrega",
    "cuitComprador",
    "cuitCorredorComprador",
    "cuitCorredorVendedor",
    "cuitVendedor",
    "kilosIniciales",
    "kilosRecibidosWink",
  ];

  isExpansionDetailRow = (i: number, row: Object) =>
    row.hasOwnProperty("detailRow");
  expandedElement: any;

  activa: select[] = [
    { value: 1, viewValue: "Si" },
    { value: 0, viewValue: "No" },
  ];
  mes: string = "";
  anno: string = "";
  filtro: FiltroCaratula = {
    caratula: "",
    mesEntrega: "",
    cuitComprador: "",
    cuitCorredorComprador: "",
    cuitCorredorVendedor: "",
    cuitVendedor: "",
    activo: 1,
    idCupoTerminal: "",
    descargado: 1,
    noCartaPorte: "",
  };
  exportaExcel: boolean = false;
  page = new Page();
  caratula: Caratula;

  constructor(
    private personasService: PersonasService,
    private caratulasService: CaratulasService,
    private excelService: ExelService,
    private alertService: AppAlertService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.page.totalElements = 0;
    //this.paginator.pageSize=10;
  }

  ngOnInit() {
    this.page.size = 10;
    this.page.totalElements = 0;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize= 10;
    this.paginator.length= 10;
    this.paginator._intl.itemsPerPageLabel = "Carátulas por Página";
    this.paginator._intl.nextPageLabel = "Siguiente";
    this.paginator._intl.firstPageLabel = "Primero";
    this.paginator._intl.lastPageLabel = "Última carátula";
    this.paginator._intl.previousPageLabel = "Anterior";
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} de ${length} carátulas`;
    };
    this.caratulasForm = new FormGroup({
      caratula: new FormControl(""),
      fechaEntrega: new FormControl(moment()),
      comprador: new FormControl(""),
      vendedor: new FormControl(""),
      corredorVendedor: new FormControl(""),
      corredorComprador: new FormControl(""),
      cuitComprador: new FormControl(""),
      cupo: new FormControl(""),
      cartaPorte: new FormControl(""),
      activa: new FormControl(false),
      noActiva: new FormControl(false),
      descargado: new FormControl(false),
      noDescargado: new FormControl(false),
    });
    this.mes =
      moment().month() + 1 < 10
        ? "0" + (moment().month() + 1).toString()
        : (moment().month() + 1).toString();
    this.anno = moment().year().toString();
    this.dataSource = new CaratulasDataSource(this.caratulasService);
    this.filtro.caratula = this.caratulasForm.controls["caratula"].value;
    this.filtro.mesEntrega = this.mes + "/" + this.anno;
    this.filtro.cuitComprador = this.caratulasForm.controls["comprador"].value;
    this.filtro.cuitCorredorComprador =
      this.caratulasForm.controls["corredorComprador"].value;
    this.filtro.cuitCorredorVendedor =
      this.caratulasForm.controls["corredorVendedor"].value;
    this.filtro.cuitVendedor = this.caratulasForm.controls["vendedor"].value;
    this.filtro.idCupoTerminal = this.caratulasForm.controls["cupo"].value;
    this.filtro.noCartaPorte = this.caratulasForm.controls["cartaPorte"].value;
    this.filtro.activo = -1;
    this.filtro.descargado = -1;
    this.setPage(null);

    fromEvent(this.vendedor.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        if (text.length < 3) {
          let person = new PersonRazonSocial("", "");
          this.caratulasForm.controls["vendedor"].setValue(person);
          this.filteredOptionsVendedor = [];
          this.filtro.cuitVendedor = "";
        } else {
          this.isLoading = true;
          this.personasService
            .getPersonaByRazonSocial({ razon_social: text.toLowerCase() })
            .subscribe(
              (resp) => {
                this.filteredOptionsVendedor = resp.data;
                let temp = resp.data.find((item) => item.razon_social === text);
                if (temp !== undefined) {
                  this.filtro.cuitVendedor = temp.cuit_cuil;
                } else {
                  this.filtro.cuitVendedor = "";
                }
                //this.filtro.cuitVendedor = resp.data[0].cuit_cuil;
                this.isLoading = false;
              },
              (err) => {
                let person = new PersonRazonSocial("", "");
                this.caratulasForm.controls["vendedor"].setValue(person);
                this.filtro.cuitVendedor = "";
              }
            );
        }
      });

    fromEvent(this.corredorVendedor.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        if (text.length < 3) {
          let person = new PersonRazonSocial("", "");
          this.caratulasForm.controls["corredorVendedor"].setValue(person);
          this.filteredOptionsCorredorVendedor = [];
          this.filtro.cuitCorredorVendedor = "";
        } else {
          this.isLoading = true;
          this.personasService
            .getPersonaByRazonSocial({ razon_social: text.toLowerCase() })
            .subscribe(
              (resp) => {
                this.filteredOptionsCorredorVendedor = resp.data;
                let temp = resp.data.find((item) => item.razon_social === text);
                if (temp !== undefined) {
                  this.filtro.cuitCorredorVendedor = temp.cuit_cuil;
                } else {
                  this.filtro.cuitCorredorVendedor = "";
                }
                //this.filtro.cuitCorredorVendedor = resp.data[0].cuit_cuil;
                this.isLoading = false;
              },
              (err) => {
                let person = new PersonRazonSocial("", "");
                this.caratulasForm.controls["corredorVendedor"].setValue(
                  person
                );
                this.filtro.cuitCorredorVendedor = "";
              }
            );
        }
      });

    fromEvent(this.corredorComprador.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        if (text.length < 3) {
          let person = new PersonRazonSocial("", "");
          this.caratulasForm.controls["corredorVendedor"].setValue(person);
          this.filteredOptionsCorredorComprador = [];
          this.filtro.cuitCorredorComprador = "";
        } else {
          this.isLoading = true;
          this.personasService
            .getPersonaByRazonSocial({ razon_social: text.toLowerCase() })
            .subscribe(
              (resp) => {
                this.filteredOptionsCorredorComprador = resp.data;
                let temp = resp.data.find((item) => item.razon_social === text);
                if (temp !== undefined) {
                  this.filtro.cuitCorredorComprador = temp.cuit_cuil;
                } else {
                  this.filtro.cuitCorredorComprador = "";
                }
                //this.filtro.cuitCorredorComprador = resp.data[0].cuit_cuil;
                this.isLoading = false;
              },
              (err) => {
                let person = new PersonRazonSocial("", "");
                this.caratulasForm.controls["corredorVendedor"].setValue(
                  person
                );
                this.filtro.cuitCorredorComprador = "";
              }
            );
        }
      });

    fromEvent(this.comprador.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        if (text.length < 3) {
          let person = new PersonRazonSocial("", "");
          this.caratulasForm.controls["comprador"].setValue(person);
          this.filteredOptionsComprador = [];
          this.filtro.cuitComprador = "";
        } else {
          this.isLoading = true;
          this.personasService
            .getPersonaByRazonSocial({ razon_social: text.toLowerCase() })
            .subscribe(
              (resp) => {
                this.filteredOptionsComprador = resp.data;
                let compradorEnc = resp.data.find(
                  (item) => item.razon_social === text
                );
                if (compradorEnc !== undefined) {
                  this.filtro.cuitComprador = compradorEnc.cuit_cuil;
                } else {
                  this.filtro.cuitComprador = "";
                }
                //this.filtro.cuitComprador = resp.data[0].cuit_cuil;
                this.isLoading = false;
              },
              (err) => {
                let person = new PersonRazonSocial("", "");
                this.filteredOptionsComprador = [];
                this.caratulasForm.controls["comprador"].setValue(person);
                this.filtro.cuitComprador = "";
              }
            );
        }
      });

    this.caratulasForm
      .get("cartaPorte")
      .valueChanges.pipe(
        filter((value) => value.length > 2),
        map((text: string) => {
          return text.toUpperCase();
        }),
        debounceTime(1000),
        tap(() => (this.isLoading = true)),
        switchMap((value) =>
          this.caratulasService
            .filtrarMtr({ cartaPorte: value })
            .pipe(finalize(() => (this.isLoading = false)))
        )
      )
      .subscribe((res) => {
        this.filteredOptionsCartaPorte = res.data;
      });
  }
  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadCaratulasPage())).subscribe();
  }

  loadCaratulasPage() {
    this.dataSource.loadCaratulas(
      this.filtro,
      "asc",
      this.page.pageNumber,
      this.page.size
    );
  }

  setPage(event?: PageEvent) {
    //let params = {	page: 1, per_page: 10 };

    if (event !== null) {
      this.page.pageNumber = event.pageIndex + 1;
      this.page.size = event.pageSize;
    }
    console.log(this.filtro)

    this.dataSource.loadCaratulas(
      this.filtro,
      "asc",
      this.page.pageNumber,
      this.page.size
    );
    this.dataSource.loadingPage$.subscribe((page) => {
      this.page = page;
    });
  }

  displayFn2(person: PersonRazonSocial) {
    if (person) {
      return person.razon_social;
    }
  }
  displayFn(person: string) {
    if (person) {
      return person;
    }
  }

  llenarCuit(person: PersonRazonSocial, control: string, prop: string) {
    if (person) {
      this.caratulasForm.controls[control].setValue(person);
      for (const key in this.filtro) {
        if (Object.prototype.hasOwnProperty.call(this.filtro, key)) {
          if (key == prop) {
            this.filtro[prop] = person.cuit_cuil;
          }
        }
      }
    }
  }

  llenarInput(valor: string, control: string) {
    if (valor) {
      this.caratulasForm.controls[control].setValue(valor);
    }
  }

  buscar() {
    let filtroMtr: FiltroCaratula = {
      caratula: this.caratulasForm.controls["caratula"].value,
      mesEntrega: this.mes + "/" + this.anno,
      cuitComprador: this.caratulasForm.value.comprador.cuit_cuil
        ? this.caratulasForm.value.comprador.cuit_cuil
        : this.filtro.cuitComprador,
      cuitCorredorComprador: this.caratulasForm.value.corredorComprador
        .cuit_cuil
        ? this.caratulasForm.value.corredorComprador.cuit_cuil
        : "",
      cuitCorredorVendedor: this.caratulasForm.value.corredorVendedor.cuit_cuil
        ? this.caratulasForm.value.corredorVendedor.cuit_cuil
        : "",
      cuitVendedor: this.caratulasForm.value.vendedor.cuit_cuil
        ? this.caratulasForm.value.vendedor.cuit_cuil
        : "",
      idCupoTerminal: this.caratulasForm.controls["cupo"].value,
      noCartaPorte: this.caratulasForm.controls["cartaPorte"].value,
      activo:
        this.caratulasForm.value.activa && this.caratulasForm.value.noActiva
          ? -1
          : !(
              this.caratulasForm.value.activa ||
              this.caratulasForm.value.noActiva
            )
          ? -1
          : this.caratulasForm.value.activa
          ? 1
          : 0,
      descargado:
        this.caratulasForm.value.descargado &&
        this.caratulasForm.value.noDescargado
          ? -1
          : !(
              this.caratulasForm.value.descargado ||
              this.caratulasForm.value.noDescargado
            )
          ? -1
          : this.caratulasForm.value.descargado
          ? 1
          : 0,
    };
    this.filtro = filtroMtr;
    console.log(this.filtro)
    this.dataSource.loadCaratulas(filtroMtr, "asc", 0, 3);
    this.exportaExcel = true;
  }

  exportAsXLSX(): void {
    if (this.exportaExcel) {
      this.exportaExcel = false;
      let data;
      this.dataSource.fulldata().subscribe((res) => {
        data = res;
      });
      console.log("Datos a exportar:", data);
      if (data) {
        let array_exp = [];
        let caratulas: Caratula[] = data["caratulas"];
        if (caratulas.length > 0) {
          for (let i = 0; i < caratulas.length; i++) {
            const element = caratulas[i];

            element.cupos.forEach((cupo) => {
              let exp: ReporteMtr = {
                Alfanumerico: cupo.alfanumerico,
                Estado: cupo.idCupoEstado,
                Fecha: cupo.fecha,
                FechaArribado: cupo.fechaArribado,
                FechaDescargado: cupo.fechaDescargado,
                Caratula: element.caratula,
                MesEntrega: element.mesEntrega,
                CuitComprador: element.cuitComprador,
                Comprador: element.razonSocialComprador,
                CuitCorredorComprador: element.cuitCorredorComprador,
                CorredorComprador: element.razonSocialCorredorComprador,
                cuitCorredorVendedor: element.cuitCorredorVendedor,
                CorredorVendedor: element.razonSocialCorredorVendedor,
                CuitVendedor: element.cuitVendedor,
                Vendedor: element.razonSocialVendedor,
                KilosIniciales: element.kilosIniciales,
                KilosRecibidosWink: element.kilosRecibidosWink,
                Activo: element.activo,
              };
              array_exp.push(exp);
            });
          }

          let today = new Date();
          let year = today.getFullYear();
          let month = today.getMonth() + 1;
          let day = today.getDate();
          // let nombre = "Caratula MtR_" + year + "_" + month + "_" + day;
          let nombre = "Caratulas MtR";
          this.excelService.exportAsExcelFile(array_exp, nombre);

          this.alertService
            .confirm({
              message: "Archivo generado correctamente.",
              tipo: "exito",
            })
            .subscribe((res) => {
              if (res) {
                this.exportaExcel = true;
                return;
              }
            });
        } else {
          this.alertService
            .confirm({
              message: "No existen datos para exportar.",
              tipo: "exito",
            })
            .subscribe((res) => {
              if (res) {
                this.exportaExcel = true;
                return;
              }
            });
        }
      }
    }
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.caratulasForm.controls["fechaEntrega"].value;
    ctrlValue.year(normalizedYear.year());
    this.anno = normalizedYear.year().toString();
    this.caratulasForm.controls["fechaEntrega"].setValue(ctrlValue);
  }

  chosenMonthHandler(
    normlizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.caratulasForm.controls["fechaEntrega"].value;
    ctrlValue.month(normlizedMonth.month());
    this.caratulasForm.controls["fechaEntrega"].setValue(ctrlValue);
    this.mes =
      normlizedMonth.month() + 1 < 10
        ? "0" + (normlizedMonth.month() + 1).toString()
        : (normlizedMonth.month() + 1).toString();
    this.filtro.mesEntrega = this.mes + "/" + this.anno;
    datepicker.close();
  }

  validarCorredorComprador() {
    if (this.caratulasForm.controls["corredorComprador"].value != "") {
      this.personasService
        .getPersonaByRazonSocial({
          razon_social: this.caratulasForm.controls["corredorComprador"].value,
        })
        .subscribe(
          (resp) => {
            let person = new PersonRazonSocial(
              resp.data,
              this.caratulasForm.controls["corredorVendedor"].value
            );
            this.caratulasForm.controls["corredorComprador"].setValue(
              person.cuit_cuil
            );
          },
          (err) => {}
        );
    }
  }
}
