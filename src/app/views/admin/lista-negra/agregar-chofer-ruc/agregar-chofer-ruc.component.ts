import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PersonasService } from './../../../../shared/services/personas.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { AppErrorService } from '../../../../shared/services/app-error/app-error.service';

@Component({
  selector: 'app-agregar-chofer-ruc',
  templateUrl: './agregar-chofer-ruc.component.html',
  styleUrls: ['./agregar-chofer-ruc.component.scss']
})
export class AgregarChoferRucComponent implements OnInit {
  public rucForm: FormGroup;
  public choferEncontrado: any = null;
  public mostrarFormularioChofer: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AgregarChoferRucComponent>, 
    private fb: FormBuilder,
    private personasService: PersonasService,
    private loader: AppLoaderService,
    private errorService: AppErrorService
  ) { }

  ngOnInit() {
    this.buildRucForm();
  }

  buildRucForm() {
    this.rucForm = this.fb.group({
      cuit: ['', [Validators.required, Validators.pattern(/^\d+$/)]]
    });
  }

  buscarChofer() {
    if (this.rucForm.invalid) {
      return;
    }

    const cuit = this.rucForm.get('cuit').value;
    this.loader.open();

    this.personasService.getChoferCuit(cuit).subscribe(
      (response) => {
        this.loader.close();
        
        if (response.success && response.data && response.data.transportistas && response.data.transportistas.length > 0) {
          this.choferEncontrado = response.data.transportistas[0];
          this.mostrarFormularioChofer = true;
        } else {
          this.errorService.confirm({ 
            message: 'Chofer no encontrado con el RUC proporcionado' 
          });
          this.choferEncontrado = null;
          this.mostrarFormularioChofer = false;
        }
      },
      (error) => {
        this.loader.close();
        this.errorService.confirm({ 
          message: 'Error al buscar el chofer: ' + error 
        });
        this.choferEncontrado = null;
        this.mostrarFormularioChofer = false;
      }
    );
  }

  continuar() {
    if (this.choferEncontrado) {
      // Enviar los datos del chofer encontrado para continuar con el flujo de agregar a lista negra
      const choferData = {
        id: this.choferEncontrado.id_chofer,
        id_usuario: this.choferEncontrado.id_chofer,
        nombre_chofer: this.choferEncontrado.nombre_chofer,
        cuit_chofer: this.choferEncontrado.cuit_chofer,
        patente_camion: this.choferEncontrado.patente_camion,
        patente_acoplado: this.choferEncontrado.patente_acoplado
      };
      
      this.dialogRef.close(choferData);
    }
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
