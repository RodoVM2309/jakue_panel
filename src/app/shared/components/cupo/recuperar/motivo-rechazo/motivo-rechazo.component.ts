import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NomencladoresService } from 'app/shared/services/nomencladores.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-motivo-rechazo',
  templateUrl: './motivo-rechazo.component.html',
  styleUrls: ['./motivo-rechazo.component.scss']
})
export class MotivoRechazoComponent implements OnInit {
  public itemForm: FormGroup;
  public getItemSub: Subscription;
  motivos = [];

  constructor(
    private fb: FormBuilder,
    private nomencladoresService: NomencladoresService,
    public dialogRef: MatDialogRef<MotivoRechazoComponent>,
  ) { }

  ngOnInit() {
    this.buildItemForm();
    this.getItemSub = this.nomencladoresService.getAllMotivosRechazo()
      .subscribe(data => {
        this.motivos = data.data.motivoRecuperarCupo;
      });
  }

  buildItemForm() {
    this.itemForm = this.fb.group({
      id_motivo_recuperar: ['', Validators.required],
      motivo_recuperar: ['', [Validators.maxLength(250)]],
    });
  }

  submit() {
    const datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }

}
