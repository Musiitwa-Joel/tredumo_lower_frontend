import { createSlice } from "@reduxjs/toolkit";
import history from "@history";
import _ from "@lodash";

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState();

  if (!user.role || user.role.length === 0) {
    // is guest
    return null;
  }

  history.push({
    pathname: "/",
  });

  // dispatch(setInitialSettings());

  return dispatch(userLoggedOut());
};

export const updateUserData = (user) => async (dispatch, getState) => {
  if (!user.role || user.role.length === 0) {
    // is guest
    return;
  }
};

const initialState = {
  token: null,
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload; // Update state.token instead of state.user
    },
    deleteToken: () => initialState,
  },
});

export const { setToken, deleteToken } = tokenSlice.actions;

export const selectToken = (state) => state.token.token;

export default tokenSlice.reducer;
