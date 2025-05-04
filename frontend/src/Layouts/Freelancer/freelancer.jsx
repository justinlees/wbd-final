import React from "react";
import Header from "../../components/header";
import FsideBar from "../../components/Freelancer/SideBar";
import { Outlet, useLoaderData, redirect } from "react-router-dom";
import "../../styles/freelancer.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function FreeLanceDashBoard() {
  const pageContent = useLoaderData();

  return (
    <div className="freelanceDashBoard">
      {pageContent ? (
        <>
          <Header />
          <div className="mainContent">
            <FsideBar userData={pageContent} />
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

  // Redirect to landing page if token is missing
  if (!token) {
    return redirect(`/`);
  }

  try {
    const decodedToken = jwtDecode(token);

    // Redirect if the token's user data does not match the route parameter
    if (decodedToken.data !== params.fUser) {
      return redirect(`/`);
    }

    // Fetch freelancer data
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URI}/freelancer/${params.fUser}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    // Redirect to landing page on any error (e.g., invalid token, network error)
    return redirect(`/`);
  }
}
