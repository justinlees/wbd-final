import React from "react";
import "../styles/login.css";
import { Link, Form, redirect, useActionData } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const errors = useActionData();

  return (
    <div className="LoginPage">
      <div className="formBlock">
        <>
          <h1>LOGIN</h1>
        </>
        <Form className="loginForm" method="post">
          <fieldset>
            <label>Enter UserName:</label>
            <input type="text" name="UserName" />
            {/* {errors?.UserName && (
              <p style={{ color: "red" }}>{errors.UserName}</p>
            )} */}
          </fieldset>
          <fieldset>
            <label>Enter Password:</label>
            <input type="password" name="Password" />
            {(errors?.UserName || errors?.Password) && (
              <p style={{ color: "red" }}>Incorrect UserName or Password</p>
            )}
          </fieldset>
          <fieldset className="linking">
            <div className="externalLinking">
              <label childrenlassName="signUpRedirect">
                Create an Account?
                <Link to="/"> SignUp </Link>
              </label>
              <label childrenlassName="forgotPassword">
                Forgot Password? Click
                <Link to="/forgotpassword"> here </Link>
              </label>
            </div>
            <div className="loginButton">
              <button type="submit">LOGIN</button>
            </div>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}

export async function Action({ request }) {
  const formData = Object.fromEntries(await request.formData());
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_URI}/login`,
    formData
  );
  const errors = {};
  console.log("checking");
  if (res.data.token) {
    if (res.data.freelancer) {
      localStorage.setItem("token", res.data.token);
      return redirect(`/freelancer/${formData.UserName}`);
    } else if (res.data.admin) {
      localStorage.setItem("token", res.data.token);
      return redirect(`/admin/${formData.UserName}`);
    } else if (res.data.manager) {
      localStorage.setItem("token", res.data.token);
      return redirect(`/manager/${formData.UserName}`);
    } else {
      localStorage.setItem("token", res.data.token);
      return redirect(`/home/${formData.UserName}`);
    }
  } else if (res.data === "check") {
    errors.Password = "Incorrect Password";
    return errors;
  } else if (res.data === "NoUser") {
    errors.UserName = "Incorrect UserName";
    return errors;
  } else if (!res.data.token) {
    return redirect(`/login`);
  }
}
