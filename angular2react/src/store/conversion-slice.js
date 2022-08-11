import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Archive } from "../utils/Project/Archive";
import Folders from "../utils/Project/Folders";
import Project from "../utils/Project/Project";

const conversionInitialState = {
  folders: new Folders(),
  archive: new Archive(),
  project: null,
  isRunning: false,
  uploaded: false,
  status: {
    percentage: 0,
    message: "",
  },
  name: "",
  error: "",
};

const conversionSlice = createSlice({
  name: "conversion",
  initialState: conversionInitialState,
  reducers: {
    start(state) {
      state.isRunning = true;
      state.status.message = state.project.status.message;
      state.status.percentage = state.project.status.percentage;
    },
    onChangeArchive(state, { payload }) {
      state.archive = payload.archive;
      try {
        payload.archive.isValid();
        state.name = payload.name;
        state.uploaded = true;
        state.error = "";
        state.project = new Project(payload.archive, state.folders);
      } catch (e) {
        state.error = e.message;
      }
    },
    removeArchive(state) {
      state.error = "";
      state.uploaded = false;
      state.name = "";
    },
    setError(state, { payload }) {
      state.error = payload;
    },
    updateStatus(state) {
      state.status.message = state.project.status.message;
      state.status.percentage = state.project.status.percentage;
    },
    cancel(state) {
      state.project.cancel();
      state.isRunning = false;
      state.folders = new Folders();
      state.project = new Project(state.archive, state.folders);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startConversion.fulfilled, (state, action) => {
        state.isRunning = false;
      })
      .addCase(startConversion.rejected, (state, action) => {
        state.error = action.payload;
        state.isRunning = false;
      })
      .addCase(startConversion.pending, (state) => {
        console.log("Pending");
      });
  },
});

export const startConversion = createAsyncThunk(
  "conversion/startConversionStatus",
  async (project, { rejectWithValue }) => {
    try {
      await project.build();
      return project;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadArchive = ({ name, content }) => {
  return async (dispatch) => {
    let archive = new Archive();
    await archive.loadArchive(content);
    dispatch(
      conversionSliceActions.onChangeArchive({
        archive,
        name,
      })
    );
  };
};

export const conversionSliceReducer = conversionSlice.reducer;
const conversionSliceActions = conversionSlice.actions;
export default conversionSliceActions;
