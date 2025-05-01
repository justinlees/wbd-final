import React from "react";
import "../styles/landing.css";
import landingpageimg from "../images/landingpageimg.png";
import x1 from "../images/x1.png"; // Import x1.png
import x2 from "../images/x2.png"; // Import x2.png
import { Link } from "react-router-dom";
import Footer from "./Footer";

function Landing() {
  return (
    <div className="Landing">
      <div className="cover"></div>
      <header id="Header">
        <div className="cover"></div>
        <h1>
          JOB<span>DONE</span>
        </h1>
        <ul>
          <li>
            <button>
              <Link className="login button" to="/login">
                Log In
              </Link>
            </button>
          </li>
        </ul>
      </header>
      <main>
        <div className="mainleft">
          <h1>Discover Talent & Unlock Opportunities</h1>
          <h3>
            Connecting skilled freelancers with clients seeking the right
            talent, we foster a vibrant community where collaboration thrives
            and mutual growth is achieved.
          </h3>
          <div className="buttons">
            <button>
              <Link className="client button" to="/signUp/user">
                Hire a Freelancer
              </Link>
            </button>
            <button>
              <Link className="freelancer button" to="/signUp/freelancer">
                Earn Money Freelancing
              </Link>
            </button>
          </div>
        </div>
        <div className="mainright">
          <img src={landingpageimg} alt="" />
        </div>
      </main>
      <section className="freelance-section">
        <div className="image-left">
          <img src={x1} alt="Freelancing Benefits" />
        </div>
        <div className="text-right">
          <h2>Freelancing: A World of Opportunities</h2>
          <p>
            Freelancing offers a unique chance to explore new opportunities,
            work flexibly, and connect with global clients. Build your dream
            career on your terms.
          </p>
        </div>
      </section>
      <section className="freelance-section reverse">
        <div className="image-right">
          <img src={x2} alt="Freelancing Growth" />
        </div>
        <div className="text-left">
          <h2>The Rise of Freelancing</h2>
          <p>
            With freelancing on the rise, more professionals are choosing
            independence. The gig economy is reshaping how we work, collaborate,
            and grow together.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Landing;
