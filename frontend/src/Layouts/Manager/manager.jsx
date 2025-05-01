import React from "react";
import Header from "../../components/header";
import MsideBar from "../../components/Manager/ManagerSideBar";
import "../../styles/manager.css";
import { Outlet, useLoaderData, Navigate, redirect } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Manager() {
  const pageContent = useLoaderData();
  return (
    <div className="managerDashBoard">
      {pageContent ? (
        <>
          <Header />
          <div className="mainContent">
            <MsideBar />
            <Outlet context={pageContent} />
          </div>
        </>
      ) : (
        <Navigate to="/login" replace={true} />
      )}
    </div>
  );
}

export async function Loader({ params }) {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  console.log("wer");
  if (!token || decodedToken.data !== params.mUser) {
    return redirect("/login");
  }

  console.log("dfgh");

  try {
    const response = await axios.get(
      `http://localhost:5500/manager/${params.mUser}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    return "";
  }
} 
