import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppAlertService, AppErrorService, AppLoaderService, NomencladoresService } from '@app/shared/services';

@Component({
  selector: 'app-editPhone',
  templateUrl: './editPhone.component.html',
  styleUrls: ['./editPhone.component.scss']
})
export class EditPhoneComponent implements OnInit {
  editPhoneForm: FormGroup;
  phoneNumberPattern = "^595[0-9]{9}$";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public nomencladoresService: NomencladoresService,
    private loader: AppLoaderService,
    private errorService: AppErrorService,
    private alertService: AppAlertService,
    public dialogRef: MatDialogRef<EditPhoneComponent>
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.editPhoneForm = new FormGroup({
      telefono: new FormControl(this.data.telefono, [Validators.required, Validators.pattern("^[0-9]{12}$")]),
    });
  }

  submit() {
    this.loader.open();
    if (this.f.telefono.value != this.data.telefono.value) {
      let data = {
        id_chofer: this.data.idChofer,
        telefono: this.f.telefono.value,
        id_cupo: this.data.id_cupo,
      };
      console.log('data a send', data);
      // servicio que edita patentes
      this.nomencladoresService.updatePhone(data).subscribe(ok => {
        this.loader.close();
        this.alertService
          .confirm({
            message: "Teléfono actualizado correctamente",
            tipo: "exito"
          })
          .subscribe(res1 => {
            if (res1) {
              this.dialogRef.close(ok);
              return;
            }
          });
      }, err => {
        this.loader.close();
        this.errorService.confirm({ message: err.error.data[0].message }).subscribe((res) => {
          if (res) {
            return;
          }
        });
      })
    }
  }
  get f() {
    return this.editPhoneForm.controls;
  }
  cancelar() {

    this.dialogRef.close(false);
  }

}
