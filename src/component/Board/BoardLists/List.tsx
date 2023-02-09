import React, { useState } from "react";
import { useDrop, useDrag } from "react-dnd";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePaperClip,
  AiOutlinePlus,
} from "react-icons/ai";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { showModal } from "../../../redux/features/modalslice";
import { ITEMTYPES, ListObj } from "../../../types/component.types";
import { CardObj } from "../../../types/component.types";
import Options from "../../Options/Options";
import OptionsItem from "../../Options/OptionsItem";
import Card from "./Card";
import ListName from "./ListName";

interface Props {
  list: ListObj;
  cards: CardObj[];
  boardId?: string;
  workspaceId: string;
  role: string;
  index: number;
  lists: ListObj[];
}

function List({
  list,
  cards,
  boardId,
  workspaceId,
  role,
  index,
  lists,
}: Props) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ITEMTYPES.CARD,
    drop: () => ({
      destination: {
        index: index,
        droppableId: list._id,
      },
    }),
    collect: (moniter) => ({
      isOver: moniter.isOver(),
      canDrop: moniter.canDrop(),
    }),
  });

  return (
    <div
      className="list flex flex-col px-2 py-1 mx-3 my-2 bg-surface rounded shadow "
      style={{
        minHeight: "20vh",
        minWidth: "25%",
      }}
    >
      <header className="w-full flex justify-between items-center rounded shadow-xl">
        {["ADMIN", "NORMAL"].includes(role) ? (
          <>
          <h2 className="font-semibold text-lg py-2">{list.name}</h2>
          <button className="mr-2 rounded p-2" onClick={() => dispatch(showModal({modalType: "CONFIRM_DELETE_LIST_MODAL", modalProps: {listId: list._id, boardId: boardId, worspaceId: workspaceId}}))}>
             <AiOutlineDelete size={20} />
          </button>
          </>
        ) : (
          //<ListName listId={list._id} boardId={boardId} workspaceId={workspaceId} initialName={list.name} />
          <h2 className="font-semibold text-lg py-2">{list.name}</h2>
        )}
      </header>

      <div
        className={`p-2 ${isOver ? "bg-slate-200" : ""}`}
        ref={drop}
        style={{ minHeight: "100px" }}
      >
        {cards &&
          cards?.length > 0 &&
          cards.map((card: any, index) => (
            <Card
              key={index}
              card={card}
              boardId={boardId}
              workspaceId={workspaceId}
              role={role}
              index={index}
              lists={lists}
            />
          ))}
      </div>

      {["ADMIN", "NORMAL"].includes(role) && (
        <div className="rounded flex flex-col items-center py-2 justify-center w-full">
          <h1 className="font-semibold">Create a new card.</h1>
          <button
            className="px-3 py-1 bg-secondary hover:bg-secondary_light text-white rounded"
            onClick={() =>
              dispatch(
                showModal({
                  modalType: "CREATE_CARD_MODAL",
                  modalProps: {
                    listId: list._id,
                    boardId: boardId,
                    cardLength: cards?.length,
                  },
                })
              )
            }
          >
            <AiOutlinePlus />
          </button>
        </div>
      )}
    </div>
  );
}

export default List;
