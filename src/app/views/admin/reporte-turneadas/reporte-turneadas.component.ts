import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { CentrosService } from 'app/shared/services/centros.service';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { FormGroup, FormControl } from '@angular/forms';
export class Lista {
  id?: number;
  id_centro: number;
  nombre: string;
}
@Component({
  selector: 'app-reporte-turneadas',
  templateUrl: './reporte-turneadas.component.html',
  styleUrls: ['./reporte-turneadas.component.scss']
})
export class ReporteTurneadasComponent implements OnInit {
  public listas: Lista[];
  public lista_chofer: any[];
  public getItemSub: Subscription;
  messages = {
    emptyMessage: `
      <div>        
        <span class="classname">No hay Registros</span>        
      </div>
    `
  };
  datosChofer: any;
  nombre_persona = "";
  public id_tipo_turneada = 0;
  public mostrarTurneada: boolean = false;
  filtrarForm: FormGroup;
  id_lista: any;
  modoCentro: boolean = true
  constructor(
    public centroService: CentrosService, 
    private nomencladoresService: NomencladoresService,
    ) { }

  ngOnInit() {
    this.filtrarForm = new FormGroup({
      selectedLista: new FormControl(this.id_lista)
    });
    this.getItems();
  }

  onChangeModo(value) {
    this.modoCentro = (value === 0) ? true : false;
    this.lista_chofer = [];
    if (this.modoCentro) {
    } else {
      this.filtrarForm.controls['selectedLista'].setValue('');
      this.id_lista = null;
    }
  }

  getItems() {
    this.getItemSub = this.nomencladoresService.getConfiguracionCentro()
      .subscribe(data => {
        this.id_tipo_turneada = data.data.id_tipo_turneada;
        this.mostrarTurneada = (this.id_tipo_turneada !== 0) ? true : false;
        if (this.mostrarTurneada) {
          this.getListaCentro();
        }
      });

  }

  getListaCentro() {
    this.getItemSub = this.centroService.getAllListaCentro(this.id_tipo_turneada)
      .subscribe(data => {
        this.listas = data.data;
      });
  }

  aplicarFiltro(value) {
    this.id_lista = value;
    this.getReporteListaTurneadas();
  }

  getReporteListaTurneadas() {
    this.getItemSub = this.centroService.getReporteListaTurneadas(this.id_lista)
      .subscribe(data => {
        this.lista_chofer = data.data;
      });
  }

  
}
