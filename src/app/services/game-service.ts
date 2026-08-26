import { Injectable } from '@angular/core';
import { HttpClient , HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private apiUrl = 'https://www.freetogame.com/api/games';

  constructor(private http: HttpClient) {

  }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl);
  }

  getGameById(id: string): Observable<Game> {
    const url = `${this.apiUrl}?id=${id}`;
    return this.http.get<Game>(url);
  }

  getFilterGames(
    platform: string = '',
    category: string = '',
    sortBy: string = ''
  ) {
    let params = new HttpParams();

    if (platform) {
      params = params.set('platform', platform);
    }
    if (category) {
      params = params.set('category', category);
    }
    if (sortBy) {
      params = params.set('sort-by', sortBy);
    }
    return this.http.get(this.apiUrl, { params });
  }

}
