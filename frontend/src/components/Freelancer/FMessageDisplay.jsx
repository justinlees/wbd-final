import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function FMessageDisplay() {
  const params = useParams();
  const [allMessages, setMessages] = React.useState("");
  console.log(allMessages);
  React.useEffect(() => {
    const messageFetch = () => {
      axios
        .get(
          `http://localhost:5500/freelancer/${params.fUser}/tasks/${params.userId}/messages`
        )
        .then((res) => res)
        .then((data) => setMessages(data.data));
    };
    setInterval(messageFetch, 300);
  }, [params]);

  console.log(allMessages);

  return (
    <div className="messageDisplay">
      {allMessages.allMessages ? (
        allMessages.allMessages.map((item) => (
          <div
            className={item.userId === params.fUser ? "lancerMsg" : "clientMsg"}
          >
            <span>{item.msgContent}</span>
          </div>
        ))
      ) : (
        <p>loading</p>
      )}
    </div>
  );
}
