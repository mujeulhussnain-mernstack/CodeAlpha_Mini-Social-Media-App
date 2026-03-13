import { createSlice } from "@reduxjs/toolkit";
const authUser = createSlice({
  name: {
    user: "user",
  },
  initialState: {
    authUser: null,
    suggestedUsers: [],
    feed: [],
    commentsOfPost: [],
    getProfile: [],
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload
    },
    setFeed: (state, action) => {
      state.feed = action.payload
    },
    setCommentsOfPost: (state, action) => {
      state.commentsOfPost = action.payload
    },
    setGetProfile: (state, action) => {
      state.getProfile = action.payload
    }
  },
});
export const { setAuthUser, setSuggestedUsers, setFeed, setCommentsOfPost, setGetProfile } = authUser.actions;
export default authUser.reducer;
