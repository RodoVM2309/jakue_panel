import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from '@app/shared/shared-material.module';

import { FilterCupoDisponibleComponent } from './filter-cupo-disponible/filter-cupo-disponible.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    FlexLayoutModule,
  ],
  exports:[
    FilterCupoDisponibleComponent,
  ],
  declarations: [FilterCupoDisponibleComponent]
})
export class SharedFilterCupo { }
