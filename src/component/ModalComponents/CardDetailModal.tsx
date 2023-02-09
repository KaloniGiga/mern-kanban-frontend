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
import { CardDetailObj } from "../../types/component.types";
import Avatar from "../Avatar/Avatar";
import CardName from "../CardDetailComponent/CardName";
import Loader from "../Loader/loader";
import CardDetailDescription from "../CardDetailComponent/CardDetailDescription";
import AddComment from "../CardDetailComponent/AddComment";
import Comment from "../CardDetailComponent/Comment";
import CardMembersUpdate from "../CardDetailComponent/CardMembersUpdate";
import { listenerCancelled } from "@reduxjs/toolkit/dist/listenerMiddleware/exceptions";
import LabelUpdate from "../CardDetailComponent/LabelUpdate";
import { multiValueLabelCSS } from "react-select/dist/declarations/src/components/MultiValue";
import AddExpireDate from "../CardDetailComponent/AddExpireDate";
import { AxiosError } from "axios";
import { format } from "date-fns";

interface Props {
  modalProps: {
    _id: string;
    boardId: string;
    workspaceId: string;
  };
}

function CardDetailModal({ modalProps }: Props) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [showDescriptionEdit, setShowDescriptionEdit] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  const ChangeIsComplete = (cardId: any) => {
    axiosInstance
      .put(`/card/${cardId}/isComplete`)
      .then((response) => {
        queryClient.setQueryData(["getCard", cardId], (oldValue: any) => {
          return {
            ...oldValue,
            isComplete: response.data.isComplete,
          };
        });

        queryClient.invalidateQueries(["getAllMyCards"]);

        queryClient.invalidateQueries(["getBoardList", modalProps.boardId]);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log("Oops, Something went wrong");
        } else {
          console.log(error.message);
        }
      });
  };

  const getCard = async ({ queryKey }: any) => {
    const response = await axiosInstance.get(`/card/${queryKey[1]}`);

    const data = response.data;
    console.log(data);
    return data.card;
  };

  const {
    isLoading,
    data: card,
    error,
  } = useQuery<CardDetailObj | undefined, any, CardDetailObj, string[]>(
    ["getCard", modalProps._id],
    getCard
  );

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>Oops! Something went wrong</div>;
  }

  return (
    <div className="cardDetailWrapper px-4 py-2 w-full">
      {card && (
        <div className="">
          {/* Card Name */}
          <div className="CardName flex items-center my-2 w-full">
            {["ADMIN", "NORMAL"].includes(card.role) ? (
              <CardName
                cardId={card._id}
                boardId={modalProps.boardId}
                workspaceId={modalProps.workspaceId}
                initialName={card.name}
              />
            ) : (
              <h2 className="font-semibold text-lg px-2 py-1">
                {card.name.length > 30
                  ? card.name.slice(0, 30) + "..."
                  : card.name}
              </h2>
            )}
          </div>

          <div className="mb-4 hover:opacity-70">
            {(card.coverImage || card.color) && (
              <div className="mb-2 w-full rounded-t cursor-pointer">
                {card.coverImage ? (
                  <img
                    src={card.coverImage}
                    className="w-full h-full rounded-t"
                  />
                ) : (
                  <div
                    className="w-full h-full rounded-t"
                    style={{
                      height: "100px",
                      background: `${card.color}`,
                    }}
                  ></div>
                )}
              </div>
            )}
          </div>

          <div className="cardBody mb-2">
            {/* description */}
            <div className="description mb-2">
              <div className="description_Header flex items-center justify-between w-full mb-2">
                <h2 className="font-semibold text-lg mr-4">Description</h2>

                {!showDescriptionEdit &&
                  ["ADMIN", "NORMAL"].includes(card.role) && (
                    <button onClick={() => setShowDescriptionEdit(true)}>
                      <AiOutlineEdit size={25} />
                    </button>
                  )}
              </div>

              <div className="bg-slate-100 hover:opacity-70 p-2 rounded">
                {showDescriptionEdit &&
                ["ADMIN", "NORMAL"].includes(card.role) ? (
                  <CardDetailDescription
                    initialValue={card.description}
                    cardId={card._id}
                    boardId={modalProps.boardId}
                    workspaceId={modalProps.workspaceId}
                    showDescriptionEdit={showDescriptionEdit}
                    setShowDescriptionEdit={setShowDescriptionEdit}
                  />
                ) : (
                  <p>{card.description}</p>
                )}
              </div>
            </div>

            {/* expire Date */}
            <div>
              {card.expireDate && (
                <div className="flex flex-col mb-3">
                  <div>
                    <span className="font-semibold mb-2 tex-lg">Due Date</span>
                  </div>

                  <div className="flex items-center rounded px-2 py-1 w-full">
                    {["ADMIN", "NORMAL"].includes(card.role) ? (
                      <div className=" w-full flex items-center justify-between">
                        <AddExpireDate
                          initialValue={format(new Date(card.expireDate), "yyyy-MM-dd")}
                          cardId={card._id}
                          boardId={modalProps.boardId}
                          workspaceId={modalProps.workspaceId}
                          listId={card.listId}
                        />

                        <input
                          type={"checkbox"}
                          checked={card.isComplete ? true : false}
                          onChange={() => ChangeIsComplete(card._id)}
                        />
                      </div>
                    ) : (
                      <span>{format(new Date(card.expireDate), "yyyy/MM/dd")}</span>
                    )}

                    {/* show the expire status */}
                  </div>
                </div>
              )}
            </div>

            {/* members */}

            <div className="flex flex-col  relative mb-3 z-10">
              <div className="flex items-center justify-between">
                <span className="font-semibold ">Members</span>

                {["ADMIN", "NORMAL"].includes(card.role) && (
                  <button
                    className="px-2 py-1 rounded text-white bg-secondary hover:bg-black"
                    onClick={() => setShowMembers((prev) => !prev)}
                  >
                    <AiOutlineUserAdd size={25} />
                  </button>
                )}
              </div>

              {showMembers && (
                <CardMembersUpdate
                  setShowMembers={setShowMembers}
                  CardMembers={card.members}
                  cardId={card._id}
                  listId={card.listId}
                  boardId={modalProps.boardId}
                  workspaceId={modalProps.workspaceId}
                />
              )}

              {/* {!showMembers && (
                <> */}
              {card.members && card.members.length > 0 ? (
                <div className=" flex flex-col z-1">
                  {card.members.map((member: any) => {
                    return (
                      <Avatar
                        key={member._id}
                        src={member.avatar}
                        size={25}
                        classes="w-8 h-8"
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="w-full flex items-center justify-center text-center bg-slate-100 py-1 rounded z-1">
                  <span className="opacity-80">No Members</span>
                </div>
              )}
              {/* </>
                )} */}
            </div>

            {/* labels */}
            <div className="flex flex-col mb-3  relative z-1">
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold mb-2">Labels</span>
                <button
                  className="px-2 py-1 rounded text-white bg-secondary hover:bg-black"
                  onClick={() => setShowLabel((prev) => !prev)}
                >
                  Add Label
                </button>
              </div>

              {showLabel && (
                <LabelUpdate
                  setShowLabel={setShowLabel}
                  Cardlabels={card.labels}
                  CardRole={card.role}
                  boardId={modalProps.boardId}
                  cardId={modalProps._id}
                />
              )}

              {!showLabel && card.labels && card.labels.length > 0 ? (
                <div className="mb-3">
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    {card.labels.map((label: any) => {
                      return (
                        <div key={label._id} style={{background: label.color}} className="px-3 py-2 rounded">
                          {label.name && label.name.length > 30
                            ? label.name.slice(0, 30) + "..."
                            : label.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="w-full text-center bg-slate-100 py-1 rounded">
                  <span className="opacity-80">No Label</span>
                </div>
              )}
            </div>

            {/* comments */}
            <div className="comments">
              <div className="commentHeader my-2">
                <h3 className="font-semibold text-lg">Comments</h3>
              </div>

              <div className="commentBody flex flex-col">
                {["ADMIN", "NORMAL"].includes(card.role) && <AddComment cardId={modalProps._id} />}

                <div>
                  {card.comments && card.comments.length > 0 && (
                      <>
                      {card.comments.map((comment:any) => {
                        return (
                        <Comment 
                        key={comment._id}
                         cardId={modalProps._id}
                          comment={comment}
                           myRole={card.role}
                            boardId={modalProps.boardId}
                             />
                          )  
                      })}
                    </>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardDetailModal;
