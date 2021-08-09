import React from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/analytics";
import "../App.scss";
import { useDispatch } from "react-redux";
import { setConvoName } from "./convoState";
import { useCollectionData } from "react-firebase-hooks/firestore";

const SignIn = ({ auth, firestore }) => {
  const dispatch = useDispatch();
  const userRef = firestore.collection("users");
  const [users] = useCollectionData(userRef, { idField: "id" });

  const signInWithGoogle = () => {
    const exists = false;
    const provider = new firebase.auth.GoogleAuthProvider();
    auth
      .signInWithPopup(provider)
      .then((success) => {
        users.forEach((user) => {
          if (user.uid === auth.currentUser.uid) {
            exists = true;
          }
        });
        //Don't create a new user if that user already exists
        if (!exists) addUser(auth.currentUser);
      })
      .catch(function (error) {
        console.log(error.message);
        console.log("You are not logged in!");
      });
    //Set convo title to the default
    dispatch(setConvoName("Chat App"));
  };
  const addUser = async (user) => {
    const { uid, email, displayName } = user;
    const currentdate = new Date();
    //Create a conversation with the client
    await userRef.add({
      uid: uid,
      email: email,
      username: displayName,
      conversations: [
        {
          users: [uid, "chatappclient"],
          names: [displayName, "Chat App"],
          emails: [email, "chatappclient@example.com"],
          blocked: "false",
          messages: [
            {
              message: "Welcome to the chat app",
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
            {
              message:
                "To start a new chat, search for the email of another user",
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
        },
      ],
    });
  };
  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </>
  );
};

export default SignIn;
