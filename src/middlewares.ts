import { Request, Response, NextFunction } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import { iMoviesOrderRequest, MoviesOrderResult } from "./interfaces";

const ensureListMoviesExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(req.params.id);
  const queryString: string = `
      SELECT
          *
      FROM
          movies
      WHERE
          id = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult = await client.query(queryConfig);

  if (!queryResult.rowCount) {
    res.status(404).json({
      message: "Movie not found.",
    });
  }

  return next();
};

const ensureListMoviesNameExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const name: string = req.body.name;

  const queryString: string = `
    SELECT
        *
    FROM
        movies
    WHERE

      name = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name],
  };
  const queryResult = await client.query(queryConfig);
  const querys = queryResult.rows;

  if (querys.length !== 0) {
    return res.status(409).json({
      message: `Movie ${name} already exists`,
    });
  }
  return next();
};

export { ensureListMoviesExists, ensureListMoviesNameExists };
