import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonasComponent} from './personas/personas.component';
import { AddPersonasComponent } from './add-personas/add-personas.component';

const routes: Routes = [
  {
    path: '',
    children: [ {
      path: 'personas',
      component: PersonasComponent,
      data: { title: 'Lista de Personas' }
    }, {
      path: 'addPersona',
      component: AddPersonasComponent,
      data: { title: 'Add Persona' }
    }]} 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonasRoutingModule { }
