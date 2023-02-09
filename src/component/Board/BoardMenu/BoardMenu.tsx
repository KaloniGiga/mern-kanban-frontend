import React, { useEffect, useState } from "react";
import {
  AiOutlineClose,
  AiOutlinePaperClip,
  AiOutlinePlus,
} from "react-icons/ai";
import { CgChevronDown, CgChevronRight } from "react-icons/cg";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../http";
import { showModal } from "../../../redux/features/modalslice";
import { LabelObj, MemberObj } from "../../../types/component.types";
import BoardMembers from "../BoardMembers/BoardMembers";
import SingleLabel from "./SingleLabel";

interface BoardMenuProps {
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  boardId?: string;
  workspaceId?: string;
  myRole?: string;
}

const BoardMenu = ({
  setShowMenu,
  boardId,
  workspaceId,
  myRole,
}: BoardMenuProps) => {
  const [showOption, setShowOption] = useState<Number | null>(null);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const getAllLabels = async ({ queryKey }: any) => {
    const response = await axiosInstance.get(`/board/${queryKey[1]}/labels`);
    const data = response.data.labels;
    console.log(data);
    return data;
  };

  const getAllBoardMembers = async ({ queryKey }: any) => {
    const response = await axiosInstance.get(`/board/${queryKey[1]}/members`);
    const data = response.data.AllMembers;
    return data;
  };

  const {
    isLoading,
    data: members,
    error,
  } = useQuery<MemberObj[], any>(
    ["getAllBoardMembers", boardId],
    getAllBoardMembers
  );
  const { data: labels } = useQuery<LabelObj[], any>(
    ["getAllLabels", boardId],
    getAllLabels
  );
  return (
    <div className="w-80 relative z-10 shadow-xl h-88 overflow-y-auto">
      <button
        className="absolute top-0 left-0 cursor-pointer p-2 hover:opacity-50"
        onClick={() => setShowMenu(false)}
      >
        <AiOutlineClose size={30} />
      </button>

      <div className="mt-16 px-2">
        {/* Board Members*/}

        <div className="members mb-4">
          <div className="flex w-full items-center justify-between">
            <button
              className="labelsHeader w-full flex items-center cursor-pointer hover:opacity-50"
              onClick={() => {
                setShowOption((prev: any) => (prev === 0 ? null : 0));
              }}
            >
              {showOption === 0 ? (
                <CgChevronDown size={20} />
              ) : (
                <CgChevronRight size={20} />
              )}
              <h3 className="font-semibold ml-2 text-lg">Board Members</h3>
            </button>

            <button
              className="hover:opacity-60"
              onClick={() =>
                dispatch(
                  showModal({
                    modalType: "INVITE_BOARD_MEMBER_MODAL",
                    modalProps: { boardId: boardId },
                  })
                )
              }
            >
              <AiOutlinePlus size={20} />
            </button>
          </div>

          {showOption === 0 && (
            <>
              {members && members.length > 0 ? (
                <BoardMembers
                  boardId={boardId}
                  workspaceId={workspaceId}
                  members={members}
                  role={myRole}
                />
              ) : (
                <div className="p-2 bg-slate-200 rounded mt-2">
                  <h2 className="font-semibold text-center text-primary ">
                    No Members
                  </h2>
                </div>
              )}
            </>
          )}
        </div>

        {/* Labels */}
        <div className="labels mt-2 mb-2">
          <div className="flex w-full items-center justify-between">
            <button
              className="labelsHeader w-full flex items-center cursor-pointer hover:opacity-50"
              onClick={() => {
                setShowOption((prev: any) => (prev === 1 ? null : 1));
              }}
            >
              {showOption === 1 ? (
                <CgChevronDown size={20} />
              ) : (
                <CgChevronRight size={20} />
              )}
              <h3 className="font-semibold ml-2 text-lg">Labels</h3>
            </button>

            <button
              className="hover:opacity-60"
              onClick={() =>
                dispatch(
                  showModal({
                    modalType: "BOARD_LABEL_MODAL",
                    modalProps: { boardId: boardId },
                  })
                )
              }
            >
              <AiOutlinePlus size={20} />
            </button>
          </div>

          {showOption === 1 && (
            <>
              {labels && labels.length > 0 ? (
                <div className="labelsBody w-full flex gap-2">
                  {labels?.map((label: any) => (
                    <SingleLabel
                      key={label.name}
                      name={label.name}
                      color={label.color}
                      boardId={boardId}
                      labelId={label._id}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-slate-200 my-2 text-center">
                  <span className="w-full font-semibold  p-2">No Labels</span>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default BoardMenu;
