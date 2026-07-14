import { useParams } from "react-router-dom";
import courses from "../data/courses";

function CourseDetails() {
  const { id } = useParams();

  const course = courses.find(
    (course) => course.id === Number(id)
  );

  if (!course) {
    return <h1>Course not found</h1>;
  }

  return (
    <div>
      <h1>{course.title}</h1>

      <h3>{course.teacher}</h3>

      <p>{course.description}</p>
    </div>
  );
}

export default CourseDetails;