import { Component,OnInit,Inject} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialog } from "@angular/material";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from "@angular/forms";
import { CupoService } from '../../../cupo/cupo.service';
import { DemandaCupo } from 'app/shared/models/demanda-cupo';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-cambiar-demanda',
  templateUrl: './cambiar-demanda.component.html',
  styleUrls: ['./cambiar-demanda.component.scss'],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class CambiarDemandaComponent implements OnInit {
  demandaCupo: DemandaCupo ;
  chanceCountCupoForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<CambiarDemandaComponent>,
  private cupoService: CupoService,
  private errorService: AppErrorService,
  private alertService: AppAlertService,
  private loader: AppLoaderService,) { }

  ngOnInit() {
    this.demandaCupo=this.data.payload.demanda;
    this.chanceCountCupoForm = new FormGroup({
      cantidad: new FormControl(this.demandaCupo.asignado,Validators.min(this.demandaCupo.asignado))
      })
  }

  submit() {
    this.loader.open();
    let data = {
      id_demanda:this.demandaCupo.id_demanda_cupo,
      cantidad: this.chanceCountCupoForm.controls["cantidad"].value
    };
    this.cupoService.postVariarCantidad(data).subscribe(
      data => {
        if (this.loader !== null) {
          this.loader.close();
        }
        this.alertService
          .confirm({
            message: "¡Modificación de la cantidad de cupos correctamente!",
            tipo: "exito"
          })
          .subscribe(res => {
            if (res) {
              this.dialogRef.close(1);
              return;
            }
          });
      },
      err => {
        if (this.loader !== null) {
          this.loader.close();
        }
        this.errorService.confirm({
          message: "¡Error, no se pudo modificar la cantidad! "
        });
        this.dialogRef.close();
      }
    );
    this.dialogRef.close(1);
  }

}
