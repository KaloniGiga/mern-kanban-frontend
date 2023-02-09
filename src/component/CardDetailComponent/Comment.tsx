import { formatDistance } from "date-fns";
import { is } from "immer/dist/internal";
import React, { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axiosInstance from "../../http";
import { RootState } from "../../redux/app/store";
import { BOARD_ROLES, CommentObj } from "../../types/component.types";
import Avatar from "../Avatar/Avatar";

export interface Props {
  comment: CommentObj;
  myRole: string;
  cardId: string;
  boardId: string;
}

function Comment({ comment, myRole, cardId, boardId }: Props) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { user } = useSelector((state: RootState) => state.auth);

  const [comm, setComm] = useState(comment.comment);
  const [hovered, setHovered] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isdelete, setIsDelete] = useState(false);

  

  const updateComment = (
    newComment: string,
    commentId: string,
    cardId: string
  ) => {

     axiosInstance.put(`card/${cardId}/comment`, {comment: newComment, commentId: commentId})
     .then((response) => {
        setEdit(false);

        queryClient.setQueryData(["getCard", cardId], (oldData:any) => {
           
          return {
              ...oldData,
             comments: oldData.comments.map((comment:any) => {
                 if(comment._id.toString() === commentId.toString()) {
                    return {
                       ...comment,
                       comment: newComment
                    }
                 }else {
                    return comment  
                 }
            })
          }
        })
      
     })
     .catch((error) => {

     })
  };

  const deleteComment = (cardId: string, commentId: string) => {
     
      axiosInstance.delete(`card/${cardId}/comment`, {data: {commentId: commentId}})
      .then((response) => {
         
         queryClient.setQueryData(["getCard", cardId], (oldData:any) => {
               return {
                  ...oldData,
                  comments: oldData.comments.filter((comment:any) => comment._id.toString() !== commentId.toString() )
               }
         })
      }).catch((error) => {
          console.log(error.message);
      });
      
  };

  return (
    <div
      className="flex w-full mb-2 mt-2 bg-slate-200 p-1 rounded"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Avatar classes="w-8 h-8" src={comment.user.avatar} />

      <div className="w-full ml-2 flex flex-col">
        <div className="w-full text-sm mb-1 flex items-center justify-between">
          <div className="flex flex-col">
            <span>{comment.user.username}</span>
            <span>
              {comment.isUpdated
                ? `${formatDistance(new Date(`${comment.updatedAt}`), new Date(Date.now()), {addSuffix: true})}}-edited` 
                : formatDistance(new Date(`${comment.createdAt}`), new Date(Date.now()), {addSuffix: true})
                }
            </span>
          </div>

          {hovered &&
            user?._id.toString() === comment.user._id.toString() ? (
              <div>
                {!edit && (
                  <button onClick={() => setEdit(true)} className="mr-2">
                    <AiOutlineEdit size={20} />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setIsDelete(true);
                    setEdit(false);
                  }}
                >
                  <AiOutlineDelete size={20} />
                </button>
              </div>
            ) : (
              <>
              {hovered && ["ADMIN"].includes(myRole) && (
                <button onClick={() => setIsDelete(true)}>
                <AiOutlineDelete size={20} />
              </button>
              )}
              </>
              )}
        </div>

        {edit ? (
          <div className="flex flex-col w-full">
            <textarea
              autoFocus
              onChange={(e) => setComm(e.target.value)}
              value={comm}
              placeholder="Add a comment"
              className="w-full shadow outline-none rounded mb-2 p-2"
            ></textarea>

            <div className="flex items-center space-around">
              <button
                onClick={() => updateComment(comm, comment._id, cardId)}
                disabled={comm === ""}
                className=" px-2 py-2 text-white bg-secondary hover:bg-black disabled:opacity-60"
              >
                Save
              </button>
              <button
                className=" px-2 py-2 hover:bg-secondary bg-black text-white bg-secondary"
                onClick={(e) => {
                  setEdit(false);
                  setComm(comment.comment);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="shadow w-full p-2 mb-2">{comment.comment}</div>

            {isdelete && (
              <div className="rounded shadow flex flex-col items-center">
                <p className="text-sm font-semibold mb-2">
                  Are you sure, you want to delete this comment ?
                </p>

                <div className="flex jusitfy-around w-full py-1">
                  <button
                    className="px-2 py-1 rounded text-white bg-secondary hover:bg-black"
                    onClick={() => deleteComment(cardId, comment._id)}
                  >
                    Confirm
                  </button>

                  <button className="px-2 py-1 rounded text-white bg-black hover:bg-secondary"
                    onClick={() => setIsDelete(false) 

                    }
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Comment;
