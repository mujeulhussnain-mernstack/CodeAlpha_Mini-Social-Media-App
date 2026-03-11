import { createSlice } from "@reduxjs/toolkit";
const authUser = createSlice({
  name: {
    user: "user",
  },
  initialState: {
    authUser: null,
    suggestedUsers: []
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload
    }
  },
});
export const { setAuthUser, setSuggestedUsers } = authUser.actions;
export default authUser.reducer;
