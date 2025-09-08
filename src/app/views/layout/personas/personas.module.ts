import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonasRoutingModule } from './personas-routing.module';
import { PersonasComponent } from './personas/personas.component';
import { AddPersonasComponent } from './add-personas/add-personas.component';

@NgModule({
  imports: [
    CommonModule,
    PersonasRoutingModule
  ],
  declarations: [PersonasComponent, AddPersonasComponent]
})
export class PersonasModule { }
