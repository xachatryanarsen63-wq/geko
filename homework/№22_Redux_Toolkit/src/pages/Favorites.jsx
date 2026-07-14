import { useSelector } from "react-redux";
import MovieCard from "../components/MovieCard";

const Favorites = () => {
  const favorites = useSelector((state) => state.favorites.items);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Favorite Movies</h1>

      {favorites.length === 0 ? (
        <h2>No favorite movies</h2>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              image={movie.image}
              year={movie.year}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;