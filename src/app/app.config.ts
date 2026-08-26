import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp } from '@angular/fire/app';
import { importProvidersFrom } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyBQI6BWA7-6Nf64htzp3vmbWJc302oCwXQ",
  authDomain: "proyectofinalp5.firebaseapp.com",
  projectId: "proyectofinalp5",
  storageBucket: "proyectofinalp5.firebasestorage.app",
  messagingSenderId: "98680980564",
  appId: "1:98680980564:web:a85d2e324e68d4fab559c1"
};

initializeApp(firebaseConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFirestoreModule,
    ),
     
  ]
};

