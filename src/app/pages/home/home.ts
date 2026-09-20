import { Component, ChangeDetectorRef } from '@angular/core';
import { GameComponent } from "../../components/game-component/game-component";
import { Game } from '../../models/game';
import { GameService } from '../../services/game-service';
import { FiltersComponent } from "../../components/filters-component/filters-component";
import { SearchComponent } from "../../components/search-component/search-component";
import { Tabs } from "../../interface/tabs/tabs";


@Component({
  selector: 'app-home',
  imports: [GameComponent, FiltersComponent, SearchComponent, Tabs],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  /** Lista completa que vino de la API (segun la categoria elegida). */
  private allGames: Game[] = [];

  /** Lista que realmente se muestra, ya filtrada por el buscador. */
  games: Game[] = [];

  searchText = '';
  loading = false;

  constructor(
    private gameService: GameService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.gameService.getGames().subscribe({
      next: (data) => {
        this.allGames = data;
        this.applySearch();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al cargar juegos:', err);
      }
    });
  }

  onFilterChange(category: string): void {
    this.loading = true;
    this.gameService.getFilterGames('', category).subscribe({
      next: (data) => {
        this.allGames = data as Game[];
        this.applySearch();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al filtrar juegos:', err);
      }
    });
  }

  onSearchChange(text: string): void {
    this.searchText = text;
    this.applySearch();
    this.cdr.markForCheck();
  }

  /**
   * Filtra por palabras: cada palabra tipeada debe aparecer en alguno de los
   * campos del juego (titulo, genero, plataforma, desarrollador o descripcion).
   * Ignora mayusculas y acentos.
   */
  private applySearch(): void {
    const terms = this.normalize(this.searchText)
      .split(/\s+/)
      .filter((t) => t.length > 0);

    if (terms.length === 0) {
      this.games = this.allGames;
      return;
    }

    this.games = this.allGames.filter((game) => {
      const haystack = this.normalize([
        game.title,
        game.genre,
        game.platform,
        game.developer,
        game.short_description,
      ].join(' '));

      return terms.every((term) => haystack.includes(term));
    });
  }

  private normalize(value: string): string {
    return (value ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}
