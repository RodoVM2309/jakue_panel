import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from "@angular/material";
import { CdkTableModule } from "@angular/cdk/table";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SharedModule } from "../../shared.module";
import { QuillModule } from "ngx-quill";


import { DocumentosRoutingModule } from './documentos-routing.module';
import { ChoferesComponent } from './choferes/choferes.component';
import { MostrarDocumentoComponent } from './mostrar-documento/mostrar-documento.component';
import { SubirDocumentoComponent } from './subir-documento/subir-documento.component';

@NgModule({
  imports: [
    CommonModule, FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    FlexLayoutModule,
    QuillModule,
    ChartsModule,
    NgxDatatableModule,
    SharedModule,
    CdkTableModule,
    DocumentosRoutingModule
  ],
  declarations: [ChoferesComponent, MostrarDocumentoComponent, SubirDocumentoComponent],
  entryComponents: [SubirDocumentoComponent, MostrarDocumentoComponent]
})
export class DocumentosModule { }
