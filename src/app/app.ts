import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Tabs } from "./interface/tabs/tabs";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Tabs],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gameCatalog');
}
