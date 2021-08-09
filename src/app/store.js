import { configureStore } from "@reduxjs/toolkit";
import globalState from "../components/globalState";
import userState from "../components/userState";
import convoState from "../components/convoState";
export default configureStore({
  reducer: {
    conversation: globalState,
    userID: userState,
    convoName: convoState,
  },
});
