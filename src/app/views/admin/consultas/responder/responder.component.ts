import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { RespuestasService} from '../../../../shared/services/respuestas.service';
import { Respuesta } from './../../../../shared/models/respuesta';
import { UserService } from 'app/shared/services/user.service';
@Component({
  selector: 'app-responder',
  templateUrl: './responder.component.html',
  styleUrls: ['./responder.component.scss']
})
export class ResponderComponent implements OnInit {
  public itemForm: FormGroup;
  respuesta: Respuesta;
  isNew;
  id_muvin: string ='';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ResponderComponent>,
  private fb: FormBuilder,private respuestaService:RespuestasService,
  private userService: UserService) { }

  ngOnInit() {
    this.isNew=(this.data.isNew);
    this.buildItemForm(this.data.payload);
    this.userService.getIdPersonaRol(localStorage.getItem('rol'))
    .subscribe(data => this.id_muvin = data.data);

  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id_consulta: [item.id_consulta ],
      id_muvin: [this.id_muvin ],      
      mensaje: [ '', Validators.required] 
    });
    
    }

  submit() {
    let datafrm = this.itemForm.value;
    this.dialogRef.close(datafrm);
  }

}
