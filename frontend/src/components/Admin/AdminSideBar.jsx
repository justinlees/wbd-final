import React from "react";
import { NavLink } from "react-router-dom";

const handleLogout = () => {
  // Remove the token from local storage
  localStorage.removeItem("token");

  // Redirect to the home page
  window.location.href = "/";
};

export default function AsideBar({ UserName }) {
  return (
    <nav className="adminSideBar">
      <div className="top">
        <>
          <h1>{UserName}</h1>
          <hr />
        </>
      </div>
      <ul className="middle">
        <li>
          <NavLink
            to="profile"
            className={({ isActive }) =>
              isActive ? "ActiveNavLink" : "NavLink"
            }
          >
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink
            to="managersInfo"
            className={({ isActive }) =>
              isActive ? "ActiveNavLink" : "NavLink"
            }
          >
            Lancers
          </NavLink>
        </li>
        <li>
          <NavLink
            to="profit"
            className={({ isActive }) =>
              isActive ? "ActiveNavLink" : "NavLink"
            }
          >
            Profit
          </NavLink>
        </li>
        <li>
          <NavLink
            to="."
            end
            className={({ isActive }) =>
              isActive ? "ActiveNavLink" : "NavLink"
            }
          >
            DashBoard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="settings"
            className={({ isActive }) =>
              isActive ? "ActiveNavLink" : "NavLink"
            }
          >
            Settings
          </NavLink>
        </li>
      </ul>
      <div className="bottom">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
