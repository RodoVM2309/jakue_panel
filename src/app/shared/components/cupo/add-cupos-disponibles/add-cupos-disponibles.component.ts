/// <reference types="@types/googlemaps" />
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  MatTableDataSource,
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material";
import {
  Validators,
  FormGroup,
  FormControl,
  ValidatorFn,
  AbstractControl,
} from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { NomencladoresService } from "../../../services/nomencladores.service";
import { CupoService } from "../cupo.service";
import { UserService } from "../../../services/user.service";
import { AppLoaderService } from "../../../../shared/services/app-loader/app-loader.service";
import { AppErrorService } from "../../../../shared/services/app-error/app-error.service";
import { AppAlertService } from "../../../../shared/services/app-alert/app-alert.service";
import { AppAtencionService } from "../../../services/app-atencion/app-atencion.service";
import * as XLSX from "xlsx";
import { GlobalService } from "app/shared/models/global.service";
import { AddAlfanumericoComponent } from './add-alfanumerico/add-alfanumerico.component';
import { CcppService } from '../../../services/ccpp.service';
import { of } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter,
  startWith,
  tap,
  switchMap,
  finalize,
} from "rxjs/operators";
import { fromEvent } from "rxjs";
import { PersonasService } from "app/shared/services/personas.service";
import { HomeService } from "../../home/home.service";
import { PersonRazonSocial } from "app/shared/models/personRazonSocial";
import { CentroProductoService } from "app/shared/services/centro-producto.service";

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  SatDatepicker,
  SatDatepickerModule,
} from "saturn-datepicker";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";

export class Items {
  id: number;
  descripcion: string;
}

export class Producto {
  id: number;
  descripcion: string;
  codigo: number;
}

export class Destino {
  id: number;
  descripcion: string;
  CodigoPlantaOncca: number;
}

export class CuposGenerados {
  id: number;
  descripcion: string;
  numeroContrato: string;
  fecha: string;
}

export class CuposUpload {
  Cupo: string;
  Contrato: string;
  Fecha: string;
}
export interface RazonSocial {
  razon_social: string;
  cuit_cuil: string;
}
@Component({
  selector: "app-add-cupos-disponibles",
  templateUrl: "./add-cupos-disponibles.component.html",
  styleUrls: ["./add-cupos-disponibles.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MAT_MOMENT_DATE_FORMATS,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es-ES",
    },
  ],
})
export class AddCuposDisponiblesComponent implements OnInit {
  @ViewChild("search")
  @ViewChild("destinatarioCuit")
  destinatarioCuit: ElementRef;
  @ViewChild("destinatario") destinatario: ElementRef;
  @ViewChild("cuitdestino") cuitdestino: ElementRef;
  @Input() fechaDesde: string;
  @Input() fechaHasta: string;
  @Output() cambiarFechaRecuperar = new EventEmitter();
  @ViewChild("picker") dateRange: SatDatepicker<any>;

  formData = {};
  addCupoForm: FormGroup;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ["id", "descripcion", "fecha", "acciones"];
  public getItemSub: Subscription;
  productos: Producto[];
  dadorcuit: any;
  habilitar_generar: boolean = true;
  medios: any;
  destinos: Destino[] = [];
  cuposUpload: CuposUpload[];

  minFecha = new Date();
  selectedProducto;

  public isInvalid: any;
  public inactivo: boolean = false;
  public searchControl: FormControl;
  public greaterThanValue: any;
  public lessThanValue: any;

  public isDisabled: boolean;

  public unidadtipotarifa = "tn";
  public searchElementRef: ElementRef;
  public dd = [];
  isTipoDifusion: boolean = false;
  esNecesarioTelefono: boolean = false;
  condicionesDifusion: any;
  estado = true;

  arrayBuffer: any;
  file: File;
  cuposGenerados: CuposGenerados[] = [];
  incorrect_dador_cuit: boolean = false;
  incorrect_destinatario_cuit: boolean = false;
  showUrl = "";
  min = 10;
  max = 99;
  minValue: any;
  maxValue: any;
  maxValue2: any;
  cuposEncontrados: string = "";
  isMyCuit: boolean = true;
  myCuit = "";

  descargado = true;
  filteredOptions: Observable<Destino[]>;
  optionsTitularCCPP: RazonSocial[] = [];
  filteredOptionsDestinatario: PersonRazonSocial[] = [];
  isLoading = false;

