import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Avatar from "../Avatar/Avatar";
import { RootState } from "../../redux/app/store";
import axiosInstance from "../../http";

interface Props {
   cardId: string
}


function AddComment({cardId}:Props) {

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { user } = useSelector((state: RootState) => state.auth);

  const [comment, setComment] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axiosInstance.post(`card/${cardId}/comment`, {comment: comment})
    .then((response) => {
        const data = response.data.comment;
        console.log(data);
         setComment("");

         queryClient.setQueryData(["getCard", cardId], (oldData:any) => {
               return {
                 ...oldData,
                 comments: [...oldData.comments, data]
               }
         })

    }).catch((error) => {


    })

  }

  return (
    <form className="flex px-2" onSubmit={(e) => handleSubmit(e)}>
      <Avatar
        src={user?.avatar}
        alt={`Avatar of ${user?.username}`}
        size={30}
      />

      <div className="w-full flex">
        <input
          type="text"
          placeholder="Add a comment"
          name="comment"
          onChange={handleInputChange}
          className="px-2 py-1 w-full rounded outline-none shadow ml-2 "
        />

        <button
          disabled={comment === ""}
          className="px-2 py-1 ml-2 rounded btn-secondary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </form>
  );
}

export default AddComment;
