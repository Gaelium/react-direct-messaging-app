import "./App.scss";
import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import Chat from "./components/Chat";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";
import SideBar from "./components/SideBar";
import { useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { selectConvoName } from "./components/convoState";

firebase.initializeApp({
  apiKey: "AIzaSyBQ4lnhpOV4T1U7IkAHMLagH47sLRKcDuE",
  authDomain: "chat-app-467eb.firebaseapp.com",
  projectId: "chat-app-467eb",
  storageBucket: "chat-app-467eb.appspot.com",
  messagingSenderId: "184429127568",
  appId: "1:184429127568:web:86eda818bdce20e72d7515",
  measurementId: "G-952KS2QW9T",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const selector = useSelector(selectConvoName);
  //Check if the conversation has changed, and update the name
  useEffect(() => {
    setName(selector);
  });
  return (
    <div className="container">
      <header className="top-bar">
        <h1 className="head">{name}</h1>
        <SignOut auth={auth} />
      </header>

      <section className="">
        {user ? (
          <Chat auth={auth} firestore={firestore} />
        ) : (
          <SignIn auth={auth} firestore={firestore} />
        )}
      </section>
      {user ? <SideBar auth={auth} firestore={firestore} /> : <div></div>}
    </div>
  );
}

export default App;
