import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "../../../redux/app/store";
import { MemberObj } from "../../../types/component.types";
import Avatar from "../../Avatar/Avatar";
import { showModal } from "../../../redux/features/modalslice";

interface Props {
  boardId?: string;
  workspaceId?: string;
  myRole?: string;
  boardAdmins: MemberObj[];
  member: MemberObj;
}

function BoardMember({
  member,
  boardId,
  workspaceId,
  myRole,
  boardAdmins,
}: Props) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [showOption, setShowOption] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isBoardAdmin = boardAdmins?.find(
    (boardAdmin) => boardAdmin._id === member?._id
  )
    ? true
    : false;

  const isHeOnlyBoardAdmin = isBoardAdmin && boardAdmins?.length === 1;

  const removeMember = () => {};

  return (
    <>
      <div
        className="relative "
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && ["ADMIN"].includes(myRole!) && (
          <div className="absolute top-0 right-0">
            <button onClick={() => removeMember()}>
              <AiOutlineClose
                size={15}
                className="font-semibold hover:opacity-60"
              />
            </button>
          </div>
        )}

        <button
          onClick={() =>
            dispatch(
              showModal({
                modalType: "BOARD_MEMBER_UPDATE_MODAL",
                modalProps: {
                  member: member,
                  myRole: myRole,
                  boardId: boardId,
                  workspaceId: workspaceId,
                  isOnlyAdmin: isHeOnlyBoardAdmin,
                },
              })
            )
          }
          className="hover:opacity-60 mt-2 mr-2"
        >
          <Avatar src={member.avatar} size={30} />
        </button>
      </div>
    </>
  );
}

export default BoardMember;
