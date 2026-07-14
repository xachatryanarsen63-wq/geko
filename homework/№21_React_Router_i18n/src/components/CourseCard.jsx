import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function CourseCard({ title, teacher, id }) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "10px",
        margin: "10px",
      }}
    >
      <h2>{title}</h2>

      <p>
        {t("teacher")}: {teacher}
      </p>

      <Link to={`/courses/${id}`}>
        {t("details")}
      </Link>
    </div>
  );
}

export default CourseCard;