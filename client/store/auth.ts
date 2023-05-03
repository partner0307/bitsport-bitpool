import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GenericState<T> {
  data?: T;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser:({} as GenericState<object>),
    type: ''
  },
  reducers: {
    setCurrentUser: (state, action: PayloadAction<object>) => {
      state.currentUser = action.payload;
    }
  }
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
