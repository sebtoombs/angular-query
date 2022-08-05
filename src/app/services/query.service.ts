import { Injectable } from '@angular/core';
import {
  notifyManager,
  parseQueryArgs,
  QueryClient,
  QueryFunction,
  QueryKey,
  QueryObserver,
  QueryOptions,
} from '@tanstack/query-core';
import { Observable, Subject } from 'rxjs';
import { QueryClientService } from './query-client.service';

@Injectable({
  providedIn: 'root',
})
export class QueryService {
  constructor(public queryClientService: QueryClientService) {}

  public useQuery(
    queryKey: QueryKey,
    queryFn: QueryFunction,
    options: any = {} // todo types
  ): Query {
    const query = new Query(
      this.queryClientService.getQueryClient(),
      queryKey,
      queryFn,
      options
    );

    return query;
  }
}

// Doesn't support persist query (isRestoring)
// Doesn't handle changing options
export class Query {
  private observer: QueryObserver;

  constructor(
    public queryClient: QueryClient,
    public queryKey: QueryKey,
    public queryFn: QueryFunction,
    public options: any // todo types
  ) {
    const parsedOptions = parseQueryArgs(queryKey, queryFn, options);
    const defaultedOptions = queryClient.defaultQueryOptions(parsedOptions);
    const observer = new QueryObserver(queryClient, defaultedOptions);

    this.observer = observer;
  }

  subscribe() {
    const next$ = new Subject();

    const onStoreChange = () => {
      next$.next(this.observer.getCurrentResult());
    };

    const observerUnsubscribe = this.observer.subscribe(
      notifyManager.batchCalls(onStoreChange)
    );

    const unsubscribe = () => {
      observerUnsubscribe();
    };

    const observavble = new Observable((subscriber) => {
      next$.subscribe({
        next: (value: any) => subscriber.next(value),
      });
      return () => {
        unsubscribe();
      };
    });
    return observavble;
  }

  getCurrentResult(): any {
    return this.observer.getCurrentResult();
  }
}
