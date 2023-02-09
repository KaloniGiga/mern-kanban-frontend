import { AxiosError } from "axios";
import debounce from "debounce-promise";
import React, { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../http";
import { hideModal } from "../../redux/features/modalslice";
import { UserObj } from "../../types/component.types";
import AsyncSelect from "react-select/async";
import Button from "../button/Button";
import OptionComponent from "../SelectAsyncComponent/OptionComponent";
import UserName from "../UserProfile/UserName";
import { MultiValue } from "react-select";
import RoleDropDown from "../Board/BoardMembers/RoleDropDown";

interface MembersObj {
  members: any[];
}

interface Props {
  modalProps: {
    boardId: string;
  };
}

interface membersType {
  value: string;
  label: string;
  profile: string;
  alreadyMember: string;
}

function InviteBoardMemberModal({ modalProps }: Props) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [values, setValues] = useState<any>([]);
  const [role, setRole] = useState("");

  const options = [
    {
      value: "NORMAL",
      label: "NORMAL",
    },
    {
      value: "ADMIN",
      label: "ADMIN",
    },
  ];

  useEffect(() => {
    if (!role && options.length > 0) {
      setRole(options[0].value);
    }
  });

  const handleReactAsyncChange = (newValue: MultiValue<membersType>) => {
    setValues(newValue);
    console.log(values);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      console.log(values);

      const value = {
        members: values.map((member: any) => member.value),
        role: role,
      };
      console.log(value);

      setIsSubmitting(true);
      axiosInstance
        .put(`/board/${modalProps.boardId}/members/add`, value)
        .then((res) => {
          //add message toast
          console.log(res.data.message);
          //invalidate getWorkSpace Member
          queryClient.invalidateQueries([
            "getWorkSpaceMembers",
            modalProps.boardId,
          ]);

          setIsSubmitting(false);

          //hide Modal
          dispatch(hideModal());
        })
        .catch((error: AxiosError) => {
          setIsSubmitting(false);

          if (error.response) {
            const data = error.response.data;
          } else if (error.request) {
            //add toast
          } else {
            //add toast
          }
        });
    },
    [modalProps.boardId, values, role]
  );

  const searchUser = async (value: string) => {
    if (value) {
      const response = await axiosInstance.get(
        `/user/search/board?query=${value}&&boardId=${modalProps.boardId}`
      );
      const data = response.data.users;
      return data.map((user: UserObj) => {
        return {
          value: user._id,
          label: user.username,
          profile: user.avatar,
          alreadyMember: user.isMember ? true : false,
        };
      });
    }
  };

  const delayfetchUsers = useCallback(debounce(searchUser, 500), []);

  const fetchUsers = (value: string) => {
    return delayfetchUsers(value);
  };

  return (
    <div style={{ minWidth: "20%" }}>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label
          htmlFor="async-select"
          className="font-bold mb-3 ml-3 inline-block text-lg"
        >
          Invite Members to Board
        </label>

        <AsyncSelect
          isMulti={true}
          autoFocus={true}
          loadOptions={fetchUsers}
          id="async-select"
          name="async-select"
          value={values.members}
          onChange={handleReactAsyncChange}
          components={{ Option: OptionComponent }}
          className="border-2 border-black ml-3 mr-6 rounded text-sm"
        />

        <div className="flex flex-col my-2 mx-2 overflow-hidden">
          <label
            htmlFor="roleDropDown"
            className="font-bold mb-3 ml-3 inline-block text-lg"
          >
            Choose Member Role
          </label>

          <RoleDropDown options={options} role={role} setRole={setRole} />
        </div>

        <div className="w-full px-3 mt-6">
          <Button
            name="Invite"
            classes="hover:bg-black w-full mb-2"
            isSubmitting={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}

export default InviteBoardMemberModal;
