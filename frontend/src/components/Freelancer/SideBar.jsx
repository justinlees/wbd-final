import React from "react";
import { NavLink, useParams, Form } from "react-router-dom";
import axios from "axios";

const handleLogout = () => {
  // Remove the token from local storage
  localStorage.removeItem("token");

  // Redirect to the home page
  window.location.href = "/";
};

export default function FsideBar({ userData }) {
  const params = useParams();
  console.log(userData.profilePic);
  const [click, setClick] = React.useState(0);
  return (
    <nav className="fSideBar">
      <div className="top">
        <figure>
          {userData.profilePic ? (
            <img src={"/profile/" + userData.profilePic} alt="profilePicture" />
          ) : (
            <>
              <figcaption>{params.fUser.charAt(0).toUpperCase()}</figcaption>
            </>
          )}
          <i
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (click === 0) setClick(1);
              else setClick(0);
            }}
          >
            {click === 0 ? (
              <span class="material-symbols-outlined">edit</span>
            ) : (
              <span
                style={{
                  color: "red",
                  padding: 0,
                  margin: 0,
                  backgroundColor: "#ccc",
                  borderRadius: "50%",
                }}
                class="material-symbols-outlined"
              >
                close
              </span>
            )}
          </i>
          {click ? (
            <article>
              <Form
                method="POST"
                encType="multipart/form-data"
                className="picUpload"
              >
                <input type="file" name="profilePic" required />
                <button type="submit">Upload</button>
              </Form>
            </article>
          ) : (
            ""
          )}
        </figure>

        <h2>{params.fUser}</h2>
        <hr />
      </div>
      <div className="middle">
        <ul>
          <li>
            <NavLink
              to="profile"
              className={({ isActive }) =>
                isActive ? "activeNavLink" : "NavLink"
              }
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="tasks"
              className={({ isActive }) =>
                isActive ? "activeNavLink" : "NavLink"
              }
            >
              Tasks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="earnings"
              className={({ isActive }) =>
                isActive ? "activeNavLink" : "NavLink"
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
                isActive ? "activeNavLink" : "NavLink"
              }
            >
              DashBoard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="settings"
              className={({ isActive }) =>
                isActive ? "activeNavLink" : "NavLink"
              }
            >
              Settings
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export async function Action({ request, params }) {
  const formData = await request.formData();
  const res = await axios.post(
    `http://localhost:5500/freelancer/${params.fUser}`,
    formData
  );
  if (res) {
    alert("Upload Success");
    return "";
  } else {
    alert("Upload Failed");
    return "";
  }
}
