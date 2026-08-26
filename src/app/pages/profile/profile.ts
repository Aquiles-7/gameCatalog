import { ProfileService } from './../../services/profile.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html'
})
export class Profile implements OnInit {
  profileForm!: FormGroup;
  currentUser: { name: string; email: string } | null = null;
  submitted = false;
  message: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private Auth: AuthService,
    private ProfileService: ProfileService
  ) {}

  ngOnInit() {
    if (!this.Auth.isAuthenticated()) {
      this.router.navigate(['/registration']);
      return;
    }

    const firebaseUser = this.ProfileService.getCurrentUser();
    if (!firebaseUser) {
      this.router.navigate(['/registration']);
      return;
    }
    
    this.currentUser = {
      name: firebaseUser.displayName ?? '',
      email: firebaseUser.email ?? ''
    };

    this.profileForm = this.formBuilder.group({
      name: [this.currentUser.name, [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get name() {
    return this.profileForm.get('name')!;
  }
  get password() {
    return this.profileForm.get('password')!;
  }

  public onSubmit() {
    this.submitted = true;
    this.message = null;

    if (this.profileForm.invalid || !this.currentUser) {
      return;
    }

    const name = this.name?.value as string;
    const password = this.password?.value as string;

    Promise.all([
      this.ProfileService.updateUserName(name),
      this.ProfileService.updateUserPassword(password)
    ])
      .then(() => {
        this.message = 'Datos actualizados correctamente.';
        this.currentUser = { name, email: this.currentUser?.email ?? '' };
        this.profileForm.get('password')?.reset();
        this.submitted = false;
      })
      .catch((error: unknown) => {
        this.message = error instanceof Error ? error.message : 'No se pudieron guardar los cambios.';
      });
  }

  public logout() {
    this.Auth.logOut().then(() => this.router.navigate(['/home']));
  }
}
