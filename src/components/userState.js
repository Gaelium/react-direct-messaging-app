import { createSlice } from "@reduxjs/toolkit";
//Global state for the user's document id
export const slice = createSlice({
  name: "userID",
  initialState: {
    value: "",
  },
  reducers: {
    setUserID: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setUserID } = slice.actions;

export const selectUser = (state) => state.userID.value;

export default slice.reducer;
