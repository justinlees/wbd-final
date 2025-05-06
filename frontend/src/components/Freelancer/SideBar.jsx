import React from "react";
import { NavLink, useParams, useFetcher } from "react-router-dom";
import axios from "axios";

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

export default function FsideBar({ userData }) {
  const params = useParams();
  const [click, setClick] = React.useState(false);
  const fetcher = useFetcher();

  // Trigger a refresh after upload success
  // React.useEffect(() => {
  //   if (fetcher.data?.success) {
  //     alert("Upload success");
  //     refreshUserData(); // function passed from parent to reload user data
  //   }
  // }, [fetcher.data]);

  return (
    <nav className="fSideBar">
      <div className="top">
        <figure>
          {userData.profilePic ? (
            <img src={userData.profilePic} alt="profilePicture" />
          ) : (
            <figcaption>{params.fUser.charAt(0).toUpperCase()}</figcaption>
          )}

          <i style={{ cursor: "pointer" }} onClick={() => setClick(!click)}>
            {click ? (
              <span
                style={{
                  color: "red",
                  padding: 0,
                  margin: 0,
                  backgroundColor: "#ccc",
                  borderRadius: "50%",
                }}
                className="material-symbols-outlined"
              >
                close
              </span>
            ) : (
              <span className="material-symbols-outlined">edit</span>
            )}
          </i>

          {click && (
            <article>
              <fetcher.Form
                method="post"
                encType="multipart/form-data"
                className="picUpload"
                action={`../freelancer/${params.fUser}`} // must match route using Action()
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
          <li><NavLink to="profile" className={({ isActive }) => isActive ? "activeNavLink" : "NavLink"}>Profile</NavLink></li>
          <li><NavLink to="tasks" className={({ isActive }) => isActive ? "activeNavLink" : "NavLink"}>Tasks</NavLink></li>
          <li><NavLink to="explore" className={({ isActive }) => isActive ? "activeNavLink" : "NavLink"}>Explore</NavLink></li>
          <li><NavLink to="earnings" className={({ isActive }) => isActive ? "activeNavLink" : "NavLink"}>Earnings</NavLink></li>
          <li><NavLink to="." end className={({ isActive }) => isActive ? "activeNavLink" : "NavLink"}>DashBoard</NavLink></li>
          <li><NavLink to="settings" className={({ isActive }) => isActive ? "activeNavLink" : "NavLink"}>Settings</NavLink></li>
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

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URI}/freelancer/${params.fUser}`,
      formData
    );

    if (res.status === 200) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (err) {
    console.error("Upload error:", err);
    return { success: false };
  }
}
