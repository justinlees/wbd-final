import React from "react";
import { useOutletContext, Link, useParams } from "react-router-dom";

export default function TaskInfo() {
  const taskInfo = useOutletContext();
  const params = useParams();
  const filterTasks = taskInfo.UserName === params.userId;

  return (
    <div className="taskInfo">
      <section>{filterTasks?.taskName}</section>
      <section>{filterTasks?.taskDescription}</section>
      <section>
        <Link
          to="../.."
          relative="path"
          style={{
            textDecoration: "none",
            color: "blue",
          }}
        >
          &larr; back
        </Link>
      </section>
    </div>
  );
}
