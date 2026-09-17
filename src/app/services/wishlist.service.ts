import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  setDoc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, of, switchMap, map } from 'rxjs';
import { Game } from '../models/game';

export interface WishlistDoc {
  id_user: string;
  userEmail: string;
  games: Game[];
}

/**
 * Servicio de wishlist / favoritos.
 * Estructura en Firestore: wishlists/{uid} -> { id_user, userEmail, games: Game[] }
 */
@Injectable({ providedIn: 'root' })
export class WishlistService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private injector = inject(Injector);

  getWishlist(): Observable<Game[]> {
    // authState y docData necesitan correr dentro del contexto de inyección de Angular;
    // como se disparan de forma asíncrona (dentro de switchMap), hay que forzarlo con
    // runInInjectionContext, o si no el observable se cuelga sin emitir next ni error.
    return runInInjectionContext(this.injector, () =>
      authState(this.auth).pipe(
        switchMap((user) => {
          if (!user) {
            return of<Game[]>([]);
          }
          return runInInjectionContext(this.injector, () => {
            const ref = doc(this.firestore, `wishlists/${user.uid}`);
            return docData(ref).pipe(
              map((data) => (data as WishlistDoc | undefined)?.games ?? [])
            );
          });
        })
      )
    );
  }

  isInWishlist(gameId: string): Observable<boolean> {
    return this.getWishlist().pipe(
      map((games) => games.some((g) => g.id === gameId))
    );
  }

  async addGame(game: Game): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Debes iniciar sesión para agregar juegos a favoritos.');
    }

    const ref = doc(this.firestore, `wishlists/${user.uid}`);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      const newDoc: WishlistDoc = {
        id_user: user.uid,
        userEmail: user.email ?? '',
        games: [game],
      };
      await setDoc(ref, newDoc);
      return;
    }

    const current = (snapshot.data() as WishlistDoc).games ?? [];
    const alreadyExists = current.some((g) => g.id === game.id);
    if (alreadyExists) {
      return;
    }

    await updateDoc(ref, {
      games: arrayUnion(game),
    });
  }

  async removeGame(game: Game): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Debes iniciar sesión para modificar tus favoritos.');
    }

    const ref = doc(this.firestore, `wishlists/${user.uid}`);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return;

    const current = (snapshot.data() as WishlistDoc).games ?? [];
    const target = current.find((g) => g.id === game.id);
    if (!target) return;

    await updateDoc(ref, {
      games: arrayRemove(target),
    });
  }
}