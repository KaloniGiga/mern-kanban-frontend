import { AxiosError } from "axios";
import React, { useState } from "react";
import { HiOutlineUser, HiOutlineX } from "react-icons/hi";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import axiosInstance from "../../http";
import { BoardMemberObj, MemberObj } from "../../types/component.types";
import { useQuery } from "react-query";
import SingleCardMember from "./SingleCardMember";

interface Props {
  CardMembers?: MemberObj[];
  cardId: string;
  listId: string;
  boardId: string;
  workspaceId: string;
  setShowMembers: React.Dispatch<React.SetStateAction<boolean>>;
}

function CardMembersUpdate({
  setShowMembers,
  CardMembers,
  cardId,
  listId,
  boardId,
  workspaceId,
}: Props) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const addCardMember = (memberId: string) => {
    axiosInstance
      .put(`/card/${cardId}/members`, { memberId: memberId })
      .then((response) => {

        const data = response.data;
        console.log(data.newAddedMember);
        setShowMembers(false);
        queryClient.invalidateQueries(["getAllMyCards"]);

          queryClient.setQueryData(["getCard", cardId], (oldData:any) => {
                    return {
                      ...oldData,
                      members: [...oldData.members, data.newAddedMember]
                    }
          })
        

      })
      .catch((error: AxiosError) => {
        if (error.response) {
          const message = error.response.data;
          console.log(message);
        } else if (error.request) {
          console.log("Oops! something went wrong!");
        } else {
          console.log(error);
        }
      });
  };

  const removeCardMember = (memberId: string) => {
    axiosInstance
      .delete(`/card/${cardId}/members`, {
        data: {
          memberId: memberId,
        },
      })
      .then((response) => {
        setShowMembers(false);

        queryClient.invalidateQueries(["getAllMyCards"]);

        queryClient.setQueryData(["getCard", cardId], (oldValue: any) => {
          return {
            ...oldValue,
            members: oldValue.members.filter(
              (member: any) => member._id !== memberId
            ),
          };
        });

        queryClient.invalidateQueries(["getLists", boardId]);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log("Oops! Something went wrong.");
        } else {
          console.log(error.message);
        }
      });
  };

  const getAllMembers = async ({ queryKey }: any) => {
    const response = await axiosInstance.get(`/card/${queryKey[1]}/members`);
    const data = response.data;
    console.log(data);
    return data.AllMembers;
  };

  const {
    isLoading,
    data: AllMembers,
    error,
  } = useQuery(["getAllMembers", cardId], getAllMembers);

  return (
    <div className="rounded  absolute top-8 left-0 z-10  w-full bg-white shadow-lg p-2">
      <div>
        <div className="flex items-center justify-between px-2 py-1 ">
          <span className="font-semibold text-lg">Members</span>
          <button onClick={() => setShowMembers(false)}>
            <HiOutlineX size={20} />
          </button>
        </div>

        <div className="px-2">
          {AllMembers && AllMembers.length > 0 ? (
            AllMembers.map((member: any) => (
              <div key={member._id}>
                <SingleCardMember
                  member={member}
                  CardMembers={CardMembers}
                  removeCardMember={removeCardMember}
                  addCardMember={addCardMember}
                />
              </div>
            ))
          ) : (
            <div>There are no members to add.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardMembersUpdate;
