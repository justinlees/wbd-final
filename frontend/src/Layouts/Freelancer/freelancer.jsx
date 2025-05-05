import React from "react";
import Header from "../../components/header";
import FsideBar from "../../components/Freelancer/SideBar";
import { Outlet, Navigate, redirect, useLoaderData } from "react-router-dom";
import "../../styles/freelancer.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function FreeLanceDashBoard() {
  const initialData = useLoaderData();
  const [userData, setUserData] = React.useState(initialData);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/freelancer/${userData.UserName}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setUserData(response.data);
    } catch (err) {
      console.error("Failed to refresh user data:", err);
    }
  };

  return (
    <div className="freelanceDashBoard">
      {userData ? (
        <>
          <Header />
          <div className="mainContent">
            <FsideBar userData={userData} refreshUserData={fetchUserData} />
            <Outlet context={userData} />
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
  if (!token) return redirect("/");

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.data !== params.fUser) return redirect("/");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URI}/freelancer/${params.fUser}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    return redirect("/");
  }
}
