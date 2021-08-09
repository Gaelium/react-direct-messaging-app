import React from "react";
import "../App.scss";
const SignOut = ({ auth }) => {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
};

export default SignOut;
