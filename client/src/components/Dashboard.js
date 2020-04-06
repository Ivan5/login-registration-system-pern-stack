import React from "react";

export default function Dashboard({ setAuth }) {
  return (
    <>
      <h1>Dashboard</h1>
      <button onClick={() => setAuth(false)}>LogOut</button>
    </>
  );
}
