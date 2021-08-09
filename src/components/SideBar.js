import React, { useState, useEffect } from "react";
import "firebase/firestore";
import "firebase/analytics";
import { useSelector, useDispatch } from "react-redux";
import { setConversation } from "./globalState";
import { setUserID } from "./userState";
import "../App.scss";
import SearchBar from "material-ui-search-bar";
import { selectUser } from "./userState";
import { setConvoName } from "./convoState";

const SideBar = ({ auth, firestore }) => {
  const [userData, setUserData] = useState({});
  const [userList, setUserList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const userID = useSelector(selectUser);

  const searchUsers = async (value) => {
    //Make sure the user isn't searching for themself, if not, run through all users, if the user's email exists
    //create a conversation.
    if (value !== userData.email) {
      let exists = false;
      userData.conversations.forEach((conversation) => {
        if (conversation.emails[1] === value) {
          exists = true;
        }
      });
      if (!exists) {
        userList.forEach(async (user) => {
          // Make sure they don't already have a conversation with this user, if they do, open it
          if (user.email === value) {
            const currentdate = new Date();
            userData.conversations.push({
              userID: [userData.id, user.id],
              users: [userData.uid, user.uid],
              names: [userData.username, user.username],
              blocked: "false",
              emails: [userData.email, user.email],
              messages: [
                {
                  message:
                    "This is the beginning of your conversation with " +
                    user.username,
                  sender: "chatappclient",
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
                },
              ],
            });

            user.conversations.push({
              userID: [user.id, userData.id],
              users: [user.uid, userData.uid],
              names: [user.username, userData.username],
              blocked: "false",
              email: [user.email, userData.email],
              messages: [
                {
                  message:
                    "This is the beginning of your conversation with " +
                    userData.username,
                  sender: "chatappclient",
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
                },
              ],
            });
            await firestore.collection("users").doc(userID).update({
              conversations: userData.conversations,
            });
            await firestore.collection("users").doc(user.id).update({
              conversations: user.conversations,
            });
            //add conversation
          }
        });
      }
    }
  };
  useEffect(() => {
    if (userList.length > 0) {
      return; // we already have data, so no need to run this again
    }
    //Listen for changes, and fill the side bar with updated data.
    const unsubscribe = firestore.collection("users").onSnapshot((snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        uid: doc.data().uid,
        username: doc.data().username,
        conversations: doc.data().conversations,
        email: doc.data().email,
        id: doc.id,
      }));
      setUserList(userList);
      userList.forEach((user) => {
        if (user.uid === auth.currentUser.uid) {
          dispatch(setUserID(user.id));
          setUserData(user);
        }
      });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="messages">
      <SearchBar
        className="search"
        value={searchValue}
        onChange={(newValue) => setSearchValue(newValue)}
        onRequestSearch={() => {
          searchUsers(searchValue);
          setSearchValue("");
        }}
      />
      <ul className="people">
        {!(Object.keys(userData).length === 0) ? (
          userData.conversations.map((conversation) => {
            return (
              //List each conversation on the search bar
              <li
                key={conversation.users[1]}
                className="person"
                onClick={() => {
                  dispatch(setConversation(conversation.users[1]));
                  dispatch(setConvoName(conversation.names[1]));
                }}
              >
                <span className="title">{conversation.names[1]}</span> <br />
                <span className="preview">
                  {conversation.messages[
                    conversation.messages.length - 1
                  ].message.substring(0, 24)}
                  ...
                </span>
                <br />
                <span className="time">
                  {conversation.messages[conversation.messages.length - 1].time}
                </span>{" "}
              </li>
            );
          })
        ) : (
          <div>loading...</div>
        )}
      </ul>
    </div>
  );
};

export default SideBar;
