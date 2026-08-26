import { Injectable } from '@angular/core';
import { updateProfile, getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor() {};

  getAuth(){
    return getAuth();
  };

  register(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email , user.password).then(credential => {
    return updateProfile(credential.user, {
      displayName: user.name
    });
  });
  };

  logIn(user: User) {
    return signInWithEmailAndPassword(getAuth(),user.email,user.password);
  };

  loginGoogle() {
    return signInWithPopup(getAuth(),new GoogleAuthProvider());
  };

  logOut() {
    return signOut(getAuth());
  }

  isAuthenticated():boolean {
    const user = getAuth().currentUser;
    return user !== null;
  }
  
}
