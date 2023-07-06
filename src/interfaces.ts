import { QueryResult } from "pg";

interface iMoviesOrderRequest {
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export interface iPagination {
  prevPage: string | null,
  nextPage: string | null,
  
}

type MoviesOrderResult = QueryResult<iMoviesOrderRequest>;

export { iMoviesOrderRequest, MoviesOrderResult };