  opcionselected: number = 1;
  posee_terminal: boolean;
  ref: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cupoService: CupoService,
    private homeService: HomeService,
    private userService: UserService,
    private errorService: AppErrorService,
    private alertService: AppAlertService,
    private atencionService: AppAtencionService,
    private loader: AppLoaderService,
    private globalService: GlobalService,
    public nomencladoresService: NomencladoresService,
    public dialogRef: MatDialogRef<AddCuposDisponiblesComponent>,
    private dialog: MatDialog,
    private ccppService: CcppService,
    private personasService: PersonasService,
    private centroProductoService: CentroProductoService,
  ) {
    this.productos = this.data.productos;
    if (this.data.cupera == 1) {

    }
  }

  ngOnInit() {
    this.myCuit = localStorage.getItem("cuit_cuil");
    this.posee_terminal = localStorage.getItem("posee_terminal") == "1" ? true : false;
    console.log(this.posee_terminal);

    this.cuposGenerados = [];
    this.habilitar_generar = true;
    this.cuposEncontrados = "";
    this.getDestinos();
    this.showUrl = this.globalService.apiHost + "upload/carga-cupos.xlsx";

    let personTitular = new PersonRazonSocial(
      this.data.destinatario,
      this.data.filtros.idCuitDestinatario
    );

    this.addCupoForm = new FormGroup({
      fechaCupo: new FormControl({
        begin: new Date(this.fechaDesde + " 12:00:00"),
        end: new Date(this.fechaHasta + " 12:00:00"),
      }, [Validators.required]),
      destinatarioCuit: new FormControl({
        value: this.data.cupera == 2 && this.data.filtros.idCuitDestinatario != "-1"
          ? this.data.filtros.idCuitDestinatario
          : "", disabled: this.posee_terminal
      },
        [
          // Validators.pattern("[0-9]*"),
          // Validators.minLength(11),
        ]
      ),
      destinoCodigoPlantaOncca: new FormControl("", [Validators.required]),
      productoCodigo: new FormControl("", [Validators.required]),
      destinatario: new FormControl({
        value: this.data.cupera == 2 && this.data.filtros.idCuitDestinatario != "-1"
          ? personTitular
          : "", disabled: this.posee_terminal
      }),
      destino: new FormControl(""),
      cantidad: new FormControl("", [Validators.required]),
      opselected: new FormControl("1"),
    });

    this.addCupoForm.controls["productoCodigo"].setValue(
      parseInt(this.data.filtros.id_producto)
    );

    this.searchControl = new FormControl();

    fromEvent(this.destinatarioCuit.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        let cuit = text.toLowerCase();
        this.personasService.getPersonaNombreByCuit(cuit).subscribe(
          (resp) => {
            let personTitular = new PersonRazonSocial(resp.data, cuit);
            this.addCupoForm.controls["destinatario"].setValue(personTitular);
          },
          (err) => { }
        );
      });

    this.addCupoForm
      .get("destinatario")
      .valueChanges.pipe(
        filter((value) => value.length > 2),
        map((text: string) => {
          return text.toUpperCase();
        }),
        debounceTime(1000),
        tap(() => (this.isLoading = true)),
        switchMap((value) =>
          this.personasService
            .getPersonaByRazonSocial({ razon_social: value })
            .pipe(finalize(() => (this.isLoading = false)))
        )
      )
      .subscribe((person) => {
        this.filteredOptionsDestinatario = person.data;
      });

    if (this.posee_terminal) {
      this.personasService.getPersonaNombreByCuit(this.myCuit).subscribe(
        (resp) => {
          let personTitular = new PersonRazonSocial(resp.data, this.myCuit);
          this.addCupoForm.controls["destinatario"].setValue(personTitular);
          this.addCupoForm.controls["destinatarioCuit"].setValue(this.myCuit);
        },
        (err) => { }
      );
    }
  }

  radioChange(event) {
    this.opcionselected = parseInt(event.value);
    if (event.value == 1) {
      this.addCupoForm.controls["fechaCupo"].setValidators(Validators.required);
      this.addCupoForm.controls["fechaCupo"].updateValueAndValidity();
      this.addCupoForm.controls["cantidad"].setValidators(Validators.required);
      this.addCupoForm.controls["cantidad"].updateValueAndValidity();
    } else {
      this.addCupoForm.controls["fechaCupo"].setValidators([]);
      this.addCupoForm.controls["fechaCupo"].updateValueAndValidity();
      this.addCupoForm.controls["cantidad"].setValidators([]);
      this.addCupoForm.controls["cantidad"].updateValueAndValidity();
    }
  }

  cambioRangoFecha(ref) {
    const start = this.dateRange.beginDate;
    const end = this.dateRange.endDate;
    let newprimerDia = this.homeService.formatoFecha(start, "amd", "-");
    let newultimoDia = this.homeService.formatoFecha(end, "amd", "-");
    this.fechaDesde = newprimerDia;
    this.fechaHasta = newultimoDia;
  }

  displayFn2(person: PersonRazonSocial) {
    if (person) {
      return person.razon_social;
    }
  }

  llenarCuit(person: PersonRazonSocial, control: string) {
    if (person) {
      this.addCupoForm.controls[control].setValue(person.cuit_cuil);
    }
  }

  get f() {
    return this.addCupoForm.controls;
  }

  private _filter(descripcion: string): Destino[] {
    const filterValue = descripcion.toLowerCase();
    return this.destinos.filter(
      (option) => option.descripcion.toLowerCase().indexOf(filterValue) >= 0
    );
  }

  comprobarDadorCuit() {
    this.incorrect_dador_cuit = true;
    this.addCupoForm.invalid;

    this.userService
      .esDadorCuit(this.addCupoForm.controls["dadorCuit"].value)
      .subscribe(
        (res) => {
          this.incorrect_dador_cuit = !res.data;
        },
        (error) => { }
      );
  }

  comprobarMyCuit() {
    return;
  }

  comprobarDestinatarioCuit() {
    this.incorrect_destinatario_cuit = true;
    this.addCupoForm.invalid;
    this.userService
      .esDestinatarioCuit(this.addCupoForm.controls["destinatarioCuit"].value)
      .subscribe(
        (res) => {
          this.incorrect_destinatario_cuit = !res.data;
          /* if (!res.data) {

            this.addCupoForm.controls['destinatarioCuit'].setErrors({incorrect_destinatario_cuit: true});
          } */
        },
        (error) => { }
      );
  }

  DestinatarioCuitValidator1(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      this.incorrect_destinatario_cuit = true;
      this.addCupoForm.invalid;
      this.userService
        .esDestinatarioCuit(this.addCupoForm.controls["destinatarioCuit"].value)
        .subscribe(
          (res) => {
            this.incorrect_destinatario_cuit = !res.data;
            if (!res.data) {
              return { incorrect_destinatario_cuit: true };
              //this.addCupoForm.controls['destinatarioCuit'].setErrors({incorrect_destinatario_cuit: true});
            }
          },
          (error) => {
            return null;
          }
        );
      return null;
    };
  }

  submit() {
    this.loader.open();
    let cuposAdd = [];

    if (this.opcionselected == 1) {
      let data = {
        fecha_desde: this.fechaDesde,
        fecha_hasta: this.fechaHasta,
        idCuitDestinatario: this.addCupoForm.controls["destinatarioCuit"].value.toString(),
        razon_social: this.addCupoForm.controls["destinatario"].value.razon_social.toString(),
        id_destino: this.addCupoForm.controls["destinoCodigoPlantaOncca"].value.id,
        id_producto: this.addCupoForm.controls["productoCodigo"].value,
        cantidad: this.addCupoForm.controls["cantidad"].value
      };

      this.cupoService.generarCupoDisponible(data).subscribe(
        (data) => {
          this.loader.close();
          this.alertService
            .confirm({
              message: "Cupos generados correctamente.",
              tipo: "exito",
            })
            .subscribe((res) => {
              if (res) {
                this.dialogRef.close(1);
                return;
              }
            });
        },
        (err) => {
          this.loader.close();
          this.errorService.confirm({
            message: "¡No se pudo generar los cupos! " + '\n' + err.message,
          });
          this.dialogRef.close();
        }
      );
    } else {
      this.cuposGenerados.forEach((element) => {
        let temp = {
          idCupoTerminal: element.descripcion,
          fecha: element.fecha,
        };
        cuposAdd.push(temp);
      });

      let data = {
        cupos: cuposAdd,
        id_destino: this.addCupoForm.controls["destinoCodigoPlantaOncca"].value.id,
        id_producto: this.addCupoForm.controls["productoCodigo"].value,
        idCuitDestinatario: this.addCupoForm.controls["destinatarioCuit"].value.toString(),
      };

      this.cupoService.adicionarCupoDisponible(data).subscribe(
        (data) => {
          this.loader.close();
          this.alertService
            .confirm({
              message: "Insertados correctamente.",
              tipo: "exito",
            })
            .subscribe((res) => {
              if (res) {
                this.dialogRef.close(1);
                return;
              }
            });
        },
        (err) => {
          this.loader.close();
          this.errorService.confirm({
            message: "¡No se pudo agregar los cupos! " + '\n' + err.message,
          });
          this.dialogRef.close();
        }
      );
    }
  }

  limpiar() {
    this.cuposGenerados = [];
    this.dataSource.data = this.cuposGenerados;
  }

  eliminarCupo(cupo) {
    let tempCupo = [];
    this.cuposGenerados.forEach((element) => {
      if (element.id !== cupo.id) tempCupo.push(element);
    });
    this.cuposGenerados = tempCupo;
    this.dataSource.data = this.cuposGenerados;
  }

  incomingfile(event) {
    this.file = event.target.files[0];
    this.Upload();
  }

  Upload() {
    this.cuposUpload = [];
    let fileReader = new FileReader();

    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i <= data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary", cellDates: true, dateNF: 'dd/mm/yyyy;@' });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.cuposUpload = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      let countcupos = this.cuposGenerados.length + 1;

      for (let index = 0; index < this.cuposUpload.length; index++) {
        const element = this.cuposUpload[index];
        let cupo = new CuposGenerados();
        cupo.id = countcupos + index;
        cupo.descripcion = element.Cupo ? element.Cupo.toString() : "";
        cupo.fecha = element.Fecha
          ? this.homeService.formatoFecha(element.Fecha.toString(), "amd", "-")
          : "";
        this.cuposGenerados.push(cupo);
      }
      this.dataSource.data = this.cuposGenerados;
      this.notify();
    };

    fileReader.readAsArrayBuffer(this.file);
    this.dataSource.data = this.cuposGenerados;
  }

  descargarArchivo() {
    this.descargado = false;
    window.open(this.showUrl, "_blank");
  }

  getProductos() {
    this.centroProductoService.getCentroProducto().subscribe(data => {
      this.productos = data.data;
    });
  }

  getDestinos() {
    this.cupoService.getDestinos().subscribe((data) => {
      this.destinos = data.data;
      if (this.data.cupera == 2) {
        let ind = this.destinos.findIndex(
          (item) => item.id === parseInt(this.data.filtros.idDestino)
        );
        if (ind != -1) {
          this.addCupoForm.controls["destinoCodigoPlantaOncca"].setValue(
            this.destinos[ind]
          );
        }
      }
      this.filteredOptions = this.addCupoForm.controls[
        "destinoCodigoPlantaOncca"
      ].valueChanges.pipe(
        startWith<string | Destino>(""),
        map((value) => (typeof value === "string" ? value : value.descripcion)),
        map((descripcion) =>
          descripcion ? this._filter(descripcion) : this.destinos.slice()
        )
      );
    });
  }

  displayFn(option?: Destino): string | undefined {
    return option ? option.descripcion : undefined;
  }

  agregar() {
    let title = 'Agregar alfanumérico del cupo';
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddAlfanumericoComponent, {
      width: '320px',
      height: '253px',
      disableClose: true,
      data: { title: title, cupera: this.data.cupera }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
      let cupo = new CuposGenerados();
      cupo.id = this.cuposGenerados.length + 1;
      cupo.descripcion = res.alfanumerico;
      cupo.numeroContrato = "";
      cupo.fecha = this.homeService.formatoFecha(res.fecha, "amd", "-");

      let encontrado = false;
      this.cuposGenerados.forEach((element) => {
        if (element.descripcion == cupo.descripcion) {
          encontrado = true;
        }
      });
      if (!encontrado) {
        this.cuposGenerados.push(cupo);
      }
      this.dataSource.data = this.cuposGenerados;
    });
  }

  notify() {
    this.alertService
      .confirm({
        message: "¡Se ha adjuntado correctamente!",
        tipo: "exito"
      })
      .subscribe(res => {
        if (res) {
          return;
        }
      });
  }
}
