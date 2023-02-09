import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToastObj } from "../../types/component.types";

interface ToastState {
  toasts: ToastObj[];
}

const initialState: ToastState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<ToastObj>) => {
      let alreadyExist = false;

      state.toasts.forEach((toast) => {
        if (
          action.payload.msg === toast.msg &&
          action.payload.kind === toast.kind
        ) {
          alreadyExist = true;
        }
      });

      if (!alreadyExist) {
        state.toasts.push(action.payload);
      }
    },

    removeToast: (state, action: PayloadAction<ToastObj>) => {
      state.toasts = state.toasts.filter(
        (toast) =>
          action.payload.msg !== toast.msg && action.payload.kind !== toast.kind
      );
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;

export default toastSlice.reducer;
