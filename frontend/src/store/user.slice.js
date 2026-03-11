import { createSlice } from "@reduxjs/toolkit";
const authUser = createSlice({
  name: {
    user: "user",
  },
  initialState: {
    authUser: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
  },
});
export const { setAuthUser } = authUser.actions;
export default authUser.reducer;
