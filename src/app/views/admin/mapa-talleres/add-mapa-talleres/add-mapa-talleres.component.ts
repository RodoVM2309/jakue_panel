import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
export interface Marcador {
  lat: number;
  lng: number;
  draggable: boolean;
  titulo: string;
  desc?: string;
};
@Component({
  selector: 'app-add-mapa-talleres',
  templateUrl: './add-mapa-talleres.component.html',
  styleUrls: ['./add-mapa-talleres.component.scss']
})
export class AddMapaTalleresComponent implements OnInit {
  public itemForm: FormGroup;
  showMap: boolean = true;
  pages: any;
  lat: number = -32.96104572191259;
  lng: number = -61.15374192669714;
  zoom: number = 7;
  marcadores: Marcador[] = [];
  marcadorSel: any = null;
  draggable: string = '1';
  panelOpenState = false;
  deshabilitarCoord: boolean = true;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddMapaTalleresComponent>,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      longitud: [item.longitud || '', Validators.required],
      latitud: [item.latitud || '', Validators.required],
      descripcion: [item.descripcion || '', Validators.required]
    });
  }

  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }
  closeMap() {
    this.showMap = false;
  }

  openMap() {
    this.showMap = true;
  }

  clickMapa(evento) {
    const nuevoMarcador: Marcador = {
      lat: evento.coords.lat,
      lng: evento.coords.lng,
      titulo: '',
      draggable: true
    };
    this.itemForm.controls['latitud'].setValue(evento.coords.lat);
    this.itemForm.controls['longitud'].setValue(evento.coords.lng);
    if (this.marcadores.length > 0) {
      this.marcadores[0] = nuevoMarcador;
    } else {
      this.marcadores.push(nuevoMarcador);
    }
  }

  clickMarcador(marcador: Marcador, i: number) {
    this.marcadorSel = marcador;
    if (this.marcadorSel.draggable) {
      this.draggable = '1';
    } else {
      this.draggable = '0';
    }
  }

  borrarMarcador(idx: number) {
    this.marcadores.splice(idx, 1);
  }

  cambiarDraggable() {
    if (this.draggable === '1') {
      this.marcadorSel.draggable = true;
    } else {
      this.marcadorSel.draggable = false;
    }
  }

  dragEndMarcador(marcador: Marcador, evento) {
    let lat = evento.coords.lat;
    let lng = evento.coords.lng;
    marcador.lat = lat;
    marcador.lng = lng;
    this.marcadores[0] = marcador;
    this.itemForm.controls['latitud'].setValue(evento.coords.lat);
    this.itemForm.controls['longitud'].setValue(evento.coords.lng);

  }
}