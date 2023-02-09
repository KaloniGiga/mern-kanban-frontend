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
    memberId: string;
  };
}

function ConfirmRemoveWorkSpaceMemberModal({ modalProps }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const removeWorkSpaceMember = useCallback(
    (workspaceId: string, memberId: string) => {
      axiosInstance
        .delete(`/workspace/${workspaceId}/member/${memberId}`)
        .then((response) => {
          console.log(response.data);
          dispatch(hideModal());
          queryClient.invalidateQueries(["getWorkSpaceMembers", workspaceId]);
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
    },
    []
  );

  return (
    <div className="px-4 py-2">
      <h1 className="font-semibold text-xl mb-4">
        Do your really want to remove the member from WorkSpace ?
      </h1>

      <div className="flex justify-end items-center w-full">
        <Button
          name="Cancel"
          classes="hover:bg-secondary bg-black mr-6"
          onClick={() => dispatch(hideModal())}
        />

        <Button
          name="Remove"
          classes="hover:bg-black bg-secondary"
          onClick={() =>
            removeWorkSpaceMember(modalProps.workspaceId, modalProps.memberId)
          }
        />
      </div>
    </div>
  );
}

export default ConfirmRemoveWorkSpaceMemberModal;
