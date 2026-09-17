import { Injectable, inject } from '@angular/core';
import {
  Auth,
  updateProfile,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);

  getAuth() {
    return this.auth;
  }

  register(user: User) {
    return createUserWithEmailAndPassword(this.auth, user.email, user.password).then(
      (credential) => {
        return updateProfile(credential.user, {
          displayName: user.name,
        });
      }
    );
  }

  logIn(user: User) {
    return signInWithEmailAndPassword(this.auth, user.email, user.password);
  }

  loginGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logOut() {
    return signOut(this.auth);
  }

  isAuthenticated(): boolean {
    const user = this.auth.currentUser;
    return user !== null;
  }
}