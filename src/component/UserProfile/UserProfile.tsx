import React, { useCallback, useRef, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { spacing } from "react-select/dist/declarations/src/theme";
import axiosInstance from "../../http";
import { RootState } from "../../redux/app/store";
import { showModal } from "../../redux/features/modalslice";
import { addToast } from "../../redux/features/toastSlice";
import { ToastKind } from "../../types/component.types";
import Avatar from "../Avatar/Avatar";
import Input from "../Input/Input";
import UserName from "./UserName";

function UserProfile() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient()

  

  const { user } = useSelector((state: RootState) => state.auth);

  const [isEdit, setIsEdit] = useState(false);

  const ImageFileInput = useRef<HTMLInputElement>(null);


  const handleUploadImage = (e: any) => {
    e.preventDefault();
    ImageFileInput.current?.click();

  };



  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

   
    console.log(e.target.files);
    if (e.target.files) {
      const fileToUpload = e.target.files[0];
     
     console.log(fileToUpload);
      axiosInstance
      .put(
        "/profile/update",
        { profile: fileToUpload },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        const data = response.data.user;
      
        
      dispatch(addToast({kind: ToastKind.SUCCESS, msg: "Profile picture uploaded successfully."}))
  
      queryClient.invalidateQueries(["currentUser"]);
      })
      .catch((error) => {
  
        if (error.response) {
          const response = error.response;
          const message = response.data.message;
  
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
       
    }
  };





  if (!user) {
    return <div>{"Something went wrong."}</div>;
  }

  return (
    <div className="w-full h-full px-3 py-2">
      <div className="w-full relative bg-slate-500" style={{ height: "25vh" }}>
        <label
          htmlFor="profile"
          id="profile"
          className="absolute top-20 left-[40%] rounded-full border-1"
        >
          <input
            ref={ImageFileInput}
            onChange={(e) => handleImageChange(e)}
            id="profile"
            type="file"
            name="profile"
            accept=".png, .jpeg, .jpg"
            style={{ display: "none" }}
          />

          <button onClick={handleUploadImage} className=" rounded-full" >
            <Avatar
             classes="rounded-full"  
             src={user.avatar}
             size={150}
               />
             
          </button>
        </label>
      </div>

      <div className="w-[60%] h-full pl-6 mt-16 ">
        {/* name */}
        <div className="w-full flex justify-between ">
          {isEdit ? (
            <UserName initialName={user?.username} setIsEdit={setIsEdit} />
          ) : (
            <div className="w-full ">
              <div className="w-full flex items-center justify-between">
                <label htmlFor="username" className="font-semibold">
                  UserName:
                </label>
                <button
                  className="hover:opacity-50"
                  onClick={() => setIsEdit(true)}
                >
                  <AiOutlineEdit size={25} />
                </button>
              </div>

              <input
                type="text"
                className="w-full mt-2 text-md hover:bg-slate-200 bg-transparant border-2 focus:border-2 rounded focus:border-primary px-2 py-1 font-semibold"
                name="username"
                value={user.username}
                disabled
              />
            </div>
          )}
        </div>

        {/* email */}
        <div>
          <>
            <label htmlFor="email" className="font-semibold">
              Email:
            </label>
            <br />
            <input
              type="email"
              className="w-full mt-2 text-md hover:bg-slate-200 bg-transparant border-2 focus:border-2 rounded focus:border-primary px-2 py-1 font-semibold"
              name="email"
              value={user.email}
              disabled
            />
          </>
        </div>

        {/* password */}

        <div className="flex items-center mt-6">
          {!user?.isGoogleAuth && (
            <button
              className="font-md mr-6 rounded bg-secondary hover:bg-black text-white px-3 py-2"
              onClick={() =>
                dispatch(showModal({ modalType: "UPDATE_PASSWORD_MODAL" }))
              }
            >
              Update Password
            </button>
          )}

          <button
            className="font-md mr-4  rounded bg-black hover:bg-secondary text-white px-3 py-2"
            onClick={() =>
              dispatch(showModal({ modalType: "CONFIRM_DELETE_USER_MODAL" }))
            }
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
