import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { HiOutlinePlus } from "react-icons/hi";
import { BoardMemberObj, MemberObj, MyCardMemberObj } from "../../types/component.types";
import Avatar from "../Avatar/Avatar";

export interface Props {
  member: MemberObj;
  CardMembers?: MemberObj[];
  addCardMember: Function;
  removeCardMember: Function;
}

function SingleCardMember({
  member,
  CardMembers,
  addCardMember,
  removeCardMember,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Avatar src={member.avatar} size={30} />
        <span className="ml-3 font-lg">{member.username}</span>
      </div>

      <div>
        {!CardMembers?.map((cardMember: any) => cardMember._id).includes(
          member._id
        ) ? (
          <button onClick={() => addCardMember(member._id)}>
            <HiOutlinePlus size={20} />
          </button>
        ) : (
          <button onClick={() => removeCardMember(member._id)}>
            <AiOutlineDelete size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export default SingleCardMember;
