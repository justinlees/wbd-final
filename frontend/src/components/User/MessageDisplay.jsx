import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CmessageDisplay() {
  const params = useParams();
  const [allMessages, setAllMessages] = React.useState("");
  console.log(allMessages);
  React.useEffect(() => {
    const messageFetch = () => {
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URI}/home/${params.userId}/tasks/${params.fUser}/messages`
        )
        .then((res) => res)
        .then((data) => setAllMessages(data.data));
    };
    setInterval(messageFetch, 300);
  }, [params]);
  return (
    <div className="CmessageDisplay">
      {allMessages.allMessages ? (
        allMessages.allMessages?.map((item, index) => (
          <div
            key={index}
            className={
              item.userId === params.userId ? "clientMsg" : "lancerMsg"
            }
          >
            <span>{item.msgContent}</span>
          </div>
        ))
      ) : (
        <p>loading....</p>
      )}
    </div>
  );
}
