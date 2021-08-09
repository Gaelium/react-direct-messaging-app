import { createSlice } from "@reduxjs/toolkit";
//Global state for the name of the person the user is currently having a conversation with
export const slice = createSlice({
  name: "convoName",
  initialState: {
    value: "Chat App",
  },
  reducers: {
    setConvoName: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setConvoName } = slice.actions;

export const selectConvoName = (state) => state.convoName.value;

export default slice.reducer;
