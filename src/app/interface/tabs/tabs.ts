import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgClass } from "@angular/common";
// import { SearchComponent } from '../../components/search-component/search-component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgClass],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
})
export class Tabs {

  constructor(private router:Router) {
    this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
        switch (event.urlAfterRedirects) {
          case "/home":
            this.selectedTab = [true, false];
            break;
          case "/profile":
            this.selectedTab = [false, true];
            break;
          default:
            this.selectedTab = [false, false];
        }
      }
    }); 
  }

  selectedTab = [false, false, false, false];

  navegar(direction: string) {
    this.router.navigate([direction]);
  }

}
