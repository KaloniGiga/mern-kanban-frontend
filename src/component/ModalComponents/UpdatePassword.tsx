import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Input from "../Input/Input";
import { hideModal } from "../../redux/features/modalslice";
import axiosInstance from "../../http";
import { addToast } from "../../redux/features/toastSlice";
import { ToastKind } from "../../types/component.types";

function UpdatePassword() {
  const dispatch = useDispatch();
  const [value, setValue] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const updatePassword = () => {
    const userPassword = {
      password: value.newPassword,
      confirmPassword: value.confirmNewPassword,
    };

    axiosInstance
      .put("/password/update", userPassword)
      .then((response) => {
        dispatch(hideModal());

        dispatch(addToast({kind: ToastKind.SUCCESS, msg: "Password Updated successfully."}))
      })
      .catch((error) => {
        dispatch(hideModal());

        if (error.response) {
          const message:string = error.response.data.message;
          //invalidate queries according to the statusCode
          console.log(error.response);
          dispatch(addToast({kind: ToastKind.ERROR, msg: message}))
        } else if (error.request) {
          //add error toast
          dispatch(addToast({kind: ToastKind.ERROR, msg: "Oops, something went wrong."}))
        } else {
          //add error toast
          dispatch(addToast({kind: ToastKind.ERROR, msg: error.message}))
        }
      });
  };

  return (
    <div className="flex flex-col items-center ">
      <Input
        label="New Password"
        typeName="password"
        placeholder="Enter New Password"
        name="newPassword"
        value={value.newPassword}
        onChange={handleInputChange}
      />
      <Input
        label="Confirm Password"
        typeName="password"
        placeholder="Confirm New Password"
        name="confirmNewPassword"
        value={value.confirmNewPassword}
        onChange={handleInputChange}
      />

      <div className="flex justify-around items-center py-2 px-3">
        <button
          className="font-md mr-4  rounded bg-secondary hover:bg-black text-white px-3 py-2"
          onClick={() => dispatch(hideModal())}
        >
          Cancel
        </button>

        <button
          className="fond-md rounded bg-black hover:bg-secondary text-white px-3 py-2"
          onClick={() => updatePassword()}
        >
          Update
        </button>
      </div>
    </div>
  );
}

export default UpdatePassword;
