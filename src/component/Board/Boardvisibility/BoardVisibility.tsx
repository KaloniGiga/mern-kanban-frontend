import { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import { HiOutlineCheck } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../http";

interface Props {
  options: {
    value: string;
    name: string;
  }[];
  value: string;
  workspaceId: string;
  boardId?: string;
  handleVisibilityChange?: Function;
}

function BoardVisibility({ options = [], value, workspaceId, boardId }: Props) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [currentValue, setCurrentValue] = useState<string>("");

  useEffect(() => {
    if (options && options.length > 0) {
      const Available = options.find((options) => options.value === value);

      if (Available) {
        setCurrentValue(Available.value);
      } else {
        setCurrentValue(options[0].value);
      }
    }
  }, [options]);

  const handleChangeVisibility = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);

    axiosInstance
      .put(`/board/${boardId}/visibility`, { newVisibility: e.target.value })
      .then((response) => {
        console.log(response.data.message);

        queryClient.invalidateQueries(["getRecentBoards"]);
        queryClient.invalidateQueries(["getBoard", boardId]);
        queryClient.invalidateQueries(["getWorkSpaces"]);
        queryClient.invalidateQueries(["getFavorites"]);
        queryClient.invalidateQueries(["getWorkSpaceBoards", workspaceId]);
        queryClient.invalidateQueries(["getWorkSpaceSettings", workspaceId]);
        queryClient.invalidateQueries(["getWorkSpaceMembers", workspaceId]);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          const message = error.response.data;
        }
      });
  };

  return (
    <div className={`flex mb-3 `}>
      <div className="flex justify-center items-center">
        <select
          name="boardVisibility"
          id="boardVisibility"
          value={currentValue}
          onChange={(e) => handleChangeVisibility(e)}
          disabled={options.length === 0}
          className="px-2 py-1 border-2 border-black focus:boarder-2 focus:border-primary"
        >
          {options &&
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}

export default BoardVisibility;
