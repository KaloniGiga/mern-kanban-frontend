import axios from "axios";
import React, { useState } from "react";
import { QueryClient, useQuery, useQueryClient } from "react-query";
import { Retryer } from "react-query/types/core/retryer";
import { useDispatch } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import axiosInstance from "../../http";
import {
  SettingObj,
  ToastKind,
  WorkSpaceContext,
} from "../../types/component.types";
import Button from "../button/Button";
import Loader from "../Loader/loader";
import WorkSpaceVisibility from "./WorkSpaceVisibility";
import SelectBoardVisibility from "../CustomSelectButton/SelectBoardVisibility";
import { addToast } from "../../redux/features/toastSlice";

function WorkSpaceSettings() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { workspaceId, myRole } = useOutletContext<WorkSpaceContext>();
  const navigate = useNavigate();

  if (myRole !== "ADMIN") {
    return (
      <div className="w-full h-full justify-center items-center">
        <p> You don't have permission to see settings.</p>
      </div>
    );
  }

  const [values, setValues] = useState({
    visibility: "",
    createBoard: "",
    inviteMember: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVisibilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValues({ ...values, visibility: e.target.value });
    console.log(values);
  };

  const handleRadioButtonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSaveChange = () => {
    axiosInstance
      .put(`/workspace/${workspaceId}/settings`, values)
      .then((response) => {
        queryClient.invalidateQueries(["getWorkSpaceSettings", workspaceId]);
        queryClient.invalidateQueries(["getWorkSpaceDetail", workspaceId]);
      })
      .catch((error) => {
        if (error.response) {
          const response = error.response;
          const { message } = response.data;

          switch (response.status) {
            case 404:
              dispatch(addToast({ kind: ToastKind.ERROR, msg: message }));
              queryClient.invalidateQueries(["getWorkSpaces"]);
              queryClient.invalidateQueries(["getFavorites"]);
              // redirect them to home page
              navigate("/home/page", { replace: true });
              break;
            case 400:
            case 500:
              dispatch(addToast({ kind: ToastKind.ERROR, msg: message }));
              break;
            default:
              dispatch(
                addToast({
                  kind: ToastKind.ERROR,
                  msg: "Oops, something went wrong",
                })
              );
          }
        } else if (error.request) {
          dispatch(
            addToast({
              kind: ToastKind.ERROR,
              msg: "Oops, something went wrong",
            })
          );
        } else {
          dispatch(
            addToast({ kind: ToastKind.ERROR, msg: `Error: ${error.message}` })
          );
        }
      });
  };

  const onSuccess = (data: SettingObj) => {
    setValues({
      visibility: data?.visibility,
      createBoard: data?.createBoard,
      inviteMember: data?.inviteMember,
    });
    console.log("hey, we fetched data.");
    console.log(data);
  };

  const getWorkSpaceSettings = async ({ queryKey }: any) => {
    const response = await axiosInstance.get(
      `/workspace/${queryKey[1]}/settings`
    );
    const data = response.data;
    console.log(data.workspace);
    return data.workspace;
  };

  const {
    isLoading,
    data: workspace,
    error,
  } = useQuery<SettingObj, any>(
    ["getWorkSpaceSettings", workspaceId],
    getWorkSpaceSettings,
    {
      retry: false,
      onSuccess: onSuccess,
    }
  );

  if (isLoading) {
    return (
      <div className="w-full h-full items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <h1>Oops! Something went wrong.</h1>
      </div>
    );
  }

  const visibilityOptions = [
    {
      value: "PUBLIC",
      name: "Public - All members of this workspace can see and edit this board",
    },
    {
      value: "PRIVATE",
      name: "Private - Only board members and workspace admins can see and edit this board",
    },
  ];

  return (
    <div className="py-3 px-6 my-2 mx-2 shadow-lg bg-surface">
      <div className="mb-2">
        <WorkSpaceVisibility
          label="Workspace Visibility"
          options={visibilityOptions}
          visibility={values.visibility}
          defaultVisibility="PUBLIC"
          handleVisibilityChange={handleVisibilityChange}
        />
      </div>

      <div className="mb-2">
        <h2 className="font-semibold text-lg mb-2">Who can create Board ?</h2>
        <div className="flex w-[60%]">
          <input
            className="mr-3"
            type="radio"
            id="admin"
            name="createBoard"
            value="Admin"
            onChange={handleRadioButtonChange}
            checked={values.createBoard === "Admin"}
          />
          <label htmlFor="admin">Only Admin</label>
          <br />

          <input
            className="mr-3 ml-auto"
            type="radio"
            id="anyone"
            name="createBoard"
            value="AnyOne"
            onChange={handleRadioButtonChange}
            checked={values.createBoard === "AnyOne"}
          />
          <label htmlFor="anyone">Any Member</label>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">
          Who can create Invite Members ?
        </h2>
        <div className="flex w-[60%]">
          <input
            className="mr-3"
            type="radio"
            id="admin"
            name="inviteMember"
            value="Admin"
            onChange={handleRadioButtonChange}
            checked={values.inviteMember === "Admin"}
          />
          <label htmlFor="admin">Only Admin</label>
          <br />

          <input
            className="mr-3 ml-auto"
            type="radio"
            id="anyone"
            name="inviteMember"
            value="AnyOne"
            onChange={handleRadioButtonChange}
            checked={values.inviteMember === "AnyOne"}
          />
          <label htmlFor="anyone">Any Member</label>
        </div>
      </div>

      <div className="my-2 flex justify-end">
        <Button name="Save Change" onClick={handleSaveChange} />
      </div>
    </div>
  );
}

export default WorkSpaceSettings;
