import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";

export default function Dashboard({ setAuth }) {
  const [name, setName] = useState("");

  async function getName() {
    try {
      const response = await fetch("http://localhost:5000/dashboard/", {
        method: "GET",
        headers: { token: localStorage.getItem("token") },
      });

      const parseRes = await response.json();
      setName(parseRes.user_name);
    } catch (error) {
      console.error(error.message);
    }
  }

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
    toast.success("Logout Successfully");
  };

  useEffect(() => {
    getName();
  }, []);

  return (
    <>
      <h1>Dashboard {name}</h1>
      <button className="btn btn-info" onClick={(e) => logout(e)}>
        Logout
      </button>
    </>
  );
}
