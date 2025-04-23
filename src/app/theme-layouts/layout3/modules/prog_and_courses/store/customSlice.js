import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "@lodash";

const initialState = {
  renderCourseUnits: null,
};

const customSlice = createSlice({
  name: "customSlice",
  initialState,
  reducers: {
    setCourseUnits: (state, action) => {
      state.renderCourseUnits = action.payload;
    },
  },
});

export const { setCourseUnits } = customSlice.actions;

// export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default customSlice.reducer;
