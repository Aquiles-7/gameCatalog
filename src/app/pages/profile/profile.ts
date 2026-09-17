import { ProfileService } from './../../services/profile.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Game } from '../../models/game';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html'
})
export class Profile implements OnInit {
  private wishlistService = inject(WishlistService);
  private profileService = inject(ProfileService);
  profileForm!: FormGroup;
  private currentUser: { name: string; email: string } | null = null;
  submitted = false;
  message: string | null = null;

  favorites: Game[] = [];
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private Auth: AuthService,
    private ProfileService: ProfileService
  ) {}

  ngOnInit() {
    this.loadFavorites();
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

  private loadFavorites(): void {
    this.loading = true;
    this.errorMessage = null;

    this.wishlistService.getWishlist().subscribe({
      next: (games) => {
        this.favorites = games;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar la wishlist:', err);
        this.errorMessage =
          'No pudimos cargar tu lista de favoritos. Intentá de nuevo más tarde.';
        this.loading = false;
      },
    });
  }

  async removeFromWishlist(game: Game): Promise<void> {
    try {
      await this.wishlistService.removeGame(game);
      this.favorites = this.favorites.filter((g) => g.id !== game.id);
    } catch (err) {
      console.error('Error al eliminar de favoritos:', err);
      this.errorMessage = 'No se pudo eliminar el juego. Intentá de nuevo.';
    }
  }

  openGame(game: Game): void {
    window.open(game.game_url, '_blank', 'noopener');
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
