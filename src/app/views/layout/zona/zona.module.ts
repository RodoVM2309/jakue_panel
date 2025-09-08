import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZonaRoutingModule } from './zona-routing.module';
import { ZonaComponent } from './zona.component';

@NgModule({
  imports: [
    CommonModule,
    ZonaRoutingModule
  ],
  declarations: [ZonaComponent]
})
export class ZonaModule { }
