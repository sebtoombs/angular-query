import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { HomeComponent } from './pages/home/home.component';
import { PokemonDetailComponent } from './pages/pokemon-detail/pokemon-detail.component';
import { PokemonService } from './services/pokemon.service';
import { QueryClientService } from './services/query-client.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PokemonDetailComponent,
    ProgressBarComponent,
    SpinnerComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [
    PokemonService,
    {
      provide: QueryClientService,
      useFactory: () =>
        new QueryClientService({
          defaultOptions: {
            queries: {
              // cacheTime: 0,
            },
          },
        }),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
