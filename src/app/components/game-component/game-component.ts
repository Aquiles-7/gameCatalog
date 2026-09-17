import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Game } from '../../models/game';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-game-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-component.html',
})
export class GameComponent {
  @Input() game!: Game;
  private wishlistService = inject(WishlistService);
  private auth = inject(Auth);
  private router = inject(Router);

  isFavorite$!: Observable<boolean>;
  isProcessing = false;

  games: Game[] = [];

  ngOnInit(): void {
    this.isFavorite$ = this.wishlistService.isInWishlist(this.game.id);
  }

    async toggleFavorite(currentlyFavorite: boolean): Promise<void> {
    if (!this.auth.currentUser) {
      // Usuario no autenticado: se lo redirige a login.
      this.router.navigate(['/login']);
      return;
    }

    this.isProcessing = true;
    try {
      if (currentlyFavorite) {
        await this.wishlistService.removeGame(this.game);
      } else {
        await this.wishlistService.addGame(this.game);
      }
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  openGame(url: string): void {
    window.open(url, '_blank');
  }

}
