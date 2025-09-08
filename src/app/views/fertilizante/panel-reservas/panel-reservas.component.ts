import {
  Component,
  OnInit,
} from "@angular/core";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  PageEvent,
} from "@angular/material";
import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from "app/shared/helpers/date.adapter";
import { Router } from "@angular/router";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";

import { egretAnimations } from "../../../shared/animations/egret-animations";
//Servicios
import {
  AppLoaderService,
  FertilizantesService,
  ReservasService,
} from "@muvin/services";
import { HomeService } from "@shared/components/home/home.service";

//Model
import { Destino } from "app/shared/models/destino";
import { Cliente, GrupoCliente, ZonaCliente } from "@muvin/models";

@Component({
  selector: "app-panel-reservas",
  templateUrl: "./panel-reservas.component.html",
  styleUrls: ["./panel-reservas.component.scss"],
  animations: egretAnimations,
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es-ES",
    },
  ],
})
export class PanelReservasComponent implements OnInit {
  // @Output() filtros_emit : EventEmitter<any> = new EventEmitter();
  filtrosForm: FormGroup;
  selectedTab = 0;
  selectedZona = 0;
  selectedCliente = 0;
  solucion_muvin = true;
  paginaActual = 0;
  public fechaModificada: string = "";

  listado_clientes: Cliente[] = [
    {
      id: 0,
      razon_social: "Todos",
    },
  ];
  listado_zona: ZonaCliente[] = [
    {
      id: 0,
      descripcion: "Todos",
    },
  ];
  listado_grupoClientes: GrupoCliente[] = [];
  terminales: Destino[] = [];
  now = new Date();
  pageEvent: PageEvent = new PageEvent();
  constructor(
    public router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private reservasService: ReservasService,
    private fertilizantesService: FertilizantesService,
    private loader: AppLoaderService
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 3;
  }

  ngOnInit() {
    this.getDestinos();
    this.getGrupoClientes();
    this.getClientes();
    this.getSelectZonasClientes();
    this.buildItemForm();
  }

  buildItemForm() {
    this.filtrosForm = this.fb.group({
      fecha: [this.now, Validators.required],
      terminal: ["", Validators.required],
      grupo_cliente: ["", Validators.required],
      cuenta_cliente: ["", Validators.required],
      zona: ["", Validators.required],
    });
  }
  getDestinos() {
    this.fertilizantesService
      .getFetilizantesOrigen(this.solucion_muvin)
      .subscribe((pagedData) => {
        if (pagedData.data) {
          pagedData.data.map((terminales_cargas) => {
            this.terminales.push(terminales_cargas);
          });
        }
      });
  }
  getGrupoClientes() {
    this.reservasService.getGrupoClientes().subscribe((resp) => {
      if (resp) {
        resp.map((grupoClientes) => {
          this.listado_grupoClientes.push(grupoClientes);
        });
      }
    });
  }
  getClientes() {
    this.reservasService.getClientes().subscribe((resp) => {
      if (resp) {
        resp.map((clientes) => {
          this.listado_clientes.push(clientes);
        });
      }
    });
  }

  getSelectZonasClientes() {
    this.reservasService.getSelectZonasClientes().subscribe((resp) => {
      if (resp) {
        resp.map((element) => {
          this.listado_zona.push(element);
        });
      }
    });
  }
  submit() {
    if (!this.filtrosForm.invalid) {
      this.fechaModificada = this.homeService.formatoFecha(
        this.filtrosForm.get("fecha").value,
        "amd",
        "-"
      );
      let filtros = {
        fecha: this.fechaModificada,
        id_origen: this.filtrosForm.get("terminal").value,
        id_grupo_cliente: this.filtrosForm.get("grupo_cliente").value,
        id_cuenta_cliente: this.filtrosForm.get("cuenta_cliente").value,
        id_zona: this.filtrosForm.get("zona").value,
        page: this.paginaActual,
        perPage: this.pageEvent.pageSize,
      };
      // console.log(filtros);
      this.reservasService
        .sendFiltrosCapacidadTerminal(filtros)
        .subscribe((resp) => {
          this.reservasService.dataCapacidadTerminal$.emit(resp);
        });
      this.reservasService.sendFiltrosReservas(filtros).subscribe((resp) => {
        this.reservasService.filtros$.emit(filtros);
        this.reservasService.dataReservas$.emit(resp);
      });
    }
  }

  paginar(event?: PageEvent) {
    //console.log("Recibo la pagina ",event);
    if (event !== null) {
      event.pageIndex++;
    }
    this.fechaModificada = this.homeService.formatoFecha(
      this.filtrosForm.get("fecha").value,
      "amd",
      "-"
    );
    let filtros = {
      fecha: this.fechaModificada,
      id_origen: this.filtrosForm.get("terminal").value,
      id_grupo_cliente: this.filtrosForm.get("grupo_cliente").value,
      id_cuenta_cliente: this.filtrosForm.get("cuenta_cliente").value,
      id_zona: this.filtrosForm.get("zona").value,
      page: event.pageIndex,
      perPage: event.pageSize,
    };
    this.reservasService
      .sendFiltrosCapacidadTerminal(filtros)
      .subscribe((rep) => {
        this.reservasService.dataCapacidadTerminal$.emit(rep);
      });
    this.reservasService.sendFiltrosReservas(filtros).subscribe((rep) => {
      this.reservasService.filtros$.emit(filtros);
      this.reservasService.dataReservas$.emit(rep);
    });
  }

  selectTab(event) {
    this.selectedTab = event;
    //console.log(event);
  }
}
