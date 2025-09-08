import { Component, OnInit, ViewChild  } from '@angular/core';
import { MatProgressBar, MatButton, } from '@angular/material';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { CentrosService } from '../../../shared/services/centros.service';
import { BaseChartDirective } from 'ng2-charts';
import { PersonasService } from '../../../shared/services/personas.service';
import { Person } from 'app/shared/models/person';
import { ExelService } from '../../../shared/services/exel.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

export interface Choferunistall {
  nombre: string;
  apellidos: string;
  cuit: string;
  telefono:  string;
  email: string;
 };

@Component({
  selector: 'app-choferes-uninstall',
  templateUrl: './choferes-uninstall.component.html',
  styleUrls: ['./choferes-uninstall.component.scss'],
  animations: egretAnimations
})
export class ChoferesUnistallComponent implements OnInit {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  @ViewChild(BaseChartDirective)

  public onesingalData = [];
  public personas: Person[];

  public filtro;
  contador: number;
  temporal: number;

  total_count: number;
  offset: number;
  cantidad: number;

  rows = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  temp = [];

  columns = [
    { prop: 'nombre' },
    { name: 'apellidos' },
    { prop: 'cuit' },
    { name: 'Telefono' },
    { name: 'Email' }
  ];

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private choferunistallService: CentrosService,
    private personasService: PersonasService,
    private excelService: ExelService
  ) {
    this.contador = 0;
    this.offset = 0;
   }

  ngOnInit() {
    setTimeout(() => { this.loadingIndicator = false; }, 40000);
    this.setPage();
  }


  setPage() {
    this.choferunistallService.getAllChoferUnistall(this.offset).subscribe(onesingalData => {
        this.onesingalData = onesingalData.players;
        this.cantidad = this.onesingalData.length;
        this.total_count = onesingalData.total_count;
        this.onesingalData.forEach(players => {
          this.contador++;
              if (players.invalid_identifier) {
                  this.filtro = players.id;
                  this.personasService.getAllPersonasMovil_key(this.filtro)
                    .subscribe(persona => {
                      this.temporal = persona.data.length;
                      if (persona.data.length > 0) {
                        const perso = persona.data[0];
                        const person: Choferunistall = {
                          nombre: perso.nombre,
                          apellidos: perso.apellidos,
                          cuit: perso.cuit_cuil,
                          telefono: perso.telefono,
                          email: perso.email
                        };
                        this.rows.push(person);
                        this.temp.push(person);
                        this.rows = [...this.rows];
                        this.temp = [...this.temp];
                      }
                  });
               }
          });
          this.offset = this.contador;
            if (this.offset <=  this.total_count) {
              this.setPage();
            }
      });
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.rows, 'Choferes no activos');
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function(d) {
      return d.nombre.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }

}


