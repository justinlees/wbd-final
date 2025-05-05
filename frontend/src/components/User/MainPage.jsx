import React from "react";
import {
  useOutletContext,
  Link,
  Form,
  useSearchParams,
} from "react-router-dom";
import axios from 'axios';
import { useState } from "react";

export default function MainPage() {
  const userData = useOutletContext();
  const lancers = userData.freelancer ? userData.freelancer : userData;
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query");

  const actionData = useActionData();

  useEffect(() => {
    if (actionData?.message) {
      alert('Task posted!');
    } else if (actionData?.error) {
      alert(`Error: ${actionData.error}`);
    }
  }, [actionData]);

  const filteredData = query
    ? lancers.filter(
        (item) =>
          item.UserName === query ||
          item.Skill.toLowerCase().replaceAll(" ", "") ===
            query.toLowerCase().replaceAll(" ", "")
      )
    : lancers;

  const colors = [
    "#00BFFF",
    "#FF7F50",
    "#32CD32",
    "#FFD700",
    "#7851A9",
    "#00AA00",
  ];

  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const taskName = formData.get('taskName');
    const taskDescription = formData.get('taskDescription');
    const postedBy = userData?.UserName || "Unknown"; // Adjust based on actual user context
  
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/home/${params.userId}/post-task`, {
        taskName,
        taskDescription,
        postedBy,
      });
  
      alert('Task posted successfully!');
      setShowPopup(false);
    } catch (error) {
      console.error('Error posting task:', error);
      alert('Failed to post task');
    }
  };
  
  return (
    <div className="MainPage">
      <div className="searchBarContainer">
        <div className="searchBar">
          <Form>
            <fieldset>
              <input
                type="search"
                placeholder="Search skills"
                name="query"
                required
              />
              <button type="submit">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </fieldset>
          </Form>
        </div>

        <button className="postTaskBtn" onClick={() => setShowPopup(true)}>
          Post a Task
        </button>

        {showPopup && (
          <div className="popupOverlay">
            <div className="popupForm">
              <h2>Post a Task</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="taskName"
                  placeholder="Task Name"
                  required
                />
                <textarea
                  name="taskDescription"
                  placeholder="Task Description"
                  required
                />
                <div className="popupActions">
                  <button type="button" onClick={() => setShowPopup(false)}>
                    Cancel
                  </button>
                  <button type="submit">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="freelancersDisplay">
        <div className="row">
          {filteredData.length ? (
            filteredData?.map((item, index) => (
              <div key={index} className="freelancerData">
                <div className="inner-freelancerData">
                  <div className="lancerDetails">
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        border: "1px solid black",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor:
                          colors[
                            Math.min(
                              Math.floor(
                                (item.UserName.charAt(0)
                                  .toUpperCase()
                                  .charCodeAt(0) -
                                  65) /
                                  5
                              ),
                              colors.length - 1
                            )
                          ],
                      }}
                    >
                      <h2>{item.UserName.charAt(0).toUpperCase()}</h2>
                    </div>
                    <br />
                    <br />
                    <div>
                      <h3>UserName: {item.UserName}</h3>
                      <br />
                      <h3>Email: {item.Email}</h3>
                      <br />
                      <h3>Mobile: {item.MobileNo}</h3>
                      <br />
                      <h3>Skill: {item.Skill}</h3>
                      <br />
                      <Link to={`${item.UserName}/requestPage`}>
                        View Profile &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="lancerDetails">No details Found</div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function Action({ request, params }) {
  try {
    const formData = Object.fromEntries(await request.formData());

    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URI}/home/${params.userId}/post-task`,
      formData
    );

    if (res.data) {
      // Option 1: Redirect to a success page or back to main
      return redirect(`/home/${params.userId}`);
      
      // Option 2: Return the task data for display (if not redirecting)
      // return json(res.data);
    }
  } catch (error) {
    // Handle error – return something usable by useActionData()
    return json({ error: error.response?.data?.message || 'Failed to post task' }, { status: 500 });
  }
}
