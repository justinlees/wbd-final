import React from "react";
import Header from "../../components/header";
import {
  useLoaderData,
  Navigate,
  Outlet,
  NavLink,
  useSearchParams,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../../styles/home.css";

const handleLogout = () => {
  // Remove the token from local storage
  localStorage.removeItem("token");

  // Redirect to the home page
  window.location.href = "/";
};

function Home() {
  const clientData = useLoaderData();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("Skill");

  const filteredData = query
    ? clientData.freelancer?.filter((item) => {
        return item.Skill === query;
      })
    : clientData;
  return (
    <div className="HomePage">
      {filteredData ? (
        <>
          <Header />
          <div className="topNav">
            <div className="left">
              <div>
                <NavLink
                  to="."
                  end
                  className={({ isActive }) => (isActive ? "activeTasks" : "")}
                >
                  Home
                </NavLink>
              </div>
              <div>
                <NavLink
                  to="tasks"
                  className={({ isActive }) => (isActive ? "activeTasks" : "")}
                >
                  Tasks
                </NavLink>
              </div>

              <div>
                <NavLink
                  to="profile"
                  className={({ isActive }) => (isActive ? "activeTasks" : "")}
                >
                  Profile
                </NavLink>
              </div>

              <div>
                <NavLink
                  to="settings"
                  className={({ isActive }) => (isActive ? "activeTasks" : "")}
                >
                  Settings
                </NavLink>
              </div>

              <div>
                <NavLink
                  onClick={handleLogout}
                  className={({ isActive }) => (false ? "activeTasks" : "")}
                >
                  Logout
                </NavLink>
              </div>
            </div>
          </div>

          <Outlet context={filteredData} />
        </>
      ) : (
        <Navigate to="/login" replace={true} />
      )}
    </div>
  );
}

export default Home;

export async function Loader({ params }) {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  if (!token || decodedToken.data !== params.userId) {
    return "";
  }
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URI}/home/${params.userId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    return "";
  }
}
