import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  MatProgressBarModule,
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule,
  MatSelectModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
// import { CommonDirectivesModule } from './sdirectives/common/common-directives.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SessionsRoutes } from './sessions.routing';
import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error/error.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatSelectModule,
    FlexLayoutModule,
    RecaptchaV3Module,
    RouterModule.forChild(SessionsRoutes),
    //   NgHcaptchaModule.forRoot({
    //   // siteKey: '10000000-ffff-ffff-ffff-000000000001',
    //   siteKey: '85c1c663-5975-4092-a4bd-ac928073ec9e',
    //   languageCode: 'es'
    // }),
  ],
  declarations: [
    ForgotPasswordComponent,
    LockscreenComponent,
    SigninComponent,
    SignupComponent,
    NotFoundComponent,
    ErrorComponent,
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: '6Ldl2fAnAAAAAI0qC2hpxWofqs3AgQ2_sLu61Fzo'
    }
  ],
})
export class SessionsModule { }
