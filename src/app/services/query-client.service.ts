import { QueryClient, QueryClientConfig } from '@tanstack/query-core';

export class QueryClientService {
  private queryClient: QueryClient;
  constructor(config: QueryClientConfig) {
    this.queryClient = new QueryClient(config);
  }

  public getQueryClient(): QueryClient {
    return this.queryClient;
  }
}
