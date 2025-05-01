import React from "react";
import {
  useOutletContext,
  Link,
  Form,
  useSearchParams,
} from "react-router-dom";

export default function MainPage() {
  const userData = useOutletContext();
  const lancers = userData.freelancer ? userData.freelancer : userData;
  const [searchParams] = useSearchParams();
  const [anime, setAnime] = React.useState("freelancerData");

  const query = searchParams.get("query");

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

  return (
    <div className="MainPage">
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
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </fieldset>
        </Form>
      </div>

      <div className="freelancersDisplay">
        <div className="row">
          {filteredData.length ? (
            filteredData?.map((item) => (
              <div className={anime}>
                <div className="inner-freelancerData">
                  <div clssName="lancerDetails">
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
