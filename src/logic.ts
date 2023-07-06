import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "./database";
import { iMoviesOrderRequest, MoviesOrderResult } from "./interfaces";

const createMovieOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const orderDataRequest: iMoviesOrderRequest = req.body;
  const queryString: string = format(
    `
      INSERT INTO
          movies(%I)
      VALUES
          (%L)
      RETURNING *;
    `,
    Object.keys(orderDataRequest),
    Object.values(orderDataRequest)
  );

  const queryResult: MoviesOrderResult = await client.query(queryString);

  const newMoviesOrder = queryResult.rows[0];
  return res.status(201).json(newMoviesOrder);
};

const listMoviesOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  let perPage: any = req.query.perPage === undefined ? 5 : req.query.perPage;
  let page: any = req.query.page === undefined ? 1 : +req.query.page;
  if (!+page) {
    page = 1;
  }
  if (page <= 0 || perPage <= 0) {
    page = 1;
    perPage = 5;
  }
  if (perPage > 5) {
    perPage = 5;
  }
  if (!+perPage) {
    perPage = 5;
  }
  let sort: any = req.query.sort === undefined ? "id" : req.query.sort;
  let order: any = req.query.order === undefined ? "ASC" : req.query.order;

  const queryString: string = `
    SELECT 
       * 
    FROM  
       movies
    ORDER BY ${sort} ${order}
    OFFSET $1 LIMIT $2;`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [perPage * (page - 1), perPage],
  };
  const queryResult: MoviesOrderResult = await client.query(queryConfig);

  const queryTotal: string = `
  SELECT COUNT(*) FROM movies;`;

  const queryResultTotal = await client.query(queryTotal);

  let previousPage: any = `http://localhost:3000/movies?page=${
    page - 1
  }&perPage=${perPage}`;
  if (page - 1 <= 0 || page - 2 > queryResultTotal.rows[0].count / perPage) {
    previousPage = null;
  }

  let nextPage: any = `http://localhost:3000/movies?page=${
    +page + 1
  }&perPage=${perPage}`;
  const count = queryResult.rowCount;
  const pages = queryResultTotal.rows[0].count / perPage;
  if ((count % 5 === 0 && pages === +page) || queryResult.rows.length < 5) {
    nextPage = null;
  }
  const newObject = {
    previousPage,
    nextPage,
    count: +count,
    data: queryResult.rows,
  };
  return res.status(200).json(newObject);
};

const updateListMovies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);
  const listMovie = Object.values(req.body);
  const listKeys = Object.keys(req.body);

  const formatString: string = format(
    `
      UPDATE
          movies
      SET(%I) = ROW(%L)
      WHERE
          id = $1

      RETURNING *;
  `,

    listKeys,
    listMovie
  );

  const queryConfig: QueryConfig = {
    text: formatString,
    values: [id],
  };

  const queryResult: MoviesOrderResult = await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

const deleteMovieList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    DELETE 
    FROM
        movies
    WHERE
        id = $1; 
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  await client.query(queryConfig);

  return res.status(204).send();
};
export { createMovieOrder, listMoviesOrder, updateListMovies, deleteMovieList };
