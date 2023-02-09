import React, { useState } from "react";
import { CardObj, MyCardObj } from "../../types/component.types";
import { NavLink } from "react-router-dom";
import { HiOutlineLockClosed } from "react-icons/hi";
import { HiOutlineLockOpen } from "react-icons/hi";
import { HiOutlineStar } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { FcExpired } from "react-icons/fc";
import { CgTimer } from "react-icons/cg";

export interface myTaskProps {
  card: MyCardObj;
}

function MyTask({ card }: myTaskProps) {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  return (
    <NavLink
      to={`/board/${card.boardId}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "block",
        width: 200,
        maxWidth: 300,
        height: 150,
        background: card.coverImage ? `url(${card.coverImage})` : card.color,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        boxShadow: `1px 1px 12px rgba(0, 0, 0, 0.5)`,
      }}
      className="relative h-30 rounded cursor-pointer font-semibold m-2"
    >
      <div className="absolute top-0 left-0 right-0 bottom-0 px-2 py-2 hover:text-primary">
        {card.name}
      </div>

      <span className="absolute right-2 top-2">
        {card.expireDate > new Date(Date.now()) ? <FcExpired /> : <CgTimer />}{" "}
      </span>

      <span className="absolute left-2 bottom-2">{card.comments}</span>
    </NavLink>
  );
}

export default MyTask;
