import { Component , Output, signal , EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filters-component',
  imports: [],
  templateUrl: './filters-component.html',
  styleUrl: './filters-component.css',
})
export class FiltersComponent {
  selectedCategory = signal('');

  @Output() categorySelected = new EventEmitter<string>();

onCategoryChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  this.selectedCategory.set(value);
  this.categorySelected.emit(value);  // Emitir el cambio
}


}
