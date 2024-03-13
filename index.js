const express = require("express");
const fs = require("fs");
const app = express();
let movies = require("./movies.json");
const JSON_FILE = "./movies.json";

app.use(express.json());

// Backend dapat melakukan search film dengan nama
// Query based title search
// URL usage example: localhost:8080/search?Title=Pokémon
// URL usage example: localhost:8080/search?Title=Detective
app.get("/search", (req, res, next) => {
  let query = req.query;
  let filteredMovies = movies.filter((movie) =>
    movie.Title.toLowerCase().includes(query.Title.toLowerCase())
  );
  res.json(filteredMovies);
});

//Backend dapat menampilkan list semua film di bioskop
app.get("/", (req, res, next) => {
  res.json(movies);
});

//Backend dapat menampilkan film sesuai dengan id yang diminta
app.get("/:id", (req, res, next) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.imdbID === id);
  const movie = movies[movieIndex];
  res.json(movie);
});

//Backend dapat menambahkan film ke database
app.post("/", (req, res, next) => {
  const { Title, Year, imdbID, Type, Poster } = req.body;
  const movie = {
    Title: Title,
    Year: Year,
    imdbID: imdbID,
    Type: Type,
    Poster: Poster,
  };
  movies.push(movie);
  res.status(201).json(movie);
});

//Backend dapat menghapus film sesuai dengan id pada request
app.delete("/:id", (req, res, next) => {
  let { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.imdbID === id);
  movies = movies.filter((movie) => movie.imdbID != id);
  res.send("Success");
});

//Backend dapat melakukan update pada film sesuai dengan id pada request
app.patch("/:id", (req, res, next) => {
  let { id } = req.params;
  const { Title, Year, Type, Poster } = req.body;
  const movieIndex = movies.findIndex((movie) => movie.imdbID === id);
  const movie = movies[movieIndex];
  movie.Title = Title;
  movie.Year = Year;
  movie.Type = Type;
  movie.Poster = Poster;

  res.status(200).send("Success");
});

const server = app.listen(8080);

// Handle termination events
process.on("SIGTERM", () => {
  shutdown();
});

process.on("SIGINT", () => {
  shutdown();
});

// Function to perform cleanup before shutting down
function shutdown() {
  // updating the JSON file
  fs.writeFileSync(JSON_FILE, JSON.stringify(movies, null, 2));
  // Close the server
  server.close(() => {
    console.log("Closing server");
    process.exit(0);
  });
}
