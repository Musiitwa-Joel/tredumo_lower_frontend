import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

export const getItems = createAsyncThunk(
  "fileManagerApp/items/getItems",
  async (folderId) => {
    const response = await axios.get(`/api/file-manager/${folderId}`);
    const data = await response.data;

    return data;
  }
);

const itemsAdapter = createEntityAdapter({});

export const {
  selectAll: selectItems,
  selectEntities: selectItemsEntities,
  selectById: selectItemById,
} = itemsAdapter.getSelectors((state) => state.fileManagerApp.items);

// console.log("the state", itemsAdapter);

const itemsSlice = createSlice({
  name: "fileManagerApp/items",
  initialState: itemsAdapter.getInitialState({
    showCourseUnits: null,
    selectedItemId: null,
    path: [],
  }),
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItemId = action.payload;
    },
    setCourseUnits: (state, action) => {
      state.showCourseUnits = action.payload;
    },
  },
  extraReducers: {
    [getItems.fulfilled]: (state, action) => {
      const { items, path } = action.payload;
      itemsAdapter.setAll(state, items);
      state.path = path;
      state.selectedItemId = null;
      state.showCourseUnits = null;
    },
  },
});

export const selectFolders = createSelector([selectItems], (items) => {
  return items.filter((item) => item.type === "folder");
});

export const selectFiles = createSelector([selectItems], (items) => {
  return items.filter((item) => item.type !== "folder");
});

export const selectSelectedItem = ({ fileManagerApp }) =>
  fileManagerApp.items.selectedItemId;

export const selectSelected = ({ fileManagerApp }) =>
  fileManagerApp.items.selectedItemId;

export const selectPath = ({ fileManagerApp }) => fileManagerApp.items.path;

export const { setSelectedItem, setCourseUnits } = itemsSlice.actions;

export default itemsSlice.reducer;
