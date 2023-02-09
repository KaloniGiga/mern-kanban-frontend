import { AxiosError } from "axios";
import React, { useCallback } from "react";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../http";
import { hideModal } from "../../redux/features/modalslice";
import Button from "../button/Button";

interface Props {
  modalProps: {
    workspaceId: string;
  };
}

function ConfirmLeaveWorkSpaceModal({ modalProps }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const leaveWorkSpace = useCallback((workspaceId: string) => {
    axiosInstance
      .delete(`workspace/${workspaceId}/members`)
      .then((response) => {
        //add toast

        //invalidate queries
        queryClient.invalidateQueries(["getWorkSpaces"]);
        queryClient.invalidateQueries(["getFavorites"]);
        queryClient.invalidateQueries(["getWorkSpaceDetail", workspaceId]);
        queryClient.invalidateQueries(["getWorkSpaceMembers", workspaceId]);

        queryClient.invalidateQueries(["getRecentBoards"]);
        queryClient.invalidateQueries(["getAllMyCards"]);

        navigate("/", { replace: true });
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log("Oops, something went wrong.");
        } else {
          console.log(error.message);
        }
      });
  }, []);

  return (
    <div className="px-4 py-2">
      <h1 className="font-semibold text-xl mb-4">
        Do your want to leave the WorkSpace?
      </h1>

      <div className="flex ">
        <Button
          name="Cancel"
          classes="hover:bg-secondary bg-black mr-6"
          onClick={() => dispatch(hideModal())}
        />

        <Button
          name="Leave"
          classes="hover:bg-black bg-secondary"
          onClick={() => leaveWorkSpace(modalProps.workspaceId)}
        />
      </div>
    </div>
  );
}

export default ConfirmLeaveWorkSpaceModal;
