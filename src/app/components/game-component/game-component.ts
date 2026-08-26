import { Component, Input } from '@angular/core';
import { Game } from '../../models/game';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-game-component',
  imports: [],
  standalone: true,
  templateUrl: './game-component.html',
})
export class GameComponent {

  @Input() game!: Game;
  games: Game[] = [];

  constructor(
    private userService: UserService,
  ) { }

  // addToWishlist(game: Game){
  //   if (!this.game) return;
  //   this.userService.addToWishlist(game);
  //   console.log(`✓ Juego agregado a la lista de deseos:`, game);
  // }

  openGame(url: string): void {
    window.open(url, '_blank');
  }

}
