import React from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";
import "../App.scss";
const ChatMessage = (props) => {
  const { message } = props;

  const messageClass =
    message.sender === props.auth.currentUser.uid ? "outgoing" : "incoming";

  return (
    <>
      <div className={`${messageClass}`}>
        <div className="bubble">{message.message}</div>
      </div>
    </>
  );
};

export default ChatMessage;
