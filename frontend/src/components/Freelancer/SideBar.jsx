import React from "react";
import { NavLink, useParams, useFetcher } from "react-router-dom";
import axios from "axios";

const handleLogout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    window.location.href = "/";
  }
};

export default function FsideBar({ userData, refreshUserData }) {
  const params = useParams();
  const [click, setClick] = React.useState(0);
  const fetcher = useFetcher();

  // Safe useEffect to avoid SSR issues
  React.useEffect(() => {
    if (typeof window !== "undefined" && fetcher?.data?.success) {
      alert("Upload success");
      refreshUserData?.(); // safely call if provided
      setClick(false); // Close the upload UI after success
    }
  }, [fetcher.data, refreshUserData]);

  return (
    <nav className="fSideBar">
      <div className="top">
        <figure>
          {userData.profilePic ? (
            <img src={userData.profilePic} alt="profilePicture" />
          ) : (
            <figcaption>{params.fUser?.charAt(0)?.toUpperCase()}</figcaption>
          )}

          <i style={{ cursor: "pointer" }} onClick={() => setClick(!click)}>
            <span
              style={{
                color: click ? "red" : "inherit",
                padding: 0,
                margin: 0,
                backgroundColor: click ? "#ccc" : "transparent",
                borderRadius: "50%",
              }}
              className="material-symbols-outlined"
            >
              {click ? "close" : "edit"}
            </span>
          </i>

          {click && (
            <article>
              <fetcher.Form
                method="post"
                encType="multipart/form-data"
                className="picUpload"
                action={`../sidebar/${params.fUser}`} // must match route using Action()
              >
                <input type="file" name="profilePic" required />
                <button type="submit">Upload</button>
              </fetcher.Form>
            </article>
          )}
        </figure>

        <h2>{params.fUser}</h2>
        <hr />
      </div>

      <div className="middle">
        <ul>
          <li>
            <NavLink to="profile" className={({ isActive }) => isActive ? "activeNavLink" : "NavLink"}>
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="tasks" className={({ isActive }) => isActive ? "activeNavLink" : "NavLink"}>
              Tasks
            </NavLink>
          </li>
          <li>
            <NavLink to="earnings" className={({ isActive }) => isActive ? "activeNavLink" : "NavLink"}>
              Earnings
            </NavLink>
          </li>
          <li>
            <NavLink to="." end className={({ isActive }) => isActive ? "activeNavLink" : "NavLink"}>
              DashBoard
            </NavLink>
          </li>
          <li>
            <NavLink to="settings" className={({ isActive }) => isActive ? "activeNavLink" : "NavLink"}>
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

// Handle file upload POST request
export async function Action({ request, params }) {
  const formData = await request.formData();

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URI}/freelancer/${params.fUser}`,
      formData
    );

    return { success: res.status === 200 };
  } catch (err) {
    console.error("Upload error:", err);
    return { success: false };
  }
}
