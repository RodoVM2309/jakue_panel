import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG
} from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { GestureConfig } from "@angular/material";
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface
} from "ngx-perfect-scrollbar";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

import { InMemoryWebApiModule } from "angular-in-memory-web-api";
import { InMemoryDataService } from "./shared/inmemory-db/inmemory-db.service";

import { rootRouterConfig } from "./app.routing";
import { SharedModule } from "./shared/shared.module";
import { AppComponent } from "./app.component";

import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { JwtInterceptorService } from "./shared/helpers/jwt-interceptor.service";
import { AuthService } from "./shared/services/auth.service";
import { UserService } from "./shared/services/user.service";
import { GlobalService } from "./shared/models/global.service";
import { GridModule } from "@progress/kendo-angular-grid";
import { UniqueMarcaValidatorDirective } from "./shared/directives/unique-marca.directive";
import { UniquePatenteCamionDirective } from "./shared/directives/unique-patente-camion.directive";
import { UniquePatenteAcopladoDirective } from "./shared/directives/unique-patente-acoplado.directive";
import { UniqueEmailPersonaDirective } from "./shared/directives/unique-email-persona.directive";
import { UniqueTelefonoPersonaDirective } from "./shared/directives/unique-telefono-persona.directive";

import { NgxPaginationModule } from "ngx-pagination";
import { FormsModule } from "@angular/forms";
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AngularFireModule } from "@angular/fire";
import { environment } from "../environments/environment";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { IsDadorCuitDirective } from "./shared/directives/is-dador-cuit.directive";
import { IsChoferCuitDirective } from "./shared/directives/is-chofer-cuit.directive";

// sockets

//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AmazingTimePickerModule } from 'amazing-time-picker';

//const config: SocketIoConfig = { url: environment.wsUrl, options: {} };
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
//import { DualListBoxModule } from 'ng2-listbox-dual';
/* import { NgxDualListboxModule } from 'ngx-dual-listbox'; */

//import { PdfViewerModule } from 'ng2-pdf-viewer';

//Esto tambien, llevarlo al modulo de session
import {
  MatProgressBarModule,
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule,
  MatSelectModule,
  MatSidenavModule
} from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

//Importo los terminos y condiciones aca para probarlo, despues sacarlo y movelor al modulo y al routing de sessions
import { TermsAndConditionsComponent } from '../app/views/sessions/terms-and-conditions/terms-and-conditions.component';
import { PoliticaDePrivacidadComponent } from '../app/views/politica-de-privacidad/politica-de-privacidad.component';

import { SubirImagenOrigenComponent } from "../app/views/admin/origenes/subir-imagen-origen/subir-imagen-origen.component";

@NgModule({
  imports: [
    MatProgressBarModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatSelectModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    GridModule,
    SharedModule,
    HttpClientModule,
    PerfectScrollbarModule,
    NgxDatatableModule,
    AmazingTimePickerModule,
    SatDatepickerModule,
    SatNativeDateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    InMemoryWebApiModule.forRoot(InMemoryDataService, {
      passThruUnknownUrl: true
    }),
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    NgxPaginationModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    //SocketIoModule.forRoot(config),
    //PdfViewerModule,
    //DualListBoxModule.forRoot()
    /* NgxDualListboxModule.forRoot() */
  ],
  declarations: [
    AppComponent,
    UniqueMarcaValidatorDirective,
    UniquePatenteCamionDirective,
    UniquePatenteAcopladoDirective,
    UniqueEmailPersonaDirective,
    UniqueTelefonoPersonaDirective,
    IsDadorCuitDirective,
    IsChoferCuitDirective,
    TermsAndConditionsComponent,
    PoliticaDePrivacidadComponent,
    SubirImagenOrigenComponent,
  ],
  entryComponents: [
    SubirImagenOrigenComponent,
  ],

  exports: [
    SubirImagenOrigenComponent
  ],
  providers: [
    AuthService,
    UserService,
    GlobalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true
    },
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
// bootstrap
/* import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => { console.error(err) });
 */
