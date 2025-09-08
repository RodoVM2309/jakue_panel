import { Component, OnInit } from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import {
  MatTableDataSource,
  MatDialogRef,
  MatProgressBar,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_DIALOG_DATA,
  MatRadioChange,
} from "@angular/material";
import * as XLSX from "xlsx";
import { Subscription } from "rxjs";
import { NomencladoresService } from "app/shared/services/nomencladores.service";
import { MarcaAcoplado } from "app/shared/models/marca-acoplado";
import { TipoAcoplado } from "app/shared/models/tipo-acoplado";
import { MarcaCamion } from "app/shared/models/marca-camion";
import { TipoCamion } from "app/shared/models/tipo-camion";
import { CentrosService } from "app/shared/services/centros.service";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { AppAlertService } from "app/shared/services/app-alert/app-alert.service";
import { AppErrorService } from "app/shared/services/app-error/app-error.service";
import { GlobalService } from "app/shared/models/global.service";

//campos quitados
/*
id_tipo_persona: number;
id_localidad: number;
domicilio: string;
cuit_transportista: string;
marca_camion: string;
id_marca_camion: number;
tipo_camion: string;
id_tipo_camion: number;
ano_camion: number;
camion_carga_peligrosa: string;
marca_acoplado: string;
id_marca_acoplado: number;
tipo_acoplado: string;
id_tipo_acoplado: number;
ano_acoplado: number;
acoplado_carga_peligrosa: string;
*/
export class ChoferesUpload {
  cedula_identidad: string;
  email: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  chapa_camion: string;
  chapa_acoplado: string;
  razon_social: string;
  observaciones?: string[];
  hayError: boolean;
}
export class Choferes {
  ruc: string;
  email: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  chapa_camion: string;
  chapa_acoplado: string;
  razon_social: string;
  observaciones?: string[];
  hayError: boolean;
}
export class DataPost {
  choferes?: any[];
}
@Component({
  selector: "app-carga-masiva",
  templateUrl: "./carga-masiva.component.html",
  styleUrls: ["./carga-masiva.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class CargaMasivaComponent implements OnInit {
  file: File;
  arrayBuffer: any;
  choferesUpload: ChoferesUpload[];
  choferes: Choferes[] = [];
  displayedColumns: string[] = [
    "cuit",
    "email",
    "nombre",
    "apellidos",
    "telefono",
    "chapa_camion",
    "chapa_acoplado",
    "hayError",
  ];
  dataSource = new MatTableDataSource();
  expandedElement: ChoferesUpload | null;
  public getItemSub: Subscription;
  marcaCamiones: MarcaCamion[] = [];
  tipoCamion: TipoCamion[] = [];
  marcaAcoplados: MarcaAcoplado[] = [];
  tipoAcoplados: TipoAcoplado[] = [];
  cantidadChoferesValidos: number = 0;
  currentYear: number;
  showUrl = "";
  postData: DataPost;
  mostrarTablaExcel: boolean = true;
  mostrarTableError: boolean = false;
  isErrorLoad: boolean = false;
  listError: any[] = [];

  constructor(
    private nomencladoresService: NomencladoresService,
    private centrosService: CentrosService,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    private errorService: AppErrorService,
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    let today = new Date();
    this.postData = new DataPost();
    this.currentYear = today.getFullYear();
    this.showUrl = this.globalService.apiHost + "upload/carga-choferes.xlsx";
    this.getItemsCamion();
    this.getItemsTipoCamion();
    this.getItemsAcoplados();
    this.getItemsTipoAcoplados();
  }

  incomingfile(event) {
    this.file = event.target.files[0];
  }
  Upload() {
    this.choferesUpload = [];
    this.choferes = [];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.choferesUpload = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      //let countcupos = this.choferes.length + 1;
      for (let index = 0; index < this.choferesUpload.length; index++) {
        const element = this.choferesUpload[index];
        if (element.cedula_identidad) {
          let chofer = new Choferes();
          chofer.ruc =
            element.cedula_identidad == undefined
              ? ""
              : element.cedula_identidad.toString();
          chofer.email = chofer.ruc + "@gmail.com";
          chofer.nombre = element.nombre == undefined ? "" : element.nombre;
          chofer.apellidos =
            element.apellidos == undefined ? "" : element.apellidos;
          chofer.telefono = element["telefono"]
            ? '595 + '+element["telefono"]
            : "";
          chofer.chapa_camion =
            element.chapa_camion == undefined ? "" : element.chapa_camion.replace(/\s+/g, '').toUpperCase();
          chofer.chapa_acoplado =
            element.chapa_acoplado == undefined ? "" : element.chapa_acoplado.replace(/\s+/g, '').toUpperCase();
          chofer.razon_social = element.apellidos + ", " + element.nombre;

          chofer.observaciones = [];
          chofer.hayError = false;
          this.choferes.push(chofer);
          /*
          chofer.email = element.email == undefined ? '' : element.email;
           chofer.id_tipo_persona = 1;
          chofer.id_localidad = 1;
          chofer.domicilio = element.domicilio == undefined ? '' : element.domicilio;
          chofer.cuit_transportista = element.cuit_transportista == undefined ? '' : element.cuit_transportista.toString();
          chofer.marca_camion = element.marca_camion == undefined ? 'Otros' : element.marca_camion;
          chofer.id_marca_camion = this.inMarcaCamion(chofer.marca_camion);
          chofer.tipo_camion = element.tipo_camion == undefined ? 'Chasis' : element.tipo_camion;
          chofer.id_tipo_camion = this.inTipoCamion(chofer.tipo_camion);
          chofer.ano_camion = element.ano_camion == undefined ? 0 : element.ano_camion;
          chofer.camion_carga_peligrosa = element.camion_carga_peligrosa == undefined ? 'NO' : element.camion_carga_peligrosa;
          chofer.marca_acoplado = element.marca_acoplado == undefined ? 'Otros' : element.marca_acoplado;
          chofer.id_marca_acoplado = this.inMarcaAcoplado(chofer.marca_acoplado);
          chofer.tipo_acoplado = element.tipo_acoplado == undefined ? 'Acoplado Convencional' : element.tipo_acoplado;
          chofer.id_tipo_acoplado = this.inTipoAcoplado(chofer.tipo_acoplado);
          chofer.ano_acoplado = element.ano_acoplado == undefined ? 0 : element.ano_acoplado;
          chofer.acoplado_carga_peligrosa = element.acoplado_carga_peligrosa == undefined ? '0' : element.acoplado_carga_peligrosa; */
        }
      }
      this.validarChofer();
    };
    fileReader.readAsArrayBuffer(this.file);
    this.isErrorLoad = false;
  }

  validarChofer() {
    for (let index = 0; index < this.choferes.length; index++) {
      const chofer = this.choferes[index];
      this.choferes[index].observaciones = this.validar(chofer);
      if (this.choferes[index].observaciones.length > 0)
        this.choferes[index].hayError = true;
      else this.choferes[index].hayError = false;
    }
    this.dataSource.data = this.choferes;
    this.cantidadChoferesValidos = 0;
    this.choferes.forEach((element) => {
      if (!element.hayError) this.cantidadChoferesValidos++;
    });
  }

  getItemsCamion() {
    this.getItemSub = this.nomencladoresService
      .getAllMarcaCamionesSelect()
      .subscribe((data) => {
        this.marcaCamiones = data.data.marcaCamion;
      });
  }
  getItemsTipoCamion() {
    this.getItemSub = this.nomencladoresService
      .getAllTipoCamionesSelect()
      .subscribe((data) => {
        this.tipoCamion = data.data.tipoCamion;
      });
  }

  getItemsAcoplados() {
    this.getItemSub = this.nomencladoresService
      .getAllMarcaAcopladosSelect()
      .subscribe((data) => {
        this.marcaAcoplados = data.data.marcaAcoplado;
      });
  }
  getItemsTipoAcoplados() {
    this.getItemSub = this.nomencladoresService
      .getAllTipoAcopladosSelect()
      .subscribe((data) => {
        this.tipoAcoplados = data.data.tipoAcoplado;
      });
  }

  validar(chofer: Choferes) {
    let valor = [];
    if (chofer.ruc.length > 11)
      valor.push("El ruc es mayor que 11, la cantidad de dígitos válidos");
    if (chofer.telefono.length == 0)
      valor.push("El teléfono no puede estar en blanco");
    if (chofer.nombre.length == 0)
      valor.push("El nombre no puede estar en blanco");
    if (chofer.apellidos.length == 0)
      valor.push("Los apellidos no puede estar en blanco");
    if (chofer.chapa_camion.length == 0) {
      valor.push("La chapa del camión no puede estar en blanco");
    } else {
      if (!this.esPatente(chofer.chapa_camion))
        valor.push("La chapa del camión no válido");
    }
    if (chofer.chapa_acoplado.length == 0) {
      valor.push("La chapa del acoplado no puede estar en blanco");
    } else {
      if (!this.esPatente(chofer.chapa_acoplado))
        valor.push("La chapa del acoplado no válido");
    }
    if (chofer.email.length != 0) {
      if (!this.esCorreoElectronico(chofer.email))
        valor.push("Email no válido");
    }
    return valor;
  }

  esCorreoElectronico = (correoElectronico) =>
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      correoElectronico
    );
  //esPatente = (patente) => /^[A-Z]{3,4}[0-9]{3}$/.test(patente);
  esPatente = (patente) => /^[A-Z]{3,4}[0-9]{3}$/i.test(patente);
  /* inMarcaCamion(marca_camion: string) {
    let id: number = 0;
    this.marcaCamiones.forEach(element => {
      if (element.descripcion == marca_camion) {
        id = element.id;
      }
    });
    return id;
  }
  inTipoCamion(tipo_camion: string) {
    let id: number = 0;
    this.tipoCamion.forEach(element => {
      if (element.descripcion == tipo_camion) {
        id = element.id;
      }
    });
    return id;
  }
  inMarcaAcoplado(marca_acoplado: string) {
    let id: number = 0;
    this.marcaAcoplados.forEach(element => {
      if (element.descripcion == marca_acoplado) {
        id = element.id;
      }
    });
    return id;
  }
  inTipoAcoplado(tipo_acoplado: string) {
    let id: number = 0;
    this.tipoAcoplados.forEach(element => {
      if (element.descripcion == tipo_acoplado) {
        id = element.id;
      }
    });
    return id;
  } */

  CargarChoferes() {
    this.loader.open();
    const listChoferes = [];
    this.postData.choferes = [];
    this.choferes = this.choferes.map(chofer => {
      return {
          ...chofer,
          telefono: chofer.telefono.replace(/[+\s]/g, '') // Elimina '+' y espacios
      };
  });
    this.choferes.forEach((element) => {
      if (!element.hayError) {
        const chofer = {
          persona: {
            nombre: element.nombre,
            apellidos: element.apellidos,
            cuit_cuil: element.ruc,
            telefono: element.telefono,
            email: element.email,
            domicilio: "Paraguay",
            id_tipo_persona: "2",
            razon_social: element.razon_social,
            /*id_localidad: element.id_localidad,
             */
          },
          camion: {
            patente: element.chapa_camion,
            id_marca_camion: 14,
            id_tipo_camion: 1,
            carga_peligrosa: 0,
            anno: "2022",
          },
          acoplado: {
            patente: element.chapa_acoplado,
            id_marca_acoplado: 24,
            id_tipo_acoplado: 0,
            carga_peligrosa: 0,
            anno: "2022",
          },
          cuit_transportista: element.ruc,
        };
        listChoferes.push(chofer);
      }
    });
    this.postData.choferes = listChoferes;
    this.centrosService.postCargaMasiva(this.postData).subscribe(
      (data) => {
        if (this.loader !== null) {
          this.loader.close();
        }
        if (data.data.errors.length > 0) {
          this.listError = data.data.errors;
          this.isErrorLoad = true;
        }
        if (data.data.count_success > 0) {
          let msg = "";
          this.cantidadChoferesValidos = 0;
          this.dataSource.data = [];
          if (data.data.count_success == 1) msg = "¡ Se cargó 1 chofer !";
          else
            msg = "¡ Se cargaron  " + data.data.count_success + " choferes !";
          this.alertService
            .confirm({
              message: msg,
              tipo: "exito",
            })
            .subscribe((res) => {
              if (res) {
              }
            });
        } else {
          this.errorService.confirm({
            message:
              "¡No se pudo realizar la carga masiva, por presentar los choferes errores. Vea la tabla de errores! ",
          });
        }
      },
      (err) => {
        if (this.loader !== null) {
          this.loader.close();
        }
        this.errorService.confirm({
          message: "¡No se pudo realizar la carga masiva! ",
        });
      }
    );
  }
  descargarArchivo() {
    window.open(this.showUrl, "_blank");
  }

  showTablaExcel() {
    this.mostrarTablaExcel = true;
    this.mostrarTableError = false;
  }
  showTablaErrors() {
    this.mostrarTablaExcel = false;
    this.mostrarTableError = true;
  }

  comprobarEmails(email: string) {
    let info_emails = [];
    let incorrect_emails: boolean = false;
    if (email !== "") {
      const emailsparam = email;
      info_emails = emailsparam.split(";");
      for (let i = 0; i < info_emails.length; i++) {
        let index = info_emails[i].indexOf("@");
        if (info_emails[i].indexOf("@") === -1) {
          incorrect_emails = true;
        }
      }
    } else {
      incorrect_emails = true;
    }
    return incorrect_emails;
  }
}
