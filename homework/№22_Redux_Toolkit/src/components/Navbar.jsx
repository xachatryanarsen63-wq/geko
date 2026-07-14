import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px",
        background: "black",
      }}
    >
      <Link to="/" style={{ color: "white" }}>
        Home
      </Link>

      <Link to="/movies" style={{ color: "white" }}>
        Movies
      </Link>

      <Link to="/favorites" style={{ color: "white" }}>
        Favorites
      </Link>
    </nav>
  );
};

export default Navbar;