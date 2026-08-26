import { Injectable } from '@angular/core';
import { getAuth,updatePassword,updateProfile  } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  
  getCurrentUser() {
   return getAuth().currentUser;
  }

  updateUserPassword(password: string) {
    const user = getAuth().currentUser;
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }
  
    return updatePassword(user, password);
  }

  updateUserName(name: string) {
    const user = getAuth().currentUser;

    if (!user) throw new Error('Usuario no autenticado');

    return updateProfile(user, {
      displayName: name
  });
  }
}
