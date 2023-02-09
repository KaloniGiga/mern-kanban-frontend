import { AxiosError } from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { MdClose } from "react-icons/md";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../http";
import { RootState } from "../../redux/app/store";
import { showModal } from "../../redux/features/modalslice";
import { MemberObj } from "../../types/component.types";
import Options from "../Options/Options";
import UserName from "../UserProfile/UserName";

interface Props {
  options: {
    value: string;
    label: string;
  }[];
  member: MemberObj;
  workspaceId: string;
  classes?: string;
  isOnlyAdmin?: boolean;
}

function RoleDropDown({
  options = [],
  member,
  workspaceId,
  classes,
  isOnlyAdmin,
}: Props) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);

  const [currentValue, setCurrentValue] = useState("");

  useEffect(() => {
    if (options.length > 0) {
      const isAvailable = options.find((o: any) => o.value === member.role);

      if (isAvailable) {
        setCurrentValue(isAvailable.value);
      } else {
        setCurrentValue(options[0].value);
      }
    }
  }, [options]);

  const submitRoleChange = useCallback(
    (value: string) => {
      axiosInstance
        .put(`/workspace/${workspaceId}/member/${member._id}`, {
          newRole: value,
        })
        .then((response) => {
          queryClient.invalidateQueries(["getWorkspaceMembers", workspaceId]);
          queryClient.invalidateQueries(["getWorkspaceDetail", workspaceId]);
          queryClient.invalidateQueries(["getBoard"]);
          queryClient.invalidateQueries(["getRecentBoards"]);
          queryClient.invalidateQueries(["getAllMyCards"]);
        })
        .catch((error: AxiosError) => {});
    },
    [currentValue]
  );

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentValue(e.target.value);

    if (member.role === "ADMIN" && member._id === user?._id) {
      dispatch(
        showModal({
          modalType: "CONFIRM_LEAVE_ADMIN_ROLE",
          modalProps: {
            value: e.target.value,
            workspaceId: workspaceId,
            memberId: member._id,
          },
        })
      );
    } else {
      submitRoleChange(e.target.value);
    }
  };

  return (
    <div className={`flex flex-col mb-3`}>
      <div className="flex flex-col justify-center">
        <select
          name="roleDropDown"
          id="roleDropDown"
          value={currentValue}
          onChange={(e) => handleRoleChange(e)}
          disabled={
            options.length === 0 || (member._id === user?._id && isOnlyAdmin)
          }
          className="px-2 py-1 border-2 border-black focus:boarder-2 focus:border-primary"
        >
          {options &&
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}

export default RoleDropDown;
