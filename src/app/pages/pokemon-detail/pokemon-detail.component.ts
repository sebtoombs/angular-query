import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
})
export class PokemonDetailComponent implements OnInit, OnDestroy {
  stop$ = new Subject<void>();

  title = 'Pokemon';

  query: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pokemonService: PokemonService
  ) {
    const { pokemon } = this.activatedRoute.snapshot.params;
    const query = this.pokemonService.getPokemonByNameQuery(pokemon);

    this.query = query.getCurrentResult();
  }

  ngOnInit(): void {
    const { pokemon } = this.activatedRoute.snapshot.params;

    const query = this.pokemonService.getPokemonByNameQuery(pokemon);

    query
      .subscribe()
      .pipe(takeUntil(this.stop$))
      .subscribe((value: any) => {
        this.query = value;
      });
  }

  ngOnDestroy() {
    this.stop$.next();
    this.stop$.complete();
  }

  handleRefetch() {
    this.query?.refetch();
  }
}
