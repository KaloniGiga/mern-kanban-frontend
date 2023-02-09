import { AxiosError } from "axios";
import debounce from "debounce-promise";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../http";
import { AiOutlineDelete } from "react-icons/ai";
import { hideModal } from "../../../redux/features/modalslice";
import { useNavigate } from "react-router-dom";

interface Props {
  boardId: string;
  workspaceId: string;
  initialName: string;
}

function BoardName({ boardId, workspaceId, initialName }: Props) {
  const [boardName, setBoardName] = useState(initialName);
  const [prevName, setPrevName] = useState(initialName);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteBoard = (boardId: string) => {
    axiosInstance
      .delete(`/board/${boardId}`)
      .then((response) => {
        console.log(response.data.message);

        navigate("/home");
        dispatch(hideModal());
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
  };

  const updateName = debounce((newName, boardId) => {
    axiosInstance
      .put(`/board/${boardId}/name`, { newName: newName })
      .then((response) => {
        queryClient.setQueryData(["getBoard", boardId], (oldValue: any) => {
          return {
            ...oldValue,
            name: newName,
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
                    name: newName,
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
          const message = response.data;

          switch (response.status) {
            case 403:
              break;
            default:
              break;
          }
        }
      });
  }, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBoardName(e.target.value);

    if (value !== "") {
      setPrevName(e.target.value);

      updateName(e.target.value.trim(), boardId);
    }
  };

  const handleBlur = () => {
    if (boardName === "") {
      setBoardName(prevName);
    }
  };

  return (
    <div className=" w-full flex flex-col ">
      <div className="w-full flex items-center justify-between">
        <input
          id="boardName"
          className="w-full text-lg hover:bg-slate bg-slate-300 border-transparant focus:border-2 rounded focus:border-primary px-2 py-1"
          type="text"
          onChange={handleInputChange}
          value={boardName}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
}

export default BoardName;
