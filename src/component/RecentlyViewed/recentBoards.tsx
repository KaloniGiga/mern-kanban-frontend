import React from "react";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import axiosInstance from "../../http";
import { BoardObj } from "../../types/component.types";
import Loader from "../Loader/loader";
import { Board } from "../../types/component.types";
import RecentBoard from "./recentBoard";

const recentBoards = () => {
  const queryClient = useQueryClient();

  const getRecentBoards = async () => {
    const response = await axiosInstance.get("/recentboard");

    const recentBoards = response.data.boards;
    console.log(recentBoards);
    return recentBoards;
  };

  const {
    isLoading,
    data: recentBoards,
    error,
  } = useQuery<Board[], any>(["getRecentBoards"], getRecentBoards);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Oops! something went wrong...</h1>
        <button className="">Retry</button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col my-2">
      {recentBoards && recentBoards.length > 0 && (
        <>
          <h1 className="mb-2 text-xl font-semibold">Recent Boards</h1>
          <div className="flex ">
            {recentBoards?.map((board) => (
              <RecentBoard key={board._id} board={board} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default recentBoards;
