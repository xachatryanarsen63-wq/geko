import movies from "../data/movies";
import MovieCard from "../components/MovieCard";

const Movies = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Movies</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            image={movie.image}
            year={movie.year}
          />
        ))}
      </div>
    </div>
  );
};

export default Movies;