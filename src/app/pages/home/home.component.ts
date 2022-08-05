import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  stop$ = new Subject<void>();

  title = 'Pokemon';

  pokemonList: any;
  status: string;
  isLoading: boolean;
  isFetching: boolean;

  constructor(private pokemonService: PokemonService, private router: Router) {
    // Set defaults immediately - this will be either the cached values, or the initial values
    // This is an optional extra step, we could set the defaults ourselves (e.g. status = 'loading'), but that binds our implementation to the current version of the service (it's not defensive programming)
    const query = this.pokemonService.getPokemonListQuery();
    const { data, status, isFetching, isLoading } = query.getCurrentResult();

    this.pokemonList = data?.data?.results;
    this.status = status;
    this.isLoading = isLoading;
    this.isFetching = isFetching;
  }

  ngOnInit(): void {
    // Subscribe to service updates (as normal)
    const query = this.pokemonService.getPokemonListQuery();

    query
      .subscribe()
      .pipe(takeUntil(this.stop$))
      .subscribe((result: any) => {
        const { data, status, isFetching, isLoading } = result;
        this.pokemonList = data?.results;
        this.status = status;

        this.isLoading = isLoading;
        this.isFetching = isFetching;
      });
  }

  onPokemonClick(pokemon: any) {
    this.router.navigate(['/', pokemon.name]);
  }

  ngOnDestroy() {
    this.stop$.next();
    this.stop$.complete();
  }
}
