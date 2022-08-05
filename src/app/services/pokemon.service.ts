import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { QueryService, Query } from './query.service';

const API_ENDPOINT = 'https://pokeapi.co/api/v2/pokemon/';

async function fetchPokemonList({ queryKey }: any): Promise<any> {
  await sleep(2000);
  const response = await fetch(API_ENDPOINT);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private API_ENDPOINT = 'https://pokeapi.co/api/v2/pokemon/';

  public pokemonListQuery: Query | null = null;
  public pokemonDetailQuery = new Map<string, Query>();

  constructor(private http: HttpClient, private queryService: QueryService) {}

  public getPokemonListQuery(): Query {
    if (!this.pokemonListQuery) {
      this.pokemonListQuery = this.queryService.useQuery(
        ['pokemon-list'],
        fetchPokemonList
      );
    }

    return this.pokemonListQuery;
  }

  private async _fetchPokemonDetail({ queryKey }: any): Promise<any> {
    await sleep(1000);
    return firstValueFrom(this.http.get(`${this.API_ENDPOINT}${queryKey[1]}`));
  }

  public getPokemonByNameQuery(name: string): Query {
    if (!this.pokemonDetailQuery.has(name)) {
      const query = this.queryService.useQuery(
        ['pokemon-list', name],
        this._fetchPokemonDetail.bind(this)
        // {
        //   refetchInterval: 1000,
        // }
      );
      this.pokemonDetailQuery.set(name, query);
    }
    return this.pokemonDetailQuery.get(name)!;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
