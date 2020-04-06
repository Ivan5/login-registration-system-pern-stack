import React from "react";

export default function Login({ setAuth }) {
  return (
    <>
      <h1>Login</h1>
      <button onClick={() => setAuth(true)}>Authenticate</button>
    </>
  );
}
