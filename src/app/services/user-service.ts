import { Injectable } from '@angular/core';
import { Game } from '../models/game';
import { Wishlist } from '../models/wishlist';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // list: Wishlist[] = [];
  
  // constructor() {
  //   const wishlist = localStorage.getItem('whishlist');
  //   if (wishlist) this.list = JSON.parse(wishlist);
  // }

  // addToWishlist(game: Game) {
  //   const i = this.list.findIndex((list) => list.game.id === game.id);
  //   if (i === -1) {
  //     this.list.push({ game });
  //   }
  //   this.updateList();
  // }

  // getItems(): Wishlist[] {
  //   return this.list;
  // }

  // deleteItem(Id: string) {
  //   this.list = this.list.filter(item => item.game.id !== Id);
  //   if (this.list.length === 0) {
  //     localStorage.removeItem('list');
  //     return;
  //   }
  //   this.updateList();
  // }

  // clearList() {
  //   this.list = [];
  //   localStorage.removeItem('list');
  // }

  // updateList() {
  //   localStorage.setItem('list', JSON.stringify(this.list));
  // }

  // loadList() {
  //   const list = localStorage.getItem('list');
  //   if (list) this.list = JSON.parse(list);
  // }

}
