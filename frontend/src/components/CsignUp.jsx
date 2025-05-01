import React from "react";
import "../styles/fSignUp.css";
import { Form, redirect, useSubmit } from "react-router-dom";
import axios from "axios";
import Header from "./header";
import { useState } from "react";
import firstnameimg from "../images/firstname.png";
import lastnameimg from "../images/lastname.png";
import usernameimg from "../images/username.png";
import passwordimg from "../images/password.png";
import emailimg from "../images/email.png";
import phoneimg from "../images/phone.png";

export default function FsignUp() {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    DOB: new Date(),
    UserName: "",
    Email: "",
    Password: "",
    MobileNo: "",
    OTP: "",
  });

  const [page, setPage] = useState(1);
  const [backButton, setBackButton] = useState(false);
  const [nextButton, setNextButton] = useState(true);
  const [submitButton, setSubmitButton] = useState(false);
  const [errors, setErrors] = useState({});
  const [mailVerified, setMailVerified] = useState(false);
  const [mailMsg, setMailMsg] = useState("");
  const submit = useSubmit();

  function nextBlock() {
    validatePage().then((isValid) => {
      if (isValid) {
        if (page === 1) {
          setPage(2);
          setBackButton(true);
        } else if (page === 2) {
          setPage(3);
          setNextButton(false);
          setSubmitButton(true);
        }
      } else {
        console.log("Validation failed, stay on the current page.");
      }
    });
  }

  function prevBlock() {
    if (page === 2) {
      setPage(1);
      setBackButton(false);
    } else if (page === 3) {
      setPage(2);
      setNextButton(true);
      setSubmitButton(false);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function validatePage() {
    const currentErrors = {};
    const nameRegEx = /^[a-zA-Z]+$/;
    const userNameRegEx = /^[a-zA-Z]+\d{2}$/;
    const emailRegEx = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    const passwordRegEx = /^[a-zA-Z0-9]{8,}$/;
    const mobileNoRegEx = /^[0-9]{10}$/;

    if (page === 1) {
      if (!nameRegEx.test(formData.FirstName)) {
        currentErrors.FirstName = "Enter a valid first name";
      }
      if (!nameRegEx.test(formData.LastName)) {
        currentErrors.LastName = "Enter a valid last name";
      }
      const today = new Date();
      const selectedDate = new Date(formData.DOB);
      if (selectedDate > today) {
        currentErrors.DOB = "Enter a valid Date";
      }
    } else if (page === 2) {
      if (!emailRegEx.test(formData.Email)) {
        currentErrors.Email = "Enter a valid email address";
      }
      if (
        !mobileNoRegEx.test(formData.MobileNo) ||
        parseInt(formData.MobileNo) < 6000000000
      ) {
        currentErrors.MobileNo = "Enter a valid Mobile Number";
      }
      const emailError = await checkRepeatedEmail();
      if (emailError) {
        currentErrors.Email = emailError;
      }
      if (!currentErrors.Email && !currentErrors.MobileNo) {
        sendVerificationEmail();
      }
    } else if (page === 3) {
      if (!userNameRegEx.test(formData.UserName)) {
        currentErrors.UserName = "Username format should be example17";
      }
      if (!passwordRegEx.test(formData.Password)) {
        currentErrors.Password = "Password must be at least 8 characters";
      }
      await checkRepeatedUserName();
      if (!mailVerified) {
        currentErrors.OTP = mailMsg;
      }
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  }

  const checkRepeatedEmail = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/check-repeated-email`,
        { Email: formData.Email }
      );
      if (response.status === 200) {
        console.log("Email is available.");
        return null; // No error
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.log("Email already exists.");
        return "Email already exists";
      } else {
        console.error("Error Checking Email in Database:", error);
        return "Error checking email";
      }
    }
  };

  const checkRepeatedUserName = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/check-repeated-username`,
        { UserName: formData.UserName }
      );
      if (response.status === 200) {
        console.log("UserName is available.");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          Email: "UserName already exists",
        }));
      } else {
        console.log("Error Checking UserName in Database: ", error);
      }
    }
  };

  const sendVerificationEmail = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/send-verification-email`,
        {
          Email: formData.Email,
        }
      );
    } catch (error) {
      setMailMsg("Error sending verification email.");
      console.error(error);
    }
  };

  const validateOTP = async () => {
    try {
      console.log(formData.OTP);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/validate-code`,
        {
          Email: formData.Email,
          code: formData.OTP,
        }
      );
      if (response.status === 200) {
        setMailVerified(true);
        setMailMsg("Verfied Successfully");
      } else {
        setMailMsg(response.data.message);
      }
    } catch (error) {
      setMailMsg(error.response?.data?.message || "Error validating code.");
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!mailVerified) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        OTP: "Please verify your email before submitting",
      }));
      return;
    }

    const isValid = await validatePage();
    if (isValid) {
      // Check if username already exists
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URI}/check-repeated-username`,
          { UserName: formData.UserName }
        );
        if (response.status === 200) {
          console.log("UserName is available.");
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            UserName: "Username already exists",
          }));
          return; // Stop form submission if username exists
        } else {
          console.error("Error Checking UserName in Database: ", error);
          return; // Stop form submission if there's an error in the check
        }
      }

      // Proceed with form submission if username is valid
      try {
        const formDataObj = new FormData();
        for (const key in formData) {
          formDataObj.append(key, formData[key]);
        }

        await submit(formDataObj, { method: "post", action: "/signUp/user" });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  return (
    <div className="FsignUpPage">
      <Header />
      <div className="formBlock">
        <Form className="form signUpForm" method="post" onSubmit={handleSubmit}>
          <h2 id="step">Step {page}</h2>
          <div className="progress-container">
            <div
              className={`progress-bar ${
                page === 3 ? "step3" : page === 2 ? "step2" : "step1"
              }`}
            >
              <div className={`step1 ${page > 0 ? "color" : ""}`}></div>
              <div className={`step2 ${page > 1 ? "color" : ""}`}></div>
              <div className={`step3 ${page > 2 ? "color" : ""}`}></div>
            </div>
          </div>
          {page === 1 && (
            <div className="display1">
              <fieldset>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="FirstName"
                    placeholder=""
                    value={formData.FirstName}
                    onChange={handleInputChange}
                  />
                  <img src={firstnameimg} alt="" />
                </div>
                {errors?.FirstName && (
                  <span className="red">{errors.FirstName}</span>
                )}
              </fieldset>
              <fieldset>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="LastName"
                    placeholder=""
                    value={formData.LastName}
                    onChange={handleInputChange}
                  />
                  <img src={lastnameimg} alt="" />
                </div>
                {errors?.LastName && (
                  <span className="red">{errors.LastName}</span>
                )}
              </fieldset>
              <fieldset>
                <label>Enter your DOB:</label>
                <input
                  type="Date"
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleInputChange}
                />
                {errors?.DOB && <span className="red">{errors.DOB}</span>}
              </fieldset>
            </div>
          )}
          {page === 2 && (
            <div className="display2">
              <fieldset>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="Email"
                    placeholder=""
                    value={formData.Email}
                    onChange={handleInputChange}
                  />
                  <img src={emailimg} alt="" />
                </div>
                {errors && errors.Email && (
                  <span className="red">{errors.Email}</span>
                )}
              </fieldset>
              <fieldset>
                <div className="input-wrapper">
                  <input
                    type="Number"
                    name="MobileNo"
                    placeholder=""
                    value={formData.MobileNo}
                    onChange={handleInputChange}
                  />
                  <img src={phoneimg} alt="" />
                </div>
                {errors && errors.MobileNo && (
                  <span className="red">{errors.MobileNo}</span>
                )}
              </fieldset>
            </div>
          )}
          {page === 3 && (
            <div className="display3">
              <fieldset>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="UserName"
                    placeholder=""
                    value={formData.UserName}
                    onChange={handleInputChange}
                  />
                  <img src={usernameimg} alt="" />
                </div>
                {errors && errors.UserName && (
                  <span className="red">{errors.UserName}</span>
                )}
              </fieldset>
              <fieldset>
                <div className="input-wrapper">
                  <input
                    type="password"
                    name="Password"
                    placeholder=""
                    value={formData.Password}
                    onChange={handleInputChange}
                  />
                  <img src={passwordimg} alt="" />
                </div>
                {errors?.Password && (
                  <span className="red">{errors.Password}</span>
                )}
              </fieldset>
              <fieldset>
                <div className="input-wrapper">
                  <input
                    type="Number"
                    name="OTP"
                    placeholder="Enter OTP received in Mail"
                    value={formData.OTP}
                    onChange={handleInputChange}
                  />
                </div>
                <button onClick={validateOTP} type="button">
                  Verify
                </button>
                {(!errors || !errors.OTP) && (
                  <span className="green">{mailMsg}</span>
                )}
                {errors?.OTP && <span className="red">{errors.OTP}</span>}
              </fieldset>
            </div>
          )}
          <section className="linking">
            {backButton && (
              <button className="backButton" type="button" onClick={prevBlock}>
                Back
              </button>
            )}
            {nextButton && (
              <button className="nextButton" type="button" onClick={nextBlock}>
                Next
              </button>
            )}
            {submitButton && (
              <button
                className="submitButton"
                type="submit"
                disabled={!mailVerified}
              >
                Submit
              </button>
            )}
          </section>
        </Form>
      </div>
    </div>
  );
}

export async function Action({ request }) {
  const formData = Object.fromEntries(await request.formData());
  const errors = {};
  const nameRegEx = /^[a-zA-Z]+$/;
  const userNameRegEx = /^[a-zA-Z]+\d{2}$/;
  const emailRegEx = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
  const passwordRegEx = /^[a-zA-Z0-9]{8,}$/;
  const mobileNoRegEx = /^[0-9]{10}$/;
  if (!nameRegEx.test(formData.FirstName))
    errors.FirstName = "Enter a valid String";
  if (!nameRegEx.test(formData.LastName))
    errors.LastName = "Enter a valid String";
  if (!userNameRegEx.test(formData.UserName))
    errors.UserName = "username example: example17";
  if (!emailRegEx.test(formData.Email)) errors.Email = "Enter a valid email";
  if (!passwordRegEx.test(formData.Password))
    errors.Password = "Enter a valid String";
  if (!mobileNoRegEx.test(formData.MobileNo))
    errors.MobileNo = "Enter a valid Phone Number";
  if (Object.keys(errors).length) {
    return errors;
  }
  console.log(formData.Email);
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_URI}/signUp/user`,
    formData
  );
  if (res.data) {
    return redirect("/login");
  } else {
    return redirect("/");
  }
}
