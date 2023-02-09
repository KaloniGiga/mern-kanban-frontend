import React from "react";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { hideModal } from "../../redux/features/modalslice";
import axiosInstance from "../../http";
import { AxiosError } from "axios";

interface Props {
  modalProps: {
    value: string;
    memberId: string;
    workspaceId: string;
  };
}

function ConfirmLeaveAdminRole({ modalProps }: Props) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handleChangeRole = (
    workspaceId: string,
    memberId: string,
    newValue: string
  ) => {
    axiosInstance
      .put(`/workspace/${workspaceId}/member/${memberId}`, {
        newRole: newValue,
      })
      .then((response) => {
        dispatch(hideModal());

        queryClient.invalidateQueries(["getWorkspaceMembers", workspaceId]);
        queryClient.invalidateQueries(["getWorkspaceDetail", workspaceId]);
        queryClient.invalidateQueries(["getBoard"]);
        queryClient.invalidateQueries(["getRecentBoards"]);
        queryClient.invalidateQueries(["getAllMyCards"]);
      })
      .catch((error: AxiosError) => {});
  };

  return (
    <div>
      <p className="text-sm ">
        Are you sure you want to give up your admin previlages and become a
        normal user. To regain admin previlage, another admin must change your
        role back to admin.
      </p>

      <div className="flex jusitfy-end py-2 px-3">
        <button
          className="font-md mr-4  rounded bg-secondary hover:bg-black text-white px-3 py-2"
          onClick={() => dispatch(hideModal())}
        >
          Cancel
        </button>

        <button
          className="fond-md rounded bg-black hover:bg-secondary text-white px-3 py-2"
          onClick={() =>
            handleChangeRole(
              modalProps.workspaceId,
              modalProps.memberId,
              modalProps.value
            )
          }
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default ConfirmLeaveAdminRole;
