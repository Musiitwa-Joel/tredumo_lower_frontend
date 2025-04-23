import { combineReducers } from "@reduxjs/toolkit";
import items from "./itemsSlice";
import customSlice from "./customSlice";
import progAndCoursesSlice from "./progAndCoursesSlice";
import collegeSlice from "./collegeSlice";
import schoolSlice from "./schoolSlice";
import departmentSlice from "./departmentSlice";
import gradingSystemSlice from "./gradingSystemSlice";

const reducer = combineReducers({
  items,
  progAndCoursesSlice,
  customSlice,
  collegeSlice,
  schoolSlice,
  departmentSlice,
  gradingSystemSlice,
});

export default reducer;
