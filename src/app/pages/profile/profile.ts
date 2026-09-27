import { ProfileService } from './../../services/profile.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Game } from '../../models/game';
import { WishlistService } from '../../services/wishlist.service';
import { Observable, map, startWith, catchError, of } from 'rxjs';

interface WishlistViewState {
  loading: boolean;
  error: string | null;
  favorites: Game[];
}

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

  // Un solo observable de "view state" (loading / error / favorites).
  // Se consume en el template con "vm$ | async as vm": el AsyncPipe
  // refresca la vista en cada emisión sin importar si el cambio llegó
  // desde el listener de Firestore por fuera del ciclo normal de Angular
  // (que es justo lo que causaba el bug de "carga recién al segundo clic").
  vm$: Observable<WishlistViewState> = this.wishlistService.getWishlist().pipe(
    map((games) => ({ loading: false, error: null, favorites: games } as WishlistViewState)),
    startWith({ loading: true, error: null, favorites: [] } as WishlistViewState),
    catchError((err) => {
      console.error('Error al cargar la wishlist:', err);
      return of({
        loading: false,
        error: 'No pudimos cargar tu lista de favoritos. Intentá de nuevo más tarde.',
        favorites: [],
      } as WishlistViewState);
    })
  );

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

  async removeFromWishlist(game: Game): Promise<void> {
    try {
      await this.wishlistService.removeGame(game);
      // No hace falta actualizar nada a mano: al ser reactivo, vm$
      // va a emitir de nuevo solo con la lista ya actualizada.
    } catch (err) {
      console.error('Error al eliminar de favoritos:', err);
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