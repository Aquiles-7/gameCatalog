import { Component , ChangeDetectorRef , signal } from '@angular/core';
import { GameComponent } from "../../components/game-component/game-component";
import { Game } from '../../models/game';
import { GameService } from '../../services/game-service';
import { FiltersComponent } from "../../components/filters-component/filters-component";
import { Tabs } from "../../interface/tabs/tabs";


@Component({
  selector: 'app-home',
  imports: [GameComponent, FiltersComponent, Tabs],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
    games: Game[] = [];

  constructor(
    private gameService: GameService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.gameService.getGames().subscribe({
      next: (data) => {
        this.games = data;
        this.cdr.markForCheck();
        if (data.length === 0) {
          this.gameService.getGames();
        }
      },
      error: (err) => {
        console.error('✗ Error al cargar juegos:', err);
      }
    });
  }

  onFilterChange(category: string): void {
  this.gameService.getFilterGames('', category).subscribe({
    next: (data) => {
      this.games = data as Game[];
      this.cdr.markForCheck();
    },
    error: (err) => {
      console.error('Error al filtrar juegos:', err);
    }
  });
  }

}
