import React, { useEffect, useState } from "react";
import "../styles/landing.css";
import landingpageimg from "../images/landingpageimg.png";
import x1 from "../images/x1.png";
import x2 from "../images/x2.png";
import { Link } from "react-router-dom";
import Footer from "./Footer";

function Landing() {
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const typingSpeed = 150;
  const deletingSpeed = 100;

  useEffect(() => {
    const phrases = [
      "Discover Talent",
      "Unlock Opportunities",
      "Build Your Dream Career",
    ];
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      }

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(
      handleTyping,
      isDeleting ? deletingSpeed : typingSpeed
    );
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, loopNum, phrases]);

  return (
    <div className="Landing">
      <header id="Header">
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
          <h1 className="animated-text">
            {currentText}
            <span className="cursor">|</span>
          </h1>
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
          <img src={landingpageimg} alt="Landing" />
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