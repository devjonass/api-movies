import express, { Application } from "express";
import { startDataBase } from "./database";
import {
  createMovieOrder,
  deleteMovieList,
  listMoviesOrder,
  updateListMovies,
} from "./logic";
import {
  ensureListMoviesExists,
  ensureListMoviesNameExists,
} from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/movies", ensureListMoviesNameExists, createMovieOrder);
app.get("/movies", listMoviesOrder);
app.patch(
  "/movies/:id",
  ensureListMoviesExists,
  ensureListMoviesNameExists,
  updateListMovies
);
app.delete(
  "/movies/:id",
  ensureListMoviesExists,
  ensureListMoviesNameExists,
  deleteMovieList
);

app.listen(3000, async () => {
  await startDataBase();
  console.log("Server is running!");
});
