
import { Component, OnInit, Inject, ViewChild } from '@angular/core'; import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import {
  MatSort,
  MatTableDataSource
} from "@angular/material";
import { Cupo } from 'app/shared/models/cupo';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';

@Component({
  selector: 'app-add-cupo',
  templateUrl: './add-cupo.component.html',
  styleUrls: ['./add-cupo.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AddCupoComponent implements OnInit {
  cupos: Cupo[] = [];
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    "first_column",
    "dadorCuit",
    "idCupoTerminal",
    "nombrePuerto",
    "cosecha",
    "nroContrato",
    "selectedCupo",
  ];
  
  expandedElement: Cupo;
  totalSize = 5;
  tableWidth: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddCupoComponent>,
    private alertService: AppAlertService,
  ) { }

  ngOnInit() {
    this.cupos = this.data.payload.cupos;
    this.dataSource.data = this.cupos;
    this.dataSource.sort = this.sort;
  }
  submit() {
    this.dialogRef.close();
  }
  selectCupo(row: Cupo) {
    this.alertService
      .confirm({
        message: "Cupo Seleccionado: " + row.idCupoTerminal,
        tipo: "exito"
      })
      .subscribe(res1 => {
        if (res1) {
          this.dialogRef.close(row);
          return;
        }
      });
  }
  onCheckboxChange(chck, cupo, index) {
    if (chck.checked) {
      this.alertService
      .confirm({
        message: "Cupo Seleccionado: " + cupo.idCupoTerminal,
        tipo: "exito"
      })
      .subscribe(res1 => {
        if (res1) {
          this.dialogRef.close(cupo);
          return;
        }
      });
    }
  }

}
