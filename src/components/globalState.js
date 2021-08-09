import { createSlice } from "@reduxjs/toolkit";
//The conversation index number
export const slice = createSlice({
  name: "conversation",
  initialState: {
    value: "",
  },
  reducers: {
    setConversation: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setConversation } = slice.actions;

export const selectCount = (state) => state.conversation.value;

export default slice.reducer;
