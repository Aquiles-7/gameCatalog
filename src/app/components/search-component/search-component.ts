import { Component, EventEmitter, OnDestroy, Output, signal } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search-component',
  standalone: true,
  imports: [],
  templateUrl: './search-component.html',
})
export class SearchComponent implements OnDestroy {
  /** Texto actual del input (para mostrar/ocultar la X). */
  searchText = signal('');

  /** Emite el texto de búsqueda ya "debounceado". */
  @Output() searchChanged = new EventEmitter<string>();

  private input$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.input$
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((text) => this.searchChanged.emit(text));
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
    this.input$.next(value);
  }

  clear(): void {
    this.searchText.set('');
    this.input$.next('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
