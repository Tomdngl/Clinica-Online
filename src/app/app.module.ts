import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; 
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ComponentsModule } from './components/components.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireModule } from '@angular/fire/compat';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ComponentsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp({"projectId":"clinica-online-8b8b6","appId":"1:230463154618:web:2bf27c6915406774e99583","storageBucket":"clinica-online-8b8b6.appspot.com","apiKey":"AIzaSyBRqBaDidOpIeYPYbUuQX4McXkVT-WExUo","authDomain":"clinica-online-8b8b6.firebaseapp.com","messagingSenderId":"230463154618"}),
    AngularFirestoreModule,
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp({"projectId":"clinica-online-8b8b6","appId":"1:230463154618:web:2bf27c6915406774e99583","storageBucket":"clinica-online-8b8b6.appspot.com","apiKey":"AIzaSyBRqBaDidOpIeYPYbUuQX4McXkVT-WExUo","authDomain":"clinica-online-8b8b6.firebaseapp.com","messagingSenderId":"230463154618"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    ToastrModule.forRoot(),
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
