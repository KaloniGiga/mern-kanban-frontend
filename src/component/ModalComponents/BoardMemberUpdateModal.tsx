import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/app/store";
import { MemberObj } from "../../types/component.types";
import Avatar from "../Avatar/Avatar";
import RoleDropDown from "../Board/BoardMembers/RoleDropDown";
import { showModal } from "../../redux/features/modalslice";
import { AiOutlineClose } from "react-icons/ai";
import axiosInstance from "../../http";
import { AxiosError } from "axios";

interface Props {
  modalProps: {
    member: MemberObj;
    myRole?: string;
    workspaceId?: string;
    isOnlyAdmin: boolean;
    boardId?: string;
  };
}

function BoardMemberUpdate({ modalProps }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [role, setRole] = useState(modalProps.member.role);
  const { member, myRole, workspaceId, boardId, isOnlyAdmin } = modalProps;

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);

    axiosInstance
      .put(`/board/${boardId}/member/${member._id}/update`, {
        newRole: e.target.value,
      })
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error: AxiosError) => {
        console.log(error.message);
      });
  };

  const roleOptions = [
    {
      value: "NORMAL",
      label: "NORMAL",
    },
    {
      value: "ADMIN",
      label: "ADMIN",
    },
  ];
  return (
    <div className="flex items-center px-2 py-2">
      <div className="flex items-center my-2">
        <Avatar
          src={member.avatar}
          isAdmin={member?.role === "ADMIN"}
          size={40}
        />
        <span className="ml-3 font-semibold text-lg">{member.username}</span>
      </div>

      <div className="flex-1 flex  justify-between items-center ">
        <div>
          {myRole === "ADMIN" ? (
            <div className="ml-3 w-full">
              <select
                className="px-2 py-2 border-2 focus:border-primary"
                name="roleDropDown"
                id="roleDropDown"
                value={role}
                onChange={(e) => handleRoleChange(e)}
              >
                {roleOptions &&
                  roleOptions.map((option: any) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            <div>{member.role}</div>
          )}
        </div>

        {/* Leave or Remove button */}
        <div>
          {user?._id === member._id ? (
            <button
              onClick={() =>
                dispatch(
                  showModal({
                    modalType: "CONFIRM_LEAVE_WORKSPACE_MODAL",
                    modalProps: { workspaceId: workspaceId },
                  })
                )
              }
              disabled={isOnlyAdmin}
              className="py-2 px-3 w-full bg-secondary text-white rounded  disabled:opacity-60"
            >
              Leave
            </button>
          ) : (
            myRole === "ADMIN" && (
              <div>
                <button
                  onClick={() =>
                    dispatch(
                      showModal({
                        modalType: "CONFIRM_REMOVE_BOARD_MEMBER_MODAL",
                        modalProps: {
                          workspaceId: workspaceId,
                          memberId: member._id,
                        },
                      })
                    )
                  }
                  className="py-2 w-full px-3 bg-secondary text-white rounded"
                >
                  Remove
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default BoardMemberUpdate;
