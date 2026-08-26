import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private AuthService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.AuthService.isAuthenticated()) {
      return true;
    }
    alert('Debes iniciar sesión o crear una cuenta para acceder al perfil.');
    this.router.navigate(['/login']);
    return false;
  }
}
