import React, { useRef, useState, useEffect } from "react";
import "firebase/database";
import { selectUser } from "./userState";
import { selectCount } from "./globalState";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import ChatMessage from "./ChatMessage";
import "../App.scss";
const Chat = ({ firestore, auth }) => {
  const dummy = useRef();
  const [userConversations, setUserConversations] = useState([]);
  const [index, setIndex] = useState(0);
  const [formValue, setFormValue] = useState("");
  const [blocked, setBlocked] = useState("false");
  const user = useSelector(selectUser);
  const convo = useSelector(selectCount);

  useEffect(() => {
    if (user !== "") {
      //Create listener for chat updates
      const unsubscribe = firestore
        .collection("users")
        .doc(user)
        .onSnapshot((snapshot) => {
          setUserConversations(snapshot.data().conversations);
        });
      //if the global state isn't empty, load this conversation, else, load first conversation.
      if (convo !== "") {
        userConversations.forEach((conversation) => {
          if (conversation.users[1] === convo) {
            setIndex(
              userConversations.findIndex((con) => con.users[1] === convo)
            );
            setBlocked(conversation.blocked);
          }
        });
      }
      return () => unsubscribe();
    }
  }, [user, convo]); //only run when the user is loaded, or when the conversation changes
  const blockUser = async () => {
    if (userConversations[index].blocked === "false") {
      userConversations[index].blocked = "true";
    } else {
      userConversations[index].blocked = "false";
    }
    setBlocked(userConversations[index].blocked);
    await firestore.collection("users").doc(user).update({
      conversations: userConversations,
    });
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    const currentdate = new Date();
    let block = "false";
    //Add feature to check if the conversation is blocked
    if (userConversations[index].users[1] !== "chatappclient") {
      let otherUserConversation = await firestore
        .collection("users")
        .doc(userConversations[index].userID[1])
        .get();
      otherUserConversation = otherUserConversation.data().conversations;
      otherUserConversation.forEach((conversation) => {
        if (conversation.users[1] === auth.currentUser.uid) {
          block = conversation.blocked;
          otherUserConversation[
            otherUserConversation.indexOf(conversation)
          ].messages.push({
            message: formValue,
            sender: auth.currentUser.uid,
            time:
              currentdate.getDate() +
              "/" +
              (currentdate.getMonth() + 1) +
              "/" +
              currentdate.getFullYear() +
              " @ " +
              currentdate.getHours() +
              ":" +
              currentdate.getMinutes(),
          });
        }
      });
      if (block !== "true") {
        await firestore
          .collection("users")
          .doc(userConversations[index].userID[1])
          .update({
            conversations: otherUserConversation,
          });
      }
    }
    userConversations[index].messages.push({
      message: formValue,
      sender: auth.currentUser.uid,
      time:
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " @ " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes(),
    });

    const { uid, photoURL, displayName } = auth.currentUser;
    if (!userConversations.blocked) {
      await firestore.collection("users").doc(user).update({
        conversations: userConversations,
      });
    }
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <button className="block" onClick={blockUser}>
        {blocked === "true" ? "Unblock" : "Block"}
      </button>
      <main className="middle">
        {userConversations[index] &&
          userConversations[index].messages.map((msg) => (
            <ChatMessage
              key={uuidv4()}
              message={msg}
              auth={auth}
              name={auth.currentUser.displayName}
            />
          ))}

        <span ref={dummy}></span>
      </main>
      <div className="bottom-bar">
        <div>
          <form onSubmit={sendMessage}>
            <div className="chat">
              <input
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                placeholder="Be kind"
              />
              <button className="send_btn" type="submit" disabled={!formValue}>
                <img src="https://img.icons8.com/color/24/000000/filled-sent.png" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chat;
