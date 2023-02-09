import { AxiosError } from "axios";
import debounce from "debounce-promise";
import React, { useState, useCallback } from "react";
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

interface MembersObj {
  members: any[];
}

interface Props {
  modalProps: {
    workspaceId: string;
  };
}

interface membersType {
  value: string;
  label: string;
  profile: string;
}

function InviteWorkSpaceMemberModal({ modalProps }: Props) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [values, setValues] = useState<any>([]);

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
        memberIds: values.map((member: any) => member.value),
      };

      setIsSubmitting(true);
      axiosInstance
        .put(`workspace/${modalProps.workspaceId}/members/add`, value)
        .then((res) => {
          //add message toast

          //invalidate getWorkSpace Member
          queryClient.invalidateQueries([
            "getWorkSpaceMembers",
            modalProps.workspaceId,
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
    [modalProps.workspaceId, values]
  );

  const searchUser = async (value: string) => {
    if (value) {
      const response = await axiosInstance.get(
        `/user/search?query=${value}&&workspaceId=${modalProps.workspaceId}`
      );
      const data = response.data.users;
      return data.map((user: UserObj) => {
        return {
          value: user._id,
          label: user.username,
          profile: user.avatar,
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
          WorkSpace Members
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

export default InviteWorkSpaceMemberModal;
