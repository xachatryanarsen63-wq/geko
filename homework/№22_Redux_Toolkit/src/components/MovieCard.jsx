import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  removeFavorite,
} from "../features/favorites/favoritesSlice";

const MovieCard = ({ id, title, image, year }) => {
  const dispatch = useDispatch();

  const favorites = useSelector((state) => state.favorites.items);

  const isFavorite = favorites.find((movie) => movie.id === id);

  const movieData = {
    id,
    title,
    image,
    year,
  };

  const handleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(id));
    } else {
      dispatch(addFavorite(movieData));
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "15px",
        width: "250px",
      }}
    >
      <img
        src={image}
        alt={title}
        style={{ width: "100%", height: "350px", objectFit: "cover" }}
      />

      <h2>{title}</h2>

      <p>{year}</p>

      <Link to={`/movies/${id}`}>
        <button>Details</button>
      </Link>

      <button onClick={handleFavorite} style={{ marginLeft: "10px" }}>
        {isFavorite ? "Remove Favorite" : "Add Favorite"}
      </button>
    </div>
  );
};

export default MovieCard;