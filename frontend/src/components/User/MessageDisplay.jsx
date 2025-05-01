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
          `http://localhost:5500/home/${params.userId}/tasks/${params.fUser}/messages`
        )
        .then((res) => res)
        .then((data) => setAllMessages(data.data));
    };
    setInterval(messageFetch, 300);
  }, [params]);
  return (
    <div className="CmessageDisplay">
      {allMessages.allMessages ? (
        allMessages.allMessages?.map((item) => (
          <div
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
