import { useState } from "react";
import StudentForm from "./components/StudentForm/StudentForm";
import StudentList from "./components/StudentList/StudentList";
import "./index.css";

function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const colors = ["red", "blue", "green", "orange", "purple"];

  const addStudent = (student) => {
    const randomColor =
      colors[Math.floor(Math.random() * colors.length)];

    const newStudent = {
      id: Date.now(),
      ...student,
      color: randomColor,
    };

    setStudents([...students, newStudent]);
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <h1>Student Card Manager</h1>

      <input
        className="search-input"
        type="text"
        placeholder="Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <StudentForm onAdd={addStudent} />

      <StudentList
        students={filteredStudents}
        onDelete={deleteStudent}
      />
    </div>
  );
}

export default App;