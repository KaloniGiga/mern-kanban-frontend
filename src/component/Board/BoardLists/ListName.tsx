import { AxiosError } from "axios";
import debounce from "debounce-promise";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../http";

interface ListNameProps {
  boardId?: string;
  listId: string;
  workspaceId: string;
  initialName: string;
}

function ListName({
  boardId,
  listId,
  workspaceId,
  initialName,
}: ListNameProps) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [listName, setListName] = useState(initialName);
  const [prevName, setPrevName] = useState(initialName);

  const updateListName = debounce((newListName: string, listId: string) => {
    axiosInstance
      .put(`/lists/${listId}/name`, { name: newListName })
      .then((response) => {
        queryClient.setQueryData(["getBoardList", boardId], (oldValue: any) => {
          return {
            ...oldValue,
            lists: oldValue.lists.map((list: any) => {
              if (list._id === listId) {
                return {
                  ...list,
                  name: newListName,
                };
              }
              return list;
            }),
          };
        });
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          const response = error.response;
          const message = response.data;

          console.log(message);
        } else if (error.request) {
          console.log("Oops something went wrong");
        } else {
          console.log(error.message);
        }
      });
  }, 500);

  const deleteAList = (listId: string) => {
    axiosInstance
      .delete(`/lists/${listId}`)
      .then((response) => {
        queryClient.setQueryData(["getLists", boardId], (oldValue: any) => {
          return {
            ...oldValue,
            lists: oldValue.lists.filter((list: any) => list._id !== listId),
          };
        });
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log("OOps, something went wrong!");
        } else {
          console.log(error.message);
        }
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setListName(e.target.value);

    if (value !== "") {
      setPrevName(e.target.value);
      updateListName(e.target.value.trim(), listId);
    }
  };

  const handleBlur = () => {
    if (listName === "") {
      setListName(prevName);
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <input
        value={listName}
        type="text"
        onChange={handleInputChange}
        onBlur={handleBlur}
        className={`w-full text-xl hover:bg-slate-200 bg-transparant border-transparant focus:border-2 rounded focus:border-primary px-2 py-1 font-semibold`}
      />

      <button
        className="p-2hover:opacity-60"
        onClick={() => deleteAList(listId)}
      >
        <AiOutlineDelete />
      </button>
    </div>
  );
}

export default ListName;
