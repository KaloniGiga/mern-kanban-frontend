import { AxiosError } from "axios";
import debounce from "debounce-promise";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../http";

interface Props {
  initialValue: string;
  boardId: string;
  workspaceId: string;
}

function BoardDescription({ initialValue, boardId, workspaceId }: Props) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [prevDescription, setPrevDescription] = useState(initialValue);
  const [description, setDescription] = useState(initialValue);

  const updateDescription = debounce((newDescription, boardId) => {
    axiosInstance
      .put(`/board/${boardId}/description`, { newDescription: newDescription })
      .then((response) => {
        queryClient.setQueryData(["getBoard", boardId], (oldValue: any) => {
          return {
            ...oldValue,
            description: newDescription,
          };
        });

        queryClient.setQueryData(
          ["getWorkSpaceBoards", workspaceId],
          (oldData: any) => {
            return {
              boards: oldData.map((board: any) => {
                if (board._id.toString() === boardId) {
                  return {
                    ...board,
                    name: newDescription,
                  };
                } else {
                  return {
                    ...board,
                  };
                }
              }),
            };
          }
        );

        queryClient.invalidateQueries(["getRecentBoards"]);
        queryClient.invalidateQueries(["getFavorites"]);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          const response = error.response;

          console.log(error.response.data);
        } else if (error.request) {
          console.log("Oops ! Something went wrong.");
        } else {
          console.log(error.message);
        }
      });
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(e.target.value);

    if (value !== "") {
      setPrevDescription(e.target.value);
      updateDescription(value, boardId);
    }
  };

  const handleBlur = () => {
    if (description === "") {
      setDescription(prevDescription);
    }
  };

  return (
    <div>
      <textarea
        className="w-full bg-transparent outline-none border-transparent rounded focus:border-2 focus:border-primary px-2 py-2"
        onChange={handleChange}
        placeholder={`${!description && "No Description"}`}
        onBlur={handleBlur}
        value={description}
        style={{
          height: `${!initialValue ? "50px" : "130px"}`,
        }}
      ></textarea>
    </div>
  );
}

export default BoardDescription;
