import React from "react";
import { NavLink } from "react-router-dom";

export default function MsideBar() {
  return (
    <nav className="managerSideBar">
      <div className="top">
        <>
          <img className="managerPic" alt="" />
          <h1>Username</h1>
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
            to="earnings"
            className={({ isActive }) =>
              isActive ? "ActiveNavLink" : "NavLink"
            }
          >
            Earnings
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
        <button>&larr;Collapse</button>
      </div>
    </nav>
  );
}
