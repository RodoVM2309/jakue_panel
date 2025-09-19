import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { MatPaginator, MatSort, PageEvent, MatTableDataSource } from "@angular/material";
import { estados } from "../../functions/logs-busqueda";
// import { MatPaginator } from '@angular/material/paginator';
import { Variables } from "../../utils/variables";
import { LogsBusqueda } from "../../models/logs-busquedas";
import { Page } from "@app/shared/models";
import { HelperService } from "../../services/help.service";

@Component({
  selector: "app-data-logs",
  templateUrl: "./data-logs.component.html",
  styleUrls: ["./data-logs.component.scss"],
})
export class DataLogsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() variables: Variables;
  @Input() restartControl: boolean;
  @Input() dataSource: MatTableDataSource<LogsBusqueda>;
  @Output() refresh = new EventEmitter<boolean>();

  pageEvent: PageEvent = new PageEvent();
  page = new Page();

  displayedColumns: string[] = [
    "copiar",
    "cupo",
    "fecha",
    "destino",
    "producto",
    "procedencia",
    "chofer",
    "chapa",
    "estado",
    "fechaScan",
  ];

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay Cupos Disponibles</span>
      </div>
    `,
  };

  constructor(private helpSevices: HelperService) {}

  ngOnInit() {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.variables.pageEvent.pageSize || 5;
    this.page.pageNumber = this.variables.pageEvent.pageIndex;
    this.page.size = this.variables.pageEvent.pageSize || 5;

    this.helpSevices.customChangePage.subscribe((response) => {
      response ? this.paginator.firstPage() : false;
    });

    console.log(this.variables);
    console.log(this.dataSource);
  }

  ngAfterViewInit() {
    // Conectar el paginador con el MatTableDataSource
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  gotoRefresh() {
    this.refresh.emit(true);
  }

  setPage(pageEvent) {
    // MatTableDataSource maneja automáticamente la paginación
    // Solo actualizamos las variables para mantener la sincronización
    this.variables.pageEvent.pageIndex = pageEvent.pageIndex;
    this.variables.pageEvent.pageSize = pageEvent.pageSize;
  }

  copyTextToClipboard(text) {
    const txtArea = document.createElement("textarea");
    txtArea.id = "txt";
    txtArea.style.position = "fixed";
    txtArea.style.top = "0";
    txtArea.style.left = "0";
    txtArea.style.opacity = "0";
    txtArea.value = text;
    document.body.appendChild(txtArea);
    txtArea.select();
    try {
      const successful = document.execCommand("copy");
      const msg = successful ? "successful" : "unsuccessful";
      if (successful) {
        return true;
      }
    } catch (err) {
    } finally {
      document.body.removeChild(txtArea);
    }
    return false;
  }

  dameBgColor(estado) {
    return estado ? estados[estado].bgColor : "#C9BC5E";
  }

  dameColor(estado) {
    return estado ? estados[estado].color : "#000";
  }

  openPopUpwhatsapp(log) {
    const cliente =
      log.cupoAsignados[log.cupoAsignados.length - 1].nombreReceptor;
    const ventana = this.calcularVentana(log.fecha);
    const message = `Hola ${log.nombreChofer}, le escribimos de *SARCOM* por el *cupo ${log.cupo}* del *${log.fecha}* con validez *${ventana}* (cliente *${cliente}*, producto *${log.producto}*, terminal *${log.terminal}*). Chapa: *${log.placaCamion}*.`;
    const phoneNumber = log.telefonoChofer;
    const url = `https://wa.me/+${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  }

  calcularVentana(fechaCupo: string): string {
    // Convertir la fecha del cupo a objeto Date
    const fechaCupoDate = new Date(fechaCupo);

    // Calcular fecha inicio (día anterior a las 12:00 PM)
    const fechaInicio = new Date(fechaCupoDate);
    fechaInicio.setDate(fechaInicio.getDate() - 1);
    fechaInicio.setHours(12, 0, 0, 0);

    // Calcular fecha fin (día siguiente a las 12:00 PM)
    const fechaFin = new Date(fechaCupoDate);
    fechaFin.setDate(fechaFin.getDate() + 1);
    fechaFin.setHours(12, 0, 0, 0);

    // Formatear las fechas
    const formatoFecha = (fecha: Date) => {
      const dia = fecha.getDate();
      const mes = fecha.getMonth() + 1;
      return `${dia}/${mes}`;
    };

    return `desde el ${formatoFecha(
      fechaInicio
    )} a las 12:00 PM hasta el ${formatoFecha(fechaFin)} a las 12:00 PM`;
  }

  // Función para cambiar el orden de fechas de ingreso
  cambiarOrdenFechaIngreso() {
    this.variables.ordenAscendente = !this.variables.ordenAscendente;
    
    // Reaplicar el ordenamiento a los datos filtrados actuales
    this.variables.logsFiltrados.sort((a, b) => {
      const fechaA = new Date(a.fechaScan);
      const fechaB = new Date(b.fechaScan);
      
      if (this.variables.ordenAscendente) {
        return fechaA.getTime() - fechaB.getTime(); // Ascendente: fechas más tempranas primero
      } else {
        return fechaB.getTime() - fechaA.getTime(); // Descendente: fechas más recientes primero
      }
    });
    
    // Actualizar la tabla con el nuevo orden
    this.dataSource.data = [...this.variables.logsFiltrados];
    
    // Resetear el paginador a la primera página
    this.variables.pageEvent.pageIndex = 0;
    this.helpSevices.changePaginator(true);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
