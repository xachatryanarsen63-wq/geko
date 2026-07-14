import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import NotFound from "./pages/NotFound";

import LanguageSwitcher from "./components/LanguageSwitcher";

function App() {
  return (
    <div>
      <nav
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <Link to="/">Home</Link>

        <Link to="/courses">
          Courses
        </Link>

        <LanguageSwitcher />
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/courses"
          element={<Courses />}
        />

        <Route
          path="/courses/:id"
          element={<CourseDetails />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;