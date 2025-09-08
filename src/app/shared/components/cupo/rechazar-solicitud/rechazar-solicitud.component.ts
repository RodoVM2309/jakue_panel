import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ItemsBasico } from "app/shared/models/v2-demandados";
import { CupoService } from "../cupo.service";

@Component({
  selector: "app-rechazar-solicitud",
  templateUrl: "./rechazar-solicitud.component.html",
  styleUrls: ["./rechazar-solicitud.component.scss"],
  providers: [CupoService],
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
      ),
    ]),
  ],
})
export class RechazarSolicitudComponent implements OnInit {
  motivos: ItemsBasico[] = [];
  public itemForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RechazarSolicitudComponent>,
    private fb: FormBuilder,
    private cupoService: CupoService
  ) {}

  ngOnInit() {
    this.getItemsMotivosRechazoDemandas();
    this.buildItemForm();
  }
  buildItemForm() {
    this.itemForm = this.fb.group({
      id: ["", Validators.required],
      comentario: ["", [ Validators.maxLength(250)]],
    });
  }

  getItemsMotivosRechazoDemandas() {
    this.motivos = [];
    this.cupoService.getMotivoRechazo().subscribe((data) => {
      this.motivos = data.data.motivoRechazoDemandaCupo;
    });
  }
  submit() {
    this.dialogRef.close(this.itemForm.value);
  }
}
