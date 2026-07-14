import courses from "../data/courses";
import CourseCard from "../components/CourseCard";

function Courses() {
  return (
    <div>
      <h1>Courses</h1>

      {courses.map((course) => (
        <CourseCard
          key={course.id}
          id={course.id}
          title={course.title}
          teacher={course.teacher}
        />
      ))}
    </div>
  );
}

export default Courses;