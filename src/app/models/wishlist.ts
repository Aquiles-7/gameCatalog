import { Game } from "./game";

export interface Wishlist {
    id?: string;
    id_user: string;
    userEmail: string;
    games: Game[];
}
