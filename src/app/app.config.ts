import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyBQI6BWA7-6Nf64htzp3vmbWJc302oCwXQ",
  authDomain: "proyectofinalp5.firebaseapp.com",
  projectId: "proyectofinalp5",
  storageBucket: "proyectofinalp5.firebasestorage.app",
  messagingSenderId: "98680980564",
  appId: "1:98680980564:web:a85d2e324e68d4fab559c1"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]
};