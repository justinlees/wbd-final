import React from "react";
import { Form, useParams, redirect, Outlet } from "react-router-dom";
import axios from "axios";

export default function MessageEntry() {
  const lancerId = useParams();
  return (
    <div className="CmessageEntry">
      <div className="block">
        <h2>{lancerId.fUser}</h2>
        <Outlet />
        <Form method="post">
          <input
            type="text"
            placeholder="message...."
            name="msgContent"
            required
          />
          <button type="submit">Send</button>
        </Form>
      </div>
    </div>
  );
}

export async function Action({ request, params }) {
  const formData = Object.fromEntries(await request.formData());
  const response = await axios.post(
    `${process.env.REACT_APP_BACKEND_URI}/home/${params.userId}/tasks/${params.fUser}/messages`,
    formData
  );
  if (response.data)
    return redirect(`/home/${params.userId}/tasks/${params.fUser}/messages`);
  return null;
}
