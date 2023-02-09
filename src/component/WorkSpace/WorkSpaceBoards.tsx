import { createNextState } from "@reduxjs/toolkit";
import React from "react";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axiosInstance from "../../http";
import { Board } from "../../types/component.types";
import Loader from "../Loader/loader";
import { RecentBoard } from "../RecentlyViewed/recentBoard";
import { showModal } from "../../redux/features/modalslice";
import { HiOutlinePlus } from "react-icons/hi";

function WorkSpaceBoards() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  if (!id) {
    return <div></div>;
  }

  const getWorkSpaceBoards = async ({ queryKey }: any) => {
    const response = await axiosInstance.get(
      `/workspace/${queryKey[1]}/boards`
    );
    const data = response.data;
    console.log(data.boards);
    return data.boards;
  };

  const { isLoading, data, error } = useQuery<Board[], any>(
    ["getWorkSpaceBoards", id],
    getWorkSpaceBoards
  );

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h1>Oops! Something went wrong.</h1>
      </div>
    );
  }

  return (
    <div className="px-6 py-3">
      <h1 className="items-center font-semibold text-xl">Boards</h1>

      {data && data.length > 0 ? (
        <div className="mt-6 flex items-center justify-start gap-x-4 gap-y-4 flex-wrap">
          <button
            onClick={() => {
              dispatch(
                showModal({
                  modalType: "CREATE_BOARD_MODAL",
                  modalProps: { workspaceId: id },
                })
              );
            }}
            className="flex items-center justify-center hover:opacity-60 rounded"
            style={{
              width: 200,
              maxWidth: 300,
              height: 120,
              backgroundColor: "#F5F6F8",
            }}
          >
            <h3>Create a Board</h3>
          </button>

          {data.map((board) => {
            return <RecentBoard key={board._id} board={board} />;
          })}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mt-3">
          <h1 className="text-xl font-semibold mb-2">No boards found</h1>
          <button
            className="hover:bg-primary_dark px-4 py-2 rounded bg-secondary text-white"
            onClick={() => {
              dispatch(
                showModal({
                  modalType: "CREATE_BOARD_MODAL",
                  modalProps: { workspaceId: id },
                })
              );
            }}
          >
            Add a Board
          </button>
        </div>
      )}
    </div>
  );
}

export default WorkSpaceBoards;
