import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import history from "@history";
import _ from "@lodash";
// import { setInitialSettings } from "app/store/fuse/settingsSlice";
// import { showMessage } from "app/store/fuse/messageSlice";
import settingsConfig from "app/configs/settingsConfig";
// import jwtService from "../auth/services/jwtService";

export const setUser = createAsyncThunk(
  "user/setUser",
  async (user, { dispatch, getState }) => {
    /*
    You can redirect the logged-in user to a specific route depending on his role
    */
    if (user.loginRedirectUrl) {
      settingsConfig.loginRedirectUrl = user.loginRedirectUrl; // for example 'apps/academy'
    }

    return user;
  }
);

export const updateUserSettings = createAsyncThunk(
  "user/updateSettings",
  async (settings, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = _.merge({}, user, { data: { settings } });

    dispatch(updateUserData(newUser));

    return newUser;
  }
);

export const updateUserShortcuts = createAsyncThunk(
  "user/updateShortucts",
  async (shortcuts, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = {
      ...user,
      data: {
        ...user.data,
        shortcuts,
      },
    };

    dispatch(updateUserData(newUser));

    return newUser;
  }
);

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

  // jwtService
  //   .updateUserData(user)
  //   .then(() => {
  //     dispatch(showMessage({ message: "User data saved with api" }));
  //   })
  //   .catch((error) => {
  //     dispatch(showMessage({ message: error.message }));
  //   });
};

const initialState = {
  user: null,
  userPermissions: null,
  userDetails: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedOut: (state, action) => initialState,
    userLogin: (state, action) => {
      state.user = action.payload;
    },
    setUserPermissions: (state, action) => {
      state.userPermissions = action.payload;
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
  },
});

export const { userLoggedOut, userLogin, setUserPermissions, setUserDetails } =
  userSlice.actions;

export const selectUser = ({ user }) => user;

export const selectUserPermissions = (state) => state.user.userPermissions;

export const selectUserDetails = (state) => state.user.userDetails;

export const selectUserShortcuts = (state) =>
  state.user.user?.data?.shortcuts ?? [];

export default userSlice.reducer;
