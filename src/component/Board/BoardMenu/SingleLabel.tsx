import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useQueryClient } from "react-query";
import axiosInstance from "../../../http";

interface LabelProps {
  labelId: string;
  name: string;
  color: string;
  boardId?: string;
}

function SingleLabel({ name, color, boardId, labelId }: LabelProps) {
  const queryClient = useQueryClient();

  const [isHovered, setIsHovered] = useState(false);

  const deleteLabel = (labelId: string) => {
    axiosInstance
      .delete(`/board/${boardId}/labels`, { data: { labelId } })
      .then((response) => {
        console.log(response.data.message);

        queryClient.invalidateQueries(["getAllLables", boardId]);
      })
      .catch((error) => {});
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={` flex flex-col px-3 py-2 relative rounded`}
      style={{
        background: color,
      }}
    >
      {isHovered && (
        <button
          className="absolute top-0 right-0 hover:opacity-60 bg-slate-100 rounded-full"
          onClick={() => deleteLabel(labelId)}
        >
          <AiOutlineClose size={15} />
        </button>
      )}

      <span>{name}</span>
    </div>
  );
}

export default SingleLabel;
