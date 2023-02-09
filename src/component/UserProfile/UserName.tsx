import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQueryClient } from "react-query";
import axiosInstance from "../../http";
import debounce from "debounce-promise";
import { hideModal } from "../../redux/features/modalslice";
import { AxiosError } from "axios";
import { setCurrentUser } from "../../redux/features/authSlice";
import { addToast } from "../../redux/features/toastSlice";
import { ToastKind } from "../../types/component.types";

interface UserProps {
  initialName: string;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

function UserName({ initialName, setIsEdit }: UserProps) {
  const [userName, setUserName] = useState(initialName);
  const [prevName, setPrevName] = useState(initialName);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const updateName = debounce((newName) => {
    axiosInstance
      .put(`/profile/update`, { username: newName })
      .then((response) => {
        const data = response.data.user;
        setUserName(newName);
       

        setIsEdit(false);
        queryClient.invalidateQueries(["currentUser"]);
      })
      .catch((error) => {
       
        setIsEdit(false);

        // req was made and server responded with error
        if (error.response) {
          const response = error.response;
          const { message } = response.data;

          switch (response.status) {
            case 400:
            case 500:
              dispatch(
                addToast({
                  kind: ToastKind.ERROR,
                  msg: message,
                })
              );
              break;
            default:
              // server error
              dispatch(
                addToast({
                  kind: ToastKind.ERROR,
                  msg: "Oops, something went wrong",
                })
              );
              break;
          }
        } else if (error.request) {
          dispatch(
            addToast({ kind: ToastKind.ERROR, msg: "Oops, something went wrong" })
          );
        } else {
          dispatch(addToast({ kind: ToastKind.ERROR, msg: `Error: ${error.message}` }));
        }

      });
  }, 3000);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserName(e.target.value);

    if (value !== "") {
      setPrevName(e.target.value);

      updateName(e.target.value.trim());
    }
  };

  const handleBlur = () => {
    if (userName === "") {
      setUserName(prevName);
    }
    setIsEdit(false);
  };

  return (
    <div className=" w-full">
      <label className="font-semibold text-md mb-2" htmlFor="username">
        UserName
      </label>
      <br />
      <input
        className="w-full text-xl hover:bg-slate-200 bg-transparant border-2 focus:border-2 rounded focus:border-primary px-2 py-1 font-semibold"
        type="text"
        onChange={handleInputChange}
        value={userName}
        onBlur={handleBlur}
        autoFocus
        name="username"
      />
    </div>
  );
}

export default UserName;
