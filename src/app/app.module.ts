import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp({"projectId":"clinica-online-8b8b6","appId":"1:230463154618:web:2bf27c6915406774e99583","storageBucket":"clinica-online-8b8b6.appspot.com","locationId":"us-central","apiKey":"AIzaSyBRqBaDidOpIeYPYbUuQX4McXkVT-WExUo","authDomain":"clinica-online-8b8b6.firebaseapp.com","messagingSenderId":"230463154618"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
