import { useParams } from "react-router-dom";
import movies from "../data/movies";

const MovieDetails = () => {
  const { id } = useParams();

  const movie = movies.find((movie) => movie.id === Number(id));

  if (!movie) {
    return <h2>Movie Not Found</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <img
        src={movie.image}
        alt={movie.title}
        style={{ width: "300px" }}
      />

      <h1>{movie.title}</h1>

      <p>
        <strong>Description:</strong> {movie.description}
      </p>

      <p>
        <strong>Year:</strong> {movie.year}
      </p>

      <p>
        <strong>Rating:</strong> {movie.rating}
      </p>
    </div>
  );
};

export default MovieDetails;