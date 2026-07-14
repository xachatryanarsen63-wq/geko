import React from "react";

import {
  useGetUsersQuery,
  useAddUserMutation,
} from "./features/users/usersApi";

function App() {
  const { data, error, isLoading } = useGetUsersQuery();

  const [addUser] = useAddUserMutation();

  const handleAddUser = async () => {
    await addUser({
      name: "John Doe",
      email: "john@example.com",
    });
  };

  if (isLoading) return <h1>Loading...</h1>;

  if (error) return <h1>Error...</h1>;

  return (
    <div>
      <h1>Users</h1>

      <button onClick={handleAddUser}>
        Add User
      </button>

      {data?.map((user) => (
        <div key={user.id}>
          <p>{user.name}</p>
        </div>
      ))}
    </div>
  );
}

export default App;