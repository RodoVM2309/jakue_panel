/// <reference types="@types/googlemaps" />
import { Component, OnInit, Inject, ViewChild, ElementRef, NgZone } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar
} from "@angular/material";
import { FormBuilder, Validators, FormGroup, FormControl } from "@angular/forms";
import { PersonasService } from "./../../../../shared/services/personas.service";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "../../../../shared/services/app-loader/app-loader.service";
import { AppAlertService } from "../../../../shared/services/app-alert/app-alert.service";
import { AppErrorService } from "../../../../shared/services/app-error/app-error.service";
import { AppAtencionService } from "../../../../shared/services/app-atencion/app-atencion.service";
import { MapsAPILoader } from "@agm/core";
import { UserService } from "app/shared/services/user.service";

export interface Marcador {
  lat: number;
  lng: number;
  draggable: boolean;
  titulo: string;
  desc?: string;
}

@Component({
  selector: "app-add-operador-chat",
  templateUrl: "./add-operador-chat.component.html",
  styleUrls: ["./add-operador-chat.component.scss"]
})
export class AddOperadorChatComponent implements OnInit {
  public itemForm: FormGroup;
  showMap: boolean = true;
  pages: any;
  
  nombre: string;
  apellidos: string;
  telefono: string;
  
  panelOpenState = false;
  deshabilitarCoord: boolean = true;
  
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;

  @ViewChild("search")
  public searchElementRef: ElementRef;
  idUser: string ='';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddOperadorChatComponent>,
    private fb: FormBuilder,
    private personasService: PersonasService,
    private confirmService: AppConfirmService,
    private snack: MatSnackBar,
    private errorService: AppErrorService,
    private atencionService: AppAtencionService,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
      .subscribe(data => this.idUser = data.data);
    this.buildItemForm(this.data.payload);
    this.searchControl = new FormControl();    
  }

  get f() {
    return this.itemForm.controls;
  }

 

  buildItemForm(item) {
    this.nombre = item.nombre;
    this.apellidos = item.apellidos;
    this.telefono = item.telefono;   
    this.itemForm = this.fb.group({
      id: [item.id || ""],
      nombre: [item.nombre || "", Validators.required],
      apellidos: [item.apellidos || "", Validators.required],
      telefono: [item.telefono || "", Validators.required],
      id_centro: this.idUser
    });
  }

  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }
  
  
 

  

  
}
