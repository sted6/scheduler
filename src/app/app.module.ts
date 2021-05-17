import { LoginComponent } from './components/login/login.component';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { USE_EMULATOR as FIRESTORE_EMULATOR } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, USE_EMULATOR as FUNCTIONS_EMULATOR } from '@angular/fire/functions';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DateDirective } from './validators/invalid-date.directive';
import { InvalidTimesDirective } from './validators/invalid-times.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    DateDirective,
    InvalidTimesDirective
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'pocketrn-scheduler'),
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  // Firestore emulators are set here, must match ports set up in firebase.json
  providers: [
    {
      provide: FIRESTORE_EMULATOR,
      useValue: environment.production ? undefined : ['localhost', 8080],
    },
    {
      provide: FUNCTIONS_EMULATOR,
      useValue: environment.production ? undefined : ['localhost', 5001],
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
