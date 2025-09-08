import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TransporteChoferService } from './../../../../shared/services/transporte-chofer.service';
import { Equipo } from './../../../../shared/models/equipo';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-vincular-equipo',
  templateUrl: './vincular-equipo.component.html',
  styleUrls: ['./vincular-equipo.component.scss']
})
export class VincularEquipoComponent implements OnInit {
  public itemForm: FormGroup;
  equipos: Equipo[];
  equipoasignado = 0;
  idchofer: any;
  equiponulo: Equipo;
  idChoferEquipo = 0;
  rol: string = localStorage.getItem("rol");
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VincularEquipoComponent>,
    private fb: FormBuilder,
    private transportechoferService: TransporteChoferService,
    private loader: AppLoaderService) { }

  ngOnInit() {
    this.idchofer = this.data.payload.data.chofer.id;
    this.idChoferEquipo = this.data.payload.data.chofer.id_chofer_equipo;
    this.getAllEquiposSinChofer(this.data.payload.data.chofer.id_transportista);
    this.getChoferEquipo();
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id_transporte: [item.id_transporte || ''],
      id_chofer: [item.data.chofer.id || ''],
      id_equipo: ['', Validators.required],
      id: ['']
    });
  }

  submit() {

    if (this.equipoasignado !== this.itemForm.controls['id_equipo'].value) {
      this.dialogRef.close(this.itemForm.value);
    } else {
      this.dialogRef.close();
    }
  }
  
  getAllEquiposSinChofer(id_transportista) {
    this.loader.close();
    if (this.rol == '3') {
      this.transportechoferService.getAllEquiposSinChoferCentro(id_transportista)
        .subscribe(data => {
          this.equipos = data.data;
          this.equiponulo = {
            id: 0,
            id_camion: 0,
            id_acoplado: 0,
            latitud: 0,
            longitud: 0,
            bloqueado: 0,
            nombre_transportista: '',
            nombre_tipo_camion: '',
            nombre_marca_camion: 'Sin Equipo',
            anno_camion: '',
            patente_camion: '',
            bloqueado_camion: 0,
            nombre_tipo_acoplado: '',
            nombre_marca_acoplado: '',
            anno_acoplado: '',
            patente_acoplado: '',
            bloqueado_acoplado: 0,
            desc_bloqueado: ''
          };
          this.equipos.push(this.equiponulo);
        });
    } else {
      this.transportechoferService.getAllEquiposSinChofer(id_transportista)
        .subscribe(data => {
          this.equipos = data.data;
          this.equiponulo = {
            id: 0,
            id_camion: 0,
            id_acoplado: 0,
            latitud: 0,
            longitud: 0,
            bloqueado: 0,
            nombre_transportista: '',
            nombre_tipo_camion: '',
            nombre_marca_camion: 'Sin Equipo',
            anno_camion: '',
            patente_camion: '',
            bloqueado_camion: 0,
            nombre_tipo_acoplado: '',
            nombre_marca_acoplado: '',
            anno_acoplado: '',
            patente_acoplado: '',
            bloqueado_acoplado: 0,
            desc_bloqueado: ''
          };
          this.equipos.push(this.equiponulo);
        });
    }
  }


  getChoferEquipo() {
    if (this.rol == '3') {
      this.transportechoferService.getChoferEquipoCentro(this.idchofer)
        .subscribe(data => {
          if (data.success) {
            if (data.data.id_equipo !== null) {
              this.itemForm.controls['id'].setValue(data.data.id);
              this.itemForm.controls['id_equipo'].setValue(0);
              this.equipoasignado = data.data.id_equipo;
            } else {
              this.itemForm.controls['id'].setValue(data.data.id);
              this.itemForm.controls['id_equipo'].setValue(0);
              this.equipoasignado = 0;
            }
            if (this.loader !== null) {
              this.loader.close();
            }
          }
        });
    } else {
      this.transportechoferService.getChoferEquipo(this.idchofer)
        .subscribe(data => {
          if (data.success) {
            if (data.data.id_equipo !== null) {
              this.itemForm.controls['id'].setValue(data.data.id);
              this.itemForm.controls['id_equipo'].setValue(0);
              this.equipoasignado = data.data.id_equipo;
            } else {
              this.itemForm.controls['id'].setValue(data.data.id);
              this.itemForm.controls['id_equipo'].setValue(0);
              this.equipoasignado = 0;
            }
            if (this.loader !== null) {
              this.loader.close();
            }
          }
        });
    }
  }
 

}
