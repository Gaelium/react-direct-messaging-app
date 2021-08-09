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
  //your config
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
