/// <reference types="@types/googlemaps" />
import { Component, OnInit, Inject, ViewChild, ElementRef, NgZone } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { FormBuilder, Validators, FormGroup, FormControl } from "@angular/forms";
import { PersonasService } from "./../../../../shared/services/personas.service";
import { AppLoaderService } from "../../../../shared/services/app-loader/app-loader.service";

import { Observable,  } from "rxjs";
import { map, startWith } from "rxjs/operators";

export interface Marcador {
  lat: number;
  lng: number;
  draggable: boolean;
  titulo: string;
  desc?: string;
}
export class Pais {
  id: number;
  descripcion: string;
}

export class Provincia {
  id: number;
  descripcion: string;
}

export class Localidad {
  id: number;
  descripcion: string;
}
@Component({
  selector: "app-add-parametro-chat",
  templateUrl: "./add-parametro-chat.component.html",
  styleUrls: ["./add-parametro-chat.component.scss"]
})
export class AddParametroChatComponent implements OnInit {
  public itemForm: FormGroup;
  showMap: boolean = true;
  pages: any;
  lat: number = -32.96104572191259;
  lng: number = -61.15374192669714;
  zoom: number = 8;
  marcadores: Marcador[] = [];
  paises: Pais[];
  provincias: Provincia[];
  filteredOptions: Observable<Localidad[]>;
  localidades: Localidad[];
  marcadorSel: any = null;
  draggable: string = "1";
  descripcion: string = "";
  panelOpenState = false;
  deshabilitarCoord: boolean = true;
  
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddParametroChatComponent>,
    private fb: FormBuilder,
    private personasService: PersonasService,
    private loader: AppLoaderService,
  ) {}

  ngOnInit() {
    this.buildItemForm(this.data.payload);    
    this.searchControl = new FormControl();   
   
  }

  get f() {
    return this.itemForm.controls;
  }

  

  buildItemForm(item) {
    this.descripcion  = item.descripcion;
    this.itemForm = this.fb.group({
      id: [item.id || ""],
      descripcion: [item.descripcion || "", Validators.required]
    });
  }

  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }
 

  
  private _filter(descripcion: string): Localidad[] {
    const filterValue = descripcion.toLowerCase();
    return this.localidades.filter(
      option => option.descripcion.toLowerCase().indexOf(filterValue) >= 0
    );
  }

  cargarDatosInicialesPaisLocalidad(pais, provincia, localidad) {
    this.loader.open();
    this.personasService.getPais().subscribe(data => {
      this.paises = data.data.paises;
      this.itemForm.controls["pais"].setValue(pais);
      this.personasService.getProvincias(pais).subscribe(data => {
        this.provincias = data.data;
        this.localidades = [];
        this.itemForm.controls["provincia"].setValue(provincia);
        this.personasService.geLocalidades(provincia).subscribe(data => {
          this.localidades = data.data;
          this.itemForm.controls["id_localidad"].setValue(localidad);
          this.filteredOptions = this.itemForm.controls[
            "id_localidad"
          ].valueChanges.pipe(
            startWith<string | Localidad>(""),
            map(value =>
              typeof value === "string" ? value : value.descripcion
            ),
            map(descripcion =>
              descripcion ? this._filter(descripcion) : this.localidades.slice()
            )
          );
          if (this.loader !== null) {
            this.loader.close();
          }
        });
      });
    });
  }
 
}
