/// <reference types="@types/googlemaps" />
import {
  Component, ElementRef,
  Inject, OnInit,
  ViewChild
} from "@angular/core";
import {
  FormControl, FormGroup, Validators
} from "@angular/forms";
import {
  DateAdapter, MatDialogRef, MatTableDataSource, MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_DIALOG_DATA
} from "@angular/material";
import {
  AppDateAdapter,
  APP_DATE_FORMATS
} from "@shared/helpers/date.adapter";
import { Observable, Subscription } from "rxjs";
import { NomencladoresService } from "../../../services/nomencladores.service";
import { UserService } from "../../../services/user.service";

import { Dador } from "../../../models/dador";
import { Origen } from "../../../models/origen";
declare let googlemaps: any;

@Component({
  selector: "edit-patente",
  templateUrl: "./edit-patente.component.html",
  styleUrls: ["./edit-patente.component.scss"],
  providers: [
    UserService,
    {
      provide: DateAdapter,
      useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es-ES"
    }
  ]
})
export class EditPatenteComponent implements OnInit {
  @ViewChild("choferCuit") choferCuit: ElementRef;
  formData = {};
  editPatenteForm: FormGroup;
  chofercuit: any;
  public getItemSub: Subscription;
  dadores: Dador;
  origenes: Origen[];
  public isInvalid: any;
  public incorrect_chofer_cuit: boolean = false;
  public disponible_chofer_cuit: boolean = true;
  public searchControl: FormControl;
  public greaterThanValue: any;
  public lessThanValue: any;
  filteredOptions: Observable<Origen[]>;
  filteredid_cliente: Observable<Dador[]>;
  public isDisabled: boolean;

  public unidadtipotarifa = "tn";
  @ViewChild("search")
  public searchElementRef: ElementRef;
  public dd = [];

  arrayBuffer: any;
  file: File;

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ["id", "descripcion", "acciones"];

  min = 10;
  max = 99;
  minValue: any;
  maxValue: any;
  maxValue2: any;
  esValidadoChofer: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public nomencladoresService: NomencladoresService,
    public dialogRef: MatDialogRef<EditPatenteComponent>
  ) { }

  ngOnInit() {
    console.log(this.data)

    this.editPatenteForm = new FormGroup({
      chapa_camion: new FormControl("", [Validators.required]),
      chapa_acoplado: new FormControl("", [Validators.required]),
    });
  }



  submit() {
    // this.loader.open();
    let data = {
      id_chofer: this.data.idChofer,
      patente_camion: this.editPatenteForm.controls["chapa_camion"].value,
      patente_acoplado: this.editPatenteForm.controls["chapa_acoplado"].value,
      enviar_notificacion_viaje_modificado: this.data.isUpdate,
      id_cupo_terminal: this.data.id_cupo_terminal
    };
    // servicio que edita patentes
    this.nomencladoresService.updateChapas(data).subscribe(ok => {
      //console.log(ok)
      this.dialogRef.close(ok);
    }, err => {
      this.dialogRef.close(1);
    })
  }


  cancelar() {

    this.dialogRef.close(false);
  }
}
