import React from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  setCredentials,
  logout,
} from "../features/auth/authSlice";

const Profile = () => {
  const dispatch = useDispatch();

  const { user, token } = useSelector((state) => state.auth);

  const handleLogin = () => {
    dispatch(
      setCredentials({
        user: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
        },

        token: "jwt_token_here",
      })
    );
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      <h1>Profile</h1>

      {user ? (
        <>
          <h2>{user.name}</h2>

          <p>{user.email}</p>

          <button onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <button onClick={handleLogin}>
          Login
        </button>
      )}

      {token && (
        <p>
          Token: {token}
        </p>
      )}
    </div>
  );
};

export default Profile;