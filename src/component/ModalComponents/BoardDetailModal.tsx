import React, { useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { CgToggleOff } from "react-icons/cg";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import axiosInstance from "../../http";
import { Board, CardDetailObj } from "../../types/component.types";
import Avatar from "../Avatar/Avatar";
import BoardName from "../Board/BoardDetailComponent/BoardName";
import Loader from "../Loader/loader";
import AddComment from "../CardDetailComponent/AddComment";
import Comment from "../CardDetailComponent/Comment";
import CardMembersUpdate from "../CardDetailComponent/CardMembersUpdate";
import { listenerCancelled } from "@reduxjs/toolkit/dist/listenerMiddleware/exceptions";
import LabelUpdate from "../CardDetailComponent/LabelUpdate";
import { multiValueLabelCSS } from "react-select/dist/declarations/src/components/MultiValue";
import AddExpireDate from "../CardDetailComponent/AddExpireDate";
import { AxiosError } from "axios";
import BoardDescription from "../Board/BoardDetailComponent/BoardDescription";

interface Props {
  modalProps: {
    boardId: string;
    workspaceId: string;
  };
}

function BoardDetailModal({ modalProps }: Props) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [showDescriptionEdit, setShowDescriptionEdit] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  const board = queryClient.getQueryData<Board>([
    "getBoard",
    modalProps.boardId,
  ]);

  return (
    <div className="r px-4 py-2 w-full">
      {board && (
        <div className="">
          {/* Card Name */}
          <div className=" flex flex-col my-2 w-full">
            <label htmlFor="boardName" className="font-semibold text-lg mb-2">
              Board Name
            </label>

            {["ADMIN"].includes(board.role) ? (
              <BoardName
                boardId={modalProps.boardId}
                workspaceId={modalProps.workspaceId}
                initialName={board.name}
              />
            ) : (
              <h2 className="font-semibold text-lg px-2 py-1">
                {board.name.length > 30
                  ? board.name.slice(0, 30) + "..."
                  : board.name}
              </h2>
            )}
          </div>

          <div className="cardBody mb-2">
            {/* description */}
            <div className="description mb-2">
              <label htmlFor="boardName" className="font-semibold text-lg ">
                Board Description
              </label>

              <div className="bg-slate-100 hover:opacity-70 p-2 rounded mt-2">
                {["ADMIN"].includes(board.role) ? (
                  <BoardDescription
                    initialValue={board.description}
                    boardId={modalProps.boardId}
                    workspaceId={modalProps.workspaceId}
                  />
                ) : (
                  <p className="p-2 bg-slate-200">
                    {board.description ? "No Description" : board.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardDetailModal;
