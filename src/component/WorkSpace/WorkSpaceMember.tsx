import React from "react";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/app/store";
import authSlice from "../../redux/features/authSlice";
import { showModal } from "../../redux/features/modalslice";
import { MemberObj } from "../../types/component.types";
import Avatar from "../Avatar/Avatar";
import RoleDropDown from "./RoleDropDown";

interface WorkSpaceMemberType {
  myRole: string;
  workspaceId: string;
  member: MemberObj;
  isOnlyAdmin: boolean;
}

function WorkSpaceMember({
  myRole,
  workspaceId,
  member,
  isOnlyAdmin,
}: WorkSpaceMemberType) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();

  const addToWorkSpace = () => {};

  const rolesOptions = [
    {
      value: "ADMIN",
      label: "ADMIN-can change settings",
    },
    {
      value: "NORMAL",
      label: "NORMAL - cannot change settings ",
    },
  ];

  return (
    <div className="p-3 flex items-center justify-between hover:shadow-none shadow shadow-xl m-2 border-box">
      {/* Avatar and username of a memeber */}
      <div className="flex items-center">
        <Avatar
          src={member.avatar}
          isAdmin={member.role === "ADMIN"}
          size={40}
        />
        <span className="ml-3 text-semibold text-md">{member.username}</span>
      </div>

      <div className="flex-1 flex justify-between items-center ">
        <div className="mx-auto ">
          {myRole === "ADMIN" ? (
            <div>
              <RoleDropDown
                member={member}
                options={rolesOptions}
                workspaceId={workspaceId}
                isOnlyAdmin={isOnlyAdmin}
              />
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
              className="py-2 px-3 bg-secondary text-white rounded  disabled:opacity-60"
            >
              Leave
            </button>
          ) : (
            myRole === "ADMIN" && (
              <button
                onClick={() =>
                  dispatch(
                    showModal({
                      modalType: "CONFIRM_REMOVE_WORKSPACE_MEMBER_MODAL",
                      modalProps: {
                        workspaceId: workspaceId,
                        memberId: member._id,
                      },
                    })
                  )
                }
                className="py-2 px-3 bg-secondary text-white rounded"
              >
                Remove
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkSpaceMember;
