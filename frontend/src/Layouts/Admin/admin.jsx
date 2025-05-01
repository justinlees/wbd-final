import React from "react";
import { Outlet, redirect, useLoaderData } from "react-router-dom";
import AsideBar from "../../components/Admin/AdminSideBar";
import Header from "../../components/header";
import "../../styles/admin.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Admin() {
  const pageContent = useLoaderData();

  return (
    <div className="adminDashBoard">
      {pageContent ? (
        <>
          <Header />
          <div className="mainContent">
            <AsideBar UserName={pageContent.admin.UserName} />
            <Outlet context={pageContent} />
          </div>
        </>
      ) : (
        <h2>Loading.....</h2>
      )}
    </div>
  );
}

export async function Loader({ params }) {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  if (!token || decodedToken.data !== params.aUser) {
    return redirect("/login");
  }
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URI}/admin/${params.aUser}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    return redirect("/login");
  }
}
