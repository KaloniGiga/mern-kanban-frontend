import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface stateType {
  currentActiveMenu: number | null;
}

const initialState: stateType = {
  currentActiveMenu: null,
};

const sidebarMenu = createSlice({
  name: "sidebarMenu",
  initialState,
  reducers: {
    setCurrentActiveMenu: (state, action: PayloadAction<number | null>) => {
      state.currentActiveMenu = action.payload;
    },
  },
});

export const { setCurrentActiveMenu } = sidebarMenu.actions;

export default sidebarMenu.reducer;
