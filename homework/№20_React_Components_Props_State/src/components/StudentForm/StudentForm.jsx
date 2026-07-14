import { useState } from "react";
import "./StudentForm.css";

function StudentForm({ onAdd }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [profession, setProfession] = useState("Frontend");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !age || !profession) return;

    onAdd({
      name,
      age,
      profession,
    });

    setName("");
    setAge("");
    setProfession("Frontend");
  };

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Student name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <select
        value={profession}
        onChange={(e) => setProfession(e.target.value)}
      >
        <option value="Frontend">Frontend</option>
        <option value="Backend">Backend</option>
        <option value="Designer">Designer</option>
        <option value="DevOps">DevOps</option>
      </select>

      <button type="submit">Add Student</button>
    </form>
  );
}

export default StudentForm;